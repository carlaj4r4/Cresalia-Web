-- ===== TABLAS PARA HISTORIAL DE COMPRAS Y PAGOS - CRESALIA =====
-- Script consolidado para crear todas las tablas necesarias
-- Ejecutar en Supabase SQL Editor

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

-- ===== TABLA: HISTORIAL DE PAGOS COMPLETO =====
CREATE TABLE IF NOT EXISTS historial_pagos_completo (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    comprador_email VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'ARS',
    tipo_pago VARCHAR(50) NOT NULL, -- 'compra', 'suscripcion', 'mercadopago', 'transferencia', 'efectivo', etc.
    estado_pago VARCHAR(20) NOT NULL, -- 'pendiente', 'aprobado', 'rechazado', 'cancelado'
    metodo_pago VARCHAR(50), -- 'tarjeta', 'transferencia', 'efectivo', 'crypto'
    referencia_pago VARCHAR(255), -- ID de transacción de MercadoPago
    descripcion TEXT,
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_vencimiento TIMESTAMP WITH TIME ZONE,
    fecha_aprobacion TIMESTAMP WITH TIME ZONE,
    comision_cresalia DECIMAL(10,2) DEFAULT 0.00,
    comision_mercadopago DECIMAL(10,2) DEFAULT 0.00,
    monto_neto DECIMAL(10,2) NOT NULL, -- Monto después de comisiones
    plan_tienda VARCHAR(50), -- 'gratuito', 'basico', 'premium', 'empresarial'
    comision_porcentaje DECIMAL(5,2) DEFAULT 0.00, -- Porcentaje de comisión aplicado
    datos_adicionales JSONB, -- Información extra del pago
    ip_cliente INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ÍNDICES PARA OPTIMIZACIÓN =====

-- Índices para historial_compras
CREATE INDEX IF NOT EXISTS idx_historial_compras_comprador_email ON historial_compras(comprador_email);
CREATE INDEX IF NOT EXISTS idx_historial_compras_tienda_id ON historial_compras(tienda_id);
CREATE INDEX IF NOT EXISTS idx_historial_compras_fecha_compra ON historial_compras(fecha_compra);
CREATE INDEX IF NOT EXISTS idx_historial_compras_estado ON historial_compras(estado);

-- Índices para historial_pagos_completo
CREATE INDEX IF NOT EXISTS idx_historial_pagos_tienda_id ON historial_pagos_completo(tienda_id);
CREATE INDEX IF NOT EXISTS idx_historial_pagos_comprador ON historial_pagos_completo(comprador_email);
CREATE INDEX IF NOT EXISTS idx_historial_pagos_fecha ON historial_pagos_completo(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_historial_pagos_estado ON historial_pagos_completo(estado_pago);
CREATE INDEX IF NOT EXISTS idx_historial_pagos_referencia ON historial_pagos_completo(referencia_pago);

-- ===== HABILITAR RLS (Row Level Security) =====
ALTER TABLE historial_compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_pagos_completo ENABLE ROW LEVEL SECURITY;

-- ===== POLÍTICAS DE SEGURIDAD PARA historial_compras =====

-- Compradores pueden ver solo sus propias compras
DROP POLICY IF EXISTS "Compradores can see their own purchases" ON historial_compras;
CREATE POLICY "Compradores can see their own purchases" ON historial_compras
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'email' = comprador_email);

-- Compradores pueden insertar sus propias compras
DROP POLICY IF EXISTS "Compradores can insert their own purchases" ON historial_compras;
CREATE POLICY "Compradores can insert their own purchases" ON historial_compras
    FOR INSERT TO authenticated
    WITH CHECK (auth.jwt() ->> 'email' = comprador_email);

-- Vendedores pueden ver compras de sus tiendas
DROP POLICY IF EXISTS "Vendedores can see purchases from their stores" ON historial_compras;
CREATE POLICY "Vendedores can see purchases from their stores" ON historial_compras
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM tiendas 
            WHERE tiendas.id::text = historial_compras.tienda_id 
            AND tiendas.email = auth.jwt() ->> 'email'
        )
    );

-- ===== POLÍTICAS DE SEGURIDAD PARA historial_pagos_completo =====

-- Compradores pueden ver solo sus propios pagos
DROP POLICY IF EXISTS "Compradores can see their own payments" ON historial_pagos_completo;
CREATE POLICY "Compradores can see their own payments" ON historial_pagos_completo
    FOR SELECT TO authenticated
    USING (auth.jwt() ->> 'email' = comprador_email);

-- Compradores pueden insertar sus propios pagos
DROP POLICY IF EXISTS "Compradores can insert their own payments" ON historial_pagos_completo;
CREATE POLICY "Compradores can insert their own payments" ON historial_pagos_completo
    FOR INSERT TO authenticated
    WITH CHECK (auth.jwt() ->> 'email' = comprador_email);

-- Tiendas pueden ver solo sus propios pagos
DROP POLICY IF EXISTS "Tiendas can see their own payments" ON historial_pagos_completo;
CREATE POLICY "Tiendas can see their own payments" ON historial_pagos_completo
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM tiendas 
            WHERE tiendas.id::text = historial_pagos_completo.tienda_id 
            AND tiendas.email = auth.jwt() ->> 'email'
        )
    );

-- ===== TRIGGERS PARA ACTUALIZAR TIMESTAMP =====

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para historial_compras
DROP TRIGGER IF EXISTS trigger_update_historial_compras_updated_at ON historial_compras;
CREATE TRIGGER trigger_update_historial_compras_updated_at
    BEFORE UPDATE ON historial_compras
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para historial_pagos_completo
DROP TRIGGER IF EXISTS trigger_update_historial_pagos_updated_at ON historial_pagos_completo;
CREATE TRIGGER trigger_update_historial_pagos_updated_at
    BEFORE UPDATE ON historial_pagos_completo
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===== COMENTARIOS EN LAS TABLAS =====
COMMENT ON TABLE historial_compras IS 'Registro completo de todas las compras realizadas por los compradores';
COMMENT ON TABLE historial_pagos_completo IS 'Registro completo de todos los pagos y transacciones de Cresalia';

COMMENT ON COLUMN historial_compras.comprador_email IS 'Email del comprador que realiza la compra';
COMMENT ON COLUMN historial_compras.tienda_id IS 'ID de la tienda donde se realizó la compra';
COMMENT ON COLUMN historial_compras.total_pagado IS 'Monto total pagado por el comprador';

COMMENT ON COLUMN historial_pagos_completo.tienda_id IS 'ID de la tienda que recibe el pago';
COMMENT ON COLUMN historial_pagos_completo.comprador_email IS 'Email del comprador que realiza el pago';
COMMENT ON COLUMN historial_pagos_completo.monto IS 'Monto total del pago';
COMMENT ON COLUMN historial_pagos_completo.monto_neto IS 'Monto después de descontar comisiones';
COMMENT ON COLUMN historial_pagos_completo.comision_cresalia IS 'Comisión que cobra Cresalia';
COMMENT ON COLUMN historial_pagos_completo.comision_mercadopago IS 'Comisión que cobra MercadoPago';

-- ===== VERIFICACIÓN =====
-- Verificar que las tablas se crearon correctamente
SELECT 
    'historial_compras' as tabla,
    COUNT(*) as columnas
FROM information_schema.columns 
WHERE table_name = 'historial_compras'
UNION ALL
SELECT 
    'historial_pagos_completo' as tabla,
    COUNT(*) as columnas
FROM information_schema.columns 
WHERE table_name = 'historial_pagos_completo';

-- Verificar que RLS está habilitado
SELECT 
    tablename,
    rowsecurity as "RLS Habilitado"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('historial_compras', 'historial_pagos_completo');

