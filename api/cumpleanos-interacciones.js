const { createClient } = require('@supabase/supabase-js');

let supabaseClient = null;

function getSupabase() {
    if (supabaseClient) return supabaseClient;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
        throw new Error('SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configuradas');
    }

    supabaseClient = createClient(url, key);
    return supabaseClient;
}

function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sanitizarTexto(valor, maxLength = 280) {
    if (!valor) return null;
    return String(valor).trim().slice(0, maxLength);
}

async function obtenerResumenInteracciones(supabase, referencia) {
    const { data, error } = await supabase
        .from('cumpleanos_interacciones')
        .select('tipo, autor, mensaje, created_at')
        .eq('referencia', referencia)
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        console.warn('⚠️ No se pudo obtener resumen de interacciones:', error.message);
        return {
            abrazos: 0,
            mensajes: []
        };
    }

    return (data || []).reduce((acc, item) => {
        if (item.tipo === 'abrazo') {
            acc.abrazos += 1;
        } else if (item.tipo === 'mensaje' && item.mensaje) {
            acc.mensajes.push({
                autor: item.autor || 'Comunidad Cresalia',
                mensaje: item.mensaje,
                fecha: item.created_at
            });
        }
        return acc;
    }, { abrazos: 0, mensajes: [] });
}

module.exports = async (req, res) => {
    applyCors(res);

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ success: false, message: 'Método no permitido' });
        return;
    }

    try {
        const supabase = getSupabase();
        const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

        const referencia = sanitizarTexto(cuerpo.referencia, 120);
        const tipo = sanitizarTexto(cuerpo.tipo, 20);
        const autor = sanitizarTexto(cuerpo.autor, 120);
        const mensaje = sanitizarTexto(cuerpo.mensaje, 600);

        if (!referencia) {
            return res.status(400).json({ success: false, message: 'Referencia de cumpleañero requerida' });
        }

        if (!tipo || !['abrazo', 'mensaje'].includes(tipo)) {
            return res.status(400).json({ success: false, message: 'Tipo inválido. Debe ser "abrazo" o "mensaje"' });
        }

        if (tipo === 'mensaje' && (!mensaje || mensaje.length < 3)) {
            return res.status(400).json({
                success: false,
                message: 'El mensaje debe tener al menos 3 caracteres'
            });
        }

        const payload = {
            referencia,
            tipo,
            autor: autor || null,
            mensaje: tipo === 'mensaje' ? mensaje : null,
            metadata: {
                ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'desconocida',
                user_agent: req.headers['user-agent'] || 'desconocido'
            }
        };

        const { error } = await supabase
            .from('cumpleanos_interacciones')
            .insert(payload);

        if (error) {
            console.error('❌ Error guardando interacción:', error.message);
            return res.status(500).json({
                success: false,
                message: 'No se pudo registrar la interacción'
            });
        }

        const resumen = await obtenerResumenInteracciones(supabase, referencia);

        res.status(200).json({
            success: true,
            referencia,
            resumen
        });
    } catch (error) {
        console.error('❌ Error en API cumpleanos-interacciones:', error.message);
        res.status(500).json({
            success: false,
            message: 'Ocurrió un problema al registrar la interacción'
        });
    }
};



