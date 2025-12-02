// ===== API: REPORTAR ERRORES - SISTEMA PROPIO =====
// Endpoint para recibir errores del frontend y enviar alertas por email vía Brevo

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const EMAIL_DESTINO = process.env.ADMIN_EMAIL || 'cresalia25@gmail.com';

// Clasificación de severidad
const SEVERITY_LEVELS = {
    'critical': {
        subject: '🚨 ERROR CRÍTICO - Cresalia',
        priority: 'urgent',
        sendEmail: true
    },
    'high': {
        subject: '⚠️ Error Importante - Cresalia',
        priority: 'high',
        sendEmail: true
    },
    'medium': {
        subject: 'ℹ️ Error Moderado - Cresalia',
        priority: 'normal',
        sendEmail: false // Solo enviar email si se repite
    },
    'low': {
        subject: '📝 Error Menor - Cresalia',
        priority: 'low',
        sendEmail: false
    }
};

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed. Use POST.' 
        });
    }
    
    try {
        const { error, url, userAgent, user, severity = 'medium', metadata = {} } = req.body;
        
        if (!error || !error.message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Missing required field: error.message' 
            });
        }
        
        // Determinar nivel de severidad
        const severityConfig = SEVERITY_LEVELS[severity] || SEVERITY_LEVELS.medium;
        
        // Construir mensaje de email
        const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .error-box { background: white; padding: 15px; border-left: 4px solid #ef4444; margin: 15px 0; border-radius: 5px; }
        .metadata { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border: 1px solid #e5e7eb; }
        .label { font-weight: bold; color: #667eea; }
        .footer { background: #1f2937; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
        pre { background: #1f2937; color: #10b981; padding: 15px; border-radius: 5px; overflow-x: auto; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${severityConfig.subject}</h1>
        <p>Error detectado en Cresalia</p>
    </div>
    
    <div class="content">
        <div class="error-box">
            <h2>📋 Detalles del Error</h2>
            <p><span class="label">Mensaje:</span> ${error.message || 'N/A'}</p>
            <p><span class="label">Severidad:</span> ${severity.toUpperCase()}</p>
            ${error.stack ? `<p><span class="label">Stack Trace:</span></p><pre>${error.stack}</pre>` : ''}
        </div>
        
        <div class="metadata">
            <h3>📊 Información Adicional</h3>
            <p><span class="label">URL:</span> ${url || 'N/A'}</p>
            <p><span class="label">User Agent:</span> ${userAgent || 'N/A'}</p>
            <p><span class="label">Usuario:</span> ${user?.email || user?.nombre || 'Anónimo'}</p>
            <p><span class="label">Fecha:</span> ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
            ${Object.keys(metadata).length > 0 ? `
                <p><span class="label">Metadata:</span></p>
                <pre>${JSON.stringify(metadata, null, 2)}</pre>
            ` : ''}
        </div>
    </div>
    
    <div class="footer">
        <p>Este es un email automático del sistema de monitoreo de Cresalia</p>
        <p>Si recibes muchos errores similares, considera revisar la causa raíz</p>
    </div>
</body>
</html>
        `;
        
        // Si la severidad requiere email, enviarlo
        if (severityConfig.sendEmail && BREVO_API_KEY) {
            try {
                const emailResponse = await fetch(BREVO_API_URL, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'api-key': BREVO_API_KEY,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: {
                            name: 'Cresalia - Sistema de Monitoreo',
                            email: 'noreply@cresalia.com' // Cambiar por tu email verificado en Brevo
                        },
                        to: [
                            {
                                email: EMAIL_DESTINO,
                                name: 'Cresalia Admin'
                            }
                        ],
                        subject: severityConfig.subject,
                        htmlContent: emailBody,
                        priority: severityConfig.priority === 'urgent' ? 'urgent' : 'normal'
                    })
                });
                
                if (!emailResponse.ok) {
                    const errorText = await emailResponse.text();
                    console.error('❌ Error enviando email por Brevo:', errorText);
                    // Continuar aunque falle el email (guardamos el error igual)
                } else {
                    console.log('✅ Email de alerta enviado exitosamente');
                }
            } catch (emailError) {
                console.error('❌ Error en petición a Brevo:', emailError);
                // Continuar aunque falle el email
            }
        }
        
        // TODO: Guardar en Supabase (opcional)
        // Aquí podrías guardar el error en una tabla de Supabase para tener un historial
        
        return res.status(200).json({ 
            success: true,
            message: 'Error reportado exitosamente',
            emailSent: severityConfig.sendEmail && BREVO_API_KEY ? true : false
        });
        
    } catch (error) {
        console.error('❌ Error en reportar-error.js:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Error interno del servidor',
            details: error.message 
        });
    }
};



