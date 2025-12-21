-- ===== AGREGAR CAMPO DNI A TABLA COMPRADORES =====
-- Ejecuta este SQL en Supabase SQL Editor si querés agregar el campo DNI a la tabla compradores

-- Agregar columna DNI si no existe (opcional)
ALTER TABLE compradores 
ADD COLUMN IF NOT EXISTS dni TEXT;

-- Comentario sobre la columna
COMMENT ON COLUMN compradores.dni IS 'Documento Nacional de Identidad (opcional, privado)';

-- NOTA: Si no querés agregar el campo a la tabla, el sistema guardará el DNI en user_metadata
-- de Supabase Auth, lo cual también es válido y seguro.
