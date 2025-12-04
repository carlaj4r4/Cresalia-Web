/**
 * 📧 API Endpoint: Enviar Email con Brevo
 * Endpoint para enviar emails automáticos usando Brevo API
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'cresalia25@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || ADMIN_EMAIL;
const FROM_NAME = process.env.FROM_NAME || 'Cresalia';

function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async (req, res) => {
    applyCors(res);
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            message: 'Método no permitido. Usa POST para enviar emails.' 
        });
    }
    
    if (!BREVO_API_KEY) {
        return res.status(500).json({
            success: false,
            error: 'BREVO_API_KEY no está configurada en Vercel. Por favor, configurá tus credenciales en Settings → Environment Variables.'
        });
    }
    
    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        
        const {
            to,              // Email del destinatario (requerido)
            to_name,         // Nombre del destinatario (opcional)
            subject,         // Asunto del email (requerido)
            html_content,    // Contenido HTML del email (requerido)
            text_content,    // Contenido texto plano (opcional)
            template_type    // Tipo de template: 'bienvenida', 'primera_compra', 'primera_venta', 'primer_turno'
        } = body;
        
        // Validaciones
        if (!to || !subject || !html_content) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos: to, subject, html_content'
            });
        }
        
        // Preparar contenido según tipo de template
        let finalHtmlContent = html_content;
        if (template_type) {
            finalHtmlContent = aplicarTemplate(template_type, html_content, { to_name, ...body });
        }
        
        // Enviar email con Brevo
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: {
                    name: FROM_NAME,
                    email: FROM_EMAIL
                },
                to: [{
                    email: to,
                    name: to_name || to.split('@')[0]
                }],
                subject: subject,
                htmlContent: finalHtmlContent,
                textContent: text_content || html_content.replace(/<[^>]*>/g, '') // Convertir HTML a texto si no se proporciona
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error de Brevo API:', response.status, errorText);
            
            try {
                const errorData = JSON.parse(errorText);
                return res.status(response.status).json({
                    success: false,
                    error: errorData.message || 'Error al enviar email con Brevo',
                    details: errorData
                });
            } catch (parseError) {
                return res.status(response.status).json({
                    success: false,
                    error: 'Error al enviar email con Brevo',
                    details: errorText
                });
            }
        }
        
        const result = await response.json();
        
        return res.status(200).json({
            success: true,
            message: 'Email enviado correctamente',
            messageId: result.messageId || null
        });
        
    } catch (error) {
        console.error('❌ Error en /api/enviar-email-brevo:', error.message);
        console.error('Stack:', error.stack);
        
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor al enviar el email',
            details: error.message
        });
    }
};

// Función para aplicar templates predefinidos
function aplicarTemplate(tipo, contenido, datos) {
    const templates = {
        bienvenida: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>¡Bienvenido a Cresalia! 💜</h1>
                    </div>
                    <div class="content">
                        <p>Hola ${datos.to_name || 'Usuario'},</p>
                        ${contenido}
                        <p>¡Esperamos que disfrutes de nuestra plataforma!</p>
                    </div>
                    <div class="footer">
                        <p>Cresalia - Plataforma para emprendedores</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        primera_compra: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 ¡Felicitaciones por tu primera compra!</h1>
                    </div>
                    <div class="content">
                        <p>Hola ${datos.to_name || 'Usuario'},</p>
                        ${contenido}
                        <p>¡Gracias por confiar en Cresalia!</p>
                    </div>
                    <div class="footer">
                        <p>Cresalia - Plataforma para emprendedores</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    return templates[tipo] || contenido;
}

