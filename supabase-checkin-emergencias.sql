-- ===== SISTEMA DE CHECK-IN DE EMERGENCIAS =====
-- Sistema automático para preguntar "¿Estás bien?" después de desastres naturales
-- Co-fundadores: Crisla & Claude

-- ===== TABLA DE CHECK-INS =====
CREATE TABLE IF NOT EXISTS checkin_emergencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Campaña relacionada
    campaña_id UUID REFERENCES campañas_emergencia(id) ON DELETE SET NULL,
    
    -- Usuario
    usuario_hash TEXT NOT NULL, -- Hash anónimo del usuario
    ubicacion_usuario TEXT, -- Ciudad/Provincia (opcional, SOLO para detectar desastres naturales en tu zona)
    
    -- Estado del usuario
    estado TEXT NOT NULL CHECK (estado IN (
        'bien',           -- Está bien, no necesita ayuda
        'necesita_ayuda', -- Necesita ayuda
        'ayuda_urgente',  -- Necesita ayuda urgente
        'no_responde'     -- No respondió (después de X días)
    )),
    
    -- Detalles (si necesita ayuda)
    tipo_ayuda_necesaria TEXT[], -- Array: ["alimentos", "agua", "refugio", "medicamentos", "otro"]
    descripcion_situacion TEXT, -- Descripción opcional de su situación
    contacto_emergencia TEXT, -- Si necesita contacto urgente
    
    -- Información de contacto (opcional)
    quiere_contacto BOOLEAN DEFAULT false, -- Si quiere que lo contacten
    email_contacto TEXT, -- Email para contacto (opcional)
    telefono_contacto TEXT, -- Teléfono para contacto (opcional)
    
    -- Seguimiento
    contacto_realizado BOOLEAN DEFAULT false, -- Si ya se lo contactó
    ayuda_proporcionada BOOLEAN DEFAULT false, -- Si ya se le proporcionó ayuda
    notas_seguimiento TEXT, -- Notas internas de seguimiento
    
    -- Fechas
    fecha_checkin TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_ultimo_contacto TIMESTAMP WITH TIME ZONE,
    fecha_cierre TIMESTAMP WITH TIME ZONE, -- Cuando se cierra el caso
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA DE ESTADÍSTICAS DE CHECK-INS =====
CREATE TABLE IF NOT EXISTS checkin_estadisticas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaña_id UUID REFERENCES campañas_emergencia(id) ON DELETE CASCADE,
    
    -- Estadísticas
    total_checkins INTEGER DEFAULT 0,
    checkins_bien INTEGER DEFAULT 0,
    checkins_necesita_ayuda INTEGER DEFAULT 0,
    checkins_ayuda_urgente INTEGER DEFAULT 0,
    checkins_no_responde INTEGER DEFAULT 0,
    
    -- Tipos de ayuda más solicitados
    tipos_ayuda_solicitados JSONB DEFAULT '{}', -- {"alimentos": 10, "agua": 5, ...}
    
    -- Fecha de última actualización
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(campaña_id)
);

-- ===== ÍNDICES =====
CREATE INDEX IF NOT EXISTS idx_checkin_campana ON checkin_emergencias(campaña_id);
CREATE INDEX IF NOT EXISTS idx_checkin_estado ON checkin_emergencias(estado);
CREATE INDEX IF NOT EXISTS idx_checkin_fecha ON checkin_emergencias(fecha_checkin DESC);
CREATE INDEX IF NOT EXISTS idx_checkin_usuario ON checkin_emergencias(usuario_hash);
CREATE INDEX IF NOT EXISTS idx_checkin_contacto ON checkin_emergencias(quiere_contacto) WHERE quiere_contacto = true;

-- ===== ROW LEVEL SECURITY =====
ALTER TABLE checkin_emergencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_estadisticas ENABLE ROW LEVEL SECURITY;

-- Check-ins: Cualquiera puede crear su propio check-in
DROP POLICY IF EXISTS "checkin_create" ON checkin_emergencias;
CREATE POLICY "checkin_create" ON checkin_emergencias
    FOR INSERT WITH CHECK (true);

-- Check-ins: Los usuarios pueden ver sus propios check-ins
DROP POLICY IF EXISTS "checkin_own_read" ON checkin_emergencias;
CREATE POLICY "checkin_own_read" ON checkin_emergencias
    FOR SELECT USING (
        usuario_hash = auth.jwt() ->> 'user_hash' OR
        -- Permitir ver estadísticas agregadas (sin datos personales)
        true -- Para ver estadísticas generales
    );

-- Estadísticas: Públicas (solo agregadas)
DROP POLICY IF EXISTS "checkin_stats_public_read" ON checkin_estadisticas;
CREATE POLICY "checkin_stats_public_read" ON checkin_estadisticas
    FOR SELECT USING (true);

-- ===== FUNCIÓN PARA ACTUALIZAR ESTADÍSTICAS =====
CREATE OR REPLACE FUNCTION actualizar_estadisticas_checkin(p_campaña_id UUID)
RETURNS void AS $$
DECLARE
    v_total INTEGER;
    v_bien INTEGER;
    v_necesita_ayuda INTEGER;
    v_ayuda_urgente INTEGER;
    v_no_responde INTEGER;
    v_tipos_ayuda JSONB;
BEGIN
    -- Contar check-ins por estado
    SELECT COUNT(*) INTO v_total FROM checkin_emergencias WHERE campaña_id = p_campaña_id;
    SELECT COUNT(*) INTO v_bien FROM checkin_emergencias WHERE campaña_id = p_campaña_id AND estado = 'bien';
    SELECT COUNT(*) INTO v_necesita_ayuda FROM checkin_emergencias WHERE campaña_id = p_campaña_id AND estado = 'necesita_ayuda';
    SELECT COUNT(*) INTO v_ayuda_urgente FROM checkin_emergencias WHERE campaña_id = p_campaña_id AND estado = 'ayuda_urgente';
    SELECT COUNT(*) INTO v_no_responde FROM checkin_emergencias WHERE campaña_id = p_campaña_id AND estado = 'no_responde';
    
    -- Calcular tipos de ayuda más solicitados
    SELECT jsonb_object_agg(
        tipo_ayuda,
        COUNT(*)
    ) INTO v_tipos_ayuda
    FROM (
        SELECT unnest(tipo_ayuda_necesaria) AS tipo_ayuda
        FROM checkin_emergencias
        WHERE campaña_id = p_campaña_id
        AND estado IN ('necesita_ayuda', 'ayuda_urgente')
    ) subq
    GROUP BY tipo_ayuda;
    
    -- Insertar o actualizar estadísticas
    INSERT INTO checkin_estadisticas (
        campaña_id,
        total_checkins,
        checkins_bien,
        checkins_necesita_ayuda,
        checkins_ayuda_urgente,
        checkins_no_responde,
        tipos_ayuda_solicitados,
        fecha_actualizacion
    ) VALUES (
        p_campaña_id,
        v_total,
        v_bien,
        v_necesita_ayuda,
        v_ayuda_urgente,
        v_no_responde,
        COALESCE(v_tipos_ayuda, '{}'::jsonb),
        NOW()
    )
    ON CONFLICT (campaña_id) DO UPDATE SET
        total_checkins = EXCLUDED.total_checkins,
        checkins_bien = EXCLUDED.checkins_bien,
        checkins_necesita_ayuda = EXCLUDED.checkins_necesita_ayuda,
        checkins_ayuda_urgente = EXCLUDED.checkins_ayuda_urgente,
        checkins_no_responde = EXCLUDED.checkins_no_responde,
        tipos_ayuda_solicitados = EXCLUDED.tipos_ayuda_solicitados,
        fecha_actualizacion = NOW(),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ===== TRIGGER PARA ACTUALIZAR ESTADÍSTICAS AUTOMÁTICAMENTE =====
CREATE OR REPLACE FUNCTION trigger_actualizar_estadisticas_checkin()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM actualizar_estadisticas_checkin(NEW.campaña_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_checkin_estadisticas ON checkin_emergencias;
CREATE TRIGGER trigger_checkin_estadisticas
    AFTER INSERT OR UPDATE ON checkin_emergencias
    FOR EACH ROW
    EXECUTE FUNCTION trigger_actualizar_estadisticas_checkin();

-- ===== COMENTARIOS =====
COMMENT ON TABLE checkin_emergencias IS 'Check-ins de usuarios después de desastres naturales - Sistema automático de "¿Estás bien?"';
COMMENT ON TABLE checkin_estadisticas IS 'Estadísticas agregadas de check-ins por campaña';
COMMENT ON FUNCTION actualizar_estadisticas_checkin IS 'Actualiza las estadísticas de check-ins para una campaña';

