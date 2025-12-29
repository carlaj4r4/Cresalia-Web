-- ===== AGREGAR CAMPO avatar_url A TABLA COMPRADORES =====
-- Ejecuta este SQL en Supabase SQL Editor para agregar soporte de avatares

-- Verificar si la columna ya existe antes de agregarla
DO $$ 
BEGIN
    -- Agregar columna avatar_url si no existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'compradores' 
        AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE compradores 
        ADD COLUMN avatar_url TEXT;
        
        COMMENT ON COLUMN compradores.avatar_url IS 'URL de la foto de perfil del comprador (almacenada en Supabase Storage)';
        
        RAISE NOTICE '✅ Columna avatar_url agregada a la tabla compradores';
    ELSE
        RAISE NOTICE 'ℹ️ La columna avatar_url ya existe en la tabla compradores';
    END IF;
END $$;

-- Crear índice para optimizar búsquedas por avatar_url
CREATE INDEX IF NOT EXISTS idx_compradores_avatar_url ON compradores(avatar_url) WHERE avatar_url IS NOT NULL;

-- Verificar que la columna se agregó correctamente
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'compradores' 
AND column_name = 'avatar_url';

