-- ===== COMUNIDAD ESPIRITUALIDAD Y FE - CRESALIA =====
-- Base de datos para la comunidad de espiritualidad y fe
-- Sistema ULTRA ESTRICTO: 1 warning = BAN PERMANENTE

-- ===== 1. TABLA DE PUBLICACIONES =====
CREATE TABLE IF NOT EXISTS espiritualidad_publicaciones (
    id BIGSERIAL PRIMARY KEY,
    
    -- Información de la publicación
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    autor VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    -- Categorización
    categoria VARCHAR(50) DEFAULT 'general', 
    -- general, oracion, debates
    
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
CREATE INDEX IF NOT EXISTS idx_espiritualidad_pub_categoria ON espiritualidad_publicaciones(categoria);
CREATE INDEX IF NOT EXISTS idx_espiritualidad_pub_email ON espiritualidad_publicaciones(email);
CREATE INDEX IF NOT EXISTS idx_espiritualidad_pub_created ON espiritualidad_publicaciones(created_at DESC);

-- ===== 2. TABLA DE COMENTARIOS =====
CREATE TABLE IF NOT EXISTS espiritualidad_comentarios (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES espiritualidad_publicaciones(id) ON DELETE CASCADE,
    
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
CREATE INDEX IF NOT EXISTS idx_espiritualidad_com_pub ON espiritualidad_comentarios(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_espiritualidad_com_email ON espiritualidad_comentarios(email);

-- ===== 3. TABLA DE WARNINGS (Sistema ULTRA ESTRICTO: 1 warning = BAN) =====
CREATE TABLE IF NOT EXISTS espiritualidad_warnings (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES espiritualidad_publicaciones(id) ON DELETE CASCADE,
    
    -- Información del warning
    email_usuario VARCHAR(255) NOT NULL, -- Usuario que reporta
    email_autor VARCHAR(255) NOT NULL, -- Autor de la publicación (para banear)
    motivo TEXT NOT NULL,
    count INTEGER DEFAULT 1, -- Siempre 1, porque 1 = ban
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_espiritualidad_warn_pub ON espiritualidad_warnings(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_espiritualidad_warn_email ON espiritualidad_warnings(email_usuario);
CREATE INDEX IF NOT EXISTS idx_espiritualidad_warn_autor ON espiritualidad_warnings(email_autor);

-- ===== 4. TABLA DE USUARIOS BANEADOS =====
CREATE TABLE IF NOT EXISTS espiritualidad_baneados (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    
    -- Información del ban
    motivo TEXT NOT NULL,
    fecha_ban TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_espiritualidad_ban_email ON espiritualidad_baneados(email);

-- ===== 5. TABLA DE PUBLICACIONES OCULTAS/BLOQUEADAS =====
CREATE TABLE IF NOT EXISTS espiritualidad_ocultas (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES espiritualidad_publicaciones(id) ON DELETE CASCADE,
    email_usuario VARCHAR(255) NOT NULL,
    
    -- Tipo de acción
    tipo VARCHAR(20) NOT NULL, -- oculta, bloqueada
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_espiritualidad_ocult_pub ON espiritualidad_ocultas(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_espiritualidad_ocult_email ON espiritualidad_ocultas(email_usuario);
CREATE UNIQUE INDEX IF NOT EXISTS idx_espiritualidad_ocult_unique ON espiritualidad_ocultas(publicacion_id, email_usuario, tipo);

-- ===== 6. TABLA DE REGLAS ACEPTADAS =====
CREATE TABLE IF NOT EXISTS espiritualidad_reglas (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    
    -- Reglas
    reglas_aceptadas BOOLEAN DEFAULT false,
    fecha_aceptacion DATE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_espiritualidad_reglas_email ON espiritualidad_reglas(email);

-- ===== ROW LEVEL SECURITY =====

-- Habilitar RLS
ALTER TABLE espiritualidad_publicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE espiritualidad_comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE espiritualidad_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE espiritualidad_baneados ENABLE ROW LEVEL SECURITY;
ALTER TABLE espiritualidad_ocultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE espiritualidad_reglas ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos pueden leer publicaciones activas (excepto baneados)
DROP POLICY IF EXISTS "publicaciones_lectura_publica" ON espiritualidad_publicaciones;
CREATE POLICY "publicaciones_lectura_publica" ON espiritualidad_publicaciones
    FOR SELECT USING (
        estado = 'activa' AND 
        email NOT IN (SELECT email FROM espiritualidad_baneados)
    );

-- Políticas: Solo usuarios no baneados pueden crear publicaciones
DROP POLICY IF EXISTS "publicaciones_crear" ON espiritualidad_publicaciones;
CREATE POLICY "publicaciones_crear" ON espiritualidad_publicaciones
    FOR INSERT WITH CHECK (
        email NOT IN (SELECT email FROM espiritualidad_baneados)
    );

-- Políticas: Solo el autor puede actualizar su publicación
DROP POLICY IF EXISTS "publicaciones_actualizar_propia" ON espiritualidad_publicaciones;
CREATE POLICY "publicaciones_actualizar_propia" ON espiritualidad_publicaciones
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Todos pueden leer comentarios activos
DROP POLICY IF EXISTS "comentarios_lectura_publica" ON espiritualidad_comentarios;
CREATE POLICY "comentarios_lectura_publica" ON espiritualidad_comentarios
    FOR SELECT USING (estado = 'activo');

-- Políticas: Solo usuarios no baneados pueden crear comentarios
DROP POLICY IF EXISTS "comentarios_crear" ON espiritualidad_comentarios;
CREATE POLICY "comentarios_crear" ON espiritualidad_comentarios
    FOR INSERT WITH CHECK (
        email NOT IN (SELECT email FROM espiritualidad_baneados)
    );

-- Políticas: Todos pueden crear warnings
DROP POLICY IF EXISTS "warnings_crear" ON espiritualidad_warnings;
CREATE POLICY "warnings_crear" ON espiritualidad_warnings
    FOR INSERT WITH CHECK (true);

-- Políticas: Todos pueden leer sus propios warnings
DROP POLICY IF EXISTS "warnings_lectura_propia" ON espiritualidad_warnings;
CREATE POLICY "warnings_lectura_propia" ON espiritualidad_warnings
    FOR SELECT USING (email_usuario = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Todos pueden ver usuarios baneados (para verificar)
DROP POLICY IF EXISTS "baneados_lectura_publica" ON espiritualidad_baneados;
CREATE POLICY "baneados_lectura_publica" ON espiritualidad_baneados
    FOR SELECT USING (true);

-- Políticas: Todos pueden ocultar/bloquear publicaciones
DROP POLICY IF EXISTS "ocultas_crear" ON espiritualidad_ocultas;
CREATE POLICY "ocultas_crear" ON espiritualidad_ocultas
    FOR INSERT WITH CHECK (true);

-- Políticas: Solo el usuario puede ver sus propias acciones de ocultar/bloquear
DROP POLICY IF EXISTS "ocultas_lectura_propia" ON espiritualidad_ocultas;
CREATE POLICY "ocultas_lectura_propia" ON espiritualidad_ocultas
    FOR SELECT USING (email_usuario = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Solo el usuario puede ver/actualizar sus propias reglas
DROP POLICY IF EXISTS "reglas_lectura_propia" ON espiritualidad_reglas;
CREATE POLICY "reglas_lectura_propia" ON espiritualidad_reglas
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "reglas_crear_propia" ON espiritualidad_reglas;
CREATE POLICY "reglas_crear_propia" ON espiritualidad_reglas
    FOR INSERT WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "reglas_actualizar_propia" ON espiritualidad_reglas;
CREATE POLICY "reglas_actualizar_propia" ON espiritualidad_reglas
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- ===== FUNCIONES =====

-- Función para actualizar contador de comentarios
CREATE OR REPLACE FUNCTION actualizar_contador_comentarios_espiritualidad()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE espiritualidad_publicaciones 
        SET comentarios = comentarios + 1,
            updated_at = NOW()
        WHERE id = NEW.publicacion_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE espiritualidad_publicaciones 
        SET comentarios = comentarios - 1,
            updated_at = NOW()
        WHERE id = OLD.publicacion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar contador de comentarios
DROP TRIGGER IF EXISTS trigger_actualizar_comentarios_espiritualidad ON espiritualidad_comentarios;
CREATE TRIGGER trigger_actualizar_comentarios_espiritualidad
    AFTER INSERT OR DELETE ON espiritualidad_comentarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_contador_comentarios_espiritualidad();

-- Función para banear automáticamente después de 1 warning (SISTEMA ULTRA ESTRICTO)
CREATE OR REPLACE FUNCTION verificar_warnings_espiritualidad()
RETURNS TRIGGER AS $$
BEGIN
    -- Si hay 1 warning, banear al autor y bloquear la publicación
    IF (SELECT COUNT(*) FROM espiritualidad_warnings WHERE publicacion_id = NEW.publicacion_id) >= 1 THEN
        -- Banear al autor
        INSERT INTO espiritualidad_baneados (email, motivo, fecha_ban)
        VALUES (NEW.email_autor, NEW.motivo, NOW())
        ON CONFLICT (email) DO NOTHING;
        
        -- Bloquear la publicación
        UPDATE espiritualidad_publicaciones 
        SET estado = 'bloqueada',
            updated_at = NOW()
        WHERE id = NEW.publicacion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar warnings (SISTEMA ULTRA ESTRICTO: 1 warning = ban)
DROP TRIGGER IF EXISTS trigger_verificar_warnings_espiritualidad ON espiritualidad_warnings;
CREATE TRIGGER trigger_verificar_warnings_espiritualidad
    AFTER INSERT ON espiritualidad_warnings
    FOR EACH ROW
    EXECUTE FUNCTION verificar_warnings_espiritualidad();

-- ===== COMENTARIOS =====
COMMENT ON TABLE espiritualidad_publicaciones IS 'Publicaciones del foro de Espiritualidad y Fe';
COMMENT ON TABLE espiritualidad_comentarios IS 'Comentarios en las publicaciones';
COMMENT ON TABLE espiritualidad_warnings IS 'Sistema de advertencias ULTRA ESTRICTO (1 warning = BAN PERMANENTE)';
COMMENT ON TABLE espiritualidad_baneados IS 'Usuarios baneados permanentemente por falta de respeto';
COMMENT ON TABLE espiritualidad_ocultas IS 'Publicaciones ocultas o bloqueadas por usuarios';
COMMENT ON TABLE espiritualidad_reglas IS 'Registro de usuarios que aceptaron las reglas de respeto';



