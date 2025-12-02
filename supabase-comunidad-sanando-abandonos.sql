-- ===== COMUNIDAD SANANDO ABANDONOS - CRESALIA =====
-- Base de datos para la comunidad de abandono y sanación
-- Sistema ESTRICTO: 2 warnings = bloqueo automático

-- ===== 1. TABLA DE PUBLICACIONES =====
CREATE TABLE IF NOT EXISTS abandonos_publicaciones (
    id BIGSERIAL PRIMARY KEY,
    
    -- Información de la publicación
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    autor VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    -- Categorización
    categoria VARCHAR(50) DEFAULT 'general', 
    -- general, fui-abandonado, abandone
    
    -- Contenido sensible
    es_sensible BOOLEAN DEFAULT false,
    
    -- Estadísticas
    comentarios INTEGER DEFAULT 0,
    vistas INTEGER DEFAULT 0,
    
    -- Estado
    estado VARCHAR(20) DEFAULT 'activa', -- activa, moderada, eliminada, bloqueada
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_abandonos_pub_categoria ON abandonos_publicaciones(categoria);
CREATE INDEX IF NOT EXISTS idx_abandonos_pub_email ON abandonos_publicaciones(email);
CREATE INDEX IF NOT EXISTS idx_abandonos_pub_sensible ON abandonos_publicaciones(es_sensible);
CREATE INDEX IF NOT EXISTS idx_abandonos_pub_created ON abandonos_publicaciones(created_at DESC);

-- ===== 2. TABLA DE COMENTARIOS =====
CREATE TABLE IF NOT EXISTS abandonos_comentarios (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES abandonos_publicaciones(id) ON DELETE CASCADE,
    
    -- Información del comentario
    contenido TEXT NOT NULL,
    autor VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    -- Estado
    estado VARCHAR(20) DEFAULT 'activo', -- activo, moderado, eliminado
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_abandonos_com_pub ON abandonos_comentarios(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_abandonos_com_email ON abandonos_comentarios(email);

-- ===== 3. TABLA DE WARNINGS (Sistema ESTRICTO: 2 warnings) =====
CREATE TABLE IF NOT EXISTS abandonos_warnings (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES abandonos_publicaciones(id) ON DELETE CASCADE,
    
    -- Información del warning
    email_usuario VARCHAR(255) NOT NULL, -- Usuario que reporta
    motivo TEXT,
    count INTEGER DEFAULT 1, -- Contador de advertencias (máximo 2)
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_abandonos_warn_pub ON abandonos_warnings(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_abandonos_warn_email ON abandonos_warnings(email_usuario);

-- ===== 4. TABLA DE PUBLICACIONES OCULTAS/BLOQUEADAS =====
CREATE TABLE IF NOT EXISTS abandonos_ocultas (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES abandonos_publicaciones(id) ON DELETE CASCADE,
    email_usuario VARCHAR(255) NOT NULL,
    
    -- Tipo de acción
    tipo VARCHAR(20) NOT NULL, -- oculta, bloqueada
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_abandonos_ocult_pub ON abandonos_ocultas(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_abandonos_ocult_email ON abandonos_ocultas(email_usuario);
CREATE UNIQUE INDEX IF NOT EXISTS idx_abandonos_ocult_unique ON abandonos_ocultas(publicacion_id, email_usuario, tipo);

-- ===== 5. TABLA DE PREFERENCIAS DE CONTENIDO SENSIBLE =====
CREATE TABLE IF NOT EXISTS abandonos_preferencias (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    
    -- Preferencias
    ver_contenido_sensible BOOLEAN DEFAULT false,
    ultima_aceptacion DATE,
    
    -- Notificaciones
    recibir_notificaciones BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_abandonos_pref_email ON abandonos_preferencias(email);

-- ===== ROW LEVEL SECURITY =====

-- Habilitar RLS
ALTER TABLE abandonos_publicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandonos_comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandonos_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandonos_ocultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandonos_preferencias ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos pueden leer publicaciones activas
DROP POLICY IF EXISTS "publicaciones_lectura_publica" ON abandonos_publicaciones;
CREATE POLICY "publicaciones_lectura_publica" ON abandonos_publicaciones
    FOR SELECT USING (estado = 'activa');

-- Políticas: Todos pueden crear publicaciones
DROP POLICY IF EXISTS "publicaciones_crear" ON abandonos_publicaciones;
CREATE POLICY "publicaciones_crear" ON abandonos_publicaciones
    FOR INSERT WITH CHECK (true);

-- Políticas: Solo el autor puede actualizar su publicación
DROP POLICY IF EXISTS "publicaciones_actualizar_propia" ON abandonos_publicaciones;
CREATE POLICY "publicaciones_actualizar_propia" ON abandonos_publicaciones
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Todos pueden leer comentarios activos
DROP POLICY IF EXISTS "comentarios_lectura_publica" ON abandonos_comentarios;
CREATE POLICY "comentarios_lectura_publica" ON abandonos_comentarios
    FOR SELECT USING (estado = 'activo');

-- Políticas: Todos pueden crear comentarios
DROP POLICY IF EXISTS "comentarios_crear" ON abandonos_comentarios;
CREATE POLICY "comentarios_crear" ON abandonos_comentarios
    FOR INSERT WITH CHECK (true);

-- Políticas: Todos pueden crear warnings
DROP POLICY IF EXISTS "warnings_crear" ON abandonos_warnings;
CREATE POLICY "warnings_crear" ON abandonos_warnings
    FOR INSERT WITH CHECK (true);

-- Políticas: Todos pueden leer sus propios warnings
DROP POLICY IF EXISTS "warnings_lectura_propia" ON abandonos_warnings;
CREATE POLICY "warnings_lectura_propia" ON abandonos_warnings
    FOR SELECT USING (email_usuario = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Todos pueden ocultar/bloquear publicaciones
DROP POLICY IF EXISTS "ocultas_crear" ON abandonos_ocultas;
CREATE POLICY "ocultas_crear" ON abandonos_ocultas
    FOR INSERT WITH CHECK (true);

-- Políticas: Solo el usuario puede ver sus propias acciones de ocultar/bloquear
DROP POLICY IF EXISTS "ocultas_lectura_propia" ON abandonos_ocultas;
CREATE POLICY "ocultas_lectura_propia" ON abandonos_ocultas
    FOR SELECT USING (email_usuario = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Solo el usuario puede ver sus propias preferencias
DROP POLICY IF EXISTS "preferencias_lectura_propia" ON abandonos_preferencias;
CREATE POLICY "preferencias_lectura_propia" ON abandonos_preferencias
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Solo el usuario puede crear/actualizar sus propias preferencias
DROP POLICY IF EXISTS "preferencias_crear_propia" ON abandonos_preferencias;
CREATE POLICY "preferencias_crear_propia" ON abandonos_preferencias
    FOR INSERT WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "preferencias_actualizar_propia" ON abandonos_preferencias;
CREATE POLICY "preferencias_actualizar_propia" ON abandonos_preferencias
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- ===== FUNCIONES =====

-- Función para actualizar contador de comentarios
CREATE OR REPLACE FUNCTION actualizar_contador_comentarios_abandonos()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE abandonos_publicaciones 
        SET comentarios = comentarios + 1,
            updated_at = NOW()
        WHERE id = NEW.publicacion_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE abandonos_publicaciones 
        SET comentarios = comentarios - 1,
            updated_at = NOW()
        WHERE id = OLD.publicacion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar contador de comentarios
DROP TRIGGER IF EXISTS trigger_actualizar_comentarios_abandonos ON abandonos_comentarios;
CREATE TRIGGER trigger_actualizar_comentarios_abandonos
    AFTER INSERT OR DELETE ON abandonos_comentarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_contador_comentarios_abandonos();

-- Función para bloquear automáticamente después de 2 warnings (SISTEMA ESTRICTO)
CREATE OR REPLACE FUNCTION verificar_warnings_abandonos()
RETURNS TRIGGER AS $$
BEGIN
    -- Contar warnings totales para esta publicación
    IF (SELECT SUM(count) FROM abandonos_warnings WHERE publicacion_id = NEW.publicacion_id) >= 2 THEN
        -- Actualizar estado de la publicación a bloqueada
        UPDATE abandonos_publicaciones 
        SET estado = 'bloqueada',
            updated_at = NOW()
        WHERE id = NEW.publicacion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar warnings (SISTEMA ESTRICTO: 2 warnings)
DROP TRIGGER IF EXISTS trigger_verificar_warnings_abandonos ON abandonos_warnings;
CREATE TRIGGER trigger_verificar_warnings_abandonos
    AFTER INSERT OR UPDATE ON abandonos_warnings
    FOR EACH ROW
    EXECUTE FUNCTION verificar_warnings_abandonos();

-- ===== COMENTARIOS =====
COMMENT ON TABLE abandonos_publicaciones IS 'Publicaciones del foro de Sanando Abandonos';
COMMENT ON TABLE abandonos_comentarios IS 'Comentarios en las publicaciones';
COMMENT ON TABLE abandonos_warnings IS 'Sistema de advertencias ESTRICTO (2 warnings = bloqueo automático)';
COMMENT ON TABLE abandonos_ocultas IS 'Publicaciones ocultas o bloqueadas por usuarios';
COMMENT ON TABLE abandonos_preferencias IS 'Preferencias de contenido sensible de cada usuario';



