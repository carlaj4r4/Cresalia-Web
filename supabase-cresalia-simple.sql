-- ===== CRESALIA - BASE DE DATOS SIMPLE =====
-- Solo las tablas esenciales, sin complicaciones

-- ===== 1. TABLAS PRINCIPALES =====

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de compradores
CREATE TABLE IF NOT EXISTS compradores (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    direccion TEXT,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de servicios
CREATE TABLE IF NOT EXISTS servicios (
    id SERIAL PRIMARY KEY,
    tienda_id INTEGER REFERENCES tiendas(id),
    nombre VARCHAR(500) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100),
    duracion INTEGER,
    ubicacion TEXT,
    horarios TEXT,
    contacto VARCHAR(255),
    modalidad VARCHAR(50),
    estado VARCHAR(50) DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 2. COMUNIDAD =====

-- Tabla de comunidad de vendedores
CREATE TABLE IF NOT EXISTS comunidad_vendedores (
    id SERIAL PRIMARY KEY,
    vendedor_email VARCHAR(255) NOT NULL,
    vendedor_nombre VARCHAR(255) NOT NULL,
    vendedor_alias VARCHAR(100),
    tienda_id VARCHAR(255) NOT NULL,
    tienda_nombre VARCHAR(500) NOT NULL,
    experiencia VARCHAR(50) DEFAULT 'principiante',
    especialidad TEXT,
    ubicacion VARCHAR(255),
    telefono VARCHAR(50),
    biografia TEXT,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de comunidad de compradores
CREATE TABLE IF NOT EXISTS comunidad_compradores (
    id SERIAL PRIMARY KEY,
    comprador_email VARCHAR(255) NOT NULL,
    comprador_nombre VARCHAR(255) NOT NULL,
    comprador_alias VARCHAR(100),
    ubicacion VARCHAR(255),
    telefono VARCHAR(50),
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de reportes
CREATE TABLE IF NOT EXISTS reportes_comunidad (
    id SERIAL PRIMARY KEY,
    reportador_email VARCHAR(255) NOT NULL,
    reportado_email VARCHAR(255) NOT NULL,
    tipo_reporte VARCHAR(50) NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    evidencia JSONB,
    estado VARCHAR(50) DEFAULT 'pendiente',
    numero_reportes INTEGER DEFAULT 1,
    fecha_reporte TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 3. MAPAS =====

-- Tabla de ubicaciones de tiendas
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de puntos de retiro
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 4. TURNOS =====

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 5. HISTORIALES =====

-- Tabla de historial de ventas
CREATE TABLE IF NOT EXISTS historial_ventas (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    cliente_email VARCHAR(255),
    cliente_nombre VARCHAR(255),
    tipo_venta VARCHAR(50) NOT NULL,
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

-- ===== 6. SUSCRIPCIONES =====

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 7. FEEDBACKS =====

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

-- ===== 8. DATOS INICIALES =====

-- Insertar puntos de retiro de ejemplo
INSERT INTO puntos_retiro (nombre, direccion, latitud, longitud, horarios, servicios, contacto) VALUES
('Punto Retiro Centro', 'Av. Corrientes 1234, CABA', -34.6037, -58.3816, 
 '{"lunes": "9:00-18:00", "martes": "9:00-18:00", "miercoles": "9:00-18:00", "jueves": "9:00-18:00", "viernes": "9:00-18:00", "sabado": "9:00-13:00"}',
 ARRAY['retiro_paquete', 'envio_express', 'pago_contra_entrega'],
 'contacto@puntoretiro.com');

-- ===== FINALIZACIÓN =====
-- Total: 15 tablas principales
-- Sistema completo de Cresalia simplificado











