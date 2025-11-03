-- ===== SISTEMA DE ALERTAS DE EMERGENCIA PARA COMUNIDADES =====
-- Alertas de desastres naturales, noticias urgentes, etc.

-- Tabla de alertas de emergencia
CREATE TABLE IF NOT EXISTS alertas_emergencia_comunidades (
    id SERIAL PRIMARY KEY,
    
    -- Tipo de alerta
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN (
        'inundacion', 
        'incendio', 
        'terremoto', 
        'tormenta', 
        'tornado', 
        'tsunami',
        'pandemia',
        'corte_luz',
        'corte_gas',
        'corte_agua',
        'accidente',
        'seguridad',
        'otro'
    )),
    
    -- Ubicación
    pais VARCHAR(100),
    provincia VARCHAR(100),
    ciudad VARCHAR(100),
    coordenadas JSONB, -- {lat: -34.6037, lng: -58.3816}
    radio_afectacion_km INTEGER, -- Radio en kilómetros
    
    -- Contenido
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    severidad VARCHAR(20) DEFAULT 'media' CHECK (severidad IN ('baja', 'media', 'alta', 'critica')),
    
    -- Enlaces útiles
    enlace_oficial TEXT, -- Link a fuente oficial
    enlace_mapa TEXT, -- Link a mapa interactivo
    
    -- Estado
    activa BOOLEAN DEFAULT true,
    verificada BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_expiracion TIMESTAMP WITH TIME ZONE,
    
    -- Creador
    creador_email VARCHAR(255) DEFAULT 'CRISLA',
    
    -- Comunidades afectadas (NULL = todas)
    comunidades_afectadas TEXT[] -- Array de slugs de comunidades
);

-- Tabla de visualizaciones de alertas por usuario
CREATE TABLE IF NOT EXISTS alertas_vistas_usuarios (
    id SERIAL PRIMARY KEY,
    alerta_id INTEGER NOT NULL REFERENCES alertas_emergencia_comunidades(id) ON DELETE CASCADE,
    usuario_hash VARCHAR(255) NOT NULL, -- Hash del usuario (mismo que foro)
    fecha_vista TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(alerta_id, usuario_hash)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_alertas_tipo ON alertas_emergencia_comunidades(tipo, activa);
CREATE INDEX IF NOT EXISTS idx_alertas_activas ON alertas_emergencia_comunidades(activa, fecha_expiracion);
CREATE INDEX IF NOT EXISTS idx_alertas_fecha ON alertas_emergencia_comunidades(fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_alertas_vistas ON alertas_vistas_usuarios(alerta_id, usuario_hash);

-- RLS
ALTER TABLE alertas_emergencia_comunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_vistas_usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas: Lectura pública, escritura solo para admins
CREATE POLICY "lectura_alertas_publica" ON alertas_emergencia_comunidades 
    FOR SELECT 
    USING (activa = true AND (fecha_expiracion IS NULL OR fecha_expiracion > NOW()));

CREATE POLICY "crear_vista_alerta" ON alertas_vistas_usuarios 
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "lectura_vistas_propia" ON alertas_vistas_usuarios 
    FOR SELECT 
    USING (usuario_hash = current_setting('app.user_hash', true));

-- Función para obtener alertas activas
CREATE OR REPLACE FUNCTION obtener_alertas_activas(p_usuario_hash VARCHAR DEFAULT NULL)
RETURNS TABLE (
    id INTEGER,
    tipo VARCHAR,
    titulo VARCHAR,
    descripcion TEXT,
    severidad VARCHAR,
    pais VARCHAR,
    provincia VARCHAR,
    ciudad VARCHAR,
    enlace_oficial TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.tipo,
        a.titulo,
        a.descripcion,
        a.severidad,
        a.pais,
        a.provincia,
        a.ciudad,
        a.enlace_oficial,
        a.fecha_creacion
    FROM alertas_emergencia_comunidades a
    WHERE a.activa = true
    AND (a.fecha_expiracion IS NULL OR a.fecha_expiracion > NOW())
    AND (p_usuario_hash IS NULL OR NOT EXISTS (
        SELECT 1 FROM alertas_vistas_usuarios v
        WHERE v.alerta_id = a.id AND v.usuario_hash = p_usuario_hash
    ))
    ORDER BY 
        CASE a.severidad
            WHEN 'critica' THEN 1
            WHEN 'alta' THEN 2
            WHEN 'media' THEN 3
            WHEN 'baja' THEN 4
        END,
        a.fecha_creacion DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE alertas_emergencia_comunidades IS 'Alertas de emergencia y desastres naturales para mostrar en comunidades';
COMMENT ON TABLE alertas_vistas_usuarios IS 'Registro de alertas ya vistas por usuarios';

