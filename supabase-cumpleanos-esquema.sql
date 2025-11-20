-- ============================================================
-- CONFIGURACIÓN DE CUMPLEAÑOS PARA COMPRADORES Y TIENDAS
-- Ejecutar una sola vez en Supabase
-- ============================================================

BEGIN;

-- 1. Extender tabla de compradores
-- IMPORTANTE: Si tu tabla se llama diferente (ej: "usuarios", "buyers", etc.), 
-- cambiá "compradores" por el nombre real de tu tabla
ALTER TABLE compradores
    ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE,
    ADD COLUMN IF NOT EXISTS acepta_cumple_publico BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS acepta_cumple_descuento BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS mensaje_cumple_publico TEXT,
    ADD COLUMN IF NOT EXISTS cumple_ultima_notificacion TIMESTAMP WITH TIME ZONE;

-- 2. Extender tabla de tenants (tiendas/servicios)
-- ⚠️ OPCIONAL: Solo ejecuta esto si tenés una tabla llamada "tenants"
-- Si no tenés esta tabla, comentá o eliminá este bloque
-- ALTER TABLE tenants
--     ADD COLUMN IF NOT EXISTS fecha_nacimiento_responsable DATE,
--     ADD COLUMN IF NOT EXISTS acepta_cumple_home BOOLEAN DEFAULT FALSE,
--     ADD COLUMN IF NOT EXISTS acepta_cumple_beneficio BOOLEAN DEFAULT FALSE,
--     ADD COLUMN IF NOT EXISTS cumple_ultima_notificacion TIMESTAMP WITH TIME ZONE;

-- Si tu tabla de tiendas tiene otro nombre, cambiá "tenants" por el nombre real
-- Ejemplo: ALTER TABLE tiendas ...

-- 3. Tabla de historial de celebraciones y cupones
CREATE TABLE IF NOT EXISTS cumpleanos_historial (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT CHECK (tipo IN ('usuario', 'tenant')) NOT NULL,
    referencia_slug TEXT NOT NULL, -- email usuario o slug tienda
    fecha DATE NOT NULL,
    cupón_generado TEXT,
    beneficio TEXT,
    mensaje TEXT,
    enviado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cumpleanos_historial_tipo_fecha
    ON cumpleanos_historial(tipo, fecha DESC);

-- 4. Interacciones públicas (abrazos y mensajes)
CREATE TABLE IF NOT EXISTS cumpleanos_interacciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referencia TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN ('abrazo', 'mensaje')) NOT NULL,
    autor TEXT,
    mensaje TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cumpleanos_interacciones_referencia
    ON cumpleanos_interacciones(referencia, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cumpleanos_interacciones_tipo
    ON cumpleanos_interacciones(tipo);

COMMIT;


