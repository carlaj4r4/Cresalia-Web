-- ===== CRESALIA ANIMALES - ACTUALIZACIÓN (VERSIÓN CORREGIDA) =====
-- Agregar: subida de archivos (imágenes/videos) y cumpleaños de animales
-- Fecha: Diciembre 2024

-- ===== PASO 1: Agregar columna fecha_adopcion_rescate =====
ALTER TABLE animales_necesitan_ayuda 
ADD COLUMN IF NOT EXISTS fecha_adopcion_rescate DATE;

-- ===== PASO 2: Agregar columna temporal para migrar fotos =====
ALTER TABLE animales_necesitan_ayuda 
ADD COLUMN IF NOT EXISTS fotos_nuevo JSONB DEFAULT '[]'::jsonb;

-- ===== PASO 3: Migrar datos de fotos (TEXT[]) a fotos_nuevo (JSONB) =====
-- Si la columna fotos existe y tiene datos, migrarlos
DO $$ 
BEGIN
    -- Verificar si la columna fotos existe como TEXT[]
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'animales_necesitan_ayuda' 
        AND column_name = 'fotos'
        AND data_type = 'ARRAY'
    ) THEN
        -- Migrar datos existentes
        UPDATE animales_necesitan_ayuda 
        SET fotos_nuevo = COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'type', 'image',
                        'url', value,
                        'uploaded_at', NOW()
                    )
                )
                FROM unnest(fotos) AS value
                WHERE fotos IS NOT NULL AND array_length(fotos, 1) > 0
            ),
            '[]'::jsonb
        )
        WHERE fotos IS NOT NULL AND array_length(fotos, 1) > 0;
    END IF;
END $$;

-- ===== PASO 4: Eliminar columna antigua y renombrar la nueva =====
DO $$ 
BEGIN
    -- Si existe la columna fotos (TEXT[]), eliminarla
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'animales_necesitan_ayuda' 
        AND column_name = 'fotos'
        AND data_type = 'ARRAY'
    ) THEN
        ALTER TABLE animales_necesitan_ayuda DROP COLUMN fotos;
    END IF;
    
    -- Renombrar fotos_nuevo a fotos
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'animales_necesitan_ayuda' 
        AND column_name = 'fotos_nuevo'
    ) THEN
        ALTER TABLE animales_necesitan_ayuda RENAME COLUMN fotos_nuevo TO fotos;
    END IF;
END $$;

-- ===== PASO 5: Si fotos no existe, crearla =====
ALTER TABLE animales_necesitan_ayuda 
ADD COLUMN IF NOT EXISTS fotos JSONB DEFAULT '[]'::jsonb;

-- ===== ÍNDICES =====
-- Índice para búsqueda por fecha de adopción/rescate (para cumpleaños)
CREATE INDEX IF NOT EXISTS idx_animales_fecha_adopcion_rescate 
ON animales_necesitan_ayuda(fecha_adopcion_rescate)
WHERE fecha_adopcion_rescate IS NOT NULL;

-- Índice para buscar animales en su "mes de cumpleaños"
CREATE INDEX IF NOT EXISTS idx_animales_mes_cumpleanos 
ON animales_necesitan_ayuda(
    EXTRACT(MONTH FROM fecha_adopcion_rescate),
    EXTRACT(YEAR FROM fecha_adopcion_rescate)
)
WHERE fecha_adopcion_rescate IS NOT NULL;

-- ===== COMENTARIOS =====
COMMENT ON COLUMN animales_necesitan_ayuda.fecha_adopcion_rescate IS 'Fecha de adopción o rescate del animal. Usado para calcular "cumpleaños" (aniversario de adopción/rescate)';
COMMENT ON COLUMN animales_necesitan_ayuda.fotos IS 'Array JSONB de archivos (imágenes/videos) subidos a Supabase Storage. Formato: [{"type": "image|video", "url": "storage_path", "uploaded_at": "timestamp"}]';

-- ===== VERIFICACIÓN FINAL =====
DO $$
BEGIN
    -- Verificar que las columnas existen
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'animales_necesitan_ayuda' 
        AND column_name = 'fecha_adopcion_rescate'
    ) THEN
        RAISE EXCEPTION 'Columna fecha_adopcion_rescate no se creó correctamente';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'animales_necesitan_ayuda' 
        AND column_name = 'fotos'
        AND data_type = 'jsonb'
    ) THEN
        RAISE EXCEPTION 'Columna fotos no existe o no es JSONB';
    END IF;
    
    RAISE NOTICE '✅ Actualización completada correctamente';
END $$;

