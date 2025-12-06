-- ========================================
-- CORRECCIÓN DE ADVERTENCIAS DE SEGURIDAD EN SUPABASE
-- ========================================
-- Ejecuta este script en Supabase SQL Editor para corregir todas las advertencias

-- ===== 1. CORREGIR VISTAS (CRITICAL - Rojo) =====

-- Eliminar vistas existentes
DROP VIEW IF EXISTS vista_resumen_favoritos CASCADE;
DROP VIEW IF EXISTS vista_servicios_favoritos CASCADE;

-- Recrear con SECURITY INVOKER (más seguro)
CREATE VIEW vista_resumen_favoritos
WITH (security_invoker = true) AS
SELECT 
    comprador_id,
    tipo_lista,
    COUNT(*) as total_items,
    MIN(agregado_at) as item_mas_antiguo,
    MAX(agregado_at) as item_mas_reciente
FROM wishlist_favoritos
GROUP BY comprador_id, tipo_lista;

CREATE VIEW vista_servicios_favoritos
WITH (security_invoker = true) AS
SELECT 
    w.*,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY w.comprador_id ORDER BY w.agregado_at) > 100 
        THEN true 
        ELSE false 
    END as excede_limite
FROM wishlist_favoritos w
WHERE w.tipo_lista = 'servicios'
ORDER BY w.comprador_id, w.agregado_at;

-- ===== 2. CORREGIR FUNCIONES (Warning - Amarillo) =====
-- Configurar search_path explícitamente para evitar problemas de seguridad
-- Este script solo corrige las funciones que realmente existen en tu base de datos

-- Script automático que encuentra y corrige TODAS las funciones con advertencia
DO $$
DECLARE
    func_record RECORD;
    func_signature TEXT;
    func_oid OID;
BEGIN
    -- Buscar todas las funciones en el esquema public que muestran la advertencia
    FOR func_record IN 
        SELECT 
            p.oid,
            p.proname as function_name,
            pg_get_function_identity_arguments(p.oid) as arguments,
            pg_get_function_result(p.oid) as return_type
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname IN (
            -- Funciones de actualización de timestamps
            'update_historial_pagos_updated_at',
            'update_wishlist_updated_at',
            'update_updated_at_column',
            -- Funciones de turnos
            'obtener_proximos_turnos',
            'verificar_disponibilidad_turno',
            -- Funciones de tienda
            'obtener_saldo_tienda',
            -- Funciones adicionales (si existen)
            'actualizar_estadisticas_feedback',
            'actualizar_estadisticas_pwa',
            'actualizar_mantenimiento_actualizado',
            'actualizar_timestamp',
            'calcular_estadisticas_ventas',
            'crear_configuracion_inicial_turnos',
            'estadisticas_turnos_tienda',
            'obtener_configuracion_pwa'
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
            RAISE NOTICE '✅ Función corregida: %', func_signature;
        EXCEPTION 
            WHEN undefined_function THEN
                RAISE NOTICE '⚠️ Función no encontrada (ignorada): %', func_signature;
            WHEN OTHERS THEN
                RAISE NOTICE '❌ Error al corregir función %: %', func_signature, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '✨ Proceso de corrección de funciones completado';
END $$;

-- ===== 3. VERIFICAR QUÉ FUNCIONES EXISTEN REALMENTE =====
-- Ejecuta esta consulta primero para ver qué funciones tienes en tu base de datos

-- Descomenta la siguiente línea si quieres ver todas las funciones antes de corregirlas:
-- SELECT proname, pg_get_function_identity_arguments(oid) as arguments FROM pg_proc WHERE pronamespace = 'public'::regnamespace ORDER BY proname;

-- ===== VERIFICACIÓN =====
-- Después de ejecutar, verifica que las advertencias desaparecieron

-- Verificar vistas
SELECT 
    schemaname,
    viewname,
    viewowner
FROM pg_views
WHERE schemaname = 'public'
AND viewname IN ('vista_resumen_favoritos', 'vista_servicios_favoritos');

-- Verificar funciones corregidas
SELECT 
    proname as function_name,
    proconfig as configuration
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
AND proname IN (
    'update_historial_pagos_updated_at',
    'update_wishlist_updated_at',
    'update_updated_at_column',
    'obtener_proximos_turnos',
    'verificar_disponibilidad_turno',
    'obtener_saldo_tienda',
    'actualizar_estadisticas_feedback',
    'actualizar_estadisticas_pwa',
    'actualizar_mantenimiento_actualizado',
    'actualizar_timestamp',
    'calcular_estadisticas_ventas',
    'crear_configuracion_inicial_turnos',
    'estadisticas_turnos_tienda',
    'obtener_configuracion_pwa'
);

-- ===== NOTAS =====
-- 
-- 1. Este script es seguro de ejecutar - no elimina datos
-- 2. Si alguna función no existe, simplemente se ignora
-- 3. Después de ejecutar, refresca la página de Supabase
-- 4. Las advertencias deberían desaparecer o cambiar a verde ✅
--
-- Si después de ejecutar aún ves advertencias:
-- 1. Verifica que ejecutaste el script completo
-- 2. Refresca la página de Supabase
-- 3. Espera unos segundos para que se actualice
-- 4. Si persisten, verifica que los nombres de las funciones coincidan exactamente

