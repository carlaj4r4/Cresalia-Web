/**
 * 📞 API Endpoint: Soporte Cresalia
 * Guarda tickets en Supabase y opcionalmente envía aviso por email (Brevo)
 * Seguridad: x-api-key opcional; si no se configura, solo warning.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || null;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || null;

const SUPPORT_API_KEY = process.env.SUPPORT_API_KEY || null;
const BREVO_API_KEY = process.env.BREVO_API_KEY || null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'cresalia25@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || ADMIN_EMAIL;
const FROM_NAME = process.env.FROM_NAME || 'Cresalia';

function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
}

function requireSupabase(res) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        res.status(500).json({
            success: false,
            error: 'Supabase no configurado. Agrega SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en Vercel.'
        });
        return null;
    }
    return createClient(SUPABASE_URL.trim(), SUPABASE_KEY.trim());
}

async function sendBrevoEmail({ to, subject, htmlContent }) {
    if (!BREVO_API_KEY) {
        return { success: false, warning: 'BREVO_API_KEY no configurada, se omite email' };
    }
    const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
    const resp = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': BREVO_API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            sender: { name: FROM_NAME, email: FROM_EMAIL },
            to: [{ email: to }],
            subject,
            htmlContent
        })
    });
    if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Brevo error: ${resp.status} ${errorText}`);
    }
    return { success: true };
}

module.exports = async (req, res) => {
    applyCors(res);

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Método no permitido. Usa POST.' });
    }

    // Validar API key (opcional pero recomendado)
    if (SUPPORT_API_KEY) {
        const headerKey = req.headers['x-api-key'] || req.headers['X-API-Key'] || req.headers['x-api-key'];
        if (headerKey !== SUPPORT_API_KEY) {
            return res.status(401).json({ success: false, error: 'x-api-key inválida' });
        }
    }

    let body = {};
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    } catch (err) {
        return res.status(400).json({ success: false, error: 'JSON inválido' });
    }

    const {
        email,
        nombre,
        mensaje,
        plan = 'free',
        tipo = 'general',
        metadata = {}
    } = body;

    if (!mensaje) {
        return res.status(400).json({ success: false, error: 'Falta el campo mensaje' });
    }

    const supabase = requireSupabase(res);
    if (!supabase) return; // respuesta ya enviada

    try {
        // Insertar ticket en Supabase
        const { data, error } = await supabase
            .from('soporte_tickets')
            .insert([{
                email: email || metadata.email || null,
                nombre: nombre || metadata.nombre || 'Sin nombre',
                mensaje,
                plan: (plan || 'free').toLowerCase(),
                tipo,
                estado: 'nuevo',
                metadata
            }])
            .select()
            .maybeSingle();

        if (error) {
            console.error('❌ Error insertando ticket:', error);
            return res.status(500).json({ success: false, error: 'No se pudo crear el ticket', details: error.message });
        }

        // Enviar email opcional
        let emailResult = null;
        try {
            if (BREVO_API_KEY) {
                await sendBrevoEmail({
                    to: ADMIN_EMAIL,
                    subject: `Nuevo ticket de soporte (${plan})`,
                    htmlContent: `
                        <p><strong>Nombre:</strong> ${nombre || 'Sin nombre'}</p>
                        <p><strong>Email:</strong> ${email || 'No informado'}</p>
                        <p><strong>Plan:</strong> ${plan}</p>
                        <p><strong>Tipo:</strong> ${tipo}</p>
                        <p><strong>Mensaje:</strong></p>
                        <pre>${mensaje}</pre>
                    `
                });
                emailResult = { success: true };
            }
        } catch (err) {
            console.warn('⚠️ Error enviando email de soporte:', err.message);
            emailResult = { success: false, warning: err.message };
        }

        return res.status(200).json({
            success: true,
            ticket: data,
            email: emailResult,
            message: 'Ticket creado'
        });
    } catch (err) {
        console.error('❌ Error en /api/support:', err);
        return res.status(500).json({ success: false, error: 'Error interno', details: err.message });
    }
};
