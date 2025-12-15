-- ===== CREAR TODAS LAS TABLAS NECESARIAS EN SUPABASE =====
-- Ejecutá esto en Supabase SQL Editor para crear todas las tablas de una vez
-- 
-- PASOS:
-- 1. Andá a tu proyecto en Supabase
-- 2. Click en "SQL Editor" (en el menú lateral)
-- 3. Copiá y pegá TODO este código
-- 4. Click en "Run" (▶️)
-- 5. Esperá a que termine
-- 6. ¡Listo! Todas las tablas están creadas
--
-- ⚠️ IMPORTANTE: Este script se puede ejecutar múltiples veces sin problemas
--    Usa "IF NOT EXISTS" para evitar errores si las tablas ya existen

-- ===========================================
-- TABLA 1: COMPRADORES
-- ===========================================
CREATE TABLE IF NOT EXISTS compradores (
    -- ID único del comprador
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Conexión con el usuario de Supabase Auth
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Información básica del comprador
    nombre_completo TEXT NOT NULL,
    email TEXT NOT NULL,
    
    -- Información opcional
    telefono TEXT,
    
    -- Direcciones (JSON flexible)
    direccion_principal JSONB DEFAULT '{
        "calle": "",
        "ciudad": "",
        "provincia": "",
        "codigo_postal": "",
        "pais": "Argentina"
    }'::jsonb,
    
    direcciones_adicionales JSONB DEFAULT '[]'::jsonb,
    
    -- Favoritos (array de IDs de productos)
    favoritos JSONB DEFAULT '[]'::jsonb,
    
    -- Estado del comprador
    activo BOOLEAN DEFAULT true,
    
    -- Fechas
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultima_compra TIMESTAMP WITH TIME ZONE,
    
    -- Estadísticas
    total_compras INTEGER DEFAULT 0,
    
    -- Asegurar que un usuario solo tenga un perfil de comprador
    CONSTRAINT compradores_user_id_unique UNIQUE (user_id)
);

-- Índices para compradores
CREATE INDEX IF NOT EXISTS idx_compradores_user_id ON compradores(user_id);
CREATE INDEX IF NOT EXISTS idx_compradores_email ON compradores(email);
CREATE INDEX IF NOT EXISTS idx_compradores_activo ON compradores(activo);
CREATE INDEX IF NOT EXISTS idx_compradores_fecha_registro ON compradores(fecha_registro DESC);

-- Habilitar seguridad para compradores
ALTER TABLE compradores ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para compradores
DROP POLICY IF EXISTS "compradores_ver_su_perfil" ON compradores;
CREATE POLICY "compradores_ver_su_perfil" 
    ON compradores FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "compradores_actualizar_su_perfil" ON compradores;
CREATE POLICY "compradores_actualizar_su_perfil" 
    ON compradores FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "compradores_crear_su_perfil" ON compradores;
CREATE POLICY "compradores_crear_su_perfil" 
    ON compradores FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "compradores_no_eliminar_perfil" ON compradores;
CREATE POLICY "compradores_no_eliminar_perfil" 
    ON compradores FOR DELETE 
    USING (false);

-- ===========================================
-- TABLA 2: TIENDAS
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
    plan TEXT NOT NULL DEFAULT 'basico' CHECK (plan IN ('basico', 'pro', 'premium', 'free')),
    
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

-- Índices para tiendas
CREATE INDEX IF NOT EXISTS idx_tiendas_user_id ON tiendas(user_id);
CREATE INDEX IF NOT EXISTS idx_tiendas_subdomain ON tiendas(subdomain);
CREATE INDEX IF NOT EXISTS idx_tiendas_email ON tiendas(email);
CREATE INDEX IF NOT EXISTS idx_tiendas_plan ON tiendas(plan);
CREATE INDEX IF NOT EXISTS idx_tiendas_activa ON tiendas(activa);

-- Habilitar seguridad para tiendas
ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para tiendas
DROP POLICY IF EXISTS "usuarios_ver_su_tienda" ON tiendas;
CREATE POLICY "usuarios_ver_su_tienda" 
    ON tiendas FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "usuarios_actualizar_su_tienda" ON tiendas;
CREATE POLICY "usuarios_actualizar_su_tienda" 
    ON tiendas FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "usuarios_crear_su_tienda" ON tiendas;
CREATE POLICY "usuarios_crear_su_tienda" 
    ON tiendas FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "usuarios_no_eliminar_tienda" ON tiendas;
CREATE POLICY "usuarios_no_eliminar_tienda" 
    ON tiendas FOR DELETE 
    USING (false);

-- Trigger para actualizar timestamp en tiendas
CREATE OR REPLACE FUNCTION actualizar_timestamp_tiendas() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_actualizar_timestamp_tiendas ON tiendas;
CREATE TRIGGER trigger_actualizar_timestamp_tiendas 
    BEFORE UPDATE ON tiendas 
    FOR EACH ROW 
    EXECUTE FUNCTION actualizar_timestamp_tiendas();

-- ===========================================
-- VERIFICAR QUE SE CREARON CORRECTAMENTE
-- ===========================================
SELECT 
    '✅ Tablas creadas correctamente' as resultado,
    (SELECT COUNT(*) FROM compradores) as total_compradores,
    (SELECT COUNT(*) FROM tiendas) as total_tiendas;

-- Si ves "total_compradores: 0" y "total_tiendas: 0" está bien
-- Significa que las tablas existen pero están vacías
-- Si ves un error, copiá el mensaje y contactá a soporte
