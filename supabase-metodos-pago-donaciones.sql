-- ===== TABLA: MÉTODOS DE PAGO PARA DONACIONES =====
-- Sistema para que usuarios/organizaciones agreguen su alias/CVU/CBU
-- Para recibir donaciones directamente (sin usar cuenta de Cresalia)
-- Co-fundadores: Carla & Claude

-- Tabla principal de métodos de pago
CREATE TABLE IF NOT EXISTS metodos_pago_donaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_entidad VARCHAR(50) NOT NULL CHECK (tipo_entidad IN ('usuario', 'organizacion', 'refugio', 'merendero', 'ong')),
    entidad_id VARCHAR(255) NOT NULL, -- ID del usuario/organización
    entidad_nombre VARCHAR(255) NOT NULL,
    entidad_hash VARCHAR(100) NOT NULL, -- Hash del usuario para privacidad
    
    -- Información de pago
    metodo_tipo VARCHAR(50) NOT NULL CHECK (metodo_tipo IN ('alias', 'cvu', 'cbu')),
    metodo_valor VARCHAR(100) NOT NULL, -- El alias, CVU o CBU
    titular_nombre VARCHAR(255) NOT NULL,
    banco VARCHAR(255),
    
    -- Estado y verificación
    verificado BOOLEAN DEFAULT false,
    estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'oculto', 'eliminado')),
    
    -- Fechas
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_metodos_pago_entidad_hash ON metodos_pago_donaciones(entidad_hash);
CREATE INDEX IF NOT EXISTS idx_metodos_pago_tipo_entidad ON metodos_pago_donaciones(tipo_entidad);
CREATE INDEX IF NOT EXISTS idx_metodos_pago_estado ON metodos_pago_donaciones(estado);
CREATE INDEX IF NOT EXISTS idx_metodos_pago_verificado ON metodos_pago_donaciones(verificado);

-- Índice único parcial: un método de pago activo por tipo por entidad
-- Esto evita que una entidad tenga múltiples métodos del mismo tipo activos
CREATE UNIQUE INDEX IF NOT EXISTS idx_metodos_pago_entidad_tipo_activo 
    ON metodos_pago_donaciones(entidad_hash, metodo_tipo) 
    WHERE estado = 'activo';

-- Comentarios en la tabla
COMMENT ON TABLE metodos_pago_donaciones IS 'Métodos de pago (alias/CVU/CBU) de usuarios/organizaciones para recibir donaciones';
COMMENT ON COLUMN metodos_pago_donaciones.tipo_entidad IS 'Tipo: usuario, organizacion, refugio, merendero, ong';
COMMENT ON COLUMN metodos_pago_donaciones.metodo_tipo IS 'Tipo de método: alias, cvu, cbu';
COMMENT ON COLUMN metodos_pago_donaciones.entidad_hash IS 'Hash único de la entidad para identificar sin exponer datos personales';

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_metodos_pago_donaciones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar fecha_actualizacion
DROP TRIGGER IF EXISTS trigger_update_metodos_pago_donaciones_updated_at ON metodos_pago_donaciones;
CREATE TRIGGER trigger_update_metodos_pago_donaciones_updated_at
    BEFORE UPDATE ON metodos_pago_donaciones
    FOR EACH ROW
    EXECUTE FUNCTION update_metodos_pago_donaciones_updated_at();

-- Row Level Security (RLS)
ALTER TABLE metodos_pago_donaciones ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas si existen (para evitar errores al ejecutar de nuevo)
DROP POLICY IF EXISTS "Cualquiera puede leer métodos de pago activos" ON metodos_pago_donaciones;
DROP POLICY IF EXISTS "Entidades pueden crear sus métodos de pago" ON metodos_pago_donaciones;
DROP POLICY IF EXISTS "Entidades pueden actualizar sus métodos de pago" ON metodos_pago_donaciones;

-- Política: Todos pueden leer métodos de pago activos (para donar)
CREATE POLICY "Cualquiera puede leer métodos de pago activos"
    ON metodos_pago_donaciones
    FOR SELECT
    USING (estado = 'activo');

-- Política: Cualquiera puede insertar métodos de pago (para que usuarios agreguen los suyos)
CREATE POLICY "Entidades pueden crear sus métodos de pago"
    ON metodos_pago_donaciones
    FOR INSERT
    WITH CHECK (true);

-- Política: Solo la entidad puede actualizar sus métodos de pago (por hash)
CREATE POLICY "Entidades pueden actualizar sus métodos de pago"
    ON metodos_pago_donaciones
    FOR UPDATE
    USING (entidad_hash = current_setting('request.jwt.claim.user_hash', true))
    WITH CHECK (entidad_hash = current_setting('request.jwt.claim.user_hash', true));

