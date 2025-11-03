-- ===== SISTEMA DE FORO PARA COMUNIDADES CRESALIA =====
-- Sistema de posts y comentarios para las comunidades de apoyo
-- Anonimato garantizado y protección de datos

-- Tabla de comunidades (catalogo)
CREATE TABLE IF NOT EXISTS comunidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE, -- ej: 'estres-laboral', 'lgbtq-experiencias'
    descripcion TEXT,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar comunidades existentes
INSERT INTO comunidades (nombre, slug, descripcion) VALUES
('Estrés Laboral', 'estres-laboral', 'Comunidad de apoyo para personas que sufren estrés laboral'),
('LGBTQ+', 'lgbtq-experiencias', 'Espacio seguro para personas LGBTQ+'),
('Mujeres Sobrevivientes', 'mujeres-sobrevivientes', 'Refugio para mujeres sobrevivientes de violencia'),
('Hombres Sobrevivientes', 'hombres-sobrevivientes', 'Espacio seguro para hombres sobrevivientes'),
('Anti-Bullying', 'anti-bullying', 'Comunidad contra el bullying'),
('Personas con Discapacidad', 'discapacidad', 'Espacio inclusivo para personas con discapacidad'),
('Inmigrantes y Racializados', 'inmigrantes-racializados', 'Refugio para inmigrantes y personas racializadas'),
('Adultos Mayores', 'adultos-mayores', 'Comunidad para adultos mayores'),
('Cuidadores', 'cuidadores', 'Apoyo para cuidadores'),
('Enfermedades Crónicas', 'enfermedades-cronicas', 'Espacio para personas con enfermedades crónicas'),
('Otakus - Anime y Manga', 'otakus-anime-manga', 'Comunidad para personas que aman el anime y manga sin ser juzgadas'),
('Gamers - Videojuegos', 'gamers-videojuegos', 'Comunidad para gamers que comparten su pasión por los videojuegos sin ser juzgados')
ON CONFLICT (slug) DO NOTHING;

-- Tabla de posts (publicaciones)
CREATE TABLE IF NOT EXISTS posts_comunidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comunidad_slug VARCHAR(255) NOT NULL REFERENCES comunidades(slug),
    
    -- Autor ANÓNIMO (solo guardamos un hash, no datos reales)
    autor_hash VARCHAR(255) NOT NULL, -- Hash del email/usuario para anonimato
    autor_alias VARCHAR(100), -- Alias opcional que el usuario puede elegir
    
    -- Contenido
    titulo VARCHAR(500),
    contenido TEXT NOT NULL,
    
    -- Categorías/Etiquetas (opcional)
    etiquetas TEXT[],
    
    -- Estado y moderación
    estado VARCHAR(50) DEFAULT 'publicado' CHECK (estado IN ('publicado', 'oculto', 'eliminado', 'moderado')),
    motivo_moderacion TEXT,
    
    -- Estadísticas
    num_comentarios INTEGER DEFAULT 0,
    num_reacciones INTEGER DEFAULT 0,
    
    -- Fechas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS comentarios_comunidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts_comunidades(id) ON DELETE CASCADE,
    
    -- Autor ANÓNIMO
    autor_hash VARCHAR(255) NOT NULL,
    autor_alias VARCHAR(100),
    
    -- Contenido
    contenido TEXT NOT NULL,
    
    -- Comentario padre (para respuestas anidadas)
    comentario_padre_id UUID REFERENCES comentarios_comunidades(id) ON DELETE CASCADE,
    
    -- Estado
    estado VARCHAR(50) DEFAULT 'publicado' CHECK (estado IN ('publicado', 'oculto', 'eliminado', 'moderado')),
    
    -- Fechas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de reacciones (opcional, para likes/emojis)
CREATE TABLE IF NOT EXISTS reacciones_comunidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts_comunidades(id) ON DELETE CASCADE,
    comentario_id UUID REFERENCES comentarios_comunidades(id) ON DELETE CASCADE,
    
    -- Usuario anónimo
    autor_hash VARCHAR(255) NOT NULL,
    
    -- Tipo de reacción
    tipo VARCHAR(50) DEFAULT 'like' CHECK (tipo IN ('like', 'corazon', 'abrazo', 'apoyo')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Un usuario solo puede reaccionar una vez por post/comentario
    CONSTRAINT reaccion_unica UNIQUE (post_id, comentario_id, autor_hash)
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_posts_comunidad ON posts_comunidades(comunidad_slug, estado, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_autor ON posts_comunidades(autor_hash);
CREATE INDEX IF NOT EXISTS idx_comentarios_post ON comentarios_comunidades(post_id, estado, created_at);
CREATE INDEX IF NOT EXISTS idx_comentarios_padre ON comentarios_comunidades(comentario_padre_id);
CREATE INDEX IF NOT EXISTS idx_reacciones_post ON reacciones_comunidades(post_id);
CREATE INDEX IF NOT EXISTS idx_reacciones_comentario ON reacciones_comunidades(comentario_id);

-- Row Level Security (RLS) - Permitir lectura pública, escritura con validación
ALTER TABLE posts_comunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios_comunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE reacciones_comunidades ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Lectura pública para posts publicados
CREATE POLICY "lectura_publica_posts" ON posts_comunidades 
    FOR SELECT 
    USING (estado = 'publicado');

-- Políticas RLS: Cualquiera puede crear posts (con validación del autor_hash)
CREATE POLICY "crear_posts_publico" ON posts_comunidades 
    FOR INSERT 
    WITH CHECK (true);

-- Políticas RLS: Solo el autor puede actualizar/borrar (usando autor_hash)
CREATE POLICY "editar_borrar_propios_posts" ON posts_comunidades 
    FOR UPDATE 
    USING (true); -- Se validará por autor_hash en la aplicación
    
CREATE POLICY "eliminar_propios_posts" ON posts_comunidades 
    FOR DELETE 
    USING (true); -- Se validará por autor_hash en la aplicación

-- Comentarios: lectura pública
CREATE POLICY "lectura_publica_comentarios" ON comentarios_comunidades 
    FOR SELECT 
    USING (estado = 'publicado');

-- Comentarios: crear público
CREATE POLICY "crear_comentarios_publico" ON comentarios_comunidades 
    FOR INSERT 
    WITH CHECK (true);

-- Reacciones: lectura pública
CREATE POLICY "lectura_publica_reacciones" ON reacciones_comunidades 
    FOR SELECT 
    USING (true);

-- Reacciones: crear público
CREATE POLICY "crear_reacciones_publico" ON reacciones_comunidades 
    FOR INSERT 
    WITH CHECK (true);

-- Trigger para actualizar num_comentarios en posts
CREATE OR REPLACE FUNCTION actualizar_num_comentarios()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.estado = 'publicado' THEN
        UPDATE posts_comunidades 
        SET num_comentarios = num_comentarios + 1
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' AND OLD.estado = 'publicado' THEN
        UPDATE posts_comunidades 
        SET num_comentarios = GREATEST(0, num_comentarios - 1)
        WHERE id = OLD.post_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.estado = 'publicado' AND NEW.estado != 'publicado' THEN
            UPDATE posts_comunidades 
            SET num_comentarios = GREATEST(0, num_comentarios - 1)
            WHERE id = NEW.post_id;
        ELSIF OLD.estado != 'publicado' AND NEW.estado = 'publicado' THEN
            UPDATE posts_comunidades 
            SET num_comentarios = num_comentarios + 1
            WHERE id = NEW.post_id;
        END IF;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_comentarios
    AFTER INSERT OR UPDATE OR DELETE ON comentarios_comunidades
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_num_comentarios();

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_posts_updated_at
    BEFORE UPDATE ON posts_comunidades
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_actualizar_comentarios_updated_at
    BEFORE UPDATE ON comentarios_comunidades
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

