-- ===== CREAR TABLA COMPRADORES EN SUPABASE =====
-- Ejecutá esto en Supabase SQL Editor si te aparece el error "Tabla no encontrada"
-- 
-- PASOS:
-- 1. Andá a tu proyecto en Supabase
-- 2. Click en "SQL Editor" (en el menú lateral)
-- 3. Copiá y pegá TODO este código
-- 4. Click en "Run" (▶️)
-- 5. Esperá a que termine
-- 6. Intentá registrar de nuevo
--
-- ⚠️ IMPORTANTE: Este script se puede ejecutar múltiples veces sin problemas
--    Usa "IF NOT EXISTS" para evitar errores si la tabla ya existe
--
-- 💡 TIP: Si necesitás crear ambas tablas (compradores y tiendas),
--    usá el archivo "CREAR-TABLAS-COMPLETAS-SUPABASE.sql" en su lugar

-- ===== CREAR TABLA COMPRADORES =====
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

-- ===== CREAR ÍNDICES (para búsquedas rápidas) =====
CREATE INDEX IF NOT EXISTS idx_compradores_user_id ON compradores(user_id);
CREATE INDEX IF NOT EXISTS idx_compradores_email ON compradores(email);
CREATE INDEX IF NOT EXISTS idx_compradores_activo ON compradores(activo);
CREATE INDEX IF NOT EXISTS idx_compradores_fecha_registro ON compradores(fecha_registro DESC);

-- ===== HABILITAR SEGURIDAD (RLS) =====
ALTER TABLE compradores ENABLE ROW LEVEL SECURITY;

-- ===== CREAR POLÍTICAS DE SEGURIDAD =====
-- Los usuarios solo pueden ver y editar su propio perfil

-- Política: Usuarios pueden ver su propio perfil
DROP POLICY IF EXISTS "compradores_ver_su_perfil" ON compradores;
CREATE POLICY "compradores_ver_su_perfil" 
    ON compradores FOR SELECT 
    USING (auth.uid() = user_id);

-- Política: Usuarios pueden actualizar su propio perfil
DROP POLICY IF EXISTS "compradores_actualizar_su_perfil" ON compradores;
CREATE POLICY "compradores_actualizar_su_perfil" 
    ON compradores FOR UPDATE 
    USING (auth.uid() = user_id);

-- Política: Usuarios pueden crear su propio perfil
DROP POLICY IF EXISTS "compradores_crear_su_perfil" ON compradores;
CREATE POLICY "compradores_crear_su_perfil" 
    ON compradores FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Política: Nadie puede eliminar perfiles (solo desactivarlos)
DROP POLICY IF EXISTS "compradores_no_eliminar_perfil" ON compradores;
CREATE POLICY "compradores_no_eliminar_perfil" 
    ON compradores FOR DELETE 
    USING (false);

-- ===== CREAR TRIGGER PARA ACTUALIZAR TIMESTAMP =====
CREATE OR REPLACE FUNCTION actualizar_timestamp_compradores() 
RETURNS TRIGGER AS $$
BEGIN
    -- Si se actualiza, actualizar fecha_registro no tiene sentido
    -- Pero podríamos agregar un campo updated_at si lo necesitamos
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===== VERIFICAR QUE SE CREÓ CORRECTAMENTE =====
-- Esto te va a mostrar si la tabla se creó bien
SELECT 
    '✅ Tabla compradores creada correctamente' as resultado,
    COUNT(*) as total_compradores
FROM compradores;

-- Si ves "total_compradores: 0" está bien, significa que la tabla existe pero está vacía
-- Si ves un error, copiá el mensaje y contactá a soporte
