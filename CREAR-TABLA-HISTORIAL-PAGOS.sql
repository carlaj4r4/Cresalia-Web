-- ===== CREAR TABLA HISTORIAL_PAGOS_COMPLETO =====
-- Tabla para registrar todos los pagos y transacciones de Cresalia

CREATE TABLE IF NOT EXISTS historial_pagos_completo (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    comprador_email VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'ARS',
    tipo_pago VARCHAR(50) NOT NULL, -- 'mercadopago', 'transferencia', 'efectivo', etc.
    estado_pago VARCHAR(20) NOT NULL, -- 'pendiente', 'aprobado', 'rechazado', 'cancelado'
    metodo_pago VARCHAR(50), -- 'tarjeta', 'transferencia', 'efectivo', 'crypto'
    referencia_pago VARCHAR(255), -- ID de transacción de MercadoPago
    descripcion TEXT,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento TIMESTAMP,
    fecha_aprobacion TIMESTAMP,
    comision_cresalia DECIMAL(10,2) DEFAULT 0.00,
    comision_mercadopago DECIMAL(10,2) DEFAULT 0.00,
    monto_neto DECIMAL(10,2) NOT NULL, -- Monto después de comisiones
    plan_tienda VARCHAR(50), -- 'gratuito', 'basico', 'premium', 'empresarial'
    comision_porcentaje DECIMAL(5,2) DEFAULT 0.00, -- Porcentaje de comisión aplicado
    datos_adicionales JSONB, -- Información extra del pago
    ip_cliente INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===== ÍNDICES PARA OPTIMIZACIÓN =====
CREATE INDEX IF NOT EXISTS idx_historial_pagos_tienda_id ON historial_pagos_completo(tienda_id);
CREATE INDEX IF NOT EXISTS idx_historial_pagos_comprador ON historial_pagos_completo(comprador_email);
CREATE INDEX IF NOT EXISTS idx_historial_pagos_fecha ON historial_pagos_completo(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_historial_pagos_estado ON historial_pagos_completo(estado_pago);
CREATE INDEX IF NOT EXISTS idx_historial_pagos_referencia ON historial_pagos_completo(referencia_pago);

-- ===== HABILITAR RLS =====
ALTER TABLE historial_pagos_completo ENABLE ROW LEVEL SECURITY;

-- ===== POLÍTICAS DE SEGURIDAD =====

-- Política para tiendas (solo pueden ver sus propios pagos)
DROP POLICY IF EXISTS "Tiendas can see their own payments" ON historial_pagos_completo;
CREATE POLICY "Tiendas can see their own payments" ON historial_pagos_completo
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM tiendas 
            WHERE tiendas.id::text = historial_pagos_completo.tienda_id 
            AND tiendas.email = auth.jwt() ->> 'email'
        )
    );

-- Política para compradores (solo pueden ver sus propios pagos)
DROP POLICY IF EXISTS "Compradores can see their own payments" ON historial_pagos_completo;
CREATE POLICY "Compradores can see their own payments" ON historial_pagos_completo
    FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = comprador_email);

-- ===== TRIGGER PARA ACTUALIZAR TIMESTAMP =====
CREATE OR REPLACE FUNCTION update_historial_pagos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_historial_pagos_updated_at
    BEFORE UPDATE ON historial_pagos_completo
    FOR EACH ROW
    EXECUTE FUNCTION update_historial_pagos_updated_at();

-- ===== COMENTARIOS EN LA TABLA =====
COMMENT ON TABLE historial_pagos_completo IS 'Registro completo de todos los pagos y transacciones de Cresalia';
COMMENT ON COLUMN historial_pagos_completo.tienda_id IS 'ID de la tienda que recibe el pago';
COMMENT ON COLUMN historial_pagos_completo.comprador_email IS 'Email del comprador que realiza el pago';
COMMENT ON COLUMN historial_pagos_completo.monto IS 'Monto total del pago';
COMMENT ON COLUMN historial_pagos_completo.monto_neto IS 'Monto después de descontar comisiones';
COMMENT ON COLUMN historial_pagos_completo.comision_cresalia IS 'Comisión que cobra Cresalia';
COMMENT ON COLUMN historial_pagos_completo.comision_mercadopago IS 'Comisión que cobra MercadoPago';
COMMENT ON COLUMN historial_pagos_completo.datos_adicionales IS 'Información adicional del pago en formato JSON';

-- ===== VERIFICACIÓN =====
-- Verificar que la tabla se creó correctamente
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'historial_pagos_completo'
ORDER BY ordinal_position;

-- Verificar que RLS está habilitado
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as "RLS Habilitado"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'historial_pagos_completo';





