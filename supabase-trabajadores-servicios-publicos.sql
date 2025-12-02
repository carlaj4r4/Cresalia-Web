-- ===== TABLA: TRABAJADORES DE SERVICIOS PÚBLICOS =====
-- Sistema para reportar dónde están trabajando los empleados y qué necesitan

-- Crear tabla si no existe
CREATE TABLE IF NOT EXISTS trabajadores_servicios_publicos (
    id BIGSERIAL PRIMARY KEY,
    tipo_servicio VARCHAR(20) NOT NULL CHECK (tipo_servicio IN ('luz', 'agua', 'gas', 'otro')),
    ciudad VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    direccion TEXT,
    descripcion TEXT NOT NULL,
    reportado_por_hash VARCHAR(64),
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'resuelto', 'cerrado')),
    necesita_ayuda BOOLEAN DEFAULT true,
    fecha_reporte TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_resolucion TIMESTAMP WITH TIME ZONE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_trabajadores_servicios_tipo ON trabajadores_servicios_publicos(tipo_servicio);
CREATE INDEX IF NOT EXISTS idx_trabajadores_servicios_estado ON trabajadores_servicios_publicos(estado);
CREATE INDEX IF NOT EXISTS idx_trabajadores_servicios_fecha ON trabajadores_servicios_publicos(fecha_reporte DESC);
CREATE INDEX IF NOT EXISTS idx_trabajadores_servicios_provincia ON trabajadores_servicios_publicos(provincia);
CREATE INDEX IF NOT EXISTS idx_trabajadores_servicios_ciudad ON trabajadores_servicios_publicos(ciudad);
CREATE INDEX IF NOT EXISTS idx_trabajadores_servicios_ayuda ON trabajadores_servicios_publicos(necesita_ayuda);

-- Trigger para actualizar actualizado_en automáticamente
CREATE OR REPLACE FUNCTION actualizar_trabajadores_servicios_actualizado()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_actualizar_trabajadores_servicios_actualizado ON trabajadores_servicios_publicos;
CREATE TRIGGER trigger_actualizar_trabajadores_servicios_actualizado
    BEFORE UPDATE ON trabajadores_servicios_publicos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_trabajadores_servicios_actualizado();

-- RLS (Row Level Security)
ALTER TABLE trabajadores_servicios_publicos ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede crear reportes
DROP POLICY IF EXISTS trabajadores_servicios_insert ON trabajadores_servicios_publicos;
CREATE POLICY trabajadores_servicios_insert
    ON trabajadores_servicios_publicos
    FOR INSERT
    WITH CHECK (true);

-- Política: Cualquiera puede leer reportes activos
DROP POLICY IF EXISTS trabajadores_servicios_select ON trabajadores_servicios_publicos;
CREATE POLICY trabajadores_servicios_select
    ON trabajadores_servicios_publicos
    FOR SELECT
    USING (estado = 'activo' OR estado = 'resuelto');

-- Comentarios
COMMENT ON TABLE trabajadores_servicios_publicos IS 'Reportes de trabajadores reparando servicios públicos en zona';
COMMENT ON COLUMN trabajadores_servicios_publicos.tipo_servicio IS 'Tipo de servicio: luz, agua, gas, otro';
COMMENT ON COLUMN trabajadores_servicios_publicos.reportado_por_hash IS 'Hash del usuario que reportó (para mantener anonimato)';
COMMENT ON COLUMN trabajadores_servicios_publicos.necesita_ayuda IS 'Si los trabajadores necesitan ayuda de la comunidad (agua, sombra, etc.)';



