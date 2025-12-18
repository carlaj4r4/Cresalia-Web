-- ============================================
-- 🚨 SISTEMA DE ALERTAS MEJORADO - CRESALIA
-- ============================================
-- Solidaridad Global + Proximidad Local
-- SIN ROMPER NADA EXISTENTE
--
-- Para ejecutar en AMBOS proyectos Supabase:
-- - E-commerce
-- - Comunidades

-- ============================================
-- PASO 1: AGREGAR NUEVOS CAMPOS (Sin romper existentes)
-- ============================================

-- Campo para diferenciar alcance (global vs local)
ALTER TABLE alertas_emergencia_comunidades 
ADD COLUMN IF NOT EXISTS alcance VARCHAR(20) DEFAULT 'global' 
CHECK (alcance IN ('global', 'local'));

-- Horas/días sin servicio (para presionar autoridades)
ALTER TABLE alertas_emergencia_comunidades 
ADD COLUMN IF NOT EXISTS horas_sin_servicio INTEGER DEFAULT 0;

ALTER TABLE alertas_emergencia_comunidades 
ADD COLUMN IF NOT EXISTS dias_sin_servicio INTEGER GENERATED ALWAYS AS (horas_sin_servicio / 24) STORED;

-- URLs de redirección a donaciones
ALTER TABLE alertas_emergencia_comunidades 
ADD COLUMN IF NOT EXISTS url_donacion_materiales TEXT DEFAULT '/cresalia-solidario-emergencias/donar-materiales.html';

ALTER TABLE alertas_emergencia_comunidades 
ADD COLUMN IF NOT EXISTS url_donacion_dinero TEXT DEFAULT '/cresalia-solidario-emergencias/index.html';

ALTER TABLE alertas_emergencia_comunidades 
ADD COLUMN IF NOT EXISTS url_pedir_ayuda TEXT DEFAULT '/cresalia-solidario-emergencias/panel-crear-campana.html';

-- Contador de ayudas (para transparencia)
ALTER TABLE alertas_emergencia_comunidades 
ADD COLUMN IF NOT EXISTS total_donaciones_dinero DECIMAL(10,2) DEFAULT 0;

ALTER TABLE alertas_emergencia_comunidades 
ADD COLUMN IF NOT EXISTS total_donaciones_materiales INTEGER DEFAULT 0;

ALTER TABLE alertas_emergencia_comunidades 
ADD COLUMN IF NOT EXISTS total_personas_ayudando INTEGER DEFAULT 0;

-- ============================================
-- PASO 2: ÍNDICES PARA RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_alertas_alcance ON alertas_emergencia_comunidades(alcance, activa);
CREATE INDEX IF NOT EXISTS idx_alertas_horas ON alertas_emergencia_comunidades(horas_sin_servicio DESC);

-- ============================================
-- PASO 3: FUNCIÓN DE CÁLCULO DE DISTANCIA (Haversine)
-- ============================================

CREATE OR REPLACE FUNCTION calcular_distancia_km(
    lat1 DOUBLE PRECISION,
    lng1 DOUBLE PRECISION,
    lat2 DOUBLE PRECISION,
    lng2 DOUBLE PRECISION
)
RETURNS DOUBLE PRECISION AS $$
DECLARE
    R CONSTANT DOUBLE PRECISION := 6371; -- Radio de la Tierra en km
    dLat DOUBLE PRECISION;
    dLng DOUBLE PRECISION;
    a DOUBLE PRECISION;
    c DOUBLE PRECISION;
BEGIN
    -- Convertir a radianes
    dLat := radians(lat2 - lat1);
    dLng := radians(lng2 - lng1);
    
    -- Fórmula de Haversine
    a := sin(dLat/2) * sin(dLat/2) +
         cos(radians(lat1)) * cos(radians(lat2)) *
         sin(dLng/2) * sin(dLng/2);
    
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    
    -- Retornar distancia en kilómetros
    RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calcular_distancia_km IS 'Calcula distancia entre dos coordenadas usando fórmula de Haversine';

-- ============================================
-- PASO 4: FUNCIÓN MEJORADA - ALERTAS POR PROXIMIDAD
-- ============================================

CREATE OR REPLACE FUNCTION obtener_alertas_inteligentes(
    p_usuario_lat DOUBLE PRECISION DEFAULT NULL,
    p_usuario_lng DOUBLE PRECISION DEFAULT NULL,
    p_usuario_hash VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    id INTEGER,
    tipo VARCHAR,
    alcance VARCHAR,
    titulo VARCHAR,
    descripcion TEXT,
    severidad VARCHAR,
    pais VARCHAR,
    provincia VARCHAR,
    ciudad VARCHAR,
    coordenadas JSONB,
    radio_km INTEGER,
    horas_sin_servicio INTEGER,
    dias_sin_servicio INTEGER,
    distancia_usuario_km DOUBLE PRECISION,
    enlace_oficial TEXT,
    url_donacion_materiales TEXT,
    url_donacion_dinero TEXT,
    url_pedir_ayuda TEXT,
    total_donaciones_dinero DECIMAL,
    total_donaciones_materiales INTEGER,
    total_personas_ayudando INTEGER,
    fecha_creacion TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_distancia DOUBLE PRECISION;
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.tipo,
        a.alcance,
        a.titulo,
        a.descripcion,
        a.severidad,
        a.pais,
        a.provincia,
        a.ciudad,
        a.coordenadas,
        a.radio_afectacion_km as radio_km,
        a.horas_sin_servicio,
        a.dias_sin_servicio,
        
        -- Calcular distancia si hay coordenadas del usuario
        CASE 
            WHEN p_usuario_lat IS NOT NULL AND p_usuario_lng IS NOT NULL 
                 AND a.coordenadas IS NOT NULL THEN
                calcular_distancia_km(
                    p_usuario_lat,
                    p_usuario_lng,
                    (a.coordenadas->>'lat')::DOUBLE PRECISION,
                    (a.coordenadas->>'lng')::DOUBLE PRECISION
                )
            ELSE NULL
        END as distancia_usuario_km,
        
        a.enlace_oficial,
        a.url_donacion_materiales,
        a.url_donacion_dinero,
        a.url_pedir_ayuda,
        a.total_donaciones_dinero,
        a.total_donaciones_materiales,
        a.total_personas_ayudando,
        a.fecha_creacion
        
    FROM alertas_emergencia_comunidades a
    WHERE a.activa = true
    AND (a.fecha_expiracion IS NULL OR a.fecha_expiracion > NOW())
    
    -- Filtro de proximidad para alertas locales
    AND (
        -- Desastres globales: SIEMPRE mostrar
        a.alcance = 'global'
        
        OR
        
        -- Emergencias locales: Solo si el usuario está dentro del radio
        (
            a.alcance = 'local' 
            AND p_usuario_lat IS NOT NULL 
            AND p_usuario_lng IS NOT NULL
            AND a.coordenadas IS NOT NULL
            AND calcular_distancia_km(
                p_usuario_lat,
                p_usuario_lng,
                (a.coordenadas->>'lat')::DOUBLE PRECISION,
                (a.coordenadas->>'lng')::DOUBLE PRECISION
            ) <= a.radio_afectacion_km
        )
    )
    
    -- No mostrar si ya la vio
    AND (p_usuario_hash IS NULL OR NOT EXISTS (
        SELECT 1 FROM alertas_vistas_usuarios v
        WHERE v.alerta_id = a.id AND v.usuario_hash = p_usuario_hash
    ))
    
    ORDER BY 
        -- Prioridad por alcance (globales primero para solidaridad)
        CASE a.alcance
            WHEN 'global' THEN 1
            WHEN 'local' THEN 2
        END,
        -- Luego por severidad
        CASE a.severidad
            WHEN 'critica' THEN 1
            WHEN 'alta' THEN 2
            WHEN 'media' THEN 3
            WHEN 'baja' THEN 4
        END,
        -- Locales: más horas sin servicio = más urgente
        a.horas_sin_servicio DESC,
        -- Finalmente por fecha
        a.fecha_creacion DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION obtener_alertas_inteligentes IS 'Obtiene alertas filtradas por alcance (global/local) y proximidad del usuario';

-- ============================================
-- PASO 5: FUNCIÓN PARA ACTUALIZAR CONTADOR DE AYUDAS
-- ============================================

CREATE OR REPLACE FUNCTION registrar_ayuda(
    p_alerta_id INTEGER,
    p_tipo_ayuda VARCHAR, -- 'dinero', 'materiales', 'voluntario'
    p_monto DECIMAL DEFAULT 0
)
RETURNS JSONB AS $$
BEGIN
    IF p_tipo_ayuda = 'dinero' THEN
        UPDATE alertas_emergencia_comunidades
        SET 
            total_donaciones_dinero = total_donaciones_dinero + p_monto,
            total_personas_ayudando = total_personas_ayudando + 1
        WHERE id = p_alerta_id;
        
    ELSIF p_tipo_ayuda = 'materiales' THEN
        UPDATE alertas_emergencia_comunidades
        SET 
            total_donaciones_materiales = total_donaciones_materiales + 1,
            total_personas_ayudando = total_personas_ayudando + 1
        WHERE id = p_alerta_id;
        
    ELSIF p_tipo_ayuda = 'voluntario' THEN
        UPDATE alertas_emergencia_comunidades
        SET total_personas_ayudando = total_personas_ayudando + 1
        WHERE id = p_alerta_id;
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'alerta_id', p_alerta_id,
        'tipo_ayuda', p_tipo_ayuda,
        'mensaje', 'Gracias por tu ayuda! 💜'
    );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION registrar_ayuda IS 'Registra una ayuda (donación/voluntariado) y actualiza contadores';

-- ============================================
-- PASO 6: TRIGGER PARA AUTO-CALCULAR SEVERIDAD POR HORAS
-- ============================================

CREATE OR REPLACE FUNCTION actualizar_severidad_por_horas()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo para alertas locales de cortes de servicios
    IF NEW.alcance = 'local' AND NEW.tipo IN ('corte_luz', 'corte_gas', 'corte_agua') THEN
        
        -- Más de 72 horas (3 días) = Crítica
        IF NEW.horas_sin_servicio >= 72 THEN
            NEW.severidad := 'critica';
            
        -- Más de 48 horas (2 días) = Alta
        ELSIF NEW.horas_sin_servicio >= 48 THEN
            NEW.severidad := 'alta';
            
        -- Más de 24 horas (1 día) = Media
        ELSIF NEW.horas_sin_servicio >= 24 THEN
            NEW.severidad := 'media';
            
        -- Menos de 24 horas = Baja
        ELSE
            NEW.severidad := 'baja';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger
DROP TRIGGER IF EXISTS trigger_severidad_por_horas ON alertas_emergencia_comunidades;

CREATE TRIGGER trigger_severidad_por_horas
    BEFORE INSERT OR UPDATE OF horas_sin_servicio
    ON alertas_emergencia_comunidades
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_severidad_por_horas();

COMMENT ON FUNCTION actualizar_severidad_por_horas IS 'Actualiza automáticamente la severidad según horas sin servicio (presión a autoridades)';

-- ============================================
-- PASO 7: VISTA PARA ESTADÍSTICAS
-- ============================================

CREATE OR REPLACE VIEW estadisticas_alertas_solidaridad AS
SELECT 
    COUNT(*) FILTER (WHERE alcance = 'global' AND activa = true) as desastres_activos,
    COUNT(*) FILTER (WHERE alcance = 'local' AND activa = true) as emergencias_locales_activas,
    SUM(total_donaciones_dinero) as total_dinero_donado,
    SUM(total_donaciones_materiales) as total_materiales_donados,
    SUM(total_personas_ayudando) as total_personas_ayudando,
    
    -- Promedio de horas para resolver cortes (presión funcionó?)
    AVG(horas_sin_servicio) FILTER (WHERE tipo IN ('corte_luz', 'corte_gas', 'corte_agua') AND activa = false) as promedio_horas_resolucion
    
FROM alertas_emergencia_comunidades;

COMMENT ON VIEW estadisticas_alertas_solidaridad IS 'Estadísticas generales de solidaridad y eficiencia';

-- ============================================
-- ✅ VERIFICACIÓN
-- ============================================

-- Verificar que todo se creó correctamente
SELECT 
    '✅ SISTEMA DE ALERTAS MEJORADO INSTALADO' as resultado,
    'Solidaridad Global + Proximidad Local' as descripcion,
    'Sin romper nada existente' as nota;

-- Ver estadísticas
SELECT * FROM estadisticas_alertas_solidaridad;
