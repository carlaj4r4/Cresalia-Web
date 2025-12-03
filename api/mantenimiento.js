// ==================== FUNCIÓN CONSOLIDADA: MANTENIMIENTO ====================
// Reemplaza: mantenimiento-estado.js, mantenimiento-notificar.js

const { createClient } = require('@supabase/supabase-js');

let supabaseClient = null;

function getSupabase() {
    if (supabaseClient) return supabaseClient;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
        throw new Error('Variables SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no configuradas');
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

// ==================== ACCIÓN: ESTADO ====================
async function handleEstado(supabase, req, res) {
    if (req.method === 'GET') {
        const estado = await obtenerEstadoMantenimiento(supabase);
        return res.status(200).json({
            activo: estado.activo || false,
            mensaje: estado.mensaje || null,
            fechaInicio: estado.fecha_inicio || null,
            fechaFinEstimada: estado.fecha_fin_estimada || null
        });
    }
    
    if (req.method === 'POST') {
        const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const { activo, mensaje, fechaFinEstimada } = cuerpo;
        
        if (typeof activo !== 'boolean') {
            return res.status(400).json({
                success: false,
                error: 'El campo "activo" debe ser true o false'
            });
        }
        
        const resultado = await actualizarEstadoMantenimiento(supabase, {
            activo,
            mensaje: mensaje || null,
            fecha_fin_estimada: fechaFinEstimada || null
        });
        
        return res.status(200).json({
            success: true,
            message: activo ? 'Mantenimiento activado' : 'Mantenimiento desactivado',
            estado: resultado
        });
    }
    
    return res.status(405).json({
        success: false,
        error: 'Method not allowed'
    });
}

// ==================== ACCIÓN: NOTIFICAR ====================
async function handleNotificar(supabase, req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Use POST.'
        });
    }

    const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { activo, mensaje, fechaFinEstimada } = cuerpo;
    
    if (!activo) {
        return res.status(200).json({
            success: true,
            message: 'Mantenimiento desactivado, no se enviaron notificaciones'
        });
    }
    
    const usuarios = await obtenerUsuariosRegistrados(supabase);
    
    if (!usuarios || usuarios.length === 0) {
        return res.status(200).json({
            success: true,
            message: 'No hay usuarios registrados para notificar',
            usuariosNotificados: 0
        });
    }
    
    const resultados = await enviarNotificaciones(usuarios, mensaje, fechaFinEstimada);
    
    return res.status(200).json({
        success: true,
        message: `Notificaciones enviadas a ${resultados.exitosos} usuarios`,
        usuariosNotificados: resultados.exitosos,
        errores: resultados.errores,
        totalUsuarios: usuarios.length
    });
}

// ==================== FUNCIONES AUXILIARES ====================
async function obtenerEstadoMantenimiento(supabase) {
    try {
        const { data, error } = await supabase
            .from('configuracion_sistema')
            .select('valor')
            .eq('clave', 'mantenimiento')
            .maybeSingle();

        if (error || !data) {
            return {
                activo: false,
                mensaje: null,
                fecha_inicio: null,
                fecha_fin_estimada: null
            };
        }

        const config = typeof data.valor === 'string' ? JSON.parse(data.valor) : data.valor;
        return {
            activo: config.activo || false,
            mensaje: config.mensaje || null,
            fecha_inicio: config.fecha_inicio || null,
            fecha_fin_estimada: config.fechaFinEstimada || config.fecha_fin_estimada || null
        };
    } catch (error) {
        console.error('Error obteniendo estado de Supabase:', error);
        return {
            activo: false,
            mensaje: null,
            fecha_inicio: null,
            fecha_fin_estimada: null
        };
    }
}

async function actualizarEstadoMantenimiento(supabase, datos) {
    try {
        const ahora = new Date().toISOString();
        const config = {
            activo: datos.activo,
            mensaje: datos.mensaje,
            fechaInicio: datos.activo ? ahora : null,
            fechaFinEstimada: datos.fecha_fin_estimada
        };

        const { data: existing } = await supabase
            .from('configuracion_sistema')
            .select('id')
            .eq('clave', 'mantenimiento')
            .maybeSingle();

        if (existing && existing.id) {
            const { data, error } = await supabase
                .from('configuracion_sistema')
                .update({ valor: config, ultima_actualizacion: ahora })
                .eq('id', existing.id)
                .select()
                .maybeSingle();
            if (error) throw error;
            return data;
        } else {
            const { data, error } = await supabase
                .from('configuracion_sistema')
                .insert({
                    clave: 'mantenimiento',
                    valor: config,
                    descripcion: 'Configuración global del modo de mantenimiento del SaaS'
                })
                .select()
                .maybeSingle();
            if (error) throw error;
            return data;
        }
    } catch (error) {
        console.error('Error actualizando estado en Supabase:', error);
        return {
            ...datos,
            fecha_inicio: datos.activo ? new Date().toISOString() : null
        };
    }
}

async function obtenerUsuariosRegistrados(supabase) {
    const usuarios = [];
    
    try {
        const { data: compradores, error: errorCompradores } = await supabase
            .from('compradores')
            .select('email, nombre')
            .not('email', 'is', null);

        if (!errorCompradores && compradores) {
            compradores.forEach(comprador => {
                if (comprador.email) {
                    usuarios.push({
                        email: comprador.email,
                        nombre: comprador.nombre || 'Usuario',
                        tipo: 'comprador'
                    });
                }
            });
        }

        const { data: tiendas, error: errorTiendas } = await supabase
            .from('tiendas')
            .select('email, nombre_tienda')
            .not('email', 'is', null);

        if (!errorTiendas && tiendas) {
            tiendas.forEach(tienda => {
                if (tienda.email) {
                    usuarios.push({
                        email: tienda.email,
                        nombre: tienda.nombre_tienda || 'Tienda',
                        tipo: 'tienda'
                    });
                }
            });
        }
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
    }
    
    return usuarios;
}

async function enviarNotificaciones(usuarios, mensajePersonalizado, fechaFinEstimada) {
    if (!BREVO_API_KEY) {
        console.warn('⚠️ Brevo API Key no configurada');
        return {
            exitosos: 0,
            errores: usuarios.length,
            detalles: ['Brevo API Key no configurada']
        };
    }
    
    const resultados = {
        exitosos: 0,
        errores: 0,
        detalles: []
    };
    
    let fechaFinTexto = '';
    if (fechaFinEstimada) {
        try {
            const fecha = new Date(fechaFinEstimada);
            fechaFinTexto = fecha.toLocaleString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Argentina/Buenos_Aires'
            });
        } catch (e) {
            fechaFinTexto = fechaFinEstimada;
        }
    }
    
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .gratitude-box { background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea; }
        .apology-box { background: rgba(236, 72, 153, 0.1); padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ec4899; }
        .info-box { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #e5e7eb; }
        .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: 600; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🛠️ Mantenimiento Programado</h1>
    </div>
    <div class="content">
        <p>Hola <strong>{{NOMBRE}}</strong>,</p>
        <p>Te escribimos para informarte que Cresalia estará temporalmente en mantenimiento para mejorar nuestra plataforma y brindarte una experiencia aún mejor.</p>
        <div class="gratitude-box">
            <p><strong>¡Gracias por tu paciencia y comprensión!</strong></p>
            <p>Tu confianza en nosotros nos motiva a continuamente mejorar nuestra plataforma para que sea todo lo que tú y nuestra comunidad se merecen. Estamos trabajando incansablemente para que cuando regreses, encuentres una experiencia aún más maravillosa.</p>
        </div>
        <div class="apology-box">
            <p><strong>Lamentamos profundamente cualquier inconveniente</strong> que esto pueda causarte. Sabemos que tu tiempo es valioso y apreciamos enormemente tu comprensión durante este proceso.</p>
        </div>
        ${fechaFinTexto ? `<div class="info-box"><p><strong>📅 Tiempo estimado de mantenimiento:</strong></p><p>${fechaFinTexto}</p></div>` : ''}
        ${mensajePersonalizado ? `<div class="info-box"><p><strong>ℹ️ Información adicional:</strong></p><p>${mensajePersonalizado}</p></div>` : ''}
        <p style="text-align: center;">
            <a href="https://cresalia-web.vercel.app/mantenimiento.html" class="btn">Ver Página de Mantenimiento</a>
        </p>
        <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Si tienes alguna urgencia o consulta, no dudes en contactarnos en <a href="mailto:cresalia25@gmail.com" style="color: #667eea;">cresalia25@gmail.com</a>
        </p>
    </div>
    <div class="footer">
        <p>Estaremos de vuelta muy pronto 💜</p>
        <p>Equipo Cresalia</p>
    </div>
</body>
</html>
    `;
    
    const lotes = [];
    const tamañoLote = 50;
    for (let i = 0; i < usuarios.length; i += tamañoLote) {
        lotes.push(usuarios.slice(i, i + tamañoLote));
    }
    
    for (const lote of lotes) {
        for (const usuario of lote) {
            try {
                const emailPersonalizado = emailBody.replace('{{NOMBRE}}', usuario.nombre);
                
                const response = await fetch(BREVO_API_URL, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'api-key': BREVO_API_KEY,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: {
                            name: 'Cresalia - Equipo',
                            email: 'noreply@cresalia.com'
                        },
                        to: [{ email: usuario.email, name: usuario.nombre }],
                        subject: '🛠️ Cresalia en Mantenimiento - Gracias por tu Paciencia',
                        htmlContent: emailPersonalizado
                    })
                });
                
                if (response.ok) {
                    resultados.exitosos++;
                } else {
                    resultados.errores++;
                    const errorText = await response.text();
                    resultados.detalles.push(`Error con ${usuario.email}: ${errorText}`);
                }
                
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                resultados.errores++;
                resultados.detalles.push(`Error con ${usuario.email}: ${error.message}`);
            }
        }
        
        if (lotes.indexOf(lote) < lotes.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    return resultados;
}

// ==================== HANDLER PRINCIPAL ====================
module.exports = async (req, res) => {
    applyCors(res);

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const supabase = getSupabase();
        const action = req.query.action || 'estado';

        switch (action) {
            case 'estado':
                await handleEstado(supabase, req, res);
                break;
            case 'notificar':
                await handleNotificar(supabase, req, res);
                break;
            default:
                res.status(400).json({ success: false, message: `Acción "${action}" no válida. Use: estado, notificar` });
        }
    } catch (error) {
        console.error('❌ Error en API mantenimiento:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

