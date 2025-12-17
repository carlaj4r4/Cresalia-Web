-- ===== DIAGNÓSTICO Y CORRECCIÓN AUTOMÁTICA =====
-- Este script detecta y corrige los errores en Supabase

-- ===== PASO 1: DIAGNÓSTICO =====

-- 1.1. Ver columnas de la tabla servicios
SELECT 
    '=== COLUMNAS DE LA TABLA SERVICIOS ===' as diagnostico,
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'servicios' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 1.2. Ver si existe la vista problemática
SELECT 
    '=== VISTA TOP_TIENDAS_SEGUIDAS ===' as diagnostico,
    viewname 
FROM pg_views 
WHERE viewname = 'top_tiendas_seguidas';

-- 1.3. Ver funciones existentes
SELECT 
    '=== FUNCIONES EXISTENTES ===' as diagnostico,
    proname as nombre_funcion
FROM pg_proc 
WHERE proname IN (
    'calcular_aniversarios_servicios',
    'obtener_top_tiendas_seguidas',
    'top_tiendas_seguidas'
);

-- ===== PASO 2: CORRECCIÓN =====

-- 2.1. ELIMINAR VISTA INSEGURA
DROP VIEW IF EXISTS top_tiendas_seguidas CASCADE;

-- 2.2. CORREGIR FUNCIÓN DE SERVICIOS
-- Esta versión intenta todas las variantes posibles de nombres

CREATE OR REPLACE FUNCTION calcular_aniversarios_servicios()
RETURNS INTEGER AS $$
DECLARE
    registros_insertados INTEGER := 0;
    servicio_record RECORD;
    fecha_hoy DATE := CURRENT_DATE;
    mes_hoy INTEGER := EXTRACT(MONTH FROM fecha_hoy);
    v_nombre_columna TEXT;
BEGIN
    -- Detectar qué columna de nombre existe
    SELECT column_name INTO v_nombre_columna
    FROM information_schema.columns 
    WHERE table_name = 'servicios' 
    AND table_schema = 'public'
    AND column_name IN ('nombre', 'nombre_servicio', 'title', 'titulo')
    LIMIT 1;
    
    -- Si no hay tabla servicios o columna de nombre, retornar 0
    IF v_nombre_columna IS NULL THEN
        RAISE NOTICE 'No se encontró tabla servicios o columna de nombre válida';
        RETURN 0;
    END IF;
    
    -- Limpiar registros antiguos
    DELETE FROM celebraciones_ecommerce_cache 
    WHERE tipo_celebracion = 'aniversario_negocio' 
    AND entidad_tipo = 'servicio'
    AND fecha_celebracion < fecha_hoy - INTERVAL '30 days';
    
    -- Buscar servicios con aniversario este mes
    -- Usamos EXECUTE para consulta dinámica
    FOR servicio_record IN EXECUTE format(
        'SELECT 
            id::TEXT as id_texto,
            %I as nombre_servicio,
            fecha_creacion,
            COALESCE(descripcion, '''') as descripcion
        FROM public.servicios
        WHERE fecha_creacion IS NOT NULL
        AND EXTRACT(MONTH FROM fecha_creacion) = $1',
        v_nombre_columna
    ) USING mes_hoy
    LOOP
        BEGIN
            INSERT INTO celebraciones_ecommerce_cache (
                tipo_celebracion,
                entidad_tipo,
                entidad_id,
                nombre,
                fecha_celebracion,
                dias_activo,
                metadata,
                activo,
                fecha_calculo
            ) VALUES (
                'aniversario_negocio',
                'servicio',
                servicio_record.id_texto,
                servicio_record.nombre_servicio,
                DATE_TRUNC('year', fecha_hoy) + 
                    (EXTRACT(MONTH FROM servicio_record.fecha_creacion) - 1) * INTERVAL '1 month' +
                    (EXTRACT(DAY FROM servicio_record.fecha_creacion) - 1) * INTERVAL '1 day',
                7,
                jsonb_build_object(
                    'descripcion', servicio_record.descripcion,
                    'anios', EXTRACT(YEAR FROM fecha_hoy) - EXTRACT(YEAR FROM servicio_record.fecha_creacion)
                ),
                true,
                NOW()
            )
            ON CONFLICT DO NOTHING;
            
            registros_insertados := registros_insertados + 1;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error insertando servicio %: %', servicio_record.id_texto, SQLERRM;
            CONTINUE;
        END;
    END LOOP;
    
    RETURN registros_insertados;
END;
$$ LANGUAGE plpgsql;

-- ===== PASO 3: VERIFICACIÓN =====

-- 3.1. Verificar que la vista fue eliminada
SELECT 
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM pg_views WHERE viewname = 'top_tiendas_seguidas')
        THEN '✅ Vista eliminada correctamente'
        ELSE '❌ Vista todavía existe'
    END as resultado_vista;

-- 3.2. Verificar que la función existe
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'obtener_top_tiendas_seguidas')
        THEN '✅ Función obtener_top_tiendas_seguidas existe'
        ELSE '❌ Función obtener_top_tiendas_seguidas NO existe'
    END as resultado_funcion_top;

-- 3.3. Probar la función de servicios
SELECT 
    '=== PRUEBA DE FUNCIÓN ===' as test,
    calcular_aniversarios_servicios() as servicios_procesados;

-- 3.4. Ver celebraciones creadas
SELECT 
    '=== CELEBRACIONES CREADAS HOY ===' as resultado,
    tipo_celebracion,
    entidad_tipo,
    COUNT(*) as total
FROM celebraciones_ecommerce_cache 
WHERE DATE(fecha_calculo) = CURRENT_DATE
GROUP BY tipo_celebracion, entidad_tipo;
