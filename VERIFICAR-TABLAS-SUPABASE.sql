-- ===== VERIFICAR TABLAS EN SUPABASE =====
-- Ejecuta esto en Supabase SQL Editor para verificar que las tablas existen

-- 1. Ver todas las tablas en el schema public
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Verificar específicamente compradores y tiendas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('compradores', 'tiendas');

-- 3. Ver estructura de la tabla compradores (si existe)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'compradores'
ORDER BY ordinal_position;

-- 4. Ver estructura de la tabla tiendas (si existe)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'tiendas'
ORDER BY ordinal_position;

-- 5. Verificar si hay triggers configurados
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table IN ('compradores', 'tiendas');

