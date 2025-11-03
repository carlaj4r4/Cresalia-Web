-- ═══════════════════════════════════════════════════════════════
-- 👥 TABLA DE CLIENTES COMPRADORES - CRESALIA
-- ═══════════════════════════════════════════════════════════════
-- 
-- Tabla para gestionar los clientes/compradores del sistema
-- Ejecutar en Supabase junto con supabase-actualizacion-auditorias.sql
-- 
-- Creado con 💜 por Claude & Carla para Cresalia
-- ═══════════════════════════════════════════════════════════════

-- ----------------------------------------
-- TABLA PRINCIPAL DE CLIENTES/COMPRADORES
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS compradores (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Información personal
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    
    -- Ubicación
    pais VARCHAR(50) DEFAULT 'Argentina',
    provincia VARCHAR(50),
    ciudad VARCHAR(100),
    codigo_postal VARCHAR(10),
    direccion TEXT,
    
    -- Preferencias
    recibir_promociones BOOLEAN DEFAULT true,
    recibir_newsletters BOOLEAN DEFAULT true,
    idioma_preferido VARCHAR(5) DEFAULT 'es',
    moneda_preferida VARCHAR(3) DEFAULT 'ARS',
    
    -- Información de compras
    total_compras INTEGER DEFAULT 0,
    monto_total_gastado DECIMAL(10,2) DEFAULT 0.00,
    fecha_primera_compra TIMESTAMP WITH TIME ZONE,
    fecha_ultima_compra TIMESTAMP WITH TIME ZONE,
    
    -- Estado del cliente
    estado VARCHAR(20) DEFAULT 'activo', -- activo, suspendido, inactivo
    verificado BOOLEAN DEFAULT false,
    fecha_verificacion TIMESTAMP WITH TIME ZONE,
    
    -- Metadatos
    origen_registro VARCHAR(50) DEFAULT 'web', -- web, mobile, social
    referido_por VARCHAR(100), -- tienda que lo refirió
    notas_internas TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_compradores_email ON compradores(email);
CREATE INDEX IF NOT EXISTS idx_compradores_user_id ON compradores(user_id);
CREATE INDEX IF NOT EXISTS idx_compradores_estado ON compradores(estado);
CREATE INDEX IF NOT EXISTS idx_compradores_verificado ON compradores(verificado);
CREATE INDEX IF NOT EXISTS idx_compradores_ciudad ON compradores(ciudad, provincia);

-- ----------------------------------------
-- TABLA DE DIRECCIONES MÚLTIPLES
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS direcciones_compradores (
    id BIGSERIAL PRIMARY KEY,
    comprador_id BIGINT REFERENCES compradores(id) ON DELETE CASCADE,
    
    -- Información de la dirección
    alias VARCHAR(50) NOT NULL, -- "Casa", "Trabajo", "Casa de mamá", etc.
    nombre_destinatario VARCHAR(100),
    telefono_contacto VARCHAR(20),
    
    -- Ubicación detallada
    pais VARCHAR(50) NOT NULL,
    provincia VARCHAR(50) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10),
    direccion_completa TEXT NOT NULL,
    referencias TEXT, -- "Portón verde", "Entre X y Y", etc.
    
    -- Configuración
    es_principal BOOLEAN DEFAULT false,
    activa BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_direcciones_comprador ON direcciones_compradores(comprador_id);
CREATE INDEX IF NOT EXISTS idx_direcciones_principal ON direcciones_compradores(comprador_id, es_principal);

-- ----------------------------------------
-- TABLA DE FAVORITOS/WISHLIST
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS favoritos_compradores (
    id BIGSERIAL PRIMARY KEY,
    comprador_id BIGINT REFERENCES compradores(id) ON DELETE CASCADE,
    tienda_id VARCHAR(50) NOT NULL,
    producto_id VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'producto', -- producto, servicio, tienda
    
    -- Metadatos
    notas_personales TEXT,
    notificar_cambios BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_favoritos_comprador ON favoritos_compradores(comprador_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_tienda_producto ON favoritos_compradores(tienda_id, producto_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_favoritos_unique ON favoritos_compradores(comprador_id, tienda_id, producto_id);

-- ----------------------------------------
-- TABLA DE RESEÑAS Y CALIFICACIONES
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS resenas_compradores (
    id BIGSERIAL PRIMARY KEY,
    comprador_id BIGINT REFERENCES compradores(id) ON DELETE CASCADE,
    tienda_id VARCHAR(50) NOT NULL,
    producto_id VARCHAR(100),
    orden_id VARCHAR(100),
    
    -- Calificación
    calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 5),
    titulo VARCHAR(100),
    comentario TEXT,
    
    -- Imágenes de la reseña
    imagenes JSONB DEFAULT '[]',
    
    -- Estado de la reseña
    estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, aprobada, rechazada
    motivo_rechazo TEXT,
    moderado_por VARCHAR(100),
    fecha_moderacion TIMESTAMP WITH TIME ZONE,
    
    -- Utilidad de la reseña
    votos_utiles INTEGER DEFAULT 0,
    votos_no_utiles INTEGER DEFAULT 0,
    
    -- Respuesta del vendedor
    respuesta_vendedor TEXT,
    fecha_respuesta TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_resenas_comprador ON resenas_compradores(comprador_id);
CREATE INDEX IF NOT EXISTS idx_resenas_tienda ON resenas_compradores(tienda_id);
CREATE INDEX IF NOT EXISTS idx_resenas_producto ON resenas_compradores(tienda_id, producto_id);
CREATE INDEX IF NOT EXISTS idx_resenas_calificacion ON resenas_compradores(calificacion);
CREATE INDEX IF NOT EXISTS idx_resenas_estado ON resenas_compradores(estado);

-- ----------------------------------------
-- TABLA DE HISTORIAL DE COMPRAS
-- ----------------------------------------
CREATE TABLE IF NOT EXISTS compras (
    id BIGSERIAL PRIMARY KEY,
    comprador_id BIGINT REFERENCES compradores(id) ON DELETE SET NULL,
    tienda_id VARCHAR(50) NOT NULL,
    
    -- Información de la orden
    numero_orden VARCHAR(100) UNIQUE NOT NULL,
    estado VARCHAR(30) DEFAULT 'pendiente', 
    -- Estados: pendiente, confirmada, preparando, enviada, entregada, cancelada, reembolsada
    
    -- Productos comprados
    productos JSONB NOT NULL, -- Array de productos con cantidades y precios
    
    -- Montos
    subtotal DECIMAL(10,2) NOT NULL,
    descuentos DECIMAL(10,2) DEFAULT 0.00,
    impuestos DECIMAL(10,2) DEFAULT 0.00,
    costo_envio DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'ARS',
    
    -- Información de pago
    metodo_pago VARCHAR(50), -- mercadopago, efectivo, transferencia, etc.
    estado_pago VARCHAR(30) DEFAULT 'pendiente',
    transaction_id VARCHAR(200),
    fecha_pago TIMESTAMP WITH TIME ZONE,
    
    -- Información de envío
    tipo_entrega VARCHAR(50), -- domicilio, retiro, punto_encuentro
    direccion_envio JSONB, -- Copia de la dirección al momento de la compra
    fecha_estimada_entrega DATE,
    fecha_real_entrega TIMESTAMP WITH TIME ZONE,
    numero_seguimiento VARCHAR(100),
    
    -- Comunicación
    notas_cliente TEXT,
    notas_vendedor TEXT,
    
    -- Metadatos
    origen_compra VARCHAR(50) DEFAULT 'web', -- web, mobile, whatsapp
    dispositivo_usado VARCHAR(100),
    ip_cliente INET,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_compras_comprador ON compras(comprador_id);
CREATE INDEX IF NOT EXISTS idx_compras_tienda ON compras(tienda_id);
CREATE INDEX IF NOT EXISTS idx_compras_numero_orden ON compras(numero_orden);
CREATE INDEX IF NOT EXISTS idx_compras_estado ON compras(estado);
CREATE INDEX IF NOT EXISTS idx_compras_fecha ON compras(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_compras_total ON compras(total DESC);

-- ----------------------------------------
-- FUNCIONES AUTOMÁTICAS
-- ----------------------------------------

-- Función para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_compradores_updated_at ON compradores;
CREATE TRIGGER trigger_compradores_updated_at
    BEFORE UPDATE ON compradores
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

DROP TRIGGER IF EXISTS trigger_direcciones_updated_at ON direcciones_compradores;
CREATE TRIGGER trigger_direcciones_updated_at
    BEFORE UPDATE ON direcciones_compradores
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

DROP TRIGGER IF EXISTS trigger_resenas_updated_at ON resenas_compradores;
CREATE TRIGGER trigger_resenas_updated_at
    BEFORE UPDATE ON resenas_compradores
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

DROP TRIGGER IF EXISTS trigger_compras_updated_at ON compras;
CREATE TRIGGER trigger_compras_updated_at
    BEFORE UPDATE ON compras
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

-- Función para actualizar estadísticas del comprador después de una compra
CREATE OR REPLACE FUNCTION actualizar_estadisticas_comprador()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo actualizar si el estado cambió a 'entregada'
    IF NEW.estado = 'entregada' AND (OLD.estado IS NULL OR OLD.estado != 'entregada') THEN
        UPDATE compradores 
        SET 
            total_compras = total_compras + 1,
            monto_total_gastado = monto_total_gastado + NEW.total,
            fecha_ultima_compra = NEW.updated_at,
            fecha_primera_compra = COALESCE(fecha_primera_compra, NEW.created_at)
        WHERE id = NEW.comprador_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estadísticas
DROP TRIGGER IF EXISTS trigger_actualizar_stats_comprador ON compras;
CREATE TRIGGER trigger_actualizar_stats_comprador
    AFTER UPDATE ON compras
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_estadisticas_comprador();

-- ----------------------------------------
-- POLÍTICAS RLS (Row Level Security)
-- ----------------------------------------

-- Habilitar RLS
ALTER TABLE compradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE direcciones_compradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos_compradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE resenas_compradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;

-- Políticas para compradores
DROP POLICY IF EXISTS "Compradores pueden ver su perfil" ON compradores;
CREATE POLICY "Compradores pueden ver su perfil"
    ON compradores FOR SELECT
    USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Compradores pueden actualizar su perfil" ON compradores;
CREATE POLICY "Compradores pueden actualizar su perfil"
    ON compradores FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Políticas para direcciones
DROP POLICY IF EXISTS "Compradores gestionan sus direcciones" ON direcciones_compradores;
CREATE POLICY "Compradores gestionan sus direcciones"
    ON direcciones_compradores FOR ALL
    USING (comprador_id IN (SELECT id FROM compradores WHERE user_id = auth.uid()))
    WITH CHECK (comprador_id IN (SELECT id FROM compradores WHERE user_id = auth.uid()));

-- Políticas para favoritos
DROP POLICY IF EXISTS "Compradores gestionan sus favoritos" ON favoritos_compradores;
CREATE POLICY "Compradores gestionan sus favoritos"
    ON favoritos_compradores FOR ALL
    USING (comprador_id IN (SELECT id FROM compradores WHERE user_id = auth.uid()))
    WITH CHECK (comprador_id IN (SELECT id FROM compradores WHERE user_id = auth.uid()));

-- Políticas para reseñas
DROP POLICY IF EXISTS "Todos pueden ver reseñas aprobadas" ON resenas_compradores;
CREATE POLICY "Todos pueden ver reseñas aprobadas"
    ON resenas_compradores FOR SELECT
    USING (estado = 'aprobada' OR comprador_id IN (SELECT id FROM compradores WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Compradores pueden crear reseñas" ON resenas_compradores;
CREATE POLICY "Compradores pueden crear reseñas"
    ON resenas_compradores FOR INSERT
    WITH CHECK (comprador_id IN (SELECT id FROM compradores WHERE user_id = auth.uid()));

-- Políticas para compras
DROP POLICY IF EXISTS "Compradores ven sus compras" ON compras;
CREATE POLICY "Compradores ven sus compras"
    ON compras FOR SELECT
    USING (comprador_id IN (SELECT id FROM compradores WHERE user_id = auth.uid()) OR auth.role() = 'service_role');

-- ----------------------------------------
-- VISTAS ÚTILES
-- ----------------------------------------

-- Vista completa de compradores con estadísticas
CREATE OR REPLACE VIEW vista_compradores_completa AS
SELECT 
    c.*,
    COUNT(co.id) as total_ordenes,
    COUNT(CASE WHEN co.estado = 'entregada' THEN 1 END) as ordenes_completadas,
    COUNT(r.id) as total_resenas,
    AVG(r.calificacion) as promedio_calificaciones,
    COUNT(f.id) as productos_favoritos
FROM compradores c
LEFT JOIN compras co ON c.id = co.comprador_id
LEFT JOIN resenas_compradores r ON c.id = r.comprador_id AND r.estado = 'aprobada'
LEFT JOIN favoritos_compradores f ON c.id = f.comprador_id
GROUP BY c.id;

-- Vista de compras con información de comprador
CREATE OR REPLACE VIEW vista_compras_detalle AS
SELECT 
    co.*,
    c.nombre as comprador_nombre,
    c.apellido as comprador_apellido,
    c.email as comprador_email,
    c.telefono as comprador_telefono
FROM compras co
JOIN compradores c ON co.comprador_id = c.id;

-- ----------------------------------------
-- FUNCIONES ÚTILES PARA LA API
-- ----------------------------------------

-- Función para obtener el perfil completo de un comprador
CREATE OR REPLACE FUNCTION obtener_perfil_comprador(usuario_id UUID)
RETURNS TABLE (
    comprador_info JSONB,
    direcciones JSONB,
    estadisticas JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        row_to_json(c.*)::JSONB as comprador_info,
        COALESCE(json_agg(d.*) FILTER (WHERE d.id IS NOT NULL), '[]'::JSON)::JSONB as direcciones,
        json_build_object(
            'total_compras', c.total_compras,
            'monto_total_gastado', c.monto_total_gastado,
            'fecha_primera_compra', c.fecha_primera_compra,
            'fecha_ultima_compra', c.fecha_ultima_compra
        )::JSONB as estadisticas
    FROM compradores c
    LEFT JOIN direcciones_compradores d ON c.id = d.comprador_id AND d.activa = true
    WHERE c.user_id = usuario_id
    GROUP BY c.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------
-- DATOS DE EJEMPLO (OPCIONAL)
-- ----------------------------------------

-- Insertar compradores de ejemplo solo si no existen
INSERT INTO compradores (nombre, apellido, email, telefono, ciudad, provincia) 
SELECT * FROM (
    VALUES 
        ('María', 'González', 'maria@ejemplo.com', '+54911234567', 'Buenos Aires', 'Buenos Aires'),
        ('Juan', 'Pérez', 'juan@ejemplo.com', '+54911234568', 'Córdoba', 'Córdoba'),
        ('Ana', 'López', 'ana@ejemplo.com', '+54911234569', 'Rosario', 'Santa Fe')
) AS ejemplos(nombre, apellido, email, telefono, ciudad, provincia)
WHERE NOT EXISTS (SELECT 1 FROM compradores WHERE email = ejemplos.email);

-- ═══════════════════════════════════════════════════════════════
-- ✅ TABLA DE CLIENTES COMPLETADA
-- ═══════════════════════════════════════════════════════════════
-- 
-- Incluye:
-- - Gestión completa de compradores
-- - Direcciones múltiples
-- - Sistema de favoritos/wishlist  
-- - Reseñas y calificaciones
-- - Historial de compras detallado
-- - Políticas de seguridad RLS
-- - Funciones automáticas
-- - Vistas para consultas
-- 
-- 💜 Listo para integrar con el sistema principal de Cresalia
-- ═══════════════════════════════════════════════════════════════













