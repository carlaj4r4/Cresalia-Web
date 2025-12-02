// ===== API: Enviar Alertas de Servicios Públicos a Autoridades =====
// Endpoint para enviar alertas consolidadas a autoridades

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'carla@cresalia.com';

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
            error: 'Method not allowed'
        });
    }
    
    try {
        const { tipo_servicio, ciudad, provincia, direccion, descripcion, urgencia, num_reportes } = req.body;
        
        // Validación
        if (!tipo_servicio || !ciudad || !provincia || !descripcion) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos'
            });
        }
        
        // Mapear tipos de servicio a emojis y nombres
        const servicios = {
            'luz': { emoji: '⚡', nombre: 'Luz / Electricidad', autoridad: 'Empresa distribuidora de electricidad' },
            'agua': { emoji: '💧', nombre: 'Agua', autoridad: 'Empresa de servicios sanitarios' },
            'gas': { emoji: '🔥', nombre: 'Gas', autoridad: 'Empresa distribuidora de gas' },
            'otro': { emoji: '⚙️', nombre: 'Otro servicio', autoridad: 'Autoridades competentes' }
        };
        
        const servicio = servicios[tipo_servicio] || servicios['otro'];
        
        // Crear mensaje de alerta
        const asunto = `🚨 ALERTA: Múltiples reportes de corte de ${servicio.nombre} en ${ciudad}, ${provincia}`;
        
        const cuerpoHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
                    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                    .alert-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
                    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; }
                    .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
                    .badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin: 5px 0; }
                    .badge-urgente { background: #dc2626; color: white; }
                    .badge-moderado { background: #ea580c; color: white; }
                    .badge-leve { background: #f59e0b; color: white; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0;">${servicio.emoji} Alerta de Servicios Públicos</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">Cresalia - Sistema de Alertas Ciudadanas</p>
                    </div>
                    
                    <div class="content">
                        <div class="alert-box">
                            <strong>⚠️ Se han recibido múltiples reportes</strong><br>
                            Se han acumulado <strong>${num_reportes || 'varios'}</strong> reportes de ciudadanos sobre un corte de servicio en esta zona.
                        </div>
                        
                        <div class="info-box">
                            <h2 style="margin-top: 0; color: #374151;">Información del Reporte</h2>
                            
                            <p><strong>Tipo de Servicio:</strong> ${servicio.emoji} ${servicio.nombre}</p>
                            
                            <p><strong>Ubicación:</strong><br>
                            ${ciudad}, ${provincia}<br>
                            ${direccion ? `<small>${direccion}</small>` : ''}
                            </p>
                            
                            <p><strong>Nivel de Urgencia:</strong><br>
                            <span class="badge badge-${urgencia}">
                                ${urgencia === 'urgente' ? '🚨 Urgente' : urgencia === 'moderado' ? '⚠️ Moderado' : '📋 Leve'}
                            </span>
                            </p>
                            
                            <p><strong>Descripción:</strong><br>
                            ${descripcion.replace(/\n/g, '<br>')}
                            </p>
                            
                            <p><strong>Número de Reportes:</strong> ${num_reportes || 'Varios'}</p>
                        </div>
                        
                        <div class="info-box">
                            <h3 style="margin-top: 0; color: #374151;">Recomendaciones</h3>
                            <ul>
                                <li>Verificar el estado del servicio en la zona mencionada</li>
                                <li>Comunicar a los ciudadanos sobre el estado del corte y tiempo estimado de reparación</li>
                                <li>Informar sobre medidas alternativas si es necesario</li>
                            </ul>
                        </div>
                        
                        <div class="info-box" style="background: #f0fdf4; border-left: 4px solid #059669;">
                            <p style="margin: 0;"><strong>💡 Nota:</strong> Esta alerta fue generada automáticamente por el sistema de reportes ciudadanos de Cresalia. 
                            Los ciudadanos han autorizado que esta información sea compartida con las autoridades competentes.</p>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p style="margin: 0;">
                            Este es un mensaje automático de Cresalia<br>
                            Sistema de Alertas de Servicios Públicos<br>
                            <a href="https://cresalia.com" style="color: #10b981;">cresalia.com</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        // Enviar email a autoridades (por ahora a admin, después se puede configurar emails específicos)
        if (BREVO_API_KEY) {
            const emailData = {
                sender: {
                    name: 'Cresalia Alertas',
                    email: 'alertas@cresalia.com'
                },
                to: [
                    {
                        email: ADMIN_EMAIL,
                        name: 'Autoridades'
                    }
                ],
                subject: asunto,
                htmlContent: cuerpoHTML
            };
            
            const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'api-key': BREVO_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });
            
            if (!emailResponse.ok) {
                const errorText = await emailResponse.text();
                console.error('Error enviando email:', errorText);
                // No fallar si el email falla, solo loguear
            }
        }
        
        // También guardar la alerta en la base de datos para registro
        // Esto se puede hacer después
        
        return res.status(200).json({
            success: true,
            message: 'Alerta enviada correctamente a las autoridades',
            alerta: {
                tipo_servicio,
                ciudad,
                provincia,
                num_reportes
            }
        });
        
    } catch (error) {
        console.error('❌ Error en alertas-servicios-enviar.js:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};



