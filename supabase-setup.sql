-- ===== CONFIGURACIÓN DE BASE DE DATOS - CRESALIA =====
-- Copia y pega este código COMPLETO en el SQL Editor de Supabase
-- Luego presiona "Run" (▶️)

-- ===========================================
-- PASO 1: Crear la tabla de tiendas
-- ===========================================
CREATE TABLE IF NOT EXISTS tiendas (
    -- ID único de la tienda
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Conexión con el usuario de Supabase Auth
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Información básica de la tienda
    nombre_tienda TEXT NOT NULL,
    email TEXT NOT NULL,
    
    -- Plan contratado
    plan TEXT NOT NULL DEFAULT 'basico' CHECK (plan IN ('basico', 'pro', 'premium')),
    
    -- Subdominio único para la tienda
    subdomain TEXT UNIQUE NOT NULL,
    
    -- Estado de la tienda
    activa BOOLEAN DEFAULT true,
    
    -- Fechas
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Configuración completa de la tienda (JSON flexible)
    configuracion JSONB DEFAULT '{
        "colores": {
            "primario": "#2563EB",
            "secundario": "#7C3AED"
        },
        "contacto": {
            "telefono": "",
            "whatsapp": "",
            "direccion": ""
        },
        "negocio": {
            "descripcion": "",
            "categoria": "",
            "horarios": ""
        }
    }'::jsonb,
    
    -- Asegurar que un usuario solo tenga una tienda
    CONSTRAINT tiendas_user_id_unique UNIQUE (user_id)
);

-- ===========================================
-- PASO 2: Crear índices para rendimiento
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_tiendas_user_id ON tiendas(user_id);
CREATE INDEX IF NOT EXISTS idx_tiendas_subdomain ON tiendas(subdomain);
CREATE INDEX IF NOT EXISTS idx_tiendas_email ON tiendas(email);
CREATE INDEX IF NOT EXISTS idx_tiendas_plan ON tiendas(plan);
CREATE INDEX IF NOT EXISTS idx_tiendas_activa ON tiendas(activa);

-- ===========================================
-- PASO 3: Habilitar Row Level Security (RLS)
-- ===========================================
-- Esto asegura que cada usuario solo vea SU tienda
ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- PASO 4: Crear políticas de seguridad
-- ===========================================

-- Política 1: Los usuarios pueden VER solo su propia tienda
CREATE POLICY "usuarios_ver_su_tienda"
    ON tiendas
    FOR SELECT
    USING (auth.uid() = user_id);

-- Política 2: Los usuarios pueden ACTUALIZAR solo su propia tienda
CREATE POLICY "usuarios_actualizar_su_tienda"
    ON tiendas
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Política 3: Los usuarios pueden CREAR su tienda al registrarse
CREATE POLICY "usuarios_crear_su_tienda"
    ON tiendas
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Política 4: Los usuarios NO pueden eliminar su tienda
-- (Solo los admins de CRESALIA podrán hacerlo)
CREATE POLICY "usuarios_no_eliminar_tienda"
    ON tiendas
    FOR DELETE
    USING (false);

-- ===========================================
-- PASO 5: Crear función para actualizar timestamp
-- ===========================================
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- PASO 6: Crear trigger para auto-actualizar
-- ===========================================
CREATE TRIGGER trigger_actualizar_timestamp
    BEFORE UPDATE ON tiendas
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_timestamp();

-- ===========================================
-- LISTO! 🎉
-- ===========================================
-- Si ves "Success. No rows returned" significa que funcionó perfectamente
-- Ahora ve a "Table Editor" y deberías ver la tabla "tiendas"




















