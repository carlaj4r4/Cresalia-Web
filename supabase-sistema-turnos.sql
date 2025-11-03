-- ===== SISTEMA DE TURNOS CRESALIA =====
-- Tablas para gestión de turnos, IA y suscripciones

-- Tabla para configuración de turnos por tienda
CREATE TABLE IF NOT EXISTS configuracion_turnos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    horarios_atencion TEXT NOT NULL DEFAULT 'Lun-Vie 9:00-18:00',
    duracion_turno_minutos INTEGER NOT NULL DEFAULT 30,
    email_notificaciones VARCHAR(255),
    whatsapp_notificaciones VARCHAR(50),
    precio_turno DECIMAL(10,2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para turnos reservados
CREATE TABLE IF NOT EXISTS turnos_reservados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_telefono VARCHAR(50),
    servicio_id UUID, -- Referencia a servicios de la tienda
    servicio_nombre VARCHAR(255) NOT NULL,
    fecha_reserva DATE NOT NULL,
    hora_reserva TIME NOT NULL,
    duracion_minutos INTEGER NOT NULL DEFAULT 30,
    estado VARCHAR(50) DEFAULT 'confirmado' CHECK (estado IN ('pendiente', 'confirmado', 'completado', 'cancelado', 'no_show')),
    precio DECIMAL(10,2) DEFAULT 0.00,
    notas TEXT,
    comprobante_generado BOOLEAN DEFAULT false,
    comprobante_enviado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para configuración de IA por tienda
CREATE TABLE IF NOT EXISTS configuracion_ia_tiendas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    usar_ia BOOLEAN DEFAULT false,
    tipo_ia VARCHAR(50) DEFAULT 'generico' CHECK (tipo_ia IN ('no', 'generico', 'personalizado')),
    mensaje_bienvenida TEXT,
    descripcion_ia TEXT,
    personalidad VARCHAR(50) DEFAULT 'profesional' CHECK (personalidad IN ('profesional', 'amigable', 'experta', 'motivadora', 'empatica')),
    color_ia VARCHAR(7) DEFAULT '#8B5CF6',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para comprobantes de turnos
CREATE TABLE IF NOT EXISTS comprobantes_turnos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    turno_id UUID REFERENCES turnos_reservados(id) ON DELETE CASCADE,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    cliente_email VARCHAR(255) NOT NULL,
    tipo_comprobante VARCHAR(50) DEFAULT 'turno' CHECK (tipo_comprobante IN ('turno', 'cancelacion', 'recordatorio')),
    contenido_html TEXT NOT NULL,
    logo_tienda BYTEA, -- Imagen del logo en base64
    color_principal VARCHAR(7) DEFAULT '#8B5CF6',
    mensaje_personalizado TEXT,
    enviado_email BOOLEAN DEFAULT false,
    enviado_whatsapp BOOLEAN DEFAULT false,
    fecha_envio TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para suscripciones y pagos
CREATE TABLE IF NOT EXISTS suscripciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
    estado VARCHAR(50) DEFAULT 'activa' CHECK (estado IN ('activa', 'suspendida', 'cancelada', 'pendiente')),
    precio_mensual DECIMAL(10,2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    mercado_pago_preference_id VARCHAR(255),
    mercado_pago_payment_id VARCHAR(255),
    mercado_pago_subscription_id VARCHAR(255),
    auto_renewal BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para historial de pagos
CREATE TABLE IF NOT EXISTS historial_pagos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    suscripcion_id UUID REFERENCES suscripciones(id) ON DELETE CASCADE,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'ARS',
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('pendiente', 'aprobado', 'rechazado', 'cancelado')),
    mercado_pago_payment_id VARCHAR(255),
    fecha_pago DATE,
    metodo_pago VARCHAR(100),
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para configuración de comprobantes personalizados
CREATE TABLE IF NOT EXISTS comprobantes_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    logo_empresa BYTEA, -- Logo en base64
    color_principal VARCHAR(7) DEFAULT '#8B5CF6',
    color_secundario VARCHAR(7) DEFAULT '#A855F7',
    mensaje_personalizado TEXT,
    incluir_logo BOOLEAN DEFAULT true,
    incluir_contacto BOOLEAN DEFAULT true,
    incluir_redes_sociales BOOLEAN DEFAULT true,
    template_personalizado TEXT, -- HTML personalizado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para logs de IA y turnos
CREATE TABLE IF NOT EXISTS logs_ia_turnos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    tipo_evento VARCHAR(100) NOT NULL, -- 'turno_creado', 'turno_cancelado', 'ia_respuesta', etc.
    descripcion TEXT NOT NULL,
    datos_adicionales JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_turnos_tienda_fecha ON turnos_reservados(tienda_id, fecha_reserva);
CREATE INDEX IF NOT EXISTS idx_turnos_estado ON turnos_reservados(estado);
CREATE INDEX IF NOT EXISTS idx_turnos_cliente ON turnos_reservados(cliente_email);
CREATE INDEX IF NOT EXISTS idx_suscripciones_tienda ON suscripciones(tienda_id);
CREATE INDEX IF NOT EXISTS idx_suscripciones_estado ON suscripciones(estado);
CREATE INDEX IF NOT EXISTS idx_suscripciones_vencimiento ON suscripciones(fecha_vencimiento);
CREATE INDEX IF NOT EXISTS idx_pagos_suscripcion ON historial_pagos(suscripcion_id);
CREATE INDEX IF NOT EXISTS idx_logs_tienda ON logs_ia_turnos(tienda_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_configuracion_turnos_updated_at BEFORE UPDATE ON configuracion_turnos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracion_ia_updated_at BEFORE UPDATE ON configuracion_ia_tiendas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suscripciones_updated_at BEFORE UPDATE ON suscripciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comprobantes_config_updated_at BEFORE UPDATE ON comprobantes_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear configuración inicial de turnos
CREATE OR REPLACE FUNCTION crear_configuracion_inicial_turnos()
RETURNS TRIGGER AS $$
BEGIN
    -- Crear configuración de turnos para la nueva tienda
    INSERT INTO configuracion_turnos (tienda_id)
    VALUES (NEW.id);
    
    -- Crear configuración de IA para la nueva tienda
    INSERT INTO configuracion_ia_tiendas (tienda_id)
    VALUES (NEW.id);
    
    -- Crear configuración de comprobantes para la nueva tienda
    INSERT INTO comprobantes_config (tienda_id)
    VALUES (NEW.id);
    
    -- Crear suscripción free inicial
    INSERT INTO suscripciones (tienda_id, plan, precio_mensual, fecha_inicio, fecha_vencimiento)
    VALUES (NEW.id, 'free', 0.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year');
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para crear configuración inicial cuando se crea una tienda
CREATE TRIGGER crear_config_inicial_tienda 
    AFTER INSERT ON tiendas 
    FOR EACH ROW 
    EXECUTE FUNCTION crear_configuracion_inicial_turnos();

-- Función para verificar disponibilidad de turno
CREATE OR REPLACE FUNCTION verificar_disponibilidad_turno(
    p_tienda_id UUID,
    p_fecha DATE,
    p_hora TIME,
    p_duracion INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    conflicto_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO conflicto_count
    FROM turnos_reservados
    WHERE tienda_id = p_tienda_id
    AND fecha_reserva = p_fecha
    AND estado IN ('confirmado', 'pendiente')
    AND (
        (p_hora >= hora_reserva AND p_hora < hora_reserva + INTERVAL '1 minute' * duracion_minutos) OR
        (p_hora + INTERVAL '1 minute' * p_duracion > hora_reserva AND p_hora < hora_reserva + INTERVAL '1 minute' * duracion_minutos)
    );
    
    RETURN conflicto_count = 0;
END;
$$ language 'plpgsql';

-- Función para obtener próximos turnos
CREATE OR REPLACE FUNCTION obtener_proximos_turnos(p_tienda_id UUID, p_dias INTEGER DEFAULT 7)
RETURNS TABLE (
    id UUID,
    cliente_nombre VARCHAR,
    servicio_nombre VARCHAR,
    fecha_reserva DATE,
    hora_reserva TIME,
    estado VARCHAR,
    notas TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.cliente_nombre,
        t.servicio_nombre,
        t.fecha_reserva,
        t.hora_reserva,
        t.estado,
        t.notas
    FROM turnos_reservados t
    WHERE t.tienda_id = p_tienda_id
    AND t.fecha_reserva BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '1 day' * p_dias
    AND t.estado IN ('confirmado', 'pendiente')
    ORDER BY t.fecha_reserva, t.hora_reserva;
END;
$$ language 'plpgsql';

-- Función para generar estadísticas de turnos
CREATE OR REPLACE FUNCTION estadisticas_turnos_tienda(p_tienda_id UUID, p_fecha_inicio DATE, p_fecha_fin DATE)
RETURNS TABLE (
    total_turnos BIGINT,
    turnos_completados BIGINT,
    turnos_cancelados BIGINT,
    no_shows BIGINT,
    ingresos_totales DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_turnos,
        COUNT(*) FILTER (WHERE estado = 'completado') as turnos_completados,
        COUNT(*) FILTER (WHERE estado = 'cancelado') as turnos_cancelados,
        COUNT(*) FILTER (WHERE estado = 'no_show') as no_shows,
        COALESCE(SUM(precio) FILTER (WHERE estado = 'completado'), 0) as ingresos_totales
    FROM turnos_reservados
    WHERE tienda_id = p_tienda_id
    AND fecha_reserva BETWEEN p_fecha_inicio AND p_fecha_fin;
END;
$$ language 'plpgsql';

-- Datos de ejemplo para testing (opcional)
-- INSERT INTO configuracion_turnos (tienda_id, horarios_atencion, duracion_turno_minutos, precio_turno)
-- SELECT id, 'Lun-Vie 9:00-18:00, Sáb 9:00-14:00', 30, 50.00
-- FROM tiendas 
-- WHERE nombre LIKE '%Demo%'
-- LIMIT 1;

COMMENT ON TABLE configuracion_turnos IS 'Configuración de horarios y precios para turnos por tienda';
COMMENT ON TABLE turnos_reservados IS 'Turnos reservados por los clientes';
COMMENT ON TABLE configuracion_ia_tiendas IS 'Configuración de IA personalizada por tienda';
COMMENT ON TABLE comprobantes_turnos IS 'Comprobantes generados para turnos';
COMMENT ON TABLE suscripciones IS 'Suscripciones activas de las tiendas';
COMMENT ON TABLE historial_pagos IS 'Historial de pagos realizados';
COMMENT ON TABLE comprobantes_config IS 'Configuración de comprobantes personalizados';
COMMENT ON TABLE logs_ia_turnos IS 'Logs de eventos de IA y turnos para auditoría';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Sistema de turnos de Cresalia instalado correctamente';
    RAISE NOTICE '📊 Tablas creadas: configuracion_turnos, turnos_reservados, configuracion_ia_tiendas, comprobantes_turnos, suscripciones, historial_pagos, comprobantes_config, logs_ia_turnos';
    RAISE NOTICE '🔧 Funciones creadas: crear_configuracion_inicial_turnos, verificar_disponibilidad_turno, obtener_proximos_turnos, estadisticas_turnos_tienda';
    RAISE NOTICE '⚡ Triggers configurados para auto-actualización y configuración inicial';
END $$;











