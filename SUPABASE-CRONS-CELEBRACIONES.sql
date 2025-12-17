-- ===== CRONS DE SUPABASE PARA CRESALIA =====
-- Funciones programadas para aniversarios, cumpleaños e historias de corazón
-- Ejecutar este archivo en Supabase SQL Editor

-- ===== PASO 1: HABILITAR EXTENSIÓN PG_CRON =====
-- Nota: Si pg_cron no está disponible en tu plan de Supabase, estas funciones
-- se pueden ejecutar manualmente o desde un servicio externo (Vercel Cron Jobs)

-- Verificar si pg_cron está disponible
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ===== PASO 2: CREAR TABLAS PARA CACHEAR CELEBRACIONES =====

-- Tabla para cachear celebraciones del día
CREATE TABLE IF NOT EXISTS celebraciones_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo_celebracion TEXT NOT NULL, -- 'cumpleanos', 'aniversario_negocio', 'aniversario_cresalia'
    entidad_tipo TEXT NOT NULL, -- 'tienda', 'servicio', 'comprador'
    entidad_id UUID NOT NULL,
    nombre TEXT NOT NULL,
    fecha_celebracion DATE NOT NULL,
    dias_activo INTEGER DEFAULT 7, -- Cuántos días mostrar la celebración
    metadata JSONB, -- Datos adicionales: foto, descripción, ubicación, etc.
    activo BOOLEAN DEFAULT true,
    fecha_calculo TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_celebraciones_tipo ON celebraciones_cache(tipo_celebracion);
CREATE INDEX IF NOT EXISTS idx_celebraciones_fecha ON celebraciones_cache(fecha_celebracion);
CREATE INDEX IF NOT EXISTS idx_celebraciones_activo ON celebraciones_cache(activo) WHERE activo = true;
CREATE INDEX IF NOT EXISTS idx_celebraciones_entidad ON celebraciones_cache(entidad_tipo, entidad_id);

-- Tabla para historias de corazón
CREATE TABLE IF NOT EXISTS historias_corazon (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    entidad_id UUID, -- ID de tienda o servicio
    entidad_tipo TEXT CHECK (entidad_tipo IN ('tienda', 'servicio', 'emprendedor')),
    
    -- Información básica
    nombre_negocio TEXT NOT NULL,
    tipo_vendedor TEXT CHECK (tipo_vendedor IN ('tienda', 'servicio', 'emprendedor')),
    foto_url TEXT,
    
    -- Historia
    historia TEXT NOT NULL,
    consejos TEXT,
    logros TEXT[],
    desafios_superados TEXT[],
    
    -- Configuración
    publica BOOLEAN DEFAULT false,
    activa BOOLEAN DEFAULT true,
    donde_mostrar TEXT[] DEFAULT ARRAY['home', 'comunidad'], -- home, comunidad, perfil
    
    -- Metadata
    likes INTEGER DEFAULT 0,
    vistas INTEGER DEFAULT 0,
    fecha_publicacion TIMESTAMP WITH TIME ZONE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para historias
CREATE INDEX IF NOT EXISTS idx_historias_publicas ON historias_corazon(publica, activa) WHERE publica = true AND activa = true;
CREATE INDEX IF NOT EXISTS idx_historias_user ON historias_corazon(user_id);
CREATE INDEX IF NOT EXISTS idx_historias_entidad ON historias_corazon(entidad_id, entidad_tipo);
CREATE INDEX IF NOT EXISTS idx_historias_fecha ON historias_corazon(fecha_publicacion DESC);

-- RLS para historias
ALTER TABLE historias_corazon ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Historias públicas son visibles para todos" ON historias_corazon
    FOR SELECT USING (publica = true AND activa = true);

CREATE POLICY "Usuarios pueden ver sus propias historias" ON historias_corazon
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus historias" ON historias_corazon
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar sus historias" ON historias_corazon
    FOR UPDATE USING (auth.uid() = user_id);

-- ===== PASO 3: FUNCIONES PARA CALCULAR CELEBRACIONES =====

-- Función para calcular aniversarios de tiendas
CREATE OR REPLACE FUNCTION calcular_aniversarios_tiendas()
RETURNS INTEGER AS $$
DECLARE
    registros_insertados INTEGER := 0;
    tienda_record RECORD;
    fecha_hoy DATE := CURRENT_DATE;
    mes_hoy INTEGER := EXTRACT(MONTH FROM fecha_hoy);
    dia_hoy INTEGER := EXTRACT(DAY FROM fecha_hoy);
BEGIN
    -- Limpiar celebraciones viejas (más de 30 días)
    DELETE FROM celebraciones_cache 
    WHERE tipo_celebracion = 'aniversario_negocio' 
    AND fecha_celebracion < fecha_hoy - INTERVAL '30 days';
    
    -- Calcular aniversarios del mes actual
    FOR tienda_record IN 
        SELECT 
            id,
            nombre_tienda,
            fecha_creacion,
            email,
            COALESCE(configuracion->>'logo_url', '') as logo_url,
            COALESCE(configuracion->>'descripcion', '') as descripcion,
            COALESCE(configuracion->>'ciudad', '') as ciudad,
            COALESCE(configuracion->>'pais', '') as pais
        FROM public.tiendas
        WHERE activa = true
        AND fecha_creacion IS NOT NULL
        AND EXTRACT(MONTH FROM fecha_creacion) = mes_hoy
    LOOP
        -- Insertar o actualizar celebración
        INSERT INTO celebraciones_cache (
            tipo_celebracion,
            entidad_tipo,
            entidad_id,
            nombre,
            fecha_celebracion,
            dias_activo,
            metadata,
            activo
        ) VALUES (
            'aniversario_negocio',
            'tienda',
            tienda_record.id,
            tienda_record.nombre_tienda,
            DATE_TRUNC('year', fecha_hoy) + 
                (EXTRACT(MONTH FROM tienda_record.fecha_creacion) - 1) * INTERVAL '1 month' +
                (EXTRACT(DAY FROM tienda_record.fecha_creacion) - 1) * INTERVAL '1 day',
            7, -- Mostrar 7 días
            jsonb_build_object(
                'logo_url', tienda_record.logo_url,
                'descripcion', tienda_record.descripcion,
                'ciudad', tienda_record.ciudad,
                'pais', tienda_record.pais,
                'email', tienda_record.email,
                'anios', EXTRACT(YEAR FROM fecha_hoy) - EXTRACT(YEAR FROM tienda_record.fecha_creacion)
            ),
            true
        )
        ON CONFLICT (tipo_celebracion, entidad_id, fecha_celebracion) 
        WHERE tipo_celebracion = 'aniversario_negocio'
        DO UPDATE SET
            metadata = EXCLUDED.metadata,
            fecha_calculo = NOW(),
            updated_at = NOW();
        
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
    -- Limpiar celebraciones viejas
    DELETE FROM celebraciones_cache 
    WHERE tipo_celebracion = 'aniversario_negocio' 
    AND entidad_tipo = 'servicio'
    AND fecha_celebracion < fecha_hoy - INTERVAL '30 days';
    
    -- Calcular aniversarios del mes actual
    FOR servicio_record IN 
        SELECT 
            id,
            nombre_servicio,
            fecha_creacion,
            email,
            COALESCE(configuracion->>'foto_url', '') as foto_url,
            COALESCE(configuracion->>'descripcion', '') as descripcion,
            COALESCE(configuracion->>'ciudad', '') as ciudad,
            COALESCE(configuracion->>'pais', '') as pais
        FROM public.servicios
        WHERE activo = true
        AND fecha_creacion IS NOT NULL
        AND EXTRACT(MONTH FROM fecha_creacion) = mes_hoy
    LOOP
        INSERT INTO celebraciones_cache (
            tipo_celebracion,
            entidad_tipo,
            entidad_id,
            nombre,
            fecha_celebracion,
            dias_activo,
            metadata,
            activo
        ) VALUES (
            'aniversario_negocio',
            'servicio',
            servicio_record.id,
            servicio_record.nombre_servicio,
            DATE_TRUNC('year', fecha_hoy) + 
                (EXTRACT(MONTH FROM servicio_record.fecha_creacion) - 1) * INTERVAL '1 month' +
                (EXTRACT(DAY FROM servicio_record.fecha_creacion) - 1) * INTERVAL '1 day',
            7,
            jsonb_build_object(
                'foto_url', servicio_record.foto_url,
                'descripcion', servicio_record.descripcion,
                'ciudad', servicio_record.ciudad,
                'pais', servicio_record.pais,
                'email', servicio_record.email,
                'anios', EXTRACT(YEAR FROM fecha_hoy) - EXTRACT(YEAR FROM servicio_record.fecha_creacion)
            ),
            true
        )
        ON CONFLICT (tipo_celebracion, entidad_tipo, entidad_id, fecha_celebracion)
        DO UPDATE SET
            metadata = EXCLUDED.metadata,
            fecha_calculo = NOW(),
            updated_at = NOW();
        
        registros_insertados := registros_insertados + 1;
    END LOOP;
    
    RETURN registros_insertados;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar vistas de historias
CREATE OR REPLACE FUNCTION incrementar_vista_historia(historia_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE historias_corazon
    SET vistas = vistas + 1,
        fecha_actualizacion = NOW()
    WHERE id = historia_id;
END;
$$ LANGUAGE plpgsql;

-- Función para limpiar celebraciones inactivas
CREATE OR REPLACE FUNCTION limpiar_celebraciones_antiguas()
RETURNS INTEGER AS $$
DECLARE
    registros_eliminados INTEGER;
BEGIN
    DELETE FROM celebraciones_cache
    WHERE fecha_calculo < NOW() - INTERVAL '60 days'
    OR (activo = false AND updated_at < NOW() - INTERVAL '30 days');
    
    GET DIAGNOSTICS registros_eliminados = ROW_COUNT;
    RETURN registros_eliminados;
END;
$$ LANGUAGE plpgsql;

-- ===== PASO 4: PROGRAMAR CRONS (SI PG_CRON ESTÁ DISPONIBLE) =====

-- Calcular aniversarios de tiendas todos los días a las 3 AM
SELECT cron.schedule(
    'calcular-aniversarios-tiendas',
    '0 3 * * *', -- Todos los días a las 3 AM
    $$SELECT calcular_aniversarios_tiendas();$$
);

-- Calcular aniversarios de servicios todos los días a las 3:15 AM
SELECT cron.schedule(
    'calcular-aniversarios-servicios',
    '15 3 * * *', -- Todos los días a las 3:15 AM
    $$SELECT calcular_aniversarios_servicios();$$
);

-- Limpiar celebraciones antiguas una vez por semana (domingos a las 4 AM)
SELECT cron.schedule(
    'limpiar-celebraciones',
    '0 4 * * 0', -- Domingos a las 4 AM
    $$SELECT limpiar_celebraciones_antiguas();$$
);

-- ===== PASO 5: EJECUTAR FUNCIONES MANUALMENTE (PRIMERA VEZ) =====

-- Ejecutar estas funciones la primera vez para poblar los datos
SELECT calcular_aniversarios_tiendas();
SELECT calcular_aniversarios_servicios();

-- ===== PASO 6: VERIFICAR CRONS PROGRAMADOS =====

-- Ver todos los crons programados
SELECT * FROM cron.job;

-- Ver historial de ejecuciones de crons
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;

-- ===== NOTAS IMPORTANTES =====

-- 1. Si pg_cron no está disponible en tu plan de Supabase:
--    - Usa Vercel Cron Jobs llamando a Edge Functions de Supabase
--    - O ejecuta estas funciones manualmente cada mes
--    - O usa GitHub Actions con un workflow programado

-- 2. Permisos: Estas funciones usan SECURITY DEFINER para poder leer todas las tablas

-- 3. Para desactivar un cron:
--    SELECT cron.unschedule('nombre-del-cron');

-- 4. Para ver errores de un cron específico:
--    SELECT * FROM cron.job_run_details WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'nombre-del-cron') ORDER BY start_time DESC;

-- ===== QUERIES ÚTILES PARA EL FRONTEND =====

-- Obtener celebraciones activas del mes actual
CREATE OR REPLACE FUNCTION obtener_celebraciones_mes()
RETURNS TABLE (
    tipo_celebracion TEXT,
    entidad_tipo TEXT,
    nombre TEXT,
    fecha_celebracion DATE,
    dias_restantes INTEGER,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.tipo_celebracion,
        c.entidad_tipo,
        c.nombre,
        c.fecha_celebracion,
        EXTRACT(DAY FROM (c.fecha_celebracion + (c.dias_activo || ' days')::INTERVAL - CURRENT_DATE))::INTEGER as dias_restantes,
        c.metadata
    FROM celebraciones_cache c
    WHERE c.activo = true
    AND EXTRACT(MONTH FROM c.fecha_celebracion) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(YEAR FROM c.fecha_celebracion) = EXTRACT(YEAR FROM CURRENT_DATE)
    AND CURRENT_DATE BETWEEN c.fecha_celebracion AND (c.fecha_celebracion + (c.dias_activo || ' days')::INTERVAL)
    ORDER BY c.fecha_celebracion ASC;
END;
$$ LANGUAGE plpgsql;

-- Obtener historias de corazón públicas y activas
CREATE OR REPLACE FUNCTION obtener_historias_publicas(limite INTEGER DEFAULT 10)
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
        h.id,
        h.nombre_negocio,
        h.tipo_vendedor,
        h.foto_url,
        h.historia,
        h.consejos,
        h.fecha_publicacion,
        h.likes,
        h.vistas
    FROM historias_corazon h
    WHERE h.publica = true
    AND h.activa = true
    AND 'home' = ANY(h.donde_mostrar)
    ORDER BY h.fecha_publicacion DESC NULLS LAST
    LIMIT limite;
END;
$$ LANGUAGE plpgsql;
