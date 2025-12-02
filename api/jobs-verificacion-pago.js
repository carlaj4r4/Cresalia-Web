// ===== API: Verificación de Pago - Cresalia Jobs =====
// Gestiona verificaciones de pago y envía emails automáticos

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const PLATAFORMA_URL = process.env.PLATAFORMA_URL || 'https://cresalia.com';

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        if (req.method === 'POST') {
            const { accion } = req.body;
            
            if (accion === 'crear') {
                return await crearVerificacion(req, res);
            } else if (accion === 'enviar_email') {
                return await enviarEmailVerificacion(req, res);
            } else {
                return res.status(400).json({
                    success: false,
                    error: 'Acción no válida. Usa: crear o enviar_email'
                });
            }
        }
        
        if (req.method === 'GET') {
            return await obtenerVerificaciones(req, res);
        }
        
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
        
    } catch (error) {
        console.error('❌ Error en jobs-verificacion-pago.js:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// ===== CREAR VERIFICACIÓN =====
async function crearVerificacion(req, res) {
    const {
        oferta_id,
        empleador_id,
        empleado_id,
        empleado_email,
        empleado_nombre,
        fue_pagado,
        monto_pactado,
        monto_recibido,
        fecha_pago_esperada,
        fecha_pago_real,
        evidencias,
        descripcion
    } = req.body;
    
    // Validación
    if (!oferta_id || !empleador_id || fue_pagado === undefined) {
        return res.status(400).json({
            success: false,
            error: 'Faltan campos requeridos: oferta_id, empleador_id, fue_pagado'
        });
    }
    
    // Guardar en Supabase
    const verificacionData = {
        oferta_id,
        empleador_id,
        empleado_id: empleado_id || null,
        empleado_email: empleado_email || null,
        empleado_nombre: empleado_nombre || null,
        fue_pagado,
        monto_pactado: monto_pactado || null,
        monto_recibido: monto_recibido || null,
        fecha_pago_esperada: fecha_pago_esperada || null,
        fecha_pago_real: fecha_pago_real || null,
        evidencias: evidencias || [],
        descripcion: descripcion || null,
        estado: 'pendiente',
        email_enviado_empresa: false,
        email_enviado_empleado: false
    };
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/jobs_verificaciones_pago`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(verificacionData)
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Error en Supabase: ${error}`);
    }
    
    const data = await response.json();
    const verificacion = data[0] || data;
    
    // Obtener información del empleador para el email
    const empleador = await obtenerEmpleador(empleador_id);
    
    // Enviar email automático según el resultado
    if (fue_pagado === false) {
        // Enviar email pidiendo que paguen
        await enviarEmailPidiendoPago(verificacion, empleador, empleado_nombre);
        
        // Marcar email como enviado
        await actualizarEmailEnviado(verificacion.id, 'empresa');
    } else {
        // Enviar email agradeciendo
        await enviarEmailAgradeciendo(verificacion, empleador, empleado_email, empleado_nombre);
        
        // Marcar email como enviado
        await actualizarEmailEnviado(verificacion.id, 'empleado');
    }
    
    // Actualizar estadísticas del empleador
    await actualizarEstadisticasEmpleador(empleador_id);
    
    return res.status(200).json({
        success: true,
        message: 'Verificación creada y email enviado',
        verificacion: verificacion
    });
}

// ===== ENVIAR EMAIL PIDIENDO PAGO =====
async function enviarEmailPidiendoPago(verificacion, empleador, empleadoNombre) {
    if (!BREVO_API_KEY || !empleador || !empleador.email) {
        console.warn('⚠️ No se puede enviar email: faltan datos');
        return;
    }
    
    const emailBody = generarEmailPidiendoPago(verificacion, empleador, empleadoNombre);
    
    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: {
                    name: 'Cresalia Jobs - Sistema de Verificación',
                    email: 'jobs@cresalia.com'
                },
                to: [{ email: empleador.email }],
                subject: '🚨 Verificación de Pago Pendiente - Cresalia Jobs',
                htmlContent: emailBody
            })
        });
        
        if (response.ok) {
            console.log('✅ Email enviado a empleador:', empleador.email);
        } else {
            const error = await response.text();
            console.error('Error enviando email:', error);
        }
    } catch (error) {
        console.error('Error enviando email:', error);
    }
}

// ===== ENVIAR EMAIL AGRADECIENDO =====
async function enviarEmailAgradeciendo(verificacion, empleador, empleadoEmail, empleadoNombre) {
    if (!BREVO_API_KEY || !empleadoEmail) {
        console.warn('⚠️ No se puede enviar email: falta email del empleado');
        return;
    }
    
    const emailBody = generarEmailAgradeciendo(verificacion, empleador, empleadoNombre);
    
    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: {
                    name: 'Cresalia Jobs',
                    email: 'jobs@cresalia.com'
                },
                to: [{ email: empleadoEmail }],
                subject: '💜 Gracias por confirmar tu pago - Cresalia Jobs',
                htmlContent: emailBody
            })
        });
        
        if (response.ok) {
            console.log('✅ Email de agradecimiento enviado:', empleadoEmail);
        } else {
            const error = await response.text();
            console.error('Error enviando email:', error);
        }
    } catch (error) {
        console.error('Error enviando email:', error);
    }
}

// ===== GENERAR EMAILS =====
function generarEmailPidiendoPago(verificacion, empleador, empleadoNombre) {
    const urlPlataforma = `${PLATAFORMA_URL}/cresalia-jobs/index.html`;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
        }
        .alert-box {
            background: #FEF2F2;
            border-left: 4px solid #EF4444;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .info-box {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border: 1px solid #e5e7eb;
        }
        .footer {
            background: #1f2937;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 10px 10px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚨 Verificación de Pago Pendiente</h1>
    </div>
    
    <div class="content">
        <p>Hola ${empleador.nombre_empresa || 'Empleador'},</p>
        
        <div class="alert-box">
            <p><strong>Se ha reportado que un empleado no ha recibido su pago.</strong></p>
            <p>${empleadoNombre || 'Un empleado'} ha marcado que <strong>NO</strong> recibió el pago correspondiente.</p>
        </div>
        
        <div class="info-box">
            <h3>Detalles del reporte:</h3>
            ${verificacion.monto_pactado ? `<p><strong>Monto pactado:</strong> $${verificacion.monto_pactado}</p>` : ''}
            ${verificacion.fecha_pago_esperada ? `<p><strong>Fecha de pago esperada:</strong> ${new Date(verificacion.fecha_pago_esperada).toLocaleDateString('es-AR')}</p>` : ''}
            ${verificacion.descripcion ? `<p><strong>Descripción:</strong> ${verificacion.descripcion}</p>` : ''}
        </div>
        
        <p><strong>Por favor, verifica la situación y realiza el pago correspondiente si corresponde.</strong></p>
        
        <p style="margin-top: 30px;">
            Si ya realizaste el pago, por favor contacta al empleado para resolver este tema.
        </p>
        
        <p>
            El compromiso y responsabilidad con los empleados es fundamental para mantener un marketplace ético y confiable.
        </p>
    </div>
    
    <div class="footer">
        <p>Cresalia Jobs - Marketplace Ético de Empleo</p>
        <p>💜 El compromiso con los empleados es nuestra prioridad</p>
    </div>
</body>
</html>
    `;
}

function generarEmailAgradeciendo(verificacion, empleador, empleadoNombre) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
        }
        .success-box {
            background: #F0FDF4;
            border-left: 4px solid #10B981;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .footer {
            background: #1f2937;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 10px 10px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>💜 ¡Gracias por tu Confirmación!</h1>
    </div>
    
    <div class="content">
        <p>Hola ${empleadoNombre || 'Empleado'},</p>
        
        <div class="success-box">
            <p><strong>¡Gracias por confirmar que recibiste tu pago!</strong></p>
            <p>Tu verificación ayuda a mantener un marketplace ético y confiable para todos.</p>
        </div>
        
        <p>
            El compromiso y responsabilidad de ${empleador.nombre_empresa || 'tu empleador'} con sus empleados es fundamental 
            para crear un ambiente de trabajo justo y respetuoso.
        </p>
        
        <p>
            <strong>¿Te gustaría calificar a tu empleador?</strong> Tu opinión ayuda a otros buscadores de empleo a tomar decisiones informadas.
        </p>
        
        <p style="margin-top: 30px; color: #6B7280; font-size: 0.9rem;">
            Si tienes alguna duda o necesitas ayuda, no dudes en contactarnos.
        </p>
    </div>
    
    <div class="footer">
        <p>Cresalia Jobs - Marketplace Ético de Empleo</p>
        <p>💜 Tu experiencia importa</p>
    </div>
</body>
</html>
    `;
}

// ===== FUNCIONES AUXILIARES =====
async function obtenerEmpleador(empleadorId) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/empleadores?id=eq.${empleadorId}&select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.length > 0 ? data[0] : null;
        }
    } catch (error) {
        console.error('Error obteniendo empleador:', error);
    }
    return null;
}

async function actualizarEmailEnviado(verificacionId, tipo) {
    try {
        const campo = tipo === 'empresa' ? 'email_enviado_empresa' : 'email_enviado_empleado';
        await fetch(`${SUPABASE_URL}/rest/v1/jobs_verificaciones_pago?id=eq.${verificacionId}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ [campo]: true })
        });
    } catch (error) {
        console.error('Error actualizando email enviado:', error);
    }
}

async function actualizarEstadisticasEmpleador(empleadorId) {
    try {
        // Llamar a la función SQL para actualizar estadísticas
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/actualizar_estadisticas_empleador`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ p_empleador_id: empleadorId })
        });
        
        if (!response.ok) {
            console.warn('No se pudieron actualizar estadísticas (función puede no existir aún)');
        }
    } catch (error) {
        console.error('Error actualizando estadísticas:', error);
    }
}

async function obtenerVerificaciones(req, res) {
    const { empleador_id, empleado_id, estado } = req.query;
    
    let url = `${SUPABASE_URL}/rest/v1/jobs_verificaciones_pago?order=fecha_creacion.desc`;
    
    if (empleador_id) {
        url += `&empleador_id=eq.${empleador_id}`;
    }
    if (empleado_id) {
        url += `&empleado_id=eq.${empleado_id}`;
    }
    if (estado) {
        url += `&estado=eq.${estado}`;
    }
    
    const response = await fetch(url, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error('Error obteniendo verificaciones');
    }
    
    const data = await response.json();
    
    return res.status(200).json({
        success: true,
        verificaciones: data
    });
}


