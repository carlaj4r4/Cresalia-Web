-- Script para crear SOLO la tabla que falta: jobs_estadisticas_empleados
-- Ejecutar esto si la tabla no existe y genera error

-- ===== TABLA: ESTADÍSTICAS DE EMPLEADOS =====
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

-- Crear índice
CREATE INDEX IF NOT EXISTS idx_jobs_stats_empleado ON jobs_estadisticas_empleados(empleado_id);

-- Habilitar RLS
ALTER TABLE jobs_estadisticas_empleados ENABLE ROW LEVEL SECURITY;

-- Eliminar política si existe antes de crearla
DROP POLICY IF EXISTS "Cualquiera puede leer estadísticas empleados" ON jobs_estadisticas_empleados;

-- Crear política
CREATE POLICY "Cualquiera puede leer estadísticas empleados" 
    ON jobs_estadisticas_empleados FOR SELECT 
    USING (true);

-- Comentario
COMMENT ON TABLE jobs_estadisticas_empleados IS 'Estadísticas agregadas de empleados (calificaciones promedio, categorías).';


