-- ===== CREAR TABLA TIENDAS EN SUPABASE =====
-- Ejecutá esto en Supabase SQL Editor si te aparece el error "Tabla no encontrada"
-- 
-- PASOS:
-- 1. Andá a tu proyecto en Supabase
-- 2. Click en "SQL Editor" (en el menú lateral)
-- 3. Copiá y pegá TODO este código
-- 4. Click en "Run" (▶️)
-- 5. Esperá a que termine
-- 6. Intentá registrar de nuevo

-- ===== CREAR TABLA TIENDAS =====
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

-- ===== CREAR ÍNDICES (para búsquedas rápidas) =====
CREATE INDEX IF NOT EXISTS idx_tiendas_user_id ON tiendas(user_id);
CREATE INDEX IF NOT EXISTS idx_tiendas_subdomain ON tiendas(subdomain);
CREATE INDEX IF NOT EXISTS idx_tiendas_email ON tiendas(email);
CREATE INDEX IF NOT EXISTS idx_tiendas_plan ON tiendas(plan);
CREATE INDEX IF NOT EXISTS idx_tiendas_activa ON tiendas(activa);

-- ===== HABILITAR SEGURIDAD (RLS) =====
ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;

-- ===== CREAR POLÍTICAS DE SEGURIDAD =====
-- Los usuarios solo pueden ver y editar su propia tienda

-- Política: Usuarios pueden ver su propia tienda
DROP POLICY IF EXISTS "usuarios_ver_su_tienda" ON tiendas;
CREATE POLICY "usuarios_ver_su_tienda" 
    ON tiendas FOR SELECT 
    USING (auth.uid() = user_id);

-- Política: Usuarios pueden actualizar su propia tienda
DROP POLICY IF EXISTS "usuarios_actualizar_su_tienda" ON tiendas;
CREATE POLICY "usuarios_actualizar_su_tienda" 
    ON tiendas FOR UPDATE 
    USING (auth.uid() = user_id);

-- Política: Usuarios pueden crear su propia tienda
DROP POLICY IF EXISTS "usuarios_crear_su_tienda" ON tiendas;
CREATE POLICY "usuarios_crear_su_tienda" 
    ON tiendas FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Política: Nadie puede eliminar tiendas (solo desactivarlas)
DROP POLICY IF EXISTS "usuarios_no_eliminar_tienda" ON tiendas;
CREATE POLICY "usuarios_no_eliminar_tienda" 
    ON tiendas FOR DELETE 
    USING (false);

-- ===== CREAR TRIGGER PARA ACTUALIZAR TIMESTAMP =====
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

-- ===== VERIFICAR QUE SE CREÓ CORRECTAMENTE =====
-- Esto te va a mostrar si la tabla se creó bien
SELECT 
    '✅ Tabla tiendas creada correctamente' as resultado,
    COUNT(*) as total_tiendas
FROM tiendas;

-- Si ves "total_tiendas: 0" está bien, significa que la tabla existe pero está vacía
-- Si ves un error, copiá el mensaje y contactá a soporte
