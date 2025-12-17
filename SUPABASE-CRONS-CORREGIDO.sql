-- ===== CRONS DE SUPABASE CORREGIDOS - CRESALIA =====
-- Compatible con ambos tipos de ID (UUID y SERIAL/BIGINT)
-- Separado para E-COMMERCE y COMUNIDADES

-- ===== PASO 1: CREAR TABLAS DE CACHE =====

-- Tabla para cachear celebraciones (E-COMMERCE)
CREATE TABLE IF NOT EXISTS celebraciones_ecommerce_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo_celebracion TEXT NOT NULL, -- 'cumpleanos', 'aniversario_negocio'
    entidad_tipo TEXT NOT NULL, -- 'tienda', 'servicio'
    entidad_id TEXT NOT NULL, -- TEXT para soportar UUID o BIGINT
    nombre TEXT NOT NULL,
    email TEXT,
    fecha_celebracion DATE NOT NULL,
    dias_activo INTEGER DEFAULT 7,
    metadata JSONB,
    activo BOOLEAN DEFAULT true,
    fecha_calculo TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_celebraciones_ecom_tipo ON celebraciones_ecommerce_cache(tipo_celebracion);
CREATE INDEX IF NOT EXISTS idx_celebraciones_ecom_fecha ON celebraciones_ecommerce_cache(fecha_celebracion);
CREATE INDEX IF NOT EXISTS idx_celebraciones_ecom_activo ON celebraciones_ecommerce_cache(activo) WHERE activo = true;

-- Tabla para cachear celebraciones (COMUNIDADES)
CREATE TABLE IF NOT EXISTS celebraciones_comunidad_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo_celebracion TEXT NOT NULL,
    entidad_tipo TEXT NOT NULL, -- 'vendedor', 'comprador'
    entidad_id TEXT NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT,
    fecha_celebracion DATE NOT NULL,
    dias_activo INTEGER DEFAULT 7,
    metadata JSONB,
    activo BOOLEAN DEFAULT true,
    fecha_calculo TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_celebraciones_comu_tipo ON celebraciones_comunidad_cache(tipo_celebracion);
CREATE INDEX IF NOT EXISTS idx_celebraciones_comu_fecha ON celebraciones_comunidad_cache(fecha_celebracion);
CREATE INDEX IF NOT EXISTS idx_celebraciones_comu_activo ON celebraciones_comunidad_cache(activo) WHERE activo = true;

-- Tabla para historias de corazón
CREATE TABLE IF NOT EXISTS historias_corazon (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    entidad_id TEXT, -- TEXT para compatibilidad
    entidad_tipo TEXT CHECK (entidad_tipo IN ('tienda', 'servicio', 'emprendedor')),
    
    nombre_negocio TEXT NOT NULL,
    tipo_vendedor TEXT CHECK (tipo_vendedor IN ('tienda', 'servicio', 'emprendedor')),
    foto_url TEXT,
    
    historia TEXT NOT NULL,
    consejos TEXT,
    logros TEXT[],
    desafios_superados TEXT[],
    
    publica BOOLEAN DEFAULT false,
    activa BOOLEAN DEFAULT true,
    donde_mostrar TEXT[] DEFAULT ARRAY['home', 'comunidad'],
    
    likes INTEGER DEFAULT 0,
    vistas INTEGER DEFAULT 0,
    fecha_publicacion TIMESTAMP WITH TIME ZONE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_historias_publicas ON historias_corazon(publica, activa) WHERE publica = true AND activa = true;
CREATE INDEX IF NOT EXISTS idx_historias_user ON historias_corazon(user_id);
CREATE INDEX IF NOT EXISTS idx_historias_fecha ON historias_corazon(fecha_publicacion DESC);

-- RLS para historias
ALTER TABLE historias_corazon ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Historias públicas visibles" ON historias_corazon;
CREATE POLICY "Historias públicas visibles" ON historias_corazon
    FOR SELECT USING (publica = true AND activa = true);

DROP POLICY IF EXISTS "Usuarios ven sus historias" ON historias_corazon;
CREATE POLICY "Usuarios ven sus historias" ON historias_corazon
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios crean historias" ON historias_corazon;
CREATE POLICY "Usuarios crean historias" ON historias_corazon
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios actualizan historias" ON historias_corazon;
CREATE POLICY "Usuarios actualizan historias" ON historias_corazon
    FOR UPDATE USING (auth.uid() = user_id);

-- ===== PASO 2: FUNCIONES PARA E-COMMERCE =====

-- Función para calcular aniversarios de tiendas (UUID)
CREATE OR REPLACE FUNCTION calcular_aniversarios_tiendas_uuid()
RETURNS INTEGER AS $$
DECLARE
    registros_insertados INTEGER := 0;
    tienda_record RECORD;
    fecha_hoy DATE := CURRENT_DATE;
    mes_hoy INTEGER := EXTRACT(MONTH FROM fecha_hoy);
BEGIN
    DELETE FROM celebraciones_ecommerce_cache 
    WHERE tipo_celebracion = 'aniversario_negocio' 
    AND entidad_tipo = 'tienda'
    AND fecha_celebracion < fecha_hoy - INTERVAL '30 days';
    
    FOR tienda_record IN 
        SELECT 
            id::TEXT as id_texto,
            nombre_tienda,
            fecha_creacion,
            email,
            COALESCE(configuracion->>'logo_url', '') as logo_url,
            COALESCE(configuracion->>'descripcion', '') as descripcion
        FROM public.tiendas
        WHERE activa = true
        AND fecha_creacion IS NOT NULL
        AND EXTRACT(MONTH FROM fecha_creacion) = mes_hoy
    LOOP
        INSERT INTO celebraciones_ecommerce_cache (
            tipo_celebracion, entidad_tipo, entidad_id, nombre, email,
            fecha_celebracion, dias_activo, metadata, activo
        ) VALUES (
            'aniversario_negocio', 'tienda', tienda_record.id_texto,
            tienda_record.nombre_tienda, tienda_record.email,
            DATE_TRUNC('year', fecha_hoy) + 
                (EXTRACT(MONTH FROM tienda_record.fecha_creacion) - 1) * INTERVAL '1 month' +
                (EXTRACT(DAY FROM tienda_record.fecha_creacion) - 1) * INTERVAL '1 day',
            7,
            jsonb_build_object(
                'logo_url', tienda_record.logo_url,
                'descripcion', tienda_record.descripcion,
                'anios', EXTRACT(YEAR FROM fecha_hoy) - EXTRACT(YEAR FROM tienda_record.fecha_creacion)
            ),
            true
        )
        ON CONFLICT DO NOTHING;
        registros_insertados := registros_insertados + 1;
    END LOOP;
    
    RETURN registros_insertados;
END;
$$ LANGUAGE plpgsql;

-- Función para calcular aniversarios de servicios
CREATE OR REPLACE FUNCTION calcular_aniversarios_servicios()
RETURNS INTEGER AS $$
DECLARE
    registros_insertados INTEGER := 0;
    servicio_record RECORD;
    fecha_hoy DATE := CURRENT_DATE;
    mes_hoy INTEGER := EXTRACT(MONTH FROM fecha_hoy);
BEGIN
    DELETE FROM celebraciones_ecommerce_cache 
    WHERE tipo_celebracion = 'aniversario_negocio' 
    AND entidad_tipo = 'servicio'
    AND fecha_celebracion < fecha_hoy - INTERVAL '30 days';
    
    -- Buscar columna correcta (nombre o nombre_servicio)
    FOR servicio_record IN 
        SELECT 
            id::TEXT as id_texto,
            COALESCE(nombre, nombre_servicio) as nombre_servicio,
            fecha_creacion,
            COALESCE(descripcion, '') as descripcion
        FROM public.servicios
        WHERE COALESCE(activo, estado = 'activo', true)
        AND fecha_creacion IS NOT NULL
        AND EXTRACT(MONTH FROM fecha_creacion) = mes_hoy
    LOOP
        INSERT INTO celebraciones_ecommerce_cache (
            tipo_celebracion, entidad_tipo, entidad_id, nombre,
            fecha_celebracion, dias_activo, metadata, activo
        ) VALUES (
            'aniversario_negocio', 'servicio', servicio_record.id_texto,
            servicio_record.nombre_servicio,
            DATE_TRUNC('year', fecha_hoy) + 
                (EXTRACT(MONTH FROM servicio_record.fecha_creacion) - 1) * INTERVAL '1 month' +
                (EXTRACT(DAY FROM servicio_record.fecha_creacion) - 1) * INTERVAL '1 day',
            7,
            jsonb_build_object(
                'descripcion', servicio_record.descripcion,
                'anios', EXTRACT(YEAR FROM fecha_hoy) - EXTRACT(YEAR FROM servicio_record.fecha_creacion)
            ),
            true
        )
        ON CONFLICT DO NOTHING;
        registros_insertados := registros_insertados + 1;
    END LOOP;
    
    RETURN registros_insertados;
END;
$$ LANGUAGE plpgsql;

-- Función para limpiar celebraciones antiguas
CREATE OR REPLACE FUNCTION limpiar_celebraciones_antiguas()
RETURNS INTEGER AS $$
DECLARE
    registros_eliminados INTEGER;
BEGIN
    WITH deleted AS (
        DELETE FROM celebraciones_ecommerce_cache
        WHERE fecha_calculo < NOW() - INTERVAL '60 days'
        OR (activo = false AND updated_at < NOW() - INTERVAL '30 days')
        RETURNING *
    )
    SELECT COUNT(*) INTO registros_eliminados FROM deleted;
    
    WITH deleted_com AS (
        DELETE FROM celebraciones_comunidad_cache
        WHERE fecha_calculo < NOW() - INTERVAL '60 days'
        OR (activo = false AND updated_at < NOW() - INTERVAL '30 days')
        RETURNING *
    )
    SELECT registros_eliminados + COUNT(*) INTO registros_eliminados FROM deleted_com;
    
    RETURN registros_eliminados;
END;
$$ LANGUAGE plpgsql;

-- ===== QUERIES ÚTILES =====

-- Obtener celebraciones activas del mes
CREATE OR REPLACE FUNCTION obtener_celebraciones_mes(p_tipo TEXT DEFAULT 'ecommerce')
RETURNS TABLE (
    tipo_celebracion TEXT,
    entidad_tipo TEXT,
    nombre TEXT,
    email TEXT,
    fecha_celebracion DATE,
    dias_restantes INTEGER,
    metadata JSONB
) AS $$
BEGIN
    IF p_tipo = 'comunidad' THEN
        RETURN QUERY
        SELECT 
            c.tipo_celebracion, c.entidad_tipo, c.nombre, c.email,
            c.fecha_celebracion,
            EXTRACT(DAY FROM (c.fecha_celebracion + (c.dias_activo || ' days')::INTERVAL - CURRENT_DATE))::INTEGER as dias_restantes,
            c.metadata
        FROM celebraciones_comunidad_cache c
        WHERE c.activo = true
        AND EXTRACT(MONTH FROM c.fecha_celebracion) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND CURRENT_DATE BETWEEN c.fecha_celebracion AND (c.fecha_celebracion + (c.dias_activo || ' days')::INTERVAL)
        ORDER BY c.fecha_celebracion ASC;
    ELSE
        RETURN QUERY
        SELECT 
            c.tipo_celebracion, c.entidad_tipo, c.nombre, c.email,
            c.fecha_celebracion,
            EXTRACT(DAY FROM (c.fecha_celebracion + (c.dias_activo || ' days')::INTERVAL - CURRENT_DATE))::INTEGER as dias_restantes,
            c.metadata
        FROM celebraciones_ecommerce_cache c
        WHERE c.activo = true
        AND EXTRACT(MONTH FROM c.fecha_celebracion) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND CURRENT_DATE BETWEEN c.fecha_celebracion AND (c.fecha_celebracion + (c.dias_activo || ' days')::INTERVAL)
        ORDER BY c.fecha_celebracion ASC;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Obtener historias públicas
CREATE OR REPLACE FUNCTION obtener_historias_publicas(p_limite INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    nombre_negocio TEXT,
    tipo_vendedor TEXT,
    foto_url TEXT,
    historia TEXT,
    consejos TEXT,
    fecha_publicacion TIMESTAMP WITH TIME ZONE,
    likes INTEGER,
    vistas INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        h.id, h.nombre_negocio, h.tipo_vendedor, h.foto_url,
        h.historia, h.consejos, h.fecha_publicacion, h.likes, h.vistas
    FROM historias_corazon h
    WHERE h.publica = true AND h.activa = true
    AND 'home' = ANY(h.donde_mostrar)
    ORDER BY h.fecha_publicacion DESC NULLS LAST
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql;

-- ===== NOTAS =====
-- ⚠️ Este script NO usa pg_cron porque vamos a usar Vercel Cron Jobs
-- Para ejecutar manualmente:
-- SELECT calcular_aniversarios_tiendas_uuid();
-- SELECT calcular_aniversarios_servicios();
-- SELECT limpiar_celebraciones_antiguas();
