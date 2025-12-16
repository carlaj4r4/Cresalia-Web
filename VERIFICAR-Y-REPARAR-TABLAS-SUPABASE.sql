-- ===== VERIFICAR Y REPARAR TABLAS EN SUPABASE =====
-- Este script verifica si las tablas existen y las crea si no existen
-- Ejecutá esto en Supabase SQL Editor

-- ===========================================
-- PASO 1: VERIFICAR QUÉ TABLAS EXISTEN
-- ===========================================
SELECT 
    '📋 Tablas en el schema public:' as info,
    table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ===========================================
-- PASO 2: VERIFICAR ESPECÍFICAMENTE COMPRADORES Y TIENDAS
-- ===========================================
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'compradores')
        THEN '✅ Tabla compradores EXISTE'
        ELSE '❌ Tabla compradores NO EXISTE'
    END as estado_compradores,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tiendas')
        THEN '✅ Tabla tiendas EXISTE'
        ELSE '❌ Tabla tiendas NO EXISTE'
    END as estado_tiendas;

-- ===========================================
-- PASO 3: CREAR TABLA COMPRADORES SI NO EXISTE
-- ===========================================
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

-- Índices para compradores
CREATE INDEX IF NOT EXISTS idx_compradores_user_id ON compradores(user_id);
CREATE INDEX IF NOT EXISTS idx_compradores_email ON compradores(email);
CREATE INDEX IF NOT EXISTS idx_compradores_activo ON compradores(activo);
CREATE INDEX IF NOT EXISTS idx_compradores_fecha_registro ON compradores(fecha_registro DESC);

-- Habilitar RLS
ALTER TABLE compradores ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
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
-- PASO 4: CREAR TABLA TIENDAS SI NO EXISTE
-- ===========================================
CREATE TABLE IF NOT EXISTS tiendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_tienda TEXT NOT NULL,
    email TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'basico' CHECK (plan IN ('basico', 'pro', 'premium', 'free')),
    subdomain TEXT UNIQUE NOT NULL,
    activa BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    configuracion JSONB DEFAULT '{"colores": {"primario": "#2563EB", "secundario": "#7C3AED"}, "contacto": {"telefono": "", "whatsapp": "", "direccion": ""}, "negocio": {"descripcion": "", "categoria": "", "horarios": ""}}'::jsonb,
    CONSTRAINT tiendas_user_id_unique UNIQUE (user_id)
);

-- Índices para tiendas
CREATE INDEX IF NOT EXISTS idx_tiendas_user_id ON tiendas(user_id);
CREATE INDEX IF NOT EXISTS idx_tiendas_subdomain ON tiendas(subdomain);
CREATE INDEX IF NOT EXISTS idx_tiendas_email ON tiendas(email);
CREATE INDEX IF NOT EXISTS idx_tiendas_plan ON tiendas(plan);
CREATE INDEX IF NOT EXISTS idx_tiendas_activa ON tiendas(activa);

-- Habilitar RLS
ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
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
-- PASO 5: VERIFICAR FINAL
-- ===========================================
SELECT 
    '✅ VERIFICACIÓN FINAL' as resultado,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'compradores')
        THEN '✅ compradores existe'
        ELSE '❌ compradores NO existe'
    END as compradores,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tiendas')
        THEN '✅ tiendas existe'
        ELSE '❌ tiendas NO existe'
    END as tiendas,
    (SELECT COUNT(*) FROM compradores) as total_compradores,
    (SELECT COUNT(*) FROM tiendas) as total_tiendas;

-- ===========================================
-- PASO 6: VERIFICAR RLS (Row Level Security)
-- ===========================================
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ RLS habilitado'
        ELSE '❌ RLS deshabilitado'
    END as rls_estado
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('compradores', 'tiendas');

-- ===========================================
-- PASO 7: VERIFICAR POLÍTICAS RLS
-- ===========================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('compradores', 'tiendas')
ORDER BY tablename, policyname;
