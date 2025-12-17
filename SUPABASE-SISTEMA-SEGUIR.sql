-- ===== SISTEMA DE SEGUIR TIENDAS Y USUARIOS - CRESALIA =====
-- Permite a usuarios seguir tiendas, servicios y otros usuarios en las comunidades

-- ===== TABLA PRINCIPAL: SEGUIDORES =====

CREATE TABLE IF NOT EXISTS seguidores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Quién sigue (el seguidor)
    seguidor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    seguidor_tipo TEXT NOT NULL CHECK (seguidor_tipo IN ('comprador', 'vendedor', 'emprendedor')),
    
    -- A quién sigue (el seguido)
    seguido_id UUID NOT NULL, -- Puede ser user_id, tienda_id, servicio_id, etc.
    seguido_tipo TEXT NOT NULL CHECK (seguido_tipo IN ('tienda', 'servicio', 'usuario', 'comprador', 'vendedor')),
    
    -- Metadata
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activo BOOLEAN DEFAULT true,
    notificaciones_activas BOOLEAN DEFAULT true, -- Si quiere recibir notificaciones
    
    -- Evitar duplicados
    UNIQUE(seguidor_id, seguido_id, seguido_tipo)
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_seguidores_seguidor ON seguidores(seguidor_id, activo) WHERE activo = true;
CREATE INDEX IF NOT EXISTS idx_seguidores_seguido ON seguidores(seguido_id, seguido_tipo, activo) WHERE activo = true;
CREATE INDEX IF NOT EXISTS idx_seguidores_fecha ON seguidores(fecha_inicio DESC);

-- ===== TABLA DE CONTADORES (CACHE) =====

CREATE TABLE IF NOT EXISTS contadores_seguidores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entidad_id UUID NOT NULL,
    entidad_tipo TEXT NOT NULL CHECK (entidad_tipo IN ('tienda', 'servicio', 'usuario', 'comprador', 'vendedor')),
    
    total_seguidores INTEGER DEFAULT 0,
    total_siguiendo INTEGER DEFAULT 0,
    
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(entidad_id, entidad_tipo)
);

CREATE INDEX IF NOT EXISTS idx_contadores_entidad ON contadores_seguidores(entidad_id, entidad_tipo);

-- ===== ROW LEVEL SECURITY =====

ALTER TABLE seguidores ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver quién sigue a quién (para mostrar "X personas siguen esta tienda")
CREATE POLICY "Seguidores visibles para todos" ON seguidores
    FOR SELECT USING (activo = true);

-- Solo el seguidor puede crear su propia relación
CREATE POLICY "Usuarios pueden seguir" ON seguidores
    FOR INSERT WITH CHECK (auth.uid() = seguidor_id);

-- Solo el seguidor puede eliminar su propia relación (dejar de seguir)
CREATE POLICY "Usuarios pueden dejar de seguir" ON seguidores
    FOR DELETE USING (auth.uid() = seguidor_id);

-- Solo el seguidor puede actualizar sus notificaciones
CREATE POLICY "Usuarios pueden actualizar sus seguimientos" ON seguidores
    FOR UPDATE USING (auth.uid() = seguidor_id);

-- ===== FUNCIONES =====

-- Función para seguir una entidad
CREATE OR REPLACE FUNCTION seguir_entidad(
    p_seguido_id UUID,
    p_seguido_tipo TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_seguidor_id UUID;
    v_seguidor_tipo TEXT;
    v_result JSONB;
BEGIN
    -- Obtener el ID del usuario actual
    v_seguidor_id := auth.uid();
    
    IF v_seguidor_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Usuario no autenticado');
    END IF;
    
    -- Determinar tipo de seguidor desde auth.users metadata
    SELECT raw_user_meta_data->>'tipo_usuario' INTO v_seguidor_tipo
    FROM auth.users
    WHERE id = v_seguidor_id;
    
    v_seguidor_tipo := COALESCE(v_seguidor_tipo, 'comprador');
    
    -- Insertar o reactivar seguimiento
    INSERT INTO seguidores (
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
    
    -- Actualizar contadores
    PERFORM actualizar_contador_seguidores(p_seguido_id, p_seguido_tipo);
    
    v_result := jsonb_build_object(
        'success', true,
        'message', 'Ahora seguís a esta entidad',
        'seguidor_id', v_seguidor_id,
        'seguido_id', p_seguido_id
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para dejar de seguir una entidad
CREATE OR REPLACE FUNCTION dejar_de_seguir_entidad(
    p_seguido_id UUID,
    p_seguido_tipo TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_seguidor_id UUID;
    v_result JSONB;
BEGIN
    v_seguidor_id := auth.uid();
    
    IF v_seguidor_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Usuario no autenticado');
    END IF;
    
    -- Marcar como inactivo (soft delete)
    UPDATE seguidores
    SET activo = false
    WHERE seguidor_id = v_seguidor_id
    AND seguido_id = p_seguido_id
    AND seguido_tipo = p_seguido_tipo;
    
    -- Actualizar contadores
    PERFORM actualizar_contador_seguidores(p_seguido_id, p_seguido_tipo);
    
    v_result := jsonb_build_object(
        'success', true,
        'message', 'Dejaste de seguir a esta entidad'
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario sigue una entidad
CREATE OR REPLACE FUNCTION esta_siguiendo(
    p_seguido_id UUID,
    p_seguido_tipo TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_seguidor_id UUID;
    v_siguiendo BOOLEAN;
BEGIN
    v_seguidor_id := auth.uid();
    
    IF v_seguidor_id IS NULL THEN
        RETURN false;
    END IF;
    
    SELECT EXISTS (
        SELECT 1 FROM seguidores
        WHERE seguidor_id = v_seguidor_id
        AND seguido_id = p_seguido_id
        AND seguido_tipo = p_seguido_tipo
        AND activo = true
    ) INTO v_siguiendo;
    
    RETURN v_siguiendo;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar contadores
CREATE OR REPLACE FUNCTION actualizar_contador_seguidores(
    p_entidad_id UUID,
    p_entidad_tipo TEXT
)
RETURNS VOID AS $$
DECLARE
    v_total_seguidores INTEGER;
BEGIN
    -- Contar seguidores activos
    SELECT COUNT(*)
    INTO v_total_seguidores
    FROM seguidores
    WHERE seguido_id = p_entidad_id
    AND seguido_tipo = p_entidad_tipo
    AND activo = true;
    
    -- Actualizar o insertar contador
    INSERT INTO contadores_seguidores (
        entidad_id,
        entidad_tipo,
        total_seguidores,
        ultima_actualizacion
    ) VALUES (
        p_entidad_id,
        p_entidad_tipo,
        v_total_seguidores,
        NOW()
    )
    ON CONFLICT (entidad_id, entidad_tipo)
    DO UPDATE SET
        total_seguidores = v_total_seguidores,
        ultima_actualizacion = NOW();
END;
$$ LANGUAGE plpgsql;

-- Función para obtener seguidores de una entidad
CREATE OR REPLACE FUNCTION obtener_seguidores(
    p_entidad_id UUID,
    p_entidad_tipo TEXT,
    p_limite INTEGER DEFAULT 50
)
RETURNS TABLE (
    seguidor_id UUID,
    seguidor_tipo TEXT,
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    nombre TEXT,
    email TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.seguidor_id,
        s.seguidor_tipo,
        s.fecha_inicio,
        COALESCE(
            (SELECT nombre_tienda FROM tiendas WHERE user_id = s.seguidor_id),
            (SELECT nombre_servicio FROM servicios WHERE user_id = s.seguidor_id),
            (SELECT nombre_completo FROM compradores WHERE user_id = s.seguidor_id),
            u.email
        ) as nombre,
        u.email
    FROM seguidores s
    JOIN auth.users u ON u.id = s.seguidor_id
    WHERE s.seguido_id = p_entidad_id
    AND s.seguido_tipo = p_entidad_tipo
    AND s.activo = true
    ORDER BY s.fecha_inicio DESC
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener a quién sigue un usuario
CREATE OR REPLACE FUNCTION obtener_siguiendo(
    p_usuario_id UUID DEFAULT NULL,
    p_limite INTEGER DEFAULT 50
)
RETURNS TABLE (
    seguido_id UUID,
    seguido_tipo TEXT,
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    nombre TEXT,
    descripcion TEXT,
    foto_url TEXT
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
        CASE s.seguido_tipo
            WHEN 'tienda' THEN (SELECT nombre_tienda FROM tiendas WHERE id = s.seguido_id)
            WHEN 'servicio' THEN (SELECT nombre_servicio FROM servicios WHERE id = s.seguido_id)
            WHEN 'comprador' THEN (SELECT nombre_completo FROM compradores WHERE id = s.seguido_id)
            ELSE 'Usuario'
        END as nombre,
        CASE s.seguido_tipo
            WHEN 'tienda' THEN (SELECT configuracion->>'descripcion' FROM tiendas WHERE id = s.seguido_id)
            WHEN 'servicio' THEN (SELECT configuracion->>'descripcion' FROM servicios WHERE id = s.seguido_id)
            ELSE NULL
        END as descripcion,
        CASE s.seguido_tipo
            WHEN 'tienda' THEN (SELECT configuracion->>'logo_url' FROM tiendas WHERE id = s.seguido_id)
            WHEN 'servicio' THEN (SELECT configuracion->>'foto_url' FROM servicios WHERE id = s.seguido_id)
            ELSE NULL
        END as foto_url
    FROM seguidores s
    WHERE s.seguidor_id = v_usuario_id
    AND s.activo = true
    ORDER BY s.fecha_inicio DESC
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== TRIGGERS =====

-- Trigger para actualizar contadores automáticamente
CREATE OR REPLACE FUNCTION trigger_actualizar_contadores()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        PERFORM actualizar_contador_seguidores(NEW.seguido_id, NEW.seguido_tipo);
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM actualizar_contador_seguidores(OLD.seguido_id, OLD.seguido_tipo);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_actualizar_contadores_seguidores ON seguidores;

CREATE TRIGGER trigger_actualizar_contadores_seguidores
    AFTER INSERT OR UPDATE OR DELETE ON seguidores
    FOR EACH ROW
    EXECUTE FUNCTION trigger_actualizar_contadores();

-- ===== QUERIES ÚTILES =====

-- Ver top tiendas más seguidas
CREATE OR REPLACE VIEW top_tiendas_seguidas AS
SELECT 
    t.id,
    t.nombre_tienda,
    t.subdomain,
    c.total_seguidores,
    t.configuracion->>'logo_url' as logo_url,
    t.configuracion->>'descripcion' as descripcion
FROM tiendas t
JOIN contadores_seguidores c ON c.entidad_id = t.id AND c.entidad_tipo = 'tienda'
WHERE t.activa = true
ORDER BY c.total_seguidores DESC;

-- Ver top servicios más seguidos
CREATE OR REPLACE VIEW top_servicios_seguidos AS
SELECT 
    s.id,
    s.nombre_servicio,
    s.subdomain,
    c.total_seguidores,
    s.configuracion->>'foto_url' as foto_url,
    s.configuracion->>'descripcion' as descripcion
FROM servicios s
JOIN contadores_seguidores c ON c.entidad_id = s.id AND c.entidad_tipo = 'servicio'
WHERE s.activo = true
ORDER BY c.total_seguidores DESC;

-- ===== NOTAS DE USO =====

-- Para seguir una tienda desde JavaScript:
-- const { data } = await supabase.rpc('seguir_entidad', { p_seguido_id: tienda_id, p_seguido_tipo: 'tienda' });

-- Para dejar de seguir:
-- const { data } = await supabase.rpc('dejar_de_seguir_entidad', { p_seguido_id: tienda_id, p_seguido_tipo: 'tienda' });

-- Para verificar si está siguiendo:
-- const { data } = await supabase.rpc('esta_siguiendo', { p_seguido_id: tienda_id, p_seguido_tipo: 'tienda' });

-- Para obtener seguidores de una tienda:
-- const { data } = await supabase.rpc('obtener_seguidores', { p_entidad_id: tienda_id, p_entidad_tipo: 'tienda' });

-- Para obtener a quién sigue un usuario:
-- const { data } = await supabase.rpc('obtener_siguiendo');
