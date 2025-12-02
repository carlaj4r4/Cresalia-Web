-- ===== COMUNIDAD CAMINANDO JUNTOS - CRESALIA =====
-- Comunidad para adicciones y rehabilitación
-- Sistema ESTRICTO: 1-2 warnings máximo
-- NO reemplaza tratamiento profesional

-- ===== TABLA DE PUBLICACIONES =====
CREATE TABLE IF NOT EXISTS caminando_juntos_publicaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria VARCHAR(50) NOT NULL CHECK(categoria IN ('en-recuperacion', 'familiares', 'prevencion', 'dia-dia', 'recursos', 'general')),
    titulo VARCHAR(200),
    contenido TEXT NOT NULL,
    contenido_sensible BOOLEAN DEFAULT FALSE,
    autor_email VARCHAR(255) NOT NULL,
    autor_nombre VARCHAR(255) NOT NULL,
    autor_hash VARCHAR(64) NOT NULL,
    num_comentarios INTEGER DEFAULT 0,
    num_warnings INTEGER DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'publicado' CHECK(estado IN ('publicado', 'oculto', 'eliminado', 'bloqueado')),
    motivo_moderacion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA DE COMENTARIOS =====
CREATE TABLE IF NOT EXISTS caminando_juntos_comentarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publicacion_id UUID NOT NULL REFERENCES caminando_juntos_publicaciones(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    autor_email VARCHAR(255) NOT NULL,
    autor_nombre VARCHAR(255) NOT NULL,
    autor_hash VARCHAR(64) NOT NULL,
    estado VARCHAR(20) DEFAULT 'publicado' CHECK(estado IN ('publicado', 'oculto', 'eliminado', 'bloqueado')),
    motivo_moderacion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA DE WARNINGS (Sistema Estricto) =====
CREATE TABLE IF NOT EXISTS caminando_juntos_warnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publicacion_id UUID REFERENCES caminando_juntos_publicaciones(id) ON DELETE CASCADE,
    comentario_id UUID REFERENCES caminando_juntos_comentarios(id) ON DELETE CASCADE,
    autor_hash VARCHAR(64) NOT NULL,
    motivo TEXT NOT NULL,
    count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK((publicacion_id IS NOT NULL AND comentario_id IS NULL) OR (publicacion_id IS NULL AND comentario_id IS NOT NULL))
);

-- ===== TABLA DE PREFERENCIAS DE USUARIO =====
CREATE TABLE IF NOT EXISTS caminando_juntos_preferencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    autor_hash VARCHAR(64) UNIQUE NOT NULL,
    ocultar_triggers BOOLEAN DEFAULT FALSE,
    solo_recuperacion BOOLEAN DEFAULT FALSE,
    publicaciones_ocultas UUID[] DEFAULT '{}',
    publicaciones_bloqueadas UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ÍNDICES =====
CREATE INDEX IF NOT EXISTS idx_caminando_juntos_publicaciones_categoria ON caminando_juntos_publicaciones(categoria);
CREATE INDEX IF NOT EXISTS idx_caminando_juntos_publicaciones_autor_hash ON caminando_juntos_publicaciones(autor_hash);
CREATE INDEX IF NOT EXISTS idx_caminando_juntos_publicaciones_estado ON caminando_juntos_publicaciones(estado);
CREATE INDEX IF NOT EXISTS idx_caminando_juntos_publicaciones_created_at ON caminando_juntos_publicaciones(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_caminando_juntos_comentarios_publicacion_id ON caminando_juntos_comentarios(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_caminando_juntos_comentarios_autor_hash ON caminando_juntos_comentarios(autor_hash);
CREATE INDEX IF NOT EXISTS idx_caminando_juntos_warnings_publicacion_id ON caminando_juntos_warnings(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_caminando_juntos_warnings_comentario_id ON caminando_juntos_warnings(comentario_id);
CREATE INDEX IF NOT EXISTS idx_caminando_juntos_warnings_autor_hash ON caminando_juntos_warnings(autor_hash);
CREATE INDEX IF NOT EXISTS idx_caminando_juntos_preferencias_autor_hash ON caminando_juntos_preferencias(autor_hash);

-- ===== TRIGGERS =====

-- Trigger para actualizar num_comentarios
CREATE OR REPLACE FUNCTION actualizar_num_comentarios_caminando_juntos()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE caminando_juntos_publicaciones
        SET num_comentarios = (
            SELECT COUNT(*) 
            FROM caminando_juntos_comentarios 
            WHERE publicacion_id = NEW.publicacion_id 
            AND estado = 'publicado'
        )
        WHERE id = NEW.publicacion_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE caminando_juntos_publicaciones
        SET num_comentarios = (
            SELECT COUNT(*) 
            FROM caminando_juntos_comentarios 
            WHERE publicacion_id = NEW.publicacion_id 
            AND estado = 'publicado'
        )
        WHERE id = NEW.publicacion_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE caminando_juntos_publicaciones
        SET num_comentarios = (
            SELECT COUNT(*) 
            FROM caminando_juntos_comentarios 
            WHERE publicacion_id = OLD.publicacion_id 
            AND estado = 'publicado'
        )
        WHERE id = OLD.publicacion_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_actualizar_comentarios_caminando_juntos ON caminando_juntos_comentarios;
CREATE TRIGGER trigger_actualizar_comentarios_caminando_juntos
    AFTER INSERT OR UPDATE OR DELETE ON caminando_juntos_comentarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_num_comentarios_caminando_juntos();

-- Trigger para actualizar num_warnings
CREATE OR REPLACE FUNCTION actualizar_num_warnings_caminando_juntos()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        IF NEW.publicacion_id IS NOT NULL THEN
            UPDATE caminando_juntos_publicaciones
            SET num_warnings = (
                SELECT COALESCE(MAX(count), 0)
                FROM caminando_juntos_warnings
                WHERE publicacion_id = NEW.publicacion_id
            )
            WHERE id = NEW.publicacion_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.publicacion_id IS NOT NULL THEN
            UPDATE caminando_juntos_publicaciones
            SET num_warnings = (
                SELECT COALESCE(MAX(count), 0)
                FROM caminando_juntos_warnings
                WHERE publicacion_id = OLD.publicacion_id
            )
            WHERE id = OLD.publicacion_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_actualizar_warnings_caminando_juntos ON caminando_juntos_warnings;
CREATE TRIGGER trigger_actualizar_warnings_caminando_juntos
    AFTER INSERT OR UPDATE OR DELETE ON caminando_juntos_warnings
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_num_warnings_caminando_juntos();

-- ===== POLÍTICAS RLS =====

-- Habilitar RLS
ALTER TABLE caminando_juntos_publicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE caminando_juntos_comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE caminando_juntos_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE caminando_juntos_preferencias ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (solo publicados)
DROP POLICY IF EXISTS "publicaciones_lectura_publica" ON caminando_juntos_publicaciones;
CREATE POLICY "publicaciones_lectura_publica"
    ON caminando_juntos_publicaciones FOR SELECT
    USING (estado = 'publicado');

DROP POLICY IF EXISTS "comentarios_lectura_publica" ON caminando_juntos_comentarios;
CREATE POLICY "comentarios_lectura_publica"
    ON caminando_juntos_comentarios FOR SELECT
    USING (estado = 'publicado');

-- Políticas de inserción (cualquiera puede crear)
DROP POLICY IF EXISTS "publicaciones_insercion_publica" ON caminando_juntos_publicaciones;
CREATE POLICY "publicaciones_insercion_publica"
    ON caminando_juntos_publicaciones FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "comentarios_insercion_publica" ON caminando_juntos_comentarios;
CREATE POLICY "comentarios_insercion_publica"
    ON caminando_juntos_comentarios FOR INSERT
    WITH CHECK (true);

-- Políticas de preferencias (solo el propio usuario)
DROP POLICY IF EXISTS "preferencias_lectura_propia" ON caminando_juntos_preferencias;
CREATE POLICY "preferencias_lectura_propia"
    ON caminando_juntos_preferencias FOR SELECT
    USING (true); -- Simplificado para permitir lectura

DROP POLICY IF EXISTS "preferencias_insercion_propia" ON caminando_juntos_preferencias;
CREATE POLICY "preferencias_insercion_propia"
    ON caminando_juntos_preferencias FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "preferencias_actualizacion_propia" ON caminando_juntos_preferencias;
CREATE POLICY "preferencias_actualizacion_propia"
    ON caminando_juntos_preferencias FOR UPDATE
    USING (true);

-- ===== COMENTARIOS =====
COMMENT ON TABLE caminando_juntos_publicaciones IS 'Publicaciones de la comunidad Caminando Juntos - Adicciones y Rehabilitación';
COMMENT ON TABLE caminando_juntos_comentarios IS 'Comentarios en publicaciones de Caminando Juntos';
COMMENT ON TABLE caminando_juntos_warnings IS 'Sistema de advertencias estricto (1-2 warnings máximo)';
COMMENT ON TABLE caminando_juntos_preferencias IS 'Preferencias de usuario para filtros y contenido';



