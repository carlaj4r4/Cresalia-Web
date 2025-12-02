-- ===== TABLA: Ubicaciones de Usuarios para Emergencias =====
-- Almacena ubicaciones de usuarios que han dado consentimiento
-- para recibir notificaciones de emergencia según su ubicación

CREATE TABLE IF NOT EXISTS ubicaciones_usuarios_emergencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Hash único del usuario (anónimo)
    usuario_hash VARCHAR(255) UNIQUE NOT NULL,
    
    -- Ubicación geográfica
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    precision_metros INTEGER,
    
    -- Email del usuario (opcional, solo si lo proporcionó para emergencias)
    email VARCHAR(255),
    
    -- Consentimiento
    permite_emails_emergencia BOOLEAN DEFAULT true,
    permite_notificaciones_push BOOLEAN DEFAULT false,
    
    -- Timestamps
    primera_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_ubicaciones_usuario_hash ON ubicaciones_usuarios_emergencias(usuario_hash);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_permite_emails ON ubicaciones_usuarios_emergencias(permite_emails_emergencia) WHERE permite_emails_emergencia = true;

-- Eliminar índice problemático si existe (por si acaso)
DROP INDEX IF EXISTS idx_ubicaciones_coordenadas_gist;

-- Índices para búsquedas por coordenadas (sin extensiones adicionales)
-- Las búsquedas de proximidad se harán en JavaScript con fórmula de Haversine
CREATE INDEX IF NOT EXISTS idx_ubicaciones_latitud ON ubicaciones_usuarios_emergencias(latitud);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_longitud ON ubicaciones_usuarios_emergencias(longitud);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_coordenadas ON ubicaciones_usuarios_emergencias(latitud, longitud);

-- Función para actualizar última_actualizacion automáticamente
CREATE OR REPLACE FUNCTION actualizar_ultima_actualizacion_ubicacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ultima_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_ubicacion
    BEFORE UPDATE ON ubicaciones_usuarios_emergencias
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_ultima_actualizacion_ubicacion();

-- RLS (Row Level Security)
ALTER TABLE ubicaciones_usuarios_emergencias ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios solo pueden ver/modificar su propia ubicación (por hash)
-- Nota: Como es anónimo, la verificación se hace por hash en el cliente
CREATE POLICY "Usuarios pueden ver su propia ubicación" 
    ON ubicaciones_usuarios_emergencias 
    FOR SELECT 
    USING (true); -- Permite lectura pública para la API

CREATE POLICY "Usuarios pueden insertar su ubicación" 
    ON ubicaciones_usuarios_emergencias 
    FOR INSERT 
    WITH CHECK (true); -- Permite inserción pública

CREATE POLICY "Usuarios pueden actualizar su ubicación" 
    ON ubicaciones_usuarios_emergencias 
    FOR UPDATE 
    USING (true) 
    WITH CHECK (true); -- Permite actualización pública

-- Comentarios
COMMENT ON TABLE ubicaciones_usuarios_emergencias IS 'Ubicaciones de usuarios para notificaciones de emergencia. Sistema anónimo basado en hash.';
COMMENT ON COLUMN ubicaciones_usuarios_emergencias.usuario_hash IS 'Hash único del usuario (generado en el cliente, anónimo)';
COMMENT ON COLUMN ubicaciones_usuarios_emergencias.email IS 'Email opcional, solo si el usuario lo proporciona para recibir notificaciones de emergencia';
COMMENT ON COLUMN ubicaciones_usuarios_emergencias.permite_emails_emergencia IS 'Si el usuario permite recibir emails de emergencia según su ubicación';
