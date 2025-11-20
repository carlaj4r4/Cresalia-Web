-- ===== COMUNIDAD MATERNIDAD - CRESALIA =====
-- Base de datos para la comunidad de embarazadas y futuras madres

-- ===== 1. TABLA DE PUBLICACIONES =====
CREATE TABLE IF NOT EXISTS maternidad_publicaciones (
    id BIGSERIAL PRIMARY KEY,
    
    -- Información de la publicación
    titulo VARCHAR(200) NOT NULL,
    contenido TEXT NOT NULL,
    autor VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    -- Categorización
    categoria VARCHAR(50) DEFAULT 'general', 
    -- general, primer-trimestre, segundo-trimestre, tercer-trimestre, parto, postparto, futuras-madres, 
    -- dificultad-concebir, aborto-espontaneo, abortos
    
    -- Contenido sensible
    es_sensible BOOLEAN DEFAULT false,
    
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
CREATE INDEX IF NOT EXISTS idx_maternidad_pub_categoria ON maternidad_publicaciones(categoria);
CREATE INDEX IF NOT EXISTS idx_maternidad_pub_email ON maternidad_publicaciones(email);
CREATE INDEX IF NOT EXISTS idx_maternidad_pub_sensible ON maternidad_publicaciones(es_sensible);
CREATE INDEX IF NOT EXISTS idx_maternidad_pub_created ON maternidad_publicaciones(created_at DESC);

-- ===== 2. TABLA DE COMENTARIOS =====
CREATE TABLE IF NOT EXISTS maternidad_comentarios (
    id BIGSERIAL PRIMARY KEY,
    publicacion_id BIGINT REFERENCES maternidad_publicaciones(id) ON DELETE CASCADE,
    
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
CREATE INDEX IF NOT EXISTS idx_maternidad_com_pub ON maternidad_comentarios(publicacion_id);
CREATE INDEX IF NOT EXISTS idx_maternidad_com_email ON maternidad_comentarios(email);

-- ===== 3. TABLA DE DIARIO PERSONAL =====
CREATE TABLE IF NOT EXISTS maternidad_diario (
    id BIGSERIAL PRIMARY KEY,
    
    -- Usuario
    email VARCHAR(255) NOT NULL,
    
    -- Fecha de la entrada
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Contenido del diario
    emocion VARCHAR(50) NOT NULL,
    -- feliz, cansada, ansiosa, emocionada, preocupada
    
    sintomas TEXT,
    notas TEXT,
    semana INTEGER, -- Semana de embarazo (1-42)
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_maternidad_diario_email ON maternidad_diario(email);
CREATE INDEX IF NOT EXISTS idx_maternidad_diario_fecha ON maternidad_diario(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_maternidad_diario_semana ON maternidad_diario(semana);

-- ===== 4. TABLA DE PREFERENCIAS DE CONTENIDO SENSIBLE =====
CREATE TABLE IF NOT EXISTS maternidad_preferencias (
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
CREATE INDEX IF NOT EXISTS idx_maternidad_pref_email ON maternidad_preferencias(email);

-- ===== ROW LEVEL SECURITY =====

-- Habilitar RLS
ALTER TABLE maternidad_publicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE maternidad_comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE maternidad_diario ENABLE ROW LEVEL SECURITY;
ALTER TABLE maternidad_preferencias ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos pueden leer publicaciones activas
DROP POLICY IF EXISTS "publicaciones_lectura_publica" ON maternidad_publicaciones;
CREATE POLICY "publicaciones_lectura_publica" ON maternidad_publicaciones
    FOR SELECT USING (estado = 'activa');

-- Políticas: Todos pueden crear publicaciones
DROP POLICY IF EXISTS "publicaciones_crear" ON maternidad_publicaciones;
CREATE POLICY "publicaciones_crear" ON maternidad_publicaciones
    FOR INSERT WITH CHECK (true);

-- Políticas: Solo el autor puede actualizar su publicación
DROP POLICY IF EXISTS "publicaciones_actualizar_propia" ON maternidad_publicaciones;
CREATE POLICY "publicaciones_actualizar_propia" ON maternidad_publicaciones
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Todos pueden leer comentarios activos
DROP POLICY IF EXISTS "comentarios_lectura_publica" ON maternidad_comentarios;
CREATE POLICY "comentarios_lectura_publica" ON maternidad_comentarios
    FOR SELECT USING (estado = 'activo');

-- Políticas: Todos pueden crear comentarios
DROP POLICY IF EXISTS "comentarios_crear" ON maternidad_comentarios;
CREATE POLICY "comentarios_crear" ON maternidad_comentarios
    FOR INSERT WITH CHECK (true);

-- Políticas: Solo el usuario puede ver su propio diario
DROP POLICY IF EXISTS "diario_lectura_propia" ON maternidad_diario;
CREATE POLICY "diario_lectura_propia" ON maternidad_diario
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Solo el usuario puede crear su propio diario
DROP POLICY IF EXISTS "diario_crear_propio" ON maternidad_diario;
CREATE POLICY "diario_crear_propio" ON maternidad_diario
    FOR INSERT WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Solo el usuario puede ver sus propias preferencias
DROP POLICY IF EXISTS "preferencias_lectura_propia" ON maternidad_preferencias;
CREATE POLICY "preferencias_lectura_propia" ON maternidad_preferencias
    FOR SELECT USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Políticas: Solo el usuario puede crear/actualizar sus propias preferencias
DROP POLICY IF EXISTS "preferencias_crear_propia" ON maternidad_preferencias;
CREATE POLICY "preferencias_crear_propia" ON maternidad_preferencias
    FOR INSERT WITH CHECK (email = current_setting('request.jwt.claims', true)::json->>'email');

DROP POLICY IF EXISTS "preferencias_actualizar_propia" ON maternidad_preferencias;
CREATE POLICY "preferencias_actualizar_propia" ON maternidad_preferencias
    FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- ===== FUNCIONES =====

-- Función para actualizar contador de comentarios
CREATE OR REPLACE FUNCTION actualizar_contador_comentarios()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE maternidad_publicaciones 
        SET comentarios = comentarios + 1,
            updated_at = NOW()
        WHERE id = NEW.publicacion_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE maternidad_publicaciones 
        SET comentarios = comentarios - 1,
            updated_at = NOW()
        WHERE id = OLD.publicacion_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar contador de comentarios
DROP TRIGGER IF EXISTS trigger_actualizar_comentarios ON maternidad_comentarios;
CREATE TRIGGER trigger_actualizar_comentarios
    AFTER INSERT OR DELETE ON maternidad_comentarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_contador_comentarios();

-- ===== COMENTARIOS =====
COMMENT ON TABLE maternidad_publicaciones IS 'Publicaciones del foro de la comunidad Maternidad';
COMMENT ON TABLE maternidad_comentarios IS 'Comentarios en las publicaciones';
COMMENT ON TABLE maternidad_diario IS 'Diario personal de cada usuaria (privado)';
COMMENT ON TABLE maternidad_preferencias IS 'Preferencias de contenido sensible de cada usuaria';

