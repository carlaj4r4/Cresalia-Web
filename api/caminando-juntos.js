/**
 * ═══════════════════════════════════════════════════════════════
 * 🤝 API ENDPOINT - COMUNIDAD CAMINANDO JUNTOS
 * ═══════════════════════════════════════════════════════════════
 * 
 * Endpoint para la comunidad de adicciones y rehabilitación
 * Sistema ESTRICTO: 1-2 warnings máximo
 */

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Supabase no configurado' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // GET: Obtener publicaciones
        if (req.method === 'GET') {
            const { data, error } = await supabase
                .from('caminando_juntos_publicaciones')
                .select('*')
                .eq('estado', 'publicado')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;

            return res.status(200).json(data || []);
        }

        // POST: Crear publicación
        if (req.method === 'POST') {
            const { categoria, titulo, contenido, contenido_sensible, autor_email, autor_nombre } = req.body;

            if (!categoria || !contenido || !autor_email || !autor_nombre) {
                return res.status(400).json({ error: 'Faltan campos requeridos' });
            }

            // Generar hash del autor
            const crypto = require('crypto');
            const autorHash = crypto.createHash('sha256')
                .update(autor_email + 'caminando-juntos')
                .digest('hex')
                .substring(0, 32);

            // Validar categoría
            const categoriasValidas = ['en-recuperacion', 'familiares', 'prevencion', 'dia-dia', 'recursos', 'general'];
            if (!categoriasValidas.includes(categoria)) {
                return res.status(400).json({ error: 'Categoría inválida' });
            }

            const { data, error } = await supabase
                .from('caminando_juntos_publicaciones')
                .insert([{
                    categoria,
                    titulo: titulo || null,
                    contenido,
                    contenido_sensible: contenido_sensible || false,
                    autor_email,
                    autor_nombre,
                    autor_hash: autorHash,
                    estado: 'publicado'
                }])
                .select()
                .single();

            if (error) throw error;

            return res.status(201).json(data);
        }

        return res.status(405).json({ error: 'Método no permitido' });
    } catch (error) {
        console.error('Error en API caminando-juntos:', error);
        return res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
}



