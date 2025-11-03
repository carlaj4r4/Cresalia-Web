-- ===== SISTEMA DE VALIDACIÓN DE IDENTIDADES =====
-- Para prevenir trolls y asegurar que quienes dicen ser de una comunidad vulnerable realmente lo sean
-- Sistema de verificación opcional pero recomendado para comunidades sensibles

-- Tabla de solicitudes de verificación
CREATE TABLE IF NOT EXISTS solicitudes_verificacion (
    id SERIAL PRIMARY KEY,
    comunidad_slug VARCHAR(255) NOT NULL REFERENCES comunidades(slug),
    
    -- Usuario que solicita verificación
    autor_hash VARCHAR(255) NOT NULL, -- Hash del usuario del foro
    autor_alias VARCHAR(100), -- Alias que usa en el foro
    
    -- Información de verificación (opcional, según método)
    metodo_verificacion VARCHAR(50) NOT NULL CHECK (metodo_verificacion IN ('email_verificado', 'documento_privado', 'testimonio_detallado', 'referencia_profesional', 'otro')),
    
    -- Evidencia (encriptada/hasheada, NO almacenamos datos sensibles directamente)
    evidencia_hash TEXT, -- Hash de la evidencia (no reversible)
    descripcion_evidencia TEXT, -- Descripción de QUÉ se envió (sin datos sensibles)
    
    -- Estado de verificación
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_revision', 'verificado', 'rechazado', 'expirado')),
    motivo_rechazo TEXT,
    
    -- Quién verificó
    verificador_email VARCHAR(255) DEFAULT 'CRISLA',
    fecha_verificacion TIMESTAMP WITH TIME ZONE,
    
    -- Privacidad
    datos_eliminados BOOLEAN DEFAULT false, -- Si se eliminaron los datos sensibles después de verificar
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de usuarios verificados
CREATE TABLE IF NOT EXISTS usuarios_verificados_comunidades (
    id SERIAL PRIMARY KEY,
    comunidad_slug VARCHAR(255) NOT NULL REFERENCES comunidades(slug),
    autor_hash VARCHAR(255) NOT NULL,
    
    -- Nivel de verificación
    nivel_verificacion VARCHAR(50) DEFAULT 'basico' CHECK (nivel_verificacion IN ('basico', 'medio', 'alto')),
    
    -- Información de verificación (sin datos sensibles)
    metodo_usado VARCHAR(50),
    fecha_verificacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verificador_email VARCHAR(255),
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    fecha_expiracion TIMESTAMP WITH TIME ZONE, -- Si la verificación expira
    
    UNIQUE(comunidad_slug, autor_hash)
);

-- Tabla de reportes de identidad falsa
CREATE TABLE IF NOT EXISTS reportes_identidad_falsa (
    id SERIAL PRIMARY KEY,
    comunidad_slug VARCHAR(255) NOT NULL REFERENCES comunidades(slug),
    
    -- Quién reporta
    reportador_hash VARCHAR(255) NOT NULL,
    
    -- A quién se reporta
    reportado_hash VARCHAR(255) NOT NULL,
    
    -- Motivo del reporte
    motivo TEXT NOT NULL,
    evidencia TEXT, -- Descripción de la evidencia (sin datos sensibles)
    
    -- Estado
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_revision', 'verificado', 'rechazado')),
    accion_tomada TEXT,
    
    -- Quién revisó
    revisor_email VARCHAR(255),
    fecha_revision TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_solicitudes_hash ON solicitudes_verificacion(autor_hash, comunidad_slug);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado ON solicitudes_verificacion(estado);
CREATE INDEX IF NOT EXISTS idx_verificados_hash ON usuarios_verificados_comunidades(autor_hash, comunidad_slug);
CREATE INDEX IF NOT EXISTS idx_reportes_hash ON reportes_identidad_falsa(reportado_hash, estado);

-- RLS
ALTER TABLE solicitudes_verificacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_verificados_comunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes_identidad_falsa ENABLE ROW LEVEL SECURITY;

-- Políticas: Solo lectura para admins
CREATE POLICY "lectura_solicitudes_admin" ON solicitudes_verificacion FOR SELECT USING (true);
CREATE POLICY "crear_solicitudes_publico" ON solicitudes_verificacion FOR INSERT WITH CHECK (true);
CREATE POLICY "lectura_verificados_publica" ON usuarios_verificados_comunidades FOR SELECT USING (true);
CREATE POLICY "crear_reportes_publico" ON reportes_identidad_falsa FOR INSERT WITH CHECK (true);
CREATE POLICY "lectura_reportes_admin" ON reportes_identidad_falsa FOR SELECT USING (true);

-- Función para verificar si un usuario está verificado
CREATE OR REPLACE FUNCTION usuario_esta_verificado(p_hash VARCHAR, p_comunidad VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM usuarios_verificados_comunidades
        WHERE autor_hash = p_hash
        AND comunidad_slug = p_comunidad
        AND activo = true
        AND (fecha_expiracion IS NULL OR fecha_expiracion > NOW())
    );
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE solicitudes_verificacion IS 'Solicitudes de verificación de identidad para comunidades sensibles';
COMMENT ON TABLE usuarios_verificados_comunidades IS 'Usuarios verificados en cada comunidad';
COMMENT ON TABLE reportes_identidad_falsa IS 'Reportes de posibles identidades falsas o trolls';

