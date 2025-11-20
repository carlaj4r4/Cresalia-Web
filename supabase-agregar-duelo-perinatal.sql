-- Inserta la nueva comunidad "Duelo Perinatal y Fertilidad".
-- Ejecuta este archivo una sola vez en Supabase.

INSERT INTO comunidades (nombre, slug, descripcion) VALUES
('Duelo Perinatal y Fertilidad', 'duelo-perinatal', 'Acompañamiento para pérdidas gestacionales, neonatales y tratamientos de fertilidad')
ON CONFLICT (slug) DO NOTHING;



