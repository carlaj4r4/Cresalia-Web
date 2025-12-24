-- ============================================
-- 🔔 SISTEMA DE NOTIFICACIONES DE STOCK
-- Alertas cuando productos agotados vuelven a tener stock
-- ============================================

-- ===== TABLA DE ALERTAS DE STOCK =====
CREATE TABLE IF NOT EXISTS alertas_stock (
    id BIGSERIAL PRIMARY KEY,
    comprador_id UUID REFERENCES compradores(id) ON DELETE CASCADE,
    producto_id BIGINT NOT NULL, -- ID del producto
    tienda_id VARCHAR(100) NOT NULL, -- ID de la tienda
    stock_anterior INTEGER DEFAULT 0, -- Stock cuando se registró la alerta
    notificado BOOLEAN DEFAULT false, -- Si ya se envió la notificación
    activo BOOLEAN DEFAULT true, -- Si la alerta está activa
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_notificacion TIMESTAMP WITH TIME ZONE, -- Cuando se envió la notificación
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Evitar duplicados
    UNIQUE(comprador_id, producto_id, tienda_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_alertas_stock_comprador ON alertas_stock(comprador_id);
CREATE INDEX IF NOT EXISTS idx_alertas_stock_producto ON alertas_stock(producto_id, tienda_id);
CREATE INDEX IF NOT EXISTS idx_alertas_stock_activo ON alertas_stock(activo, notificado);
CREATE INDEX IF NOT EXISTS idx_alertas_stock_fecha ON alertas_stock(fecha_registro DESC);

-- ===== TABLA DE HISTORIAL DE NOTIFICACIONES DE STOCK =====
CREATE TABLE IF NOT EXISTS historial_notificaciones_stock (
    id BIGSERIAL PRIMARY KEY,
    alerta_id BIGINT REFERENCES alertas_stock(id) ON DELETE CASCADE,
    comprador_id UUID REFERENCES compradores(id) ON DELETE CASCADE,
    producto_id BIGINT NOT NULL,
    tienda_id VARCHAR(100) NOT NULL,
    stock_anterior INTEGER,
    stock_nuevo INTEGER,
    metodo_notificacion VARCHAR(50) DEFAULT 'push', -- 'push', 'email', 'sms'
    enviado BOOLEAN DEFAULT false,
    fecha_envio TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_historial_notif_stock_comprador ON historial_notificaciones_stock(comprador_id);
CREATE INDEX IF NOT EXISTS idx_historial_notif_stock_fecha ON historial_notificaciones_stock(fecha_envio DESC);

-- ===== FUNCIÓN: Registrar alerta de stock =====
CREATE OR REPLACE FUNCTION registrar_alerta_stock(
    p_comprador_id UUID,
    p_producto_id BIGINT,
    p_tienda_id VARCHAR(100),
    p_stock_actual INTEGER DEFAULT 0
) RETURNS TABLE (
    exito BOOLEAN,
    mensaje TEXT,
    alerta_id BIGINT
) AS $$
DECLARE
    v_alerta_id BIGINT;
    v_existe BOOLEAN;
BEGIN
    -- Verificar si ya existe una alerta activa
    SELECT EXISTS(
        SELECT 1 FROM alertas_stock
        WHERE comprador_id = p_comprador_id
        AND producto_id = p_producto_id
        AND tienda_id = p_tienda_id
        AND activo = true
    ) INTO v_existe;
    
    IF v_existe THEN
        RETURN QUERY SELECT false, 'Ya tenés una alerta activa para este producto'::TEXT, NULL::BIGINT;
        RETURN;
    END IF;
    
    -- Crear nueva alerta
    INSERT INTO alertas_stock (
        comprador_id,
        producto_id,
        tienda_id,
        stock_anterior
    ) VALUES (
        p_comprador_id,
        p_producto_id,
        p_tienda_id,
        p_stock_actual
    )
    RETURNING id INTO v_alerta_id;
    
    RETURN QUERY SELECT true, 
        'Alerta de stock registrada. Te notificaremos cuando vuelva a estar disponible'::TEXT,
        v_alerta_id;
END;
$$ LANGUAGE plpgsql;

-- ===== FUNCIÓN: Verificar y notificar cambios de stock =====
CREATE OR REPLACE FUNCTION verificar_cambios_stock(
    p_producto_id BIGINT,
    p_tienda_id VARCHAR(100),
    p_stock_nuevo INTEGER
) RETURNS INTEGER AS $$
DECLARE
    v_alertas_activadas INTEGER := 0;
    v_alerta RECORD;
BEGIN
    -- Buscar alertas activas para este producto donde el stock anterior era 0 y ahora hay stock
    FOR v_alerta IN 
        SELECT * FROM alertas_stock
        WHERE producto_id = p_producto_id
        AND tienda_id = p_tienda_id
        AND activo = true
        AND notificado = false
        AND stock_anterior = 0
        AND p_stock_nuevo > 0
    LOOP
        -- Marcar como notificado
        UPDATE alertas_stock
        SET notificado = true,
            fecha_notificacion = NOW(),
            activo = false, -- Desactivar después de notificar
            updated_at = NOW()
        WHERE id = v_alerta.id;
        
        -- Registrar en historial
        INSERT INTO historial_notificaciones_stock (
            alerta_id,
            comprador_id,
            producto_id,
            tienda_id,
            stock_anterior,
            stock_nuevo,
            enviado
        ) VALUES (
            v_alerta.id,
            v_alerta.comprador_id,
            p_producto_id,
            p_tienda_id,
            v_alerta.stock_anterior,
            p_stock_nuevo,
            false -- Se marcará como true cuando se envíe realmente
        );
        
        v_alertas_activadas := v_alertas_activadas + 1;
    END LOOP;
    
    RETURN v_alertas_activadas;
END;
$$ LANGUAGE plpgsql;

-- ===== TRIGGER: Detectar cambios de stock automáticamente =====
-- Este trigger se ejecuta cuando se actualiza el stock de un producto
CREATE OR REPLACE FUNCTION trigger_verificar_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Si el stock cambió de 0 a > 0, verificar alertas
    IF OLD.stock = 0 AND NEW.stock > 0 THEN
        PERFORM verificar_cambios_stock(NEW.id, NEW.tienda_id, NEW.stock);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger (si la tabla productos existe)
-- NOTA: Este trigger se debe crear manualmente si la tabla productos tiene el campo stock
-- DROP TRIGGER IF EXISTS trigger_stock_cambio ON productos;
-- CREATE TRIGGER trigger_stock_cambio
--     AFTER UPDATE OF stock ON productos
--     FOR EACH ROW
--     WHEN (OLD.stock IS DISTINCT FROM NEW.stock)
--     EXECUTE FUNCTION trigger_verificar_stock();

-- ===== FUNCIÓN: Obtener alertas activas del comprador =====
CREATE OR REPLACE FUNCTION obtener_alertas_stock_comprador(p_comprador_id UUID)
RETURNS TABLE (
    id BIGINT,
    producto_id BIGINT,
    tienda_id VARCHAR(100),
    stock_anterior INTEGER,
    fecha_registro TIMESTAMP WITH TIME ZONE,
    producto_nombre TEXT,
    producto_imagen TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.producto_id,
        a.tienda_id,
        a.stock_anterior,
        a.fecha_registro,
        COALESCE(p.nombre, 'Producto no encontrado')::TEXT as producto_nombre,
        COALESCE(p.imagen_url, p.imagen_principal, '')::TEXT as producto_imagen
    FROM alertas_stock a
    LEFT JOIN productos p ON p.id = a.producto_id AND p.tienda_id = a.tienda_id
    WHERE a.comprador_id = p_comprador_id
    AND a.activo = true
    ORDER BY a.fecha_registro DESC;
END;
$$ LANGUAGE plpgsql;

-- ===== FUNCIÓN: Cancelar alerta de stock =====
CREATE OR REPLACE FUNCTION cancelar_alerta_stock(
    p_comprador_id UUID,
    p_producto_id BIGINT,
    p_tienda_id VARCHAR(100)
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE alertas_stock
    SET activo = false,
        updated_at = NOW()
    WHERE comprador_id = p_comprador_id
    AND producto_id = p_producto_id
    AND tienda_id = p_tienda_id
    AND activo = true;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ===== COMENTARIOS =====
COMMENT ON TABLE alertas_stock IS 'Alertas de compradores para productos sin stock';
COMMENT ON TABLE historial_notificaciones_stock IS 'Historial de notificaciones de stock enviadas';
COMMENT ON FUNCTION registrar_alerta_stock IS 'Registra una nueva alerta de stock para un comprador';
COMMENT ON FUNCTION verificar_cambios_stock IS 'Verifica cambios de stock y activa notificaciones';
COMMENT ON FUNCTION obtener_alertas_stock_comprador IS 'Obtiene todas las alertas activas de un comprador';
