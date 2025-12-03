-- ===== TABLA DE COMPRADORES - CRESALIA =====
-- Ejecuta este SQL en Supabase SQL Editor
-- Este script crea la tabla completa para compradores

-- Crear tabla de compradores si no existe
CREATE TABLE IF NOT EXISTS compradores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_completo TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT,
    direccion_principal JSONB DEFAULT '{"calle": "", "ciudad": "", "provincia": "", "codigo_postal": "", "pais": "Argentina"}'::jsonb,
    direcciones_adicionales JSONB DEFAULT '[]'::jsonb,
    favoritos JSONB DEFAULT '[]'::jsonb,
    activo BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultima_compra TIMESTAMP WITH TIME ZONE,
    total_compras INTEGER DEFAULT 0,
    CONSTRAINT compradores_user_id_unique UNIQUE (user_id),
    CONSTRAINT compradores_email_unique UNIQUE (email)
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_compradores_user_id ON compradores(user_id);
CREATE INDEX IF NOT EXISTS idx_compradores_email ON compradores(email);
CREATE INDEX IF NOT EXISTS idx_compradores_activo ON compradores(activo);
CREATE INDEX IF NOT EXISTS idx_compradores_fecha_registro ON compradores(fecha_registro);

-- Habilitar Row Level Security (RLS)
ALTER TABLE compradores ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (RLS)
-- Los compradores solo pueden ver su propio perfil
CREATE POLICY "compradores_ver_su_perfil" 
    ON compradores FOR SELECT 
    USING (auth.uid() = user_id);

-- Los compradores solo pueden actualizar su propio perfil
CREATE POLICY "compradores_actualizar_su_perfil" 
    ON compradores FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Los compradores solo pueden crear su propio perfil
CREATE POLICY "compradores_crear_su_perfil" 
    ON compradores FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Los compradores NO pueden eliminar su perfil (solo desactivar)
CREATE POLICY "compradores_no_eliminar_perfil" 
    ON compradores FOR DELETE 
    USING (false);

-- Permitir que el sistema (service_role) pueda leer todos los compradores
-- (Esto es necesario para funciones administrativas)
-- Nota: Esto requiere usar la clave service_role, no la anon key

-- Comentarios de la tabla
COMMENT ON TABLE compradores IS 'Tabla de compradores/clientes de Cresalia';
COMMENT ON COLUMN compradores.user_id IS 'ID del usuario en auth.users';
COMMENT ON COLUMN compradores.nombre_completo IS 'Nombre completo del comprador';
COMMENT ON COLUMN compradores.email IS 'Email del comprador (único)';
COMMENT ON COLUMN compradores.direccion_principal IS 'Dirección principal en formato JSON';
COMMENT ON COLUMN compradores.direcciones_adicionales IS 'Array de direcciones adicionales en formato JSON';
COMMENT ON COLUMN compradores.favoritos IS 'Array de IDs de productos favoritos en formato JSON';
COMMENT ON COLUMN compradores.activo IS 'Indica si el comprador está activo';
COMMENT ON COLUMN compradores.fecha_registro IS 'Fecha de registro del comprador';
COMMENT ON COLUMN compradores.ultima_compra IS 'Fecha de la última compra realizada';
COMMENT ON COLUMN compradores.total_compras IS 'Total de compras realizadas';

