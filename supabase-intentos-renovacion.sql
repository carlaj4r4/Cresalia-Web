-- ===== TABLA DE INTENTOS DE RENOVACIÓN =====
-- Para el sistema de renovación automática y suspensión automática

CREATE TABLE IF NOT EXISTS intentos_renovacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    suscripcion_id UUID REFERENCES suscripciones(id) ON DELETE CASCADE,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('en_proceso', 'exitoso', 'fallido', 'error')),
    preference_id VARCHAR(255),
    error TEXT,
    intentos INTEGER DEFAULT 1,
    fecha_intento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intentos_renovacion_suscripcion ON intentos_renovacion(suscripcion_id);
CREATE INDEX IF NOT EXISTS idx_intentos_renovacion_fecha ON intentos_renovacion(fecha_intento);
CREATE INDEX IF NOT EXISTS idx_intentos_renovacion_estado ON intentos_renovacion(estado);

-- RLS (Row Level Security)
ALTER TABLE intentos_renovacion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tiendas_ver_sus_intentos" ON intentos_renovacion FOR SELECT 
    USING (suscripcion_id IN (
        SELECT id FROM suscripciones 
        WHERE tienda_id IN (
            SELECT id FROM tiendas WHERE user_id = auth.uid()
        )
    ));

COMMENT ON TABLE intentos_renovacion IS 'Registro de intentos de renovación automática de suscripciones';





