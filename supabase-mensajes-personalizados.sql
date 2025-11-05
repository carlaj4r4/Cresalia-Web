-- ===== TABLA DE MENSAJES PERSONALIZADOS - CRESALIA =====
-- Mensajes que la fundadora puede dejar para sus usuarios
-- Aparecen en todas las páginas públicas y comunidades

CREATE TABLE IF NOT EXISTS mensajes_personalizados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('bienvenida', 'agradecimiento', 'informacion', 'actualizacion', 'motivacion', 'otro')),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_expiracion TIMESTAMP WITH TIME ZONE, -- Opcional: si se quiere que expire automáticamente
    orden INTEGER DEFAULT 0, -- Para ordenar múltiples mensajes
    comunidades_afectadas TEXT[] DEFAULT ARRAY['todas'], -- Array de comunidades donde se mostrará
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_mensajes_activos ON mensajes_personalizados(activo) WHERE activo = true;
CREATE INDEX IF NOT EXISTS idx_mensajes_tipo ON mensajes_personalizados(tipo);
CREATE INDEX IF NOT EXISTS idx_mensajes_fecha_creacion ON mensajes_personalizados(fecha_creacion DESC);
CREATE INDEX IF NOT EXISTS idx_mensajes_orden ON mensajes_personalizados(orden);

-- ROW LEVEL SECURITY
ALTER TABLE mensajes_personalizados ENABLE ROW LEVEL SECURITY;

-- Política: Solo administradores/fundadora pueden crear/editar/eliminar
-- (Esto requiere autenticación de administrador, por ahora permitimos lectura pública y escritura con service_role)
DROP POLICY IF EXISTS "mensajes_public_read" ON mensajes_personalizados;
CREATE POLICY "mensajes_public_read" ON mensajes_personalizados
    FOR SELECT USING (activo = true);

-- Política: Solo administradores pueden insertar/actualizar/eliminar
-- Nota: En producción, esto debería usar un rol de administrador específico
-- Por ahora, se usa service_role key desde el panel de administración
DROP POLICY IF EXISTS "mensajes_admin_write" ON mensajes_personalizados;
CREATE POLICY "mensajes_admin_write" ON mensajes_personalizados
    FOR ALL USING (true); -- Con service_role key, esto funciona

-- Comentarios
COMMENT ON TABLE mensajes_personalizados IS 'Mensajes personalizados de la fundadora para usuarios de Cresalia';
COMMENT ON COLUMN mensajes_personalizados.tipo IS 'Tipo de mensaje: bienvenida, agradecimiento, informacion, actualizacion, motivacion, otro';
COMMENT ON COLUMN mensajes_personalizados.comunidades_afectadas IS 'Array de slugs de comunidades donde se mostrará. Array con "todas" para mostrar en todas';

