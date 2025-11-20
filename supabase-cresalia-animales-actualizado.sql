-- ===== CRESALIA ANIMALES - ACTUALIZACIÓN =====
-- Agregar: subida de archivos (imágenes/videos) y cumpleaños de animales
-- Fecha: Diciembre 2024

-- ===== ACTUALIZAR TABLA: ANIMALES QUE NECESITAN AYUDA =====
-- Agregar fecha de adopción o rescate para calcular "cumpleaños"
ALTER TABLE animales_necesitan_ayuda 
ADD COLUMN IF NOT EXISTS fecha_adopcion_rescate DATE;

-- Cambiar fotos de TEXT[] a JSONB para almacenar referencias a Supabase Storage
-- Las fotos ahora son: [{type: 'image'|'video', url: 'storage_path', uploaded_at: timestamp}]
ALTER TABLE animales_necesitan_ayuda 
ALTER COLUMN fotos TYPE JSONB USING CASE 
    WHEN fotos IS NULL THEN NULL
    WHEN jsonb_typeof(to_jsonb(fotos)) = 'array' THEN 
        COALESCE(
            (SELECT jsonb_agg(
                CASE 
                    WHEN value::text LIKE 'http%' THEN jsonb_build_object('type', 'image', 'url', value::text, 'uploaded_at', NOW())
                    ELSE jsonb_build_object('type', 'image', 'url', value::text, 'uploaded_at', NOW())
                END
            ) FROM jsonb_array_elements_text(to_jsonb(fotos))),
            '[]'::jsonb
        )
    ELSE '[]'::jsonb
END;

-- Si la conversión falla, simplemente crear la columna nueva
DO $$ 
BEGIN
    -- Intentar actualizar
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'animales_necesitan_ayuda' 
        AND column_name = 'fotos' 
        AND data_type = 'jsonb'
    ) THEN
        -- Si fotos existe como TEXT[], crear una nueva columna
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'animales_necesitan_ayuda' 
            AND column_name = 'fotos'
        ) THEN
            ALTER TABLE animales_necesitan_ayuda RENAME COLUMN fotos TO fotos_old;
        END IF;
        
        -- Crear nueva columna JSONB
        ALTER TABLE animales_necesitan_ayuda 
        ADD COLUMN fotos JSONB DEFAULT '[]'::jsonb;
        
        -- Migrar datos si existe fotos_old
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'animales_necesitan_ayuda' 
            AND column_name = 'fotos_old'
        ) THEN
            UPDATE animales_necesitan_ayuda 
            SET fotos = (
                SELECT jsonb_agg(
                    jsonb_build_object('type', 'image', 'url', value, 'uploaded_at', NOW())
                )
                FROM unnest(fotos_old) AS value
            )
            WHERE fotos_old IS NOT NULL AND array_length(fotos_old, 1) > 0;
            
            ALTER TABLE animales_necesitan_ayuda DROP COLUMN IF EXISTS fotos_old;
        END IF;
    END IF;
END $$;

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

-- ===== VERIFICAR QUE TODO ESTÁ BIEN =====
-- No hacer nada, solo verificar que las columnas existen
DO $$
BEGIN
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
    ) THEN
        RAISE EXCEPTION 'Columna fotos no existe';
    END IF;
    
    RAISE NOTICE '✅ Actualización completada correctamente';
END $$;

