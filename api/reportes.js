// ==================== FUNCIÓN CONSOLIDADA: REPORTES ====================
// Reemplaza: reportes-maltrato.js, alertas-servicios-enviar.js, emergencias-enviar-emails.js

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

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'cresalia25@gmail.com';

module.exports = async (req, res) => {
    applyCors(res);

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const supabase = getSupabase();
        const type = (req.query.type || req.body?.tipo || 'maltrato').toLowerCase();

        switch (type) {
            case 'maltrato':
                return await handleMaltrato(supabase, req, res);
            case 'alertas':
                return await handleAlertas(req, res);
            case 'emergencias':
                return await handleEmergencias(supabase, req, res);
            default:
                res.status(400).json({ success: false, error: `Tipo "${type}" no válido. Use: maltrato, alertas, emergencias` });
        }
    } catch (error) {
        console.error('❌ Error en API reportes:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// ==================== MALTRATO ====================
async function handleMaltrato(supabase, req, res) {
    if (req.method === 'GET') {
        const { estado, urgencia } = req.query;
        let query = supabase.from('reportes_maltrato_animal').select('*');
        
        if (estado) query = query.eq('estado', estado);
        if (urgencia) query = query.eq('urgencia', urgencia);
        
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json({ success: true, data: data || [] });
    }

    if (req.method === 'POST') {
        const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const { tipo_maltrato, tipo_animal, descripcion, ciudad, provincia, direccion, urgencia, fotos, anonimo, email, telefono } = cuerpo;

        if (!tipo_maltrato || !tipo_animal || !descripcion) {
            return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
        }

        const { data, error } = await supabase
            .from('reportes_maltrato_animal')
            .insert({
                tipo_maltrato, tipo_animal, descripcion, ciudad, provincia,
                direccion, urgencia: urgencia || 'media', fotos: fotos || [],
                anonimo: anonimo !== false, email: anonimo ? null : email,
                telefono: anonimo ? null : telefono, estado: 'pendiente'
            })
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json({ success: true, data });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
}

// ==================== ALERTAS ====================
async function handleAlertas(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { tipo_servicio, ciudad, provincia, direccion, descripcion, urgencia, num_reportes } = cuerpo;

    if (!tipo_servicio || !ciudad || !provincia || !descripcion) {
        return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
    }

    if (!BREVO_API_KEY) {
        return res.status(500).json({ success: false, error: 'Brevo API Key no configurada' });
    }

    const servicios = {
        'luz': { emoji: '⚡', nombre: 'Luz / Electricidad', autoridad: 'Empresa distribuidora de electricidad' },
        'agua': { emoji: '💧', nombre: 'Agua', autoridad: 'Empresa de servicios sanitarios' },
        'gas': { emoji: '🔥', nombre: 'Gas', autoridad: 'Empresa distribuidora de gas' },
        'otro': { emoji: '⚙️', nombre: 'Otro servicio', autoridad: 'Autoridades competentes' }
    };

    const servicio = servicios[tipo_servicio] || servicios['otro'];
    const asunto = `🚨 ALERTA: Múltiples reportes de corte de ${servicio.nombre} en ${ciudad}, ${provincia}`;

    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: 'Cresalia Alertas', email: ADMIN_EMAIL },
                to: [{ email: ADMIN_EMAIL }],
                subject: asunto,
                htmlContent: `
                    <h2>${servicio.emoji} Alerta de ${servicio.nombre}</h2>
                    <p><strong>Ubicación:</strong> ${ciudad}, ${provincia}</p>
                    <p><strong>Dirección:</strong> ${direccion || 'No especificada'}</p>
                    <p><strong>Descripción:</strong> ${descripcion}</p>
                    <p><strong>Número de reportes:</strong> ${num_reportes || 1}</p>
                    <p><strong>Urgencia:</strong> ${urgencia || 'media'}</p>
                `
            })
        });

        if (!response.ok) throw new Error('Error enviando email');

        return res.status(200).json({ success: true, message: 'Alerta enviada correctamente' });
    } catch (error) {
        console.error('Error enviando alerta:', error);
        return res.status(500).json({ success: false, error: 'Error enviando alerta' });
    }
}

// ==================== EMERGENCIAS ====================
async function handleEmergencias(supabase, req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { campana_id, tipo_envio = 'todos' } = cuerpo;

    if (!campana_id) {
        return res.status(400).json({ success: false, error: 'campana_id es requerido' });
    }

    if (!BREVO_API_KEY) {
        return res.status(500).json({ success: false, error: 'Brevo API Key no configurada' });
    }

    try {
        const { data: campana, error: errorCampana } = await supabase
            .from('emergencias_campanas')
            .select('*')
            .eq('id', campana_id)
            .single();

        if (errorCampana || !campana) {
            return res.status(404).json({ success: false, error: 'Campaña no encontrada' });
        }

        let usuarios = [];
        if (tipo_envio === 'zona_afectada') {
            const { data: usuariosData } = await supabase
                .from('compradores')
                .select('email, nombre, ciudad, provincia')
                .eq('ciudad', campana.ciudad)
                .eq('provincia', campana.provincia)
                .not('email', 'is', null);
            usuarios = usuariosData || [];
        } else {
            const { data: usuariosData } = await supabase
                .from('compradores')
                .select('email, nombre')
                .not('email', 'is', null);
            usuarios = usuariosData || [];
        }

        if (usuarios.length === 0) {
            return res.status(200).json({ success: true, message: 'No hay usuarios para notificar', usuariosNotificados: 0 });
        }

        let exitosos = 0;
        for (const usuario of usuarios.slice(0, 100)) {
            try {
                const response = await fetch(BREVO_API_URL, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'api-key': BREVO_API_KEY,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: { name: 'Cresalia Emergencias', email: ADMIN_EMAIL },
                        to: [{ email: usuario.email, name: usuario.nombre || 'Usuario' }],
                        subject: `🚨 ${campana.titulo || 'Alerta de Emergencia'}`,
                        htmlContent: campana.mensaje || 'Hay una emergencia activa en tu zona.'
                    })
                });
                if (response.ok) exitosos++;
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Error enviando a ${usuario.email}:`, error);
            }
        }

        return res.status(200).json({
            success: true,
            message: `Notificaciones enviadas a ${exitosos} usuarios`,
            usuariosNotificados: exitosos,
            totalUsuarios: usuarios.length
        });
    } catch (error) {
        console.error('Error en emergencias:', error);
        return res.status(500).json({ success: false, error: 'Error procesando emergencias' });
    }
}

