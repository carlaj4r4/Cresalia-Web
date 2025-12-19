-- ===== CREAR TIENDAS PARA USUARIOS VENDEDORES EXISTENTES (VERSIÓN SIMPLE) =====
-- Este script crea registros en la tabla 'tiendas' para usuarios que ya existen
-- en auth.users pero no tienen su registro correspondiente en tiendas

-- ⚠️ IMPORTANTE: Ejecutar este script completo en Supabase SQL Editor

-- Paso 1: Verificar usuarios vendedores sin tienda
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'tipo_usuario' as tipo_usuario,
    u.raw_user_meta_data->>'nombre_tienda' as nombre_tienda,
    u.raw_user_meta_data->>'plan' as plan
FROM auth.users u
LEFT JOIN public.tiendas t ON t.user_id = u.id
WHERE (u.raw_user_meta_data->>'tipo_usuario' IN ('vendedor', 'emprendedor') 
       OR u.raw_user_meta_data->>'nombre_tienda' IS NOT NULL)
  AND t.id IS NULL;

-- Paso 2: Crear tiendas usando INSERT directo (más simple que DO $$)
-- Esto crea las tiendas para cada usuario encontrado en el Paso 1

INSERT INTO public.tiendas (
    user_id,
    nombre_tienda,
    email,
    plan,
    subdomain,
    activa,
    fecha_creacion,
    configuracion
)
SELECT 
    u.id as user_id,
    COALESCE(
        u.raw_user_meta_data->>'nombre_tienda',
        'Mi Tienda'
    ) as nombre_tienda,
    u.email,
    COALESCE(
        u.raw_user_meta_data->>'plan',
        'basico'
    ) as plan,
    -- Generar subdomain único
    COALESCE(
        lower(regexp_replace(
            COALESCE(u.raw_user_meta_data->>'nombre_tienda', 'mi-tienda'),
            '[^a-zA-Z0-9]+', '-', 'g'
        )),
        'mi-tienda-' || substr(u.id::text, 1, 8)
    ) as subdomain,
    true as activa,
    NOW() as fecha_creacion,
    jsonb_build_object(
        'tipo', CASE 
            WHEN u.raw_user_meta_data->>'tipo_usuario' = 'emprendedor' THEN 'emprendedor' 
            ELSE 'tienda' 
        END,
        'es_servicio', (u.raw_user_meta_data->>'tipo_usuario' = 'emprendedor')
    ) as configuracion
FROM auth.users u
LEFT JOIN public.tiendas t ON t.user_id = u.id
WHERE (u.raw_user_meta_data->>'tipo_usuario' IN ('vendedor', 'emprendedor') 
       OR u.raw_user_meta_data->>'nombre_tienda' IS NOT NULL)
  AND t.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Paso 3: Verificar que se crearon las tiendas
SELECT 
    t.id,
    t.user_id,
    t.nombre_tienda,
    t.email,
    t.plan,
    t.subdomain,
    t.activa,
    t.fecha_creacion
FROM public.tiendas t
ORDER BY t.fecha_creacion DESC
LIMIT 10;
