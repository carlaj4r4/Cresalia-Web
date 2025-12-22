/**
 * 📧 API Endpoint: Enviar Mensaje Festivo 24 de Diciembre
 * Envía email y notificación push a todos los usuarios registrados
 * Solo funciona el 24 de diciembre
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const FROM_EMAIL = process.env.FROM_EMAIL || 'cresalia25@gmail.com';
const FROM_NAME = process.env.FROM_NAME || 'Cresalia';

// Importar Supabase (si está disponible en el entorno)
let supabase = null;
try {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY
    );
} catch (error) {
    console.warn('⚠️ Supabase no disponible en este entorno');
}

function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Verificar si es 24 de diciembre
function es24DeDiciembre() {
    const ahora = new Date();
    const mes = ahora.getMonth(); // 0-11 (11 = diciembre)
    const dia = ahora.getDate();
    return mes === 11 && dia === 24;
}

// Template de email festivo
function obtenerTemplateEmailFestivo(nombre, tipo) {
    const esVendedor = tipo === 'vendedor';
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
                <p style="margin: 10px 0 0 0; color: #4B5563;">Que el 2025 te traiga oportunidades increíbles, crecimiento personal y profesional, y momentos especiales que recordarás siempre.</p>
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
                Este email fue enviado automáticamente el 24 de diciembre de ${new Date().getFullYear()}.
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

    const response = await fetch(BREVO_API_URL, {
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
        const error = await response.json();
        throw new Error(error.message || 'Error al enviar email');
    }

    return await response.json();
}

// Obtener todos los usuarios
async function obtenerTodosUsuarios() {
    if (!supabase) {
        throw new Error('Supabase no disponible');
    }

    // Obtener compradores
    const { data: compradores, error: errorCompradores } = await supabase
        .from('compradores')
        .select('email, nombre_completo, activo')
        .eq('activo', true);

    if (errorCompradores) {
        console.error('Error obteniendo compradores:', errorCompradores);
    }

    // Obtener vendedores/tiendas
    const { data: tiendas, error: errorTiendas } = await supabase
        .from('tiendas')
        .select('email, nombre_tienda, activa')
        .eq('activa', true);

    if (errorTiendas) {
        console.error('Error obteniendo tiendas:', errorTiendas);
    }

    return {
        compradores: compradores || [],
        vendedores: tiendas || []
    };
}

module.exports = async (req, res) => {
    applyCors(res);
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Solo permitir POST o GET
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({ 
            success: false, 
            message: 'Método no permitido' 
        });
    }
    
    // Verificar si es 24 de diciembre
    if (!es24DeDiciembre()) {
        return res.status(400).json({
            success: false,
            message: 'Este endpoint solo funciona el 24 de diciembre'
        });
    }

    try {
        // Obtener todos los usuarios
        const usuarios = await obtenerTodosUsuarios();
        const totalUsuarios = usuarios.compradores.length + usuarios.vendedores.length;
        
        let emailsEnviados = 0;
        let emailsError = 0;

        // Procesar compradores
        for (const comprador of usuarios.compradores) {
            try {
                await enviarEmailConBrevo(
                    comprador.email,
                    comprador.nombre_completo || comprador.email,
                    'comprador'
                );
                emailsEnviados++;
                
                // Pausa para no sobrecargar
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Error enviando email a ${comprador.email}:`, error);
                emailsError++;
            }
        }

        // Procesar vendedores
        for (const vendedor of usuarios.vendedores) {
            try {
                await enviarEmailConBrevo(
                    vendedor.email,
                    vendedor.nombre_tienda || vendedor.email,
                    'vendedor'
                );
                emailsEnviados++;
                
                // Pausa para no sobrecargar
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Error enviando email a ${vendedor.email}:`, error);
                emailsError++;
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Mensajes festivos enviados',
            totalUsuarios,
            emailsEnviados,
            emailsError
        });

    } catch (error) {
        console.error('Error en envío masivo:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
