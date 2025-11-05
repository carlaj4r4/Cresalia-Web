-- ===== CRESALIA ANIMALES - Sistema de Ayuda para Animales =====
-- Sistema gratuito sin medios de pago - Donaciones directas
-- Co-fundadores: Carla & Claude
-- Fecha: Diciembre 2024

-- ===== TABLA: ORGANIZACIONES ANIMALES =====
CREATE TABLE IF NOT EXISTS organizaciones_animales (
    id BIGSERIAL PRIMARY KEY,
    nombre_organizacion VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('refugio', 'rescatista_independiente', 'fundacion', 'otro')),
    descripcion TEXT,
    ubicacion_ciudad VARCHAR(100),
    ubicacion_provincia VARCHAR(100),
    ubicacion_pais VARCHAR(100) DEFAULT 'Argentina',
    contacto_telefono VARCHAR(50),
    contacto_email VARCHAR(255),
    sitio_web VARCHAR(255),
    verificado BOOLEAN DEFAULT FALSE,
    cobra_comisiones BOOLEAN DEFAULT FALSE,
    transparencia_comisiones TEXT, -- Si cobra, explicar claramente
    transparencia_donaciones BOOLEAN DEFAULT FALSE, -- Si comparte cómo usa donaciones
    activa BOOLEAN DEFAULT TRUE,
    creada_por VARCHAR(255) DEFAULT 'CRISLA',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA: ANIMALES QUE NECESITAN AYUDA =====
CREATE TABLE IF NOT EXISTS animales_necesitan_ayuda (
    id BIGSERIAL PRIMARY KEY,
    organizacion_id BIGINT REFERENCES organizaciones_animales(id) ON DELETE SET NULL,
    tipo_animal VARCHAR(50) NOT NULL CHECK (tipo_animal IN ('perro', 'gato', 'otro')),
    nombre VARCHAR(100),
    edad VARCHAR(50), -- "cachorro", "adulto", "senior", o número aproximado
    situacion VARCHAR(50) NOT NULL CHECK (situacion IN ('herido', 'enfermo', 'callejero', 'en_refugio', 'para_adopcion', 'casa_temporal', 'perdido', 'encontrado')),
    descripcion TEXT NOT NULL,
    ubicacion_ciudad VARCHAR(100),
    ubicacion_provincia VARCHAR(100),
    ubicacion_zona VARCHAR(255), -- Zona aproximada, no dirección exacta
    urgencia VARCHAR(20) NOT NULL CHECK (urgencia IN ('baja', 'media', 'alta', 'emergencia')) DEFAULT 'media',
    tipo_ayuda_necesaria VARCHAR(50) NOT NULL CHECK (tipo_ayuda_necesaria IN ('veterinario', 'rescate', 'transporte', 'alimentos', 'medicamentos', 'casa_temporal', 'adopcion', 'otro')),
    fotos TEXT[], -- Array de URLs de fotos
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('activa', 'en_proceso', 'resuelta', 'cancelada')) DEFAULT 'activa',
    publicado_por VARCHAR(255), -- Hash anónimo o nombre
    contacto_publicador VARCHAR(255), -- Si comparte contacto
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA: NECESIDADES DE REFUGIOS =====
CREATE TABLE IF NOT EXISTS necesidades_refugios_animales (
    id BIGSERIAL PRIMARY KEY,
    organizacion_id BIGINT NOT NULL REFERENCES organizaciones_animales(id) ON DELETE CASCADE,
    tipo_necesidad VARCHAR(50) NOT NULL CHECK (tipo_necesidad IN ('alimentos', 'medicamentos', 'materiales', 'veterinario', 'voluntarios', 'otro')),
    descripcion_especifica TEXT NOT NULL, -- NO números irreales, necesidades reales
    cantidad_necesaria VARCHAR(255), -- Opcional, si es específica (ej: "20kg de balanceado")
    urgencia VARCHAR(20) NOT NULL CHECK (urgencia IN ('baja', 'media', 'alta', 'emergencia')) DEFAULT 'media',
    como_ayudar TEXT NOT NULL, -- Contacto directo, transferencia, etc.
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('activa', 'parcialmente_cubierta', 'cubierta', 'cancelada')) DEFAULT 'activa',
    transparencia_recibido TEXT, -- Opcional - qué se recibió (si la organización comparte)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA: AYUDAS RECIBIDAS =====
CREATE TABLE IF NOT EXISTS ayudas_animales_recibidas (
    id BIGSERIAL PRIMARY KEY,
    necesidad_id BIGINT REFERENCES necesidades_refugios_animales(id) ON DELETE SET NULL,
    animal_id BIGINT REFERENCES animales_necesitan_ayuda(id) ON DELETE SET NULL,
    organizacion_id BIGINT NOT NULL REFERENCES organizaciones_animales(id) ON DELETE CASCADE,
    donante_hash VARCHAR(255), -- Anónimo o identificado
    donante_nombre VARCHAR(255), -- Si quiere compartir nombre
    tipo_ayuda VARCHAR(50) NOT NULL CHECK (tipo_ayuda IN ('alimentos', 'medicamentos', 'productos', 'dinero', 'casa_temporal', 'adopcion', 'servicios', 'transporte', 'otro')),
    descripcion TEXT NOT NULL,
    cantidad VARCHAR(255), -- Opcional
    contacto_donante VARCHAR(255), -- Si comparte
    fecha_ofrecida TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_aceptada TIMESTAMP WITH TIME ZONE,
    fecha_entregada TIMESTAMP WITH TIME ZONE,
    confirmado BOOLEAN DEFAULT FALSE,
    nota_agradecimiento TEXT, -- Opcional, de la organización
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA: ADOPCIONES =====
CREATE TABLE IF NOT EXISTS adopciones_animales (
    id BIGSERIAL PRIMARY KEY,
    animal_id BIGINT NOT NULL REFERENCES animales_necesitan_ayuda(id) ON DELETE CASCADE,
    organizacion_id BIGINT NOT NULL REFERENCES organizaciones_animales(id) ON DELETE CASCADE,
    adoptante_hash VARCHAR(255), -- Anónimo o identificado
    adoptante_nombre VARCHAR(255), -- Si comparte
    contacto_adoptante VARCHAR(255),
    fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_aprobacion TIMESTAMP WITH TIME ZONE,
    fecha_adopcion TIMESTAMP WITH TIME ZONE,
    requisitos_cumplidos BOOLEAN DEFAULT FALSE,
    seguimiento_activo BOOLEAN DEFAULT TRUE,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'aprobada', 'completada', 'rechazada', 'cancelada')) DEFAULT 'pendiente',
    notas_organizacion TEXT, -- Notas de la organización sobre el proceso
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA: CASAS TEMPORALES (TRÁNSITO) =====
CREATE TABLE IF NOT EXISTS casas_temporales_animales (
    id BIGSERIAL PRIMARY KEY,
    animal_id BIGINT NOT NULL REFERENCES animales_necesitan_ayuda(id) ON DELETE CASCADE,
    organizacion_id BIGINT NOT NULL REFERENCES organizaciones_animales(id) ON DELETE CASCADE,
    transitante_hash VARCHAR(255), -- Anónimo o identificado
    transitante_nombre VARCHAR(255), -- Si comparte
    contacto_transitante VARCHAR(255),
    duracion_estimada VARCHAR(255), -- "1 mes", "hasta adopción", etc.
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('solicitada', 'activa', 'completada', 'cancelada')) DEFAULT 'solicitada',
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ÍNDICES =====
CREATE INDEX IF NOT EXISTS idx_organizaciones_activas ON organizaciones_animales(activa, verificado);
CREATE INDEX IF NOT EXISTS idx_animales_activos ON animales_necesitan_ayuda(estado, urgencia, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_animales_tipo ON animales_necesitan_ayuda(tipo_animal, situacion);
CREATE INDEX IF NOT EXISTS idx_animales_ubicacion ON animales_necesitan_ayuda(ubicacion_ciudad, ubicacion_provincia);
CREATE INDEX IF NOT EXISTS idx_necesidades_activas ON necesidades_refugios_animales(estado, urgencia, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_adopciones_estado ON adopciones_animales(estado, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_casas_temporales_estado ON casas_temporales_animales(estado, created_at DESC);

-- ===== ROW LEVEL SECURITY =====
ALTER TABLE organizaciones_animales ENABLE ROW LEVEL SECURITY;
ALTER TABLE animales_necesitan_ayuda ENABLE ROW LEVEL SECURITY;
ALTER TABLE necesidades_refugios_animales ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayudas_animales_recibidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE adopciones_animales ENABLE ROW LEVEL SECURITY;
ALTER TABLE casas_temporales_animales ENABLE ROW LEVEL SECURITY;

-- ===== POLÍTICAS RLS - LECTURA PÚBLICA =====
CREATE POLICY "lectura_organizaciones_publica" ON organizaciones_animales
    FOR SELECT USING (activa = TRUE);

CREATE POLICY "lectura_animales_publica" ON animales_necesitan_ayuda
    FOR SELECT USING (estado IN ('activa', 'en_proceso'));

CREATE POLICY "lectura_necesidades_publica" ON necesidades_refugios_animales
    FOR SELECT USING (estado IN ('activa', 'parcialmente_cubierta'));

CREATE POLICY "lectura_ayudas_publica" ON ayudas_animales_recibidas
    FOR SELECT USING (confirmado = TRUE);

CREATE POLICY "lectura_adopciones_publica" ON adopciones_animales
    FOR SELECT USING (estado IN ('pendiente', 'aprobada', 'completada'));

CREATE POLICY "lectura_casas_temporales_publica" ON casas_temporales_animales
    FOR SELECT USING (estado IN ('solicitada', 'activa', 'completada'));

-- ===== POLÍTICAS RLS - INSERCIÓN PÚBLICA =====
CREATE POLICY "crear_organizaciones_publico" ON organizaciones_animales
    FOR INSERT WITH CHECK (true);

CREATE POLICY "crear_animales_publico" ON animales_necesitan_ayuda
    FOR INSERT WITH CHECK (true);

CREATE POLICY "crear_necesidades_publico" ON necesidades_refugios_animales
    FOR INSERT WITH CHECK (true);

CREATE POLICY "crear_ayudas_publico" ON ayudas_animales_recibidas
    FOR INSERT WITH CHECK (true);

CREATE POLICY "crear_adopciones_publico" ON adopciones_animales
    FOR INSERT WITH CHECK (true);

CREATE POLICY "crear_casas_temporales_publico" ON casas_temporales_animales
    FOR INSERT WITH CHECK (true);

-- ===== COMENTARIOS =====
COMMENT ON TABLE organizaciones_animales IS 'Refugios, rescatistas y fundaciones de animales';
COMMENT ON TABLE animales_necesitan_ayuda IS 'Animales que necesitan ayuda urgente (heridos, enfermos, para adopción, etc.)';
COMMENT ON TABLE necesidades_refugios_animales IS 'Necesidades específicas de refugios (NO números irreales)';
COMMENT ON TABLE ayudas_animales_recibidas IS 'Registro de ayudas entregadas (donaciones directas)';
COMMENT ON TABLE adopciones_animales IS 'Sistema de adopción responsable';
COMMENT ON TABLE casas_temporales_animales IS 'Sistema de casa temporal/tránsito para animales';



