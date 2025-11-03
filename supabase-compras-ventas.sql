-- ============================================
-- 🛒 SISTEMA DE COMPRAS Y VENTAS
-- Cresalia Platform - Historial de transacciones
-- ============================================

-- ===== 1. TABLA DE PEDIDOS/ORDENES =====
CREATE TABLE IF NOT EXISTS pedidos (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(100) NOT NULL,
    comprador_id BIGINT REFERENCES compradores(id),
    numero_pedido VARCHAR(50) UNIQUE NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'procesando', 'enviado', 'entregado', 'cancelado')),
    total DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    impuestos DECIMAL(10,2) DEFAULT 0.00,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    metodo_pago VARCHAR(50),
    direccion_entrega JSONB,
    notas TEXT,
    fecha_pedido TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_confirmacion TIMESTAMP WITH TIME ZONE,
    fecha_entrega TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 2. TABLA DE DETALLES DE PEDIDOS =====
CREATE TABLE IF NOT EXISTS pedido_detalles (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id BIGINT REFERENCES productos(id),
    servicio_id BIGINT REFERENCES servicios(id),
    tipo VARCHAR(10) CHECK (tipo IN ('producto', 'servicio')),
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 3. TABLA DE TRANSACCIONES =====
CREATE TABLE IF NOT EXISTS transacciones (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT REFERENCES pedidos(id),
    tienda_id VARCHAR(100) NOT NULL,
    comprador_id BIGINT REFERENCES compradores(id),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('compra', 'reembolso', 'devolucion')),
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completada', 'fallida', 'cancelada')),
    referencia_externa VARCHAR(255), -- ID de Stripe, PayPal, etc.
    fecha_transaccion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 4. TABLA DE ESTADÍSTICAS DE VENTAS =====
CREATE TABLE IF NOT EXISTS tienda_estadisticas_ventas (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(100) NOT NULL UNIQUE,
    total_ventas DECIMAL(10,2) DEFAULT 0.00,
    total_pedidos INTEGER DEFAULT 0,
    total_clientes INTEGER DEFAULT 0,
    promedio_pedido DECIMAL(10,2) DEFAULT 0.00,
    ventas_mes_actual DECIMAL(10,2) DEFAULT 0.00,
    pedidos_mes_actual INTEGER DEFAULT 0,
    ultima_venta TIMESTAMP WITH TIME ZONE,
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 5. TABLA DE HISTORIAL DE COMPRAS (para compradores) =====
CREATE TABLE IF NOT EXISTS comprador_historial (
    id BIGSERIAL PRIMARY KEY,
    comprador_id BIGINT REFERENCES compradores(id),
    tienda_id VARCHAR(100) NOT NULL,
    pedido_id BIGINT REFERENCES pedidos(id),
    total_compra DECIMAL(10,2) NOT NULL,
    fecha_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado_pedido VARCHAR(20),
    productos_comprados JSONB, -- Lista de productos/servicios
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ÍNDICES =====
CREATE INDEX IF NOT EXISTS idx_pedidos_tienda_id ON pedidos(tienda_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_comprador_id ON pedidos(comprador_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha_pedido);

CREATE INDEX IF NOT EXISTS idx_pedido_detalles_pedido_id ON pedido_detalles(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedido_detalles_producto_id ON pedido_detalles(producto_id);
CREATE INDEX IF NOT EXISTS idx_pedido_detalles_servicio_id ON pedido_detalles(servicio_id);

CREATE INDEX IF NOT EXISTS idx_transacciones_tienda_id ON transacciones(tienda_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_comprador_id ON transacciones(comprador_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_estado ON transacciones(estado);

CREATE INDEX IF NOT EXISTS idx_estadisticas_ventas_tienda_id ON tienda_estadisticas_ventas(tienda_id);

CREATE INDEX IF NOT EXISTS idx_comprador_historial_comprador_id ON comprador_historial(comprador_id);
CREATE INDEX IF NOT EXISTS idx_comprador_historial_tienda_id ON comprador_historial(tienda_id);

-- ===== FUNCIONES PARA ACTUALIZAR ESTADÍSTICAS =====

-- Función para actualizar estadísticas de ventas
CREATE OR REPLACE FUNCTION actualizar_estadisticas_ventas() RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar estadísticas cuando se crea o actualiza un pedido
    INSERT INTO tienda_estadisticas_ventas (
        tienda_id, 
        total_ventas, 
        total_pedidos, 
        total_clientes,
        promedio_pedido,
        ventas_mes_actual,
        pedidos_mes_actual,
        ultima_venta,
        ultima_actualizacion
    )
    SELECT 
        NEW.tienda_id,
        COALESCE(SUM(total), 0) as total_ventas,
        COUNT(*) as total_pedidos,
        COUNT(DISTINCT comprador_id) as total_clientes,
        COALESCE(ROUND(AVG(total), 2), 0) as promedio_pedido,
        COALESCE(SUM(CASE WHEN DATE_TRUNC('month', fecha_pedido) = DATE_TRUNC('month', NOW()) THEN total ELSE 0 END), 0) as ventas_mes_actual,
        COUNT(CASE WHEN DATE_TRUNC('month', fecha_pedido) = DATE_TRUNC('month', NOW()) THEN 1 END) as pedidos_mes_actual,
        MAX(fecha_pedido) as ultima_venta,
        NOW() as ultima_actualizacion
    FROM pedidos 
    WHERE tienda_id = NEW.tienda_id AND estado NOT IN ('cancelado')
    ON CONFLICT (tienda_id) 
    DO UPDATE SET
        total_ventas = EXCLUDED.total_ventas,
        total_pedidos = EXCLUDED.total_pedidos,
        total_clientes = EXCLUDED.total_clientes,
        promedio_pedido = EXCLUDED.promedio_pedido,
        ventas_mes_actual = EXCLUDED.ventas_mes_actual,
        pedidos_mes_actual = EXCLUDED.pedidos_mes_actual,
        ultima_venta = EXCLUDED.ultima_venta,
        ultima_actualizacion = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===== TRIGGERS =====
DROP TRIGGER IF EXISTS trigger_actualizar_estadisticas_ventas ON pedidos;
CREATE TRIGGER trigger_actualizar_estadisticas_ventas
    AFTER INSERT OR UPDATE ON pedidos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_estadisticas_ventas();

-- ===== DATOS DE EJEMPLO =====

-- Insertar pedidos de ejemplo
INSERT INTO pedidos (tienda_id, comprador_id, numero_pedido, estado, total, subtotal, metodo_pago) VALUES
('ejemplo-tienda', 1, 'PED-001-2024', 'entregado', 79.98, 79.98, 'tarjeta'),
('ejemplo-tienda', 2, 'PED-002-2024', 'procesando', 125.00, 125.00, 'paypal')
ON CONFLICT DO NOTHING;

-- ===== COMENTARIOS =====
COMMENT ON TABLE pedidos IS 'Pedidos realizados por compradores en las tiendas';
COMMENT ON TABLE pedido_detalles IS 'Detalles específicos de cada pedido';
COMMENT ON TABLE transacciones IS 'Registro de transacciones financieras';
COMMENT ON TABLE tienda_estadisticas_ventas IS 'Estadísticas agregadas de ventas por tienda';
COMMENT ON TABLE comprador_historial IS 'Historial de compras de cada comprador';














