-- ===== COMUNIDAD LIBERTAD EMOCIONAL - CRESALIA =====
-- Base de datos para la comunidad de rompimientos y dependencia emocional

-- ===== 1. TABLA DE PUBLICACIONES =====
CREATE TABLE IF NOT EXISTS libertad_publicaciones (
    id BIGSERIAL PRIMARY KEY,
    
    -- Información de la publicación
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    autor VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    -- Categorización
    categoria VARCHAR(50) DEFAULT 'general', 
    -- general, rompimientos, dependencia
    
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
CREATE INDEX IF NOT EXISTS idx_libertad_pub_categoria ON libertad_publicaciones(categoria);
CREATE INDEX IF NOT EXISTS idx_libertad_pub_email ON libertad_publicaciones(email);
CREATE INDEX IF NOT EXISTS idx_libertad_pub_sensible ON libertad_publicaciones(es_sensible);
CREATE INDEX IF NOT EXISTS idx_libertad_pub_created ON libertad_publicaciones(created_at DESC);

-- ===== 2. TABLA DE COMENTARIOS =====
CREATE TABLE IF NOT EXISTS libertad_comentarios (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES libertad_publicaciones(id) ON DELETE CASCADE,
    
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
CREATE INDEX IF NOT EXISTS idx_libertad_com_pub ON libertad_comentarios(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_libertad_com_email ON libertad_comentarios(email);

-- ===== 3. TABLA DE WARNINGS (Sistema de 3 advertencias) =====
CREATE TABLE IF NOT EXISTS libertad_warnings (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES libertad_publicaciones(id) ON DELETE CASCADE,
    
    -- Información del warning
    email_usuario VARCHAR(255) NOT NULL, -- Usuario que reporta
    motivo TEXT,
    count INTEGER DEFAULT 1, -- Contador de advertencias (máximo 3)
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_libertad_warn_pub ON libertad_warnings(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_libertad_warn_email ON libertad_warnings(email_usuario);

-- ===== 4. TABLA DE PUBLICACIONES OCULTAS/BLOQUEADAS =====
CREATE TABLE IF NOT EXISTS libertad_ocultas (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES libertad_publicaciones(id) ON DELETE CASCADE,
    email_usuario VARCHAR(255) NOT NULL,
    
    -- Tipo de acción
    tipo VARCHAR(20) NOT NULL, -- oculta, bloqueada
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_libertad_ocult_pub ON libertad_ocultas(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_libertad_ocult_email ON libertad_ocultas(email_usuario);
CREATE UNIQUE INDEX IF NOT EXISTS idx_libertad_ocult_unique ON libertad_ocultas(publicacion_id, email_usuario, tipo);

-- ===== 5. TABLA DE PREFERENCIAS DE CONTENIDO SENSIBLE =====
CREATE TABLE IF NOT EXISTS libertad_preferencias (
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
CREATE INDEX IF NOT EXISTS idx_libertad_pref_email ON libertad_preferencias(email);

-- ===== ROW LEVEL SECURITY =====

-- Habilitar RLS
ALTER TABLE libertad_publicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE libertad_comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE libertad_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE libertad_ocultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE libertad_preferencias ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos pueden leer publicaciones activas
DROP POLICY IF EXISTS "publicaciones_lectura_publica" ON libertad_publicaciones;
CREATE POLICY "publicaciones_lectura_publica" ON libertad_publicaciones
    FOR SELECT USING (estado = 'activa');

-- Políticas: Todos pueden crear publicaciones
DROP POLICY IF EXISTS "publicaciones_crear" ON libertad_publicaciones;
CREATE POLICY "publicaciones_crear" ON libertad_publicaciones
    FOR INSERT WITH CHECK (true);

-- Políticas: Solo el autor puede actualizar su publicación
DROP POLICY IF EXISTS "publicaciones_actualizar_propia" ON libertad_publicaciones;
CREATE POLICY "publicaciones_actualizar_propia" ON libertad_publicaciones
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Todos pueden leer comentarios activos
DROP POLICY IF EXISTS "comentarios_lectura_publica" ON libertad_comentarios;
CREATE POLICY "comentarios_lectura_publica" ON libertad_comentarios
    FOR SELECT USING (estado = 'activo');

-- Políticas: Todos pueden crear comentarios
DROP POLICY IF EXISTS "comentarios_crear" ON libertad_comentarios;
CREATE POLICY "comentarios_crear" ON libertad_comentarios
    FOR INSERT WITH CHECK (true);

-- Políticas: Todos pueden crear warnings
DROP POLICY IF EXISTS "warnings_crear" ON libertad_warnings;
CREATE POLICY "warnings_crear" ON libertad_warnings
    FOR INSERT WITH CHECK (true);

-- Políticas: Todos pueden leer sus propios warnings
DROP POLICY IF EXISTS "warnings_lectura_propia" ON libertad_warnings;
CREATE POLICY "warnings_lectura_propia" ON libertad_warnings
    FOR SELECT USING (email_usuario = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Todos pueden ocultar/bloquear publicaciones
DROP POLICY IF EXISTS "ocultas_crear" ON libertad_ocultas;
CREATE POLICY "ocultas_crear" ON libertad_ocultas
    FOR INSERT WITH CHECK (true);

-- Políticas: Solo el usuario puede ver sus propias acciones de ocultar/bloquear
DROP POLICY IF EXISTS "ocultas_lectura_propia" ON libertad_ocultas;
CREATE POLICY "ocultas_lectura_propia" ON libertad_ocultas
    FOR SELECT USING (email_usuario = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Solo el usuario puede ver sus propias preferencias
DROP POLICY IF EXISTS "preferencias_lectura_propia" ON libertad_preferencias;
CREATE POLICY "preferencias_lectura_propia" ON libertad_preferencias
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Solo el usuario puede crear/actualizar sus propias preferencias
DROP POLICY IF EXISTS "preferencias_crear_propia" ON libertad_preferencias;
CREATE POLICY "preferencias_crear_propia" ON libertad_preferencias
    FOR INSERT WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "preferencias_actualizar_propia" ON libertad_preferencias;
CREATE POLICY "preferencias_actualizar_propia" ON libertad_preferencias
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- ===== FUNCIONES =====

-- Función para actualizar contador de comentarios
CREATE OR REPLACE FUNCTION actualizar_contador_comentarios_libertad()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE libertad_publicaciones 
        SET comentarios = comentarios + 1,
            updated_at = NOW()
        WHERE id = NEW.publicacion_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE libertad_publicaciones 
        SET comentarios = comentarios - 1,
            updated_at = NOW()
        WHERE id = OLD.publicacion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar contador de comentarios
DROP TRIGGER IF EXISTS trigger_actualizar_comentarios_libertad ON libertad_comentarios;
CREATE TRIGGER trigger_actualizar_comentarios_libertad
    AFTER INSERT OR DELETE ON libertad_comentarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_contador_comentarios_libertad();

-- Función para bloquear automáticamente después de 3 warnings
CREATE OR REPLACE FUNCTION verificar_warnings_libertad()
RETURNS TRIGGER AS $$
BEGIN
    -- Contar warnings totales para esta publicación
    IF (SELECT SUM(count) FROM libertad_warnings WHERE publicacion_id = NEW.publicacion_id) >= 3 THEN
        -- Actualizar estado de la publicación a bloqueada
        UPDATE libertad_publicaciones 
        SET estado = 'bloqueada',
            updated_at = NOW()
        WHERE id = NEW.publicacion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar warnings
DROP TRIGGER IF EXISTS trigger_verificar_warnings_libertad ON libertad_warnings;
CREATE TRIGGER trigger_verificar_warnings_libertad
    AFTER INSERT OR UPDATE ON libertad_warnings
    FOR EACH ROW
    EXECUTE FUNCTION verificar_warnings_libertad();

-- ===== COMENTARIOS =====
COMMENT ON TABLE libertad_publicaciones IS 'Publicaciones del foro de Libertad Emocional (rompimientos y dependencia)';
COMMENT ON TABLE libertad_comentarios IS 'Comentarios en las publicaciones';
COMMENT ON TABLE libertad_warnings IS 'Sistema de advertencias (3 warnings = bloqueo automático)';
COMMENT ON TABLE libertad_ocultas IS 'Publicaciones ocultas o bloqueadas por usuarios';
COMMENT ON TABLE libertad_preferencias IS 'Preferencias de contenido sensible de cada usuario';



