-- ===== TABLA: EXPERIENCIAS SOBRENATURALES =====
-- Comunidad para compartir experiencias sobrenaturales de forma segura
-- Co-fundadores: Carla & Claude

-- Tabla principal de experiencias
CREATE TABLE IF NOT EXISTS experiencias_sobrenaturales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(500) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('aparicion', 'premonicion', 'fuera-cuerpo', 'encuentro', 'fenomeno', 'sincronicidad', 'mistico', 'otro')),
    intensidad VARCHAR(50) NOT NULL CHECK (intensidad IN ('leve', 'moderada', 'intensa', 'muy-intensa')),
    ubicacion VARCHAR(255),
    fecha_experiencia VARCHAR(255),
    contenido TEXT NOT NULL,
    es_anonimo BOOLEAN DEFAULT false,
    autor_nombre VARCHAR(255),
    autor_hash VARCHAR(100) NOT NULL,
    estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'pausado', 'oculto', 'eliminado')),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_experiencias_sobrenaturales_estado ON experiencias_sobrenaturales(estado);
CREATE INDEX IF NOT EXISTS idx_experiencias_sobrenaturales_tipo ON experiencias_sobrenaturales(tipo);
CREATE INDEX IF NOT EXISTS idx_experiencias_sobrenaturales_intensidad ON experiencias_sobrenaturales(intensidad);
CREATE INDEX IF NOT EXISTS idx_experiencias_sobrenaturales_fecha ON experiencias_sobrenaturales(fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_experiencias_sobrenaturales_autor_hash ON experiencias_sobrenaturales(autor_hash);

-- Comentarios en la tabla
COMMENT ON TABLE experiencias_sobrenaturales IS 'Experiencias sobrenaturales compartidas en la comunidad de Cresalia';
COMMENT ON COLUMN experiencias_sobrenaturales.tipo IS 'Tipo de experiencia: aparicion, premonicion, fuera-cuerpo, encuentro, fenomeno, sincronicidad, mistico, otro';
COMMENT ON COLUMN experiencias_sobrenaturales.intensidad IS 'Intensidad: leve, moderada, intensa, muy-intensa';
COMMENT ON COLUMN experiencias_sobrenaturales.es_anonimo IS 'Si la experiencia se publica de forma anónima';
COMMENT ON COLUMN experiencias_sobrenaturales.autor_hash IS 'Hash único del autor para identificar usuarios sin exponer datos personales';

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_experiencias_sobrenaturales_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar fecha_actualizacion
DROP TRIGGER IF EXISTS trigger_update_experiencias_sobrenaturales_updated_at ON experiencias_sobrenaturales;
CREATE TRIGGER trigger_update_experiencias_sobrenaturales_updated_at
    BEFORE UPDATE ON experiencias_sobrenaturales
    FOR EACH ROW
    EXECUTE FUNCTION update_experiencias_sobrenaturales_updated_at();

-- Row Level Security (RLS)
ALTER TABLE experiencias_sobrenaturales ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas si existen (para evitar errores al ejecutar de nuevo)
DROP POLICY IF EXISTS "Cualquiera puede leer experiencias activas" ON experiencias_sobrenaturales;
DROP POLICY IF EXISTS "Cualquiera puede crear experiencias" ON experiencias_sobrenaturales;
DROP POLICY IF EXISTS "Autores pueden actualizar sus experiencias" ON experiencias_sobrenaturales;

-- Política: Todos pueden leer experiencias activas
CREATE POLICY "Cualquiera puede leer experiencias activas"
    ON experiencias_sobrenaturales
    FOR SELECT
    USING (estado = 'activo');

-- Política: Cualquiera puede insertar experiencias
CREATE POLICY "Cualquiera puede crear experiencias"
    ON experiencias_sobrenaturales
    FOR INSERT
    WITH CHECK (true);

-- Política: Solo el autor puede actualizar sus experiencias (por hash)
CREATE POLICY "Autores pueden actualizar sus experiencias"
    ON experiencias_sobrenaturales
    FOR UPDATE
    USING (autor_hash = current_setting('request.jwt.claim.user_hash', true))
    WITH CHECK (autor_hash = current_setting('request.jwt.claim.user_hash', true));

