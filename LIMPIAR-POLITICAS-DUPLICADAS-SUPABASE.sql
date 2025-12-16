-- ===== LIMPIAR POLÍTICAS RLS DUPLICADAS =====
-- Este script elimina las políticas duplicadas y deja solo las correctas
-- Ejecutá esto en Supabase SQL Editor

-- ===========================================
-- PASO 1: ELIMINAR POLÍTICAS DUPLICADAS DE COMPRADORES
-- ===========================================

-- Eliminar la política genérica "Authenticated users can see compradores"
DROP POLICY IF EXISTS "Authenticated users can see compradores" ON compradores;

-- Asegurar que solo existan nuestras políticas específicas
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
-- PASO 2: ELIMINAR POLÍTICAS DUPLICADAS DE TIENDAS
-- ===========================================

-- Eliminar la política genérica "Authenticated users can see tiendas"
DROP POLICY IF EXISTS "Authenticated users can see tiendas" ON tiendas;

-- Asegurar que solo existan nuestras políticas específicas
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

-- ===========================================
-- PASO 3: FORZAR REFRESH DEL SCHEMA CACHE
-- ===========================================

-- Hacer una consulta simple para forzar que Supabase actualice el schema cache
SELECT 1 FROM compradores LIMIT 1;
SELECT 1 FROM tiendas LIMIT 1;

-- ===========================================
-- PASO 4: VERIFICAR POLÍTICAS FINALES
-- ===========================================

SELECT 
    '✅ Políticas limpiadas' as resultado,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('compradores', 'tiendas')
ORDER BY tablename, policyname;

-- Deberías ver solo 4 políticas por tabla (SELECT, INSERT, UPDATE, DELETE)
-- Y NO deberías ver "Authenticated users can see..."
