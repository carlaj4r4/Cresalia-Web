-- ===== CREAR BUCKET DE STORAGE PARA AVATARS =====
-- Este script crea el bucket de Supabase Storage para guardar avatares/logos de tiendas

-- Paso 1: Crear el bucket (ejecutar en Supabase Dashboard → Storage)
-- NOTA: Esto se debe hacer manualmente desde el Dashboard, pero aquí está el SQL equivalente

-- Crear bucket si no existe (requiere permisos de administrador)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true, -- Público para que las imágenes sean accesibles
    2097152, -- 2MB límite
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Paso 2: Crear política para que los usuarios puedan subir sus propios avatares
CREATE POLICY "Usuarios pueden subir sus propios avatares"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Paso 3: Crear política para que todos puedan leer avatares (públicos)
CREATE POLICY "Avatares son públicos para lectura"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Paso 4: Crear política para que los usuarios puedan actualizar sus propios avatares
CREATE POLICY "Usuarios pueden actualizar sus propios avatares"
ON storage.objects
FOR UPDATE
USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Paso 5: Crear política para que los usuarios puedan eliminar sus propios avatares
CREATE POLICY "Usuarios pueden eliminar sus propios avatares"
ON storage.objects
FOR DELETE
USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
