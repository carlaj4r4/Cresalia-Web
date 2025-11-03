-- ===== SISTEMA COMPLETO CRESALIA =====
-- Todas las tablas necesarias para el ecosistema completo

-- ===== TABLAS EXISTENTES (ya creadas) =====
-- tiendas, compradores, productos, servicios, feedbacks, etc.

-- ===== NUEVAS TABLAS PARA SISTEMA COMPLETO =====

-- Tabla para historial de ventas
CREATE TABLE IF NOT EXISTS historial_ventas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    comprador_id UUID REFERENCES compradores(id) ON DELETE SET NULL,
    producto_id UUID REFERENCES productos(id) ON DELETE SET NULL,
    servicio_id UUID REFERENCES servicios(id) ON DELETE SET NULL,
    tipo_venta VARCHAR(20) NOT NULL CHECK (tipo_venta IN ('producto', 'servicio', 'turno')),
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    precio_total DECIMAL(10,2) NOT NULL,
    comision_cresalia DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    comision_porcentaje DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    comision_fija DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    neto_vendedor DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50) DEFAULT 'mercadopago',
    estado_pago VARCHAR(50) DEFAULT 'pendiente' CHECK (estado_pago IN ('pendiente', 'aprobado', 'rechazado', 'cancelado', 'reembolsado')),
    mercado_pago_payment_id VARCHAR(255),
    fecha_venta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_pago TIMESTAMP WITH TIME ZONE,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para historial de pagos (incluyendo suscripciones y comisiones)
CREATE TABLE IF NOT EXISTS historial_pagos_completo (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    tipo_pago VARCHAR(50) NOT NULL CHECK (tipo_pago IN ('suscripcion', 'comision_venta', 'reembolso', 'bonificacion')),
    concepto VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'ARS',
    direccion VARCHAR(20) NOT NULL CHECK (direccion IN ('entrada', 'salida')),
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesado', 'fallido', 'cancelado')),
    mercado_pago_payment_id VARCHAR(255),
    mercado_pago_preference_id VARCHAR(255),
    descripcion TEXT,
    metadata JSONB, -- Datos adicionales como ID de venta, etc.
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_procesamiento TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para configuración de comisiones por plan
CREATE TABLE IF NOT EXISTS configuracion_comisiones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan VARCHAR(50) NOT NULL UNIQUE CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
    comision_porcentaje DECIMAL(5,2) NOT NULL,
    comision_fija DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    descripcion TEXT NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para transparencia de precios
CREATE TABLE IF NOT EXISTS transparencia_precios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    concepto VARCHAR(100) NOT NULL UNIQUE,
    precio_base DECIMAL(10,2) NOT NULL,
    comision_mercadopago DECIMAL(5,2) NOT NULL,
    comision_fija_mercadopago DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    comision_cresalia DECIMAL(5,2) NOT NULL,
    precio_final DECIMAL(10,2) NOT NULL,
    descripcion TEXT NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para saldos y movimientos de dinero
CREATE TABLE IF NOT EXISTS saldos_tiendas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE UNIQUE,
    saldo_disponible DECIMAL(10,2) DEFAULT 0.00,
    saldo_pendiente DECIMAL(10,2) DEFAULT 0.00,
    saldo_retirado DECIMAL(10,2) DEFAULT 0.00,
    ultimo_movimiento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para movimientos de saldo
CREATE TABLE IF NOT EXISTS movimientos_saldo (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    tipo_movimiento VARCHAR(50) NOT NULL CHECK (tipo_movimiento IN ('ingreso', 'egreso', 'retiro')),
    concepto VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    saldo_anterior DECIMAL(10,2) NOT NULL,
    saldo_nuevo DECIMAL(10,2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'procesado' CHECK (estado IN ('pendiente', 'procesado', 'fallido')),
    referencia_id UUID, -- ID de la venta, pago, etc.
    referencia_tipo VARCHAR(50), -- 'venta', 'pago', 'retiro', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para retiros de dinero
CREATE TABLE IF NOT EXISTS retiros_dinero (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL,
    metodo_retiro VARCHAR(50) NOT NULL CHECK (metodo_retiro IN ('transferencia', 'mercadopago', 'paypal')),
    datos_retiro JSONB NOT NULL, -- Datos de la cuenta bancaria, etc.
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesado', 'completado', 'rechazado')),
    fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_procesamiento TIMESTAMP WITH TIME ZONE,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para estadísticas de ventas por tienda
CREATE TABLE IF NOT EXISTS estadisticas_ventas_tienda (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    periodo VARCHAR(20) NOT NULL CHECK (periodo IN ('dia', 'semana', 'mes', 'año')),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    total_ventas DECIMAL(10,2) DEFAULT 0.00,
    total_productos INTEGER DEFAULT 0,
    total_servicios INTEGER DEFAULT 0,
    total_turnos INTEGER DEFAULT 0,
    comisiones_cresalia DECIMAL(10,2) DEFAULT 0.00,
    neto_vendedor DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para auditoría de transacciones
CREATE TABLE IF NOT EXISTS auditoria_transacciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    tipo_transaccion VARCHAR(50) NOT NULL,
    referencia_id UUID,
    accion VARCHAR(100) NOT NULL,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    usuario_responsable VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== CONFIGURACIÓN INICIAL DE COMISIONES =====

-- Insertar configuración de comisiones por plan
INSERT INTO configuracion_comisiones (plan, comision_porcentaje, comision_fija, descripcion) VALUES
('free', 5.90, 0.50, 'Plan gratuito - Comisión estándar por no tener suscripción'),
('basic', 2.90, 0.30, 'Plan básico - Comisión reducida por suscripción'),
('pro', 1.90, 0.30, 'Plan pro - Comisión aún más reducida'),
('enterprise', 0.90, 0.30, 'Plan enterprise - Comisión mínima')
ON CONFLICT (plan) DO UPDATE SET
    comision_porcentaje = EXCLUDED.comision_porcentaje,
    comision_fija = EXCLUDED.comision_fija,
    descripcion = EXCLUDED.descripcion,
    updated_at = NOW();

-- Insertar transparencia de precios
INSERT INTO transparencia_precios (concepto, precio_base, comision_mercadopago, comision_fija_mercadopago, comision_cresalia, precio_final, descripcion) VALUES
('Venta $1000 - Plan Free', 1000.00, 3.49, 0.00, 2.41, 1000.00, 'Precio final: $1000. Mercado Pago: $34.90. Cresalia: $24.10. Neto vendedor: $941.00'),
('Venta $1000 - Plan Basic', 1000.00, 3.19, 0.00, 2.71, 1000.00, 'Precio final: $1000. Mercado Pago: $31.90. Cresalia: $27.10. Neto vendedor: $941.00'),
('Venta $1000 - Plan Pro', 1000.00, 2.19, 0.00, 1.71, 1000.00, 'Precio final: $1000. Mercado Pago: $21.90. Cresalia: $17.10. Neto vendedor: $961.00'),
('Venta $1000 - Plan Enterprise', 1000.00, 1.19, 0.00, 0.71, 1000.00, 'Precio final: $1000. Mercado Pago: $11.90. Cresalia: $7.10. Neto vendedor: $981.00')
ON CONFLICT (concepto) DO UPDATE SET
    precio_base = EXCLUDED.precio_base,
    comision_mercadopago = EXCLUDED.comision_mercadopago,
    comision_cresalia = EXCLUDED.comision_cresalia,
    precio_final = EXCLUDED.precio_final,
    descripcion = EXCLUDED.descripcion,
    updated_at = NOW();

-- ===== ÍNDICES PARA OPTIMIZACIÓN =====

CREATE INDEX IF NOT EXISTS idx_ventas_tienda_fecha ON historial_ventas(tienda_id, fecha_venta);
CREATE INDEX IF NOT EXISTS idx_ventas_comprador ON historial_ventas(comprador_id);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON historial_ventas(estado_pago);
CREATE INDEX IF NOT EXISTS idx_pagos_tienda ON historial_pagos_completo(tienda_id);
CREATE INDEX IF NOT EXISTS idx_pagos_tipo ON historial_pagos_completo(tipo_pago);
CREATE INDEX IF NOT EXISTS idx_movimientos_tienda ON movimientos_saldo(tienda_id);
CREATE INDEX IF NOT EXISTS idx_retiros_tienda ON retiros_dinero(tienda_id);
CREATE INDEX IF NOT EXISTS idx_estadisticas_tienda ON estadisticas_ventas_tienda(tienda_id, periodo);
CREATE INDEX IF NOT EXISTS idx_auditoria_tienda ON auditoria_transacciones(tienda_id);

-- ===== FUNCIONES ÚTILES =====

-- Función para calcular comisiones
CREATE OR REPLACE FUNCTION calcular_comisiones(
    p_monto DECIMAL,
    p_plan VARCHAR
)
RETURNS TABLE (
    comision_mercadopago DECIMAL,
    comision_cresalia DECIMAL,
    neto_vendedor DECIMAL
) AS $$
DECLARE
    config_comision RECORD;
    comision_mp DECIMAL;
    comision_cresalia DECIMAL;
    neto DECIMAL;
BEGIN
    -- Obtener configuración de comisiones del plan
    SELECT * INTO config_comision
    FROM configuracion_comisiones
    WHERE plan = p_plan AND activo = true;
    
    -- Calcular comisión de Mercado Pago (3.49% + $0.00)
    comision_mp := (p_monto * 3.49 / 100);
    
    -- Calcular comisión de Cresalia
    comision_cresalia := (p_monto * config_comision.comision_porcentaje / 100) + config_comision.comision_fija;
    
    -- Calcular neto para el vendedor
    neto := p_monto - comision_mp - comision_cresalia;
    
    RETURN QUERY SELECT comision_mp, comision_cresalia, neto;
END;
$$ language 'plpgsql';

-- Función para registrar venta
CREATE OR REPLACE FUNCTION registrar_venta(
    p_tienda_id UUID,
    p_comprador_id UUID,
    p_producto_id UUID DEFAULT NULL,
    p_servicio_id UUID DEFAULT NULL,
    p_tipo_venta VARCHAR,
    p_cantidad INTEGER,
    p_precio_unitario DECIMAL,
    p_metodo_pago VARCHAR DEFAULT 'mercadopago'
)
RETURNS UUID AS $$
DECLARE
    venta_id UUID;
    plan_tienda VARCHAR;
    comisiones RECORD;
    precio_total DECIMAL;
BEGIN
    -- Obtener plan de la tienda
    SELECT s.plan INTO plan_tienda
    FROM suscripciones s
    WHERE s.tienda_id = p_tienda_id
    AND s.estado = 'activa'
    ORDER BY s.created_at DESC
    LIMIT 1;
    
    -- Si no hay suscripción activa, usar plan free
    IF plan_tienda IS NULL THEN
        plan_tienda := 'free';
    END IF;
    
    -- Calcular precio total
    precio_total := p_cantidad * p_precio_unitario;
    
    -- Calcular comisiones
    SELECT * INTO comisiones
    FROM calcular_comisiones(precio_total, plan_tienda);
    
    -- Insertar venta
    INSERT INTO historial_ventas (
        tienda_id, comprador_id, producto_id, servicio_id, tipo_venta,
        cantidad, precio_unitario, precio_total,
        comision_cresalia, comision_porcentaje,
        neto_vendedor, metodo_pago
    ) VALUES (
        p_tienda_id, p_comprador_id, p_producto_id, p_servicio_id, p_tipo_venta,
        p_cantidad, p_precio_unitario, precio_total,
        comisiones.comision_cresalia, 
        (SELECT comision_porcentaje FROM configuracion_comisiones WHERE plan = plan_tienda),
        comisiones.neto_vendedor, p_metodo_pago
    ) RETURNING id INTO venta_id;
    
    -- Registrar movimiento de saldo
    INSERT INTO movimientos_saldo (
        tienda_id, tipo_movimiento, concepto, monto,
        saldo_anterior, saldo_nuevo, referencia_id, referencia_tipo
    ) VALUES (
        p_tienda_id, 'ingreso', 'Venta registrada', comisiones.neto_vendedor,
        0, comisiones.neto_vendedor, venta_id, 'venta'
    );
    
    -- Actualizar saldo de la tienda
    INSERT INTO saldos_tiendas (tienda_id, saldo_disponible, saldo_pendiente)
    VALUES (p_tienda_id, 0, comisiones.neto_vendedor)
    ON CONFLICT (tienda_id) DO UPDATE SET
        saldo_pendiente = saldos_tiendas.saldo_pendiente + comisiones.neto_vendedor,
        ultimo_movimiento = NOW(),
        updated_at = NOW();
    
    RETURN venta_id;
END;
$$ language 'plpgsql';

-- Función para confirmar pago de venta
CREATE OR REPLACE FUNCTION confirmar_pago_venta(
    p_venta_id UUID,
    p_mercado_pago_payment_id VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    venta RECORD;
BEGIN
    -- Obtener datos de la venta
    SELECT * INTO venta
    FROM historial_ventas
    WHERE id = p_venta_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Actualizar estado de la venta
    UPDATE historial_ventas
    SET estado_pago = 'aprobado',
        mercado_pago_payment_id = p_mercado_pago_payment_id,
        fecha_pago = NOW()
    WHERE id = p_venta_id;
    
    -- Mover dinero de pendiente a disponible
    UPDATE saldos_tiendas
    SET saldo_pendiente = saldo_pendiente - venta.neto_vendedor,
        saldo_disponible = saldo_disponible + venta.neto_vendedor,
        ultimo_movimiento = NOW(),
        updated_at = NOW()
    WHERE tienda_id = venta.tienda_id;
    
    -- Registrar movimiento
    INSERT INTO movimientos_saldo (
        tienda_id, tipo_movimiento, concepto, monto,
        saldo_anterior, saldo_nuevo, referencia_id, referencia_tipo
    ) VALUES (
        venta.tienda_id, 'ingreso', 'Pago confirmado', venta.neto_vendedor,
        venta.neto_vendedor, venta.neto_vendedor, p_venta_id, 'venta'
    );
    
    -- Registrar pago de comisión
    INSERT INTO historial_pagos_completo (
        tienda_id, tipo_pago, concepto, monto, direccion,
        estado, mercado_pago_payment_id, metadata
    ) VALUES (
        venta.tienda_id, 'comision_venta', 'Comisión por venta', venta.comision_cresalia, 'entrada',
        'procesado', p_mercado_pago_payment_id, jsonb_build_object('venta_id', p_venta_id)
    );
    
    RETURN TRUE;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_configuracion_comisiones_updated_at 
    BEFORE UPDATE ON configuracion_comisiones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transparencia_precios_updated_at 
    BEFORE UPDATE ON transparencia_precios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saldos_tiendas_updated_at 
    BEFORE UPDATE ON saldos_tiendas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para obtener resumen financiero de tienda
CREATE OR REPLACE FUNCTION resumen_financiero_tienda(
    p_tienda_id UUID,
    p_fecha_inicio DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_fecha_fin DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    total_ventas DECIMAL,
    total_comisiones DECIMAL,
    neto_vendedor DECIMAL,
    saldo_disponible DECIMAL,
    saldo_pendiente DECIMAL,
    saldo_retirado DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(hv.precio_total), 0) as total_ventas,
        COALESCE(SUM(hv.comision_cresalia), 0) as total_comisiones,
        COALESCE(SUM(hv.neto_vendedor), 0) as neto_vendedor,
        COALESCE(st.saldo_disponible, 0) as saldo_disponible,
        COALESCE(st.saldo_pendiente, 0) as saldo_pendiente,
        COALESCE(st.saldo_retirado, 0) as saldo_retirado
    FROM historial_ventas hv
    FULL OUTER JOIN saldos_tiendas st ON st.tienda_id = p_tienda_id
    WHERE hv.tienda_id = p_tienda_id
    AND hv.fecha_venta BETWEEN p_fecha_inicio AND p_fecha_fin
    AND hv.estado_pago = 'aprobado';
END;
$$ language 'plpgsql';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Sistema completo de Cresalia instalado correctamente';
    RAISE NOTICE '📊 Tablas creadas: historial_ventas, historial_pagos_completo, configuracion_comisiones, transparencia_precios, saldos_tiendas, movimientos_saldo, retiros_dinero, estadisticas_ventas_tienda, auditoria_transacciones';
    RAISE NOTICE '💰 Comisiones configuradas: Free (5.9%), Basic (2.9%), Pro (1.9%), Enterprise (0.9%)';
    RAISE NOTICE '🔧 Funciones creadas: calcular_comisiones, registrar_venta, confirmar_pago_venta, resumen_financiero_tienda';
    RAISE NOTICE '📈 Sistema de transparencia de precios implementado';
END $$;











