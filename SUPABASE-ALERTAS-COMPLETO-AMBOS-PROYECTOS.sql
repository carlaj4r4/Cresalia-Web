-- ============================================
-- 🚨 SISTEMA DE ALERTAS COMPLETO - CRESALIA
-- ============================================
-- Para AMBOS proyectos Supabase (E-commerce Y Comunidades)
-- Este script CREA la tabla si no existe
-- Y agrega campos nuevos si ya existe

-- ============================================
-- PASO 1: CREAR TABLA COMPLETA (si no existe)
-- ============================================

CREATE TABLE IF NOT EXISTS alertas_emergencia_comunidades (
    id SERIAL PRIMARY KEY,
    
    -- Tipo de alerta
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN (
        'inundacion', 
        'incendio', 
        'terremoto', 
        'tormenta', 
        'tornado', 
        'tsunami',
        'pandemia',
        'corte_luz',
        'corte_gas',
        'corte_agua',
        'accidente',
        'seguridad',
        'otro'
    )),
    
    -- NUEVO: Alcance (global = todos, local = solo cercanos)
    alcance VARCHAR(20) DEFAULT 'global' CHECK (alcance IN ('global', 'local')),
    
    -- Ubicación
    pais VARCHAR(100),
    provincia VARCHAR(100),
    ciudad VARCHAR(100),
    coordenadas JSONB, -- {lat: -34.6037, lng: -58.3816}
    radio_afectacion_km INTEGER, -- Radio en kilómetros
    
    -- Contenido
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    severidad VARCHAR(20) DEFAULT 'media' CHECK (severidad IN ('baja', 'media', 'alta', 'critica')),
    
    -- NUEVO: Horas sin servicio (para presión a autoridades)
    horas_sin_servicio INTEGER DEFAULT 0,
    
    -- Enlaces útiles
    enlace_oficial TEXT, -- Link a fuente oficial
    enlace_mapa TEXT, -- Link a mapa interactivo
    
    -- NUEVO: URLs de donaciones (integración con sistema existente)
    url_donacion_materiales TEXT DEFAULT '/cresalia-solidario-emergencias/donar-materiales.html',
    url_donacion_dinero TEXT DEFAULT '/cresalia-solidario-emergencias/index.html',
    url_pedir_ayuda TEXT DEFAULT '/cresalia-solidario-emergencias/panel-crear-campana.html',
    
    -- NUEVO: Contador de ayudas (transparencia)
    total_donaciones_dinero DECIMAL(10,2) DEFAULT 0,
    total_donaciones_materiales INTEGER DEFAULT 0,
    total_personas_ayudando INTEGER DEFAULT 0,
    
    -- Estado
    activa BOOLEAN DEFAULT true,
    verificada BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_expiracion TIMESTAMP WITH TIME ZONE,
    
    -- Creador
    creador_email VARCHAR(255) DEFAULT 'CRISLA',
    
    -- Comunidades afectadas (NULL = todas)
    comunidades_afectadas TEXT[] -- Array de slugs de comunidades
);

-- ============================================
-- PASO 2: AGREGAR CAMPOS NUEVOS (si la tabla ya existía)
-- ============================================

-- Solo para proyectos donde la tabla ya existía
DO $$ 
BEGIN
    -- Campo alcance
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'alertas_emergencia_comunidades' 
        AND column_name = 'alcance'
    ) THEN
        ALTER TABLE alertas_emergencia_comunidades 
        ADD COLUMN alcance VARCHAR(20) DEFAULT 'global' 
        CHECK (alcance IN ('global', 'local'));
    END IF;
    
    -- Campo horas_sin_servicio
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'alertas_emergencia_comunidades' 
        AND column_name = 'horas_sin_servicio'
    ) THEN
        ALTER TABLE alertas_emergencia_comunidades 
        ADD COLUMN horas_sin_servicio INTEGER DEFAULT 0;
    END IF;
    
    -- URLs de donaciones
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'alertas_emergencia_comunidades' 
        AND column_name = 'url_donacion_materiales'
    ) THEN
        ALTER TABLE alertas_emergencia_comunidades 
        ADD COLUMN url_donacion_materiales TEXT DEFAULT '/cresalia-solidario-emergencias/donar-materiales.html';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'alertas_emergencia_comunidades' 
        AND column_name = 'url_donacion_dinero'
    ) THEN
        ALTER TABLE alertas_emergencia_comunidades 
        ADD COLUMN url_donacion_dinero TEXT DEFAULT '/cresalia-solidario-emergencias/index.html';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'alertas_emergencia_comunidades' 
        AND column_name = 'url_pedir_ayuda'
    ) THEN
        ALTER TABLE alertas_emergencia_comunidades 
        ADD COLUMN url_pedir_ayuda TEXT DEFAULT '/cresalia-solidario-emergencias/panel-crear-campana.html';
    END IF;
    
    -- Contadores de ayuda
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'alertas_emergencia_comunidades' 
        AND column_name = 'total_donaciones_dinero'
    ) THEN
        ALTER TABLE alertas_emergencia_comunidades 
        ADD COLUMN total_donaciones_dinero DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'alertas_emergencia_comunidades' 
        AND column_name = 'total_donaciones_materiales'
    ) THEN
        ALTER TABLE alertas_emergencia_comunidades 
        ADD COLUMN total_donaciones_materiales INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'alertas_emergencia_comunidades' 
        AND column_name = 'total_personas_ayudando'
    ) THEN
        ALTER TABLE alertas_emergencia_comunidades 
        ADD COLUMN total_personas_ayudando INTEGER DEFAULT 0;
    END IF;
END $$;

-- ============================================
-- PASO 3: CREAR COLUMNA CALCULADA (días sin servicio)
-- ============================================

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'alertas_emergencia_comunidades' 
        AND column_name = 'dias_sin_servicio'
    ) THEN
        ALTER TABLE alertas_emergencia_comunidades 
        ADD COLUMN dias_sin_servicio INTEGER GENERATED ALWAYS AS (horas_sin_servicio / 24) STORED;
    END IF;
END $$;

-- ============================================
-- PASO 4: TABLA DE VISTAS (si no existe)
-- ============================================

CREATE TABLE IF NOT EXISTS alertas_vistas_usuarios (
    id SERIAL PRIMARY KEY,
    alerta_id INTEGER NOT NULL REFERENCES alertas_emergencia_comunidades(id) ON DELETE CASCADE,
    usuario_hash VARCHAR(255) NOT NULL, -- Hash del usuario (mismo que foro)
    fecha_vista TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(alerta_id, usuario_hash)
);

-- ============================================
-- PASO 5: ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_alertas_tipo ON alertas_emergencia_comunidades(tipo, activa);
CREATE INDEX IF NOT EXISTS idx_alertas_activas ON alertas_emergencia_comunidades(activa, fecha_expiracion);
CREATE INDEX IF NOT EXISTS idx_alertas_fecha ON alertas_emergencia_comunidades(fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_alertas_alcance ON alertas_emergencia_comunidades(alcance, activa);
CREATE INDEX IF NOT EXISTS idx_alertas_horas ON alertas_emergencia_comunidades(horas_sin_servicio DESC);
CREATE INDEX IF NOT EXISTS idx_alertas_vistas ON alertas_vistas_usuarios(alerta_id, usuario_hash);

-- ============================================
-- PASO 6: RLS
-- ============================================

ALTER TABLE alertas_emergencia_comunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_vistas_usuarios ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "lectura_alertas_publica" ON alertas_emergencia_comunidades;
DROP POLICY IF EXISTS "crear_vista_alerta" ON alertas_vistas_usuarios;
DROP POLICY IF EXISTS "lectura_vistas_propia" ON alertas_vistas_usuarios;

-- Políticas: Lectura pública, escritura solo para admins
CREATE POLICY "lectura_alertas_publica" ON alertas_emergencia_comunidades 
    FOR SELECT 
    USING (activa = true AND (fecha_expiracion IS NULL OR fecha_expiracion > NOW()));

CREATE POLICY "crear_vista_alerta" ON alertas_vistas_usuarios 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "lectura_vistas_propia" ON alertas_vistas_usuarios 
    FOR SELECT 
    USING (usuario_hash = current_setting('app.user_hash', true));

-- ============================================
-- PASO 7: FUNCIÓN DE CÁLCULO DE DISTANCIA (Haversine)
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

-- ============================================
-- PASO 8: FUNCIÓN INTELIGENTE CON PROXIMIDAD
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
    
    -- Filtro de proximidad
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
        -- Globales primero (solidaridad)
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
        -- Más horas sin servicio = más urgente
        a.horas_sin_servicio DESC,
        a.fecha_creacion DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- PASO 9: FUNCIÓN PARA REGISTRAR AYUDAS
-- ============================================

CREATE OR REPLACE FUNCTION registrar_ayuda(
    p_alerta_id INTEGER,
    p_tipo_ayuda VARCHAR,
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

-- ============================================
-- PASO 10: TRIGGER PARA AUTO-CALCULAR SEVERIDAD
-- ============================================

CREATE OR REPLACE FUNCTION actualizar_severidad_por_horas()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo para alertas locales de cortes de servicios
    IF NEW.alcance = 'local' AND NEW.tipo IN ('corte_luz', 'corte_gas', 'corte_agua') THEN
        
        IF NEW.horas_sin_servicio >= 72 THEN
            NEW.severidad := 'critica';
        ELSIF NEW.horas_sin_servicio >= 48 THEN
            NEW.severidad := 'alta';
        ELSIF NEW.horas_sin_servicio >= 24 THEN
            NEW.severidad := 'media';
        ELSE
            NEW.severidad := 'baja';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_severidad_por_horas ON alertas_emergencia_comunidades;

CREATE TRIGGER trigger_severidad_por_horas
    BEFORE INSERT OR UPDATE OF horas_sin_servicio
    ON alertas_emergencia_comunidades
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_severidad_por_horas();

-- ============================================
-- PASO 11: VISTA DE ESTADÍSTICAS
-- ============================================

CREATE OR REPLACE VIEW estadisticas_alertas_solidaridad AS
SELECT 
    COUNT(*) FILTER (WHERE alcance = 'global' AND activa = true) as desastres_activos,
    COUNT(*) FILTER (WHERE alcance = 'local' AND activa = true) as emergencias_locales_activas,
    SUM(total_donaciones_dinero) as total_dinero_donado,
    SUM(total_donaciones_materiales) as total_materiales_donados,
    SUM(total_personas_ayudando) as total_personas_ayudando,
    AVG(horas_sin_servicio) FILTER (WHERE tipo IN ('corte_luz', 'corte_gas', 'corte_agua') AND activa = false) as promedio_horas_resolucion
FROM alertas_emergencia_comunidades;

-- ============================================
-- ✅ VERIFICACIÓN FINAL
-- ============================================

SELECT 
    '✅ SISTEMA DE ALERTAS INSTALADO CORRECTAMENTE' as resultado,
    'Funciona en AMBOS proyectos (E-commerce y Comunidades)' as nota,
    'Solidaridad Global + Proximidad Local' as caracteristicas;

-- Ver estadísticas
SELECT * FROM estadisticas_alertas_solidaridad;
