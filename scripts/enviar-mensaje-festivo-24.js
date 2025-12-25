#!/usr/bin/env node

/**
 * 🎄 Script: Enviar Mensaje Festivo 24 de Diciembre
 * Se ejecuta desde GitHub Actions el 24 de diciembre
 * No requiere funciones serverless de Vercel
 */

const https = require('https');
const http = require('http');

// Configuración desde variables de entorno
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const FROM_EMAIL = process.env.FROM_EMAIL || 'cresalia25@gmail.com';
const FROM_NAME = process.env.FROM_NAME || 'Cresalia';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

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

// Enviar email con Brevo usando https
function enviarEmailConBrevo(email, nombre, tipo) {
    return new Promise((resolve, reject) => {
        if (!BREVO_API_KEY) {
            reject(new Error('BREVO_API_KEY no configurada'));
            return;
        }

        const data = JSON.stringify({
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
        });

        const options = {
            hostname: 'api.brevo.com',
            port: 443,
            path: '/v3/smtp/email',
            method: 'POST',
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(body));
                } else {
                    reject(new Error(`Error ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

// Obtener usuarios de Supabase
function obtenerUsuariosDeSupabase() {
    return new Promise((resolve, reject) => {
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            reject(new Error('SUPABASE_URL o SUPABASE_ANON_KEY no configurados'));
            return;
        }

        const url = new URL(SUPABASE_URL);
        const pathCompradores = `${url.pathname}/rest/v1/compradores?activo=eq.true&select=email,nombre_completo`;
        const pathTiendas = `${url.pathname}/rest/v1/tiendas?activa=eq.true&select=email,nombre_tienda`;

        // Obtener compradores
        const optionsCompradores = {
            hostname: url.hostname,
            port: 443,
            path: pathCompradores,
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        const reqCompradores = https.request(optionsCompradores, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                const compradores = JSON.parse(body);

                // Obtener tiendas
                const optionsTiendas = {
                    hostname: url.hostname,
                    port: 443,
                    path: pathTiendas,
                    method: 'GET',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json'
                    }
                };

                const reqTiendas = https.request(optionsTiendas, (resTiendas) => {
                    let bodyTiendas = '';
                    resTiendas.on('data', (chunk) => {
                        bodyTiendas += chunk;
                    });
                    resTiendas.on('end', () => {
                        const tiendas = JSON.parse(bodyTiendas);
                        resolve({
                            compradores: compradores || [],
                            vendedores: tiendas || []
                        });
                    });
                });

                reqTiendas.on('error', reject);
                reqTiendas.end();
            });
        });

        reqCompradores.on('error', reject);
        reqCompradores.end();
    });
}

// Función principal
async function main() {
    console.log('🎄 Iniciando envío de mensaje festivo 24 de diciembre...\n');

    // Verificar fecha
    if (!es24DeDiciembre()) {
        const ahora = new Date();
        console.log(`⚠️  No es 24 de diciembre. Fecha actual: ${ahora.getDate()}/${ahora.getMonth() + 1}/${ahora.getFullYear()}`);
        process.exit(0);
    }

    // Verificar variables de entorno
    if (!BREVO_API_KEY) {
        console.error('❌ BREVO_API_KEY no configurada');
        process.exit(1);
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('❌ SUPABASE_URL o SUPABASE_ANON_KEY no configurados');
        process.exit(1);
    }

    try {
        // Obtener usuarios
        console.log('📊 Obteniendo usuarios de Supabase...');
        const usuarios = await obtenerUsuariosDeSupabase();
        const totalUsuarios = usuarios.compradores.length + usuarios.vendedores.length;
        
        console.log(`✅ Total de usuarios encontrados: ${totalUsuarios}`);
        console.log(`   - Compradores: ${usuarios.compradores.length}`);
        console.log(`   - Vendedores: ${usuarios.vendedores.length}\n`);

        let emailsEnviados = 0;
        let emailsError = 0;

        // Procesar compradores
        console.log('📧 Enviando emails a compradores...');
        for (const comprador of usuarios.compradores) {
            try {
                await enviarEmailConBrevo(
                    comprador.email,
                    comprador.nombre_completo || comprador.email,
                    'comprador'
                );
                emailsEnviados++;
                console.log(`   ✅ ${comprador.email}`);
                
                // Pausa para no sobrecargar Brevo
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                emailsError++;
                console.error(`   ❌ ${comprador.email}: ${error.message}`);
            }
        }

        // Procesar vendedores
        console.log('\n📧 Enviando emails a vendedores...');
        for (const vendedor of usuarios.vendedores) {
            try {
                await enviarEmailConBrevo(
                    vendedor.email,
                    vendedor.nombre_tienda || vendedor.email,
                    'vendedor'
                );
                emailsEnviados++;
                console.log(`   ✅ ${vendedor.email}`);
                
                // Pausa para no sobrecargar Brevo
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                emailsError++;
                console.error(`   ❌ ${vendedor.email}: ${error.message}`);
            }
        }

        console.log('\n✅ Envío masivo completado:');
        console.log(`   - Total usuarios: ${totalUsuarios}`);
        console.log(`   - Emails enviados: ${emailsEnviados}`);
        console.log(`   - Emails con error: ${emailsError}`);
        console.log(`   - Porcentaje de éxito: ${((emailsEnviados / totalUsuarios) * 100).toFixed(2)}%`);

        if (emailsError > 0) {
            process.exit(1);
        }

    } catch (error) {
        console.error('\n❌ Error en envío masivo:', error);
        process.exit(1);
    }
}

// Ejecutar
main();
