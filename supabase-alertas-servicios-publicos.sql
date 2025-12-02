-- ===== TABLA: ALERTAS DE SERVICIOS PÚBLICOS =====
-- Sistema para reportar cortes de luz, agua, gas en Argentina

-- Crear tabla si no existe
CREATE TABLE IF NOT EXISTS alertas_servicios_publicos (
    id BIGSERIAL PRIMARY KEY,
    tipo_servicio VARCHAR(20) NOT NULL CHECK (tipo_servicio IN ('luz', 'agua', 'gas', 'otro')),
    urgencia VARCHAR(20) NOT NULL CHECK (urgencia IN ('urgente', 'moderado', 'leve')),
    ciudad VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    direccion TEXT,
    descripcion TEXT NOT NULL,
    reportado_por_hash VARCHAR(64),
    estado VARCHAR(20) DEFAULT 'no-solucionado' CHECK (estado IN ('no-solucionado', 'en-curso', 'resuelto', 'cerrado')),
    num_reportes INTEGER DEFAULT 1,
    fecha_reporte TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_resolucion TIMESTAMP WITH TIME ZONE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_alertas_servicios_tipo ON alertas_servicios_publicos(tipo_servicio);
CREATE INDEX IF NOT EXISTS idx_alertas_servicios_estado ON alertas_servicios_publicos(estado);
CREATE INDEX IF NOT EXISTS idx_alertas_servicios_fecha ON alertas_servicios_publicos(fecha_reporte DESC);
CREATE INDEX IF NOT EXISTS idx_alertas_servicios_provincia ON alertas_servicios_publicos(provincia);
CREATE INDEX IF NOT EXISTS idx_alertas_servicios_ciudad ON alertas_servicios_publicos(ciudad);
CREATE INDEX IF NOT EXISTS idx_alertas_servicios_urgencia ON alertas_servicios_publicos(urgencia);

-- Índice compuesto para búsqueda de alertas similares
CREATE INDEX IF NOT EXISTS idx_alertas_servicios_similares ON alertas_servicios_publicos(tipo_servicio, ciudad, provincia, estado, fecha_reporte);

-- Trigger para actualizar actualizado_en automáticamente
CREATE OR REPLACE FUNCTION actualizar_alertas_servicios_actualizado()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_actualizar_alertas_servicios_actualizado ON alertas_servicios_publicos;
CREATE TRIGGER trigger_actualizar_alertas_servicios_actualizado
    BEFORE UPDATE ON alertas_servicios_publicos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_alertas_servicios_actualizado();

-- RLS (Row Level Security)
ALTER TABLE alertas_servicios_publicos ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede crear reportes
DROP POLICY IF EXISTS alertas_servicios_insert ON alertas_servicios_publicos;
CREATE POLICY alertas_servicios_insert
    ON alertas_servicios_publicos
    FOR INSERT
    WITH CHECK (true);

-- Política: Cualquiera puede leer reportes activos
DROP POLICY IF EXISTS alertas_servicios_select ON alertas_servicios_publicos;
CREATE POLICY alertas_servicios_select
    ON alertas_servicios_publicos
    FOR SELECT
    USING (estado IN ('no-solucionado', 'en-curso', 'resuelto'));

-- Política: Los usuarios pueden leer todos sus propios reportes (incluyendo cerrados)
DROP POLICY IF EXISTS alertas_servicios_select_propios ON alertas_servicios_publicos;
CREATE POLICY alertas_servicios_select_propios
    ON alertas_servicios_publicos
    FOR SELECT
    USING (true); -- Se filtrará por hash en el código de la aplicación

-- Política: Los usuarios pueden actualizar solo sus propios reportes
DROP POLICY IF EXISTS alertas_servicios_update ON alertas_servicios_publicos;
CREATE POLICY alertas_servicios_update
    ON alertas_servicios_publicos
    FOR UPDATE
    USING (true); -- Se verificará por hash en el código de la aplicación
    -- En producción, usar: USING (reportado_por_hash = current_setting('app.user_hash', true))

-- Política: Los usuarios pueden eliminar solo sus propios reportes
DROP POLICY IF EXISTS alertas_servicios_delete ON alertas_servicios_publicos;
CREATE POLICY alertas_servicios_delete
    ON alertas_servicios_publicos
    FOR DELETE
    USING (true); -- Se verificará por hash en el código de la aplicación
    -- En producción, usar: USING (reportado_por_hash = current_setting('app.user_hash', true))

-- Comentarios
COMMENT ON TABLE alertas_servicios_publicos IS 'Reportes de cortes de servicios públicos (luz, agua, gas)';
COMMENT ON COLUMN alertas_servicios_publicos.tipo_servicio IS 'Tipo de servicio: luz, agua, gas, otro';
COMMENT ON COLUMN alertas_servicios_publicos.reportado_por_hash IS 'Hash del usuario que reportó (para mantener anonimato)';
COMMENT ON COLUMN alertas_servicios_publicos.num_reportes IS 'Número de reportes similares (para detectar patrones)';

