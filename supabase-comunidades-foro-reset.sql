-- ============================================================
-- RESET COMPLETO DEL SISTEMA DE FOROS DE COMUNIDADES CRESALIA
-- Ejecutar este script solo si necesitás reconstruir TODAS las
-- tablas y políticas desde cero (por ejemplo, si las eliminaste).
-- ============================================================

BEGIN;

-- 1) Borrar tablas existentes (las políticas se eliminan en cascada)
DROP TABLE IF EXISTS cumpleanos_historial CASCADE;
DROP TABLE IF EXISTS mentor_metricas_resumen CASCADE;
DROP TABLE IF EXISTS mentor_sesiones CASCADE;
DROP TABLE IF EXISTS reacciones_comunidades CASCADE;
DROP TABLE IF EXISTS comentarios_comunidades CASCADE;
DROP TABLE IF EXISTS posts_comunidades CASCADE;
DROP TABLE IF EXISTS comunidades CASCADE;

-- 2) Volver a crear la tabla catálogo de comunidades
CREATE TABLE comunidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO comunidades (nombre, slug, descripcion) VALUES
('Estrés Laboral', 'estres-laboral', 'Comunidad de apoyo para personas que sufren estrés laboral'),
('LGBTQ+', 'lgbtq-experiencias', 'Espacio seguro para personas LGBTQ+'),
('Mujeres Sobrevivientes', 'mujeres-sobrevivientes', 'Refugio para mujeres sobrevivientes de violencia'),
('Duelo Perinatal y Fertilidad', 'duelo-perinatal', 'Acompañamiento para pérdidas gestacionales, neonatales y tratamientos de fertilidad'),
('Hombres Sobrevivientes', 'hombres-sobrevivientes', 'Espacio seguro para hombres sobrevivientes'),
('Anti-Bullying', 'anti-bullying', 'Comunidad contra el bullying'),
('Personas con Discapacidad', 'discapacidad', 'Espacio inclusivo para personas con discapacidad'),
('Inmigrantes y Racializados', 'inmigrantes-racializados', 'Refugio para inmigrantes y personas racializadas'),
('Adultos Mayores', 'adultos-mayores', 'Comunidad para adultos mayores'),
('Cuidadores', 'cuidadores', 'Apoyo para cuidadores'),
('Enfermedades Crónicas', 'enfermedades-cronicas', 'Espacio para personas con enfermedades crónicas'),
('Otakus - Anime y Manga', 'otakus-anime-manga', 'Comunidad para personas que aman el anime y manga sin ser juzgadas'),
('Gamers - Videojuegos', 'gamers-videojuegos', 'Comunidad para gamers que comparten su pasión por los videojuegos sin ser juzgados'),
('Madres y Padres Solteros/Viudos', 'madres-padres-solteros', 'Espacio seguro para quienes crían solos - por elección, viudez o cualquier circunstancia'),
('Médicos y Enfermeros/as', 'medicos-enfermeros', 'Refugio para profesionales de la salud que necesitan desahogo y apoyo emocional'),
('Bomberos', 'bomberos', 'Comunidad para bomberos voluntarios y profesionales que arriesgan sus vidas'),
('Veterinarios', 'veterinarios', 'Refugio para veterinarios que necesitan desahogo y apoyo emocional por eutanasias, burnout y experiencias difíciles')
ON CONFLICT (slug) DO NOTHING;

-- Mentorías
CREATE TABLE mentor_sesiones (
    id SERIAL PRIMARY KEY,
    tienda_slug VARCHAR(255) NOT NULL,
    mentor_email VARCHAR(255),
    mentor_nombre VARCHAR(255),
    alumno_email VARCHAR(255),
    alumno_nombre VARCHAR(255),
    tema VARCHAR(255),
    tipo VARCHAR(50),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duracion_minutos INTEGER,
    calificacion NUMERIC(3,2),
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mentor_sesiones_tienda ON mentor_sesiones(tienda_slug);
CREATE INDEX idx_mentor_sesiones_fecha ON mentor_sesiones(fecha);

CREATE TABLE mentor_metricas_resumen (
    tienda_slug TEXT PRIMARY KEY,
    sesiones INTEGER DEFAULT 0,
    horas_totales NUMERIC(10,2) DEFAULT 0,
    calificacion_promedio NUMERIC(5,2) DEFAULT 0,
    temas JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cumpleanos_historial (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT CHECK (tipo IN ('usuario', 'tenant')) NOT NULL,
    referencia_slug TEXT NOT NULL,
    fecha DATE NOT NULL,
    cupón_generado TEXT,
    beneficio TEXT,
    mensaje TEXT,
    enviado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cumpleanos_historial_tipo_fecha
    ON cumpleanos_historial(tipo, fecha DESC);

-- 3) Tabla de posts
CREATE TABLE posts_comunidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comunidad_slug VARCHAR(255) NOT NULL REFERENCES comunidades(slug),
    autor_hash VARCHAR(255) NOT NULL,
    autor_alias VARCHAR(100),
    titulo VARCHAR(500),
    contenido TEXT NOT NULL,
    etiquetas TEXT[],
    estado VARCHAR(50) DEFAULT 'publicado' CHECK (estado IN ('publicado', 'oculto', 'eliminado', 'moderado')),
    motivo_moderacion TEXT,
    num_comentarios INTEGER DEFAULT 0,
    num_reacciones INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 4) Tabla de comentarios
CREATE TABLE comentarios_comunidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts_comunidades(id) ON DELETE CASCADE,
    autor_hash VARCHAR(255) NOT NULL,
    autor_alias VARCHAR(100),
    contenido TEXT NOT NULL,
    comentario_padre_id UUID REFERENCES comentarios_comunidades(id) ON DELETE CASCADE,
    estado VARCHAR(50) DEFAULT 'publicado' CHECK (estado IN ('publicado', 'oculto', 'eliminado', 'moderado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 5) Tabla de reacciones (likes / abrazos / apoyo)
CREATE TABLE reacciones_comunidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts_comunidades(id) ON DELETE CASCADE,
    comentario_id UUID REFERENCES comentarios_comunidades(id) ON DELETE CASCADE,
    autor_hash VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) DEFAULT 'like' CHECK (tipo IN ('like', 'corazon', 'abrazo', 'apoyo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT reaccion_unica UNIQUE (post_id, comentario_id, autor_hash)
);

-- 6) Índices
CREATE INDEX idx_posts_comunidad ON posts_comunidades(comunidad_slug, estado, created_at DESC);
CREATE INDEX idx_posts_autor ON posts_comunidades(autor_hash);
CREATE INDEX idx_comentarios_post ON comentarios_comunidades(post_id, estado, created_at);
CREATE INDEX idx_comentarios_padre ON comentarios_comunidades(comentario_padre_id);
CREATE INDEX idx_reacciones_post ON reacciones_comunidades(post_id);
CREATE INDEX idx_reacciones_comentario ON reacciones_comunidades(comentario_id);

-- 7) Políticas RLS
ALTER TABLE posts_comunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios_comunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE reacciones_comunidades ENABLE ROW LEVEL SECURITY;

CREATE POLICY lectura_publica_posts ON posts_comunidades
    FOR SELECT USING (estado = 'publicado');

CREATE POLICY crear_posts_publico ON posts_comunidades
    FOR INSERT WITH CHECK (true);

CREATE POLICY editar_borrar_propios_posts ON posts_comunidades
    FOR UPDATE USING (true);

CREATE POLICY eliminar_propios_posts ON posts_comunidades
    FOR DELETE USING (true);

CREATE POLICY lectura_publica_comentarios ON comentarios_comunidades
    FOR SELECT USING (estado = 'publicado');

CREATE POLICY crear_comentarios_publico ON comentarios_comunidades
    FOR INSERT WITH CHECK (true);

CREATE POLICY lectura_publica_reacciones ON reacciones_comunidades
    FOR SELECT USING (true);

CREATE POLICY crear_reacciones_publico ON reacciones_comunidades
    FOR INSERT WITH CHECK (true);

-- 8) Funciones y triggers de mantenimiento
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
        IF OLD.estado = 'publicado' AND NEW.estado <> 'publicado' THEN
            UPDATE posts_comunidades
            SET num_comentarios = GREATEST(0, num_comentarios - 1)
            WHERE id = NEW.post_id;
        ELSIF OLD.estado <> 'publicado' AND NEW.estado = 'publicado' THEN
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

COMMIT;

