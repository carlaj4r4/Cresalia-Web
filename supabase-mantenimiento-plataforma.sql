-- ===== TABLA: MANTENIMIENTO PLATAFORMA =====
-- Almacena el estado de mantenimiento de la plataforma

-- Crear tabla si no existe
CREATE TABLE IF NOT EXISTS mantenimiento_plataforma (
    id BIGSERIAL PRIMARY KEY,
    activo BOOLEAN NOT NULL DEFAULT false,
    mensaje TEXT,
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    fecha_fin_estimada TIMESTAMP WITH TIME ZONE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_mantenimiento_activo ON mantenimiento_plataforma(activo);
CREATE INDEX IF NOT EXISTS idx_mantenimiento_fecha_inicio ON mantenimiento_plataforma(fecha_inicio DESC);

-- Trigger para actualizar actualizado_en automáticamente
CREATE OR REPLACE FUNCTION actualizar_mantenimiento_actualizado()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_actualizar_mantenimiento_actualizado ON mantenimiento_plataforma;
CREATE TRIGGER trigger_actualizar_mantenimiento_actualizado
    BEFORE UPDATE ON mantenimiento_plataforma
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_mantenimiento_actualizado();

-- RLS (Row Level Security) - Solo lectura pública, escritura solo para administradores
ALTER TABLE mantenimiento_plataforma ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede leer el estado de mantenimiento
DROP POLICY IF EXISTS mantenimiento_lectura_publica ON mantenimiento_plataforma;
CREATE POLICY mantenimiento_lectura_publica
    ON mantenimiento_plataforma
    FOR SELECT
    USING (true);

-- Política: Solo administradores pueden insertar/actualizar (requiere autenticación)
-- Por ahora, permitimos que el backend lo haga directamente con service_role key
-- En producción, deberías usar autenticación apropiada

-- Insertar estado inicial
INSERT INTO mantenimiento_plataforma (activo, mensaje)
VALUES (false, NULL)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE mantenimiento_plataforma IS 'Almacena el estado de mantenimiento de la plataforma Cresalia';
COMMENT ON COLUMN mantenimiento_plataforma.activo IS 'Indica si el mantenimiento está activo';
COMMENT ON COLUMN mantenimiento_plataforma.mensaje IS 'Mensaje personalizado sobre el mantenimiento';
COMMENT ON COLUMN mantenimiento_plataforma.fecha_inicio IS 'Fecha y hora en que se inició el mantenimiento';
COMMENT ON COLUMN mantenimiento_plataforma.fecha_fin IS 'Fecha y hora en que terminó el mantenimiento';
COMMENT ON COLUMN mantenimiento_plataforma.fecha_fin_estimada IS 'Fecha y hora estimada de finalización del mantenimiento';



