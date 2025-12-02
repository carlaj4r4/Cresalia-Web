-- ===== COMUNIDAD INJUSTICIAS VIVIDAS - CRESALIA =====
-- Base de datos para la comunidad de injusticias (con seguridad)
-- Sistema ESTRICTO: 2 warnings = bloqueo automático
-- Anonimato garantizado

-- ===== 1. TABLA DE PUBLICACIONES =====
CREATE TABLE IF NOT EXISTS injusticias_publicaciones (
    id BIGSERIAL PRIMARY KEY,
    
    -- Información de la publicación
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    autor VARCHAR(255) DEFAULT 'Anónimo', -- Siempre anónimo
    email VARCHAR(255) NOT NULL, -- Solo para identificación interna
    
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
CREATE INDEX IF NOT EXISTS idx_injusticias_pub_email ON injusticias_publicaciones(email);
CREATE INDEX IF NOT EXISTS idx_injusticias_pub_sensible ON injusticias_publicaciones(es_sensible);
CREATE INDEX IF NOT EXISTS idx_injusticias_pub_created ON injusticias_publicaciones(created_at DESC);

-- ===== 2. TABLA DE COMENTARIOS =====
CREATE TABLE IF NOT EXISTS injusticias_comentarios (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES injusticias_publicaciones(id) ON DELETE CASCADE,
    
    -- Información del comentario
    contenido TEXT NOT NULL,
    autor VARCHAR(255) DEFAULT 'Anónimo', -- Siempre anónimo
    email VARCHAR(255) NOT NULL, -- Solo para identificación interna
    
    -- Estado
    estado VARCHAR(20) DEFAULT 'activo', -- activo, moderado, eliminado
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_injusticias_com_pub ON injusticias_comentarios(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_injusticias_com_email ON injusticias_comentarios(email);

-- ===== 3. TABLA DE WARNINGS (Sistema ESTRICTO: 2 warnings) =====
CREATE TABLE IF NOT EXISTS injusticias_warnings (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES injusticias_publicaciones(id) ON DELETE CASCADE,
    
    -- Información del warning
    email_usuario VARCHAR(255) NOT NULL, -- Usuario que reporta
    motivo TEXT,
    count INTEGER DEFAULT 1, -- Contador de advertencias (máximo 2)
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_injusticias_warn_pub ON injusticias_warnings(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_injusticias_warn_email ON injusticias_warnings(email_usuario);

-- ===== 4. TABLA DE PUBLICACIONES OCULTAS/BLOQUEADAS =====
CREATE TABLE IF NOT EXISTS injusticias_ocultas (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES injusticias_publicaciones(id) ON DELETE CASCADE,
    email_usuario VARCHAR(255) NOT NULL,
    
    -- Tipo de acción
    tipo VARCHAR(20) NOT NULL, -- oculta, bloqueada
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_injusticias_ocult_pub ON injusticias_ocultas(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_injusticias_ocult_email ON injusticias_ocultas(email_usuario);
CREATE UNIQUE INDEX IF NOT EXISTS idx_injusticias_ocult_unique ON injusticias_ocultas(publicacion_id, email_usuario, tipo);

-- ===== 5. TABLA DE ADVERTENCIAS ACEPTADAS =====
CREATE TABLE IF NOT EXISTS injusticias_advertencias (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    
    -- Advertencia
    advertencia_aceptada BOOLEAN DEFAULT false,
    fecha_aceptacion DATE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_injusticias_adv_email ON injusticias_advertencias(email);

-- ===== ROW LEVEL SECURITY =====

-- Habilitar RLS
ALTER TABLE injusticias_publicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE injusticias_comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE injusticias_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE injusticias_ocultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE injusticias_advertencias ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos pueden leer publicaciones activas
DROP POLICY IF EXISTS "publicaciones_lectura_publica" ON injusticias_publicaciones;
CREATE POLICY "publicaciones_lectura_publica" ON injusticias_publicaciones
    FOR SELECT USING (estado = 'activa');

-- Políticas: Todos pueden crear publicaciones
DROP POLICY IF EXISTS "publicaciones_crear" ON injusticias_publicaciones;
CREATE POLICY "publicaciones_crear" ON injusticias_publicaciones
    FOR INSERT WITH CHECK (true);

-- Políticas: Solo el autor puede actualizar su publicación
DROP POLICY IF EXISTS "publicaciones_actualizar_propia" ON injusticias_publicaciones;
CREATE POLICY "publicaciones_actualizar_propia" ON injusticias_publicaciones
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Todos pueden leer comentarios activos
DROP POLICY IF EXISTS "comentarios_lectura_publica" ON injusticias_comentarios;
CREATE POLICY "comentarios_lectura_publica" ON injusticias_comentarios
    FOR SELECT USING (estado = 'activo');

-- Políticas: Todos pueden crear comentarios
DROP POLICY IF EXISTS "comentarios_crear" ON injusticias_comentarios;
CREATE POLICY "comentarios_crear" ON injusticias_comentarios
    FOR INSERT WITH CHECK (true);

-- Políticas: Todos pueden crear warnings
DROP POLICY IF EXISTS "warnings_crear" ON injusticias_warnings;
CREATE POLICY "warnings_crear" ON injusticias_warnings
    FOR INSERT WITH CHECK (true);

-- Políticas: Todos pueden leer sus propios warnings
DROP POLICY IF EXISTS "warnings_lectura_propia" ON injusticias_warnings;
CREATE POLICY "warnings_lectura_propia" ON injusticias_warnings
    FOR SELECT USING (email_usuario = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Todos pueden ocultar/bloquear publicaciones
DROP POLICY IF EXISTS "ocultas_crear" ON injusticias_ocultas;
CREATE POLICY "ocultas_crear" ON injusticias_ocultas
    FOR INSERT WITH CHECK (true);

-- Políticas: Solo el usuario puede ver sus propias acciones de ocultar/bloquear
DROP POLICY IF EXISTS "ocultas_lectura_propia" ON injusticias_ocultas;
CREATE POLICY "ocultas_lectura_propia" ON injusticias_ocultas
    FOR SELECT USING (email_usuario = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Solo el usuario puede ver/actualizar sus propias advertencias
DROP POLICY IF EXISTS "advertencias_lectura_propia" ON injusticias_advertencias;
CREATE POLICY "advertencias_lectura_propia" ON injusticias_advertencias
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "advertencias_crear_propia" ON injusticias_advertencias;
CREATE POLICY "advertencias_crear_propia" ON injusticias_advertencias
    FOR INSERT WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "advertencias_actualizar_propia" ON injusticias_advertencias;
CREATE POLICY "advertencias_actualizar_propia" ON injusticias_advertencias
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- ===== FUNCIONES =====

-- Función para actualizar contador de comentarios
CREATE OR REPLACE FUNCTION actualizar_contador_comentarios_injusticias()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE injusticias_publicaciones 
        SET comentarios = comentarios + 1,
            updated_at = NOW()
        WHERE id = NEW.publicacion_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE injusticias_publicaciones 
        SET comentarios = comentarios - 1,
            updated_at = NOW()
        WHERE id = OLD.publicacion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar contador de comentarios
DROP TRIGGER IF EXISTS trigger_actualizar_comentarios_injusticias ON injusticias_comentarios;
CREATE TRIGGER trigger_actualizar_comentarios_injusticias
    AFTER INSERT OR DELETE ON injusticias_comentarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_contador_comentarios_injusticias();

-- Función para bloquear automáticamente después de 2 warnings (SISTEMA ESTRICTO)
CREATE OR REPLACE FUNCTION verificar_warnings_injusticias()
RETURNS TRIGGER AS $$
BEGIN
    -- Contar warnings totales para esta publicación
    IF (SELECT SUM(count) FROM injusticias_warnings WHERE publicacion_id = NEW.publicacion_id) >= 2 THEN
        -- Actualizar estado de la publicación a bloqueada
        UPDATE injusticias_publicaciones 
        SET estado = 'bloqueada',
            updated_at = NOW()
        WHERE id = NEW.publicacion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar warnings (SISTEMA ESTRICTO: 2 warnings)
DROP TRIGGER IF EXISTS trigger_verificar_warnings_injusticias ON injusticias_warnings;
CREATE TRIGGER trigger_verificar_warnings_injusticias
    AFTER INSERT OR UPDATE ON injusticias_warnings
    FOR EACH ROW
    EXECUTE FUNCTION verificar_warnings_injusticias();

-- ===== COMENTARIOS =====
COMMENT ON TABLE injusticias_publicaciones IS 'Publicaciones del foro de Injusticias Vividas (anonimato garantizado)';
COMMENT ON TABLE injusticias_comentarios IS 'Comentarios en las publicaciones';
COMMENT ON TABLE injusticias_warnings IS 'Sistema de advertencias ESTRICTO (2 warnings = bloqueo automático)';
COMMENT ON TABLE injusticias_ocultas IS 'Publicaciones ocultas o bloqueadas por usuarios';
COMMENT ON TABLE injusticias_advertencias IS 'Registro de usuarios que aceptaron la advertencia de seguridad';



