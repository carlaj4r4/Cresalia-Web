/**
 * Sistema de Emails de Bienvenida para Cresalia
 * 
 * Este módulo se encarga de enviar emails de bienvenida personalizados
 * para tiendas, servicios y emprendedores usando Resend API
 * 
 * IMPORTANTE: Configurar RESEND_API_KEY en las variables de entorno de Vercel
 */

// Configuración
const RESEND_API_KEY = 'TU_API_KEY_AQUI'; // Reemplazar con tu API key real
const FROM_EMAIL = 'Cresalia <hola@cresalia.com>'; // Cambiar cuando tengas dominio verificado

/**
 * Enviar email de bienvenida según tipo de usuario
 * @param {Object} datos - Datos del usuario
 * @param {string} datos.email - Email del destinatario
 * @param {string} datos.nombre - Nombre de la tienda/servicio/emprendedor
 * @param {string} datos.tipo - Tipo: 'tienda', 'servicio', 'emprendedor'
 * @param {string} datos.subdomain - Subdominio asignado
 * @param {string} datos.plan - Plan contratado (opcional)
 * @returns {Promise<Object>} Resultado del envío
 */
async function enviarEmailBienvenida(datos) {
    try {
        // Validar datos requeridos
        if (!datos.email || !datos.nombre || !datos.tipo) {
            throw new Error('Faltan datos requeridos: email, nombre o tipo');
        }

        // Seleccionar template según tipo
        const template = obtenerTemplate(datos);
        
        // Construir subject según tipo
        const subject = obtenerSubject(datos.tipo, datos.nombre);

        // Enviar email via Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: FROM_EMAIL,
                to: datos.email,
                subject: subject,
                html: template
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Error de Resend: ${error.message || response.statusText}`);
        }

        const result = await response.json();
        
        console.log('✅ Email de bienvenida enviado:', {
            email: datos.email,
            tipo: datos.tipo,
            id: result.id
        });

        return {
            success: true,
            emailId: result.id,
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
 * Obtener template HTML según tipo de usuario
 */
function obtenerTemplate(datos) {
    const { tipo, nombre, subdomain, plan } = datos;
    
    // Templates simplificados (inline)
    // En producción, estos deberían cargarse desde archivos .html
    
    if (tipo === 'tienda') {
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
            <p><strong>📍 Tu link único:</strong></p>
            <div style="background: #EFF6FF; border-left: 4px solid #2563EB; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
                <strong style="color: #2563EB;">${subdomain || 'tu-tienda'}.cresalia.com</strong>
            </div>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://cresalia.com/tiendas/panel.html" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #2563EB 0%, #7C3AED 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    🚀 Ir a Mi Panel
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
    
    if (tipo === 'servicio') {
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
            <p><strong>📍 Tu perfil único:</strong></p>
            <div style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
                <strong style="color: #10B981;">${subdomain || 'tu-servicio'}.cresalia.com</strong>
            </div>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://cresalia.com/tiendas/panel.html" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #10B981 0%, #14B8A6 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
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
    
    if (tipo === 'emprendedor') {
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
            <p><strong>📍 Tu perfil único:</strong></p>
            <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
                <strong style="color: #F59E0B;">${subdomain || 'tu-perfil'}.cresalia.com</strong>
            </div>
            <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <h3 style="color: #F59E0B; margin-top: 0;">🌟 Acceso Exclusivo a Comunidades</h3>
                <p>Tenés acceso a comunidades de apoyo mutuo, networking y más!</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://cresalia.com/tiendas/panel.html" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
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
    
    // Template por defecto
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

/**
 * Obtener subject del email según tipo
 */
function obtenerSubject(tipo, nombre) {
    const subjects = {
        'tienda': `🎉 ¡Bienvenido a Cresalia, ${nombre}!`,
        'servicio': `🎉 ¡Bienvenido a Cresalia, ${nombre}!`,
        'emprendedor': `🚀 ¡Bienvenido Emprendedor! - ${nombre}`
    };
    
    return subjects[tipo] || `¡Bienvenido a Cresalia, ${nombre}!`;
}

// Exportar función principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { enviarEmailBienvenida };
}
