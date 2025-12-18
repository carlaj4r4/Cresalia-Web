-- ===== FUNCIONES PARA SEGUIR EN COMUNIDADES =====
-- Estas funciones permiten seguir usuarios en las comunidades
-- Complementa el archivo SUPABASE-SISTEMA-SEGUIR-CORREGIDO.sql

-- NOTA: La tabla seguidores_comunidad ya fue creada en SUPABASE-SISTEMA-SEGUIR-CORREGIDO.sql
-- Este script solo agrega las funciones que faltaban

-- ===== FUNCIÓN: SEGUIR USUARIO EN COMUNIDAD =====

CREATE OR REPLACE FUNCTION seguir_entidad_comunidad(
    p_seguido_id TEXT,
    p_seguido_tipo TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_seguidor_id UUID;
    v_seguidor_tipo TEXT;
BEGIN
    -- Obtener ID del usuario autenticado
    v_seguidor_id := auth.uid();
    
    IF v_seguidor_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false, 
            'message', 'Usuario no autenticado'
        );
    END IF;
    
    -- Obtener tipo de usuario
    SELECT COALESCE(raw_user_meta_data->>'tipo_usuario', 'comprador')
    INTO v_seguidor_tipo
    FROM auth.users 
    WHERE id = v_seguidor_id;
    
    -- Insertar o actualizar seguimiento
    INSERT INTO seguidores_comunidad (
        seguidor_id, 
        seguidor_tipo, 
        seguido_id, 
        seguido_tipo,
        activo, 
        notificaciones_activas
    ) VALUES (
        v_seguidor_id, 
        v_seguidor_tipo, 
        p_seguido_id, 
        p_seguido_tipo, 
        true, 
        true
    )
    ON CONFLICT (seguidor_id, seguido_id, seguido_tipo)
    DO UPDATE SET 
        activo = true, 
        fecha_inicio = NOW();
    
    -- Actualizar contador
    PERFORM actualizar_contador_seguidores(p_seguido_id, p_seguido_tipo, 'comunidad');
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Ahora seguís a este usuario',
        'seguidor_id', v_seguidor_id,
        'seguido_id', p_seguido_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== FUNCIÓN: DEJAR DE SEGUIR USUARIO EN COMUNIDAD =====

CREATE OR REPLACE FUNCTION dejar_de_seguir_entidad_comunidad(
    p_seguido_id TEXT,
    p_seguido_tipo TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_seguidor_id UUID;
BEGIN
    v_seguidor_id := auth.uid();
    
    IF v_seguidor_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false, 
            'message', 'Usuario no autenticado'
        );
    END IF;
    
    -- Marcar como inactivo (soft delete)
    UPDATE seguidores_comunidad
    SET activo = false
    WHERE seguidor_id = v_seguidor_id
    AND seguido_id = p_seguido_id
    AND seguido_tipo = p_seguido_tipo;
    
    -- Actualizar contador
    PERFORM actualizar_contador_seguidores(p_seguido_id, p_seguido_tipo, 'comunidad');
    
    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Dejaste de seguir a este usuario'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== FUNCIÓN: VERIFICAR SI ESTÁ SIGUIENDO =====

CREATE OR REPLACE FUNCTION esta_siguiendo_comunidad(
    p_seguido_id TEXT,
    p_seguido_tipo TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_siguiendo BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM seguidores_comunidad
        WHERE seguidor_id = auth.uid()
        AND seguido_id = p_seguido_id
        AND seguido_tipo = p_seguido_tipo
        AND activo = true
    ) INTO v_siguiendo;
    
    RETURN v_siguiendo;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== FUNCIÓN: OBTENER SEGUIDORES DE UN USUARIO =====

CREATE OR REPLACE FUNCTION obtener_seguidores_comunidad(
    p_entidad_id TEXT,
    p_entidad_tipo TEXT,
    p_limite INTEGER DEFAULT 50
)
RETURNS TABLE (
    seguidor_id UUID,
    seguidor_tipo TEXT,
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    nombre TEXT,
    email TEXT,
    foto_perfil TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.seguidor_id,
        s.seguidor_tipo,
        s.fecha_inicio,
        COALESCE(
            (SELECT nombre_tienda FROM tiendas WHERE user_id = s.seguidor_id LIMIT 1),
            (SELECT nombre_completo FROM compradores WHERE user_id = s.seguidor_id LIMIT 1),
            u.email
        ) as nombre,
        u.email,
        COALESCE(
            u.raw_user_meta_data->>'avatar_url',
            ''
        ) as foto_perfil
    FROM seguidores_comunidad s
    JOIN auth.users u ON u.id = s.seguidor_id
    WHERE s.seguido_id = p_entidad_id
    AND s.seguido_tipo = p_entidad_tipo
    AND s.activo = true
    ORDER BY s.fecha_inicio DESC
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== FUNCIÓN: OBTENER A QUIÉN SIGUE UN USUARIO =====

CREATE OR REPLACE FUNCTION obtener_siguiendo_comunidad(
    p_usuario_id UUID DEFAULT NULL,
    p_limite INTEGER DEFAULT 50
)
RETURNS TABLE (
    seguido_id TEXT,
    seguido_tipo TEXT,
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    nombre TEXT,
    foto_perfil TEXT
) AS $$
DECLARE
    v_usuario_id UUID;
BEGIN
    v_usuario_id := COALESCE(p_usuario_id, auth.uid());
    
    IF v_usuario_id IS NULL THEN
        RAISE EXCEPTION 'Usuario no autenticado';
    END IF;
    
    RETURN QUERY
    SELECT 
        s.seguido_id,
        s.seguido_tipo,
        s.fecha_inicio,
        COALESCE(
            (SELECT nombre_tienda FROM tiendas WHERE user_id::TEXT = s.seguido_id LIMIT 1),
            (SELECT nombre_completo FROM compradores WHERE user_id::TEXT = s.seguido_id LIMIT 1),
            'Usuario'
        ) as nombre,
        COALESCE(
            (SELECT raw_user_meta_data->>'avatar_url' FROM auth.users WHERE id::TEXT = s.seguido_id LIMIT 1),
            ''
        ) as foto_perfil
    FROM seguidores_comunidad s
    WHERE s.seguidor_id = v_usuario_id
    AND s.activo = true
    ORDER BY s.fecha_inicio DESC
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== FUNCIÓN: TOP USUARIOS MÁS SEGUIDOS EN COMUNIDADES =====

CREATE OR REPLACE FUNCTION obtener_top_usuarios_seguidos_comunidad(
    p_tipo_usuario TEXT DEFAULT NULL,
    p_limite INTEGER DEFAULT 10
)
RETURNS TABLE (
    usuario_id TEXT,
    tipo_usuario TEXT,
    nombre TEXT,
    total_seguidores INTEGER,
    foto_perfil TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.entidad_id as usuario_id,
        c.entidad_tipo as tipo_usuario,
        COALESCE(
            (SELECT nombre_tienda FROM tiendas WHERE user_id::TEXT = c.entidad_id LIMIT 1),
            (SELECT nombre_completo FROM compradores WHERE user_id::TEXT = c.entidad_id LIMIT 1),
            'Usuario'
        ) as nombre,
        COALESCE(c.total_seguidores, 0) as total_seguidores,
        COALESCE(
            (SELECT raw_user_meta_data->>'avatar_url' FROM auth.users WHERE id::TEXT = c.entidad_id LIMIT 1),
            ''
        ) as foto_perfil
    FROM contadores_seguidores c
    WHERE c.ambito = 'comunidad'
    AND (p_tipo_usuario IS NULL OR c.entidad_tipo = p_tipo_usuario)
    AND c.total_seguidores > 0
    ORDER BY c.total_seguidores DESC
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql STABLE;

-- ===== EJEMPLOS DE USO =====

-- Para seguir a un usuario:
-- SELECT seguir_entidad_comunidad('uuid-del-usuario', 'usuario');

-- Para dejar de seguir:
-- SELECT dejar_de_seguir_entidad_comunidad('uuid-del-usuario', 'usuario');

-- Para verificar si estás siguiendo:
-- SELECT esta_siguiendo_comunidad('uuid-del-usuario', 'usuario');

-- Para ver seguidores de un usuario:
-- SELECT * FROM obtener_seguidores_comunidad('uuid-del-usuario', 'usuario', 20);

-- Para ver a quién sigue un usuario:
-- SELECT * FROM obtener_siguiendo_comunidad(NULL, 20); -- NULL = usuario actual

-- Para ver top usuarios más seguidos:
-- SELECT * FROM obtener_top_usuarios_seguidos_comunidad(NULL, 10); -- NULL = todos los tipos

-- ===== VERIFICACIÓN =====

-- Verificar que las funciones se crearon correctamente:
SELECT 
    '=== FUNCIONES COMUNIDAD CREADAS ===' as resultado,
    proname as nombre_funcion
FROM pg_proc 
WHERE proname IN (
    'seguir_entidad_comunidad',
    'dejar_de_seguir_entidad_comunidad',
    'esta_siguiendo_comunidad',
    'obtener_seguidores_comunidad',
    'obtener_siguiendo_comunidad',
    'obtener_top_usuarios_seguidos_comunidad'
);
