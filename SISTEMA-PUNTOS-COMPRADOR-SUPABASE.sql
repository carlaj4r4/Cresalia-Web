-- ============================================
-- ⭐ SISTEMA DE PUNTOS Y RECOMPENSAS
-- Programa de fidelización para compradores
-- ============================================

-- ===== TABLA DE PUNTOS DE COMPRADORES =====
CREATE TABLE IF NOT EXISTS puntos_comprador (
    id BIGSERIAL PRIMARY KEY,
    comprador_id UUID REFERENCES compradores(id) ON DELETE CASCADE,
    puntos_totales INTEGER DEFAULT 0, -- Puntos acumulados totales
    puntos_disponibles INTEGER DEFAULT 0, -- Puntos disponibles para canjear
    puntos_canjeados INTEGER DEFAULT 0, -- Puntos canjeados históricamente
    nivel VARCHAR(50) DEFAULT 'Bronce', -- Bronce, Plata, Oro, Platino
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_puntos_comprador_id ON puntos_comprador(comprador_id);
CREATE INDEX IF NOT EXISTS idx_puntos_nivel ON puntos_comprador(nivel);

-- ===== TABLA DE HISTORIAL DE PUNTOS =====
CREATE TABLE IF NOT EXISTS puntos_historial (
    id BIGSERIAL PRIMARY KEY,
    comprador_id UUID REFERENCES compradores(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('ganado', 'canjeado', 'expirado', 'ajuste')),
    puntos INTEGER NOT NULL, -- Positivo para ganados, negativo para canjeados
    descripcion TEXT NOT NULL,
    referencia_id BIGINT, -- ID de compra, canje, etc.
    referencia_tipo VARCHAR(50), -- 'compra', 'canje', 'promocion', etc.
    fecha_expiracion DATE, -- Fecha de expiración (si aplica)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_puntos_historial_comprador ON puntos_historial(comprador_id);
CREATE INDEX IF NOT EXISTS idx_puntos_historial_tipo ON puntos_historial(tipo);
CREATE INDEX IF NOT EXISTS idx_puntos_historial_fecha ON puntos_historial(created_at DESC);

-- ===== TABLA DE CANJES DE PUNTOS =====
CREATE TABLE IF NOT EXISTS puntos_canjes (
    id BIGSERIAL PRIMARY KEY,
    comprador_id UUID REFERENCES compradores(id) ON DELETE CASCADE,
    puntos_usados INTEGER NOT NULL,
    descuento_obtenido DECIMAL(10,2) NOT NULL,
    codigo_canje VARCHAR(100) UNIQUE, -- Código único para el canje
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'usado', 'expirado', 'cancelado')),
    fecha_expiracion TIMESTAMP WITH TIME ZONE, -- Fecha de expiración del código
    pedido_id BIGINT, -- ID del pedido donde se usó (si se usó)
    tabla_pedido VARCHAR(50), -- 'pedidos' o 'compras'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    usado_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_canjes_comprador ON puntos_canjes(comprador_id);
CREATE INDEX IF NOT EXISTS idx_canjes_codigo ON puntos_canjes(codigo_canje);
CREATE INDEX IF NOT EXISTS idx_canjes_estado ON puntos_canjes(estado);

-- ===== FUNCIÓN: Agregar puntos por compra =====
CREATE OR REPLACE FUNCTION agregar_puntos_compra(
    p_comprador_id UUID,
    p_monto_compra DECIMAL(10,2),
    p_compra_id BIGINT,
    p_tabla_compra VARCHAR(50) DEFAULT 'compras'
) RETURNS INTEGER AS $$
DECLARE
    v_puntos_ganados INTEGER;
    v_tasa_puntos DECIMAL(5,2) := 1.0; -- 1 punto por cada $1 gastado (ajustable)
    v_puntos_actuales INTEGER;
    v_nuevo_nivel VARCHAR(50);
BEGIN
    -- Calcular puntos ganados (1 punto = $1, redondeado)
    v_puntos_ganados := FLOOR(p_monto_compra * v_tasa_puntos)::INTEGER;
    
    -- Insertar o actualizar registro de puntos
    INSERT INTO puntos_comprador (comprador_id, puntos_totales, puntos_disponibles)
    VALUES (p_comprador_id, v_puntos_ganados, v_puntos_ganados)
    ON CONFLICT (comprador_id) DO UPDATE
    SET puntos_totales = puntos_comprador.puntos_totales + v_puntos_ganados,
        puntos_disponibles = puntos_comprador.puntos_disponibles + v_puntos_ganados,
        updated_at = NOW()
    RETURNING puntos_disponibles INTO v_puntos_actuales;
    
    -- Calcular nuevo nivel
    v_nuevo_nivel := calcular_nivel_puntos(v_puntos_actuales);
    
    -- Actualizar nivel si cambió
    UPDATE puntos_comprador
    SET nivel = v_nuevo_nivel
    WHERE comprador_id = p_comprador_id;
    
    -- Registrar en historial
    INSERT INTO puntos_historial (
        comprador_id,
        tipo,
        puntos,
        descripcion,
        referencia_id,
        referencia_tipo
    ) VALUES (
        p_comprador_id,
        'ganado',
        v_puntos_ganados,
        format('Puntos ganados por compra de $%s', p_monto_compra),
        p_compra_id,
        p_tabla_compra
    );
    
    RETURN v_puntos_ganados;
END;
$$ LANGUAGE plpgsql;

-- ===== FUNCIÓN: Calcular nivel según puntos =====
CREATE OR REPLACE FUNCTION calcular_nivel_puntos(p_puntos INTEGER) RETURNS VARCHAR(50) AS $$
BEGIN
    IF p_puntos >= 10000 THEN
        RETURN 'Platino';
    ELSIF p_puntos >= 5000 THEN
        RETURN 'Oro';
    ELSIF p_puntos >= 1000 THEN
        RETURN 'Plata';
    ELSE
        RETURN 'Bronce';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ===== FUNCIÓN: Canjear puntos por descuento =====
CREATE OR REPLACE FUNCTION canjear_puntos_descuento(
    p_comprador_id UUID,
    p_puntos_a_canjear INTEGER
) RETURNS TABLE (
    exito BOOLEAN,
    mensaje TEXT,
    codigo_canje VARCHAR(100),
    descuento DECIMAL(10,2)
) AS $$
DECLARE
    v_puntos_disponibles INTEGER;
    v_descuento DECIMAL(10,2);
    v_codigo VARCHAR(100);
    v_tasa_canje DECIMAL(5,2) := 0.10; -- 100 puntos = $10 de descuento (10%)
BEGIN
    -- Verificar puntos disponibles
    SELECT puntos_disponibles INTO v_puntos_disponibles
    FROM puntos_comprador
    WHERE comprador_id = p_comprador_id;
    
    IF v_puntos_disponibles IS NULL THEN
        RETURN QUERY SELECT false, 'Comprador no encontrado'::TEXT, NULL::VARCHAR, 0::DECIMAL;
        RETURN;
    END IF;
    
    IF v_puntos_disponibles < p_puntos_a_canjear THEN
        RETURN QUERY SELECT false, 
            format('No tenés suficientes puntos. Disponibles: %s', v_puntos_disponibles)::TEXT,
            NULL::VARCHAR, 0::DECIMAL;
        RETURN;
    END IF;
    
    -- Validar mínimo (100 puntos mínimo)
    IF p_puntos_a_canjear < 100 THEN
        RETURN QUERY SELECT false, 'Mínimo 100 puntos para canjear'::TEXT, NULL::VARCHAR, 0::DECIMAL;
        RETURN;
    END IF;
    
    -- Calcular descuento (100 puntos = $10)
    v_descuento := (p_puntos_a_canjear * v_tasa_canje);
    
    -- Generar código único
    v_codigo := 'PUNTOS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 8));
    
    -- Crear registro de canje
    INSERT INTO puntos_canjes (
        comprador_id,
        puntos_usados,
        descuento_obtenido,
        codigo_canje,
        fecha_expiracion
    ) VALUES (
        p_comprador_id,
        p_puntos_a_canjear,
        v_descuento,
        v_codigo,
        NOW() + INTERVAL '30 days' -- Expira en 30 días
    );
    
    -- Actualizar puntos del comprador
    UPDATE puntos_comprador
    SET puntos_disponibles = puntos_disponibles - p_puntos_a_canjear,
        puntos_canjeados = puntos_canjeados + p_puntos_a_canjear,
        updated_at = NOW()
    WHERE comprador_id = p_comprador_id;
    
    -- Registrar en historial
    INSERT INTO puntos_historial (
        comprador_id,
        tipo,
        puntos,
        descripcion,
        referencia_tipo
    ) VALUES (
        p_comprador_id,
        'canjeado',
        -p_puntos_a_canjear,
        format('Canje de %s puntos por $%s de descuento', p_puntos_a_canjear, v_descuento),
        'canje'
    );
    
    RETURN QUERY SELECT true, 
        format('Canje exitoso: $%s de descuento', v_descuento)::TEXT,
        v_codigo,
        v_descuento;
END;
$$ LANGUAGE plpgsql;

-- ===== FUNCIÓN: Obtener puntos del comprador =====
CREATE OR REPLACE FUNCTION obtener_puntos_comprador(p_comprador_id UUID)
RETURNS TABLE (
    puntos_totales INTEGER,
    puntos_disponibles INTEGER,
    puntos_canjeados INTEGER,
    nivel VARCHAR(50),
    proximo_nivel VARCHAR(50),
    puntos_para_proximo_nivel INTEGER
) AS $$
DECLARE
    v_puntos_disponibles INTEGER;
    v_nivel VARCHAR(50);
BEGIN
    SELECT puntos_totales, puntos_disponibles, puntos_canjeados, nivel
    INTO v_puntos_disponibles, v_puntos_disponibles, v_puntos_disponibles, v_nivel
    FROM puntos_comprador
    WHERE comprador_id = p_comprador_id;
    
    IF v_puntos_disponibles IS NULL THEN
        -- Crear registro inicial
        INSERT INTO puntos_comprador (comprador_id)
        VALUES (p_comprador_id)
        ON CONFLICT (comprador_id) DO NOTHING;
        
        RETURN QUERY SELECT 0, 0, 0, 'Bronce'::VARCHAR, 'Plata'::VARCHAR, 1000;
        RETURN;
    END IF;
    
    -- Calcular próximo nivel
    DECLARE
        v_proximo_nivel VARCHAR(50);
        v_puntos_para_proximo INTEGER;
    BEGIN
        IF v_nivel = 'Bronce' THEN
            v_proximo_nivel := 'Plata';
            v_puntos_para_proximo := GREATEST(0, 1000 - v_puntos_disponibles);
        ELSIF v_nivel = 'Plata' THEN
            v_proximo_nivel := 'Oro';
            v_puntos_para_proximo := GREATEST(0, 5000 - v_puntos_disponibles);
        ELSIF v_nivel = 'Oro' THEN
            v_proximo_nivel := 'Platino';
            v_puntos_para_proximo := GREATEST(0, 10000 - v_puntos_disponibles);
        ELSE
            v_proximo_nivel := 'Máximo';
            v_puntos_para_proximo := 0;
        END IF;
        
        RETURN QUERY SELECT 
            puntos_comprador.puntos_totales,
            puntos_comprador.puntos_disponibles,
            puntos_comprador.puntos_canjeados,
            puntos_comprador.nivel,
            v_proximo_nivel,
            v_puntos_para_proximo
        FROM puntos_comprador
        WHERE comprador_id = p_comprador_id;
    END;
END;
$$ LANGUAGE plpgsql;

-- ===== COMENTARIOS =====
COMMENT ON TABLE puntos_comprador IS 'Sistema de puntos y recompensas para compradores';
COMMENT ON TABLE puntos_historial IS 'Historial completo de ganancia y canje de puntos';
COMMENT ON TABLE puntos_canjes IS 'Registro de canjes de puntos por descuentos';
COMMENT ON FUNCTION agregar_puntos_compra IS 'Agrega puntos cuando un comprador realiza una compra';
COMMENT ON FUNCTION canjear_puntos_descuento IS 'Canjea puntos por un código de descuento';
COMMENT ON FUNCTION obtener_puntos_comprador IS 'Obtiene información de puntos del comprador';
