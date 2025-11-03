-- ===== TODAS LAS TABLAS NECESARIAS PARA CRESALIA =====
-- Sistema completo de base de datos para la plataforma Cresalia

-- ===== 1. TABLAS DE AUTENTICACIÓN Y USUARIOS =====

-- Tabla de tiendas/vendedores
CREATE TABLE IF NOT EXISTS tiendas (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre_tienda VARCHAR(500) NOT NULL,
    nombre_propietario VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    direccion TEXT,
    descripcion TEXT,
    categoria VARCHAR(100),
    plan_suscripcion VARCHAR(50) DEFAULT 'free',
    estado VARCHAR(50) DEFAULT 'activo',
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultima_actividad TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de compradores
CREATE TABLE IF NOT EXISTS compradores (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    direccion TEXT,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultima_actividad TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 2. TABLAS DE PRODUCTOS Y SERVICIOS =====

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    tienda_id INTEGER REFERENCES tiendas(id),
    nombre VARCHAR(500) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100),
    stock INTEGER DEFAULT 0,
    imagen_url TEXT,
    estado VARCHAR(50) DEFAULT 'activo',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    tienda_id INTEGER REFERENCES tiendas(id),
    nombre VARCHAR(500) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100),
    duracion INTEGER, -- en minutos
    ubicacion TEXT,
    horarios TEXT,
    contacto VARCHAR(255),
    modalidad VARCHAR(50), -- 'presencial', 'virtual', 'mixto'
    estado VARCHAR(50) DEFAULT 'activo',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 3. TABLAS DE COMUNIDAD Y REPORTES =====

-- Tabla de comunidad de vendedores (CON ALIAS)
CREATE TABLE IF NOT EXISTS comunidad_vendedores (
    id SERIAL PRIMARY KEY,
    vendedor_email VARCHAR(255) NOT NULL,
    vendedor_nombre VARCHAR(255) NOT NULL,
    vendedor_alias VARCHAR(100), -- Alias profesional
    tienda_id VARCHAR(255) NOT NULL,
    tienda_nombre VARCHAR(500) NOT NULL,
    experiencia VARCHAR(50) DEFAULT 'principiante',
    especialidad TEXT,
    ubicacion VARCHAR(255),
    telefono VARCHAR(50),
    redes_sociales JSONB,
    biografia TEXT,
    logros TEXT[],
    certificaciones TEXT[],
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultima_actividad TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'activo',
    puntuacion DECIMAL(3,2) DEFAULT 0.00,
    total_ventas INTEGER DEFAULT 0,
    total_ingresos DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de comunidad de compradores (CON ALIAS)
CREATE TABLE IF NOT EXISTS comunidad_compradores (
    id SERIAL PRIMARY KEY,
    comprador_email VARCHAR(255) NOT NULL,
    comprador_nombre VARCHAR(255) NOT NULL,
    comprador_alias VARCHAR(100), -- Alias profesional
    ubicacion VARCHAR(255),
    telefono VARCHAR(50),
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultima_actividad TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'activo',
    total_compras INTEGER DEFAULT 0,
    total_gastado DECIMAL(10,2) DEFAULT 0.00,
    preferencias JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de reportes de la comunidad
CREATE TABLE IF NOT EXISTS reportes_comunidad (
    id SERIAL PRIMARY KEY,
    reportador_email VARCHAR(255) NOT NULL,
    reportado_email VARCHAR(255) NOT NULL,
    tipo_reporte VARCHAR(50) NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    evidencia JSONB, -- Archivos como Base64
    estado VARCHAR(50) DEFAULT 'pendiente',
    numero_reportes INTEGER DEFAULT 1,
    fecha_reporte TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_resolucion TIMESTAMP WITH TIME ZONE,
    admin_responsable VARCHAR(255),
    accion_tomada TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de bloqueos individuales
CREATE TABLE IF NOT EXISTS bloqueos_individuales (
    id SERIAL PRIMARY KEY,
    bloqueador_email VARCHAR(255) NOT NULL,
    bloqueado_email VARCHAR(255) NOT NULL,
    tipo_bloqueo VARCHAR(50) NOT NULL,
    motivo VARCHAR(100),
    fecha_bloqueo TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de respuestas a reportes
CREATE TABLE IF NOT EXISTS respuestas_comunidad (
    id SERIAL PRIMARY KEY,
    reporte_id INTEGER REFERENCES reportes_comunidad(id),
    respondedor_email VARCHAR(255) NOT NULL,
    respondedor_nombre VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_respuesta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 4. TABLAS DE MAPAS Y UBICACIONES =====

-- Tabla de ubicaciones de tiendas (SISTEMA DE MAPAS)
CREATE TABLE IF NOT EXISTS ubicaciones_tiendas (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    nombre_ubicacion VARCHAR(255) NOT NULL,
    direccion TEXT NOT NULL,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    tipo_ubicacion VARCHAR(50) DEFAULT 'tienda',
    horarios JSONB,
    servicios_disponibles TEXT[],
    contacto VARCHAR(255),
    estado VARCHAR(50) DEFAULT 'activo',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de puntos de retiro comunes (SISTEMA DE MAPAS)
CREATE TABLE IF NOT EXISTS puntos_retiro (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion TEXT NOT NULL,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    horarios JSONB,
    servicios TEXT[],
    contacto VARCHAR(255),
    estado VARCHAR(50) DEFAULT 'activo',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 5. TABLAS DE TURNOS Y COMPROBANTES =====

-- Tabla de configuración de turnos
CREATE TABLE IF NOT EXISTS configuracion_turnos (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    habilitado BOOLEAN DEFAULT false,
    dias_disponibles JSONB,
    horarios_disponibles JSONB,
    duracion_turno INTEGER DEFAULT 60,
    anticipacion_minima INTEGER DEFAULT 24,
    servicios_disponibles TEXT[],
    estado VARCHAR(50) DEFAULT 'activo',
    fecha_configuracion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de turnos reservados
CREATE TABLE IF NOT EXISTS turnos_reservados (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_telefono VARCHAR(50),
    servicio VARCHAR(255) NOT NULL,
    fecha_turno TIMESTAMP WITH TIME ZONE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado VARCHAR(50) DEFAULT 'confirmado',
    notas TEXT,
    fecha_reserva TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de comprobantes de turnos
CREATE TABLE IF NOT EXISTS comprobantes_turnos (
    id SERIAL PRIMARY KEY,
    turno_id INTEGER REFERENCES turnos_reservados(id),
    tienda_id VARCHAR(255) NOT NULL,
    cliente_email VARCHAR(255) NOT NULL,
    numero_comprobante VARCHAR(100) UNIQUE NOT NULL,
    contenido_comprobante JSONB,
    plantilla_usada VARCHAR(100),
    fecha_generacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'generado',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 6. TABLAS DE HISTORIALES Y FINANZAS =====

-- Tabla de historial de ventas
CREATE TABLE IF NOT EXISTS historial_ventas (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    cliente_email VARCHAR(255),
    cliente_nombre VARCHAR(255),
    tipo_venta VARCHAR(50) NOT NULL, -- 'producto', 'servicio', 'turno'
    item_id INTEGER,
    item_nombre VARCHAR(500) NOT NULL,
    cantidad INTEGER DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    comision_mercado_pago DECIMAL(10,2) DEFAULT 0,
    comision_cresalia DECIMAL(10,2) DEFAULT 0,
    neto_vendedor DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50),
    estado_pago VARCHAR(50) DEFAULT 'pendiente',
    fecha_venta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de historial de compras
CREATE TABLE IF NOT EXISTS historial_compras (
    id SERIAL PRIMARY KEY,
    comprador_email VARCHAR(255) NOT NULL,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    tipo_compra VARCHAR(50) NOT NULL,
    item_id INTEGER,
    item_nombre VARCHAR(500) NOT NULL,
    cantidad INTEGER DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago VARCHAR(50),
    estado_compra VARCHAR(50) DEFAULT 'pendiente',
    fecha_compra TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de transacciones financieras
CREATE TABLE IF NOT EXISTS transacciones_financieras (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    tipo_transaccion VARCHAR(50) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    referencia VARCHAR(255),
    estado VARCHAR(50) DEFAULT 'pendiente',
    fecha_transaccion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 7. TABLAS DE SUSCRIPCIONES Y PAGOS =====

-- Tabla de suscripciones
CREATE TABLE IF NOT EXISTS suscripciones (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL,
    precio_mensual DECIMAL(10,2) NOT NULL,
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_vencimiento TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(50) DEFAULT 'activo',
    metodo_pago VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS historial_pagos_completo (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    tipo_pago VARCHAR(50) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(10) DEFAULT 'ARS',
    metodo_pago VARCHAR(50),
    referencia_pago VARCHAR(255),
    estado_pago VARCHAR(50) DEFAULT 'pendiente',
    fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 8. TABLAS DE CONFIGURACIÓN Y AUDITORÍA =====

-- Tabla de configuración de comisiones
CREATE TABLE IF NOT EXISTS configuracion_comisiones (
    id SERIAL PRIMARY KEY,
    plan VARCHAR(50) NOT NULL,
    comision_cresalia DECIMAL(5,2) NOT NULL,
    comision_mercado_pago DECIMAL(5,2) NOT NULL,
    fecha_configuracion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de transparencia de precios
CREATE TABLE IF NOT EXISTS transparencia_precios (
    id SERIAL PRIMARY KEY,
    monto_venta DECIMAL(10,2) NOT NULL,
    plan VARCHAR(50) NOT NULL,
    comision_mercado_pago DECIMAL(10,2) NOT NULL,
    comision_cresalia DECIMAL(10,2) NOT NULL,
    neto_vendedor DECIMAL(10,2) NOT NULL,
    fecha_calculo TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de auditoría de transacciones
CREATE TABLE IF NOT EXISTS auditoria_transacciones (
    id SERIAL PRIMARY KEY,
    tabla_afectada VARCHAR(100) NOT NULL,
    registro_id INTEGER,
    accion VARCHAR(50) NOT NULL,
    usuario_email VARCHAR(255),
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    fecha_auditoria TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 9. TABLAS DE FEEDBACKS Y VALORACIONES =====

-- Tabla de feedbacks generales
CREATE TABLE IF NOT EXISTS feedbacks_generales (
    id SERIAL PRIMARY KEY,
    usuario_email VARCHAR(255) NOT NULL,
    tipo_feedback VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    puntuacion INTEGER,
    fecha_feedback TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de valoraciones de tiendas
CREATE TABLE IF NOT EXISTS valoraciones_tiendas (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    comprador_email VARCHAR(255) NOT NULL,
    puntuacion INTEGER NOT NULL,
    comentario TEXT,
    fecha_valoracion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 10. ÍNDICES PARA OPTIMIZACIÓN =====

-- Índices para tiendas
CREATE INDEX IF NOT EXISTS idx_tiendas_email ON tiendas(email);
CREATE INDEX IF NOT EXISTS idx_tiendas_plan ON tiendas(plan_suscripcion);
CREATE INDEX IF NOT EXISTS idx_tiendas_estado ON tiendas(estado);

-- Índices para compradores
CREATE INDEX IF NOT EXISTS idx_compradores_email ON compradores(email);
CREATE INDEX IF NOT EXISTS idx_compradores_estado ON compradores(estado);

-- Índices para productos y servicios
CREATE INDEX IF NOT EXISTS idx_productos_tienda ON productos(tienda_id);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_servicios_tienda ON servicios(tienda_id);

-- Índices para comunidad
CREATE INDEX IF NOT EXISTS idx_comunidad_vendedores_email ON comunidad_vendedores(vendedor_email);
CREATE INDEX IF NOT EXISTS idx_comunidad_vendedores_alias ON comunidad_vendedores(vendedor_alias);
CREATE INDEX IF NOT EXISTS idx_comunidad_compradores_email ON comunidad_compradores(comprador_email);
CREATE INDEX IF NOT EXISTS idx_comunidad_compradores_alias ON comunidad_compradores(comprador_alias);

-- Índices para reportes
CREATE INDEX IF NOT EXISTS idx_reportes_reportador ON reportes_comunidad(reportador_email);
CREATE INDEX IF NOT EXISTS idx_reportes_reportado ON reportes_comunidad(reportado_email);
CREATE INDEX IF NOT EXISTS idx_reportes_estado ON reportes_comunidad(estado);

-- Índices para ubicaciones (MAPAS)
CREATE INDEX IF NOT EXISTS idx_ubicaciones_tienda ON ubicaciones_tiendas(tienda_id);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_vendedor ON ubicaciones_tiendas(vendedor_email);
CREATE INDEX IF NOT EXISTS idx_puntos_retiro_estado ON puntos_retiro(estado);

-- Índices para turnos
CREATE INDEX IF NOT EXISTS idx_turnos_tienda ON turnos_reservados(tienda_id);
CREATE INDEX IF NOT EXISTS idx_turnos_fecha ON turnos_reservados(fecha_turno);
CREATE INDEX IF NOT EXISTS idx_turnos_estado ON turnos_reservados(estado);

-- Índices para historiales
CREATE INDEX IF NOT EXISTS idx_ventas_tienda ON historial_ventas(tienda_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON historial_ventas(fecha_venta);
CREATE INDEX IF NOT EXISTS idx_compras_comprador ON historial_compras(comprador_email);

-- ===== 11. TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA =====

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para todas las tablas que necesitan updated_at
CREATE TRIGGER update_tiendas_updated_at BEFORE UPDATE ON tiendas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compradores_updated_at BEFORE UPDATE ON compradores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servicios_updated_at BEFORE UPDATE ON servicios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comunidad_vendedores_updated_at BEFORE UPDATE ON comunidad_vendedores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comunidad_compradores_updated_at BEFORE UPDATE ON comunidad_compradores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reportes_updated_at BEFORE UPDATE ON reportes_comunidad FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ubicaciones_updated_at BEFORE UPDATE ON ubicaciones_tiendas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_puntos_retiro_updated_at BEFORE UPDATE ON puntos_retiro FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracion_turnos_updated_at BEFORE UPDATE ON configuracion_turnos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_turnos_reservados_updated_at BEFORE UPDATE ON turnos_reservados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suscripciones_updated_at BEFORE UPDATE ON suscripciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== 12. DATOS INICIALES =====

-- Insertar configuración de comisiones por defecto
INSERT INTO configuracion_comisiones (plan, comision_cresalia, comision_mercado_pago) VALUES
('free', 3.50, 5.99),
('basic', 2.50, 5.99),
('pro', 1.50, 5.99),
('enterprise', 0.50, 5.99);

-- Insertar puntos de retiro de ejemplo
INSERT INTO puntos_retiro (nombre, direccion, latitud, longitud, horarios, servicios, contacto) VALUES
('Punto Retiro Centro', 'Av. Corrientes 1234, CABA', -34.6037, -58.3816, 
 '{"lunes": "9:00-18:00", "martes": "9:00-18:00", "miercoles": "9:00-18:00", "jueves": "9:00-18:00", "viernes": "9:00-18:00", "sabado": "9:00-13:00"}',
 ARRAY['retiro_paquete', 'envio_express', 'pago_contra_entrega'],
 'contacto@puntoretiro.com'),
('Punto Retiro Norte', 'Av. Santa Fe 5678, CABA', -34.5889, -58.3974,
 '{"lunes": "10:00-19:00", "martes": "10:00-19:00", "miercoles": "10:00-19:00", "jueves": "10:00-19:00", "viernes": "10:00-19:00", "sabado": "10:00-14:00"}',
 ARRAY['retiro_paquete', 'envio_express'],
 'norte@puntoretiro.com');

-- ===== 13. COMENTARIOS FINALES =====

COMMENT ON TABLE tiendas IS 'Información de tiendas/vendedores en la plataforma';
COMMENT ON TABLE compradores IS 'Información de compradores en la plataforma';
COMMENT ON TABLE productos IS 'Catálogo de productos de las tiendas';
COMMENT ON TABLE servicios IS 'Catálogo de servicios de las tiendas';
COMMENT ON TABLE comunidad_vendedores IS 'Comunidad de vendedores con alias profesionales';
COMMENT ON TABLE comunidad_compradores IS 'Comunidad de compradores con alias profesionales';
COMMENT ON TABLE reportes_comunidad IS 'Sistema de reportes entre usuarios';
COMMENT ON TABLE ubicaciones_tiendas IS 'Sistema de mapas y ubicaciones de tiendas';
COMMENT ON TABLE puntos_retiro IS 'Puntos de retiro comunes deCOMMENT ON TABLE puntos_retiro IS 'Puntos de retiro comunes del sistema';
COMMENT ON TABLE turnos_reservados IS 'Sistema de turnos y citas';
COMMENT ON TABLE historial_ventas IS 'Historial completo de ventas';
COMMENT ON TABLE historial_compras IS 'Historial completo de compras';
COMMENT ON TABLE suscripciones IS 'Suscripciones y planes de las tiendas';
COMMENT ON TABLE configuracion_comisiones IS 'Configuración de comisiones por plan';

-- ===== FINALIZACIÓN =====
-- Total de tablas: 25 tablas principales
-- Sistema completo de Cresalia implementado
-- Mapas, alias, turnos, historiales, comunidades, todo incluido
