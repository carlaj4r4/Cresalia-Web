CREATE TABLE IF NOT EXISTS tiendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_tienda TEXT NOT NULL,
    email TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'basico' CHECK (plan IN ('basico', 'pro', 'premium')),
    subdomain TEXT UNIQUE NOT NULL,
    activa BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    configuracion JSONB DEFAULT '{"colores": {"primario": "#2563EB", "secundario": "#7C3AED"}, "contacto": {"telefono": "", "whatsapp": "", "direccion": ""}, "negocio": {"descripcion": "", "categoria": "", "horarios": ""}}'::jsonb,
    CONSTRAINT tiendas_user_id_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_tiendas_user_id ON tiendas(user_id);
CREATE INDEX IF NOT EXISTS idx_tiendas_subdomain ON tiendas(subdomain);
CREATE INDEX IF NOT EXISTS idx_tiendas_email ON tiendas(email);
CREATE INDEX IF NOT EXISTS idx_tiendas_plan ON tiendas(plan);
CREATE INDEX IF NOT EXISTS idx_tiendas_activa ON tiendas(activa);

ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios_ver_su_tienda" ON tiendas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usuarios_actualizar_su_tienda" ON tiendas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "usuarios_crear_su_tienda" ON tiendas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "usuarios_no_eliminar_tienda" ON tiendas FOR DELETE USING (false);

CREATE OR REPLACE FUNCTION actualizar_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_timestamp BEFORE UPDATE ON tiendas FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();




















