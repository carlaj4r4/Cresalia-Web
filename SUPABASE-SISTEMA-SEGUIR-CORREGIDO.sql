-- ===== SISTEMA DE SEGUIR - CORREGIDO PARA TIPOS MIXTOS =====
-- Compatible con UUID y BIGINT/SERIAL
-- Separado para E-COMMERCE y COMUNIDADES

-- ===== TABLA: SEGUIDORES E-COMMERCE =====

CREATE TABLE IF NOT EXISTS seguidores_ecommerce (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    seguidor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    seguidor_tipo TEXT NOT NULL CHECK (seguidor_tipo IN ('comprador', 'vendedor')),
    
    seguido_id TEXT NOT NULL, -- TEXT para soportar UUID o BIGINT
    seguido_tipo TEXT NOT NULL CHECK (seguido_tipo IN ('tienda', 'servicio')),
    
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activo BOOLEAN DEFAULT true,
    notificaciones_activas BOOLEAN DEFAULT true,
    
    UNIQUE(seguidor_id, seguido_id, seguido_tipo)
);

CREATE INDEX IF NOT EXISTS idx_seguidores_ecom_seguidor ON seguidores_ecommerce(seguidor_id, activo) WHERE activo = true;
CREATE INDEX IF NOT EXISTS idx_seguidores_ecom_seguido ON seguidores_ecommerce(seguido_id, seguido_tipo, activo) WHERE activo = true;

-- ===== TABLA: SEGUIDORES COMUNIDADES =====

CREATE TABLE IF NOT EXISTS seguidores_comunidad (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    seguidor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    seguidor_tipo TEXT NOT NULL CHECK (seguidor_tipo IN ('comprador', 'vendedor', 'emprendedor')),
    
    seguido_id TEXT NOT NULL,
    seguido_tipo TEXT NOT NULL CHECK (seguido_tipo IN ('comprador', 'vendedor', 'usuario')),
    
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activo BOOLEAN DEFAULT true,
    notificaciones_activas BOOLEAN DEFAULT true,
    
    UNIQUE(seguidor_id, seguido_id, seguido_tipo)
);

CREATE INDEX IF NOT EXISTS idx_seguidores_comu_seguidor ON seguidores_comunidad(seguidor_id, activo) WHERE activo = true;
CREATE INDEX IF NOT EXISTS idx_seguidores_comu_seguido ON seguidores_comunidad(seguido_id, seguido_tipo, activo) WHERE activo = true;

-- ===== TABLA: CONTADORES (CACHE) =====

CREATE TABLE IF NOT EXISTS contadores_seguidores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entidad_id TEXT NOT NULL,
    entidad_tipo TEXT NOT NULL CHECK (entidad_tipo IN ('tienda', 'servicio', 'usuario', 'comprador', 'vendedor')),
    ambito TEXT NOT NULL DEFAULT 'ecommerce' CHECK (ambito IN ('ecommerce', 'comunidad')),
    
    total_seguidores INTEGER DEFAULT 0,
    total_siguiendo INTEGER DEFAULT 0,
    
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(entidad_id, entidad_tipo, ambito)
);

CREATE INDEX IF NOT EXISTS idx_contadores_entidad ON contadores_seguidores(entidad_id, entidad_tipo, ambito);

-- RLS para contadores (permite lectura pública)
ALTER TABLE contadores_seguidores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Contadores visibles públicamente" ON contadores_seguidores;
CREATE POLICY "Contadores visibles públicamente" ON contadores_seguidores
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Solo funciones pueden modificar contadores" ON contadores_seguidores;
CREATE POLICY "Solo funciones pueden modificar contadores" ON contadores_seguidores
    FOR ALL USING (false);

-- ===== ROW LEVEL SECURITY =====

ALTER TABLE seguidores_ecommerce ENABLE ROW LEVEL SECURITY;
ALTER TABLE seguidores_comunidad ENABLE ROW LEVEL SECURITY;

-- Seguidores visibles para todos
DROP POLICY IF EXISTS "Seguidores ecommerce visibles" ON seguidores_ecommerce;
CREATE POLICY "Seguidores ecommerce visibles" ON seguidores_ecommerce
    FOR SELECT USING (activo = true);

DROP POLICY IF EXISTS "Usuarios pueden seguir ecommerce" ON seguidores_ecommerce;
CREATE POLICY "Usuarios pueden seguir ecommerce" ON seguidores_ecommerce
    FOR INSERT WITH CHECK (auth.uid() = seguidor_id);

DROP POLICY IF EXISTS "Usuarios pueden dejar de seguir ecommerce" ON seguidores_ecommerce;
CREATE POLICY "Usuarios pueden dejar de seguir ecommerce" ON seguidores_ecommerce
    FOR DELETE USING (auth.uid() = seguidor_id);

DROP POLICY IF EXISTS "Usuarios pueden actualizar seguimiento ecommerce" ON seguidores_ecommerce;
CREATE POLICY "Usuarios pueden actualizar seguimiento ecommerce" ON seguidores_ecommerce
    FOR UPDATE USING (auth.uid() = seguidor_id);

-- Mismo para comunidad
DROP POLICY IF EXISTS "Seguidores comunidad visibles" ON seguidores_comunidad;
CREATE POLICY "Seguidores comunidad visibles" ON seguidores_comunidad
    FOR SELECT USING (activo = true);

DROP POLICY IF EXISTS "Usuarios pueden seguir comunidad" ON seguidores_comunidad;
CREATE POLICY "Usuarios pueden seguir comunidad" ON seguidores_comunidad
    FOR INSERT WITH CHECK (auth.uid() = seguidor_id);

DROP POLICY IF EXISTS "Usuarios pueden dejar de seguir comunidad" ON seguidores_comunidad;
CREATE POLICY "Usuarios pueden dejar de seguir comunidad" ON seguidores_comunidad
    FOR DELETE USING (auth.uid() = seguidor_id);

DROP POLICY IF EXISTS "Usuarios pueden actualizar seguimiento comunidad" ON seguidores_comunidad;
CREATE POLICY "Usuarios pueden actualizar seguimiento comunidad" ON seguidores_comunidad
    FOR UPDATE USING (auth.uid() = seguidor_id);

-- ===== FUNCIONES =====

-- Seguir una entidad (E-COMMERCE)
CREATE OR REPLACE FUNCTION seguir_entidad_ecommerce(
    p_seguido_id TEXT,
    p_seguido_tipo TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_seguidor_id UUID;
    v_seguidor_tipo TEXT;
BEGIN
    v_seguidor_id := auth.uid();
    
    IF v_seguidor_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Usuario no autenticado');
    END IF;
    
    SELECT COALESCE(raw_user_meta_data->>'tipo_usuario', 'comprador')
    INTO v_seguidor_tipo
    FROM auth.users WHERE id = v_seguidor_id;
    
    INSERT INTO seguidores_ecommerce (
        seguidor_id, seguidor_tipo, seguido_id, seguido_tipo,
        activo, notificaciones_activas
    ) VALUES (
        v_seguidor_id, v_seguidor_tipo, p_seguido_id, p_seguido_tipo, true, true
    )
    ON CONFLICT (seguidor_id, seguido_id, seguido_tipo)
    DO UPDATE SET activo = true, fecha_inicio = NOW();
    
    -- Actualizar contadores
    PERFORM actualizar_contador_seguidores(p_seguido_id, p_seguido_tipo, 'ecommerce');
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Ahora seguís a esta entidad',
        'seguidor_id', v_seguidor_id,
        'seguido_id', p_seguido_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dejar de seguir (E-COMMERCE)
CREATE OR REPLACE FUNCTION dejar_de_seguir_entidad_ecommerce(
    p_seguido_id TEXT,
    p_seguido_tipo TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_seguidor_id UUID;
BEGIN
    v_seguidor_id := auth.uid();
    
    IF v_seguidor_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Usuario no autenticado');
    END IF;
    
    UPDATE seguidores_ecommerce
    SET activo = false
    WHERE seguidor_id = v_seguidor_id
    AND seguido_id = p_seguido_id
    AND seguido_tipo = p_seguido_tipo;
    
    PERFORM actualizar_contador_seguidores(p_seguido_id, p_seguido_tipo, 'ecommerce');
    
    RETURN jsonb_build_object('success', true, 'message', 'Dejaste de seguir');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar si está siguiendo
CREATE OR REPLACE FUNCTION esta_siguiendo_ecommerce(
    p_seguido_id TEXT,
    p_seguido_tipo TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_siguiendo BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM seguidores_ecommerce
        WHERE seguidor_id = auth.uid()
        AND seguido_id = p_seguido_id
        AND seguido_tipo = p_seguido_tipo
        AND activo = true
    ) INTO v_siguiendo;
    
    RETURN v_siguiendo;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Actualizar contadores
CREATE OR REPLACE FUNCTION actualizar_contador_seguidores(
    p_entidad_id TEXT,
    p_entidad_tipo TEXT,
    p_ambito TEXT DEFAULT 'ecommerce'
)
RETURNS VOID AS $$
DECLARE
    v_total INTEGER;
BEGIN
    IF p_ambito = 'comunidad' THEN
        SELECT COUNT(*) INTO v_total
        FROM seguidores_comunidad
        WHERE seguido_id = p_entidad_id
        AND seguido_tipo = p_entidad_tipo
        AND activo = true;
    ELSE
        SELECT COUNT(*) INTO v_total
        FROM seguidores_ecommerce
        WHERE seguido_id = p_entidad_id
        AND seguido_tipo = p_entidad_tipo
        AND activo = true;
    END IF;
    
    INSERT INTO contadores_seguidores (
        entidad_id, entidad_tipo, ambito, total_seguidores, ultima_actualizacion
    ) VALUES (
        p_entidad_id, p_entidad_tipo, p_ambito, v_total, NOW()
    )
    ON CONFLICT (entidad_id, entidad_tipo, ambito)
    DO UPDATE SET
        total_seguidores = v_total,
        ultima_actualizacion = NOW();
END;
$$ LANGUAGE plpgsql;

-- Obtener seguidores
CREATE OR REPLACE FUNCTION obtener_seguidores_ecommerce(
    p_entidad_id TEXT,
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
            (SELECT nombre_tienda FROM tiendas WHERE user_id = s.seguidor_id LIMIT 1),
            (SELECT nombre_completo FROM compradores WHERE user_id = s.seguidor_id LIMIT 1),
            u.email
        ) as nombre,
        u.email
    FROM seguidores_ecommerce s
    JOIN auth.users u ON u.id = s.seguidor_id
    WHERE s.seguido_id = p_entidad_id
    AND s.seguido_tipo = p_entidad_tipo
    AND s.activo = true
    ORDER BY s.fecha_inicio DESC
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Obtener a quién sigue un usuario
CREATE OR REPLACE FUNCTION obtener_siguiendo_ecommerce(
    p_usuario_id UUID DEFAULT NULL,
    p_limite INTEGER DEFAULT 50
)
RETURNS TABLE (
    seguido_id TEXT,
    seguido_tipo TEXT,
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    nombre TEXT
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
            WHEN 'tienda' THEN (SELECT nombre_tienda FROM tiendas WHERE id::TEXT = s.seguido_id LIMIT 1)
            ELSE 'Entidad'
        END as nombre
    FROM seguidores_ecommerce s
    WHERE s.seguidor_id = v_usuario_id
    AND s.activo = true
    ORDER BY s.fecha_inicio DESC
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== TRIGGERS =====

CREATE OR REPLACE FUNCTION trigger_actualizar_contadores_seguir()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'seguidores_ecommerce' THEN
        IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
            PERFORM actualizar_contador_seguidores(NEW.seguido_id, NEW.seguido_tipo, 'ecommerce');
        ELSIF TG_OP = 'DELETE' THEN
            PERFORM actualizar_contador_seguidores(OLD.seguido_id, OLD.seguido_tipo, 'ecommerce');
        END IF;
    ELSIF TG_TABLE_NAME = 'seguidores_comunidad' THEN
        IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
            PERFORM actualizar_contador_seguidores(NEW.seguido_id, NEW.seguido_tipo, 'comunidad');
        ELSIF TG_OP = 'DELETE' THEN
            PERFORM actualizar_contador_seguidores(OLD.seguido_id, OLD.seguido_tipo, 'comunidad');
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_actualizar_contadores_ecom ON seguidores_ecommerce;
CREATE TRIGGER trigger_actualizar_contadores_ecom
    AFTER INSERT OR UPDATE OR DELETE ON seguidores_ecommerce
    FOR EACH ROW
    EXECUTE FUNCTION trigger_actualizar_contadores_seguir();

DROP TRIGGER IF EXISTS trigger_actualizar_contadores_comu ON seguidores_comunidad;
CREATE TRIGGER trigger_actualizar_contadores_comu
    AFTER INSERT OR UPDATE OR DELETE ON seguidores_comunidad
    FOR EACH ROW
    EXECUTE FUNCTION trigger_actualizar_contadores_seguir();

-- ===== FUNCIONES PÚBLICAS (sin SECURITY DEFINER) =====

-- Top tiendas más seguidas (función en lugar de vista para evitar SECURITY DEFINER)
CREATE OR REPLACE FUNCTION obtener_top_tiendas_seguidas(p_limite INTEGER DEFAULT 10)
RETURNS TABLE (
    id TEXT,
    nombre_tienda TEXT,
    total_seguidores INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id::TEXT as id,
        t.nombre_tienda,
        COALESCE(c.total_seguidores, 0) as total_seguidores
    FROM tiendas t
    LEFT JOIN contadores_seguidores c ON c.entidad_id = t.id::TEXT 
        AND c.entidad_tipo = 'tienda' 
        AND c.ambito = 'ecommerce'
    WHERE t.activa = true
    ORDER BY COALESCE(c.total_seguidores, 0) DESC
    LIMIT p_limite;
END;
$$ LANGUAGE plpgsql STABLE;

-- ===== NOTAS DE USO =====
-- Para seguir: SELECT seguir_entidad_ecommerce('123', 'tienda');
-- Para dejar de seguir: SELECT dejar_de_seguir_entidad_ecommerce('123', 'tienda');
-- Para verificar: SELECT esta_siguiendo_ecommerce('123', 'tienda');
