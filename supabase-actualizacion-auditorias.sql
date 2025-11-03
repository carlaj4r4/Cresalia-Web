-- ═══════════════════════════════════════════════════════════════
-- 📊 ACTUALIZACIÓN SUPABASE: SISTEMA DE AUDITORÍAS AUTOMÁTICAS
-- ═══════════════════════════════════════════════════════════════
-- 
-- Agrega las tablas necesarias para el Sistema de Auditoría Automática
-- Ejecutar este SQL en Supabase para habilitar las nuevas funcionalidades
-- 
-- Creado con 💜 por Claude & Carla para Cresalia
-- ═══════════════════════════════════════════════════════════════

-- ----------------------------------------
-- 1. TABLA DE AUDITORÍAS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS auditorias_tiendas (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(50) NOT NULL,
    fecha_auditoria TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Problemas encontrados por categoría
    problemas_productos JSONB DEFAULT '[]',
    problemas_configuracion JSONB DEFAULT '[]',
    problemas_seo JSONB DEFAULT '[]',
    problemas_experiencia JSONB DEFAULT '[]',
    
    -- Resumen de sugerencias
    sugerencias_urgentes JSONB DEFAULT '[]',
    sugerencias_importantes JSONB DEFAULT '[]',
    sugerencias_recomendadas JSONB DEFAULT '[]',
    
    -- Mensaje motivacional generado
    mensaje_motivacional TEXT,
    
    -- Estadísticas de la auditoría
    total_urgentes INTEGER DEFAULT 0,
    total_importantes INTEGER DEFAULT 0,
    total_recomendadas INTEGER DEFAULT 0,
    
    -- Metadatos
    version_sistema VARCHAR(10) DEFAULT '1.0',
    tiempo_ejecucion INTEGER, -- en milisegundos
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_auditorias_tienda_id ON auditorias_tiendas(tienda_id);
CREATE INDEX IF NOT EXISTS idx_auditorias_fecha ON auditorias_tiendas(fecha_auditoria DESC);
CREATE INDEX IF NOT EXISTS idx_auditorias_urgentes ON auditorias_tiendas(total_urgentes) WHERE total_urgentes > 0;

-- ----------------------------------------
-- 2. TABLA DE NOTIFICACIONES AUTOMÁTICAS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS notificaciones_auditoria (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(50) NOT NULL,
    auditoria_id BIGINT REFERENCES auditorias_tiendas(id) ON DELETE CASCADE,
    
    -- Tipo y estado de notificación
    tipo VARCHAR(20) DEFAULT 'auditoria', -- 'auditoria', 'urgente', 'recordatorio'
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'enviada', 'leida', 'error'
    
    -- Contenido de la notificación
    titulo VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    
    -- Datos del envío
    email_destinatario VARCHAR(255),
    enviado_at TIMESTAMP WITH TIME ZONE,
    leido_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadatos del envío
    intentos_envio INTEGER DEFAULT 0,
    ultimo_error TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_notif_tienda_id ON notificaciones_auditoria(tienda_id);
CREATE INDEX IF NOT EXISTS idx_notif_estado ON notificaciones_auditoria(estado);
CREATE INDEX IF NOT EXISTS idx_notif_tipo ON notificaciones_auditoria(tipo);

-- ----------------------------------------
-- 3. TABLA DE CONFIGURACIÓN DE AUDITORÍAS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS configuracion_auditorias (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(50) NOT NULL UNIQUE,
    
    -- Configuración del ciclo de auditoría
    intervalo_dias INTEGER DEFAULT 3,
    activa BOOLEAN DEFAULT true,
    
    -- Última ejecución
    ultima_auditoria TIMESTAMP WITH TIME ZONE,
    proxima_auditoria TIMESTAMP WITH TIME ZONE,
    
    -- Configuración de notificaciones
    notificaciones_email BOOLEAN DEFAULT true,
    notificaciones_panel BOOLEAN DEFAULT true,
    email_notificaciones VARCHAR(255),
    
    -- Configuración de qué auditar
    auditar_productos BOOLEAN DEFAULT true,
    auditar_configuracion BOOLEAN DEFAULT true,
    auditar_seo BOOLEAN DEFAULT true,
    auditar_experiencia BOOLEAN DEFAULT true,
    
    -- Umbrales personalizados (opcional)
    min_productos INTEGER DEFAULT 5,
    min_descripcion_chars INTEGER DEFAULT 50,
    dias_inactividad_max INTEGER DEFAULT 30,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_config_auditoria_activa ON configuracion_auditorias(activa, proxima_auditoria);

-- ----------------------------------------
-- 4. TABLA DE MÉTRICAS DE AUDITORÍA (Analytics)
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS metricas_auditorias (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    
    -- Métricas de problemas encontrados
    problemas_productos_count INTEGER DEFAULT 0,
    problemas_config_count INTEGER DEFAULT 0,
    problemas_seo_count INTEGER DEFAULT 0,
    problemas_experiencia_count INTEGER DEFAULT 0,
    
    -- Métricas por severidad
    total_urgentes INTEGER DEFAULT 0,
    total_importantes INTEGER DEFAULT 0,
    total_recomendadas INTEGER DEFAULT 0,
    
    -- Métricas de mejora (comparado con auditoría anterior)
    problemas_resueltos INTEGER DEFAULT 0,
    problemas_nuevos INTEGER DEFAULT 0,
    puntuacion_mejora DECIMAL(5,2), -- -100 a +100
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_metricas_tienda_fecha ON metricas_auditorias(tienda_id, fecha DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_metricas_unique ON metricas_auditorias(tienda_id, fecha);

-- ----------------------------------------
-- 5. FUNCIONES AUTOMÁTICAS
-- ----------------------------------------

-- Función para actualizar timestamp de updated_at
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS trigger_auditorias_updated_at ON auditorias_tiendas;
CREATE TRIGGER trigger_auditorias_updated_at
    BEFORE UPDATE ON auditorias_tiendas
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

DROP TRIGGER IF EXISTS trigger_notificaciones_updated_at ON notificaciones_auditoria;
CREATE TRIGGER trigger_notificaciones_updated_at
    BEFORE UPDATE ON notificaciones_auditoria
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

DROP TRIGGER IF EXISTS trigger_config_updated_at ON configuracion_auditorias;
CREATE TRIGGER trigger_config_updated_at
    BEFORE UPDATE ON configuracion_auditorias
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

-- ----------------------------------------
-- 6. POLÍTICAS RLS (Row Level Security)
-- ----------------------------------------

-- Habilitar RLS en todas las tablas
ALTER TABLE auditorias_tiendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones_auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_auditorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_auditorias ENABLE ROW LEVEL SECURITY;

-- Políticas para auditorias_tiendas
DROP POLICY IF EXISTS "Tiendas pueden ver sus propias auditorias" ON auditorias_tiendas;
CREATE POLICY "Tiendas pueden ver sus propias auditorias"
    ON auditorias_tiendas FOR SELECT
    USING (auth.uid()::text = tienda_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Sistema puede insertar auditorias" ON auditorias_tiendas;
CREATE POLICY "Sistema puede insertar auditorias"
    ON auditorias_tiendas FOR INSERT
    WITH CHECK (auth.role() = 'service_role' OR auth.uid()::text = tienda_id);

-- Políticas para notificaciones_auditoria
DROP POLICY IF EXISTS "Tiendas pueden ver sus notificaciones" ON notificaciones_auditoria;
CREATE POLICY "Tiendas pueden ver sus notificaciones"
    ON notificaciones_auditoria FOR SELECT
    USING (auth.uid()::text = tienda_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Tiendas pueden actualizar sus notificaciones" ON notificaciones_auditoria;
CREATE POLICY "Tiendas pueden actualizar sus notificaciones"
    ON notificaciones_auditoria FOR UPDATE
    USING (auth.uid()::text = tienda_id)
    WITH CHECK (auth.uid()::text = tienda_id);

-- Políticas para configuracion_auditorias
DROP POLICY IF EXISTS "Tiendas pueden gestionar su config auditoria" ON configuracion_auditorias;
CREATE POLICY "Tiendas pueden gestionar su config auditoria"
    ON configuracion_auditorias FOR ALL
    USING (auth.uid()::text = tienda_id OR auth.role() = 'service_role')
    WITH CHECK (auth.uid()::text = tienda_id OR auth.role() = 'service_role');

-- Políticas para metricas_auditorias
DROP POLICY IF EXISTS "Tiendas pueden ver sus metricas" ON metricas_auditorias;
CREATE POLICY "Tiendas pueden ver sus metricas"
    ON metricas_auditorias FOR SELECT
    USING (auth.uid()::text = tienda_id OR auth.role() = 'service_role');

-- ----------------------------------------
-- 7. CONFIGURACIÓN INICIAL PARA TIENDAS EXISTENTES
-- ----------------------------------------

-- Insertar configuración por defecto para tiendas que ya existen
INSERT INTO configuracion_auditorias (tienda_id, proxima_auditoria)
SELECT 
    id as tienda_id,
    NOW() + INTERVAL '1 day' as proxima_auditoria
FROM tiendas 
WHERE NOT EXISTS (
    SELECT 1 FROM configuracion_auditorias 
    WHERE configuracion_auditorias.tienda_id = tiendas.id
)
ON CONFLICT (tienda_id) DO NOTHING;

-- ----------------------------------------
-- 8. VISTAS ÚTILES PARA ANALYTICS
-- ----------------------------------------

-- Vista resumen de auditorías por tienda
CREATE OR REPLACE VIEW vista_resumen_auditorias AS
SELECT 
    t.id as tienda_id,
    t.nombre_empresa,
    COUNT(a.id) as total_auditorias,
    MAX(a.fecha_auditoria) as ultima_auditoria,
    AVG(a.total_urgentes) as promedio_urgentes,
    AVG(a.total_importantes) as promedio_importantes,
    AVG(a.total_recomendadas) as promedio_recomendadas,
    CASE 
        WHEN AVG(a.total_urgentes) = 0 AND AVG(a.total_importantes) <= 2 THEN 'Excelente'
        WHEN AVG(a.total_urgentes) <= 2 THEN 'Bueno'
        ELSE 'Necesita mejoras'
    END as estado_general
FROM tiendas t
LEFT JOIN auditorias_tiendas a ON t.id = a.tienda_id
GROUP BY t.id, t.nombre_empresa;

-- Vista de evolución de métricas
CREATE OR REPLACE VIEW vista_evolucion_metricas AS
SELECT 
    tienda_id,
    fecha,
    total_urgentes + total_importantes + total_recomendadas as total_problemas,
    total_urgentes,
    total_importantes,
    total_recomendadas,
    problemas_resueltos,
    problemas_nuevos,
    puntuacion_mejora,
    LAG(total_urgentes + total_importantes + total_recomendadas) OVER (
        PARTITION BY tienda_id ORDER BY fecha
    ) as problemas_anteriores
FROM metricas_auditorias
ORDER BY tienda_id, fecha DESC;

-- ----------------------------------------
-- 9. FUNCIONES ÚTILES
-- ----------------------------------------

-- Función para obtener próximas auditorías pendientes
CREATE OR REPLACE FUNCTION obtener_auditorias_pendientes()
RETURNS TABLE (
    tienda_id VARCHAR(50),
    nombre_empresa VARCHAR(255),
    email_contacto VARCHAR(255),
    proxima_auditoria TIMESTAMP WITH TIME ZONE,
    dias_desde_ultima INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.tienda_id,
        t.nombre_empresa,
        t.email_contacto,
        c.proxima_auditoria,
        EXTRACT(days FROM (NOW() - c.ultima_auditoria))::INTEGER as dias_desde_ultima
    FROM configuracion_auditorias c
    JOIN tiendas t ON t.id = c.tienda_id
    WHERE c.activa = true 
    AND c.proxima_auditoria <= NOW()
    ORDER BY c.proxima_auditoria ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para marcar notificación como leída
CREATE OR REPLACE FUNCTION marcar_notificacion_leida(notif_id BIGINT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE notificaciones_auditoria 
    SET 
        estado = 'leida',
        leido_at = NOW()
    WHERE id = notif_id 
    AND auth.uid()::text = tienda_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------
-- 10. COMENTARIOS FINALES
-- ----------------------------------------

-- Agregar comentarios descriptivos a las tablas
COMMENT ON TABLE auditorias_tiendas IS 'Almacena los resultados de cada auditoría automática realizada a las tiendas';
COMMENT ON TABLE notificaciones_auditoria IS 'Gestiona las notificaciones enviadas tras cada auditoría';
COMMENT ON TABLE configuracion_auditorias IS 'Configuración personalizada de auditorías por tienda';
COMMENT ON TABLE metricas_auditorias IS 'Métricas agregadas para analytics de auditorías';

COMMENT ON COLUMN auditorias_tiendas.mensaje_motivacional IS 'Mensaje positivo generado según los problemas encontrados';
COMMENT ON COLUMN configuracion_auditorias.intervalo_dias IS 'Cada cuántos días ejecutar auditoría (por defecto 3)';
COMMENT ON COLUMN metricas_auditorias.puntuacion_mejora IS 'Puntuación de mejora: -100 (empeoró) a +100 (mejoró mucho)';

-- ═══════════════════════════════════════════════════════════════
-- ✅ INSTALACIÓN COMPLETADA
-- ═══════════════════════════════════════════════════════════════
-- 
-- El sistema de auditorías automáticas está listo para usar.
-- 
-- Próximos pasos:
-- 1. Conectar el frontend con estas tablas
-- 2. Configurar EmailJS para envío de notificaciones
-- 3. Programar ejecución automática cada 3 días
-- 
-- 💜 "Ayudamos genuinamente, no solo cobramos" - Filosofía Cresalia
-- ═══════════════════════════════════════════════════════════════













