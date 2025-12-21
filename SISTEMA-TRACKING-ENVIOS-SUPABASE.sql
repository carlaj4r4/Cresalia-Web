-- ============================================
-- 📦 SISTEMA DE TRACKING DE ENVÍOS
-- Mejoras a las tablas de pedidos/compras para tracking completo
-- ============================================

-- ===== 1. MEJORAR TABLA PEDIDOS CON TRACKING =====
-- Agregar campos de tracking si no existen
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS numero_seguimiento VARCHAR(100),
ADD COLUMN IF NOT EXISTS empresa_envio VARCHAR(100), -- "Correo Argentino", "OCA", "Andreani", etc.
ADD COLUMN IF NOT EXISTS fecha_estimada_entrega DATE,
ADD COLUMN IF NOT EXISTS tracking_url TEXT, -- URL para rastrear en el sitio de la empresa de envío
ADD COLUMN IF NOT EXISTS historial_tracking JSONB DEFAULT '[]'::jsonb; -- Historial de cambios de estado

-- ===== 2. MEJORAR TABLA COMPRAS CON TRACKING =====
-- La tabla compras ya tiene numero_seguimiento, pero agreguemos campos adicionales
ALTER TABLE compras 
ADD COLUMN IF NOT EXISTS empresa_envio VARCHAR(100),
ADD COLUMN IF NOT EXISTS tracking_url TEXT,
ADD COLUMN IF NOT EXISTS historial_tracking JSONB DEFAULT '[]'::jsonb;

-- ===== 3. TABLA DE HISTORIAL DE TRACKING (OPCIONAL - Más detallado) =====
CREATE TABLE IF NOT EXISTS tracking_historial (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT, -- Puede referenciar pedidos(id) o compras(id)
    tabla_origen VARCHAR(50) NOT NULL, -- 'pedidos' o 'compras'
    estado_anterior VARCHAR(50),
    estado_nuevo VARCHAR(50) NOT NULL,
    ubicacion TEXT, -- Ubicación actual del paquete
    mensaje TEXT, -- Mensaje descriptivo del estado
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_por VARCHAR(100), -- 'sistema', 'vendedor', 'transportista', etc.
    metadata JSONB DEFAULT '{}'::jsonb, -- Información adicional
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para tracking_historial
CREATE INDEX IF NOT EXISTS idx_tracking_historial_pedido ON tracking_historial(pedido_id, tabla_origen);
CREATE INDEX IF NOT EXISTS idx_tracking_historial_fecha ON tracking_historial(fecha_actualizacion DESC);

-- ===== 4. FUNCIÓN PARA ACTUALIZAR TRACKING =====
CREATE OR REPLACE FUNCTION actualizar_tracking_pedido(
    p_pedido_id BIGINT,
    p_tabla_origen VARCHAR(50),
    p_estado_nuevo VARCHAR(50),
    p_ubicacion TEXT DEFAULT NULL,
    p_mensaje TEXT DEFAULT NULL,
    p_numero_seguimiento VARCHAR(100) DEFAULT NULL,
    p_empresa_envio VARCHAR(100) DEFAULT NULL,
    p_tracking_url TEXT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
    v_estado_anterior VARCHAR(50);
BEGIN
    -- Obtener estado anterior
    IF p_tabla_origen = 'pedidos' THEN
        SELECT estado INTO v_estado_anterior FROM pedidos WHERE id = p_pedido_id;
        
        -- Actualizar pedido
        UPDATE pedidos 
        SET estado = p_estado_nuevo,
            numero_seguimiento = COALESCE(p_numero_seguimiento, numero_seguimiento),
            empresa_envio = COALESCE(p_empresa_envio, empresa_envio),
            tracking_url = COALESCE(p_tracking_url, tracking_url),
            historial_tracking = historial_tracking || jsonb_build_object(
                'fecha', NOW(),
                'estado', p_estado_nuevo,
                'ubicacion', p_ubicacion,
                'mensaje', p_mensaje
            ),
            updated_at = NOW()
        WHERE id = p_pedido_id;
        
    ELSIF p_tabla_origen = 'compras' THEN
        SELECT estado INTO v_estado_anterior FROM compras WHERE id = p_pedido_id;
        
        -- Actualizar compra
        UPDATE compras 
        SET estado = p_estado_nuevo,
            numero_seguimiento = COALESCE(p_numero_seguimiento, numero_seguimiento),
            empresa_envio = COALESCE(p_empresa_envio, empresa_envio),
            tracking_url = COALESCE(p_tracking_url, tracking_url),
            historial_tracking = historial_tracking || jsonb_build_object(
                'fecha', NOW(),
                'estado', p_estado_nuevo,
                'ubicacion', p_ubicacion,
                'mensaje', p_mensaje
            ),
            updated_at = NOW()
        WHERE id = p_pedido_id;
    END IF;
    
    -- Registrar en historial detallado
    INSERT INTO tracking_historial (
        pedido_id,
        tabla_origen,
        estado_anterior,
        estado_nuevo,
        ubicacion,
        mensaje,
        actualizado_por
    ) VALUES (
        p_pedido_id,
        p_tabla_origen,
        v_estado_anterior,
        p_estado_nuevo,
        p_ubicacion,
        p_mensaje,
        'sistema'
    );
END;
$$ LANGUAGE plpgsql;

-- ===== 5. ESTADOS DE TRACKING ESTÁNDAR =====
-- Estados sugeridos para pedidos:
-- 'pendiente' - Pedido recibido, esperando pago
-- 'confirmado' - Pago confirmado
-- 'preparando' - Preparando el pedido
-- 'listo_para_envio' - Empaquetado, listo para enviar
-- 'en_transito' - En camino
-- 'en_distribucion' - En centro de distribución local
-- 'en_entrega' - En camino al destinatario
-- 'entregado' - Entregado exitosamente
-- 'problema_envio' - Problema con el envío
-- 'cancelado' - Pedido cancelado
-- 'reembolsado' - Reembolsado

-- ===== COMENTARIOS =====
COMMENT ON COLUMN pedidos.numero_seguimiento IS 'Número de seguimiento proporcionado por la empresa de envío';
COMMENT ON COLUMN pedidos.empresa_envio IS 'Nombre de la empresa de envío (Correo Argentino, OCA, Andreani, etc.)';
COMMENT ON COLUMN pedidos.tracking_url IS 'URL completa para rastrear el pedido en el sitio de la empresa de envío';
COMMENT ON COLUMN pedidos.historial_tracking IS 'Array JSON con historial de cambios de estado del pedido';
COMMENT ON TABLE tracking_historial IS 'Historial detallado de tracking de pedidos/compras';
