-- ===== CONFIGURACIÓN PWA - CRESALIA (VERSIÓN SEGURA) =====
-- Tabla para configuración de PWA por tienda

-- Tabla para configuración de PWA
CREATE TABLE IF NOT EXISTS configuracion_pwa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    
    -- Configuración básica
    nombre_app VARCHAR(255) NOT NULL DEFAULT 'Mi Tienda',
    descripcion_app TEXT,
    color_primario VARCHAR(7) DEFAULT '#7C3AED',
    color_secundario VARCHAR(7) DEFAULT '#EC4899',
    color_fondo VARCHAR(7) DEFAULT '#FFFFFF',
    
    -- Iconos personalizados
    icono_192x192 TEXT,
    icono_512x512 TEXT,
    icono_apple_touch TEXT,
    
    -- Configuración de pantalla
    orientacion VARCHAR(20) DEFAULT 'portrait-primary',
    display_mode VARCHAR(20) DEFAULT 'standalone',
    
    -- Shortcuts personalizados
    shortcuts JSONB DEFAULT '[]',
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para estadísticas de PWA
CREATE TABLE IF NOT EXISTS estadisticas_pwa (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    
    -- Estadísticas de instalación
    instalaciones_totales INTEGER DEFAULT 0,
    instalaciones_mes INTEGER DEFAULT 0,
    instalaciones_semana INTEGER DEFAULT 0,
    
    -- Estadísticas de uso
    sesiones_totales INTEGER DEFAULT 0,
    sesiones_mes INTEGER DEFAULT 0,
    tiempo_promedio_sesion INTEGER DEFAULT 0, -- en minutos
    
    -- Estadísticas de notificaciones
    notificaciones_enviadas INTEGER DEFAULT 0,
    notificaciones_abiertas INTEGER DEFAULT 0,
    tasa_apertura DECIMAL(5,2) DEFAULT 0.00,
    
    -- Fechas
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_configuracion_pwa_tienda ON configuracion_pwa(tienda_id);
CREATE INDEX IF NOT EXISTS idx_estadisticas_pwa_tienda ON estadisticas_pwa(tienda_id);

-- Row Level Security (RLS)
ALTER TABLE configuracion_pwa ENABLE ROW LEVEL SECURITY;
ALTER TABLE estadisticas_pwa ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "usuarios_ver_su_config_pwa" ON configuracion_pwa
    FOR SELECT USING (tienda_id IN (
        SELECT id FROM tiendas WHERE email = auth.jwt() ->> 'email'
    ));

CREATE POLICY "usuarios_actualizar_su_config_pwa" ON configuracion_pwa
    FOR ALL USING (tienda_id IN (
        SELECT id FROM tiendas WHERE email = auth.jwt() ->> 'email'
    ));

CREATE POLICY "usuarios_ver_sus_estadisticas_pwa" ON estadisticas_pwa
    FOR SELECT USING (tienda_id IN (
        SELECT id FROM tiendas WHERE email = auth.jwt() ->> 'email'
    ));

-- Función para actualizar estadísticas de PWA
CREATE OR REPLACE FUNCTION actualizar_estadisticas_pwa(
    p_tienda_id UUID,
    p_tipo_evento VARCHAR(50)
) RETURNS VOID AS $$
BEGIN
    INSERT INTO estadisticas_pwa (tienda_id, instalaciones_totales, sesiones_totales)
    VALUES (p_tienda_id, 
            CASE WHEN p_tipo_evento = 'instalacion' THEN 1 ELSE 0 END,
            CASE WHEN p_tipo_evento = 'sesion' THEN 1 ELSE 0 END)
    ON CONFLICT (tienda_id) DO UPDATE SET
        instalaciones_totales = CASE WHEN p_tipo_evento = 'instalacion' 
                                    THEN estadisticas_pwa.instalaciones_totales + 1 
                                    ELSE estadisticas_pwa.instalaciones_totales END,
        sesiones_totales = CASE WHEN p_tipo_evento = 'sesion' 
                               THEN estadisticas_pwa.sesiones_totales + 1 
                               ELSE estadisticas_pwa.sesiones_totales END,
        fecha_actualizacion = NOW();
END;
$$ LANGUAGE plpgsql;

-- Función para obtener configuración PWA de una tienda
CREATE OR REPLACE FUNCTION obtener_configuracion_pwa(p_tienda_id UUID)
RETURNS JSON AS $$
DECLARE
    config JSON;
BEGIN
    SELECT json_build_object(
        'nombre_app', COALESCE(nombre_app, 'Mi Tienda'),
        'descripcion_app', COALESCE(descripcion_app, 'Tienda online creada con Cresalia'),
        'color_primario', COALESCE(color_primario, '#7C3AED'),
        'color_secundario', COALESCE(color_secundario, '#EC4899'),
        'color_fondo', COALESCE(color_fondo, '#FFFFFF'),
        'icono_192x192', COALESCE(icono_192x192, '/icons/icon-192x192.png'),
        'icono_512x512', COALESCE(icono_512x512, '/icons/icon-512x512.png'),
        'orientacion', COALESCE(orientacion, 'portrait-primary'),
        'display_mode', COALESCE(display_mode, 'standalone'),
        'shortcuts', COALESCE(shortcuts, '[]'::jsonb)
    ) INTO config
    FROM configuracion_pwa
    WHERE tienda_id = p_tienda_id AND activo = true;
    
    RETURN COALESCE(config, '{}'::json);
END;
$$ LANGUAGE plpgsql;

-- Insertar configuración PWA por defecto para tiendas existentes (VERSIÓN SEGURA)
INSERT INTO configuracion_pwa (tienda_id, nombre_app, descripcion_app)
SELECT 
    id,
    nombre_tienda,
    'Tienda online creada con Cresalia - ' || COALESCE(
        (SELECT descripcion FROM tiendas t2 WHERE t2.id = t1.id), 
        'Plataforma de emprendedores'
    )
FROM tiendas t1
WHERE id NOT IN (SELECT tienda_id FROM configuracion_pwa);

-- Comentarios
COMMENT ON TABLE configuracion_pwa IS 'Configuración personalizada de PWA para cada tienda';
COMMENT ON TABLE estadisticas_pwa IS 'Estadísticas de uso de PWA por tienda';
COMMENT ON FUNCTION actualizar_estadisticas_pwa IS 'Actualiza estadísticas de PWA cuando ocurre un evento';
COMMENT ON FUNCTION obtener_configuracion_pwa IS 'Obtiene la configuración PWA de una tienda específica';

