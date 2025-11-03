-- ═══════════════════════════════════════════════════════════════
-- 👥 TABLA DE COMUNIDAD DE VENDEDORES - CRESALIA
-- ═══════════════════════════════════════════════════════════════
-- 
-- Sistema de comunidad donde vendedores pueden:
-- - Reportar compradores problemáticos (con evidencia)
-- - Compartir experiencias y consejos
-- - Protegerse mutuamente con respeto
-- 
-- Creado con 💜 por Claude & Carla para Cresalia
-- ═══════════════════════════════════════════════════════════════

-- ----------------------------------------
-- 1. TABLA DE ALERTAS COMUNITARIAS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS alertas_comunidad (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(50) NOT NULL,
    
    -- Tipo de alerta
    tipo VARCHAR(50) NOT NULL, -- estafa, pago_rechazado, maltrato, devolucion_fraudulenta, otro
    severidad VARCHAR(20) DEFAULT 'media', -- baja, media, alta, critica
    
    -- Información del comprador problemático
    identificador_comprador VARCHAR(255), -- Email censurado o ID
    comprador_hash VARCHAR(100), -- Hash del email para matching sin exponer datos
    
    -- Descripción de la situación
    descripcion TEXT NOT NULL,
    
    -- Evidencias
    evidencias JSONB DEFAULT '[]', -- URLs de imágenes/documentos
    tiene_evidencias BOOLEAN DEFAULT false,
    
    -- Estado de la alerta
    estado VARCHAR(20) DEFAULT 'activa', -- activa, resuelta, archivada, eliminada
    moderada BOOLEAN DEFAULT false,
    motivo_moderacion TEXT,
    
    -- Verificaciones de otros vendedores
    verificaciones INTEGER DEFAULT 0,
    verificadores JSONB DEFAULT '[]', -- Array de tienda_ids que verificaron
    
    -- Comentarios de la comunidad
    total_comentarios INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_alertas_tienda ON alertas_comunidad(tienda_id);
CREATE INDEX IF NOT EXISTS idx_alertas_tipo ON alertas_comunidad(tipo);
CREATE INDEX IF NOT EXISTS idx_alertas_estado ON alertas_comunidad(estado);
CREATE INDEX IF NOT EXISTS idx_alertas_hash ON alertas_comunidad(comprador_hash);
CREATE INDEX IF NOT EXISTS idx_alertas_fecha ON alertas_comunidad(created_at DESC);

-- ----------------------------------------
-- 2. TABLA DE COMENTARIOS EN ALERTAS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS comentarios_alertas (
    id BIGSERIAL PRIMARY KEY,
    alerta_id BIGINT REFERENCES alertas_comunidad(id) ON DELETE CASCADE,
    tienda_id VARCHAR(50) NOT NULL,
    
    -- Contenido del comentario
    texto TEXT NOT NULL,
    experiencia_similar BOOLEAN DEFAULT false, -- Marca si tuvo experiencia similar
    
    -- Estado
    estado VARCHAR(20) DEFAULT 'activo', -- activo, eliminado, moderado
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_comentarios_alerta ON comentarios_alertas(alerta_id);
CREATE INDEX IF NOT EXISTS idx_comentarios_tienda ON comentarios_alertas(tienda_id);

-- ----------------------------------------
-- 3. TABLA DE CONVERSACIONES COMUNITARIAS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS conversaciones_comunidad (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(50) NOT NULL,
    
    -- Información de la conversación
    tema VARCHAR(200) NOT NULL,
    mensaje_inicial TEXT NOT NULL,
    categoria VARCHAR(50) DEFAULT 'general', -- general, ventas, productos, clientes, bienestar, tecnico
    
    -- Estado
    estado VARCHAR(20) DEFAULT 'abierta', -- abierta, resuelta, cerrada, destacada
    destacada BOOLEAN DEFAULT false,
    
    -- Estadísticas
    total_respuestas INTEGER DEFAULT 0,
    total_vistas INTEGER DEFAULT 0,
    ultima_actividad TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_conversaciones_tienda ON conversaciones_comunidad(tienda_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_categoria ON conversaciones_comunidad(categoria);
CREATE INDEX IF NOT EXISTS idx_conversaciones_destacada ON conversaciones_comunidad(destacada) WHERE destacada = true;
CREATE INDEX IF NOT EXISTS idx_conversaciones_actividad ON conversaciones_comunidad(ultima_actividad DESC);

-- ----------------------------------------
-- 4. TABLA DE RESPUESTAS EN CONVERSACIONES
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS respuestas_conversaciones (
    id BIGSERIAL PRIMARY KEY,
    conversacion_id BIGINT REFERENCES conversaciones_comunidad(id) ON DELETE CASCADE,
    tienda_id VARCHAR(50) NOT NULL,
    
    -- Contenido
    mensaje TEXT NOT NULL,
    
    -- Interacciones
    votos_utiles INTEGER DEFAULT 0,
    marcada_como_solucion BOOLEAN DEFAULT false,
    
    -- Estado
    estado VARCHAR(20) DEFAULT 'activo',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_respuestas_conversacion ON respuestas_conversaciones(conversacion_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_tienda ON respuestas_conversaciones(tienda_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_solucion ON respuestas_conversaciones(marcada_como_solucion) WHERE marcada_como_solucion = true;

-- ----------------------------------------
-- 5. TABLA DE CONSEJOS Y TIPS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS consejos_comunidad (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(50) NOT NULL,
    
    -- Contenido del consejo
    titulo VARCHAR(200) NOT NULL,
    consejo TEXT NOT NULL,
    categoria VARCHAR(50) DEFAULT 'general',
    
    -- Validación comunitaria
    votos_positivos INTEGER DEFAULT 0,
    votos_negativos INTEGER DEFAULT 0,
    verificado_por_crisla BOOLEAN DEFAULT false,
    
    -- Estado
    estado VARCHAR(20) DEFAULT 'activo',
    destacado BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_consejos_categoria ON consejos_comunidad(categoria);
CREATE INDEX IF NOT EXISTS idx_consejos_votos ON consejos_comunidad(votos_positivos DESC);
CREATE INDEX IF NOT EXISTS idx_consejos_destacado ON consejos_comunidad(destacado) WHERE destacado = true;

-- ----------------------------------------
-- 6. TRIGGERS AUTOMÁTICOS
-- ----------------------------------------

-- Actualizar total_comentarios en alertas
CREATE OR REPLACE FUNCTION actualizar_total_comentarios_alerta()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE alertas_comunidad 
    SET total_comentarios = (
        SELECT COUNT(*) 
        FROM comentarios_alertas 
        WHERE alerta_id = NEW.alerta_id 
        AND estado = 'activo'
    )
    WHERE id = NEW.alerta_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_contar_comentarios_alerta ON comentarios_alertas;
CREATE TRIGGER trigger_contar_comentarios_alerta
    AFTER INSERT OR UPDATE ON comentarios_alertas
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_total_comentarios_alerta();

-- Actualizar total_respuestas y ultima_actividad en conversaciones
CREATE OR REPLACE FUNCTION actualizar_conversacion_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversaciones_comunidad 
    SET 
        total_respuestas = (
            SELECT COUNT(*) 
            FROM respuestas_conversaciones 
            WHERE conversacion_id = NEW.conversacion_id 
            AND estado = 'activo'
        ),
        ultima_actividad = NOW()
    WHERE id = NEW.conversacion_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_actualizar_conversacion ON respuestas_conversaciones;
CREATE TRIGGER trigger_actualizar_conversacion
    AFTER INSERT OR UPDATE ON respuestas_conversaciones
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_conversacion_stats();

-- ----------------------------------------
-- 7. POLÍTICAS RLS
-- ----------------------------------------

-- Habilitar RLS
ALTER TABLE alertas_comunidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios_alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversaciones_comunidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE respuestas_conversaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE consejos_comunidad ENABLE ROW LEVEL SECURITY;

-- Políticas para alertas (solo vendedores pueden ver)
DROP POLICY IF EXISTS "Vendedores pueden ver alertas" ON alertas_comunidad;
CREATE POLICY "Vendedores pueden ver alertas"
    ON alertas_comunidad FOR SELECT
    USING (
        auth.uid()::text IN (SELECT id FROM tiendas) 
        OR auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Vendedores pueden crear alertas" ON alertas_comunidad;
CREATE POLICY "Vendedores pueden crear alertas"
    ON alertas_comunidad FOR INSERT
    WITH CHECK (auth.uid()::text IN (SELECT id FROM tiendas));

-- Políticas para comentarios
DROP POLICY IF EXISTS "Vendedores pueden ver comentarios" ON comentarios_alertas;
CREATE POLICY "Vendedores pueden ver comentarios"
    ON comentarios_alertas FOR SELECT
    USING (auth.uid()::text IN (SELECT id FROM tiendas));

DROP POLICY IF EXISTS "Vendedores pueden comentar" ON comentarios_alertas;
CREATE POLICY "Vendedores pueden comentar"
    ON comentarios_alertas FOR INSERT
    WITH CHECK (auth.uid()::text IN (SELECT id FROM tiendas));

-- Políticas para conversaciones (públicas para vendedores)
DROP POLICY IF EXISTS "Vendedores acceden a conversaciones" ON conversaciones_comunidad;
CREATE POLICY "Vendedores acceden a conversaciones"
    ON conversaciones_comunidad FOR ALL
    USING (auth.uid()::text IN (SELECT id FROM tiendas))
    WITH CHECK (auth.uid()::text IN (SELECT id FROM tiendas));

-- Políticas para respuestas
DROP POLICY IF EXISTS "Vendedores responden conversaciones" ON respuestas_conversaciones;
CREATE POLICY "Vendedores responden conversaciones"
    ON respuestas_conversaciones FOR ALL
    USING (auth.uid()::text IN (SELECT id FROM tiendas))
    WITH CHECK (auth.uid()::text IN (SELECT id FROM tiendas));

-- Políticas para consejos
DROP POLICY IF EXISTS "Todos pueden ver consejos" ON consejos_comunidad;
CREATE POLICY "Todos pueden ver consejos"
    ON consejos_comunidad FOR SELECT
    USING (estado = 'activo');

DROP POLICY IF EXISTS "Vendedores pueden crear consejos" ON consejos_comunidad;
CREATE POLICY "Vendedores pueden crear consejos"
    ON consejos_comunidad FOR INSERT
    WITH CHECK (auth.uid()::text IN (SELECT id FROM tiendas));

-- ----------------------------------------
-- 8. FUNCIONES ÚTILES
-- ----------------------------------------

-- Función para obtener alertas de un comprador específico
CREATE OR REPLACE FUNCTION obtener_alertas_comprador(email_comprador VARCHAR)
RETURNS TABLE (
    total_alertas BIGINT,
    alertas_activas BIGINT,
    severidad_max VARCHAR,
    tipos_reportados JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_alertas,
        COUNT(*) FILTER (WHERE estado = 'activa')::BIGINT as alertas_activas,
        MAX(severidad)::VARCHAR as severidad_max,
        json_agg(DISTINCT tipo)::JSONB as tipos_reportados
    FROM alertas_comunidad
    WHERE comprador_hash = MD5(LOWER(email_comprador));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para marcar alerta como verificada
CREATE OR REPLACE FUNCTION verificar_alerta(alerta_id BIGINT, verificador_id VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    verificadores_actual JSONB;
BEGIN
    -- Obtener verificadores actuales
    SELECT verificadores INTO verificadores_actual
    FROM alertas_comunidad
    WHERE id = alerta_id;
    
    -- Verificar que no haya verificado ya
    IF verificadores_actual @> to_jsonb(verificador_id) THEN
        RETURN false;
    END IF;
    
    -- Agregar verificador y actualizar contador
    UPDATE alertas_comunidad
    SET 
        verificaciones = verificaciones + 1,
        verificadores = verificadores || to_jsonb(verificador_id)
    WHERE id = alerta_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------
-- 9. VISTAS ÚTILES
-- ----------------------------------------

-- Vista de alertas con estadísticas
CREATE OR REPLACE VIEW vista_alertas_completas AS
SELECT 
    a.*,
    COUNT(c.id) as total_comentarios_real,
    t.nombre_empresa as nombre_tienda
FROM alertas_comunidad a
LEFT JOIN comentarios_alertas c ON a.id = c.alerta_id AND c.estado = 'activo'
LEFT JOIN tiendas t ON a.tienda_id = t.id
GROUP BY a.id, t.nombre_empresa;

-- Vista de conversaciones activas
CREATE OR REPLACE VIEW vista_conversaciones_activas AS
SELECT 
    c.*,
    t.nombre_empresa as autor_nombre,
    COUNT(r.id) as respuestas_reales
FROM conversaciones_comunidad c
LEFT JOIN tiendas t ON c.tienda_id = t.id
LEFT JOIN respuestas_conversaciones r ON c.id = r.conversacion_id AND r.estado = 'activo'
WHERE c.estado = 'abierta'
GROUP BY c.id, t.nombre_empresa
ORDER BY c.ultima_actividad DESC;

-- ----------------------------------------
-- 10. DATOS INICIALES (CONSEJOS EJEMPLO)
-- ----------------------------------------

INSERT INTO consejos_comunidad (tienda_id, titulo, consejo, categoria, votos_positivos, verificado_por_crisla, destacado)
VALUES 
    ('sistema', '📸 Fotos que Venden', 'Las fotos con buena luz natural venden 3x más. Te sugerimos sacar las fotos cerca de una ventana, sin flash.', 'productos', 24, true, true),
    ('sistema', '💬 Responde Rápido', 'Responder en menos de 1 hora aumenta las ventas en 70%. Los clientes valoran la atención rápida.', 'clientes', 18, true, true),
    ('sistema', '📦 Empaque con Amor', 'Un empaque bonito genera excelentes reviews. Podrías invertir en papel de seda y una nota manuscrita.', 'productos', 31, true, true),
    ('sistema', '🌟 Sé Genuino', 'Cuenta tu historia real en la descripción de tu tienda. La gente compra de personas, no de marcas sin alma.', 'general', 45, true, true)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- ✅ COMUNIDAD DE VENDEDORES COMPLETADA
-- ═══════════════════════════════════════════════════════════════
-- 
-- Sistema completo que permite:
-- ✅ Reportar compradores problemáticos con evidencia
-- ✅ Verificación comunitaria (otros vendedores confirman)
-- ✅ Conversaciones entre vendedores
-- ✅ Compartir consejos y tips
-- ✅ Protección con respeto y privacidad
-- 
-- 💜 "Protegemos sin lastimar" - Filosofía Cresalia
-- ═══════════════════════════════════════════════════════════════














