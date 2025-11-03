-- ============================================
-- 📊 SISTEMA DE FEEDBACKS PARA TIENDAS
-- Cresalia Platform - Supabase Migration
-- ============================================
-- Autor: Carla & Claude
-- Versión: 1.0
-- Fecha: Octubre 2024
-- ============================================

-- ===== TABLA PRINCIPAL DE FEEDBACKS =====
CREATE TABLE IF NOT EXISTS tienda_feedbacks (
    id BIGSERIAL PRIMARY KEY,
    tienda_id VARCHAR(100) NOT NULL,
    usuario_nombre VARCHAR(255) NOT NULL,
    usuario_email VARCHAR(255),
    calificacion INTEGER NOT NULL CHECK(calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    aprobado BOOLEAN DEFAULT FALSE,
    respuesta_tienda TEXT,
    fecha_respuesta TIMESTAMP WITH TIME ZONE,
    util_count INTEGER DEFAULT 0,
    verificado BOOLEAN DEFAULT FALSE,
    
    -- Metadatos adicionales
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== TABLA DE ESTADÍSTICAS DE FEEDBACKS =====
CREATE TABLE IF NOT EXISTS tienda_feedback_stats (
    tienda_id VARCHAR(100) PRIMARY KEY,
    total_feedbacks INTEGER DEFAULT 0,
    promedio_calificacion NUMERIC(3,2) DEFAULT 0.00,
    total_5_estrellas INTEGER DEFAULT 0,
    total_4_estrellas INTEGER DEFAULT 0,
    total_3_estrellas INTEGER DEFAULT 0,
    total_2_estrellas INTEGER DEFAULT 0,
    total_1_estrella INTEGER DEFAULT 0,
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ÍNDICES PARA MEJOR RENDIMIENTO =====
CREATE INDEX IF NOT EXISTS idx_tienda_feedbacks_tienda 
    ON tienda_feedbacks(tienda_id);

CREATE INDEX IF NOT EXISTS idx_tienda_feedbacks_fecha 
    ON tienda_feedbacks(fecha_creacion DESC);

CREATE INDEX IF NOT EXISTS idx_tienda_feedbacks_aprobado 
    ON tienda_feedbacks(aprobado);

CREATE INDEX IF NOT EXISTS idx_tienda_feedbacks_calificacion 
    ON tienda_feedbacks(calificacion);

-- ===== COMENTARIOS DESCRIPTIVOS =====
COMMENT ON TABLE tienda_feedbacks IS 
    'Almacena todos los feedbacks/opiniones de clientes sobre tiendas';

COMMENT ON TABLE tienda_feedback_stats IS 
    'Estadísticas agregadas de feedbacks por tienda para mejor rendimiento';

COMMENT ON COLUMN tienda_feedbacks.calificacion IS 
    'Calificación de 1 a 5 estrellas';

COMMENT ON COLUMN tienda_feedbacks.aprobado IS 
    'Si el feedback ha sido aprobado por un moderador';

COMMENT ON COLUMN tienda_feedbacks.verificado IS 
    'Si es una compra verificada';

-- ===== FUNCIÓN PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE =====
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===== TRIGGERS PARA AUTO-ACTUALIZACIÓN =====
CREATE TRIGGER update_tienda_feedbacks_updated_at
    BEFORE UPDATE ON tienda_feedbacks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tienda_feedback_stats_updated_at
    BEFORE UPDATE ON tienda_feedback_stats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===== ROW LEVEL SECURITY (RLS) =====
-- Habilitar RLS para mayor seguridad
ALTER TABLE tienda_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tienda_feedback_stats ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede LEER feedbacks aprobados
CREATE POLICY "Feedbacks aprobados son públicos"
    ON tienda_feedbacks
    FOR SELECT
    USING (aprobado = TRUE);

-- Política: Solo usuarios autenticados pueden CREAR feedbacks
CREATE POLICY "Usuarios autenticados pueden crear feedbacks"
    ON tienda_feedbacks
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Política: Solo admins pueden ACTUALIZAR feedbacks
CREATE POLICY "Solo admins pueden actualizar feedbacks"
    ON tienda_feedbacks
    FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'admin');

-- Política: Estadísticas son públicas para lectura
CREATE POLICY "Estadísticas son públicas"
    ON tienda_feedback_stats
    FOR SELECT
    USING (TRUE);

-- ===== FUNCIÓN PARA ACTUALIZAR ESTADÍSTICAS =====
CREATE OR REPLACE FUNCTION actualizar_estadisticas_feedback(p_tienda_id VARCHAR)
RETURNS VOID AS $$
DECLARE
    v_total INTEGER;
    v_promedio NUMERIC;
    v_5_estrellas INTEGER;
    v_4_estrellas INTEGER;
    v_3_estrellas INTEGER;
    v_2_estrellas INTEGER;
    v_1_estrella INTEGER;
BEGIN
    -- Calcular estadísticas de feedbacks aprobados
    SELECT 
        COUNT(*),
        COALESCE(AVG(calificacion), 0),
        COUNT(*) FILTER (WHERE calificacion = 5),
        COUNT(*) FILTER (WHERE calificacion = 4),
        COUNT(*) FILTER (WHERE calificacion = 3),
        COUNT(*) FILTER (WHERE calificacion = 2),
        COUNT(*) FILTER (WHERE calificacion = 1)
    INTO 
        v_total,
        v_promedio,
        v_5_estrellas,
        v_4_estrellas,
        v_3_estrellas,
        v_2_estrellas,
        v_1_estrella
    FROM tienda_feedbacks
    WHERE tienda_id = p_tienda_id AND aprobado = TRUE;
    
    -- Insertar o actualizar estadísticas
    INSERT INTO tienda_feedback_stats (
        tienda_id,
        total_feedbacks,
        promedio_calificacion,
        total_5_estrellas,
        total_4_estrellas,
        total_3_estrellas,
        total_2_estrellas,
        total_1_estrella,
        ultima_actualizacion
    ) VALUES (
        p_tienda_id,
        v_total,
        v_promedio,
        v_5_estrellas,
        v_4_estrellas,
        v_3_estrellas,
        v_2_estrellas,
        v_1_estrella,
        NOW()
    )
    ON CONFLICT (tienda_id) 
    DO UPDATE SET
        total_feedbacks = v_total,
        promedio_calificacion = v_promedio,
        total_5_estrellas = v_5_estrellas,
        total_4_estrellas = v_4_estrellas,
        total_3_estrellas = v_3_estrellas,
        total_2_estrellas = v_2_estrellas,
        total_1_estrella = v_1_estrella,
        ultima_actualizacion = NOW();
END;
$$ LANGUAGE plpgsql;

-- ===== TRIGGER PARA AUTO-ACTUALIZAR ESTADÍSTICAS =====
CREATE OR REPLACE FUNCTION trigger_actualizar_estadisticas()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar estadísticas cuando se aprueba un feedback
    IF (TG_OP = 'UPDATE' AND NEW.aprobado = TRUE AND OLD.aprobado = FALSE) THEN
        PERFORM actualizar_estadisticas_feedback(NEW.tienda_id);
    END IF;
    
    -- Actualizar estadísticas cuando se crea un feedback aprobado
    IF (TG_OP = 'INSERT' AND NEW.aprobado = TRUE) THEN
        PERFORM actualizar_estadisticas_feedback(NEW.tienda_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_actualizar_estadisticas
    AFTER INSERT OR UPDATE ON tienda_feedbacks
    FOR EACH ROW
    EXECUTE FUNCTION trigger_actualizar_estadisticas();

-- ===== DATOS INICIALES DE EJEMPLO =====
-- Insertar registro inicial para ejemplo-tienda
INSERT INTO tienda_feedback_stats (tienda_id, total_feedbacks, promedio_calificacion)
VALUES ('ejemplo-tienda', 0, 0.00)
ON CONFLICT (tienda_id) DO NOTHING;

-- ===== GRANTS / PERMISOS =====
-- Dar permisos a usuarios autenticados
GRANT SELECT ON tienda_feedbacks TO authenticated;
GRANT INSERT ON tienda_feedbacks TO authenticated;
GRANT SELECT ON tienda_feedback_stats TO authenticated;

-- Dar permisos completos a service_role (para API)
GRANT ALL ON tienda_feedbacks TO service_role;
GRANT ALL ON tienda_feedback_stats TO service_role;

-- ============================================
-- ✅ MIGRACIÓN COMPLETADA
-- ============================================
-- 
-- INSTRUCCIONES PARA EJECUTAR EN SUPABASE:
-- 
-- 1. Ir a tu proyecto en Supabase (https://supabase.com)
-- 2. Ir a SQL Editor (en el menú lateral)
-- 3. Click en "New Query"
-- 4. Copiar y pegar todo este archivo
-- 5. Click en "Run" o presionar Ctrl+Enter
-- 6. ¡Listo! Las tablas estarán creadas
--
-- VERIFICAR:
-- - Ve a "Table Editor" y verás las nuevas tablas
-- - Ve a "Database" > "Functions" y verás las funciones
-- - Ve a "Authentication" > "Policies" y verás las políticas RLS
--
-- ============================================

-- 💜 Mensaje final
SELECT '✅ Sistema de Feedbacks instalado correctamente en Supabase!' AS mensaje,
       '🎉 Ya puedes empezar a recibir opiniones de tus clientes' AS descripcion,
       '💜 Creado con amor por Carla & Claude' AS creditos;















