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

function sanitizarString(valor, max = 220) {
    if (typeof valor !== 'string') return null;
    const limpio = valor.trim();
    if (!limpio) return null;
    return limpio.slice(0, max);
}

function sanitizarFecha(valor) {
    if (!valor) return null;
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) {
        return null;
    }
    return fecha.toISOString().slice(0, 10);
}

async function obtenerCompradorPorEmail(supabase, tabla, email) {
    const { data, error } = await supabase
        .from(tabla)
        .select(`
            email,
            nombre,
            nombre_completo,
            acepta_cumple_publico,
            acepta_cumple_descuento,
            fecha_nacimiento,
            mensaje_cumple_publico
        `)
        .eq('email', email)
        .maybeSingle();

    if (error) throw error;
    return data;
}

function formatearRespuestaComprador(data) {
    if (!data) return null;
    return {
        email: data.email || null,
        nombre: data.nombre || data.nombre_completo || null,
        acepta_cumple_publico: Boolean(data.acepta_cumple_publico),
        acepta_cumple_descuento: Boolean(data.acepta_cumple_descuento),
        fecha_nacimiento: data.fecha_nacimiento || null,
        mensaje_cumple_publico: data.mensaje_cumple_publico || null
    };
}

module.exports = async (req, res) => {
    applyCors(res);

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    try {
        const supabase = getSupabase();
        const tabla = process.env.SUPABASE_COMPRADORES_TABLE || 'compradores';

        if (req.method === 'GET') {
            const email = (req.query.email || '').toString().trim().toLowerCase();
            if (!email) {
                res.status(400).json({ success: false, message: 'Email requerido' });
                return;
            }

            const comprador = await obtenerCompradorPorEmail(supabase, tabla, email);
            if (!comprador) {
                res.status(404).json({ success: true, data: null, message: 'No encontramos un comprador con ese email' });
                return;
            }

            res.status(200).json({
                success: true,
                data: formatearRespuestaComprador(comprador)
            });
            return;
        }

        if (req.method === 'POST') {
            const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
            const email = (payload.email || '').toString().trim().toLowerCase();

            if (!email) {
                res.status(400).json({ success: false, message: 'Email requerido para actualizar preferencias' });
                return;
            }

            const update = {
                acepta_cumple_publico: Boolean(payload.acepta_publico),
                acepta_cumple_descuento: Boolean(payload.acepta_descuento),
                mensaje_cumple_publico: sanitizarString(payload.mensaje_publico, 220),
                fecha_nacimiento: sanitizarFecha(payload.fecha_nacimiento)
            };

            const { data, error } = await supabase
                .from(tabla)
                .update(update)
                .eq('email', email)
                .select(`
                    email,
                    nombre,
                    nombre_completo,
                    acepta_cumple_publico,
                    acepta_cumple_descuento,
                    fecha_nacimiento,
                    mensaje_cumple_publico
                `)
                .maybeSingle();

            if (error) {
                if (error.code === 'PGRST116') { // no rows updated
                    return res.status(404).json({
                        success: false,
                        message: 'No encontramos un comprador registrado con ese email. Registrate primero para configurar tu cumpleaños.'
                    });
                }
                throw error;
            }

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: 'No encontramos un comprador registrado con ese email. Registrate primero para configurar tu cumpleaños.'
                });
            }

            res.status(200).json({
                success: true,
                data: formatearRespuestaComprador(data)
            });
            return;
        }

        res.status(405).json({ success: false, message: 'Método no permitido' });
    } catch (error) {
        console.error('❌ Error en cumple consent:', error.message);
        res.status(500).json({
            success: false,
            message: 'Ocurrió un problema al procesar tus preferencias. Intentá nuevamente.'
        });
    }
};



