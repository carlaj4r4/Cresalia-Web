-- ========================================
-- TABLA DE SERVICIOS PARA CRESALIA SaaS
-- ========================================
-- Esta tabla almacena los servicios que ofrecen las tiendas/emprendimientos
-- Ideal para peluquerías, spas, talleres mecánicos, consultorías, etc.

CREATE TABLE IF NOT EXISTS servicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    
    -- Información básica del servicio
    nombre TEXT NOT NULL,
    descripcion TEXT,
    categoria TEXT NOT NULL,
    
    -- Detalles del servicio
    precio DECIMAL(10, 2) NOT NULL,
    duracion INTEGER DEFAULT 60, -- Duración en minutos
    
    -- Estado y configuración
    estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'pausado', 'inactivo')),
    requiere_cita BOOLEAN DEFAULT true,
    notas TEXT,
    
    -- Estadísticas
    reservas_totales INTEGER DEFAULT 0,
    calificacion_promedio DECIMAL(3, 2) DEFAULT 0,
    
    -- Fechas
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadatos adicionales
    imagen_url TEXT,
    tags TEXT[], -- Array de etiquetas
    visible BOOLEAN DEFAULT true
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_servicios_tienda ON servicios(tienda_id);
CREATE INDEX IF NOT EXISTS idx_servicios_categoria ON servicios(categoria);
CREATE INDEX IF NOT EXISTS idx_servicios_estado ON servicios(estado);
CREATE INDEX IF NOT EXISTS idx_servicios_precio ON servicios(precio);

-- Row Level Security (RLS)
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Los usuarios pueden ver solo sus propios servicios
CREATE POLICY "usuarios_ver_sus_servicios" ON servicios
    FOR SELECT
    USING (
        tienda_id IN (
            SELECT id FROM tiendas WHERE user_id = auth.uid()
        )
    );

-- Los usuarios pueden insertar servicios en sus propias tiendas
CREATE POLICY "usuarios_crear_servicios" ON servicios
    FOR INSERT
    WITH CHECK (
        tienda_id IN (
            SELECT id FROM tiendas WHERE user_id = auth.uid()
        )
    );

-- Los usuarios pueden actualizar sus propios servicios
CREATE POLICY "usuarios_actualizar_servicios" ON servicios
    FOR UPDATE
    USING (
        tienda_id IN (
            SELECT id FROM tiendas WHERE user_id = auth.uid()
        )
    );

-- Los usuarios pueden eliminar sus propios servicios
CREATE POLICY "usuarios_eliminar_servicios" ON servicios
    FOR DELETE
    USING (
        tienda_id IN (
            SELECT id FROM tiendas WHERE user_id = auth.uid()
        )
    );

-- Política pública: Los compradores pueden ver servicios activos y visibles
CREATE POLICY "publico_ver_servicios_activos" ON servicios
    FOR SELECT
    USING (estado = 'activo' AND visible = true);

-- ========================================
-- TABLA DE RESERVAS/CITAS (Opcional)
-- ========================================
-- Para gestionar citas/reservas de servicios

CREATE TABLE IF NOT EXISTS reservas_servicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    servicio_id UUID REFERENCES servicios(id) ON DELETE CASCADE,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    
    -- Información del cliente
    cliente_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nombre_cliente TEXT NOT NULL,
    email_cliente TEXT NOT NULL,
    telefono_cliente TEXT,
    
    -- Detalles de la reserva
    fecha_reserva TIMESTAMP WITH TIME ZONE NOT NULL,
    duracion INTEGER, -- Duración en minutos
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada', 'no_asistio')),
    
    -- Información adicional
    notas TEXT,
    precio_cobrado DECIMAL(10, 2),
    
    -- Calificación post-servicio
    calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    
    -- Fechas
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para reservas
CREATE INDEX IF NOT EXISTS idx_reservas_servicio ON reservas_servicios(servicio_id);
CREATE INDEX IF NOT EXISTS idx_reservas_tienda ON reservas_servicios(tienda_id);
CREATE INDEX IF NOT EXISTS idx_reservas_cliente ON reservas_servicios(cliente_id);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas_servicios(fecha_reserva);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas_servicios(estado);

-- RLS para reservas
ALTER TABLE reservas_servicios ENABLE ROW LEVEL SECURITY;

-- Los dueños de tienda pueden ver todas las reservas de sus servicios
CREATE POLICY "tiendas_ver_sus_reservas" ON reservas_servicios
    FOR SELECT
    USING (
        tienda_id IN (
            SELECT id FROM tiendas WHERE user_id = auth.uid()
        )
    );

-- Los clientes pueden ver sus propias reservas
CREATE POLICY "clientes_ver_sus_reservas" ON reservas_servicios
    FOR SELECT
    USING (cliente_id = auth.uid());

-- Cualquier usuario autenticado puede crear reservas
CREATE POLICY "usuarios_crear_reservas" ON reservas_servicios
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Los clientes pueden actualizar sus propias reservas (cancelar, etc.)
CREATE POLICY "clientes_actualizar_sus_reservas" ON reservas_servicios
    FOR UPDATE
    USING (cliente_id = auth.uid());

-- Los dueños de tienda pueden actualizar reservas de sus servicios
CREATE POLICY "tiendas_actualizar_sus_reservas" ON reservas_servicios
    FOR UPDATE
    USING (
        tienda_id IN (
            SELECT id FROM tiendas WHERE user_id = auth.uid()
        )
    );

-- ========================================
-- FUNCIÓN PARA ACTUALIZAR ESTADÍSTICAS
-- ========================================

-- Función para incrementar contador de reservas
CREATE OR REPLACE FUNCTION incrementar_reservas_servicio()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE servicios
    SET reservas_totales = reservas_totales + 1
    WHERE id = NEW.servicio_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para incrementar contador cuando se crea una reserva
CREATE TRIGGER trigger_incrementar_reservas
    AFTER INSERT ON reservas_servicios
    FOR EACH ROW
    EXECUTE FUNCTION incrementar_reservas_servicio();

-- Función para actualizar calificación promedio
CREATE OR REPLACE FUNCTION actualizar_calificacion_servicio()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE servicios
    SET calificacion_promedio = (
        SELECT AVG(calificacion)
        FROM reservas_servicios
        WHERE servicio_id = NEW.servicio_id
        AND calificacion IS NOT NULL
    )
    WHERE id = NEW.servicio_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar calificación cuando se califica una reserva
CREATE TRIGGER trigger_actualizar_calificacion
    AFTER UPDATE OF calificacion ON reservas_servicios
    FOR EACH ROW
    WHEN (NEW.calificacion IS NOT NULL AND OLD.calificacion IS NULL)
    EXECUTE FUNCTION actualizar_calificacion_servicio();

-- ========================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ========================================
-- Puedes descomentar esto para tener datos de ejemplo

/*
-- Insertar servicios de ejemplo para una peluquería
INSERT INTO servicios (tienda_id, nombre, descripcion, categoria, precio, duracion, requiere_cita, notas) VALUES
(
    (SELECT id FROM tiendas LIMIT 1), -- Reemplaza con el ID de tu tienda
    'Corte de Cabello',
    'Corte profesional adaptado a tu estilo y tipo de cabello',
    'peluqueria',
    25.00,
    45,
    true,
    'Incluye lavado y secado'
),
(
    (SELECT id FROM tiendas LIMIT 1),
    'Manicura Completa',
    'Manicura completa con esmaltado semipermanente',
    'manicura',
    35.00,
    60,
    true,
    'Traer toalla personal'
);
*/

-- ========================================
-- INSTRUCCIONES DE USO
-- ========================================
/*
1. Copia todo este código
2. Ve a tu proyecto de Supabase
3. Ve a SQL Editor
4. Pega el código y ejecuta
5. Verifica que las tablas se hayan creado correctamente
6. El sistema de servicios en el admin ya está configurado para usar estas tablas
*/




















