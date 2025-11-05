-- ===== CRESALIA JOBS - BASE DE DATOS =====
-- Marketplace Ético de Empleo
-- Sistema completo para empleadores y buscadores de empleo

-- ===== 1. EMPLEADORES =====
CREATE TABLE IF NOT EXISTS empleadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_empresa TEXT NOT NULL,
    razon_social TEXT, -- Para facturación
    email TEXT NOT NULL,
    telefono TEXT,
    direccion TEXT,
    descripcion TEXT,
    sector TEXT, -- Tecnología, Retail, Salud, etc.
    tamaño_empresa TEXT, -- Pequeña, Mediana, Grande
    sitio_web TEXT,
    logo_url TEXT,
    verificado BOOLEAN DEFAULT false,
    reputacion DECIMAL(3,2) DEFAULT 5.0, -- 0-5
    total_reviews INTEGER DEFAULT 0,
    estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'suspendido', 'verificando')),
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 2. BUSCADORES DE EMPLEO =====
CREATE TABLE IF NOT EXISTS buscadores_empleo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    ubicacion TEXT,
    perfil_profesional TEXT, -- Resumen breve
    experiencia_años INTEGER,
    habilidades TEXT[], -- Array de habilidades
    educacion TEXT,
    disponibilidad TEXT, -- Inmediata, 2 semanas, etc.
    modalidad_preferida TEXT[], -- Presencial, Remoto, Híbrido
    salario_minimo DECIMAL(10,2),
    perfil_publico BOOLEAN DEFAULT true, -- Si permite que empleadores lo vean
    estado TEXT DEFAULT 'activo',
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 3. OFERTAS DE EMPLEO =====
CREATE TABLE IF NOT EXISTS ofertas_empleo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empleador_id UUID REFERENCES empleadores(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    requisitos TEXT NOT NULL,
    responsabilidades TEXT,
    salario_minimo DECIMAL(10,2) NOT NULL, -- OBLIGATORIO - No más "a convenir"
    salario_maximo DECIMAL(10,2),
    moneda TEXT DEFAULT 'ARS',
    modalidad TEXT NOT NULL CHECK (modalidad IN ('presencial', 'remoto', 'hibrido')),
    ubicacion TEXT, -- Requerido si es presencial o híbrido
    jornada TEXT NOT NULL CHECK (jornada IN ('part-time', 'full-time', 'por-horas', 'freelance')),
    tipo_contrato TEXT NOT NULL CHECK (tipo_contrato IN ('indefinido', 'determinado', 'practica', 'freelance')),
    beneficios TEXT[], -- Array de beneficios
    fecha_inicio DATE, -- Cuándo necesitan que empiece
    categoria TEXT, -- Tecnología, Marketing, Ventas, etc.
    nivel_experiencia TEXT CHECK (nivel_experiencia IN ('sin-experiencia', 'junior', 'semi-senior', 'senior', 'lead')),
    estado TEXT DEFAULT 'activa' CHECK (estado IN ('activa', 'pausada', 'cerrada', 'rechazada')),
    fecha_publicacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_cierre DATE, -- Fecha límite para postularse
    vistas INTEGER DEFAULT 0,
    postulaciones INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 4. POSTULACIONES =====
CREATE TABLE IF NOT EXISTS postulaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oferta_id UUID REFERENCES ofertas_empleo(id) ON DELETE CASCADE,
    buscador_id UUID REFERENCES buscadores_empleo(id) ON DELETE CASCADE,
    mensaje_personalizado TEXT,
    cv_url TEXT,
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'revisando', 'entrevista', 'aceptada', 'rechazada')),
    fecha_postulacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_respuesta TIMESTAMP WITH TIME ZONE,
    notas_empleador TEXT, -- Notas internas del empleador
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(oferta_id, buscador_id) -- Un buscador solo puede postularse una vez por oferta
);

-- ===== 5. VALORACIONES (REPUTACIÓN) =====
CREATE TABLE IF NOT EXISTS valoraciones_empleadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empleador_id UUID REFERENCES empleadores(id) ON DELETE CASCADE,
    buscador_id UUID REFERENCES buscadores_empleo(id) ON DELETE CASCADE,
    oferta_id UUID REFERENCES ofertas_empleo(id) ON DELETE SET NULL,
    calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    aspectos_positivos TEXT[],
    aspectos_negativos TEXT[],
    recomendaria BOOLEAN,
    fecha_valoracion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(empleador_id, buscador_id, oferta_id) -- Una valoración por oferta
);

CREATE TABLE IF NOT EXISTS valoraciones_buscadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buscador_id UUID REFERENCES buscadores_empleo(id) ON DELETE CASCADE,
    empleador_id UUID REFERENCES empleadores(id) ON DELETE CASCADE,
    oferta_id UUID REFERENCES ofertas_empleo(id) ON DELETE SET NULL,
    calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    fecha_valoracion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(buscador_id, empleador_id, oferta_id)
);

-- ===== 6. REPORTES =====
CREATE TABLE IF NOT EXISTS reportes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT NOT NULL CHECK (tipo IN ('empleador', 'oferta', 'buscador', 'postulacion')),
    entidad_id UUID NOT NULL, -- ID de la entidad reportada
    reportador_id UUID, -- ID de quien reporta (opcional si es anónimo)
    razon TEXT NOT NULL,
    descripcion TEXT,
    evidencia TEXT[], -- URLs de screenshots, etc.
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'revisando', 'resuelto', 'descartado')),
    accion_tomada TEXT,
    fecha_reporte TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_resolucion TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 7. PAGOS (PARA EMPLEADORES) =====
CREATE TABLE IF NOT EXISTS pagos_empleadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empleador_id UUID REFERENCES empleadores(id) ON DELETE CASCADE,
    tipo_pago TEXT NOT NULL CHECK (tipo_pago IN ('publicacion', 'destacado', 'suscripcion')),
    monto DECIMAL(10,2) NOT NULL,
    moneda TEXT DEFAULT 'ARS',
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesado', 'fallido', 'reembolsado')),
    metodo_pago TEXT, -- 'mercadopago', 'transferencia', etc.
    id_pago_externo TEXT, -- ID de Mercado Pago
    referencia TEXT,
    fecha_pago TIMESTAMP WITH TIME ZONE,
    fecha_vencimiento TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ÍNDICES =====
CREATE INDEX IF NOT EXISTS idx_ofertas_empleador ON ofertas_empleo(empleador_id);
CREATE INDEX IF NOT EXISTS idx_ofertas_estado ON ofertas_empleo(estado);
CREATE INDEX IF NOT EXISTS idx_ofertas_categoria ON ofertas_empleo(categoria);
CREATE INDEX IF NOT EXISTS idx_ofertas_modalidad ON ofertas_empleo(modalidad);
CREATE INDEX IF NOT EXISTS idx_ofertas_fecha_publicacion ON ofertas_empleo(fecha_publicacion DESC);
CREATE INDEX IF NOT EXISTS idx_postulaciones_oferta ON postulaciones(oferta_id);
CREATE INDEX IF NOT EXISTS idx_postulaciones_buscador ON postulaciones(buscador_id);
CREATE INDEX IF NOT EXISTS idx_postulaciones_estado ON postulaciones(estado);
CREATE INDEX IF NOT EXISTS idx_valoraciones_empleador ON valoraciones_empleadores(empleador_id);
CREATE INDEX IF NOT EXISTS idx_valoraciones_buscador ON valoraciones_buscadores(buscador_id);
CREATE INDEX IF NOT EXISTS idx_reportes_tipo ON reportes(tipo);
CREATE INDEX IF NOT EXISTS idx_reportes_estado ON reportes(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_empleador ON pagos_empleadores(empleador_id);
CREATE INDEX IF NOT EXISTS idx_pagos_estado ON pagos_empleadores(estado);

-- ===== COMENTARIOS =====
COMMENT ON TABLE empleadores IS 'Empleadores verificados en Cresalia Jobs';
COMMENT ON TABLE buscadores_empleo IS 'Buscadores de empleo registrados';
COMMENT ON TABLE ofertas_empleo IS 'Ofertas de empleo con salarios transparentes';
COMMENT ON TABLE postulaciones IS 'Postulaciones de buscadores a ofertas';
COMMENT ON TABLE valoraciones_empleadores IS 'Valoraciones que los buscadores hacen de empleadores';
COMMENT ON TABLE valoraciones_buscadores IS 'Valoraciones que los empleadores hacen de buscadores';
COMMENT ON TABLE reportes IS 'Sistema de reportes para mantener la plataforma ética';
COMMENT ON TABLE pagos_empleadores IS 'Pagos realizados por empleadores (publicaciones, destacados, etc.)';

-- ===== ROW LEVEL SECURITY (RLS) =====
-- Habilitar RLS en todas las tablas
ALTER TABLE empleadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE buscadores_empleo ENABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas_empleo ENABLE ROW LEVEL SECURITY;
ALTER TABLE postulaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE valoraciones_empleadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE valoraciones_buscadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos_empleadores ENABLE ROW LEVEL SECURITY;

-- ===== POLÍTICAS RLS PARA EMPLEADORES =====
-- Los empleadores pueden ver y editar solo sus propios datos
DROP POLICY IF EXISTS "empleadores_own_data" ON empleadores;
CREATE POLICY "empleadores_own_data" ON empleadores
    FOR ALL USING (
        auth.jwt() ->> 'email' = email
    );

-- Los empleadores públicos pueden ser vistos por todos (solo lectura)
DROP POLICY IF EXISTS "empleadores_public_read" ON empleadores;
CREATE POLICY "empleadores_public_read" ON empleadores
    FOR SELECT USING (estado = 'activo');

-- ===== POLÍTICAS RLS PARA BUSCADORES =====
-- Los buscadores pueden ver y editar solo sus propios datos
DROP POLICY IF EXISTS "buscadores_own_data" ON buscadores_empleo;
CREATE POLICY "buscadores_own_data" ON buscadores_empleo
    FOR ALL USING (
        auth.jwt() ->> 'email' = email
    );

-- Los buscadores con perfil público pueden ser vistos por empleadores (solo lectura)
DROP POLICY IF EXISTS "buscadores_public_read" ON buscadores_empleo;
CREATE POLICY "buscadores_public_read" ON buscadores_empleo
    FOR SELECT USING (perfil_publico = true AND estado = 'activo');

-- ===== POLÍTICAS RLS PARA OFERTAS =====
-- Los empleadores pueden crear, ver y editar solo sus propias ofertas
DROP POLICY IF EXISTS "ofertas_empleador_own" ON ofertas_empleo;
CREATE POLICY "ofertas_empleador_own" ON ofertas_empleo
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM empleadores
            WHERE empleadores.id = ofertas_empleo.empleador_id
            AND empleadores.email = auth.jwt() ->> 'email'
        )
    );

-- Todos pueden ver ofertas activas (solo lectura)
DROP POLICY IF EXISTS "ofertas_public_read" ON ofertas_empleo;
CREATE POLICY "ofertas_public_read" ON ofertas_empleo
    FOR SELECT USING (estado = 'activa');

-- ===== POLÍTICAS RLS PARA POSTULACIONES =====
-- Los buscadores pueden crear y ver solo sus propias postulaciones
DROP POLICY IF EXISTS "postulaciones_buscador_own" ON postulaciones;
CREATE POLICY "postulaciones_buscador_own" ON postulaciones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM buscadores_empleo
            WHERE buscadores_empleo.id = postulaciones.buscador_id
            AND buscadores_empleo.email = auth.jwt() ->> 'email'
        )
    );

-- Los empleadores pueden ver postulaciones de sus ofertas (solo lectura)
DROP POLICY IF EXISTS "postulaciones_empleador_read" ON postulaciones;
CREATE POLICY "postulaciones_empleador_read" ON postulaciones
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM ofertas_empleo
            JOIN empleadores ON empleadores.id = ofertas_empleo.empleador_id
            WHERE ofertas_empleo.id = postulaciones.oferta_id
            AND empleadores.email = auth.jwt() ->> 'email'
        )
    );

-- ===== POLÍTICAS RLS PARA VALORACIONES DE EMPLEADORES =====
-- Los buscadores pueden crear valoraciones de empleadores
DROP POLICY IF EXISTS "valoraciones_empleadores_buscador_create" ON valoraciones_empleadores;
CREATE POLICY "valoraciones_empleadores_buscador_create" ON valoraciones_empleadores
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM buscadores_empleo
            WHERE buscadores_empleo.id = valoraciones_empleadores.buscador_id
            AND buscadores_empleo.email = auth.jwt() ->> 'email'
        )
    );

-- Todos pueden ver valoraciones públicas (solo lectura)
DROP POLICY IF EXISTS "valoraciones_empleadores_public_read" ON valoraciones_empleadores;
CREATE POLICY "valoraciones_empleadores_public_read" ON valoraciones_empleadores
    FOR SELECT USING (true);

-- Los empleadores pueden ver sus propias valoraciones (solo lectura)
DROP POLICY IF EXISTS "valoraciones_empleadores_empleador_read" ON valoraciones_empleadores;
CREATE POLICY "valoraciones_empleadores_empleador_read" ON valoraciones_empleadores
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM empleadores
            WHERE empleadores.id = valoraciones_empleadores.empleador_id
            AND empleadores.email = auth.jwt() ->> 'email'
        )
    );

-- ===== POLÍTICAS RLS PARA VALORACIONES DE BUSCADORES =====
-- Los empleadores pueden crear valoraciones de buscadores
DROP POLICY IF EXISTS "valoraciones_buscadores_empleador_create" ON valoraciones_buscadores;
CREATE POLICY "valoraciones_buscadores_empleador_create" ON valoraciones_buscadores
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM empleadores
            WHERE empleadores.id = valoraciones_buscadores.empleador_id
            AND empleadores.email = auth.jwt() ->> 'email'
        )
    );

-- Todos pueden ver valoraciones públicas (solo lectura)
DROP POLICY IF EXISTS "valoraciones_buscadores_public_read" ON valoraciones_buscadores;
CREATE POLICY "valoraciones_buscadores_public_read" ON valoraciones_buscadores
    FOR SELECT USING (true);

-- Los buscadores pueden ver sus propias valoraciones (solo lectura)
DROP POLICY IF EXISTS "valoraciones_buscadores_buscador_read" ON valoraciones_buscadores;
CREATE POLICY "valoraciones_buscadores_buscador_read" ON valoraciones_buscadores
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM buscadores_empleo
            WHERE buscadores_empleo.id = valoraciones_buscadores.buscador_id
            AND buscadores_empleo.email = auth.jwt() ->> 'email'
        )
    );

-- ===== POLÍTICAS RLS PARA REPORTES =====
-- Cualquiera puede crear reportes (incluso anónimos)
DROP POLICY IF EXISTS "reportes_create" ON reportes;
CREATE POLICY "reportes_create" ON reportes
    FOR INSERT WITH CHECK (true);

-- Solo administradores pueden ver reportes (esto requiere configuración adicional)
-- Por ahora, permitimos que el reportador vea su propio reporte
DROP POLICY IF EXISTS "reportes_own_read" ON reportes;
CREATE POLICY "reportes_own_read" ON reportes
    FOR SELECT USING (
        reportador_id IS NULL OR
        EXISTS (
            SELECT 1 FROM empleadores
            WHERE empleadores.id::text = reportes.reportador_id::text
            AND empleadores.email = auth.jwt() ->> 'email'
        ) OR
        EXISTS (
            SELECT 1 FROM buscadores_empleo
            WHERE buscadores_empleo.id::text = reportes.reportador_id::text
            AND buscadores_empleo.email = auth.jwt() ->> 'email'
        )
    );

-- ===== POLÍTICAS RLS PARA PAGOS =====
-- Los empleadores pueden ver y crear solo sus propios pagos
DROP POLICY IF EXISTS "pagos_empleador_own" ON pagos_empleadores;
CREATE POLICY "pagos_empleador_own" ON pagos_empleadores
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM empleadores
            WHERE empleadores.id = pagos_empleadores.empleador_id
            AND empleadores.email = auth.jwt() ->> 'email'
        )
    );

-- ===== VERIFICACIÓN RLS =====
-- Para verificar que RLS está habilitado:
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('empleadores', 'buscadores_empleo', 'ofertas_empleo', 'postulaciones', 'valoraciones_empleadores', 'valoraciones_buscadores', 'reportes', 'pagos_empleadores')
-- ORDER BY tablename;

