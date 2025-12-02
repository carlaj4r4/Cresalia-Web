/**
 * API Router: Comunidad Desahogo Libre
 * GET /api/desahogo-libre?tipo=publicaciones
 * POST /api/desahogo-libre?tipo=publicaciones
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

    const { tipo } = req.query;

    try {
        // ===== PUBLICACIONES =====
        if (tipo === 'publicaciones') {
            if (req.method === 'GET') {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/desahogo_publicaciones?order=created_at.desc&estado=eq.activa`, {
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
                const publicacion = req.body;

                const response = await fetch(`${SUPABASE_URL}/rest/v1/desahogo_publicaciones`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        titulo: publicacion.titulo || null,
                        contenido: publicacion.contenido,
                        autor: publicacion.autor,
                        email: publicacion.email,
                        comentarios: 0
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al crear publicación');
                }

                const nuevaPublicacion = await response.json();
                return res.status(201).json(nuevaPublicacion[0]);
            }
        }

        return res.status(400).json({ error: 'Tipo inválido. Usa ?tipo=publicaciones' });

    } catch (error) {
        console.error('Error en API desahogo-libre:', error);
        return res.status(500).json({ error: error.message });
    }
}



