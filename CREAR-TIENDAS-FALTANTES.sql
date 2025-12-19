-- ===== CREAR TIENDAS PARA USUARIOS VENDEDORES EXISTENTES =====
-- Este script crea registros en la tabla 'tiendas' para usuarios que ya existen
-- en auth.users pero no tienen su registro correspondiente en tiendas

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

-- Paso 2: Crear tiendas para usuarios faltantes
-- ⚠️ EJECUTAR ESTE BLOQUE SOLO DESPUÉS DE VERIFICAR EL PASO 1
DO $$
DECLARE
    usuario_record RECORD;
    nombre_tienda TEXT;
    plan_tienda TEXT;
    subdomain_tienda TEXT;
    es_emprendedor BOOLEAN;
    tipo_usuario TEXT;
BEGIN
    -- Iterar sobre usuarios vendedores sin tienda
    FOR usuario_record IN 
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
          AND t.id IS NULL
    LOOP
        -- Obtener datos del usuario
        tipo_usuario := usuario_record.tipo_usuario;
        nombre_tienda := COALESCE(usuario_record.nombre_tienda, 'Mi Tienda');
        plan_tienda := COALESCE(usuario_record.plan, 'basico');
        es_emprendedor := (tipo_usuario = 'emprendedor');
        
        -- Generar subdomain
        subdomain_tienda := lower(regexp_replace(nombre_tienda, '[^a-zA-Z0-9]+', '-', 'g'));
        subdomain_tienda := regexp_replace(subdomain_tienda, '^-|-$', '', 'g');
        
        -- Asegurar que el subdomain sea único
        WHILE EXISTS (SELECT 1 FROM public.tiendas WHERE subdomain = subdomain_tienda) LOOP
            subdomain_tienda := subdomain_tienda || '-' || floor(random() * 1000)::text;
        END LOOP;
        
        -- Insertar tienda
        BEGIN
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
            VALUES (
                usuario_record.id,
                nombre_tienda,
                usuario_record.email,
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
            
            RAISE NOTICE '✅ Tienda creada para usuario: % (email: %)', usuario_record.id, usuario_record.email;
        EXCEPTION WHEN OTHERS THEN
            RAISE WARNING '⚠️ Error creando tienda para usuario %: %', usuario_record.id, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '✅ Proceso completado. Verifica la tabla tiendas.';
END $$;

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
ORDER BY t.fecha_creacion DESC;
