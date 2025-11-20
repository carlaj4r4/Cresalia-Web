/**
 * API Endpoint: Publicaciones de Comunidad Maternidad
 * GET: Obtener publicaciones
 * POST: Crear nueva publicación
 */

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { SUPABASE_URL, SUPABASE_KEY } = process.env;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return res.status(500).json({ error: 'Supabase no configurado' });
    }

    try {
        if (req.method === 'GET') {
            // Obtener publicaciones
            const response = await fetch(`${SUPABASE_URL}/rest/v1/maternidad_publicaciones?order=created_at.desc`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener publicaciones');
            }

            const publicaciones = await response.json();
            return res.status(200).json(publicaciones);

        } else if (req.method === 'POST') {
            // Crear nueva publicación
            const publicacion = req.body;

            const response = await fetch(`${SUPABASE_URL}/rest/v1/maternidad_publicaciones`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    titulo: publicacion.titulo,
                    contenido: publicacion.contenido,
                    autor: publicacion.autor,
                    email: publicacion.email,
                    es_sensible: publicacion.es_sensible || false,
                    categoria: publicacion.categoria || 'general',
                    comentarios: 0
                })
            });

            if (!response.ok) {
                throw new Error('Error al crear publicación');
            }

            const nuevaPublicacion = await response.json();
            return res.status(201).json(nuevaPublicacion[0]);
        }

        return res.status(405).json({ error: 'Método no permitido' });

    } catch (error) {
        console.error('Error en API maternidad-publicaciones:', error);
        return res.status(500).json({ error: error.message });
    }
}

