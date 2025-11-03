-- ============================================
-- 🚀 TABLAS DE PAGOS Y SUSCRIPCIONES PARA CRESALIA
-- Sistema completo con Mercado Pago y protecciones anti-fraude
-- ============================================

-- ===== 1. TABLA DE SUSCRIPCIONES =====
CREATE TABLE IF NOT EXISTS suscripciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
    estado VARCHAR(50) DEFAULT 'activa' CHECK (estado IN ('activa', 'cancelada', 'vencida', 'pendiente')),
    precio DECIMAL(10,2) NOT NULL,
    comision DECIMAL(5,4) NOT NULL, -- Porcentaje de comisión (0.008 = 0.8%)
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_vencimiento TIMESTAMP WITH TIME ZONE,
    fecha_renovacion TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suscripciones_tienda ON suscripciones(tienda_id);
CREATE INDEX IF NOT EXISTS idx_suscripciones_estado ON suscripciones(estado);
CREATE INDEX IF NOT EXISTS idx_suscripciones_plan ON suscripciones(plan);

-- ===== 2. TABLA DE PAGOS DE SUSCRIPCIONES =====
CREATE TABLE IF NOT EXISTS pagos_suscripciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    suscripcion_id UUID REFERENCES suscripciones(id) ON DELETE CASCADE,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL,
    comision DECIMAL(10,2) NOT NULL, -- Comisión de Cresalia
    metodo_pago VARCHAR(50) NOT NULL, -- 'mercadopago', 'qr', 'tarjeta'
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado', 'cancelado', 'reembolsado')),
    preference_id VARCHAR(255), -- ID de preferencia de Mercado Pago
    payment_id VARCHAR(255), -- ID del pago en Mercado Pago
    external_reference VARCHAR(255),
    fecha_pago TIMESTAMP WITH TIME ZONE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb, -- Datos adicionales del pago
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pagos_suscripciones_suscripcion ON pagos_suscripciones(suscripcion_id);
CREATE INDEX IF NOT EXISTS idx_pagos_suscripciones_tienda ON pagos_suscripciones(tienda_id);
CREATE INDEX IF NOT EXISTS idx_pagos_suscripciones_estado ON pagos_suscripciones(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_suscripciones_payment_id ON pagos_suscripciones(payment_id);

-- ===== 3. TABLA DE PAGOS DE PRODUCTOS/SERVICIOS =====
CREATE TABLE IF NOT EXISTS pagos_ventas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    comprador_id UUID REFERENCES compradores(id) ON DELETE SET NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('producto', 'servicio', 'turno')),
    item_id UUID, -- ID del producto/servicio/turno
    monto_total DECIMAL(10,2) NOT NULL,
    monto_vendedor DECIMAL(10,2) NOT NULL, -- Lo que recibe el vendedor
    comision DECIMAL(10,2) NOT NULL, -- Comisión de Cresalia (va a tu cuenta)
    metodo_pago VARCHAR(50) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado', 'cancelado', 'reembolsado')),
    preference_id VARCHAR(255),
    payment_id VARCHAR(255),
    external_reference VARCHAR(255),
    qr_code TEXT, -- QR code si aplica
    fecha_pago TIMESTAMP WITH TIME ZONE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pagos_ventas_tienda ON pagos_ventas(tienda_id);
CREATE INDEX IF NOT EXISTS idx_pagos_ventas_comprador ON pagos_ventas(comprador_id);
CREATE INDEX IF NOT EXISTS idx_pagos_ventas_estado ON pagos_ventas(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_ventas_payment_id ON pagos_ventas(payment_id);

-- ===== 4. TABLA DE WEBHOOKS DE MERCADO PAGO =====
CREATE TABLE IF NOT EXISTS webhooks_mercadopago (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(50) NOT NULL, -- 'payment.created', 'payment.updated', etc.
    type VARCHAR(50) NOT NULL, -- 'payment', 'preference', etc.
    data_id VARCHAR(255) NOT NULL, -- ID del objeto
    data JSONB NOT NULL, -- Datos completos del webhook
    procesado BOOLEAN DEFAULT false,
    fecha_recepcion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_procesamiento TIMESTAMP WITH TIME ZONE,
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhooks_action ON webhooks_mercadopago(action);
CREATE INDEX IF NOT EXISTS idx_webhooks_data_id ON webhooks_mercadopago(data_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_procesado ON webhooks_mercadopago(procesado);

-- ===== 5. TABLA DE TARJETAS BLOQUEADAS (ANTI-FRAUDE) =====
CREATE TABLE IF NOT EXISTS tarjetas_bloqueadas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ultimos_digitos VARCHAR(4) NOT NULL,
    motivo VARCHAR(255) NOT NULL, -- 'fraude', 'robo_identidad', 'uso_sospechoso'
    ip_address INET,
    fecha_bloqueo TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activo BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tarjetas_bloqueadas_digitos ON tarjetas_bloqueadas(ultimos_digitos);
CREATE INDEX IF NOT EXISTS idx_tarjetas_bloqueadas_activo ON tarjetas_bloqueadas(activo);

-- ===== 6. TABLA DE INTENTOS DE PAGO (AUDITORÍA) =====
CREATE TABLE IF NOT EXISTS intentos_pago (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tienda_id UUID REFERENCES tiendas(id) ON DELETE SET NULL,
    tipo VARCHAR(50) NOT NULL, -- 'suscripcion', 'venta'
    monto DECIMAL(10,2) NOT NULL,
    metodo VARCHAR(50),
    resultado VARCHAR(50) NOT NULL, -- 'exitoso', 'rechazado', 'fraude_detectado'
    motivo_rechazo TEXT,
    ip_address INET,
    user_agent TEXT,
    validacion_tarjeta BOOLEAN, -- Si pasó validación de tarjeta
    riesgo_score DECIMAL(3,2), -- Score de riesgo (0-1)
    fecha_intento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intentos_tienda ON intentos_pago(tienda_id);
CREATE INDEX IF NOT EXISTS idx_intentos_resultado ON intentos_pago(resultado);
CREATE INDEX IF NOT EXISTS idx_intentos_fecha ON intentos_pago(fecha_intento);

-- ===== 7. TABLA DE COMISIONES ACUMULADAS =====
CREATE TABLE IF NOT EXISTS comisiones_cresalia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo VARCHAR(50) NOT NULL, -- 'suscripcion', 'venta'
    pago_id UUID, -- Referencia al pago
    monto_comision DECIMAL(10,2) NOT NULL,
    porcentaje DECIMAL(5,4) NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'transferido', 'disputado')),
    fecha_cobro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_transferencia TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comisiones_estado ON comisiones_cresalia(estado);
CREATE INDEX IF NOT EXISTS idx_comisiones_fecha ON comisiones_cresalia(fecha_cobro);

-- ===== RLS (Row Level Security) =====

-- Suscripciones: Tiendas ven solo sus suscripciones
ALTER TABLE suscripciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tiendas_ver_sus_suscripciones" ON suscripciones FOR SELECT 
    USING (tienda_id IN (SELECT id FROM tiendas WHERE user_id = auth.uid()));
CREATE POLICY "tiendas_actualizar_sus_suscripciones" ON suscripciones FOR UPDATE 
    USING (tienda_id IN (SELECT id FROM tiendas WHERE user_id = auth.uid()));

-- Pagos de suscripciones
ALTER TABLE pagos_suscripciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tiendas_ver_sus_pagos_suscripcion" ON pagos_suscripciones FOR SELECT 
    USING (tienda_id IN (SELECT id FROM tiendas WHERE user_id = auth.uid()));

-- Pagos de ventas
ALTER TABLE pagos_ventas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tiendas_ver_sus_pagos_ventas" ON pagos_ventas FOR SELECT 
    USING (tienda_id IN (SELECT id FROM tiendas WHERE user_id = auth.uid()));
CREATE POLICY "compradores_ver_sus_pagos" ON pagos_ventas FOR SELECT 
    USING (comprador_id IN (SELECT id FROM compradores WHERE user_id = auth.uid()));

-- ===== FUNCIONES Y TRIGGERS =====

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_suscripciones_updated_at BEFORE UPDATE ON suscripciones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pagos_suscripciones_updated_at BEFORE UPDATE ON pagos_suscripciones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pagos_ventas_updated_at BEFORE UPDATE ON pagos_ventas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comisiones_updated_at BEFORE UPDATE ON comisiones_cresalia 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== COMENTARIOS =====
COMMENT ON TABLE suscripciones IS 'Gestiona las suscripciones de las tiendas con comisiones de Cresalia';
COMMENT ON TABLE pagos_suscripciones IS 'Historial de pagos de suscripciones con integración Mercado Pago';
COMMENT ON TABLE pagos_ventas IS 'Pagos de productos/servicios con comisiones automáticas';
COMMENT ON TABLE webhooks_mercadopago IS 'Registro de todos los webhooks recibidos de Mercado Pago';
COMMENT ON TABLE tarjetas_bloqueadas IS 'Sistema anti-fraude: tarjetas bloqueadas por seguridad';
COMMENT ON TABLE intentos_pago IS 'Auditoría completa de todos los intentos de pago';
COMMENT ON TABLE comisiones_cresalia IS 'Todas las comisiones van a tu cuenta de Mercado Pago';

-- ===== NOTAS IMPORTANTES =====
-- 1. Todas las comisiones se calculan automáticamente según el plan
-- 2. Las comisiones van directamente a tu cuenta de Mercado Pago
-- 3. El sistema de validación de tarjetas previene fraude y robo de identidad
-- 4. Todos los pagos quedan registrados para auditoría y seguridad
-- 5. El sistema NO menciona competencias, solo se dedica a Cresalia


