-- ===== TABLA: REPORTES DE MALTRATO ANIMAL =====
-- Sistema para reportar casos de maltrato animal con evidencias fotográficas

-- Crear tabla si no existe
CREATE TABLE IF NOT EXISTS reportes_maltrato_animal (
    id BIGSERIAL PRIMARY KEY,
    tipo_maltrato VARCHAR(50) NOT NULL,
    tipo_animal VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    direccion TEXT,
    descripcion TEXT NOT NULL,
    urgencia VARCHAR(20) NOT NULL CHECK (urgencia IN ('emergencia', 'alta', 'media', 'baja')),
    fotos JSONB DEFAULT '[]'::jsonb,
    anonimo BOOLEAN DEFAULT true,
    email VARCHAR(255),
    telefono VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_revision', 'verificado', 'enviado_autoridades', 'resuelto', 'cerrado')),
    reportado_por_hash VARCHAR(64),
    fecha_reporte TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_revision TIMESTAMP WITH TIME ZONE,
    fecha_resolucion TIMESTAMP WITH TIME ZONE,
    notas_moderacion TEXT,
    moderador_id BIGINT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_reportes_estado ON reportes_maltrato_animal(estado);
CREATE INDEX IF NOT EXISTS idx_reportes_urgencia ON reportes_maltrato_animal(urgencia);
CREATE INDEX IF NOT EXISTS idx_reportes_fecha ON reportes_maltrato_animal(fecha_reporte DESC);
CREATE INDEX IF NOT EXISTS idx_reportes_provincia ON reportes_maltrato_animal(provincia);
CREATE INDEX IF NOT EXISTS idx_reportes_tipo_maltrato ON reportes_maltrato_animal(tipo_maltrato);

-- Trigger para actualizar actualizado_en automáticamente
CREATE OR REPLACE FUNCTION actualizar_reportes_maltrato_actualizado()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_actualizar_reportes_maltrato_actualizado ON reportes_maltrato_animal;
CREATE TRIGGER trigger_actualizar_reportes_maltrato_actualizado
    BEFORE UPDATE ON reportes_maltrato_animal
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_reportes_maltrato_actualizado();

-- RLS (Row Level Security)
ALTER TABLE reportes_maltrato_animal ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede crear reportes
DROP POLICY IF EXISTS reportes_maltrato_insert ON reportes_maltrato_animal;
CREATE POLICY reportes_maltrato_insert
    ON reportes_maltrato_animal
    FOR INSERT
    WITH CHECK (true);

-- Política: Solo moderadores y administradores pueden leer todos los reportes
-- Por ahora, permitimos lectura pública para que los reportes se puedan ver
DROP POLICY IF EXISTS reportes_maltrato_select ON reportes_maltrato_animal;
CREATE POLICY reportes_maltrato_select
    ON reportes_maltrato_animal
    FOR SELECT
    USING (true);

-- Política: Solo moderadores pueden actualizar reportes
-- Esto se manejará desde el backend con service_role key

COMMENT ON TABLE reportes_maltrato_animal IS 'Reportes de maltrato animal con evidencias fotográficas';
COMMENT ON COLUMN reportes_maltrato_animal.tipo_maltrato IS 'Tipo de maltrato reportado';
COMMENT ON COLUMN reportes_maltrato_animal.anonimo IS 'Si el reporte es anónimo';
COMMENT ON COLUMN reportes_maltrato_animal.estado IS 'Estado del reporte: pendiente, en_revision, verificado, enviado_autoridades, resuelto, cerrado';
COMMENT ON COLUMN reportes_maltrato_animal.reportado_por_hash IS 'Hash del usuario que reportó (para mantener anonimato)';
COMMENT ON COLUMN reportes_maltrato_animal.fotos IS 'Array JSON con las fotos/videos en base64 o URLs';



