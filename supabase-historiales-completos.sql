-- ===== TABLAS DE HISTORIALES CRESALIA =====
-- Tablas para historial de ventas, compras y transacciones

-- ===== TABLA: HISTORIAL DE VENTAS =====
CREATE TABLE IF NOT EXISTS historial_ventas (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    producto_nombre VARCHAR(500) NOT NULL,
    producto_id VARCHAR(255),
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_email VARCHAR(255),
    cliente_telefono VARCHAR(50),
    precio DECIMAL(10,2) NOT NULL,
    cantidad INTEGER DEFAULT 1,
    descuento DECIMAL(5,2) DEFAULT 0,
    comision_mercado_pago DECIMAL(10,2) DEFAULT 0,
    comision_cresalia DECIMAL(10,2) DEFAULT 0,
    neto_vendedor DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(100) NOT NULL,
    estado VARCHAR(50) DEFAULT 'completado',
    fecha_venta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    detalles TEXT,
    tracking VARCHAR(255),
    notas_vendedor TEXT,
    direccion_entrega TEXT,
    datos_adicionales JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA: HISTORIAL DE COMPRAS =====
CREATE TABLE IF NOT EXISTS historial_compras (
    id SERIAL PRIMARY KEY,
    comprador_email VARCHAR(255) NOT NULL,
    comprador_nombre VARCHAR(255) NOT NULL,
    tienda_id VARCHAR(255) NOT NULL,
    tienda_nombre VARCHAR(500) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    producto_nombre VARCHAR(500) NOT NULL,
    producto_id VARCHAR(255),
    precio DECIMAL(10,2) NOT NULL,
    cantidad INTEGER DEFAULT 1,
    descuento DECIMAL(5,2) DEFAULT 0,
    total_pagado DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(100) NOT NULL,
    estado VARCHAR(50) DEFAULT 'completado',
    fecha_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tracking VARCHAR(255),
    direccion_entrega TEXT,
    notas_compra TEXT,
    calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario_calificacion TEXT,
    datos_adicionales JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA: TRANSACCIONES FINANCIERAS =====
CREATE TABLE IF NOT EXISTS transacciones_financieras (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    tipo_transaccion VARCHAR(50) NOT NULL, -- 'venta', 'comision', 'retiro', 'devolucion'
    monto DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'ARS',
    descripcion TEXT NOT NULL,
    referencia_id VARCHAR(255), -- ID de la venta o transacción relacionada
    metodo_pago VARCHAR(100),
    estado VARCHAR(50) DEFAULT 'procesado',
    fecha_transaccion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_procesamiento TIMESTAMP WITH TIME ZONE,
    datos_transaccion JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA: SALDOS DE TIENDAS =====
CREATE TABLE IF NOT EXISTS saldos_tiendas (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) UNIQUE NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    saldo_disponible DECIMAL(10,2) DEFAULT 0,
    saldo_pendiente DECIMAL(10,2) DEFAULT 0,
    saldo_bloqueado DECIMAL(10,2) DEFAULT 0,
    total_ganado DECIMAL(10,2) DEFAULT 0,
    total_comisiones DECIMAL(10,2) DEFAULT 0,
    ultima_transaccion TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA: MOVIMIENTOS DE SALDO =====
CREATE TABLE IF NOT EXISTS movimientos_saldo (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    tipo_movimiento VARCHAR(50) NOT NULL, -- 'ingreso', 'egreso', 'comision', 'retiro'
    monto DECIMAL(10,2) NOT NULL,
    saldo_anterior DECIMAL(10,2) NOT NULL,
    saldo_nuevo DECIMAL(10,2) NOT NULL,
    descripcion TEXT NOT NULL,
    referencia_id VARCHAR(255),
    fecha_movimiento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA: RETIROS DE DINERO =====
CREATE TABLE IF NOT EXISTS retiros_dinero (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo_retiro VARCHAR(100) NOT NULL, -- 'transferencia', 'mercadopago', 'paypal'
    datos_retiro JSONB NOT NULL, -- datos bancarios, cuenta, etc.
    estado VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'procesado', 'rechazado'
    fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_procesamiento TIMESTAMP WITH TIME ZONE,
    motivo_rechazo TEXT,
    referencia_externa VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA: ESTADÍSTICAS DE VENTAS =====
CREATE TABLE IF NOT EXISTS estadisticas_ventas_tienda (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    ventas_dia INTEGER DEFAULT 0,
    ingresos_dia DECIMAL(10,2) DEFAULT 0,
    productos_vendidos INTEGER DEFAULT 0,
    nuevos_clientes INTEGER DEFAULT 0,
    comisiones_dia DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tienda_id, fecha)
);

-- ===== TABLA: AUDITORÍA DE TRANSACCIONES =====
CREATE TABLE IF NOT EXISTS auditoria_transacciones (
    id SERIAL PRIMARY KEY,
    transaccion_id VARCHAR(255) NOT NULL,
    tipo_transaccion VARCHAR(50) NOT NULL,
    accion VARCHAR(50) NOT NULL, -- 'crear', 'actualizar', 'eliminar', 'procesar'
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    usuario_email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    fecha_auditoria TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ÍNDICES PARA OPTIMIZACIÓN =====

-- Índices para historial_ventas
CREATE INDEX IF NOT EXISTS idx_historial_ventas_tienda_id ON historial_ventas(tienda_id);
CREATE INDEX IF NOT EXISTS idx_historial_ventas_vendedor_email ON historial_ventas(vendedor_email);
CREATE INDEX IF NOT EXISTS idx_historial_ventas_fecha_venta ON historial_ventas(fecha_venta);
CREATE INDEX IF NOT EXISTS idx_historial_ventas_estado ON historial_ventas(estado);
CREATE INDEX IF NOT EXISTS idx_historial_ventas_cliente_email ON historial_ventas(cliente_email);

-- Índices para historial_compras
CREATE INDEX IF NOT EXISTS idx_historial_compras_comprador_email ON historial_compras(comprador_email);
CREATE INDEX IF NOT EXISTS idx_historial_compras_tienda_id ON historial_compras(tienda_id);
CREATE INDEX IF NOT EXISTS idx_historial_compras_fecha_compra ON historial_compras(fecha_compra);
CREATE INDEX IF NOT EXISTS idx_historial_compras_estado ON historial_compras(estado);

-- Índices para transacciones_financieras
CREATE INDEX IF NOT EXISTS idx_transacciones_tienda_id ON transacciones_financieras(tienda_id);
CREATE INDEX IF NOT EXISTS idx_transacciones_vendedor_email ON transacciones_financieras(vendedor_email);
CREATE INDEX IF NOT EXISTS idx_transacciones_tipo ON transacciones_financieras(tipo_transaccion);
CREATE INDEX IF NOT EXISTS idx_transacciones_fecha ON transacciones_financieras(fecha_transaccion);

-- Índices para saldos_tiendas
CREATE INDEX IF NOT EXISTS idx_saldos_tienda_id ON saldos_tiendas(tienda_id);
CREATE INDEX IF NOT EXISTS idx_saldos_vendedor_email ON saldos_tiendas(vendedor_email);

-- Índices para movimientos_saldo
CREATE INDEX IF NOT EXISTS idx_movimientos_tienda_id ON movimientos_saldo(tienda_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_vendedor_email ON movimientos_saldo(vendedor_email);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha ON movimientos_saldo(fecha_movimiento);

-- Índices para retiros_dinero
CREATE INDEX IF NOT EXISTS idx_retiros_tienda_id ON retiros_dinero(tienda_id);
CREATE INDEX IF NOT EXISTS idx_retiros_vendedor_email ON retiros_dinero(vendedor_email);
CREATE INDEX IF NOT EXISTS idx_retiros_estado ON retiros_dinero(estado);
CREATE INDEX IF NOT EXISTS idx_retiros_fecha_solicitud ON retiros_dinero(fecha_solicitud);

-- Índices para estadísticas
CREATE INDEX IF NOT EXISTS idx_estadisticas_tienda_fecha ON estadisticas_ventas_tienda(tienda_id, fecha);
CREATE INDEX IF NOT EXISTS idx_estadisticas_vendedor_email ON estadisticas_ventas_tienda(vendedor_email);

-- Índices para auditoría
CREATE INDEX IF NOT EXISTS idx_auditoria_transaccion_id ON auditoria_transacciones(transaccion_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria_transacciones(fecha_auditoria);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria_transacciones(usuario_email);

-- ===== TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA =====

-- Trigger para actualizar updated_at en historial_ventas
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_historial_ventas_updated_at BEFORE UPDATE ON historial_ventas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_historial_compras_updated_at BEFORE UPDATE ON historial_compras FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transacciones_updated_at BEFORE UPDATE ON transacciones_financieras FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_saldos_updated_at BEFORE UPDATE ON saldos_tiendas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_retiros_updated_at BEFORE UPDATE ON retiros_dinero FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_estadisticas_updated_at BEFORE UPDATE ON estadisticas_ventas_tienda FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== FUNCIONES ÚTILES =====

-- Función para calcular estadísticas de ventas de una tienda
CREATE OR REPLACE FUNCTION calcular_estadisticas_ventas(p_tienda_id VARCHAR(255), p_fecha_inicio DATE, p_fecha_fin DATE)
RETURNS TABLE (
    total_ventas BIGINT,
    total_ingresos DECIMAL(10,2),
    promedio_venta DECIMAL(10,2),
    total_comisiones DECIMAL(10,2),
    neto_vendedor DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_ventas,
        COALESCE(SUM(precio), 0) as total_ingresos,
        COALESCE(AVG(precio), 0) as promedio_venta,
        COALESCE(SUM(comision_cresalia), 0) as total_comisiones,
        COALESCE(SUM(neto_vendedor), 0) as neto_vendedor
    FROM historial_ventas
    WHERE tienda_id = p_tienda_id
    AND fecha_venta::DATE BETWEEN p_fecha_inicio AND p_fecha_fin
    AND estado = 'completado';
END;
$$ LANGUAGE plpgsql;

-- Función para obtener saldo actual de una tienda
CREATE OR REPLACE FUNCTION obtener_saldo_tienda(p_tienda_id VARCHAR(255))
RETURNS DECIMAL(10,2) AS $$
DECLARE
    saldo DECIMAL(10,2);
BEGIN
    SELECT saldo_disponible INTO saldo
    FROM saldos_tiendas
    WHERE tienda_id = p_tienda_id;
    
    RETURN COALESCE(saldo, 0);
END;
$$ LANGUAGE plpgsql;

-- ===== COMENTARIOS EN TABLAS =====
COMMENT ON TABLE historial_ventas IS 'Registro completo de todas las ventas realizadas por los vendedores';
COMMENT ON TABLE historial_compras IS 'Registro completo de todas las compras realizadas por los compradores';
COMMENT ON TABLE transacciones_financieras IS 'Registro de todas las transacciones financieras del sistema';
COMMENT ON TABLE saldos_tiendas IS 'Saldos actuales de cada tienda/vendedor';
COMMENT ON TABLE movimientos_saldo IS 'Historial de movimientos de saldo de cada tienda';
COMMENT ON TABLE retiros_dinero IS 'Solicitudes y procesamiento de retiros de dinero';
COMMENT ON TABLE estadisticas_ventas_tienda IS 'Estadísticas diarias de ventas por tienda';
COMMENT ON TABLE auditoria_transacciones IS 'Auditoría completa de todas las transacciones';

-- ===== DATOS DE EJEMPLO (OPCIONAL) =====
-- INSERT INTO saldos_tiendas (tienda_id, vendedor_email, saldo_disponible, total_ganado) 
-- VALUES ('ejemplo-tienda', 'demo@cresalia.com', 1500.00, 1500.00);

-- ===== FINALIZACIÓN =====
-- Todas las tablas, índices, triggers y funciones han sido creados
-- El sistema está listo para manejar historiales completos de ventas y compras











