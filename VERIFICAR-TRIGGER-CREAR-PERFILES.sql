-- ===== VERIFICAR TRIGGER DE CREAR PERFILES =====
-- Este script verifica que el trigger esté configurado correctamente
-- Ejecutá esto en Supabase SQL Editor

-- ===========================================
-- PASO 1: VERIFICAR FUNCIONES
-- ===========================================
SELECT 
    '🔍 Funciones disponibles:' as info,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%perfil%'
ORDER BY routine_name;

-- ===========================================
-- PASO 2: VERIFICAR TRIGGERS EN auth.users
-- ===========================================
SELECT 
    '🔍 Triggers en auth.users:' as info,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
AND event_object_table = 'users'
ORDER BY trigger_name;

-- ===========================================
-- PASO 3: VERIFICAR QUE LAS FUNCIONES EXISTAN
-- ===========================================
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_proc 
            WHERE proname = 'crear_perfil_comprador'
        ) THEN '✅ Función crear_perfil_comprador EXISTE'
        ELSE '❌ Función crear_perfil_comprador NO EXISTE'
    END as estado_funcion_comprador,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_proc 
            WHERE proname = 'crear_perfil_tienda'
        ) THEN '✅ Función crear_perfil_tienda EXISTE'
        ELSE '❌ Función crear_perfil_tienda NO EXISTE'
    END as estado_funcion_tienda;

-- ===========================================
-- PASO 4: RECREAR FUNCIONES Y TRIGGERS SI NO EXISTEN
-- ===========================================

-- Función para crear perfil de comprador
CREATE OR REPLACE FUNCTION crear_perfil_comprador()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo crear si el usuario tiene tipo_usuario = 'comprador' en metadata
    IF NEW.raw_user_meta_data->>'tipo_usuario' = 'comprador' THEN
        INSERT INTO compradores (user_id, nombre_completo, email, activo, fecha_registro)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'nombre_completo', NEW.email),
            NEW.email,
            true,
            NOW()
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear perfil de tienda
CREATE OR REPLACE FUNCTION crear_perfil_tienda()
RETURNS TRIGGER AS $$
DECLARE
    nombre_tienda TEXT;
    plan_tienda TEXT;
    subdomain_tienda TEXT;
    tipo_usuario TEXT;
    es_emprendedor BOOLEAN;
BEGIN
    tipo_usuario := NEW.raw_user_meta_data->>'tipo_usuario';
    es_emprendedor := (tipo_usuario = 'emprendedor');
    
    -- Crear si el usuario tiene tipo_usuario = 'vendedor' o 'emprendedor' o tiene nombre_tienda en metadata
    IF tipo_usuario IN ('vendedor', 'emprendedor') OR NEW.raw_user_meta_data->>'nombre_tienda' IS NOT NULL THEN
        nombre_tienda := COALESCE(NEW.raw_user_meta_data->>'nombre_tienda', 'Mi Tienda');
        plan_tienda := COALESCE(NEW.raw_user_meta_data->>'plan', 'basico');
        
        -- Generar subdomain
        subdomain_tienda := lower(regexp_replace(nombre_tienda, '[^a-zA-Z0-9]+', '-', 'g'));
        subdomain_tienda := regexp_replace(subdomain_tienda, '^-|-$', '', 'g');
        
        -- Asegurar que el subdomain sea único
        WHILE EXISTS (SELECT 1 FROM tiendas WHERE subdomain = subdomain_tienda) LOOP
            subdomain_tienda := subdomain_tienda || '-' || floor(random() * 1000)::text;
        END LOOP;
        
        INSERT INTO tiendas (user_id, nombre_tienda, email, plan, subdomain, activa, fecha_creacion, configuracion)
        VALUES (
            NEW.id,
            nombre_tienda,
            NEW.email,
            plan_tienda,
            subdomain_tienda,
            true,
            NOW(),
            jsonb_build_object(
                'tipo', CASE WHEN es_emprendedor THEN 'emprendedor' ELSE 'tienda' END,
                'es_servicio', es_emprendedor
            )
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger que se ejecuta cuando se confirma el email
DROP TRIGGER IF EXISTS trigger_crear_perfil_comprador ON auth.users;
CREATE TRIGGER trigger_crear_perfil_comprador
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW
    WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
    EXECUTE FUNCTION crear_perfil_comprador();

DROP TRIGGER IF EXISTS trigger_crear_perfil_tienda ON auth.users;
CREATE TRIGGER trigger_crear_perfil_tienda
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW
    WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
    EXECUTE FUNCTION crear_perfil_tienda();

-- También crear perfiles inmediatamente si el email ya está confirmado al crear el usuario
-- (para casos donde la confirmación de email está deshabilitada)
DROP TRIGGER IF EXISTS trigger_crear_perfil_comprador_imediato ON auth.users;
CREATE TRIGGER trigger_crear_perfil_comprador_imediato
    AFTER INSERT ON auth.users
    FOR EACH ROW
    WHEN (NEW.email_confirmed_at IS NOT NULL AND NEW.raw_user_meta_data->>'tipo_usuario' = 'comprador')
    EXECUTE FUNCTION crear_perfil_comprador();

DROP TRIGGER IF EXISTS trigger_crear_perfil_tienda_imediato ON auth.users;
CREATE TRIGGER trigger_crear_perfil_tienda_imediato
    AFTER INSERT ON auth.users
    FOR EACH ROW
    WHEN (NEW.email_confirmed_at IS NOT NULL AND (NEW.raw_user_meta_data->>'tipo_usuario' IN ('vendedor', 'emprendedor') OR NEW.raw_user_meta_data->>'nombre_tienda' IS NOT NULL))
    EXECUTE FUNCTION crear_perfil_tienda();

-- ===========================================
-- PASO 5: VERIFICAR FINAL
-- ===========================================
SELECT 
    '✅ VERIFICACIÓN FINAL' as resultado,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_proc 
            WHERE proname = 'crear_perfil_comprador'
        ) THEN '✅ Función crear_perfil_comprador existe'
        ELSE '❌ Función crear_perfil_comprador NO existe'
    END as funcion_comprador,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE event_object_schema = 'auth' 
            AND event_object_table = 'users'
            AND trigger_name = 'trigger_crear_perfil_comprador'
        ) THEN '✅ Trigger trigger_crear_perfil_comprador existe'
        ELSE '❌ Trigger trigger_crear_perfil_comprador NO existe'
    END as trigger_comprador;
