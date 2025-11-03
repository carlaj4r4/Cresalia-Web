-- ===== ARREGLAR ERRORES DE UUID EN SUPABASE =====
-- Fix para el error: operator does not exist: text = uuid

-- ===== TABLA CORREGIDA: COMUNIDAD VENDEDORES =====
CREATE TABLE IF NOT EXISTS comunidad_vendedores (
    id SERIAL PRIMARY KEY,
    vendedor_email VARCHAR(255) NOT NULL,
    vendedor_nombre VARCHAR(255) NOT NULL,
    vendedor_alias VARCHAR(100), -- NUEVO: Alias para trabajar
    tienda_id VARCHAR(255) NOT NULL,
    tienda_nombre VARCHAR(500) NOT NULL,
    experiencia VARCHAR(50) DEFAULT 'principiante', -- 'principiante', 'intermedio', 'avanzado'
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

-- ===== TABLA CORREGIDA: COMUNIDAD COMPRADORES =====
CREATE TABLE IF NOT EXISTS comunidad_compradores (
    id SERIAL PRIMARY KEY,
    comprador_email VARCHAR(255) NOT NULL,
    comprador_nombre VARCHAR(255) NOT NULL,
    comprador_alias VARCHAR(100), -- NUEVO: Alias para trabajar
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

-- ===== TABLA CORREGIDA: REPORTES COMUNIDAD =====
CREATE TABLE IF NOT EXISTS reportes_comunidad (
    id SERIAL PRIMARY KEY,
    reportador_email VARCHAR(255) NOT NULL,
    reportado_email VARCHAR(255) NOT NULL,
    tipo_reporte VARCHAR(50) NOT NULL, -- 'vendedor_problematico', 'comprador_deshonesto'
    motivo VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    evidencia JSONB, -- Archivos subidos como Base64
    estado VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'revisado', 'resuelto', 'rechazado'
    numero_reportes INTEGER DEFAULT 1,
    fecha_reporte TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_resolucion TIMESTAMP WITH TIME ZONE,
    admin_responsable VARCHAR(255),
    accion_tomada TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA CORREGIDA: BLOQUEOS INDIVIDUALES =====
CREATE TABLE IF NOT EXISTS bloqueos_individuales (
    id SERIAL PRIMARY KEY,
    bloqueador_email VARCHAR(255) NOT NULL,
    bloqueado_email VARCHAR(255) NOT NULL,
    tipo_bloqueo VARCHAR(50) NOT NULL, -- 'vendedor_bloquea_comprador', 'comprador_bloquea_vendedor'
    motivo VARCHAR(100),
    fecha_bloqueo TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA CORREGIDA: RESPUESTAS COMUNIDAD =====
CREATE TABLE IF NOT EXISTS respuestas_comunidad (
    id SERIAL PRIMARY KEY,
    reporte_id INTEGER REFERENCES reportes_comunidad(id),
    respondedor_email VARCHAR(255) NOT NULL,
    respondedor_nombre VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_respuesta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA CORREGIDA: MAPAS Y UBICACIONES =====
CREATE TABLE IF NOT EXISTS ubicaciones_tiendas (
    id SERIAL PRIMARY KEY,
    tienda_id VARCHAR(255) NOT NULL,
    vendedor_email VARCHAR(255) NOT NULL,
    nombre_ubicacion VARCHAR(255) NOT NULL,
    direccion TEXT NOT NULL,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    tipo_ubicacion VARCHAR(50) DEFAULT 'tienda', -- 'tienda', 'almacen', 'oficina', 'punto_retiro'
    horarios JSONB, -- {"lunes": "9:00-18:00", "martes": "9:00-18:00", ...}
    servicios_disponibles TEXT[],
    contacto VARCHAR(255),
    estado VARCHAR(50) DEFAULT 'activo',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA CORREGIDA: PUNTOS DE RETIRO =====
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

-- ===== ÍNDICES CORREGIDOS =====
CREATE INDEX IF NOT EXISTS idx_comunidad_vendedores_email ON comunidad_vendedores(vendedor_email);
CREATE INDEX IF NOT EXISTS idx_comunidad_vendedores_tienda ON comunidad_vendedores(tienda_id);
CREATE INDEX IF NOT EXISTS idx_comunidad_vendedores_alias ON comunidad_vendedores(vendedor_alias);

CREATE INDEX IF NOT EXISTS idx_comunidad_compradores_email ON comunidad_compradores(comprador_email);
CREATE INDEX IF NOT EXISTS idx_comunidad_compradores_alias ON comunidad_compradores(comprador_alias);

CREATE INDEX IF NOT EXISTS idx_reportes_reportador ON reportes_comunidad(reportador_email);
CREATE INDEX IF NOT EXISTS idx_reportes_reportado ON reportes_comunidad(reportado_email);
CREATE INDEX IF NOT EXISTS idx_reportes_estado ON reportes_comunidad(estado);

CREATE INDEX IF NOT EXISTS idx_bloqueos_bloqueador ON bloqueos_individuales(bloqueador_email);
CREATE INDEX IF NOT EXISTS idx_bloqueos_bloqueado ON bloqueos_individuales(bloqueado_email);

CREATE INDEX IF NOT EXISTS idx_ubicaciones_tienda ON ubicaciones_tiendas(tienda_id);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_vendedor ON ubicaciones_tiendas(vendedor_email);

-- ===== TRIGGERS CORREGIDOS =====
CREATE TRIGGER update_comunidad_vendedores_updated_at BEFORE UPDATE ON comunidad_vendedores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comunidad_compradores_updated_at BEFORE UPDATE ON comunidad_compradores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reportes_updated_at BEFORE UPDATE ON reportes_comunidad FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ubicaciones_updated_at BEFORE UPDATE ON ubicaciones_tiendas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_puntos_retiro_updated_at BEFORE UPDATE ON puntos_retiro FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== COMENTARIOS =====
COMMENT ON TABLE comunidad_vendedores IS 'Comunidad de vendedores con alias y datos profesionales';
COMMENT ON TABLE comunidad_compradores IS 'Comunidad de compradores con alias y preferencias';
COMMENT ON TABLE reportes_comunidad IS 'Sistema de reportes de la comunidad';
COMMENT ON TABLE bloqueos_individuales IS 'Bloqueos individuales entre usuarios';
COMMENT ON TABLE respuestas_comunidad IS 'Respuestas a reportes de la comunidad';
COMMENT ON TABLE ubicaciones_tiendas IS 'Ubicaciones y mapas de las tiendas';
COMMENT ON TABLE puntos_retiro IS 'Puntos de retiro comunes';

-- ===== DATOS DE EJEMPLO =====
INSERT INTO puntos_retiro (nombre, direccion, latitud, longitud, horarios, servicios, contacto) VALUES
('Punto Retiro Centro', 'Av. Corrientes 1234, CABA', -34.6037, -58.3816, 
 '{"lunes": "9:00-18:00", "martes": "9:00-18:00", "miercoles": "9:00-18:00", "jueves": "9:00-18:00", "viernes": "9:00-18:00", "sabado": "9:00-13:00"}',
 ARRAY['retiro_paquete', 'envio_express', 'pago_contra_entrega'],
 'contacto@puntoretiro.com');

-- ===== FINALIZACIÓN =====
-- Todas las tablas corregidas para evitar errores de UUID
-- Sistema de alias implementado para vendedores y compradores
-- Mapas y ubicaciones implementados
-- Sistema de puntos de retiro implementado











