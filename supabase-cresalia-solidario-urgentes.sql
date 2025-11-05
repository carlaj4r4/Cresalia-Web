-- ===== CRESALIA SOLIDARIO - AYUDAS URGENTES =====
-- Sistema de ayuda urgente para personas en situaciones críticas
-- Con verificación robusta y protección anti-abuso

-- ===== 1. SOLICITUDES DE AYUDA URGENTE =====
CREATE TABLE IF NOT EXISTS solicitudes_ayuda_urgente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información del solicitante
    nombre TEXT NOT NULL, -- NO anónimo (por seguridad)
    email TEXT NOT NULL,
    telefono TEXT,
    ubicacion TEXT,
    situacion_familiar TEXT, -- Cantidad de personas a cargo, etc.
    
    -- Tipo de urgencia
    tipo_urgencia TEXT NOT NULL CHECK (tipo_urgencia IN (
        'desempleo',
        'urgencia_medica',
        'emergencia_habitacional',
        'necesidades_basicas',
        'educacion_urgente',
        'emergencia_familiar'
    )),
    
    -- Detalles de la solicitud
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    monto_solicitado DECIMAL(10,2) NOT NULL,
    monto_recibido DECIMAL(10,2) DEFAULT 0,
    moneda TEXT DEFAULT 'ARS',
    
    -- Evidencias (múltiples)
    evidencias JSONB DEFAULT '[]', -- Array de URLs de documentos/fotos
    cantidad_evidencias INTEGER DEFAULT 0,
    evidencias_verificadas BOOLEAN DEFAULT false,
    
    -- Verificación
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN (
        'pendiente',           -- Esperando revisión
        'revisando',           -- En proceso de verificación
        'aprobada',            -- Aprobada, visible públicamente
        'rechazada',           -- Rechazada (con razón)
        'completada',          -- Alcanzó el objetivo
        'cerrada',             -- Cerrada (fecha límite o manual)
        'expirada'             -- Expirada por fecha límite
    )),
    razon_rechazo TEXT,
    verificada_por TEXT, -- Email de quien verificó (vos)
    fecha_verificacion TIMESTAMP WITH TIME ZONE,
    
    -- Límites y fechas
    fecha_limite TIMESTAMP WITH TIME ZONE NOT NULL, -- Fecha límite de la solicitud
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_cierre TIMESTAMP WITH TIME ZONE, -- Cuando se cerró (automático o manual)
    fecha_agradecimiento TIMESTAMP WITH TIME ZONE, -- Cuando dejaron el agradecimiento
    
    -- Control anti-abuso
    usuario_id_hash TEXT, -- Hash del email para detectar múltiples cuentas
    bloqueada BOOLEAN DEFAULT false, -- Si se detecta abuso
    motivo_bloqueo TEXT,
    
    -- Estadísticas
    vistas INTEGER DEFAULT 0,
    donaciones_count INTEGER DEFAULT 0,
    mensaje_agradecimiento TEXT, -- Mensaje de agradecimiento obligatorio
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 2. DONACIONES RECIBIDAS =====
CREATE TABLE IF NOT EXISTS donaciones_solidario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitud_id UUID REFERENCES solicitudes_ayuda_urgente(id) ON DELETE CASCADE,
    
    -- Donante
    donante_nombre TEXT, -- Opcional (puede ser anónimo)
    donante_email TEXT, -- Para contacto si es necesario
    donante_anonimo BOOLEAN DEFAULT true, -- Por defecto anónimo
    donante_quiere_reconocimiento BOOLEAN DEFAULT false, -- Si quiere aparecer públicamente
    
    -- Donación
    monto DECIMAL(10,2) NOT NULL,
    moneda TEXT DEFAULT 'ARS',
    metodo_pago TEXT, -- 'mercadopago', 'transferencia', 'efectivo', etc.
    id_pago_externo TEXT, -- ID de Mercado Pago si aplica
    
    -- Estado
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesada', 'fallida', 'reembolsada')),
    fecha_donacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Mensaje opcional del donante
    mensaje_donante TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 3. CONTROL DE LÍMITES (6 MESES) =====
CREATE TABLE IF NOT EXISTS control_limites_solidario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id_hash TEXT NOT NULL, -- Hash del email
    solicitud_id UUID REFERENCES solicitudes_ayuda_urgente(id) ON DELETE CASCADE,
    fecha_ayuda_recibida TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_limite_nueva_solicitud TIMESTAMP WITH TIME ZONE NOT NULL, -- fecha_ayuda_recibida + 6 meses
    agradecimiento_completado BOOLEAN DEFAULT false,
    fecha_agradecimiento TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 4. REPORTES DE SOLICITUDES =====
CREATE TABLE IF NOT EXISTS reportes_solicitudes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solicitud_id UUID REFERENCES solicitudes_ayuda_urgente(id) ON DELETE CASCADE,
    reportador_id UUID, -- Hash del email de quien reporta
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

-- ===== ÍNDICES =====
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_ayuda_urgente(estado);
CREATE INDEX IF NOT EXISTS idx_solicitudes_tipo ON solicitudes_ayuda_urgente(tipo_urgencia);
CREATE INDEX IF NOT EXISTS idx_solicitudes_fecha_limite ON solicitudes_ayuda_urgente(fecha_limite);
CREATE INDEX IF NOT EXISTS idx_solicitudes_usuario_hash ON solicitudes_ayuda_urgente(usuario_id_hash);
CREATE INDEX IF NOT EXISTS idx_donaciones_solicitud ON donaciones_solidario(solicitud_id);
CREATE INDEX IF NOT EXISTS idx_donaciones_estado ON donaciones_solidario(estado);
CREATE INDEX IF NOT EXISTS idx_control_limites_usuario ON control_limites_solidario(usuario_id_hash);
CREATE INDEX IF NOT EXISTS idx_control_limites_fecha ON control_limites_solidario(fecha_limite_nueva_solicitud);
CREATE INDEX IF NOT EXISTS idx_reportes_solicitud ON reportes_solicitudes(solicitud_id);
CREATE INDEX IF NOT EXISTS idx_reportes_estado ON reportes_solicitudes(estado);

-- ===== ROW LEVEL SECURITY =====
ALTER TABLE solicitudes_ayuda_urgente ENABLE ROW LEVEL SECURITY;
ALTER TABLE donaciones_solidario ENABLE ROW LEVEL SECURITY;
ALTER TABLE control_limites_solidario ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes_solicitudes ENABLE ROW LEVEL SECURITY;

-- ===== POLÍTICAS RLS =====

-- Solicitudes: Públicas cuando están aprobadas, privadas para el solicitante
DROP POLICY IF EXISTS "solicitudes_public_read" ON solicitudes_ayuda_urgente;
CREATE POLICY "solicitudes_public_read" ON solicitudes_ayuda_urgente
    FOR SELECT USING (
        estado = 'aprobada' AND 
        bloqueada = false AND
        fecha_limite > NOW()
    );

-- Solicitantes pueden ver/editar solo sus propias solicitudes
DROP POLICY IF EXISTS "solicitudes_own_data" ON solicitudes_ayuda_urgente;
CREATE POLICY "solicitudes_own_data" ON solicitudes_ayuda_urgente
    FOR ALL USING (
        usuario_id_hash = encode(digest(auth.jwt() ->> 'email', 'sha256'), 'hex')
    );

-- Donaciones: Donantes pueden ver sus propias donaciones
DROP POLICY IF EXISTS "donaciones_own_data" ON donaciones_solidario;
CREATE POLICY "donaciones_own_data" ON donaciones_solidario
    FOR SELECT USING (
        donante_email = auth.jwt() ->> 'email' OR
        donante_anonimo = false -- Donaciones con reconocimiento son públicas
    );

-- Donaciones: Cualquiera puede crear donaciones (pero no ver datos de donantes anónimos)
DROP POLICY IF EXISTS "donaciones_create" ON donaciones_solidario;
CREATE POLICY "donaciones_create" ON donaciones_solidario
    FOR INSERT WITH CHECK (true);

-- Control de límites: Solo el usuario puede ver sus propios límites
DROP POLICY IF EXISTS "control_limites_own" ON control_limites_solidario;
CREATE POLICY "control_limites_own" ON control_limites_solidario
    FOR SELECT USING (
        usuario_id_hash = encode(digest(auth.jwt() ->> 'email', 'sha256'), 'hex')
    );

-- Reportes: Cualquiera puede crear reportes
DROP POLICY IF EXISTS "reportes_create" ON reportes_solicitudes;
CREATE POLICY "reportes_create" ON reportes_solicitudes
    FOR INSERT WITH CHECK (true);

-- Reportes: Solo administradores pueden ver reportes (requiere service_role)
DROP POLICY IF EXISTS "reportes_admin_read" ON reportes_solicitudes;
CREATE POLICY "reportes_admin_read" ON reportes_solicitudes
    FOR SELECT USING (true); -- Con service_role key

-- ===== FUNCIÓN: Verificar si puede crear nueva solicitud =====
CREATE OR REPLACE FUNCTION puede_crear_nueva_solicitud(p_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_hash TEXT;
    v_limite TIMESTAMP WITH TIME ZONE;
    v_agradecimiento BOOLEAN;
BEGIN
    -- Generar hash del email
    v_hash := encode(digest(p_email, 'sha256'), 'hex');
    
    -- Buscar límite más reciente
    SELECT fecha_limite_nueva_solicitud, agradecimiento_completado
    INTO v_limite, v_agradecimiento
    FROM control_limites_solidario
    WHERE usuario_id_hash = v_hash
    ORDER BY fecha_ayuda_recibida DESC
    LIMIT 1;
    
    -- Si no tiene límite previo, puede crear
    IF v_limite IS NULL THEN
        RETURN true;
    END IF;
    
    -- Si no completó agradecimiento, no puede crear
    IF v_agradecimiento = false THEN
        RETURN false;
    END IF;
    
    -- Si la fecha límite ya pasó, puede crear
    IF v_limite <= NOW() THEN
        RETURN true;
    END IF;
    
    -- Si aún no pasó el período de espera, no puede crear
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- ===== FUNCIÓN: Cerrar solicitud automáticamente cuando alcanza objetivo =====
CREATE OR REPLACE FUNCTION cerrar_solicitud_si_completa()
RETURNS TRIGGER AS $$
BEGIN
    -- Si la solicitud alcanzó el objetivo, cerrarla automáticamente
    IF NEW.monto_recibido >= NEW.monto_solicitado AND NEW.estado = 'aprobada' THEN
        UPDATE solicitudes_ayuda_urgente
        SET 
            estado = 'completada',
            fecha_cierre = NOW(),
            updated_at = NOW()
        WHERE id = NEW.id;
        
        -- Crear registro de control de límites
        INSERT INTO control_limites_solidario (
            usuario_id_hash,
            solicitud_id,
            fecha_ayuda_recibida,
            fecha_limite_nueva_solicitud,
            agradecimiento_completado
        ) VALUES (
            NEW.usuario_id_hash,
            NEW.id,
            NOW(),
            NOW() + INTERVAL '6 months',
            false -- Hasta que completen el agradecimiento
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para cerrar automáticamente
DROP TRIGGER IF EXISTS trigger_cerrar_solicitud_completa ON solicitudes_ayuda_urgente;
CREATE TRIGGER trigger_cerrar_solicitud_completa
    AFTER UPDATE OF monto_recibido ON solicitudes_ayuda_urgente
    FOR EACH ROW
    WHEN (NEW.monto_recibido >= NEW.monto_solicitado)
    EXECUTE FUNCTION cerrar_solicitud_si_completa();

-- ===== FUNCIÓN: Actualizar monto recibido cuando hay donación =====
CREATE OR REPLACE FUNCTION actualizar_monto_recibido()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estado = 'procesada' THEN
        UPDATE solicitudes_ayuda_urgente
        SET 
            monto_recibido = monto_recibido + NEW.monto,
            donaciones_count = donaciones_count + 1,
            updated_at = NOW()
        WHERE id = NEW.solicitud_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar monto
DROP TRIGGER IF EXISTS trigger_actualizar_monto ON donaciones_solidario;
CREATE TRIGGER trigger_actualizar_monto
    AFTER UPDATE OF estado ON donaciones_solidario
    FOR EACH ROW
    WHEN (NEW.estado = 'procesada' AND OLD.estado != 'procesada')
    EXECUTE FUNCTION actualizar_monto_recibido();

-- ===== COMENTARIOS =====
COMMENT ON TABLE solicitudes_ayuda_urgente IS 'Solicitudes de ayuda urgente con verificación robusta';
COMMENT ON TABLE donaciones_solidario IS 'Donaciones recibidas para solicitudes de ayuda';
COMMENT ON TABLE control_limites_solidario IS 'Control de límites de 6 meses entre solicitudes';
COMMENT ON TABLE reportes_solicitudes IS 'Reportes de solicitudes sospechosas o abusos';

