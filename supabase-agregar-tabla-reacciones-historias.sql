-- ========================================
-- TABLA DE REACCIONES PARA HISTORIAS DEL CORAZÓN
-- ========================================
-- Permite que los lectores reaccionen a las historias compartidas por emprendedores

-- Crear tabla de reacciones
CREATE TABLE IF NOT EXISTS historias_corazon_reacciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    historia_id UUID NOT NULL,
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tipo_reaccion TEXT NOT NULL CHECK (tipo_reaccion IN ('meGusta', 'corazon', 'aplausos', 'inspirador', 'fuerza')),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Un usuario solo puede tener una reacción de cada tipo por historia
    CONSTRAINT unique_reaccion_usuario_historia UNIQUE (historia_id, usuario_id, tipo_reaccion)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_reacciones_historia_id ON historias_corazon_reacciones(historia_id);
CREATE INDEX IF NOT EXISTS idx_reacciones_usuario_id ON historias_corazon_reacciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_reacciones_tipo ON historias_corazon_reacciones(tipo_reaccion);

-- Row Level Security (RLS)
ALTER TABLE historias_corazon_reacciones ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Los usuarios pueden ver todas las reacciones (para ver contadores)
CREATE POLICY "usuarios_ver_reacciones" ON historias_corazon_reacciones
    FOR SELECT
    USING (true);

-- Los usuarios pueden agregar sus propias reacciones
CREATE POLICY "usuarios_agregar_reacciones" ON historias_corazon_reacciones
    FOR INSERT
    WITH CHECK (auth.uid() = usuario_id);

-- Los usuarios pueden eliminar sus propias reacciones
CREATE POLICY "usuarios_eliminar_reacciones" ON historias_corazon_reacciones
    FOR DELETE
    USING (auth.uid() = usuario_id);

-- Función para obtener contadores de reacciones por historia
CREATE OR REPLACE FUNCTION obtener_contadores_reacciones(p_historia_id UUID)
RETURNS JSON AS $$
DECLARE
    resultado JSON;
BEGIN
    SELECT json_build_object(
        'meGusta', COALESCE(SUM(CASE WHEN tipo_reaccion = 'meGusta' THEN 1 ELSE 0 END), 0),
        'corazon', COALESCE(SUM(CASE WHEN tipo_reaccion = 'corazon' THEN 1 ELSE 0 END), 0),
        'aplausos', COALESCE(SUM(CASE WHEN tipo_reaccion = 'aplausos' THEN 1 ELSE 0 END), 0),
        'inspirador', COALESCE(SUM(CASE WHEN tipo_reaccion = 'inspirador' THEN 1 ELSE 0 END), 0),
        'fuerza', COALESCE(SUM(CASE WHEN tipo_reaccion = 'fuerza' THEN 1 ELSE 0 END), 0)
    ) INTO resultado
    FROM historias_corazon_reacciones
    WHERE historia_id = p_historia_id;
    
    RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar si un usuario ya reaccionó
CREATE OR REPLACE FUNCTION usuario_reacciono(p_historia_id UUID, p_usuario_id UUID, p_tipo TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM historias_corazon_reacciones 
        WHERE historia_id = p_historia_id 
        AND usuario_id = p_usuario_id 
        AND tipo_reaccion = p_tipo
    );
END;
$$ LANGUAGE plpgsql;

-- Comentarios en la tabla
COMMENT ON TABLE historias_corazon_reacciones IS 'Almacena las reacciones de los lectores a las historias del corazón compartidas por emprendedores';
COMMENT ON COLUMN historias_corazon_reacciones.historia_id IS 'ID de la historia a la que se reacciona';
COMMENT ON COLUMN historias_corazon_reacciones.usuario_id IS 'ID del usuario que reacciona';
COMMENT ON COLUMN historias_corazon_reacciones.tipo_reaccion IS 'Tipo de reacción: meGusta, corazon, aplausos, inspirador, fuerza';

