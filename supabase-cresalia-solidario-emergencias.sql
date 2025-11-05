-- ===== CRESALIA SOLIDARIO - EMERGENCIAS (MATERIALES/DESASTRES) =====
-- Sistema de donaciones de materiales para desastres naturales verificados
-- SOLO para emergencias verificadas por autoridades

-- ===== 1. CAMPAÑAS DE EMERGENCIA =====
CREATE TABLE IF NOT EXISTS campañas_emergencia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información de la emergencia
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    tipo_desastre TEXT NOT NULL CHECK (tipo_desastre IN (
        'inundacion',
        'incendio',
        'terremoto',
        'tornado',
        'tormenta',
        'otro_desastre'
    )),
    ubicacion TEXT NOT NULL,
    fecha_desastre DATE NOT NULL,
    
    -- Verificación (SOLO desastres naturales verificados)
    verificada BOOLEAN DEFAULT false,
    verificada_por TEXT, -- Email de quien verificó (vos)
    fecha_verificacion TIMESTAMP WITH TIME ZONE,
    evidencias_verificacion JSONB DEFAULT '[]', -- Documentos oficiales, links de noticias, etc.
    fuente_verificacion TEXT, -- "municipalidad", "bomberos", "medios_oficiales", "verificacion_personal"
    
    -- Estado
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN (
        'pendiente',     -- Esperando verificación
        'activa',        -- Verificada y activa
        'completada',    -- Ya se recibió suficiente ayuda
        'cerrada',       -- Cerrada manualmente
        'rechazada'      -- No verificada o no es desastre real
    )),
    razon_rechazo TEXT,
    
    -- Necesidades específicas
    necesidades JSONB DEFAULT '[]', -- Array de necesidades: ["colchas", "alimentos", "agua", "ropa", "ventiladores", etc.]
    necesidades_prioritarias TEXT[], -- Array de necesidades más urgentes
    
    -- Donaciones de sangre
    necesita_sangre BOOLEAN DEFAULT false,
    tipo_sangre_requerido TEXT[], -- Array de tipos de sangre necesarios
    hospital_contacto TEXT, -- Hospital o centro donde se necesita
    
    -- Límites
    fecha_limite TIMESTAMP WITH TIME ZONE, -- Fecha límite de la campaña
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_cierre TIMESTAMP WITH TIME ZONE,
    
    -- Estadísticas
    total_donaciones INTEGER DEFAULT 0,
    total_donantes INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 2. DONACIONES DE MATERIALES =====
CREATE TABLE IF NOT EXISTS donaciones_materiales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaña_id UUID REFERENCES campañas_emergencia(id) ON DELETE CASCADE,
    
    -- Donante
    donante_nombre TEXT NOT NULL,
    donante_email TEXT NOT NULL,
    donante_telefono TEXT,
    donante_ubicacion TEXT,
    donante_anonimo BOOLEAN DEFAULT false, -- Si quiere aparecer públicamente
    
    -- Donación
    tipo_donacion TEXT NOT NULL CHECK (tipo_donacion IN (
        'productos',
        'materiales',
        'servicios',
        'sangre',
        'dinero'
    )),
    productos_donados JSONB DEFAULT '[]', -- Array de productos: [{"nombre": "colchas", "cantidad": 5}, ...]
    descripcion TEXT, -- Descripción de lo que dona
    
    -- Donación de sangre
    tipo_sangre TEXT, -- Si es donación de sangre
    fecha_donacion_sangre DATE,
    hospital_destino TEXT,
    
    -- Estado
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN (
        'pendiente',      -- Esperando confirmación
        'confirmada',     -- Confirmada por el donante
        'entregada',      -- Entregada a la campaña
        'recibida',       -- Recibida por beneficiarios
        'cancelada'       -- Cancelada
    )),
    
    -- Contacto
    metodo_entrega TEXT, -- "llevar_personalmente", "transporte_coordinado", "punto_acopio"
    punto_acopio TEXT, -- Si hay punto de acopio establecido
    
    fecha_donacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_entrega TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 3. AGREGADOS RECIBIDOS =====
CREATE TABLE IF NOT EXISTS agregados_campanas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaña_id UUID REFERENCES campañas_emergencia(id) ON DELETE CASCADE,
    
    -- Qué se recibió
    tipo_producto TEXT NOT NULL, -- "colchas", "alimentos", "agua", etc.
    cantidad INTEGER NOT NULL,
    unidad TEXT, -- "unidades", "kg", "litros", etc.
    descripcion TEXT,
    
    -- De quién
    donante_id UUID REFERENCES donaciones_materiales(id) ON DELETE SET NULL,
    donante_anonimo BOOLEAN DEFAULT true,
    
    -- Fecha
    fecha_recepcion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 4. AGRADECIMIENTOS A DONANTES =====
CREATE TABLE IF NOT EXISTS agradecimientos_donantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaña_id UUID REFERENCES campañas_emergencia(id) ON DELETE CASCADE,
    donacion_id UUID REFERENCES donaciones_materiales(id) ON DELETE CASCADE,
    
    -- Agradecimiento público
    mensaje_agradecimiento TEXT,
    mostrar_publicamente BOOLEAN DEFAULT true,
    
    fecha_agradecimiento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ÍNDICES =====
CREATE INDEX IF NOT EXISTS idx_campanas_estado ON campañas_emergencia(estado);
CREATE INDEX IF NOT EXISTS idx_campanas_tipo ON campañas_emergencia(tipo_desastre);
CREATE INDEX IF NOT EXISTS idx_campanas_verificada ON campañas_emergencia(verificada);
CREATE INDEX IF NOT EXISTS idx_campanas_fecha ON campañas_emergencia(fecha_desastre DESC);
CREATE INDEX IF NOT EXISTS idx_donaciones_campana ON donaciones_materiales(campaña_id);
CREATE INDEX IF NOT EXISTS idx_donaciones_estado ON donaciones_materiales(estado);
CREATE INDEX IF NOT EXISTS idx_donaciones_tipo ON donaciones_materiales(tipo_donacion);
CREATE INDEX IF NOT EXISTS idx_agregados_campana ON agregados_campanas(campaña_id);
CREATE INDEX IF NOT EXISTS idx_agradecimientos_campana ON agradecimientos_donantes(campaña_id);

-- ===== ROW LEVEL SECURITY =====
ALTER TABLE campañas_emergencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE donaciones_materiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE agregados_campanas ENABLE ROW LEVEL SECURITY;
ALTER TABLE agradecimientos_donantes ENABLE ROW LEVEL SECURITY;

-- ===== POLÍTICAS RLS =====

-- Campañas: Solo activas y verificadas son públicas
DROP POLICY IF EXISTS "campanas_public_read" ON campañas_emergencia;
CREATE POLICY "campanas_public_read" ON campañas_emergencia
    FOR SELECT USING (
        estado = 'activa' AND 
        verificada = true
    );

-- Campañas: Solo administradores pueden crear/editar (service_role)
DROP POLICY IF EXISTS "campanas_admin_write" ON campañas_emergencia;
CREATE POLICY "campanas_admin_write" ON campañas_emergencia
    FOR ALL USING (true); -- Con service_role key

-- Donaciones: Cualquiera puede crear donaciones
DROP POLICY IF EXISTS "donaciones_create" ON donaciones_materiales;
CREATE POLICY "donaciones_create" ON donaciones_materiales
    FOR INSERT WITH CHECK (true);

-- Donaciones: Donantes pueden ver sus propias donaciones
DROP POLICY IF EXISTS "donaciones_own_read" ON donaciones_materiales;
CREATE POLICY "donaciones_own_read" ON donaciones_materiales
    FOR SELECT USING (
        donante_email = auth.jwt() ->> 'email' OR
        donante_anonimo = false
    );

-- Agregados: Públicos para campañas activas
DROP POLICY IF EXISTS "agregados_public_read" ON agregados_campanas;
CREATE POLICY "agregados_public_read" ON agregados_campanas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM campañas_emergencia
            WHERE campañas_emergencia.id = agregados_campanas.campaña_id
            AND campañas_emergencia.estado = 'activa'
            AND campañas_emergencia.verificada = true
        )
    );

-- Agradecimientos: Públicos
DROP POLICY IF EXISTS "agradecimientos_public_read" ON agradecimientos_donantes;
CREATE POLICY "agradecimientos_public_read" ON agradecimientos_donantes
    FOR SELECT USING (mostrar_publicamente = true);

-- ===== COMENTARIOS =====
COMMENT ON TABLE campañas_emergencia IS 'Campañas de emergencia para desastres naturales verificados';
COMMENT ON TABLE donaciones_materiales IS 'Donaciones de materiales, productos, servicios o sangre para emergencias';
COMMENT ON TABLE agregados_campanas IS 'Registro de productos recibidos en campañas';
COMMENT ON TABLE agradecimientos_donantes IS 'Agradecimientos públicos a donantes de emergencias';

