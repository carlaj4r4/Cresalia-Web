-- ===== TABLA DE COMPRADORES - CRESALIA =====
-- Ejecuta este SQL en Supabase SQL Editor

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
    CONSTRAINT compradores_user_id_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_compradores_user_id ON compradores(user_id);
CREATE INDEX IF NOT EXISTS idx_compradores_email ON compradores(email);
CREATE INDEX IF NOT EXISTS idx_compradores_activo ON compradores(activo);

ALTER TABLE compradores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "compradores_ver_su_perfil" ON compradores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "compradores_actualizar_su_perfil" ON compradores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "compradores_crear_su_perfil" ON compradores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "compradores_no_eliminar_perfil" ON compradores FOR DELETE USING (false);




















