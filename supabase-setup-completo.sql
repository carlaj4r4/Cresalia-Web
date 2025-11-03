-- ============================================
-- 🚀 SETUP COMPLETO SUPABASE PARA LANZAMIENTO
-- Cresalia Platform - Todas las tablas necesarias
-- ============================================
-- Autor: Carla & Claude
-- Versión: 1.0 - Lanzamiento
-- Fecha: Diciembre 2024
-- ============================================

-- ===== 1. TABLA PRINCIPAL DE TIENDAS =====
CREATE TABLE IF NOT EXISTS tiendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_tienda TEXT NOT NULL,
    email TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'basico' CHECK (plan IN ('basico', 'pro', 'premium')),
    subdomain TEXT UNIQUE NOT NULL,
    activa BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    configuracion JSONB DEFAULT '{"colores": {"primario": "#2563EB", "secundario": "#7C3AED"}, "contacto": {"telefono": "", "whatsapp": "", "direccion": ""}, "negocio": {"descripcion": "", "categoria": "", "horarios": ""}}'::jsonb,
    CONSTRAINT tiendas_user_id_unique UNIQUE (user_id)
);

-- Índices para tiendas
CREATE INDEX IF NOT EXISTS idx_tiendas_user_id ON tiendas(user_id);
CREATE INDEX IF NOT EXISTS idx_tiendas_subdomain ON tiendas(subdomain);
CREATE INDEX IF NOT EXISTS idx_tiendas_email ON tiendas(email);
CREATE INDEX IF NOT EXISTS idx_tiendas_plan ON tiendas(plan);
CREATE INDEX IF NOT EXISTS idx_tiendas_activa ON tiendas(activa);

-- RLS para tiendas
ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usuarios_ver_su_tienda" ON tiendas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usuarios_actualizar_su_tienda" ON tiendas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "usuarios_crear_su_tienda" ON tiendas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "usuarios_no_eliminar_tienda" ON tiendas FOR DELETE USING (false);

-- ===== 2. TABLA DE PRODUCTOS =====
CREATE TABLE IF NOT EXISTS productos (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(100) NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria TEXT,
    stock INTEGER DEFAULT 0,
    imagen_url TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para productos
CREATE INDEX IF NOT EXISTS idx_productos_tienda_id ON productos(tienda_id);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);

-- ===== 3. TABLA DE SERVICIOS =====
CREATE TABLE IF NOT EXISTS servicios (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(100) NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria TEXT,
    duracion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para servicios
CREATE INDEX IF NOT EXISTS idx_servicios_tienda_id ON servicios(tienda_id);
CREATE INDEX IF NOT EXISTS idx_servicios_categoria ON servicios(categoria);
CREATE INDEX IF NOT EXISTS idx_servicios_activo ON servicios(activo);

-- ===== 4. TABLA DE FEEDBACKS =====
CREATE TABLE IF NOT EXISTS tienda_feedbacks (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(100) NOT NULL,
    usuario_nombre VARCHAR(255) NOT NULL,
    usuario_email VARCHAR(255),
    calificacion INTEGER NOT NULL CHECK(calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    aprobado BOOLEAN DEFAULT FALSE,
    respuesta_tienda TEXT,
    fecha_respuesta TIMESTAMP WITH TIME ZONE,
    util_count INTEGER DEFAULT 0,
    verificado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para feedbacks
CREATE INDEX IF NOT EXISTS idx_feedbacks_tienda_id ON tienda_feedbacks(tienda_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_calificacion ON tienda_feedbacks(calificacion);
CREATE INDEX IF NOT EXISTS idx_feedbacks_aprobado ON tienda_feedbacks(aprobado);
CREATE INDEX IF NOT EXISTS idx_feedbacks_fecha ON tienda_feedbacks(fecha_creacion);

-- ===== 5. TABLA DE ESTADÍSTICAS DE FEEDBACKS =====
CREATE TABLE IF NOT EXISTS tienda_feedback_stats (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(100) NOT NULL UNIQUE,
    total_feedbacks INTEGER DEFAULT 0,
    promedio_calificacion DECIMAL(3,2) DEFAULT 0.00,
    distribucion_estrellas JSONB DEFAULT '{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}'::jsonb,
    feedbacks_aprobados INTEGER DEFAULT 0,
    feedbacks_pendientes INTEGER DEFAULT 0,
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para estadísticas
CREATE INDEX IF NOT EXISTS idx_feedback_stats_tienda_id ON tienda_feedback_stats(tienda_id);

-- ===== 6. TABLA DE DIARIO EMOCIONAL =====
CREATE TABLE IF NOT EXISTS diario_emocional (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(100) NOT NULL,
    usuario_id VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    emocion_principal VARCHAR(100),
    nivel_energia INTEGER CHECK(nivel_energia >= 1 AND nivel_energia <= 10),
    reflexion TEXT,
    logros TEXT[],
    desafios TEXT[],
    gratitud TEXT[],
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tienda_id, usuario_id, fecha)
);

-- Índices para diario emocional
CREATE INDEX IF NOT EXISTS idx_diario_tienda_usuario ON diario_emocional(tienda_id, usuario_id);
CREATE INDEX IF NOT EXISTS idx_diario_fecha ON diario_emocional(fecha);

-- ===== 7. TABLA DE COMPRADORES =====
CREATE TABLE IF NOT EXISTS compradores (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activo BOOLEAN DEFAULT true,
    preferencias JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para compradores
CREATE INDEX IF NOT EXISTS idx_compradores_email ON compradores(email);
CREATE INDEX IF NOT EXISTS idx_compradores_activo ON compradores(activo);

-- ===== 8. TABLA DE SOPORTE =====
CREATE TABLE IF NOT EXISTS soporte_mensajes (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(100),
    usuario_email VARCHAR(255) NOT NULL,
    asunto VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'consulta',
    prioridad VARCHAR(20) DEFAULT 'normal',
    estado VARCHAR(20) DEFAULT 'pendiente',
    respuesta TEXT,
    fecha_respuesta TIMESTAMP WITH TIME ZONE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para soporte
CREATE INDEX IF NOT EXISTS idx_soporte_tienda_id ON soporte_mensajes(tienda_id);
CREATE INDEX IF NOT EXISTS idx_soporte_email ON soporte_mensajes(usuario_email);
CREATE INDEX IF NOT EXISTS idx_soporte_estado ON soporte_mensajes(estado);

-- ===== 9. TABLA DE CHAT =====
CREATE TABLE IF NOT EXISTS chat_mensajes (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(100) NOT NULL,
    usuario_id VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    es_respuesta BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Índices para chat
CREATE INDEX IF NOT EXISTS idx_chat_tienda_usuario ON chat_mensajes(tienda_id, usuario_id);
CREATE INDEX IF NOT EXISTS idx_chat_fecha ON chat_mensajes(fecha_creacion);

-- ===== 10. FUNCIONES AUXILIARES =====

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION actualizar_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar estadísticas de feedback
CREATE OR REPLACE FUNCTION actualizar_estadisticas_feedback() RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar estadísticas cuando se inserta o actualiza un feedback
    INSERT INTO tienda_feedback_stats (tienda_id, total_feedbacks, promedio_calificacion, distribucion_estrellas, feedbacks_aprobados, feedbacks_pendientes, ultima_actualizacion)
    SELECT 
        NEW.tienda_id,
        COUNT(*) as total_feedbacks,
        ROUND(AVG(calificacion::numeric), 2) as promedio_calificacion,
        jsonb_build_object(
            '1', COUNT(*) FILTER (WHERE calificacion = 1),
            '2', COUNT(*) FILTER (WHERE calificacion = 2),
            '3', COUNT(*) FILTER (WHERE calificacion = 3),
            '4', COUNT(*) FILTER (WHERE calificacion = 4),
            '5', COUNT(*) FILTER (WHERE calificacion = 5)
        ) as distribucion_estrellas,
        COUNT(*) FILTER (WHERE aprobado = true) as feedbacks_aprobados,
        COUNT(*) FILTER (WHERE aprobado = false) as feedbacks_pendientes,
        NOW()
    FROM tienda_feedbacks 
    WHERE tienda_id = NEW.tienda_id
    ON CONFLICT (tienda_id) 
    DO UPDATE SET
        total_feedbacks = EXCLUDED.total_feedbacks,
        promedio_calificacion = EXCLUDED.promedio_calificacion,
        distribucion_estrellas = EXCLUDED.distribucion_estrellas,
        feedbacks_aprobados = EXCLUDED.feedbacks_aprobados,
        feedbacks_pendientes = EXCLUDED.feedbacks_pendientes,
        ultima_actualizacion = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===== 11. TRIGGERS =====

-- Trigger para actualizar timestamp en tiendas
DROP TRIGGER IF EXISTS trigger_actualizar_timestamp_tiendas ON tiendas;
CREATE TRIGGER trigger_actualizar_timestamp_tiendas
    BEFORE UPDATE ON tiendas
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

-- Trigger para actualizar estadísticas de feedback
DROP TRIGGER IF EXISTS trigger_actualizar_estadisticas_feedback ON tienda_feedbacks;
CREATE TRIGGER trigger_actualizar_estadisticas_feedback
    AFTER INSERT OR UPDATE ON tienda_feedbacks
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_estadisticas_feedback();

-- ===== 12. DATOS DE EJEMPLO PARA LA TIENDA =====

-- Insertar productos de ejemplo para 'ejemplo-tienda'
INSERT INTO productos (tienda_id, nombre, descripcion, precio, categoria, stock, activo) VALUES
('ejemplo-tienda', 'Producto Ejemplo 1', 'Descripción del producto ejemplo 1', 29.99, 'ropa-mujer', 15, true),
('ejemplo-tienda', 'Producto Ejemplo 2', 'Descripción del producto ejemplo 2', 49.99, 'electronica', 8, true),
('ejemplo-tienda', 'Producto Ejemplo 3', 'Descripción del producto ejemplo 3', 19.99, 'hogar', 25, true)
ON CONFLICT DO NOTHING;

-- Insertar servicios de ejemplo para 'ejemplo-tienda'
INSERT INTO servicios (tienda_id, nombre, descripcion, precio, categoria, duracion, activo) VALUES
('ejemplo-tienda', 'Servicio Ejemplo 1', 'Servicio profesional de consultoría', 50.00, 'consultoria', '2 horas', true),
('ejemplo-tienda', 'Servicio Ejemplo 2', 'Servicio de diseño personalizado', 75.00, 'diseno', '1 día', true),
('ejemplo-tienda', 'Servicio Ejemplo 3', 'Servicio de desarrollo web', 100.00, 'desarrollo', '3 días', true)
ON CONFLICT DO NOTHING;

-- Insertar feedbacks de ejemplo para 'ejemplo-tienda'
INSERT INTO tienda_feedbacks (tienda_id, usuario_nombre, usuario_email, calificacion, comentario, aprobado) VALUES
('ejemplo-tienda', 'María González', 'maria@email.com', 5, 'Excelente servicio, muy recomendado!', true),
('ejemplo-tienda', 'Carlos López', 'carlos@email.com', 4, 'Muy buena experiencia, solo un pequeño detalle.', true),
('ejemplo-tienda', 'Ana Martínez', 'ana@email.com', 5, 'Perfecto, cumplió todas mis expectativas.', true),
('ejemplo-tienda', 'Luis Rodríguez', 'luis@email.com', 3, 'Bien, pero podría mejorar en algunos aspectos.', true)
ON CONFLICT DO NOTHING;

-- ===== 13. COMENTARIOS FINALES =====
COMMENT ON TABLE tiendas IS 'Tabla principal de tiendas del sistema Cresalia';
COMMENT ON TABLE productos IS 'Productos de las tiendas';
COMMENT ON TABLE servicios IS 'Servicios ofrecidos por las tiendas';
COMMENT ON TABLE tienda_feedbacks IS 'Feedbacks y reseñas de los clientes';
COMMENT ON TABLE tienda_feedback_stats IS 'Estadísticas agregadas de feedbacks';
COMMENT ON TABLE diario_emocional IS 'Diario emocional para el bienestar de los usuarios';
COMMENT ON TABLE compradores IS 'Registro de compradores';
COMMENT ON TABLE soporte_mensajes IS 'Mensajes de soporte al cliente';
COMMENT ON TABLE chat_mensajes IS 'Mensajes del sistema de chat';

-- ===== FIN DEL SETUP =====
-- ✅ Todas las tablas, índices, triggers y datos de ejemplo han sido creados
-- 🚀 El sistema está listo para el lanzamiento














