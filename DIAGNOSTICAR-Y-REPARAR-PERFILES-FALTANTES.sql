-- ===== DIAGNOSTICAR Y REPARAR PERFILES FALTANTES =====
-- Este script diagnostica por qué no se crean los perfiles y los repara
-- Ejecutá esto en Supabase SQL Editor

-- ===========================================
-- PASO 1: VERIFICAR TRIGGERS
-- ===========================================
SELECT 
    '🔍 VERIFICACIÓN DE TRIGGERS' as paso,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
AND event_object_table = 'users'
AND trigger_name LIKE '%perfil%'
ORDER BY trigger_name;

-- ===========================================
-- PASO 2: VERIFICAR FUNCIONES
-- ===========================================
SELECT 
    '🔍 VERIFICACIÓN DE FUNCIONES' as paso,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%perfil%'
ORDER BY routine_name;

-- ===========================================
-- PASO 3: ENCONTRAR USUARIOS SIN PERFIL
-- ===========================================
SELECT 
    '❌ USUARIOS SIN PERFIL EN COMPRADORES' as problema,
    u.id as user_id,
    u.email,
    u.email_confirmed_at,
    u.raw_user_meta_data->>'tipo_usuario' as tipo_usuario,
    u.raw_user_meta_data->>'nombre_completo' as nombre_completo,
    u.created_at
FROM auth.users u
WHERE u.email_confirmed_at IS NOT NULL
AND u.raw_user_meta_data->>'tipo_usuario' = 'comprador'
AND NOT EXISTS (
    SELECT 1 FROM compradores c WHERE c.user_id = u.id
)
ORDER BY u.created_at DESC;

-- ===========================================
-- PASO 4: CREAR PERFILES FALTANTES MANUALMENTE
-- ===========================================
-- Esto crea los perfiles que deberían haberse creado automáticamente
INSERT INTO compradores (user_id, nombre_completo, email, activo, fecha_registro)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'nombre_completo', u.email) as nombre_completo,
    u.email,
    true,
    COALESCE(u.email_confirmed_at, u.created_at) as fecha_registro
FROM auth.users u
WHERE u.email_confirmed_at IS NOT NULL
AND u.raw_user_meta_data->>'tipo_usuario' = 'comprador'
AND NOT EXISTS (
    SELECT 1 FROM compradores c WHERE c.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- ===========================================
-- PASO 5: VERIFICAR QUE SE CREARON
-- ===========================================
SELECT 
    '✅ PERFILES CREADOS' as resultado,
    COUNT(*) as total_perfiles_creados
FROM compradores;

-- ===========================================
-- PASO 6: RECREAR TRIGGERS SI NO EXISTEN
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

-- Trigger que se ejecuta cuando se confirma el email
DROP TRIGGER IF EXISTS trigger_crear_perfil_comprador ON auth.users;
CREATE TRIGGER trigger_crear_perfil_comprador
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW
    WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
    EXECUTE FUNCTION crear_perfil_comprador();

-- Trigger inmediato (si el email ya está confirmado al crear el usuario)
DROP TRIGGER IF EXISTS trigger_crear_perfil_comprador_imediato ON auth.users;
CREATE TRIGGER trigger_crear_perfil_comprador_imediato
    AFTER INSERT ON auth.users
    FOR EACH ROW
    WHEN (NEW.email_confirmed_at IS NOT NULL AND NEW.raw_user_meta_data->>'tipo_usuario' = 'comprador')
    EXECUTE FUNCTION crear_perfil_comprador();

-- ===========================================
-- PASO 7: VERIFICACIÓN FINAL
-- ===========================================
SELECT 
    '✅ VERIFICACIÓN FINAL' as resultado,
    (SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL AND raw_user_meta_data->>'tipo_usuario' = 'comprador') as usuarios_compradores_confirmados,
    (SELECT COUNT(*) FROM compradores) as perfiles_en_tabla,
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL AND raw_user_meta_data->>'tipo_usuario' = 'comprador') = 
             (SELECT COUNT(*) FROM compradores) 
        THEN '✅ Todos los usuarios tienen perfil'
        ELSE '⚠️ Hay usuarios sin perfil'
    END as estado;

-- ===========================================
-- PASO 8: VER USUARIOS RECIENTES Y SUS METADATOS
-- ===========================================
SELECT 
    '🔍 USUARIOS RECIENTES' as info,
    u.id,
    u.email,
    u.email_confirmed_at,
    u.raw_user_meta_data->>'tipo_usuario' as tipo_usuario,
    u.raw_user_meta_data->>'nombre_completo' as nombre_completo,
    CASE 
        WHEN EXISTS (SELECT 1 FROM compradores c WHERE c.user_id = u.id) 
        THEN '✅ Tiene perfil'
        ELSE '❌ NO tiene perfil'
    END as tiene_perfil
FROM auth.users u
WHERE u.created_at > NOW() - INTERVAL '7 days'
ORDER BY u.created_at DESC
LIMIT 10;
