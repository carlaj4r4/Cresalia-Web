-- ===== HABILITAR RLS EN TABLAS EXISTENTES DE CRESALIA =====
-- VERSIÓN CORREGIDA - SIN ERRORES DE TIPOS DE DATOS

-- ===== TABLAS PRINCIPALES (SIEMPRE EXISTEN) =====
ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE compradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;

-- ===== COMUNIDADES (SI EXISTEN) =====
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

-- ===== HISTORIALES (SI EXISTEN) =====
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

-- ===== SUSCRIPCIONES (SI EXISTEN) =====
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'suscripciones') THEN
        ALTER TABLE suscripciones ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ===== FEEDBACKS (SI EXISTEN) =====
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

-- ===== SISTEMA DE TURNOS (SI EXISTEN) =====
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

-- ===== UBICACIONES (SI EXISTEN) =====
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ubicaciones_tiendas') THEN
        ALTER TABLE ubicaciones_tiendas ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ===== POLÍTICAS DE SEGURIDAD CORREGIDAS =====

-- Política para tiendas (CORREGIDA - usando email en lugar de user_id)
DROP POLICY IF EXISTS "Users can only see their own tienda" ON tiendas;
CREATE POLICY "Users can only see their own tienda" ON tiendas
    FOR ALL USING (auth.jwt() ->> 'email' = email);

-- Política para compradores (CORREGIDA - usando email)
DROP POLICY IF EXISTS "Users can only see their own comprador data" ON compradores;
CREATE POLICY "Users can only see their own comprador data" ON compradores
    FOR ALL USING (auth.jwt() ->> 'email' = email);

-- Política para productos (CORREGIDA - usando email del propietario)
DROP POLICY IF EXISTS "Users can only manage their own productos" ON productos;
CREATE POLICY "Users can only manage their own productos" ON productos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tiendas 
            WHERE tiendas.id = productos.tienda_id 
            AND tiendas.email = auth.jwt() ->> 'email'
        )
    );

-- Política para servicios (CORREGIDA - usando email del propietario)
DROP POLICY IF EXISTS "Users can only manage their own servicios" ON servicios;
CREATE POLICY "Users can only manage their own servicios" ON servicios
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tiendas 
            WHERE tiendas.id = servicios.tienda_id 
            AND tiendas.email = auth.jwt() ->> 'email'
        )
    );

-- ===== POLÍTICAS PARA TABLAS OPCIONALES (CORREGIDAS) =====

-- Política para comunidad de vendedores (si existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'comunidad_vendedores') THEN
        DROP POLICY IF EXISTS "Users can only see their own comunidad data" ON comunidad_vendedores;
        CREATE POLICY "Users can only see their own comunidad data" ON comunidad_vendedores
            FOR ALL USING (auth.jwt() ->> 'email' = vendedor_email);
    END IF;
END $$;

-- Política para comunidad de compradores (si existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'comunidad_compradores') THEN
        DROP POLICY IF EXISTS "Users can only see their own comprador comunidad data" ON comunidad_compradores;
        CREATE POLICY "Users can only see their own comprador comunidad data" ON comunidad_compradores
            FOR ALL USING (auth.jwt() ->> 'email' = comprador_email);
    END IF;
END $$;

-- Política para historial de ventas (si existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'historial_ventas') THEN
        DROP POLICY IF EXISTS "Users can only see their own historial_ventas" ON historial_ventas;
        CREATE POLICY "Users can only see their own historial_ventas" ON historial_ventas
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM tiendas 
                    WHERE tiendas.id::text = historial_ventas.tienda_id 
                    AND tiendas.email = auth.jwt() ->> 'email'
                )
            );
    END IF;
END $$;

-- Política para historial de compras (si existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'historial_compras') THEN
        DROP POLICY IF EXISTS "Users can only see their own historial_compras" ON historial_compras;
        CREATE POLICY "Users can only see their own historial_compras" ON historial_compras
            FOR ALL USING (auth.jwt() ->> 'email' = comprador_email);
    END IF;
END $$;

-- Política para suscripciones (si existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'suscripciones') THEN
        DROP POLICY IF EXISTS "Users can only see their own suscripciones" ON suscripciones;
        CREATE POLICY "Users can only see their own suscripciones" ON suscripciones
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM tiendas 
                    WHERE tiendas.id::text = suscripciones.tienda_id 
                    AND tiendas.email = auth.jwt() ->> 'email'
                )
            );
    END IF;
END $$;

-- Política para feedbacks (si existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'feedbacks_generales') THEN
        DROP POLICY IF EXISTS "Users can only see their own feedbacks" ON feedbacks_generales;
        CREATE POLICY "Users can only see their own feedbacks" ON feedbacks_generales
            FOR ALL USING (auth.jwt() ->> 'email' = usuario_email);
    END IF;
END $$;

-- Política para valoraciones (si existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'valoraciones_tiendas') THEN
        DROP POLICY IF EXISTS "Users can only see their own valoraciones" ON valoraciones_tiendas;
        CREATE POLICY "Users can only see their own valoraciones" ON valoraciones_tiendas
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM tiendas 
                    WHERE tiendas.id::text = valoraciones_tiendas.tienda_id 
                    AND tiendas.email = auth.jwt() ->> 'email'
                )
            );
    END IF;
END $$;

-- ===== VERIFICACIÓN FINAL =====
-- Para verificar que RLS está habilitado en las tablas existentes:
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as "RLS Habilitado"
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true
ORDER BY tablename;

-- Mostrar todas las tablas que existen:
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





