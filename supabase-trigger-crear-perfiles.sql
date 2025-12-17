-- ===== TRIGGER PARA CREAR PERFILES AUTOMÁTICAMENTE =====
-- Este trigger crea automáticamente el perfil en compradores o tiendas
-- cuando se confirma el email de un nuevo usuario

-- Función para crear perfil de comprador
CREATE OR REPLACE FUNCTION crear_perfil_comprador()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo crear si el usuario tiene tipo_usuario = 'comprador' en metadata
    IF NEW.raw_user_meta_data->>'tipo_usuario' = 'comprador' THEN
        BEGIN
            INSERT INTO compradores (user_id, nombre_completo, email, activo, fecha_registro)
            VALUES (
                NEW.id,
                COALESCE(NEW.raw_user_meta_data->>'nombre_completo', NEW.email),
                NEW.email,
                true,
                NOW()
            )
            ON CONFLICT (user_id) DO NOTHING;
        EXCEPTION WHEN OTHERS THEN
            -- No bloquear el signup si algo falla aquí
            RAISE NOTICE 'crear_perfil_comprador falló: %', SQLERRM;
        END;
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
        
        BEGIN
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
        EXCEPTION WHEN OTHERS THEN
            -- No bloquear el signup si algo falla aquí
            RAISE NOTICE 'crear_perfil_tienda falló: %', SQLERRM;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers: solo uno por tipo, AFTER INSERT (cubre confirmación inmediata). ON CONFLICT evita duplicados.
DROP TRIGGER IF EXISTS trigger_crear_perfil_comprador ON auth.users;
DROP TRIGGER IF EXISTS trigger_crear_perfil_tienda ON auth.users;
DROP TRIGGER IF EXISTS trigger_crear_perfil_comprador_imediato ON auth.users;
DROP TRIGGER IF EXISTS trigger_crear_perfil_tienda_imediato ON auth.users;

CREATE TRIGGER trigger_crear_perfil_comprador
    AFTER INSERT ON auth.users
    FOR EACH ROW
    WHEN (NEW.raw_user_meta_data->>'tipo_usuario' = 'comprador')
    EXECUTE FUNCTION crear_perfil_comprador();

CREATE TRIGGER trigger_crear_perfil_tienda
    AFTER INSERT ON auth.users
    FOR EACH ROW
    WHEN (NEW.raw_user_meta_data->>'tipo_usuario' IN ('vendedor', 'emprendedor') OR NEW.raw_user_meta_data->>'nombre_tienda' IS NOT NULL)
    EXECUTE FUNCTION crear_perfil_tienda();

