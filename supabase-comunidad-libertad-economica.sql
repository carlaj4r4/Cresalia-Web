-- ===== COMUNIDAD LIBERTAD ECONÓMICA - CRESALIA =====
-- Base de datos para la comunidad de violencia económica
-- Sistema ESTRICTO: 2 warnings = bloqueo automático

-- ===== 1. TABLA DE PUBLICACIONES =====
CREATE TABLE IF NOT EXISTS economica_publicaciones (
    id BIGSERIAL PRIMARY KEY,
    
    -- Información de la publicación
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    autor VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    -- Categorización
    categoria VARCHAR(50) DEFAULT 'general', 
    -- general, identificar, planificar
    
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
CREATE INDEX IF NOT EXISTS idx_economica_pub_categoria ON economica_publicaciones(categoria);
CREATE INDEX IF NOT EXISTS idx_economica_pub_email ON economica_publicaciones(email);
CREATE INDEX IF NOT EXISTS idx_economica_pub_sensible ON economica_publicaciones(es_sensible);
CREATE INDEX IF NOT EXISTS idx_economica_pub_created ON economica_publicaciones(created_at DESC);

-- ===== 2. TABLA DE COMENTARIOS =====
CREATE TABLE IF NOT EXISTS economica_comentarios (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES economica_publicaciones(id) ON DELETE CASCADE,
    
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
CREATE INDEX IF NOT EXISTS idx_economica_com_pub ON economica_comentarios(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_economica_com_email ON economica_comentarios(email);

-- ===== 3. TABLA DE WARNINGS (Sistema ESTRICTO: 2 warnings) =====
CREATE TABLE IF NOT EXISTS economica_warnings (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES economica_publicaciones(id) ON DELETE CASCADE,
    
    -- Información del warning
    email_usuario VARCHAR(255) NOT NULL, -- Usuario que reporta
    motivo TEXT,
    count INTEGER DEFAULT 1, -- Contador de advertencias (máximo 2)
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_economica_warn_pub ON economica_warnings(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_economica_warn_email ON economica_warnings(email_usuario);

-- ===== 4. TABLA DE PUBLICACIONES OCULTAS/BLOQUEADAS =====
CREATE TABLE IF NOT EXISTS economica_ocultas (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES economica_publicaciones(id) ON DELETE CASCADE,
    email_usuario VARCHAR(255) NOT NULL,
    
    -- Tipo de acción
    tipo VARCHAR(20) NOT NULL, -- oculta, bloqueada
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_economica_ocult_pub ON economica_ocultas(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_economica_ocult_email ON economica_ocultas(email_usuario);
CREATE UNIQUE INDEX IF NOT EXISTS idx_economica_ocult_unique ON economica_ocultas(publicacion_id, email_usuario, tipo);

-- ===== 5. TABLA DE PREFERENCIAS DE CONTENIDO SENSIBLE =====
CREATE TABLE IF NOT EXISTS economica_preferencias (
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
CREATE INDEX IF NOT EXISTS idx_economica_pref_email ON economica_preferencias(email);

-- ===== ROW LEVEL SECURITY =====

-- Habilitar RLS
ALTER TABLE economica_publicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE economica_comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE economica_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE economica_ocultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE economica_preferencias ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos pueden leer publicaciones activas
DROP POLICY IF EXISTS "publicaciones_lectura_publica" ON economica_publicaciones;
CREATE POLICY "publicaciones_lectura_publica" ON economica_publicaciones
    FOR SELECT USING (estado = 'activa');

-- Políticas: Todos pueden crear publicaciones
DROP POLICY IF EXISTS "publicaciones_crear" ON economica_publicaciones;
CREATE POLICY "publicaciones_crear" ON economica_publicaciones
    FOR INSERT WITH CHECK (true);

-- Políticas: Solo el autor puede actualizar su publicación
DROP POLICY IF EXISTS "publicaciones_actualizar_propia" ON economica_publicaciones;
CREATE POLICY "publicaciones_actualizar_propia" ON economica_publicaciones
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Todos pueden leer comentarios activos
DROP POLICY IF EXISTS "comentarios_lectura_publica" ON economica_comentarios;
CREATE POLICY "comentarios_lectura_publica" ON economica_comentarios
    FOR SELECT USING (estado = 'activo');

-- Políticas: Todos pueden crear comentarios
DROP POLICY IF EXISTS "comentarios_crear" ON economica_comentarios;
CREATE POLICY "comentarios_crear" ON economica_comentarios
    FOR INSERT WITH CHECK (true);

-- Políticas: Todos pueden crear warnings
DROP POLICY IF EXISTS "warnings_crear" ON economica_warnings;
CREATE POLICY "warnings_crear" ON economica_warnings
    FOR INSERT WITH CHECK (true);

-- Políticas: Todos pueden leer sus propios warnings
DROP POLICY IF EXISTS "warnings_lectura_propia" ON economica_warnings;
CREATE POLICY "warnings_lectura_propia" ON economica_warnings
    FOR SELECT USING (email_usuario = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Todos pueden ocultar/bloquear publicaciones
DROP POLICY IF EXISTS "ocultas_crear" ON economica_ocultas;
CREATE POLICY "ocultas_crear" ON economica_ocultas
    FOR INSERT WITH CHECK (true);

-- Políticas: Solo el usuario puede ver sus propias acciones de ocultar/bloquear
DROP POLICY IF EXISTS "ocultas_lectura_propia" ON economica_ocultas;
CREATE POLICY "ocultas_lectura_propia" ON economica_ocultas
    FOR SELECT USING (email_usuario = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Solo el usuario puede ver sus propias preferencias
DROP POLICY IF EXISTS "preferencias_lectura_propia" ON economica_preferencias;
CREATE POLICY "preferencias_lectura_propia" ON economica_preferencias
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Solo el usuario puede crear/actualizar sus propias preferencias
DROP POLICY IF EXISTS "preferencias_crear_propia" ON economica_preferencias;
CREATE POLICY "preferencias_crear_propia" ON economica_preferencias
    FOR INSERT WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "preferencias_actualizar_propia" ON economica_preferencias;
CREATE POLICY "preferencias_actualizar_propia" ON economica_preferencias
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- ===== FUNCIONES =====

-- Función para actualizar contador de comentarios
CREATE OR REPLACE FUNCTION actualizar_contador_comentarios_economica()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE economica_publicaciones 
        SET comentarios = comentarios + 1,
            updated_at = NOW()
        WHERE id = NEW.publicacion_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE economica_publicaciones 
        SET comentarios = comentarios - 1,
            updated_at = NOW()
        WHERE id = OLD.publicacion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar contador de comentarios
DROP TRIGGER IF EXISTS trigger_actualizar_comentarios_economica ON economica_comentarios;
CREATE TRIGGER trigger_actualizar_comentarios_economica
    AFTER INSERT OR DELETE ON economica_comentarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_contador_comentarios_economica();

-- Función para bloquear automáticamente después de 2 warnings (SISTEMA ESTRICTO)
CREATE OR REPLACE FUNCTION verificar_warnings_economica()
RETURNS TRIGGER AS $$
BEGIN
    -- Contar warnings totales para esta publicación
    IF (SELECT SUM(count) FROM economica_warnings WHERE publicacion_id = NEW.publicacion_id) >= 2 THEN
        -- Actualizar estado de la publicación a bloqueada
        UPDATE economica_publicaciones 
        SET estado = 'bloqueada',
            updated_at = NOW()
        WHERE id = NEW.publicacion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar warnings (SISTEMA ESTRICTO: 2 warnings)
DROP TRIGGER IF EXISTS trigger_verificar_warnings_economica ON economica_warnings;
CREATE TRIGGER trigger_verificar_warnings_economica
    AFTER INSERT OR UPDATE ON economica_warnings
    FOR EACH ROW
    EXECUTE FUNCTION verificar_warnings_economica();

-- ===== COMENTARIOS =====
COMMENT ON TABLE economica_publicaciones IS 'Publicaciones del foro de Libertad Económica';
COMMENT ON TABLE economica_comentarios IS 'Comentarios en las publicaciones';
COMMENT ON TABLE economica_warnings IS 'Sistema de advertencias ESTRICTO (2 warnings = bloqueo automático)';
COMMENT ON TABLE economica_ocultas IS 'Publicaciones ocultas o bloqueadas por usuarios';
COMMENT ON TABLE economica_preferencias IS 'Preferencias de contenido sensible de cada usuario';



