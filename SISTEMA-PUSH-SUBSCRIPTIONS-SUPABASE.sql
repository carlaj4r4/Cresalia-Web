-- ===== SISTEMA DE PUSH SUBSCRIPTIONS - CRESALIA =====
-- Tabla para guardar suscripciones de usuarios a Push Notifications
-- Permite enviar notificaciones incluso cuando la página está cerrada

-- Tabla principal de suscripciones push
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    
    -- Datos de la suscripción (endpoint, keys)
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL, -- Public key del cliente
    auth TEXT NOT NULL, -- Auth secret del cliente
    
    -- Metadata del dispositivo
    user_agent TEXT,
    dispositivo VARCHAR(100), -- 'mobile', 'desktop', 'tablet'
    navegador VARCHAR(100), -- 'chrome', 'firefox', 'safari', etc.
    
    -- Estado y configuración
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_ultimo_uso TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_expiracion TIMESTAMP WITH TIME ZONE, -- Si el endpoint expira
    
    -- Índice único para evitar duplicados (mismo usuario + mismo endpoint)
    CONSTRAINT unique_user_endpoint UNIQUE(user_id, endpoint)
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_activo ON push_subscriptions(activo);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_fecha_ultimo_uso ON push_subscriptions(fecha_ultimo_uso);

-- Función para limpiar suscripciones inactivas o expiradas (ejecutar periódicamente)
CREATE OR REPLACE FUNCTION limpiar_subscripciones_push_expiradas()
RETURNS INTEGER AS $$
DECLARE
    eliminadas INTEGER;
BEGIN
    -- Eliminar suscripciones expiradas (más de 30 días sin uso) o marcadas como inactivas
    DELETE FROM push_subscriptions
    WHERE (activo = false)
       OR (fecha_ultimo_uso < NOW() - INTERVAL '30 days')
       OR (fecha_expiracion IS NOT NULL AND fecha_expiracion < NOW());
    
    GET DIAGNOSTICS eliminadas = ROW_COUNT;
    RETURN eliminadas;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar fecha de último uso
CREATE OR REPLACE FUNCTION actualizar_ultimo_uso_subscription(subscription_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE push_subscriptions
    SET fecha_ultimo_uso = NOW()
    WHERE id = subscription_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar fecha_ultimo_uso automáticamente (si se usa en otros sistemas)
-- Se puede agregar si es necesario

-- Comentarios de documentación
COMMENT ON TABLE push_subscriptions IS 'Almacena suscripciones de usuarios para recibir notificaciones push del navegador';
COMMENT ON COLUMN push_subscriptions.endpoint IS 'URL única del servicio de push (proveedor: Chrome, Firefox, etc.)';
COMMENT ON COLUMN push_subscriptions.p256dh IS 'Clave pública del cliente para encriptación (formato Base64)';
COMMENT ON COLUMN push_subscriptions.auth IS 'Secreto de autenticación del cliente (formato Base64)';
COMMENT ON COLUMN push_subscriptions.fecha_expiracion IS 'Fecha de expiración de la suscripción (si el proveedor la proporciona)';
