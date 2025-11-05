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

-- Insertar comunidad Madres y Padres Solteros/Viudos
INSERT INTO comunidades (nombre, slug, descripcion, activa)
VALUES (
    'Madres y Padres Solteros/Viudos',
    'madres-padres-solteros',
    'Espacio seguro para quienes crían solos - por elección, viudez o cualquier circunstancia',
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Insertar comunidad Médicos y Enfermeros/as
INSERT INTO comunidades (nombre, slug, descripcion, activa)
VALUES (
    'Médicos y Enfermeros/as',
    'medicos-enfermeros',
    'Refugio para profesionales de la salud que necesitan desahogo y apoyo emocional',
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Insertar comunidad Bomberos
INSERT INTO comunidades (nombre, slug, descripcion, activa)
VALUES (
    'Bomberos',
    'bomberos',
    'Comunidad para bomberos voluntarios y profesionales que arriesgan sus vidas',
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Insertar comunidad Veterinarios
INSERT INTO comunidades (nombre, slug, descripcion, activa)
VALUES (
    'Veterinarios',
    'veterinarios',
    'Refugio para veterinarios que necesitan desahogo y apoyo emocional por eutanasias, burnout y experiencias difíciles',
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Verificar que se insertaron correctamente
SELECT nombre, slug, activa FROM comunidades 
WHERE slug IN ('otakus-anime-manga', 'gamers-videojuegos', 'madres-padres-solteros', 'medicos-enfermeros', 'bomberos', 'veterinarios')
ORDER BY nombre;

