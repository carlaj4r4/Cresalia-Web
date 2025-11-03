-- ===== SISTEMA DE FEEDBACKS PARA COMUNIDADES =====
-- Feedbacks opcionales de usuarios sobre las comunidades

-- Tabla de feedbacks
CREATE TABLE IF NOT EXISTS feedbacks_comunidades (
    id SERIAL PRIMARY KEY,
    comunidad_slug VARCHAR(255) REFERENCES comunidades(slug),
    
    -- Usuario anónimo (hash)
    autor_hash VARCHAR(255), -- Opcional, para saber si es del mismo usuario
    
    -- Contenido del feedback
    tipo_feedback VARCHAR(50) NOT NULL CHECK (tipo_feedback IN ('ayuda', 'agradecimiento', 'consejo', 'sugerencia_comunidad', 'reporte_problema', 'otro')),
    mensaje TEXT NOT NULL,
    
    -- Métricas (opcionales)
    ayudó BOOLEAN, -- "¿Te ayudó esta comunidad?"
    calificacion INTEGER CHECK (calificacion >= 1 AND calificacion <= 5),
    
    -- Estado
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'leido', 'respondido', 'archivado')),
    respuesta TEXT, -- Respuesta de CRISLA
    fecha_respuesta TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_feedbacks_comunidad ON feedbacks_comunidades(comunidad_slug, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_tipo ON feedbacks_comunidades(tipo_feedback);
CREATE INDEX IF NOT EXISTS idx_feedbacks_estado ON feedbacks_comunidades(estado);

-- RLS: Lectura pública para crear feedbacks
ALTER TABLE feedbacks_comunidades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crear_feedbacks_publico" ON feedbacks_comunidades
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "lectura_feedbacks_admin" ON feedbacks_comunidades
    FOR SELECT
    USING (true); -- Se filtrará en el panel de admin

COMMENT ON TABLE feedbacks_comunidades IS 'Feedbacks opcionales de usuarios sobre las comunidades';

