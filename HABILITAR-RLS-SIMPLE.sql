-- ===== HABILITAR RLS - VERSIÓN SÚPER SIMPLE =====
-- Solo habilitar RLS sin políticas complejas por ahora

-- ===== HABILITAR RLS EN TABLAS PRINCIPALES =====
ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE compradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;

-- ===== HABILITAR RLS EN TABLAS OPCIONALES (SI EXISTEN) =====
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'comunidad_vendedores') THEN
        ALTER TABLE comunidad_vendedores ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'comunidad_compradores') THEN
        ALTER TABLE comunidad_compradores ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reportes_comunidad') THEN
        ALTER TABLE reportes_comunidad ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'historial_ventas') THEN
        ALTER TABLE historial_ventas ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'historial_compras') THEN
        ALTER TABLE historial_compras ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'suscripciones') THEN
        ALTER TABLE suscripciones ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'feedbacks_generales') THEN
        ALTER TABLE feedbacks_generales ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'valoraciones_tiendas') THEN
        ALTER TABLE valoraciones_tiendas ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'turnos_reservados') THEN
        ALTER TABLE turnos_reservados ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'configuracion_turnos') THEN
        ALTER TABLE configuracion_turnos ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ubicaciones_tiendas') THEN
        ALTER TABLE ubicaciones_tiendas ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ===== POLÍTICAS BÁSICAS Y SEGURAS =====

-- Política para tiendas (solo usuarios autenticados)
DROP POLICY IF EXISTS "Authenticated users can see tiendas" ON tiendas;
CREATE POLICY "Authenticated users can see tiendas" ON tiendas
    FOR ALL TO authenticated USING (true);

-- Política para compradores (solo usuarios autenticados)
DROP POLICY IF EXISTS "Authenticated users can see compradores" ON compradores;
CREATE POLICY "Authenticated users can see compradores" ON compradores
    FOR ALL TO authenticated USING (true);

-- Política para productos (solo usuarios autenticados)
DROP POLICY IF EXISTS "Authenticated users can see productos" ON productos;
CREATE POLICY "Authenticated users can see productos" ON productos
    FOR ALL TO authenticated USING (true);

-- Política para servicios (solo usuarios autenticados)
DROP POLICY IF EXISTS "Authenticated users can see servicios" ON servicios;
CREATE POLICY "Authenticated users can see servicios" ON servicios
    FOR ALL TO authenticated USING (true);

-- ===== VERIFICACIÓN =====
-- Verificar que RLS está habilitado
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as "RLS Habilitado"
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true
ORDER BY tablename;

-- Mostrar estado de todas las tablas
SELECT 
    schemaname, 
    tablename,
    CASE 
        WHEN rowsecurity = true THEN '✅ RLS Habilitado'
        ELSE '❌ RLS NO Habilitado'
    END as "Estado RLS"
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;





