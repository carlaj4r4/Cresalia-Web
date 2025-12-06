-- ========================================
-- CORRECCIÓN DE LAS 6 FUNCIONES CON ADVERTENCIA
-- ========================================
-- Script específico para corregir las funciones que aparecen en Security Advisor

-- Este script corrige las 6 funciones que muestran "Function Search Path Mutable"
-- Configurando explícitamente el search_path para mayor seguridad

DO $$
DECLARE
    func_record RECORD;
    func_signature TEXT;
    funciones_corregidas INTEGER := 0;
    funciones_no_encontradas INTEGER := 0;
BEGIN
    -- Buscar y corregir las funciones específicas que aparecen en Security Advisor
    FOR func_record IN 
        SELECT 
            p.oid,
            p.proname as function_name,
            pg_get_function_identity_arguments(p.oid) as arguments
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname IN (
            'update_historial_pagos_updated_at',
            'update_wishlist_updated_at',
            'obtener_proximos_turnos',
            'verificar_disponibilidad_turno',
            'update_updated_at_column',
            'obtener_saldo_tienda'
        )
    LOOP
        -- Construir la firma completa de la función
        IF func_record.arguments = '' OR func_record.arguments IS NULL THEN
            func_signature := format('public.%I()', func_record.function_name);
        ELSE
            func_signature := format('public.%I(%s)', func_record.function_name, func_record.arguments);
        END IF;
        
        -- Intentar configurar search_path
        BEGIN
            EXECUTE format('ALTER FUNCTION %s SET search_path = public, pg_temp', func_signature);
            funciones_corregidas := funciones_corregidas + 1;
            RAISE NOTICE '✅ Función corregida: %', func_signature;
        EXCEPTION 
            WHEN undefined_function THEN
                funciones_no_encontradas := funciones_no_encontradas + 1;
                RAISE NOTICE '⚠️ Función no encontrada: %', func_signature;
            WHEN OTHERS THEN
                RAISE NOTICE '❌ Error al corregir función %: %', func_signature, SQLERRM;
        END;
    END LOOP;
    
    -- Resumen
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════';
    RAISE NOTICE '✨ RESUMEN DE CORRECCIÓN';
    RAISE NOTICE '═══════════════════════════════════════';
    RAISE NOTICE '✅ Funciones corregidas: %', funciones_corregidas;
    RAISE NOTICE '⚠️ Funciones no encontradas: %', funciones_no_encontradas;
    RAISE NOTICE '═══════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '💡 Refresca la página de Supabase para ver los cambios';
END $$;

-- ===== VERIFICACIÓN =====
-- Verifica que las funciones fueron corregidas correctamente

SELECT 
    proname as function_name,
    pg_get_function_identity_arguments(oid) as arguments,
    proconfig as search_path_config
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
AND proname IN (
    'update_historial_pagos_updated_at',
    'update_wishlist_updated_at',
    'obtener_proximos_turnos',
    'verificar_disponibilidad_turno',
    'update_updated_at_column',
    'obtener_saldo_tienda'
)
ORDER BY proname;

-- ===== NOTAS =====
-- 
-- Este script corrige específicamente las 6 funciones que aparecen
-- en Security Advisor como "Function Search Path Mutable"
--
-- Después de ejecutar:
-- 1. Refresca la página de Supabase
-- 2. Ve a Security Advisor → Warnings
-- 3. Las advertencias deberían desaparecer o cambiar a verde ✅
--
-- Si alguna función no existe, simplemente se ignora sin errores

