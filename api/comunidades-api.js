// ==================== FUNCIÓN CONSOLIDADA: COMUNIDADES API ====================
// Reemplaza: caminando-juntos.js, injusticias-vividas.js, espiritualidad-fe.js,
//            libertad-economica.js, sanando-abandonos.js, libertad-emocional.js,
//            desahogo-libre.js, animales.js, maternidad.js

const { createClient } = require('@supabase/supabase-js');

let supabaseClient = null;

function getSupabase() {
    if (supabaseClient) return supabaseClient;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
        throw new Error('Supabase no configurado');
    }
    supabaseClient = createClient(url, key);
    return supabaseClient;
}

function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Mapeo de slugs a tablas de Supabase
const TABLAS_COMUNIDADES = {
    'caminando-juntos': 'caminando_juntos_publicaciones',
    'injusticias-vividas': 'injusticias_vividas_publicaciones',
    'espiritualidad-fe': 'espiritualidad_fe_publicaciones',
    'libertad-economica': 'libertad_economica_publicaciones',
    'sanando-abandonos': 'sanando_abandonos_publicaciones',
    'libertad-emocional': 'libertad_emocional_publicaciones',
    'desahogo-libre': 'desahogo_publicaciones',
    'animales': 'animales_publicaciones',
    'maternidad': 'maternidad_publicaciones'
};

// Tablas especiales para algunas comunidades
const TABLAS_ESPECIALES = {
    'maternidad': {
        publicaciones: 'maternidad_publicaciones',
        diario: 'maternidad_diario'
    },
    'animales': {
        publicaciones: 'animales_publicaciones',
        cumpleanos: 'animales_cumpleanos'
    }
};

module.exports = async (req, res) => {
    applyCors(res);

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const supabase = getSupabase();
        // Detectar slug desde URL o query param
        let slug = req.query.slug;
        if (!slug && req.url) {
            const urlSlugs = {
                '/caminando-juntos': 'caminando-juntos',
                '/injusticias-vividas': 'injusticias-vividas',
                '/espiritualidad-fe': 'espiritualidad-fe',
                '/libertad-economica': 'libertad-economica',
                '/sanando-abandonos': 'sanando-abandonos',
                '/libertad-emocional': 'libertad-emocional',
                '/desahogo-libre': 'desahogo-libre',
                '/animales': 'animales',
                '/maternidad': 'maternidad'
            };
            for (const [path, slugValue] of Object.entries(urlSlugs)) {
                if (req.url.includes(path)) {
                    slug = slugValue;
                    break;
                }
            }
        }
        slug = (slug || '').toLowerCase();
        const tipo = (req.query.tipo || req.query.accion || 'publicaciones').toLowerCase();

        if (!slug) {
            return res.status(400).json({ error: 'Parámetro "slug" requerido. Ejemplo: ?slug=maternidad&tipo=publicaciones' });
        }

        // Maternidad - manejo especial
        if (slug === 'maternidad') {
            return await handleMaternidad(supabase, req, res, tipo);
        }

        // Animales - manejo especial
        if (slug === 'animales') {
            return await handleAnimales(supabase, req, res, tipo);
        }

        // Otras comunidades - manejo genérico
        const tabla = TABLAS_COMUNIDADES[slug];
        if (!tabla) {
            return res.status(400).json({ 
                error: `Comunidad "${slug}" no encontrada. Comunidades disponibles: ${Object.keys(TABLAS_COMUNIDADES).join(', ')}` 
            });
        }

        if (tipo === 'publicaciones') {
            return await handlePublicaciones(supabase, req, res, tabla);
        }

        return res.status(400).json({ error: `Tipo "${tipo}" no válido. Use: publicaciones` });

    } catch (error) {
        console.error('❌ Error en API comunidades-api:', error.message);
        res.status(500).json({ error: error.message || 'Error interno del servidor' });
    }
};

// ==================== HANDLERS GENÉRICOS ====================
async function handlePublicaciones(supabase, req, res, tabla) {
    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from(tabla)
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) throw error;
        return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
        const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        
        const { data, error } = await supabase
            .from(tabla)
            .insert({
                titulo: cuerpo.titulo || null,
                contenido: cuerpo.contenido,
                autor: cuerpo.autor || cuerpo.autor_nombre || 'Anónimo',
                email: cuerpo.email || cuerpo.autor_email || null,
                categoria: cuerpo.categoria || null,
                contenido_sensible: cuerpo.contenido_sensible || false,
                comentarios: 0,
                estado: cuerpo.estado || 'publicado'
            })
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json(data);
    }

    return res.status(405).json({ error: 'Método no permitido' });
}

// ==================== HANDLER ESPECIAL: MATERNIDAD ====================
async function handleMaternidad(supabase, req, res, tipo) {
    if (tipo === 'publicaciones') {
        if (req.method === 'GET') {
            const { data, error } = await supabase
                .from('maternidad_publicaciones')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;
            return res.status(200).json(data || []);
        }

        if (req.method === 'POST') {
            const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
            
            const { data, error } = await supabase
                .from('maternidad_publicaciones')
                .insert({
                    titulo: cuerpo.titulo || null,
                    contenido: cuerpo.contenido,
                    autor: cuerpo.autor || cuerpo.autor_nombre || 'Anónimo',
                    email: cuerpo.email || cuerpo.autor_email || null,
                    categoria: cuerpo.categoria || null
                })
                .select()
                .single();

            if (error) throw error;
            return res.status(201).json(data);
        }
    }

    if (tipo === 'diario') {
        if (req.method === 'GET') {
            const email = req.query.email;
            if (!email) {
                return res.status(400).json({ error: 'Email requerido para obtener diario' });
            }

            const { data, error } = await supabase
                .from('maternidad_diario')
                .select('*')
                .eq('email', email)
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;
            return res.status(200).json(data || []);
        }

        if (req.method === 'POST') {
            const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
            
            if (!cuerpo.email) {
                return res.status(400).json({ error: 'Email requerido' });
            }

            const { data, error } = await supabase
                .from('maternidad_diario')
                .insert({
                    email: cuerpo.email,
                    entrada: cuerpo.entrada || cuerpo.contenido,
                    sentimiento: cuerpo.sentimiento || null,
                    fecha: cuerpo.fecha || new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return res.status(201).json(data);
        }
    }

    return res.status(400).json({ error: `Tipo "${tipo}" no válido. Use: publicaciones, diario` });
}

// ==================== HANDLER ESPECIAL: ANIMALES ====================
async function handleAnimales(supabase, req, res, tipo) {
    if (tipo === 'publicaciones' || tipo === 'subir-archivo') {
        if (req.method === 'GET') {
            const { data, error } = await supabase
                .from('animales_publicaciones')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;
            return res.status(200).json(data || []);
        }

        if (req.method === 'POST') {
            const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
            
            const { data, error } = await supabase
                .from('animales_publicaciones')
                .insert({
                    titulo: cuerpo.titulo || null,
                    contenido: cuerpo.contenido,
                    autor: cuerpo.autor || 'Anónimo',
                    email: cuerpo.email || null,
                    archivo_url: cuerpo.archivo_url || null,
                    tipo_archivo: cuerpo.tipo_archivo || null
                })
                .select()
                .single();

            if (error) throw error;
            return res.status(201).json(data);
        }
    }

    if (tipo === 'cumpleanos') {
        if (req.method === 'GET') {
            const { data, error } = await supabase
                .from('animales_cumpleanos')
                .select('*')
                .order('fecha_nacimiento', { ascending: false })
                .limit(100);

            if (error) throw error;
            return res.status(200).json(data || []);
        }

        if (req.method === 'POST') {
            const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
            
            const { data, error } = await supabase
                .from('animales_cumpleanos')
                .insert({
                    nombre: cuerpo.nombre,
                    especie: cuerpo.especie || null,
                    fecha_nacimiento: cuerpo.fecha_nacimiento,
                    foto_url: cuerpo.foto_url || null,
                    dueno_email: cuerpo.dueno_email || null
                })
                .select()
                .single();

            if (error) throw error;
            return res.status(201).json(data);
        }
    }

    return res.status(400).json({ error: `Tipo "${tipo}" no válido. Use: publicaciones, cumpleanos` });
}

