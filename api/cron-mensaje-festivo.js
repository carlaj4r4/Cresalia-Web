// ==================== CRON: MENSAJE FESTIVO AUTOMÁTICO ====================
// Envía emails y notificaciones push a todos los usuarios registrados
// Se ejecuta automáticamente el 24 de diciembre a las 00:00 UTC

const { createClient } = require('@supabase/supabase-js');

// Configuración desde variables de entorno de Vercel
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'cresalia25@gmail.com';
const FROM_NAME = process.env.FROM_NAME || 'Cresalia';

// Inicializar Supabase
function getSupabase() {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error('Supabase no configurado. Verifica SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en Vercel.');
    }
    return createClient(SUPABASE_URL.trim(), SUPABASE_KEY.trim());
}

// Template de email festivo
function obtenerTemplateEmailFestivo(nombre, tipo) {
    const esVendedor = tipo === 'vendedor';
    const año = new Date().getFullYear();
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Felices Fiestas desde Cresalia!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); color: white; padding: 40px 30px; text-align: center;">
            <div style="font-size: 60px; margin-bottom: 10px;">🎄✨</div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">¡Felices Fiestas!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Desde Cresalia te deseamos lo mejor</p>
        </div>
        <div style="padding: 40px 30px; color: #333; line-height: 1.8;">
            <h2 style="color: #7C3AED; font-size: 22px; margin-top: 0;">Hola ${nombre},</h2>
            <p>En este día especial, queremos agradecerte por ser parte de nuestra comunidad. Tu confianza en Cresalia significa todo para nosotros.</p>
            <div style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1)); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #7C3AED;">
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #7C3AED;">🎉 Te deseamos un año lleno de buenas noticias</p>
                <p style="margin: 10px 0 0 0; color: #4B5563;">Que el 2026 te traiga oportunidades increíbles, crecimiento personal y profesional, y momentos especiales que recordarás siempre.</p>
            </div>
            ${esVendedor ? `
            <p>Como parte de nuestra comunidad de emprendedores, sabemos que cada día es una oportunidad para crecer. Que este nuevo año esté lleno de ventas exitosas, clientes satisfechos y logros que superen tus expectativas.</p>
            ` : `
            <p>Como parte de nuestra comunidad de compradores, esperamos que encuentres en Cresalia todo lo que necesitas. Que este nuevo año esté lleno de descubrimientos increíbles y experiencias de compra excepcionales.</p>
            `}
            <p style="margin-top: 30px;">No importa cómo fue tu año, cada experiencia fue un paso hacia adelante. Te esperan cosas increíbles, años increíbles llenos de oportunidades y crecimiento.</p>
            <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); color: white; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    🌟 ¡Que tengas unas fiestas maravillosas! 🌟
                </div>
            </div>
            <p style="margin-top: 30px;">Con cariño y gratitud,<br><strong>El equipo de Cresalia</strong> ❤️</p>
        </div>
        <div style="background: #F9FAFB; padding: 30px; text-align: center; color: #6B7280; font-size: 14px;">
            <p><strong>Cresalia</strong> - Plataforma E-commerce Multi-tenant</p>
            <p style="font-size: 12px; color: #9CA3AF; margin-top: 15px;">
                Este email fue enviado automáticamente el 24 de diciembre de ${año}.
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

// Enviar email con Brevo
async function enviarEmailConBrevo(email, nombre, tipo) {
    if (!BREVO_API_KEY) {
        throw new Error('BREVO_API_KEY no configurada');
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'api-key': BREVO_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sender: {
                name: FROM_NAME,
                email: FROM_EMAIL
            },
            to: [{
                email: email,
                name: nombre
            }],
            subject: '🎄 ¡Felices Fiestas desde Cresalia! 🎉',
            htmlContent: obtenerTemplateEmailFestivo(nombre, tipo)
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Brevo error ${response.status}: ${error}`);
    }

    return await response.json();
}

// Enviar notificación push real usando el endpoint de push notifications
async function enviarNotificacionPushReal(userId, nombre, tipo) {
    try {
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : process.env.NEXT_PUBLIC_VERCEL_URL || 'https://cresalia-web.vercel.app';
        
        const response = await fetch(`${baseUrl}/api/enviar-push-notification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                titulo: '🎄 ¡Felices Fiestas!',
                mensaje: `${nombre}, desde Cresalia te deseamos unas felices fiestas y un año lleno de oportunidades increíbles. ¡Que tengas un 2026 maravilloso!`,
                icono: '/icons/icon-192x192.png',
                url: '/'
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.warn(`⚠️ Error enviando push a ${userId}:`, errorData.error || response.statusText);
            return false;
        }

        const result = await response.json();
        if (result.enviadas > 0) {
            console.log(`✅ Push enviado a ${nombre} (${result.enviadas} dispositivos)`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`❌ Error enviando push notification a ${userId}:`, error.message);
        return false;
    }
}

// Función principal
module.exports = async (req, res) => {
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Log inicial para debugging
        console.log('🚀 Cron job ejecutado:', new Date().toISOString());
        console.log('📋 Query params:', req.query);
        console.log('🔍 Method:', req.method);
        
        // Verificar fecha (opcional: puede ejecutarse manualmente también)
        const ahora = new Date();
        const es24DeDiciembre = ahora.getMonth() === 11 && ahora.getDate() === 24;
        const forzarEjecucion = req.query.forzar === 'true';

        console.log(`📅 Fecha actual: ${ahora.toISOString()}`);
        console.log(`🎄 Es 24 de diciembre: ${es24DeDiciembre}`);
        console.log(`🔧 Forzar ejecución: ${forzarEjecucion}`);

        if (!es24DeDiciembre && !forzarEjecucion) {
            console.log('⚠️ Cron job no ejecutado: No es 24 de diciembre y no se forzó');
            return res.status(200).json({
                mensaje: 'No es 24 de diciembre. Usa ?forzar=true para ejecutar manualmente.',
                fecha_actual: ahora.toISOString(),
                mes: ahora.getMonth() + 1,
                dia: ahora.getDate()
            });
        }

        console.log('✅ Iniciando ejecución del cron job...');

        // Verificar configuración
        console.log('🔍 Verificando configuración...');
        console.log('📧 BREVO_API_KEY:', BREVO_API_KEY ? '✅ Configurada' : '❌ No configurada');
        console.log('🗄️ SUPABASE_URL:', SUPABASE_URL ? '✅ Configurada' : '❌ No configurada');
        console.log('🔑 SUPABASE_KEY:', SUPABASE_KEY ? '✅ Configurada' : '❌ No configurada');
        console.log('🔑 VAPID_PUBLIC_KEY:', process.env.VAPID_PUBLIC_KEY ? '✅ Configurada' : '❌ No configurada');
        console.log('🔐 VAPID_PRIVATE_KEY:', process.env.VAPID_PRIVATE_KEY ? '✅ Configurada' : '❌ No configurada');

        if (!BREVO_API_KEY) {
            console.error('❌ BREVO_API_KEY no configurada');
            return res.status(500).json({
                error: 'BREVO_API_KEY no configurada en Vercel'
            });
        }

        if (!SUPABASE_URL || !SUPABASE_KEY) {
            console.error('❌ Supabase no configurado');
            return res.status(500).json({
                error: 'SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configurados en Vercel'
            });
        }

        const supabase = getSupabase();

        // Obtener todos los usuarios registrados
        console.log('📊 Obteniendo usuarios de Supabase...');

        // Obtener compradores
        const { data: compradores, error: errorCompradores } = await supabase
            .from('compradores')
            .select('id, email, nombre_completo, user_id')
            .eq('activo', true)
            .not('email', 'is', null);

        if (errorCompradores) {
            console.error('Error obteniendo compradores:', errorCompradores);
        }

        // Obtener tiendas/vendedores
        const { data: tiendas, error: errorTiendas } = await supabase
            .from('tiendas')
            .select('id, email, nombre_tienda, user_id')
            .eq('activa', true)
            .not('email', 'is', null);

        if (errorTiendas) {
            console.error('Error obteniendo tiendas:', errorTiendas);
        }

        const usuarios = {
            compradores: compradores || [],
            vendedores: tiendas || []
        };

        const totalUsuarios = usuarios.compradores.length + usuarios.vendedores.length;

        if (totalUsuarios === 0) {
            return res.status(200).json({
                mensaje: 'No hay usuarios para enviar mensajes',
                total: 0
            });
        }

        let emailsEnviados = 0;
        let emailsError = 0;
        let notificacionesRegistradas = 0;

        // Procesar compradores
        console.log(`📧 Enviando emails a ${usuarios.compradores.length} compradores...`);
        for (const comprador of usuarios.compradores) {
            try {
                // Enviar email
                await enviarEmailConBrevo(
                    comprador.email,
                    comprador.nombre_completo || comprador.email.split('@')[0],
                    'comprador'
                );
                emailsEnviados++;

                // Enviar notificación push real
                if (comprador.user_id) {
                    const pushEnviado = await enviarNotificacionPushReal(
                        comprador.user_id,
                        comprador.nombre_completo || comprador.email.split('@')[0],
                        'comprador'
                    );
                    if (pushEnviado) {
                        notificacionesRegistradas++;
                    }
                }

                // Pausa para no sobrecargar Brevo (100ms entre emails)
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                emailsError++;
                console.error(`❌ Error con ${comprador.email}:`, error.message);
            }
        }

        // Procesar vendedores
        console.log(`📧 Enviando emails a ${usuarios.vendedores.length} vendedores...`);
        for (const vendedor of usuarios.vendedores) {
            try {
                // Enviar email
                await enviarEmailConBrevo(
                    vendedor.email,
                    vendedor.nombre_tienda || vendedor.email.split('@')[0],
                    'vendedor'
                );
                emailsEnviados++;

                // Enviar notificación push real
                if (vendedor.user_id) {
                    const pushEnviado = await enviarNotificacionPushReal(
                        vendedor.user_id,
                        vendedor.nombre_tienda || vendedor.email.split('@')[0],
                        'vendedor'
                    );
                    if (pushEnviado) {
                        notificacionesRegistradas++;
                    }
                }

                // Pausa para no sobrecargar Brevo
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                emailsError++;
                console.error(`❌ Error con ${vendedor.email}:`, error.message);
            }
        }

        const resultado = {
            exito: true,
            mensaje: 'Envío masivo completado',
            total_usuarios: totalUsuarios,
            emails_enviados: emailsEnviados,
            emails_error: emailsError,
            notificaciones_registradas: notificacionesRegistradas,
            porcentaje_exito: ((emailsEnviados / totalUsuarios) * 100).toFixed(2) + '%',
            fecha_ejecucion: ahora.toISOString()
        };

        console.log('✅ Envío completado:', resultado);

        return res.status(200).json(resultado);

    } catch (error) {
        console.error('❌ Error en cron mensaje festivo:', error);
        return res.status(500).json({
            error: 'Error en envío masivo',
            mensaje: error.message
        });
    }
};
