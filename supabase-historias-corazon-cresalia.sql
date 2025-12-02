-- ===== TABLA: HISTORIAS CON CORAZÓN CRESALIA =====
-- Para TODOS los vendedores/emprendedores/servicios que quieren compartir su historia

-- Crear tabla
CREATE TABLE IF NOT EXISTS historias_corazon_cresalia (
    id BIGSERIAL PRIMARY KEY,
    vendedor_id VARCHAR(100) NOT NULL, -- ID del vendedor/tienda/servicio
    tipo_vendedor TEXT NOT NULL, -- 'tienda', 'servicio', 'emprendedor'
    nombre_negocio TEXT,
    historia TEXT NOT NULL,
    consejos TEXT, -- Consejos opcionales para ayudar a otros
    foto_url TEXT, -- URL de la foto del negocio o equipo
    donde_mostrar TEXT DEFAULT 'página_principal', -- 'página_principal', 'mi_página', 'ninguna', 'solo_vendedores'
    publica BOOLEAN DEFAULT true,
    activa BOOLEAN DEFAULT true,
    fecha_publicacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_historias_vendedor_id ON historias_corazon_cresalia(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_historias_tipo_vendedor ON historias_corazon_cresalia(tipo_vendedor);
CREATE INDEX IF NOT EXISTS idx_historias_donde_mostrar ON historias_corazon_cresalia(donde_mostrar);
CREATE INDEX IF NOT EXISTS idx_historias_publica ON historias_corazon_cresalia(publica);
CREATE INDEX IF NOT EXISTS idx_historias_activa ON historias_corazon_cresalia(activa);
CREATE INDEX IF NOT EXISTS idx_historias_fecha ON historias_corazon_cresalia(fecha_publicacion DESC);

-- RLS Policies
ALTER TABLE historias_corazon_cresalia ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede leer historias públicas
DROP POLICY IF EXISTS historias_lectura_publica ON historias_corazon_cresalia;
CREATE POLICY historias_lectura_publica ON historias_corazon_cresalia
    FOR SELECT
    USING (publica = true AND activa = true);

-- Política: Solo el vendedor puede ver su propia historia (incluso si no es pública)
DROP POLICY IF EXISTS historias_lectura_propia ON historias_corazon_cresalia;
CREATE POLICY historias_lectura_propia ON historias_corazon_cresalia
    FOR SELECT
    USING (
        auth.uid()::text = vendedor_id OR
        (publica = true AND activa = true)
    );

-- Política: Cualquier vendedor/emprendedor puede crear historias
DROP POLICY IF EXISTS historias_crear ON historias_corazon_cresalia;
CREATE POLICY historias_crear ON historias_corazon_cresalia
    FOR INSERT
    WITH CHECK (true); -- Todos los vendedores pueden crear historias

-- Política: Solo el vendedor puede actualizar su propia historia
DROP POLICY IF EXISTS historias_actualizar ON historias_corazon_cresalia;
CREATE POLICY historias_actualizar ON historias_corazon_cresalia
    FOR UPDATE
    USING (auth.uid()::text = vendedor_id)
    WITH CHECK (auth.uid()::text = vendedor_id);

-- Política: Solo el vendedor puede eliminar (desactivar) su propia historia
DROP POLICY IF EXISTS historias_eliminar ON historias_corazon_cresalia;
CREATE POLICY historias_eliminar ON historias_corazon_cresalia
    FOR UPDATE
    USING (auth.uid()::text = vendedor_id);

-- Trigger para actualizar fecha_actualizacion
DROP TRIGGER IF EXISTS trigger_actualizar_fecha_historias ON historias_corazon_cresalia;
CREATE TRIGGER trigger_actualizar_fecha_historias
    BEFORE UPDATE ON historias_corazon_cresalia
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE historias_corazon_cresalia IS 'Historias compartidas por vendedores/emprendedores/servicios de Cresalia';
COMMENT ON COLUMN historias_corazon_cresalia.vendedor_id IS 'ID del vendedor/tienda/servicio que comparte la historia';
COMMENT ON COLUMN historias_corazon_cresalia.tipo_vendedor IS 'Tipo: tienda, servicio, emprendedor';
COMMENT ON COLUMN historias_corazon_cresalia.nombre_negocio IS 'Nombre del negocio o emprendimiento';
COMMENT ON COLUMN historias_corazon_cresalia.historia IS 'Contenido de la historia';
COMMENT ON COLUMN historias_corazon_cresalia.consejos IS 'Consejos opcionales para ayudar a otros emprendedores';
COMMENT ON COLUMN historias_corazon_cresalia.foto_url IS 'URL de la foto del negocio o equipo';
COMMENT ON COLUMN historias_corazon_cresalia.donde_mostrar IS 'Dónde mostrar: página_principal, mi_página, ninguna, solo_vendedores';
COMMENT ON COLUMN historias_corazon_cresalia.publica IS 'Si la historia es pública o privada';
COMMENT ON COLUMN historias_corazon_cresalia.activa IS 'Si la historia está activa (no eliminada)';

