-- ===== COMUNIDAD DESAHOGO LIBRE - CRESALIA =====
-- Base de datos para la comunidad sin etiquetas

-- ===== 1. TABLA DE PUBLICACIONES =====
CREATE TABLE IF NOT EXISTS desahogo_publicaciones (
    id BIGSERIAL PRIMARY KEY,
    
    -- Información de la publicación
    titulo VARCHAR(200), -- Opcional, puede ser NULL
    contenido TEXT NOT NULL,
    autor VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    -- Estadísticas
    comentarios INTEGER DEFAULT 0,
    vistas INTEGER DEFAULT 0,
    
    -- Estado
    estado VARCHAR(20) DEFAULT 'activa', -- activa, moderada, eliminada
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_desahogo_pub_email ON desahogo_publicaciones(email);
CREATE INDEX IF NOT EXISTS idx_desahogo_pub_created ON desahogo_publicaciones(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_desahogo_pub_estado ON desahogo_publicaciones(estado);

-- ===== 2. TABLA DE COMENTARIOS =====
CREATE TABLE IF NOT EXISTS desahogo_comentarios (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES desahogo_publicaciones(id) ON DELETE CASCADE,
    
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
CREATE INDEX IF NOT EXISTS idx_desahogo_com_pub ON desahogo_comentarios(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_desahogo_com_email ON desahogo_comentarios(email);

-- ===== 3. TABLA DE WARNINGS (Sistema de 3 advertencias) =====
CREATE TABLE IF NOT EXISTS desahogo_warnings (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES desahogo_publicaciones(id) ON DELETE CASCADE,
    
    -- Información del warning
    email_usuario VARCHAR(255) NOT NULL, -- Usuario que reporta
    motivo TEXT,
    count INTEGER DEFAULT 1, -- Contador de advertencias (máximo 3)
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_desahogo_warn_pub ON desahogo_warnings(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_desahogo_warn_email ON desahogo_warnings(email_usuario);

-- ===== 4. TABLA DE PUBLICACIONES OCULTAS/BLOQUEADAS =====
CREATE TABLE IF NOT EXISTS desahogo_ocultas (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES desahogo_publicaciones(id) ON DELETE CASCADE,
    email_usuario VARCHAR(255) NOT NULL,
    
    -- Tipo de acción
    tipo VARCHAR(20) NOT NULL, -- oculta, bloqueada
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_desahogo_ocult_pub ON desahogo_ocultas(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_desahogo_ocult_email ON desahogo_ocultas(email_usuario);
CREATE UNIQUE INDEX IF NOT EXISTS idx_desahogo_ocult_unique ON desahogo_ocultas(publicacion_id, email_usuario, tipo);

-- ===== ROW LEVEL SECURITY =====

-- Habilitar RLS
ALTER TABLE desahogo_publicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE desahogo_comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE desahogo_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE desahogo_ocultas ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos pueden leer publicaciones activas
DROP POLICY IF EXISTS "publicaciones_lectura_publica" ON desahogo_publicaciones;
CREATE POLICY "publicaciones_lectura_publica" ON desahogo_publicaciones
    FOR SELECT USING (estado = 'activa');

-- Políticas: Todos pueden crear publicaciones
DROP POLICY IF EXISTS "publicaciones_crear" ON desahogo_publicaciones;
CREATE POLICY "publicaciones_crear" ON desahogo_publicaciones
    FOR INSERT WITH CHECK (true);

-- Políticas: Solo el autor puede actualizar su publicación
DROP POLICY IF EXISTS "publicaciones_actualizar_propia" ON desahogo_publicaciones;
CREATE POLICY "publicaciones_actualizar_propia" ON desahogo_publicaciones
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Todos pueden leer comentarios activos
DROP POLICY IF EXISTS "comentarios_lectura_publica" ON desahogo_comentarios;
CREATE POLICY "comentarios_lectura_publica" ON desahogo_comentarios
    FOR SELECT USING (estado = 'activo');

-- Políticas: Todos pueden crear comentarios
DROP POLICY IF EXISTS "comentarios_crear" ON desahogo_comentarios;
CREATE POLICY "comentarios_crear" ON desahogo_comentarios
    FOR INSERT WITH CHECK (true);

-- Políticas: Todos pueden crear warnings
DROP POLICY IF EXISTS "warnings_crear" ON desahogo_warnings;
CREATE POLICY "warnings_crear" ON desahogo_warnings
    FOR INSERT WITH CHECK (true);

-- Políticas: Todos pueden leer sus propios warnings
DROP POLICY IF EXISTS "warnings_lectura_propia" ON desahogo_warnings;
CREATE POLICY "warnings_lectura_propia" ON desahogo_warnings
    FOR SELECT USING (email_usuario = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Todos pueden ocultar/bloquear publicaciones
DROP POLICY IF EXISTS "ocultas_crear" ON desahogo_ocultas;
CREATE POLICY "ocultas_crear" ON desahogo_ocultas
    FOR INSERT WITH CHECK (true);

-- Políticas: Solo el usuario puede ver sus propias acciones de ocultar/bloquear
DROP POLICY IF EXISTS "ocultas_lectura_propia" ON desahogo_ocultas;
CREATE POLICY "ocultas_lectura_propia" ON desahogo_ocultas
    FOR SELECT USING (email_usuario = current_setting('request.jwt.claims', true)::json->>'email');

-- ===== FUNCIONES =====

-- Función para actualizar contador de comentarios
CREATE OR REPLACE FUNCTION actualizar_contador_comentarios_desahogo()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE desahogo_publicaciones 
        SET comentarios = comentarios + 1,
            updated_at = NOW()
        WHERE id = NEW.publicacion_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE desahogo_publicaciones 
        SET comentarios = comentarios - 1,
            updated_at = NOW()
        WHERE id = OLD.publicacion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar contador de comentarios
DROP TRIGGER IF EXISTS trigger_actualizar_comentarios_desahogo ON desahogo_comentarios;
CREATE TRIGGER trigger_actualizar_comentarios_desahogo
    AFTER INSERT OR DELETE ON desahogo_comentarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_contador_comentarios_desahogo();

-- Función para bloquear automáticamente después de 3 warnings
CREATE OR REPLACE FUNCTION verificar_warnings_desahogo()
RETURNS TRIGGER AS $$
BEGIN
    -- Contar warnings totales para esta publicación
    IF (SELECT SUM(count) FROM desahogo_warnings WHERE publicacion_id = NEW.publicacion_id) >= 3 THEN
        -- Actualizar estado de la publicación a bloqueada
        UPDATE desahogo_publicaciones 
        SET estado = 'bloqueada',
            updated_at = NOW()
        WHERE id = NEW.publicacion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar warnings
DROP TRIGGER IF EXISTS trigger_verificar_warnings_desahogo ON desahogo_warnings;
CREATE TRIGGER trigger_verificar_warnings_desahogo
    AFTER INSERT OR UPDATE ON desahogo_warnings
    FOR EACH ROW
    EXECUTE FUNCTION verificar_warnings_desahogo();

-- ===== COMENTARIOS =====
COMMENT ON TABLE desahogo_publicaciones IS 'Publicaciones del foro de Desahogo Libre (sin categorías)';
COMMENT ON TABLE desahogo_comentarios IS 'Comentarios en las publicaciones';
COMMENT ON TABLE desahogo_warnings IS 'Sistema de advertencias (3 warnings = bloqueo automático)';
COMMENT ON TABLE desahogo_ocultas IS 'Publicaciones ocultas o bloqueadas por usuarios';



