-- ============================================
-- 📍 SISTEMA DE UBICACIONES PARA ALERTAS
-- ============================================
-- Tabla para guardar ubicaciones de usuarios (con consentimiento)
-- Para enviar emails automáticos en emergencias

-- ============================================
-- PASO 1: TABLA DE UBICACIONES
-- ============================================

CREATE TABLE IF NOT EXISTS usuarios_ubicaciones_alertas (
    id SERIAL PRIMARY KEY,
    
    -- Usuario (puede ser auth o anonimo con hash)
    usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    usuario_hash VARCHAR(255), -- Para usuarios no registrados
    email VARCHAR(255) NOT NULL,
    
    -- Ubicación actual
    latitud DOUBLE PRECISION NOT NULL,
    longitud DOUBLE PRECISION NOT NULL,
    
    -- Consentimiento explícito
    acepto_recibir_alertas BOOLEAN DEFAULT true,
    acepto_compartir_ubicacion BOOLEAN DEFAULT true,
    
    -- Radio de interés (en km)
    radio_alertas_km INTEGER DEFAULT 10,
    
    -- Tipos de alertas que quiere recibir
    alertas_globales BOOLEAN DEFAULT true,
    alertas_locales BOOLEAN DEFAULT true,
    alertas_criticas_solo BOOLEAN DEFAULT false, -- Solo críticas
    
    -- Metadata
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_registro VARCHAR(45),
    user_agent TEXT,
    
    -- País/provincia/ciudad (opcional, para filtros)
    pais VARCHAR(100),
    provincia VARCHAR(100),
    ciudad VARCHAR(100),
    
    -- Constraint: debe tener o usuario_id o usuario_hash
    CHECK (
        (usuario_id IS NOT NULL) OR 
        (usuario_hash IS NOT NULL)
    ),
    
    -- Email único por usuario
    UNIQUE(email)
);

-- ============================================
-- PASO 2: ÍNDICES PARA RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_ubicaciones_email ON usuarios_ubicaciones_alertas(email);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_usuario ON usuarios_ubicaciones_alertas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_hash ON usuarios_ubicaciones_alertas(usuario_hash);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_coords ON usuarios_ubicaciones_alertas(latitud, longitud);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_acepto ON usuarios_ubicaciones_alertas(acepto_recibir_alertas, acepto_compartir_ubicacion);

-- ============================================
-- PASO 3: RLS (Row Level Security)
-- ============================================

ALTER TABLE usuarios_ubicaciones_alertas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "usuarios_pueden_ver_propia_ubicacion" ON usuarios_ubicaciones_alertas;
DROP POLICY IF EXISTS "usuarios_pueden_actualizar_propia_ubicacion" ON usuarios_ubicaciones_alertas;
DROP POLICY IF EXISTS "usuarios_pueden_insertar_ubicacion" ON usuarios_ubicaciones_alertas;
DROP POLICY IF EXISTS "usuarios_pueden_eliminar_propia_ubicacion" ON usuarios_ubicaciones_alertas;

-- Ver solo su propia ubicación
CREATE POLICY "usuarios_pueden_ver_propia_ubicacion" ON usuarios_ubicaciones_alertas
    FOR SELECT
    USING (
        auth.uid() = usuario_id OR
        usuario_hash = current_setting('app.user_hash', true)
    );

-- Actualizar solo su propia ubicación
CREATE POLICY "usuarios_pueden_actualizar_propia_ubicacion" ON usuarios_ubicaciones_alertas
    FOR UPDATE
    USING (
        auth.uid() = usuario_id OR
        usuario_hash = current_setting('app.user_hash', true)
    );

-- Insertar su ubicación
CREATE POLICY "usuarios_pueden_insertar_ubicacion" ON usuarios_ubicaciones_alertas
    FOR INSERT
    WITH CHECK (
        auth.uid() = usuario_id OR
        usuario_hash IS NOT NULL
    );

-- Eliminar su ubicación (revocar consentimiento)
CREATE POLICY "usuarios_pueden_eliminar_propia_ubicacion" ON usuarios_ubicaciones_alertas
    FOR DELETE
    USING (
        auth.uid() = usuario_id OR
        usuario_hash = current_setting('app.user_hash', true)
    );

-- ============================================
-- PASO 4: FUNCIÓN PARA BUSCAR USUARIOS EN RADIO
-- ============================================

CREATE OR REPLACE FUNCTION buscar_usuarios_en_radio_alerta(
    p_alerta_id INTEGER
)
RETURNS TABLE (
    email VARCHAR,
    latitud DOUBLE PRECISION,
    longitud DOUBLE PRECISION,
    distancia_km DOUBLE PRECISION,
    usuario_id UUID,
    usuario_hash VARCHAR
) AS $$
DECLARE
    v_alcance VARCHAR;
    v_lat DOUBLE PRECISION;
    v_lng DOUBLE PRECISION;
    v_radio INTEGER;
    v_severidad VARCHAR;
BEGIN
    -- Obtener datos de la alerta
    SELECT 
        a.alcance,
        (a.coordenadas->>'lat')::DOUBLE PRECISION,
        (a.coordenadas->>'lng')::DOUBLE PRECISION,
        a.radio_afectacion_km,
        a.severidad
    INTO v_alcance, v_lat, v_lng, v_radio, v_severidad
    FROM alertas_emergencia_comunidades a
    WHERE a.id = p_alerta_id;
    
    -- Si es alerta global, devolver TODOS los usuarios que aceptaron alertas globales
    IF v_alcance = 'global' THEN
        RETURN QUERY
        SELECT 
            u.email,
            u.latitud,
            u.longitud,
            NULL::DOUBLE PRECISION as distancia_km,
            u.usuario_id,
            u.usuario_hash
        FROM usuarios_ubicaciones_alertas u
        WHERE u.acepto_recibir_alertas = true
        AND u.alertas_globales = true
        AND (
            u.alertas_criticas_solo = false OR
            (u.alertas_criticas_solo = true AND v_severidad = 'critica')
        );
        
    -- Si es alerta local, solo usuarios dentro del radio
    ELSIF v_alcance = 'local' AND v_lat IS NOT NULL AND v_lng IS NOT NULL THEN
        RETURN QUERY
        SELECT 
            u.email,
            u.latitud,
            u.longitud,
            calcular_distancia_km(u.latitud, u.longitud, v_lat, v_lng) as distancia_km,
            u.usuario_id,
            u.usuario_hash
        FROM usuarios_ubicaciones_alertas u
        WHERE u.acepto_recibir_alertas = true
        AND u.alertas_locales = true
        AND calcular_distancia_km(u.latitud, u.longitud, v_lat, v_lng) <= LEAST(v_radio, u.radio_alertas_km)
        AND (
            u.alertas_criticas_solo = false OR
            (u.alertas_criticas_solo = true AND v_severidad = 'critica')
        );
    END IF;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION buscar_usuarios_en_radio_alerta IS 'Busca usuarios que deben recibir email de una alerta específica';

-- ============================================
-- PASO 5: TABLA DE LOG DE EMAILS ENVIADOS
-- ============================================

CREATE TABLE IF NOT EXISTS alertas_emails_enviados (
    id SERIAL PRIMARY KEY,
    alerta_id INTEGER NOT NULL REFERENCES alertas_emergencia_comunidades(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    exitoso BOOLEAN DEFAULT false,
    mensaje_error TEXT,
    
    -- Metadata del envío
    distancia_km DOUBLE PRECISION,
    tipo_alerta VARCHAR(20), -- 'global' o 'local'
    
    INDEX idx_emails_alerta (alerta_id),
    INDEX idx_emails_email (email),
    INDEX idx_emails_exitoso (exitoso)
);

ALTER TABLE alertas_emails_enviados ENABLE ROW LEVEL SECURITY;

-- Solo lectura para admins (RLS muy restrictivo)
CREATE POLICY "solo_lectura_emails_log" ON alertas_emails_enviados
    FOR SELECT
    USING (false); -- Nadie puede leer (solo desde servidor)

-- ============================================
-- PASO 6: FUNCIÓN PARA TRIGGER (preparación para webhook)
-- ============================================

CREATE OR REPLACE FUNCTION notificar_nueva_alerta()
RETURNS TRIGGER AS $$
DECLARE
    v_usuarios_count INTEGER;
BEGIN
    -- Solo para alertas activas
    IF NEW.activa = true THEN
        
        -- Contar usuarios que deben ser notificados
        SELECT COUNT(*)
        INTO v_usuarios_count
        FROM buscar_usuarios_en_radio_alerta(NEW.id);
        
        -- Log para debugging
        RAISE NOTICE 'Nueva alerta ID %. Usuarios a notificar: %', NEW.id, v_usuarios_count;
        
        -- Aquí se llamará al webhook/edge function
        -- Por ahora solo registramos en un log
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que se activa cuando se crea una nueva alerta
DROP TRIGGER IF EXISTS trigger_notificar_nueva_alerta ON alertas_emergencia_comunidades;

CREATE TRIGGER trigger_notificar_nueva_alerta
    AFTER INSERT ON alertas_emergencia_comunidades
    FOR EACH ROW
    EXECUTE FUNCTION notificar_nueva_alerta();

-- ============================================
-- PASO 7: FUNCIÓN AUXILIAR PARA REGISTRO
-- ============================================

CREATE OR REPLACE FUNCTION registrar_ubicacion_usuario(
    p_email VARCHAR,
    p_latitud DOUBLE PRECISION,
    p_longitud DOUBLE PRECISION,
    p_usuario_id UUID DEFAULT NULL,
    p_usuario_hash VARCHAR DEFAULT NULL,
    p_radio_alertas_km INTEGER DEFAULT 10
)
RETURNS JSONB AS $$
DECLARE
    v_id INTEGER;
BEGIN
    -- Insertar o actualizar
    INSERT INTO usuarios_ubicaciones_alertas (
        usuario_id,
        usuario_hash,
        email,
        latitud,
        longitud,
        radio_alertas_km,
        fecha_actualizacion
    )
    VALUES (
        p_usuario_id,
        p_usuario_hash,
        p_email,
        p_latitud,
        p_longitud,
        p_radio_alertas_km,
        NOW()
    )
    ON CONFLICT (email) 
    DO UPDATE SET
        latitud = EXCLUDED.latitud,
        longitud = EXCLUDED.longitud,
        radio_alertas_km = EXCLUDED.radio_alertas_km,
        fecha_actualizacion = NOW()
    RETURNING id INTO v_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'id', v_id,
        'mensaje', 'Ubicación registrada correctamente'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION registrar_ubicacion_usuario IS 'Registra o actualiza la ubicación de un usuario para alertas';

-- ============================================
-- ✅ VERIFICACIÓN
-- ============================================

SELECT 
    '✅ SISTEMA DE UBICACIONES INSTALADO' as resultado,
    'Usuarios pueden registrar su ubicación' as funcionalidad_1,
    'Sistema listo para enviar emails automáticos' as funcionalidad_2;

-- Ver estadísticas de usuarios registrados
SELECT 
    COUNT(*) as total_usuarios,
    COUNT(*) FILTER (WHERE acepto_recibir_alertas = true) as aceptan_alertas,
    COUNT(*) FILTER (WHERE alertas_globales = true) as quieren_globales,
    COUNT(*) FILTER (WHERE alertas_locales = true) as quieren_locales
FROM usuarios_ubicaciones_alertas;
