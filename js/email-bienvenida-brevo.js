/**
 * 📧 Sistema de Emails de Bienvenida con Brevo
 * 
 * Envía emails de bienvenida personalizados para:
 * - Tiendas
 * - Servicios
 * - Emprendedores
 * 
 * Usa el API endpoint de Brevo ya configurado: /api/enviar-email-brevo
 */

/**
 * Enviar email de bienvenida según tipo de usuario
 * @param {Object} datos - Datos del usuario
 * @param {string} datos.email - Email del destinatario
 * @param {string} datos.nombre - Nombre de la tienda/servicio/emprendedor
 * @param {string} datos.tipo - Tipo: 'tienda', 'servicio', 'emprendedor'
 * @param {string} datos.subdomain - Subdominio asignado (opcional)
 * @param {string} datos.plan - Plan contratado (opcional)
 * @returns {Promise<Object>} Resultado del envío
 */
async function enviarEmailBienvenida(datos) {
    try {
        // Validar datos requeridos
        if (!datos.email || !datos.nombre || !datos.tipo) {
            throw new Error('Faltan datos requeridos: email, nombre o tipo');
        }

        // Construir subject y HTML según tipo
        const { subject, htmlContent } = construirEmail(datos);

        // Enviar via API de Brevo
        const response = await fetch('/api/enviar-email-brevo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: datos.email,
                to_name: datos.nombre,
                subject: subject,
                html_content: htmlContent,
                template_type: null // No usar template predefinido, ya traemos HTML completo
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al enviar email');
        }

        const result = await response.json();
        
        console.log('✅ Email de bienvenida enviado:', {
            email: datos.email,
            tipo: datos.tipo,
            messageId: result.messageId
        });

        return {
            success: true,
            messageId: result.messageId,
            message: 'Email enviado correctamente'
        };

    } catch (error) {
        console.error('❌ Error enviando email de bienvenida:', error);
        
        // NO lanzar error para no bloquear el registro
        return {
            success: false,
            error: error.message,
            message: 'No se pudo enviar el email (no crítico)'
        };
    }
}

/**
 * Construir email según tipo de usuario
 */
function construirEmail(datos) {
    const { tipo, nombre, subdomain, plan } = datos;
    
    const subjects = {
        'comprador': `🛍️ ¡Bienvenido a Cresalia, ${nombre}!`,
        'tienda': `🎉 ¡Bienvenido a Cresalia, ${nombre}!`,
        'servicio': `🎉 ¡Bienvenido a Cresalia, ${nombre}!`,
        'emprendedor': `🚀 ¡Bienvenido Emprendedor! - ${nombre}`
    };
    
    const subject = subjects[tipo] || `¡Bienvenido a Cresalia, ${nombre}!`;
    
    let htmlContent = '';
    
    if (tipo === 'comprador') {
        htmlContent = getTemplateComprador(nombre);
    } else if (tipo === 'tienda') {
        htmlContent = getTemplateTienda(nombre, subdomain, plan);
    } else if (tipo === 'servicio') {
        htmlContent = getTemplateServicio(nombre, subdomain);
    } else if (tipo === 'emprendedor') {
        htmlContent = getTemplateEmprendedor(nombre, subdomain);
    } else {
        htmlContent = getTemplateGenerico(nombre);
    }
    
    return { subject, htmlContent };
}

/**
 * Template para Compradores
 */
function getTemplateComprador(nombre) {
    return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>¡Bienvenido a Cresalia!</title></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#f3f4f6;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f3f4f6;"><tr><td style="padding:40px 20px;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1);"><tr><td style="background:linear-gradient(135deg,#EC4899 0%,#F43F5E 100%);padding:40px 30px;text-align:center;"><h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:700;text-shadow:0 2px 4px rgba(0,0,0,0.1);">🛍️ ¡Bienvenido a Cresalia!</h1><p style="margin:10px 0 0 0;color:#ffffff;font-size:16px;opacity:0.95;">Tu nueva plataforma de compras</p></td></tr><tr><td style="padding:40px 30px;"><h2 style="margin:0 0 20px 0;color:#1F2937;font-size:24px;font-weight:600;">Hola, ${nombre} 👋</h2><p style="margin:0 0 16px 0;color:#4B5563;font-size:16px;line-height:1.6;">¡Gracias por unirte a Cresalia! Estamos emocionados de que formes parte de nuestra comunidad de compradores.</p><p style="margin:0 0 24px 0;color:#4B5563;font-size:16px;line-height:1.6;">Con tu cuenta de comprador, podés:</p><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:30px;"><tr><td style="padding:12px 0;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="width:40px;vertical-align:top;"><div style="width:32px;height:32px;background:linear-gradient(135deg,#EC4899,#F43F5E);border-radius:8px;display:inline-block;text-align:center;line-height:32px;"><span style="color:#ffffff;font-size:18px;">🛒</span></div></td><td style="padding-left:12px;"><p style="margin:0;color:#1F2937;font-size:15px;font-weight:600;">Explorar miles de productos</p><p style="margin:4px 0 0 0;color:#6B7280;font-size:14px;">De emprendedores locales y tiendas verificadas</p></td></tr></table></td></tr><tr><td style="padding:12px 0;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="width:40px;vertical-align:top;"><div style="width:32px;height:32px;background:linear-gradient(135deg,#EC4899,#F43F5E);border-radius:8px;display:inline-block;text-align:center;line-height:32px;"><span style="color:#ffffff;font-size:18px;">💳</span></div></td><td style="padding-left:12px;"><p style="margin:0;color:#1F2937;font-size:15px;font-weight:600;">Comprar de forma segura</p><p style="margin:4px 0 0 0;color:#6B7280;font-size:14px;">Con múltiples métodos de pago protegidos</p></td></tr></table></td></tr><tr><td style="padding:12px 0;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="width:40px;vertical-align:top;"><div style="width:32px;height:32px;background:linear-gradient(135deg,#EC4899,#F43F5E);border-radius:8px;display:inline-block;text-align:center;line-height:32px;"><span style="color:#ffffff;font-size:18px;">⭐</span></div></td><td style="padding-left:12px;"><p style="margin:0;color:#1F2937;font-size:15px;font-weight:600;">Seguir tus tiendas favoritas</p><p style="margin:4px 0 0 0;color:#6B7280;font-size:14px;">Y recibir notificaciones de nuevos productos</p></td></tr></table></td></tr><tr><td style="padding:12px 0;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="width:40px;vertical-align:top;"><div style="width:32px;height:32px;background:linear-gradient(135deg,#EC4899,#F43F5E);border-radius:8px;display:inline-block;text-align:center;line-height:32px;"><span style="color:#ffffff;font-size:18px;">📦</span></div></td><td style="padding-left:12px;"><p style="margin:0;color:#1F2937;font-size:15px;font-weight:600;">Hacer seguimiento de pedidos</p><p style="margin:4px 0 0 0;color:#6B7280;font-size:14px;">Desde la compra hasta la entrega</p></td></tr></table></td></tr><tr><td style="padding:12px 0;"><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="width:40px;vertical-align:top;"><div style="width:32px;height:32px;background:linear-gradient(135deg,#EC4899,#F43F5E);border-radius:8px;display:inline-block;text-align:center;line-height:32px;"><span style="color:#ffffff;font-size:18px;">👥</span></div></td><td style="padding-left:12px;"><p style="margin:0;color:#1F2937;font-size:15px;font-weight:600;">Unirte a la comunidad</p><p style="margin:4px 0 0 0;color:#6B7280;font-size:14px;">Conectar con otros compradores y emprendedores</p></td></tr></table></td></tr></table><table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:30px 0;"><tr><td align="center"><a href="https://cresalia-web.vercel.app/demo-buyer-interface.html" style="display:inline-block;padding:16px 32px;background:linear-gradient(135deg,#EC4899,#F43F5E);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:16px;box-shadow:0 4px 12px rgba(236,72,153,0.3);">🛍️ Empezar a Comprar</a></td></tr></table><div style="background:#FEF2F8;border-left:4px solid #EC4899;padding:16px;border-radius:8px;margin-top:30px;"><p style="margin:0 0 8px 0;color:#BE185D;font-size:14px;font-weight:600;">💡 Consejo:</p><p style="margin:0;color:#831843;font-size:14px;line-height:1.5;">Configurá tus preferencias de notificaciones en "Mi Cuenta" para recibir alertas sobre ofertas, nuevos productos y actualizaciones de tus tiendas favoritas.</p></div></td></tr><tr><td style="background-color:#F9FAFB;padding:30px;text-align:center;border-top:1px solid #E5E7EB;"><p style="margin:0 0 12px 0;color:#6B7280;font-size:14px;">¿Necesitás ayuda? Estamos aquí para vos</p><p style="margin:0 0 20px 0;"><a href="https://cresalia-web.vercel.app/soporte.html" style="color:#EC4899;text-decoration:none;font-weight:600;">Centro de Ayuda</a><span style="color:#D1D5DB;margin:0 8px;">|</span><a href="mailto:soporte@cresalia.com" style="color:#EC4899;text-decoration:none;font-weight:600;">Contactar Soporte</a></p><p style="margin:0;color:#9CA3AF;font-size:12px;">© 2024 Cresalia. Todos los derechos reservados.<br>Conectando emprendedores con el mundo.</p></td></tr></table></td></tr></table></body></html>`;
}

/**
 * Template para Tiendas
 */
function getTemplateTienda(nombre, subdomain, plan) {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenida a Cresalia</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white; padding: 40px 30px; text-align: center;">
            <div style="font-size: 50px; margin-bottom: 10px;">🎉</div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">¡Bienvenido a Cresalia!</h1>
        </div>
        <div style="padding: 40px 30px; color: #333; line-height: 1.8;">
            <h2 style="color: #2563EB; font-size: 22px; margin-top: 0;">Hola ${nombre},</h2>
            <p>¡Estamos muy felices de tenerte en nuestra comunidad de emprendedores! 🚀</p>
            <div style="background: #EFF6FF; border-left: 4px solid #2563EB; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
                <strong style="color: #2563EB;">Tu tienda ha sido creada exitosamente</strong><br>
                Ya podés empezar a vender y conectar con miles de compradores.
            </div>
            ${subdomain ? `
            <p><strong>📍 Tu link único:</strong></p>
            <div style="background: #EFF6FF; border-left: 4px solid #2563EB; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
                <strong style="color: #2563EB;">cresalia-web.vercel.app/tiendas/${subdomain}</strong>
            </div>
            ` : ''}
            <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; font-size: 18px; margin-top: 0;">🎯 Próximos pasos:</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li style="margin: 10px 0; color: #4B5563;">Completa tu perfil con información de contacto</li>
                    <li style="margin: 10px 0; color: #4B5563;">Sube tus primeros productos</li>
                    <li style="margin: 10px 0; color: #4B5563;">Personaliza tu tienda</li>
                    <li style="margin: 10px 0; color: #4B5563;">Comparte tu link único</li>
                </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-final.html" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);">
                    🚀 Ir a Mi Panel de Tienda
                </a>
            </div>
            <p>Plan actual: <strong>${plan || 'Básico'}</strong></p>
            <p style="margin-top: 30px;">Saludos cordiales,<br><strong>El equipo de Cresalia</strong> ❤️</p>
        </div>
        <div style="background: #F9FAFB; padding: 30px; text-align: center; color: #6B7280; font-size: 14px;">
            <p><strong>Cresalia</strong> - Plataforma de Emprendedores</p>
            <p style="font-size: 12px; color: #9CA3AF; margin-top: 15px;">
                Este email fue enviado automáticamente.
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

/**
 * Template para Servicios
 */
function getTemplateServicio(nombre, subdomain) {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenida a Cresalia</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #10B981 0%, #14B8A6 100%); color: white; padding: 40px 30px; text-align: center;">
            <div style="font-size: 50px; margin-bottom: 10px;">🎉</div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">¡Bienvenido a Cresalia!</h1>
        </div>
        <div style="padding: 40px 30px; color: #333; line-height: 1.8;">
            <h2 style="color: #10B981; font-size: 22px; margin-top: 0;">Hola ${nombre},</h2>
            <p>¡Estamos muy felices de tenerte en nuestra comunidad de profesionales! 🚀</p>
            <div style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
                <strong style="color: #10B981;">Tu perfil de servicio ha sido creado exitosamente</strong><br>
                Ya podés empezar a ofrecer tus servicios profesionales.
            </div>
            ${subdomain ? `
            <p><strong>📍 Tu perfil único:</strong></p>
            <div style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
                <strong style="color: #10B981;">cresalia-web.vercel.app/tiendas/${subdomain}</strong>
            </div>
            ` : ''}
            <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; font-size: 18px; margin-top: 0;">🎯 Próximos pasos:</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li style="margin: 10px 0; color: #4B5563;">Completa tu perfil profesional</li>
                    <li style="margin: 10px 0; color: #4B5563;">Detalla tus servicios</li>
                    <li style="margin: 10px 0; color: #4B5563;">Agrega portfolio</li>
                    <li style="margin: 10px 0; color: #4B5563;">Comparte tu perfil</li>
                </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-final.html" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #10B981 0%, #14B8A6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
                    🚀 Ir a Mi Panel
                </a>
            </div>
            <p style="margin-top: 30px;">Saludos cordiales,<br><strong>El equipo de Cresalia</strong> ❤️</p>
        </div>
        <div style="background: #F9FAFB; padding: 30px; text-align: center; color: #6B7280; font-size: 14px;">
            <p><strong>Cresalia</strong> - Plataforma de Servicios Profesionales</p>
            <p style="font-size: 12px; color: #9CA3AF; margin-top: 15px;">
                Este email fue enviado automáticamente.
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

/**
 * Template para Emprendedores
 */
function getTemplateEmprendedor(nombre, subdomain) {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenida a Cresalia</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%); color: white; padding: 40px 30px; text-align: center;">
            <div style="font-size: 50px; margin-bottom: 10px;">🚀</div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">¡Bienvenido Emprendedor!</h1>
        </div>
        <div style="padding: 40px 30px; color: #333; line-height: 1.8;">
            <h2 style="color: #F59E0B; font-size: 22px; margin-top: 0;">Hola ${nombre},</h2>
            <p>¡Estamos muy emocionados de tenerte en nuestra comunidad de emprendedores! 🎉</p>
            <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
                <strong style="color: #F59E0B;">Tu perfil de emprendedor ha sido creado exitosamente</strong><br>
                Ya sos parte de una comunidad vibrante que se apoya mutuamente.
            </div>
            ${subdomain ? `
            <p><strong>📍 Tu perfil único:</strong></p>
            <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
                <strong style="color: #F59E0B;">cresalia-web.vercel.app/tiendas/${subdomain}</strong>
            </div>
            ` : ''}
            <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <h3 style="color: #F59E0B; margin-top: 0;">🌟 Acceso Exclusivo a Comunidades</h3>
                <p style="text-align: left;">Como emprendedor, tenés acceso a nuestras comunidades de apoyo mutuo donde podés:</p>
                <ul style="text-align: left; display: inline-block; margin: 10px auto;">
                    <li style="margin: 8px 0;">Conectar con otros emprendedores</li>
                    <li style="margin: 8px 0;">Compartir experiencias</li>
                    <li style="margin: 8px 0;">Recibir apoyo emocional</li>
                    <li style="margin: 8px 0;">Encontrar colaboradores</li>
                </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-final.html" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);">
                    🚀 Ir a Mi Panel
                </a>
            </div>
            <p>No estás solo/a en este camino. Tenés toda una comunidad que te respalda! 💪</p>
            <p style="margin-top: 30px;">¡Mucha fuerza!<br><strong>El equipo de Cresalia</strong> ❤️</p>
        </div>
        <div style="background: #F9FAFB; padding: 30px; text-align: center; color: #6B7280; font-size: 14px;">
            <p><strong>Cresalia</strong> - Comunidad de Emprendedores</p>
            <p style="font-size: 12px; color: #9CA3AF; margin-top: 15px;">
                Este email fue enviado automáticamente.
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

/**
 * Template genérico
 */
function getTemplateGenerico(nombre) {
    return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px;">
    <h1>¡Bienvenido a Cresalia!</h1>
    <p>Hola ${nombre},</p>
    <p>Tu cuenta ha sido creada exitosamente.</p>
    <p>Saludos,<br>El equipo de Cresalia</p>
</body>
</html>
    `;
}

// Exportar función principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { enviarEmailBienvenida };
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.enviarEmailBienvenida = enviarEmailBienvenida;
}

console.log('📧 Sistema de emails de bienvenida con Brevo cargado');
