-- ===== SCRIPT DE CORRECCIÓN DE ERRORES =====
-- Ejecuta ESTE script en Supabase para corregir:
-- 1. Vista top_tiendas_seguidas con SECURITY DEFINER
-- 2. Error en calcular_aniversarios_servicios

-- ===== PASO 1: ELIMINAR VISTA INSEGURA =====

DROP VIEW IF EXISTS top_tiendas_seguidas CASCADE;

-- ===== PASO 2: VERIFICAR COLUMNAS DE LA TABLA SERVICIOS =====

-- Ejecuta ESTO primero para ver qué columnas existen:
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'servicios' AND table_schema = 'public'
-- ORDER BY ordinal_position;

-- ===== PASO 3: FUNCIÓN CORREGIDA PARA SERVICIOS =====

-- Versión 1: Si la tabla tiene columna "nombre"
CREATE OR REPLACE FUNCTION calcular_aniversarios_servicios()
RETURNS INTEGER AS $$
DECLARE
    registros_insertados INTEGER := 0;
    servicio_record RECORD;
    fecha_hoy DATE := CURRENT_DATE;
    mes_hoy INTEGER := EXTRACT(MONTH FROM fecha_hoy);
BEGIN
    -- Limpiar registros antiguos
    DELETE FROM celebraciones_ecommerce_cache 
    WHERE tipo_celebracion = 'aniversario_negocio' 
    AND entidad_tipo = 'servicio'
    AND fecha_celebracion < fecha_hoy - INTERVAL '30 days';
    
    -- Buscar servicios con aniversario este mes
    FOR servicio_record IN 
        SELECT 
            id::TEXT as id_texto,
            nombre,
            fecha_creacion,
            COALESCE(descripcion, '') as descripcion
        FROM public.servicios
        WHERE activo = true 
        AND fecha_creacion IS NOT NULL
        AND EXTRACT(MONTH FROM fecha_creacion) = mes_hoy
    LOOP
        BEGIN
            INSERT INTO celebraciones_ecommerce_cache (
                tipo_celebracion,
                entidad_tipo,
                entidad_id,
                nombre,
                fecha_celebracion,
                metadata,
                activo,
                fecha_calculo
            ) VALUES (
                'aniversario_negocio',
                'servicio',
                servicio_record.id_texto,
                servicio_record.nombre,
                servicio_record.fecha_creacion,
                jsonb_build_object(
                    'descripcion', servicio_record.descripcion,
                    'anos_cumplidos', EXTRACT(YEAR FROM fecha_hoy) - EXTRACT(YEAR FROM servicio_record.fecha_creacion)
                ),
                true,
                NOW()
            )
            ON CONFLICT DO NOTHING;
            
            registros_insertados := registros_insertados + 1;
        EXCEPTION WHEN OTHERS THEN
            CONTINUE;
        END;
    END LOOP;
    
    RETURN registros_insertados;
END;
$$ LANGUAGE plpgsql;

-- ===== PASO 4: VERIFICAR QUE LA FUNCIÓN EXISTE =====

-- Ejecuta esto para verificar:
-- SELECT proname, prosrc FROM pg_proc 
-- WHERE proname = 'obtener_top_tiendas_seguidas';

-- ===== PASO 5: VERIFICAR QUE TODO FUNCIONA =====

-- Prueba la función de servicios:
-- SELECT calcular_aniversarios_servicios();

-- Prueba la función de top tiendas:
-- SELECT * FROM obtener_top_tiendas_seguidas(5);

-- ===== NOTAS IMPORTANTES =====

-- SI LA TABLA SERVICIOS NO TIENE LA COLUMNA "nombre":
-- 1. Ejecuta primero: SELECT column_name FROM information_schema.columns WHERE table_name = 'servicios';
-- 2. Identifica el nombre correcto de la columna (puede ser: nombre_servicio, title, etc.)
-- 3. Reemplaza "nombre" por el nombre correcto en la función
-- 4. Vuelve a ejecutar CREATE OR REPLACE FUNCTION...

-- EJEMPLO si la columna se llama "nombre_servicio":
-- Cambia línea 30: nombre_servicio,
-- Y línea 46: servicio_record.nombre_servicio,
