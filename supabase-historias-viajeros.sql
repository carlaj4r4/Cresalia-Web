-- ===== TABLA: HISTORIAS DE VIAJEROS =====
-- Comunidad para que viajeros compartan sus historias y experiencias
-- Co-fundadores: Carla & Claude

-- Tabla principal de historias
CREATE TABLE IF NOT EXISTS historias_viajeros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(500) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('aventura', 'cultural', 'relajante', 'trabajo', 'solo', 'otro')),
    destino VARCHAR(255) NOT NULL,
    continente VARCHAR(50) NOT NULL CHECK (continente IN ('america', 'europa', 'asia', 'africa', 'oceania', 'antartida')),
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
CREATE INDEX IF NOT EXISTS idx_historias_viajeros_estado ON historias_viajeros(estado);
CREATE INDEX IF NOT EXISTS idx_historias_viajeros_tipo ON historias_viajeros(tipo);
CREATE INDEX IF NOT EXISTS idx_historias_viajeros_continente ON historias_viajeros(continente);
CREATE INDEX IF NOT EXISTS idx_historias_viajeros_fecha ON historias_viajeros(fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_historias_viajeros_autor_hash ON historias_viajeros(autor_hash);

-- Comentarios en la tabla
COMMENT ON TABLE historias_viajeros IS 'Historias compartidas por viajeros en la comunidad de Cresalia';
COMMENT ON COLUMN historias_viajeros.tipo IS 'Tipo de historia: aventura, cultural, relajante, trabajo, solo, otro';
COMMENT ON COLUMN historias_viajeros.es_anonimo IS 'Si la historia se publica de forma anónima';
COMMENT ON COLUMN historias_viajeros.autor_hash IS 'Hash único del autor para identificar usuarios sin exponer datos personales';

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_historias_viajeros_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar fecha_actualizacion
DROP TRIGGER IF EXISTS trigger_update_historias_viajeros_updated_at ON historias_viajeros;
CREATE TRIGGER trigger_update_historias_viajeros_updated_at
    BEFORE UPDATE ON historias_viajeros
    FOR EACH ROW
    EXECUTE FUNCTION update_historias_viajeros_updated_at();

-- Row Level Security (RLS)
ALTER TABLE historias_viajeros ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas si existen (para evitar errores al ejecutar de nuevo)
DROP POLICY IF EXISTS "Cualquiera puede leer historias activas" ON historias_viajeros;
DROP POLICY IF EXISTS "Cualquiera puede crear historias" ON historias_viajeros;
DROP POLICY IF EXISTS "Autores pueden actualizar sus historias" ON historias_viajeros;

-- Política: Todos pueden leer historias activas
CREATE POLICY "Cualquiera puede leer historias activas"
    ON historias_viajeros
    FOR SELECT
    USING (estado = 'activo');

-- Política: Cualquiera puede insertar historias
CREATE POLICY "Cualquiera puede crear historias"
    ON historias_viajeros
    FOR INSERT
    WITH CHECK (true);

-- Política: Solo el autor puede actualizar sus historias (por hash)
CREATE POLICY "Autores pueden actualizar sus historias"
    ON historias_viajeros
    FOR UPDATE
    USING (autor_hash = current_setting('request.jwt.claim.user_hash', true))
    WITH CHECK (autor_hash = current_setting('request.jwt.claim.user_hash', true));

-- Nota: Para implementar la política de actualización basada en hash,
-- necesitarías pasar el hash del usuario en el contexto de Supabase.
-- Por ahora, la política de INSERT permite que cualquiera cree historias
-- y podemos manejar las actualizaciones a través de la API si es necesario.

