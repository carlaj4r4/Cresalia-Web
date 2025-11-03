-- ===== SISTEMA DE MODERACIÓN Y BAN - FORO COMUNIDADES =====
-- Sistema para banear usuarios y moderar contenido

-- Tabla de usuarios baneados
CREATE TABLE IF NOT EXISTS usuarios_baneados_foro (
    id SERIAL PRIMARY KEY,
    autor_hash VARCHAR(255) NOT NULL UNIQUE,
    comunidad_slug VARCHAR(255), -- NULL = baneado de todas las comunidades
    motivo TEXT NOT NULL,
    moderador VARCHAR(255) DEFAULT 'CRISLA',
    fecha_baneo TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_desbaneo TIMESTAMP WITH TIME ZONE, -- NULL = ban permanente
    estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'levantado'))
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_baneados_hash ON usuarios_baneados_foro(autor_hash);
CREATE INDEX IF NOT EXISTS idx_baneados_comunidad ON usuarios_baneados_foro(comunidad_slug);
CREATE INDEX IF NOT EXISTS idx_baneados_estado ON usuarios_baneados_foro(estado);

-- Tabla de moderadores
CREATE TABLE IF NOT EXISTS moderadores_foro (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    comunidades_slug TEXT[], -- Comunidades que puede moderar (NULL = todas)
    nivel VARCHAR(50) DEFAULT 'moderador' CHECK (nivel IN ('moderador', 'super_moderador', 'admin')),
    activo BOOLEAN DEFAULT true,
    fecha_nombramiento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de acciones de moderación (auditoría)
CREATE TABLE IF NOT EXISTS acciones_moderacion (
    id SERIAL PRIMARY KEY,
    moderador_email VARCHAR(255) NOT NULL,
    tipo_accion VARCHAR(50) NOT NULL CHECK (tipo_accion IN ('ocultar_post', 'eliminar_post', 'ocultar_comentario', 'eliminar_comentario', 'banear_usuario', 'desbanear_usuario', 'restaurar_post', 'restaurar_comentario')),
    post_id UUID REFERENCES posts_comunidades(id),
    comentario_id UUID REFERENCES comentarios_comunidades(id),
    autor_hash VARCHAR(255), -- Hash del usuario afectado
    motivo TEXT NOT NULL,
    comunidad_slug VARCHAR(255),
    fecha_accion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para auditoría
CREATE INDEX IF NOT EXISTS idx_acciones_moderador ON acciones_moderacion(moderador_email, fecha_accion DESC);
CREATE INDEX IF NOT EXISTS idx_acciones_hash ON acciones_moderacion(autor_hash);
CREATE INDEX IF NOT EXISTS idx_acciones_comunidad ON acciones_moderacion(comunidad_slug);

-- Función para verificar si un usuario está baneado
CREATE OR REPLACE FUNCTION usuario_esta_baneado(p_hash VARCHAR, p_comunidad VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM usuarios_baneados_foro
        WHERE autor_hash = p_hash
        AND estado = 'activo'
        AND (fecha_desbaneo IS NULL OR fecha_desbaneo > NOW())
        AND (
            comunidad_slug IS NULL -- Baneado de todas
            OR comunidad_slug = p_comunidad -- Baneado de esta comunidad específica
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Política RLS: Solo moderadores/admins pueden ver usuarios baneados
ALTER TABLE usuarios_baneados_foro ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lectura_baneados_publica" ON usuarios_baneados_foro
    FOR SELECT
    USING (true); -- Permitir lectura pública para verificar bans en frontend

-- Política RLS: Solo moderadores pueden modificar
CREATE POLICY "modificar_baneados_moderadores" ON usuarios_baneados_foro
    FOR ALL
    USING (true); -- Se validará en la aplicación con service_role key

-- Política RLS para acciones de moderación
ALTER TABLE acciones_moderacion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lectura_acciones_publica" ON acciones_moderacion
    FOR SELECT
    USING (true); -- Lectura pública para auditoría

-- Ejemplo: Agregar vos como primera moderadora
INSERT INTO moderadores_foro (email, nombre, comunidades_slug, nivel)
VALUES ('crisla@cresalia.com', 'CRISLA', NULL, 'admin') -- NULL = todas las comunidades
ON CONFLICT (email) DO NOTHING;

-- Comentarios
COMMENT ON TABLE usuarios_baneados_foro IS 'Usuarios baneados del foro (por hash para mantener anonimato)';
COMMENT ON TABLE moderadores_foro IS 'Lista de moderadores del foro';
COMMENT ON TABLE acciones_moderacion IS 'Log de todas las acciones de moderación (auditoría)';

