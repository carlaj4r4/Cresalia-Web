-- ============================================
-- 📊 SISTEMA DE MÉTRICAS AVANZADAS PARA COMPRADORES
-- Categorías más compradas, gastadas y vistas
-- ============================================

-- ===== TABLA DE VISTAS DE CATEGORÍAS =====
CREATE TABLE IF NOT EXISTS vistas_categorias_comprador (
    id BIGSERIAL PRIMARY KEY,
    comprador_id UUID REFERENCES compradores(id) ON DELETE CASCADE,
    categoria VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('producto', 'servicio')),
    fecha_vista TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_vistas_cat_comprador ON vistas_categorias_comprador(comprador_id);
CREATE INDEX IF NOT EXISTS idx_vistas_cat_categoria ON vistas_categorias_comprador(categoria);
CREATE INDEX IF NOT EXISTS idx_vistas_cat_fecha ON vistas_categorias_comprador(fecha_vista DESC);

-- ===== TABLA DE MÉTRICAS AGREGADAS DE COMPRADOR =====
CREATE TABLE IF NOT EXISTS metricas_comprador (
    id BIGSERIAL PRIMARY KEY,
    comprador_id UUID UNIQUE REFERENCES compradores(id) ON DELETE CASCADE,
    
    -- Métricas generales
    total_compras INTEGER DEFAULT 0,
    total_gastado DECIMAL(10,2) DEFAULT 0.00,
    promedio_compra DECIMAL(10,2) DEFAULT 0.00,
    total_productos_comprados INTEGER DEFAULT 0,
    total_servicios_contratados INTEGER DEFAULT 0,
    
    -- Categorías más compradas (JSONB)
    categorias_mas_compradas JSONB DEFAULT '[]'::jsonb,
    
    -- Categorías más gastadas (JSONB)
    categorias_mas_gastadas JSONB DEFAULT '[]'::jsonb,
    
    -- Categorías más vistas (JSONB)
    categorias_mas_vistas JSONB DEFAULT '[]'::jsonb,
    
    -- Última actualización
    ultima_compra TIMESTAMP WITH TIME ZONE,
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_metricas_comprador_id ON metricas_comprador(comprador_id);
CREATE INDEX IF NOT EXISTS idx_metricas_ultima_compra ON metricas_comprador(ultima_compra DESC);

-- ===== FUNCIÓN: Registrar vista de categoría =====
CREATE OR REPLACE FUNCTION registrar_vista_categoria(
    p_comprador_id UUID,
    p_categoria VARCHAR(100),
    p_tipo VARCHAR(20) DEFAULT 'producto'
) RETURNS VOID AS $$
BEGIN
    INSERT INTO vistas_categorias_comprador (
        comprador_id,
        categoria,
        tipo
    ) VALUES (
        p_comprador_id,
        p_categoria,
        p_tipo
    );
    
    -- Actualizar métricas agregadas
    PERFORM actualizar_metricas_comprador(p_comprador_id);
END;
$$ LANGUAGE plpgsql;

-- ===== FUNCIÓN: Actualizar métricas del comprador =====
CREATE OR REPLACE FUNCTION actualizar_metricas_comprador(p_comprador_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total_compras INTEGER;
    v_total_gastado DECIMAL(10,2);
    v_promedio_compra DECIMAL(10,2);
    v_total_productos INTEGER;
    v_total_servicios INTEGER;
    v_ultima_compra TIMESTAMP WITH TIME ZONE;
    
    -- Categorías más compradas
    v_cat_compradas JSONB;
    
    -- Categorías más gastadas
    v_cat_gastadas JSONB;
    
    -- Categorías más vistas
    v_cat_vistas JSONB;
BEGIN
    -- Calcular métricas generales desde tabla compras
    SELECT 
        COUNT(*),
        COALESCE(SUM(total), 0),
        COALESCE(AVG(total), 0),
        COUNT(CASE WHEN tipo = 'producto' THEN 1 END),
        COUNT(CASE WHEN tipo = 'servicio' THEN 1 END),
        MAX(created_at)
    INTO 
        v_total_compras,
        v_total_gastado,
        v_promedio_compra,
        v_total_productos,
        v_total_servicios,
        v_ultima_compra
    FROM compras
    WHERE comprador_id = p_comprador_id
    AND estado IN ('confirmada', 'entregada');
    
    -- Calcular categorías más compradas (por cantidad)
    SELECT jsonb_agg(
        jsonb_build_object(
            'categoria', categoria,
            'cantidad', cantidad,
            'tipo', tipo
        ) ORDER BY cantidad DESC
    )
    INTO v_cat_compradas
    FROM (
        SELECT 
            COALESCE(p.categoria, s.categoria) as categoria,
            COUNT(*) as cantidad,
            COALESCE(p.categoria, s.categoria, 'Sin categoría') as tipo
        FROM compras c
        LEFT JOIN productos p ON c.producto_id = p.id AND c.tipo = 'producto'
        LEFT JOIN servicios s ON c.servicio_id = s.id AND c.tipo = 'servicio'
        WHERE c.comprador_id = p_comprador_id
        AND c.estado IN ('confirmada', 'entregada')
        AND COALESCE(p.categoria, s.categoria) IS NOT NULL
        GROUP BY COALESCE(p.categoria, s.categoria)
        ORDER BY cantidad DESC
        LIMIT 10
    ) subquery;
    
    -- Calcular categorías más gastadas (por monto)
    SELECT jsonb_agg(
        jsonb_build_object(
            'categoria', categoria,
            'monto', monto,
            'tipo', tipo
        ) ORDER BY monto DESC
    )
    INTO v_cat_gastadas
    FROM (
        SELECT 
            COALESCE(p.categoria, s.categoria) as categoria,
            SUM(c.total) as monto,
            COALESCE(p.categoria, s.categoria, 'Sin categoría') as tipo
        FROM compras c
        LEFT JOIN productos p ON c.producto_id = p.id AND c.tipo = 'producto'
        LEFT JOIN servicios s ON c.servicio_id = s.id AND c.tipo = 'servicio'
        WHERE c.comprador_id = p_comprador_id
        AND c.estado IN ('confirmada', 'entregada')
        AND COALESCE(p.categoria, s.categoria) IS NOT NULL
        GROUP BY COALESCE(p.categoria, s.categoria)
        ORDER BY monto DESC
        LIMIT 10
    ) subquery;
    
    -- Calcular categorías más vistas
    SELECT jsonb_agg(
        jsonb_build_object(
            'categoria', categoria,
            'vistas', vistas,
            'tipo', tipo
        ) ORDER BY vistas DESC
    )
    INTO v_cat_vistas
    FROM (
        SELECT 
            categoria,
            COUNT(*) as vistas,
            tipo
        FROM vistas_categorias_comprador
        WHERE comprador_id = p_comprador_id
        GROUP BY categoria, tipo
        ORDER BY vistas DESC
        LIMIT 10
    ) subquery;
    
    -- Insertar o actualizar métricas
    INSERT INTO metricas_comprador (
        comprador_id,
        total_compras,
        total_gastado,
        promedio_compra,
        total_productos_comprados,
        total_servicios_contratados,
        categorias_mas_compradas,
        categorias_mas_gastadas,
        categorias_mas_vistas,
        ultima_compra,
        ultima_actualizacion
    ) VALUES (
        p_comprador_id,
        COALESCE(v_total_compras, 0),
        COALESCE(v_total_gastado, 0),
        COALESCE(v_promedio_compra, 0),
        COALESCE(v_total_productos, 0),
        COALESCE(v_total_servicios, 0),
        COALESCE(v_cat_compradas, '[]'::jsonb),
        COALESCE(v_cat_gastadas, '[]'::jsonb),
        COALESCE(v_cat_vistas, '[]'::jsonb),
        v_ultima_compra,
        NOW()
    )
    ON CONFLICT (comprador_id) DO UPDATE
    SET 
        total_compras = EXCLUDED.total_compras,
        total_gastado = EXCLUDED.total_gastado,
        promedio_compra = EXCLUDED.promedio_compra,
        total_productos_comprados = EXCLUDED.total_productos_comprados,
        total_servicios_contratados = EXCLUDED.total_servicios_contratados,
        categorias_mas_compradas = EXCLUDED.categorias_mas_compradas,
        categorias_mas_gastadas = EXCLUDED.categorias_mas_gastadas,
        categorias_mas_vistas = EXCLUDED.categorias_mas_vistas,
        ultima_compra = EXCLUDED.ultima_compra,
        ultima_actualizacion = NOW();
END;
$$ LANGUAGE plpgsql;

-- ===== FUNCIÓN: Obtener métricas del comprador =====
CREATE OR REPLACE FUNCTION obtener_metricas_comprador(p_comprador_id UUID)
RETURNS TABLE (
    total_compras INTEGER,
    total_gastado DECIMAL(10,2),
    promedio_compra DECIMAL(10,2),
    total_productos_comprados INTEGER,
    total_servicios_contratados INTEGER,
    categorias_mas_compradas JSONB,
    categorias_mas_gastadas JSONB,
    categorias_mas_vistas JSONB,
    ultima_compra TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Si no existen métricas, calcularlas
    IF NOT EXISTS (SELECT 1 FROM metricas_comprador WHERE comprador_id = p_comprador_id) THEN
        PERFORM actualizar_metricas_comprador(p_comprador_id);
    END IF;
    
    RETURN QUERY
    SELECT 
        m.total_compras,
        m.total_gastado,
        m.promedio_compra,
        m.total_productos_comprados,
        m.total_servicios_contratados,
        m.categorias_mas_compradas,
        m.categorias_mas_gastadas,
        m.categorias_mas_vistas,
        m.ultima_compra
    FROM metricas_comprador m
    WHERE m.comprador_id = p_comprador_id;
END;
$$ LANGUAGE plpgsql;

-- ===== TRIGGER: Actualizar métricas después de compra =====
CREATE OR REPLACE FUNCTION trigger_actualizar_metricas_compra()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar métricas cuando se confirma o entrega una compra
    IF NEW.estado IN ('confirmada', 'entregada') AND 
       (OLD.estado IS NULL OR OLD.estado NOT IN ('confirmada', 'entregada')) THEN
        PERFORM actualizar_metricas_comprador(NEW.comprador_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger (si la tabla compras existe)
-- DROP TRIGGER IF EXISTS trigger_metricas_compra ON compras;
-- CREATE TRIGGER trigger_metricas_compra
--     AFTER INSERT OR UPDATE OF estado ON compras
--     FOR EACH ROW
--     EXECUTE FUNCTION trigger_actualizar_metricas_compra();

-- ===== COMENTARIOS =====
COMMENT ON TABLE vistas_categorias_comprador IS 'Registro de vistas de categorías por comprador';
COMMENT ON TABLE metricas_comprador IS 'Métricas agregadas de compras y comportamiento del comprador';
COMMENT ON FUNCTION registrar_vista_categoria IS 'Registra una vista de categoría y actualiza métricas';
COMMENT ON FUNCTION actualizar_metricas_comprador IS 'Calcula y actualiza todas las métricas del comprador';
COMMENT ON FUNCTION obtener_metricas_comprador IS 'Obtiene las métricas del comprador (las calcula si no existen)';
