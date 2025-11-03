-- ===== AGREGAR NUEVAS COMUNIDADES A LA TABLA =====
-- Ejecutar en Supabase SQL Editor para registrar las nuevas comunidades

-- Insertar comunidad Otakus Anime/Manga
INSERT INTO comunidades (nombre, slug, descripcion, activa)
VALUES (
    'Otakus - Anime y Manga',
    'otakus-anime-manga',
    'Comunidad para personas que aman el anime y manga sin ser juzgadas',
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Insertar comunidad Gamers
INSERT INTO comunidades (nombre, slug, descripcion, activa)
VALUES (
    'Gamers - Videojuegos',
    'gamers-videojuegos',
    'Comunidad para gamers que comparten su pasión por los videojuegos sin ser juzgados',
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Verificar que se insertaron correctamente
SELECT nombre, slug, activa FROM comunidades 
WHERE slug IN ('otakus-anime-manga', 'gamers-videojuegos')
ORDER BY nombre;

