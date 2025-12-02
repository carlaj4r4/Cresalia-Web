-- ===== TABLAS: Cresalia Jobs - Verificación de Pagos y Calificaciones =====
-- Sistema para que buscadores de empleo verifiquen si les pagaron
-- y califiquen a los empleadores

-- ===== 1. TABLA: VERIFICACIONES DE PAGO =====
CREATE TABLE IF NOT EXISTS jobs_verificaciones_pago (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relación con la oferta de trabajo
    oferta_id UUID NOT NULL,
    empleador_id UUID NOT NULL,
    
    -- Información del empleado (buscador)
    empleado_id UUID, -- ID del buscador
    empleado_email VARCHAR(255), -- Email del empleado
    empleado_nombre VARCHAR(255), -- Nombre del empleado
    
    -- Verificación de pago
    fue_pagado BOOLEAN NOT NULL, -- TRUE = SÍ, FALSE = NO
    monto_pactado DECIMAL(10, 2),
    monto_recibido DECIMAL(10, 2),
    fecha_pago_esperada DATE,
    fecha_pago_real DATE,
    
    -- Pruebas/documentación
    evidencias JSONB DEFAULT '[]'::jsonb, -- Array de URLs de imágenes/comprobantes
    descripcion TEXT, -- Descripción del caso
    
    -- Estado
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_revision', 'resuelto', 'rechazado')),
    verificado_por_admin BOOLEAN DEFAULT false,
    notas_admin TEXT,
    
    -- Emails enviados
    email_enviado_empresa BOOLEAN DEFAULT false,
    email_enviado_empleado BOOLEAN DEFAULT false,
    
    -- Timestamps
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_jobs_verif_oferta ON jobs_verificaciones_pago(oferta_id);
CREATE INDEX IF NOT EXISTS idx_jobs_verif_empleador ON jobs_verificaciones_pago(empleador_id);
CREATE INDEX IF NOT EXISTS idx_jobs_verif_empleado ON jobs_verificaciones_pago(empleado_id);
CREATE INDEX IF NOT EXISTS idx_jobs_verif_estado ON jobs_verificaciones_pago(estado);
CREATE INDEX IF NOT EXISTS idx_jobs_verif_fue_pagado ON jobs_verificaciones_pago(fue_pagado);
CREATE INDEX IF NOT EXISTS idx_jobs_verif_fecha ON jobs_verificaciones_pago(fecha_creacion DESC);

-- ===== 2. TABLA: CALIFICACIONES DE EMPLEADORES =====
CREATE TABLE IF NOT EXISTS jobs_calificaciones_empleadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relación
    empleador_id UUID NOT NULL,
    oferta_id UUID NOT NULL,
    
    -- Calificador (empleado)
    empleado_id UUID,
    empleado_email VARCHAR(255),
    empleado_nombre VARCHAR(255),
    
    -- Calificación (1-5 estrellas)
    calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    
    -- Categorías de calificación
    puntualidad_pago INTEGER CHECK (puntualidad_pago >= 1 AND puntualidad_pago <= 5),
    trato_respetuoso INTEGER CHECK (trato_respetuoso >= 1 AND trato_respetuoso <= 5),
    condiciones_trabajo INTEGER CHECK (condiciones_trabajo >= 1 AND condiciones_trabajo <= 5),
    comunicacion INTEGER CHECK (comunicacion >= 1 AND comunicacion <= 5),
    
    -- Comentario
    comentario TEXT,
    
    -- Anónimo
    es_anonimo BOOLEAN DEFAULT false,
    
    -- Estado
    moderado BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    
    -- Timestamps
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_jobs_calif_empleador ON jobs_calificaciones_empleadores(empleador_id);
CREATE INDEX IF NOT EXISTS idx_jobs_calif_oferta ON jobs_calificaciones_empleadores(oferta_id);
CREATE INDEX IF NOT EXISTS idx_jobs_calif_empleado ON jobs_calificaciones_empleadores(empleado_id);
CREATE INDEX IF NOT EXISTS idx_jobs_calif_activo ON jobs_calificaciones_empleadores(activo) WHERE activo = true;

-- ===== 2B. TABLA: CALIFICACIONES DE EMPLEADOS (por empleadores) =====
CREATE TABLE IF NOT EXISTS jobs_calificaciones_empleados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relación
    empleado_id UUID NOT NULL,
    oferta_id UUID NOT NULL,
    
    -- Calificador (empleador)
    empleador_id UUID NOT NULL,
    empleador_nombre VARCHAR(255),
    empleador_email VARCHAR(255),
    
    -- Calificación (1-5 estrellas)
    calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    
    -- Categorías de calificación
    calidad_trabajo INTEGER CHECK (calidad_trabajo >= 1 AND calidad_trabajo <= 5),
    puntualidad INTEGER CHECK (puntualidad >= 1 AND puntualidad <= 5),
    responsabilidad INTEGER CHECK (responsabilidad >= 1 AND responsabilidad <= 5),
    comunicacion INTEGER CHECK (comunicacion >= 1 AND comunicacion <= 5),
    trabajo_equipo INTEGER CHECK (trabajo_equipo >= 1 AND trabajo_equipo <= 5),
    
    -- Comentario
    comentario TEXT,
    
    -- Anónimo
    es_anonimo BOOLEAN DEFAULT false,
    
    -- Estado
    moderado BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    
    -- Timestamps
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para calificaciones de empleados
CREATE INDEX IF NOT EXISTS idx_jobs_calif_emp_empleado ON jobs_calificaciones_empleados(empleado_id);
CREATE INDEX IF NOT EXISTS idx_jobs_calif_emp_oferta ON jobs_calificaciones_empleados(oferta_id);
CREATE INDEX IF NOT EXISTS idx_jobs_calif_emp_empleador ON jobs_calificaciones_empleados(empleador_id);
CREATE INDEX IF NOT EXISTS idx_jobs_calif_emp_activo ON jobs_calificaciones_empleados(activo) WHERE activo = true;

-- ===== 3A. TABLA: ESTADÍSTICAS DE EMPLEADORES =====
CREATE TABLE IF NOT EXISTS jobs_estadisticas_empleadores (
    empleador_id UUID PRIMARY KEY,
    
    -- Estadísticas de pagos
    total_verificaciones INTEGER DEFAULT 0,
    pagos_confirmados INTEGER DEFAULT 0,
    pagos_denegados INTEGER DEFAULT 0,
    porcentaje_pagos_confirmados DECIMAL(5, 2) DEFAULT 0.00,
    
    -- Estadísticas de calificaciones
    promedio_calificacion DECIMAL(3, 2) DEFAULT 0.00,
    total_calificaciones INTEGER DEFAULT 0,
    promedio_puntualidad DECIMAL(3, 2) DEFAULT 0.00,
    promedio_trato DECIMAL(3, 2) DEFAULT 0.00,
    promedio_condiciones DECIMAL(3, 2) DEFAULT 0.00,
    promedio_comunicacion DECIMAL(3, 2) DEFAULT 0.00,
    
    -- Timestamps
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_stats_empleador ON jobs_estadisticas_empleadores(empleador_id);

-- ===== 3B. TABLA: ESTADÍSTICAS DE EMPLEADOS =====
CREATE TABLE IF NOT EXISTS jobs_estadisticas_empleados (
    empleado_id UUID PRIMARY KEY,
    
    -- Estadísticas de calificaciones
    promedio_calificacion DECIMAL(3, 2) DEFAULT 0.00,
    total_calificaciones INTEGER DEFAULT 0,
    promedio_calidad_trabajo DECIMAL(3, 2) DEFAULT 0.00,
    promedio_puntualidad DECIMAL(3, 2) DEFAULT 0.00,
    promedio_responsabilidad DECIMAL(3, 2) DEFAULT 0.00,
    promedio_comunicacion DECIMAL(3, 2) DEFAULT 0.00,
    promedio_trabajo_equipo DECIMAL(3, 2) DEFAULT 0.00,
    
    -- Timestamps
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_stats_empleado ON jobs_estadisticas_empleados(empleado_id);

-- ===== FUNCIONES Y TRIGGERS =====

-- Función para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION actualizar_fecha_jobs_verif()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eliminar triggers existentes si existen (usando bloque DO para evitar errores)
DO $$ 
BEGIN
    -- Eliminar triggers si existen
    DROP TRIGGER IF EXISTS trigger_actualizar_jobs_verif ON jobs_verificaciones_pago;
    DROP TRIGGER IF EXISTS trigger_actualizar_jobs_calif ON jobs_calificaciones_empleadores;
    DROP TRIGGER IF EXISTS trigger_actualizar_jobs_calif_emp ON jobs_calificaciones_empleados;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

-- Crear triggers
CREATE TRIGGER trigger_actualizar_jobs_verif
    BEFORE UPDATE ON jobs_verificaciones_pago
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_jobs_verif();

CREATE TRIGGER trigger_actualizar_jobs_calif
    BEFORE UPDATE ON jobs_calificaciones_empleadores
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_jobs_verif();

CREATE TRIGGER trigger_actualizar_jobs_calif_emp
    BEFORE UPDATE ON jobs_calificaciones_empleados
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_jobs_verif();

-- Función para actualizar estadísticas (simplificada, puede mejorarse)
CREATE OR REPLACE FUNCTION actualizar_estadisticas_empleador(p_empleador_id UUID)
RETURNS VOID AS $$
DECLARE
    v_pagos_confirmados INTEGER;
    v_pagos_denegados INTEGER;
    v_total_verificaciones INTEGER;
    v_promedio_calif DECIMAL;
    v_total_calificaciones INTEGER;
BEGIN
    -- Calcular estadísticas de pagos
    SELECT 
        COUNT(*) FILTER (WHERE fue_pagado = true),
        COUNT(*) FILTER (WHERE fue_pagado = false),
        COUNT(*)
    INTO v_pagos_confirmados, v_pagos_denegados, v_total_verificaciones
    FROM jobs_verificaciones_pago
    WHERE empleador_id = p_empleador_id;
    
    -- Calcular estadísticas de calificaciones
    SELECT 
        AVG(calificacion),
        COUNT(*)
    INTO v_promedio_calif, v_total_calificaciones
    FROM jobs_calificaciones_empleadores
    WHERE empleador_id = p_empleador_id AND activo = true;
    
    -- Insertar o actualizar estadísticas
    INSERT INTO jobs_estadisticas_empleadores (
        empleador_id,
        total_verificaciones,
        pagos_confirmados,
        pagos_denegados,
        porcentaje_pagos_confirmados,
        promedio_calificacion,
        total_calificaciones,
        fecha_actualizacion
    ) VALUES (
        p_empleador_id,
        COALESCE(v_total_verificaciones, 0),
        COALESCE(v_pagos_confirmados, 0),
        COALESCE(v_pagos_denegados, 0),
        CASE 
            WHEN v_total_verificaciones > 0 
            THEN (v_pagos_confirmados::DECIMAL / v_total_verificaciones * 100)
            ELSE 0 
        END,
        COALESCE(v_promedio_calif, 0),
        COALESCE(v_total_calificaciones, 0),
        NOW()
    )
    ON CONFLICT (empleador_id) 
    DO UPDATE SET
        total_verificaciones = EXCLUDED.total_verificaciones,
        pagos_confirmados = EXCLUDED.pagos_confirmados,
        pagos_denegados = EXCLUDED.pagos_denegados,
        porcentaje_pagos_confirmados = EXCLUDED.porcentaje_pagos_confirmados,
        promedio_calificacion = EXCLUDED.promedio_calificacion,
        total_calificaciones = EXCLUDED.total_calificaciones,
        fecha_actualizacion = NOW();
END;
$$ LANGUAGE plpgsql;

-- ===== RLS (Row Level Security) =====

-- Eliminar políticas existentes si existen (para evitar errores en re-ejecución)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Cualquiera puede leer verificaciones públicas" ON jobs_verificaciones_pago;
    DROP POLICY IF EXISTS "Empleados pueden crear verificaciones" ON jobs_verificaciones_pago;
    DROP POLICY IF EXISTS "Empleados pueden actualizar sus verificaciones" ON jobs_verificaciones_pago;
    DROP POLICY IF EXISTS "Cualquiera puede leer calificaciones activas" ON jobs_calificaciones_empleadores;
    DROP POLICY IF EXISTS "Empleados pueden crear calificaciones" ON jobs_calificaciones_empleadores;
    DROP POLICY IF EXISTS "Cualquiera puede leer calificaciones empleados activas" ON jobs_calificaciones_empleados;
    DROP POLICY IF EXISTS "Empleadores pueden crear calificaciones empleados" ON jobs_calificaciones_empleados;
    DROP POLICY IF EXISTS "Cualquiera puede leer estadísticas empleadores" ON jobs_estadisticas_empleadores;
    DROP POLICY IF EXISTS "Cualquiera puede leer estadísticas empleados" ON jobs_estadisticas_empleados;
EXCEPTION WHEN undefined_object OR undefined_table THEN NULL;
END $$;

-- Habilitar RLS solo si las tablas existen
DO $$ 
BEGIN
    ALTER TABLE jobs_verificaciones_pago ENABLE ROW LEVEL SECURITY;
    ALTER TABLE jobs_calificaciones_empleadores ENABLE ROW LEVEL SECURITY;
    ALTER TABLE jobs_calificaciones_empleados ENABLE ROW LEVEL SECURITY;
    ALTER TABLE jobs_estadisticas_empleadores ENABLE ROW LEVEL SECURITY;
    ALTER TABLE jobs_estadisticas_empleados ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Políticas para verificaciones de pago
CREATE POLICY "Cualquiera puede leer verificaciones públicas" 
    ON jobs_verificaciones_pago FOR SELECT 
    USING (true);

CREATE POLICY "Empleados pueden crear verificaciones" 
    ON jobs_verificaciones_pago FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Empleados pueden actualizar sus verificaciones" 
    ON jobs_verificaciones_pago FOR UPDATE 
    USING (true) WITH CHECK (true);

-- Políticas para calificaciones de empleadores
CREATE POLICY "Cualquiera puede leer calificaciones activas" 
    ON jobs_calificaciones_empleadores FOR SELECT 
    USING (activo = true);

CREATE POLICY "Empleados pueden crear calificaciones" 
    ON jobs_calificaciones_empleadores FOR INSERT 
    WITH CHECK (true);

-- Políticas para calificaciones de empleados
CREATE POLICY "Cualquiera puede leer calificaciones empleados activas" 
    ON jobs_calificaciones_empleados FOR SELECT 
    USING (activo = true);

CREATE POLICY "Empleadores pueden crear calificaciones empleados" 
    ON jobs_calificaciones_empleados FOR INSERT 
    WITH CHECK (true);

-- Políticas para estadísticas (públicas)
CREATE POLICY "Cualquiera puede leer estadísticas empleadores" 
    ON jobs_estadisticas_empleadores FOR SELECT 
    USING (true);

CREATE POLICY "Cualquiera puede leer estadísticas empleados" 
    ON jobs_estadisticas_empleados FOR SELECT 
    USING (true);

-- Comentarios
COMMENT ON TABLE jobs_verificaciones_pago IS 'Verificaciones de pago de empleadores por parte de empleados. Incluye pruebas/documentación.';
COMMENT ON TABLE jobs_calificaciones_empleadores IS 'Calificaciones y reseñas de empleadores por parte de empleados.';
COMMENT ON TABLE jobs_calificaciones_empleados IS 'Calificaciones y reseñas de empleados por parte de empleadores.';
COMMENT ON TABLE jobs_estadisticas_empleadores IS 'Estadísticas agregadas de empleadores (pagos confirmados, calificaciones promedio).';
COMMENT ON TABLE jobs_estadisticas_empleados IS 'Estadísticas agregadas de empleados (calificaciones promedio, categorías).';

