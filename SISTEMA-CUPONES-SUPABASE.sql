-- ============================================
-- 🎟️ SISTEMA DE CUPONES Y DESCUENTOS
-- Tabla completa para manejo de cupones
-- ============================================

-- ===== TABLA DE CUPONES =====
CREATE TABLE IF NOT EXISTS cupones (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL, -- Código del cupón (ej: "VERANO2024")
    descripcion TEXT,
    
    -- Tipo de descuento
    tipo_descuento VARCHAR(20) NOT NULL CHECK (tipo_descuento IN ('porcentaje', 'monto_fijo')),
    valor_descuento DECIMAL(10,2) NOT NULL, -- Porcentaje (10-100) o monto fijo
    
    -- Límites
    monto_minimo DECIMAL(10,2) DEFAULT 0.00, -- Monto mínimo de compra para aplicar
    monto_maximo_descuento DECIMAL(10,2), -- Máximo descuento aplicable (solo para porcentaje)
    
    -- Usos
    uso_maximo INTEGER DEFAULT 1, -- Cantidad máxima de veces que se puede usar (total)
    uso_maximo_por_usuario INTEGER DEFAULT 1, -- Cantidad máxima por usuario
    usos_actuales INTEGER DEFAULT 0, -- Cantidad de veces usado
    
    -- Fechas
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    
    -- Restricciones
    solo_nuevos_usuarios BOOLEAN DEFAULT false, -- Solo para usuarios nuevos
    solo_productos_especificos BOOLEAN DEFAULT false, -- Solo para ciertos productos
    productos_aplicables JSONB DEFAULT '[]'::jsonb, -- IDs de productos aplicables
    tiendas_aplicables JSONB DEFAULT '[]'::jsonb, -- IDs de tiendas aplicables (vacío = todas)
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    
    -- Metadatos
    creado_por VARCHAR(100), -- Usuario/admin que creó el cupón
    notas TEXT, -- Notas internas
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA DE USOS DE CUPONES =====
CREATE TABLE IF NOT EXISTS cupon_usos (
    id BIGSERIAL PRIMARY KEY,
    cupon_id BIGINT REFERENCES cupones(id) ON DELETE CASCADE,
    comprador_id UUID REFERENCES compradores(id) ON DELETE SET NULL, -- CORREGIDO: UUID en lugar de BIGINT
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Para usuarios no registrados
    pedido_id BIGINT, -- Puede referenciar pedidos o compras
    tabla_pedido VARCHAR(50) DEFAULT 'pedidos', -- 'pedidos' o 'compras'
    monto_descuento DECIMAL(10,2) NOT NULL,
    monto_total_pedido DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ÍNDICES =====
CREATE INDEX IF NOT EXISTS idx_cupones_codigo ON cupones(codigo);
CREATE INDEX IF NOT EXISTS idx_cupones_activo ON cupones(activo);
CREATE INDEX IF NOT EXISTS idx_cupones_fechas ON cupones(fecha_inicio, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_cupon_usos_cupon ON cupon_usos(cupon_id);
CREATE INDEX IF NOT EXISTS idx_cupon_usos_comprador ON cupon_usos(comprador_id);
CREATE INDEX IF NOT EXISTS idx_cupon_usos_user ON cupon_usos(user_id);

-- ===== FUNCIÓN PARA VALIDAR CUPÓN =====
CREATE OR REPLACE FUNCTION validar_cupon(
    p_codigo VARCHAR(50),
    p_user_id UUID DEFAULT NULL,
    p_comprador_id UUID DEFAULT NULL, -- CORREGIDO: UUID en lugar de BIGINT
    p_monto_total DECIMAL(10,2) DEFAULT 0.00,
    p_productos_ids JSONB DEFAULT '[]'::jsonb
) RETURNS TABLE (
    valido BOOLEAN,
    mensaje TEXT,
    cupon_record cupones
) AS $$
DECLARE
    v_cupon cupones%ROWTYPE;
    v_usos_por_usuario INTEGER;
    v_descuento DECIMAL(10,2);
BEGIN
    -- Buscar cupón
    SELECT * INTO v_cupon 
    FROM cupones 
    WHERE codigo = UPPER(p_codigo) AND activo = true;
    
    -- Si no existe
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 'Cupón no encontrado o inactivo'::TEXT, NULL::cupones;
        RETURN;
    END IF;
    
    -- Verificar fechas
    IF v_cupon.fecha_inicio IS NOT NULL AND v_cupon.fecha_inicio > NOW() THEN
        RETURN QUERY SELECT false, 'El cupón aún no está disponible'::TEXT, v_cupon;
        RETURN;
    END IF;
    
    IF v_cupon.fecha_fin IS NOT NULL AND v_cupon.fecha_fin < NOW() THEN
        RETURN QUERY SELECT false, 'El cupón ha expirado'::TEXT, v_cupon;
        RETURN;
    END IF;
    
    -- Verificar usos totales
    IF v_cupon.usos_actuales >= v_cupon.uso_maximo THEN
        RETURN QUERY SELECT false, 'El cupón ha alcanzado su límite de usos'::TEXT, v_cupon;
        RETURN;
    END IF;
    
    -- Verificar monto mínimo
    IF p_monto_total < v_cupon.monto_minimo THEN
        RETURN QUERY SELECT false, 
            format('El monto mínimo para este cupón es $%s', v_cupon.monto_minimo)::TEXT, 
            v_cupon;
        RETURN;
    END IF;
    
    -- Verificar usos por usuario
    IF p_user_id IS NOT NULL THEN
        SELECT COUNT(*) INTO v_usos_por_usuario
        FROM cupon_usos
        WHERE cupon_id = v_cupon.id AND user_id = p_user_id;
        
        IF v_usos_por_usuario >= v_cupon.uso_maximo_por_usuario THEN
            RETURN QUERY SELECT false, 'Ya has usado este cupón el máximo de veces permitido'::TEXT, v_cupon;
            RETURN;
        END IF;
    END IF;
    
    IF p_comprador_id IS NOT NULL THEN
        SELECT COUNT(*) INTO v_usos_por_usuario
        FROM cupon_usos
        WHERE cupon_id = v_cupon.id AND comprador_id = p_comprador_id::UUID;
        
        IF v_usos_por_usuario >= v_cupon.uso_maximo_por_usuario THEN
            RETURN QUERY SELECT false, 'Ya has usado este cupón el máximo de veces permitido'::TEXT, v_cupon;
            RETURN;
        END IF;
    END IF;
    
    -- Calcular descuento
    IF v_cupon.tipo_descuento = 'porcentaje' THEN
        v_descuento := (p_monto_total * v_cupon.valor_descuento) / 100;
        IF v_cupon.monto_maximo_descuento IS NOT NULL AND v_descuento > v_cupon.monto_maximo_descuento THEN
            v_descuento := v_cupon.monto_maximo_descuento;
        END IF;
    ELSE
        v_descuento := LEAST(v_cupon.valor_descuento, p_monto_total);
    END IF;
    
    -- Todo válido
    RETURN QUERY SELECT true, format('Descuento: $%s', v_descuento)::TEXT, v_cupon;
END;
$$ LANGUAGE plpgsql;

-- ===== FUNCIÓN: Incrementar uso de cupón =====
CREATE OR REPLACE FUNCTION incrementar_uso_cupon(p_cupon_id BIGINT) RETURNS VOID AS $$
BEGIN
    UPDATE cupones 
    SET usos_actuales = usos_actuales + 1,
        updated_at = NOW()
    WHERE id = p_cupon_id;
END;
$$ LANGUAGE plpgsql;

-- ===== COMENTARIOS =====
COMMENT ON TABLE cupones IS 'Sistema de cupones y descuentos para la plataforma';
COMMENT ON TABLE cupon_usos IS 'Registro de usos de cupones por pedidos';
COMMENT ON FUNCTION validar_cupon IS 'Función para validar un cupón antes de aplicarlo a un pedido';
COMMENT ON FUNCTION incrementar_uso_cupon IS 'Incrementa el contador de usos de un cupón';
