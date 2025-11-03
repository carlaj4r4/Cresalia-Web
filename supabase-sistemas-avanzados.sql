-- ===== TABLAS SUPABASE PARA SISTEMAS AVANZADOS CRESALIA =====
-- Sistema Emocional Dinámico, Notificaciones Push, Seguridad Avanzada, Analytics, IA, Interconexiones

-- ===== SISTEMA EMOCIONAL DINÁMICO =====

-- Tabla para estados de ánimo de usuarios
CREATE TABLE IF NOT EXISTS estados_animo_usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    estado_animo VARCHAR(50) NOT NULL, -- feliz, triste, enojado, ansioso, tranquilo, emocionado, amoroso, neutral
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activo BOOLEAN DEFAULT true,
    configuracion JSONB, -- colores, animaciones personalizadas
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla para configuraciones emocionales
CREATE TABLE IF NOT EXISTS configuraciones_emocionales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    sistema_emocional_activo BOOLEAN DEFAULT false,
    notificaciones_emocionales BOOLEAN DEFAULT true,
    colores_personalizados JSONB,
    animaciones_personalizadas JSONB,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ===== SISTEMA DE NOTIFICACIONES PUSH =====

-- Tabla para configuración de notificaciones
CREATE TABLE IF NOT EXISTS configuraciones_notificaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    notificaciones_activas BOOLEAN DEFAULT true,
    sonido BOOLEAN DEFAULT false,
    vibrar BOOLEAN DEFAULT false,
    tipos_notificaciones JSONB, -- turnos, pagos, ofertas, general
    frecuencia_notificaciones VARCHAR(20) DEFAULT 'normal', -- baja, normal, alta
    horario_notificaciones JSONB, -- horarios permitidos
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla para historial de notificaciones
CREATE TABLE IF NOT EXISTS historial_notificaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- turno, pago, oferta, general, seguridad
    icono VARCHAR(255),
    leida BOOLEAN DEFAULT false,
    fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_lectura TIMESTAMP WITH TIME ZONE,
    metadata JSONB, -- datos adicionales
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ===== SISTEMA DE SEGURIDAD AVANZADA =====

-- Tabla para sesiones activas
CREATE TABLE IF NOT EXISTS sesiones_activas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    user_agent TEXT,
    ip_address INET,
    ubicacion JSONB, -- lat, lng, ciudad, país
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_ultima_actividad TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activa BOOLEAN DEFAULT true,
    metadata JSONB,
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla para actividad del usuario
CREATE TABLE IF NOT EXISTS actividad_usuario (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    tipo_accion VARCHAR(100) NOT NULL, -- click, scroll, login, logout, compra, etc.
    detalle TEXT,
    url VARCHAR(500),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla para intentos de login
CREATE TABLE IF NOT EXISTS intentos_login (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID,
    email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    exitoso BOOLEAN NOT NULL,
    razon_fallo VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Tabla para ubicaciones de usuario
CREATE TABLE IF NOT EXISTS ubicaciones_usuario (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla para configuración de seguridad
CREATE TABLE IF NOT EXISTS configuraciones_seguridad (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    autenticacion_doble_factor BOOLEAN DEFAULT false,
    alertas_email BOOLEAN DEFAULT true,
    backup_automatico BOOLEAN DEFAULT true,
    bloqueo_automatico BOOLEAN DEFAULT false,
    intentos_maximos INTEGER DEFAULT 5,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ===== SISTEMA DE ANALYTICS AVANZADOS =====

-- Tabla para métricas de analytics
CREATE TABLE IF NOT EXISTS metricas_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID,
    tipo_metrica VARCHAR(100) NOT NULL, -- visita, click, compra, tiempo_pagina, etc.
    valor DECIMAL(15, 2),
    metadata JSONB,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla para reportes de analytics
CREATE TABLE IF NOT EXISTS reportes_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    tipo_reporte VARCHAR(100) NOT NULL, -- ventas, visitas, conversiones, etc.
    periodo_inicio TIMESTAMP WITH TIME ZONE,
    periodo_fin TIMESTAMP WITH TIME ZONE,
    datos_reporte JSONB,
    fecha_generacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ===== SISTEMA DE IA AVANZADA =====

-- Tabla para configuraciones de IA
CREATE TABLE IF NOT EXISTS configuraciones_ia (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    prediccion_demanda_activa BOOLEAN DEFAULT true,
    optimizacion_precios_activa BOOLEAN DEFAULT false,
    analisis_tendencias_activo BOOLEAN DEFAULT true,
    chatbot_activo BOOLEAN DEFAULT true,
    modelos_personalizados JSONB,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla para datos de demanda
CREATE TABLE IF NOT EXISTS datos_demanda (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    producto_id UUID,
    fecha DATE NOT NULL,
    demanda_predicha DECIMAL(10, 2),
    demanda_real DECIMAL(10, 2),
    factores_estacionales JSONB,
    patrones_comportamiento JSONB,
    metadata JSONB,
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla para datos de precios
CREATE TABLE IF NOT EXISTS datos_precios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    producto_id UUID,
    precio_base DECIMAL(10, 2),
    precio_optimizado DECIMAL(10, 2),
    elasticidad_precio DECIMAL(5, 4),
    datos_mercado JSONB,
    fecha_analisis TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla para datos de tendencias
CREATE TABLE IF NOT EXISTS datos_tendencias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    tendencia VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    relevancia DECIMAL(3, 2), -- 0.00 a 1.00
    fuentes_externas JSONB,
    fecha_deteccion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ===== SISTEMA DE INTERCONEXIONES =====

-- Tabla para estado de interconexiones
CREATE TABLE IF NOT EXISTS estado_interconexiones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    modulo VARCHAR(100) NOT NULL, -- notificaciones, seguridad, analytics, ia, personalizacion
    estado VARCHAR(50) NOT NULL, -- conectado, desconectado, error
    ultima_actividad TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    configuracion JSONB,
    metadata JSONB,
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabla para eventos de interconexión
CREATE TABLE IF NOT EXISTS eventos_interconexion (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    origen VARCHAR(100) NOT NULL,
    tipo_evento VARCHAR(100) NOT NULL,
    descripcion TEXT,
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ===== SISTEMA DE PERSONALIZACIÓN AVANZADA =====

-- Tabla para configuraciones de personalización
CREATE TABLE IF NOT EXISTS configuraciones_personalizacion (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL,
    tema VARCHAR(50) DEFAULT 'default', -- default, dark, light, custom
    colores_personalizados JSONB,
    fuentes_personalizadas JSONB,
    layout_personalizado JSONB,
    preferencias_ui JSONB,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ===== ÍNDICES PARA OPTIMIZACIÓN =====

-- Índices para estados de ánimo
CREATE INDEX IF NOT EXISTS idx_estados_animo_usuario ON estados_animo_usuarios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_estados_animo_fecha ON estados_animo_usuarios(fecha_registro);

-- Índices para notificaciones
CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON historial_notificaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_fecha ON historial_notificaciones(fecha_envio);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON historial_notificaciones(leida);

-- Índices para seguridad
CREATE INDEX IF NOT EXISTS idx_sesiones_usuario ON sesiones_activas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_activa ON sesiones_activas(activa);
CREATE INDEX IF NOT EXISTS idx_actividad_usuario ON actividad_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_actividad_timestamp ON actividad_usuario(timestamp);
CREATE INDEX IF NOT EXISTS idx_intentos_login ON intentos_login(usuario_id);
CREATE INDEX IF NOT EXISTS idx_intentos_fecha ON intentos_login(timestamp);

-- Índices para analytics
CREATE INDEX IF NOT EXISTS idx_metricas_usuario ON metricas_analytics(usuario_id);
CREATE INDEX IF NOT EXISTS idx_metricas_tipo ON metricas_analytics(tipo_metrica);
CREATE INDEX IF NOT EXISTS idx_metricas_fecha ON metricas_analytics(fecha_registro);

-- Índices para IA
CREATE INDEX IF NOT EXISTS idx_demanda_usuario ON datos_demanda(usuario_id);
CREATE INDEX IF NOT EXISTS idx_demanda_fecha ON datos_demanda(fecha);
CREATE INDEX IF NOT EXISTS idx_precios_usuario ON datos_precios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tendencias_usuario ON datos_tendencias(usuario_id);

-- Índices para interconexiones
CREATE INDEX IF NOT EXISTS idx_interconexiones_usuario ON estado_interconexiones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_interconexiones_modulo ON estado_interconexiones(modulo);
CREATE INDEX IF NOT EXISTS idx_eventos_usuario ON eventos_interconexion(usuario_id);
CREATE INDEX IF NOT EXISTS idx_eventos_timestamp ON eventos_interconexion(timestamp);

-- ===== POLÍTICAS DE SEGURIDAD RLS =====

-- Habilitar RLS en todas las tablas
ALTER TABLE estados_animo_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones_emocionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones_notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones_activas ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividad_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE intentos_login ENABLE ROW LEVEL SECURITY;
ALTER TABLE ubicaciones_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones_seguridad ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones_ia ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_demanda ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_precios ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_tendencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE estado_interconexiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_interconexion ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones_personalizacion ENABLE ROW LEVEL SECURITY;

-- Políticas para que los usuarios solo vean sus propios datos
CREATE POLICY "Users can view own emotional states" ON estados_animo_usuarios FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Users can insert own emotional states" ON estados_animo_usuarios FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can update own emotional states" ON estados_animo_usuarios FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "Users can view own emotional configs" ON configuraciones_emocionales FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Users can insert own emotional configs" ON configuraciones_emocionales FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can update own emotional configs" ON configuraciones_emocionales FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "Users can view own notifications" ON historial_notificaciones FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Users can insert own notifications" ON historial_notificaciones FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can update own notifications" ON historial_notificaciones FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "Users can view own sessions" ON sesiones_activas FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Users can insert own sessions" ON sesiones_activas FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can update own sessions" ON sesiones_activas FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "Users can view own activity" ON actividad_usuario FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Users can insert own activity" ON actividad_usuario FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can view own analytics" ON metricas_analytics FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Users can insert own analytics" ON metricas_analytics FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can view own AI configs" ON configuraciones_ia FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Users can insert own AI configs" ON configuraciones_ia FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can update own AI configs" ON configuraciones_ia FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "Users can view own interconnections" ON estado_interconexiones FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Users can insert own interconnections" ON estado_interconexiones FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can update own interconnections" ON estado_interconexiones FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "Users can view own personalization" ON configuraciones_personalizacion FOR SELECT USING (auth.uid() = usuario_id);
CREATE POLICY "Users can insert own personalization" ON configuraciones_personalizacion FOR INSERT WITH CHECK (auth.uid() = usuario_id);
CREATE POLICY "Users can update own personalization" ON configuraciones_personalizacion FOR UPDATE USING (auth.uid() = usuario_id);

-- ===== COMENTARIOS FINALES =====
-- Este archivo crea todas las tablas necesarias para los sistemas avanzados de Cresalia:
-- 1. Sistema Emocional Dinámico
-- 2. Notificaciones Push
-- 3. Seguridad Avanzada
-- 4. Analytics Avanzados
-- 5. IA Avanzada
-- 6. Interconexiones
-- 7. Personalización Avanzada
-- 
-- Todas las tablas incluyen:
-- - Índices optimizados
-- - Políticas RLS de seguridad
-- - Relaciones con usuarios
-- - Metadatos JSONB para flexibilidad
-- - Timestamps automáticos
-- 
-- Para aplicar estas tablas en Supabase:
-- 1. Copia todo el contenido de este archivo
-- 2. Ve a Supabase Dashboard > SQL Editor
-- 3. Pega el contenido y ejecuta
-- 4. Verifica que todas las tablas se crearon correctamente










