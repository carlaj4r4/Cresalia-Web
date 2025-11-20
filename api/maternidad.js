/**
 * API Router: Comunidad Maternidad
 * Combina endpoints de publicaciones y diario personal
 * GET /api/maternidad?tipo=publicaciones|diario
 * POST /api/maternidad?tipo=publicaciones|diario
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
        }

        // ===== DIARIO =====
        if (tipo === 'diario') {
            if (req.method === 'GET') {
                const { email } = req.query;

                if (!email) {
                    return res.status(400).json({ error: 'Email requerido' });
                }

                const response = await fetch(`${SUPABASE_URL}/rest/v1/maternidad_diario?email=eq.${email}&order=fecha.desc`, {
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al obtener entradas del diario');
                }

                const entradas = await response.json();
                return res.status(200).json(entradas);

            } else if (req.method === 'POST') {
                const entrada = req.body;

                const response = await fetch(`${SUPABASE_URL}/rest/v1/maternidad_diario`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        fecha: entrada.fecha || new Date().toISOString(),
                        emocion: entrada.emocion,
                        sintomas: entrada.sintomas || null,
                        notas: entrada.notas || null,
                        semana: entrada.semana || null,
                        email: entrada.email
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al crear entrada del diario');
                }

                const nuevaEntrada = await response.json();
                return res.status(201).json(nuevaEntrada[0]);
            }
        }

        return res.status(400).json({ error: 'Tipo inválido. Usa ?tipo=publicaciones o ?tipo=diario' });

    } catch (error) {
        console.error('Error en API maternidad:', error);
        return res.status(500).json({ error: error.message });
    }
}

