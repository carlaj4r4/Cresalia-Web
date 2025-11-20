/**
 * API Endpoint: Diario Personal de Maternidad
 * GET: Obtener entradas del diario (filtrado por email)
 * POST: Crear nueva entrada
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
            // Obtener entradas del diario
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
            // Crear nueva entrada
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

        return res.status(405).json({ error: 'Método no permitido' });

    } catch (error) {
        console.error('Error en API maternidad-diario:', error);
        return res.status(500).json({ error: error.message });
    }
}

