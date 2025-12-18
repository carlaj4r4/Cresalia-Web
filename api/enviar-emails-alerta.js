/**
 * 📧 API para Enviar Emails de Alertas de Emergencia
 * Endpoint: /api/enviar-emails-alerta
 * 
 * Este endpoint se llama desde Supabase cuando se crea una nueva alerta
 * Usa las credenciales de Brevo que ya están en Vercel
 */

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Solo permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { alerta_id } = req.body;

        if (!alerta_id) {
            return res.status(400).json({ error: 'alerta_id es requerido' });
        }

        console.log(`📧 Procesando alerta ID: ${alerta_id}`);

        // Inicializar Supabase
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY // Service role para bypassear RLS
        );

        // 1. Obtener datos de la alerta
        const { data: alerta, error: errorAlerta } = await supabase
            .from('alertas_emergencia_comunidades')
            .select('*')
            .eq('id', alerta_id)
            .single();

        if (errorAlerta || !alerta) {
            throw new Error(`Alerta no encontrada: ${errorAlerta?.message}`);
        }

        // 2. Buscar usuarios que deben recibir el email
        const { data: usuarios, error: errorUsuarios } = await supabase
            .rpc('buscar_usuarios_en_radio_alerta', { p_alerta_id: alerta_id });

        if (errorUsuarios) {
            throw new Error(`Error buscando usuarios: ${errorUsuarios.message}`);
        }

        console.log(`📧 Usuarios a notificar: ${usuarios?.length || 0}`);

        if (!usuarios || usuarios.length === 0) {
            return res.status(200).json({
                success: true,
                mensaje: 'No hay usuarios para notificar',
                usuarios_notificados: 0
            });
        }

        // 3. Preparar template del email
        const emailTemplate = generarTemplateEmail(alerta);

        // 4. Enviar emails usando Brevo
        const resultados = await enviarEmailsBrevo(usuarios, emailTemplate, alerta);

        // 5. Registrar envíos en la base de datos
        await registrarEnvios(supabase, alerta_id, resultados, alerta.alcance);

        // 6. Responder
        const exitosos = resultados.filter(r => r.exitoso).length;
        const fallidos = resultados.length - exitosos;

        return res.status(200).json({
            success: true,
            usuarios_notificados: exitosos,
            usuarios_fallidos: fallidos,
            total: usuarios.length
        });

    } catch (error) {
        console.error('❌ Error enviando emails:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            mensaje: error.message
        });
    }
}

/**
 * Genera el template HTML del email
 */
function generarTemplateEmail(alerta) {
    const iconos = {
        'inundacion': '🌊',
        'incendio': '🔥',
        'terremoto': '🏚️',
        'tormenta': '⛈️',
        'tornado': '🌪️',
        'tsunami': '🌊',
        'pandemia': '😷',
        'corte_luz': '💡',
        'corte_gas': '🔥',
        'corte_agua': '💧',
        'accidente': '🚨',
        'seguridad': '⚠️',
        'otro': '⚠️'
    };

    const coloresSeveridad = {
        'critica': '#dc2626',
        'alta': '#f59e0b',
        'media': '#3b82f6',
        'baja': '#10b981'
    };

    const icono = iconos[alerta.tipo] || '⚠️';
    const color = coloresSeveridad[alerta.severidad] || '#3b82f6';

    return {
        subject: `${icono} ALERTA ${alerta.severidad.toUpperCase()}: ${alerta.titulo}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    
                    <!-- Header con severidad -->
                    <tr>
                        <td style="background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%); padding: 32px; text-align: center;">
                            <div style="font-size: 64px; margin-bottom: 12px;">${icono}</div>
                            <h1 style="color: white; font-size: 28px; font-weight: 700; margin: 0 0 8px;">
                                ALERTA ${alerta.severidad.toUpperCase()}
                            </h1>
                            <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin: 0;">
                                ${alerta.titulo}
                            </p>
                        </td>
                    </tr>

                    <!-- Contenido -->
                    <tr>
                        <td style="padding: 32px;">
                            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                                <p style="color: #92400e; font-weight: 600; margin: 0; font-size: 14px;">
                                    ⚠️ Esta es una alerta de emergencia ${alerta.alcance === 'global' ? 'que afecta a toda la comunidad' : 'en tu zona'}
                                </p>
                            </div>

                            <div style="margin-bottom: 24px;">
                                <h2 style="font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 12px;">
                                    📋 Información de la Alerta
                                </h2>
                                <p style="color: #4b5563; line-height: 1.8; margin: 0; font-size: 15px;">
                                    ${alerta.descripcion}
                                </p>
                            </div>

                            ${alerta.alcance === 'local' && alerta.horas_sin_servicio > 0 ? `
                            <div style="background: #fee2e2; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                                <div style="color: #991b1b; font-weight: 600; font-size: 16px; margin-bottom: 8px;">
                                    ⏰ Tiempo sin servicio
                                </div>
                                <div style="color: #7f1d1d; font-size: 24px; font-weight: 700;">
                                    ${Math.floor(alerta.horas_sin_servicio / 24)} días ${alerta.horas_sin_servicio % 24} horas
                                </div>
                            </div>
                            ` : ''}

                            ${alerta.enlace_oficial ? `
                            <div style="margin-bottom: 24px;">
                                <a href="${alerta.enlace_oficial}" style="
                                    display: inline-block;
                                    padding: 12px 24px;
                                    background: #3b82f6;
                                    color: white;
                                    text-decoration: none;
                                    border-radius: 8px;
                                    font-weight: 600;
                                    font-size: 15px;
                                ">
                                    📄 Ver Información Oficial
                                </a>
                            </div>
                            ` : ''}

                            ${alerta.alcance === 'global' ? `
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 24px; margin: 24px 0;">
                                <h3 style="color: white; font-size: 18px; font-weight: 600; margin: 0 0 16px; text-align: center;">
                                    💜 Cómo Puedes Ayudar
                                </h3>
                                <div style="display: table; width: 100%;">
                                    <div style="display: table-row;">
                                        <div style="display: table-cell; padding: 8px;">
                                            <a href="${alerta.url_donacion_dinero}" style="
                                                display: block;
                                                padding: 14px 20px;
                                                background: rgba(255,255,255,0.2);
                                                color: white;
                                                text-decoration: none;
                                                border-radius: 8px;
                                                font-weight: 600;
                                                text-align: center;
                                                backdrop-filter: blur(10px);
                                            ">
                                                💵 Donar Dinero
                                            </a>
                                        </div>
                                        <div style="display: table-cell; padding: 8px;">
                                            <a href="${alerta.url_donacion_materiales}" style="
                                                display: block;
                                                padding: 14px 20px;
                                                background: rgba(255,255,255,0.2);
                                                color: white;
                                                text-decoration: none;
                                                border-radius: 8px;
                                                font-weight: 600;
                                                text-align: center;
                                                backdrop-filter: blur(10px);
                                            ">
                                                📦 Donar Materiales
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ` : ''}

                            <div style="border-top: 2px solid #e5e7eb; padding-top: 24px; margin-top: 24px;">
                                <p style="color: #6b7280; font-size: 13px; margin: 0 0 12px;">
                                    📍 <strong>Ubicación:</strong> ${alerta.ciudad || ''} ${alerta.provincia ? `, ${alerta.provincia}` : ''} ${alerta.pais ? `, ${alerta.pais}` : ''}
                                </p>
                                ${alerta.alcance === 'local' && alerta.radio_afectacion_km ? `
                                <p style="color: #6b7280; font-size: 13px; margin: 0;">
                                    🎯 <strong>Radio de afectación:</strong> ${alerta.radio_afectacion_km} km
                                </p>
                                ` : ''}
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px;">
                                Recibes este email porque activaste las alertas de emergencia
                            </p>
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                <a href="https://cresalia.com/configuracion-alertas" style="color: #667eea; text-decoration: none;">
                                    Configurar alertas
                                </a> • 
                                <a href="https://cresalia.com" style="color: #667eea; text-decoration: none;">
                                    Cresalia
                                </a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
        text: `
${icono} ALERTA ${alerta.severidad.toUpperCase()}: ${alerta.titulo}

${alerta.descripcion}

${alerta.enlace_oficial ? `Información oficial: ${alerta.enlace_oficial}` : ''}

${alerta.alcance === 'global' ? `
Cómo puedes ayudar:
- Donar dinero: ${alerta.url_donacion_dinero}
- Donar materiales: ${alerta.url_donacion_materiales}
` : ''}

Ubicación: ${alerta.ciudad || ''} ${alerta.provincia ? `, ${alerta.provincia}` : ''} ${alerta.pais ? `, ${alerta.pais}` : ''}

---
Recibes este email porque activaste las alertas de emergencia de Cresalia
        `.trim()
    };
}

/**
 * Envía emails usando la API de Brevo
 */
async function enviarEmailsBrevo(usuarios, template, alerta) {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    
    if (!BREVO_API_KEY) {
        throw new Error('BREVO_API_KEY no configurada');
    }

    const resultados = [];

    // Enviar en lotes de 50 (límite de Brevo)
    const BATCH_SIZE = 50;
    
    for (let i = 0; i < usuarios.length; i += BATCH_SIZE) {
        const batch = usuarios.slice(i, i + BATCH_SIZE);
        
        try {
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'api-key': BREVO_API_KEY
                },
                body: JSON.stringify({
                    sender: {
                        name: 'Alertas Cresalia',
                        email: process.env.BREVO_SENDER_EMAIL || 'alertas@cresalia.com'
                    },
                    to: batch.map(u => ({ email: u.email })),
                    subject: template.subject,
                    htmlContent: template.html,
                    textContent: template.text,
                    tags: ['alerta', alerta.alcance, alerta.tipo, alerta.severidad]
                })
            });

            const data = await response.json();

            if (response.ok) {
                batch.forEach(u => {
                    resultados.push({
                        email: u.email,
                        exitoso: true,
                        distancia_km: u.distancia_km
                    });
                });
                console.log(`✅ Batch enviado: ${batch.length} emails`);
            } else {
                throw new Error(data.message || 'Error de Brevo');
            }

        } catch (error) {
            console.error(`❌ Error en batch:`, error);
            batch.forEach(u => {
                resultados.push({
                    email: u.email,
                    exitoso: false,
                    error: error.message,
                    distancia_km: u.distancia_km
                });
            });
        }

        // Pausa entre lotes para no saturar la API
        if (i + BATCH_SIZE < usuarios.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return resultados;
}

/**
 * Registra los envíos en la base de datos
 */
async function registrarEnvios(supabase, alerta_id, resultados, tipo_alerta) {
    const registros = resultados.map(r => ({
        alerta_id,
        email: r.email,
        exitoso: r.exitoso,
        mensaje_error: r.error || null,
        distancia_km: r.distancia_km,
        tipo_alerta
    }));

    const { error } = await supabase
        .from('alertas_emails_enviados')
        .insert(registros);

    if (error) {
        console.error('❌ Error registrando envíos:', error);
    } else {
        console.log(`✅ Registrados ${registros.length} envíos en la BD`);
    }
}
