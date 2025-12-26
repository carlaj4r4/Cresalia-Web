-- ===== AGREGAR COLUMNAS DE PREFERENCIAS DE CUMPLEAÑOS A COMPRADORES =====
-- Ejecuta este SQL en Supabase SQL Editor si las columnas no existen

-- Agregar columnas si no existen
ALTER TABLE compradores
    ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE,
    ADD COLUMN IF NOT EXISTS acepta_publico BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS acepta_descuento BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS mensaje_publico TEXT,
    ADD COLUMN IF NOT EXISTS fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Crear índice para búsquedas por fecha de nacimiento (útil para cumpleaños)
CREATE INDEX IF NOT EXISTS idx_compradores_fecha_nacimiento 
    ON compradores(fecha_nacimiento) 
    WHERE fecha_nacimiento IS NOT NULL;

-- Crear índice para compradores que aceptan ser mostrados públicamente
CREATE INDEX IF NOT EXISTS idx_compradores_acepta_publico 
    ON compradores(acepta_publico) 
    WHERE acepta_publico = true;

-- Comentarios de documentación
COMMENT ON COLUMN compradores.fecha_nacimiento IS 'Fecha de nacimiento del comprador para celebrar cumpleaños';
COMMENT ON COLUMN compradores.acepta_publico IS 'Si el comprador acepta ser mostrado públicamente en cumpleaños';
COMMENT ON COLUMN compradores.acepta_descuento IS 'Si el comprador acepta recibir descuentos en su cumpleaños';
COMMENT ON COLUMN compradores.mensaje_publico IS 'Mensaje opcional que el comprador quiere compartir en su cumpleaños';
