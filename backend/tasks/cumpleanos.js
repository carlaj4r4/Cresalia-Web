const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const SibApiV3Sdk = require('@sendinblue/client');

let supabaseClient = null;
let brevoClient = undefined; // undefined = no inicializado, null = sin config

function getSupabase() {
    if (supabaseClient) return supabaseClient;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
        throw new Error('Variables SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY no configuradas');
    }

    supabaseClient = createClient(url, key);
    return supabaseClient;
}

function getBrevoClient() {
    if (brevoClient !== undefined) {
        return brevoClient;
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
        brevoClient = null;
        console.warn('⚠️ BREVO_API_KEY no configurado. Emails de cumpleaños deshabilitados.');
        return brevoClient;
    }

    try {
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKeyAuth = defaultClient.authentications['api-key'];
        apiKeyAuth.apiKey = apiKey;
        brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();
        return brevoClient;
    } catch (error) {
        console.error('❌ Error configurando Brevo:', error.message);
        brevoClient = null;
        return brevoClient;
    }
}

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

async function enviarEmail({ toEmail, toName, subject, htmlContent }) {
    const client = getBrevoClient();
    if (!client) return;

    if (!toEmail || !subject || !htmlContent) {
        console.warn('📭 Email de cumpleaños omitido: faltan campos obligatorios');
        return;
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'cresalia25@gmail.com';
    const senderName = process.env.BREVO_SENDER_NAME || 'Cresalia';

    try {
        await client.sendTransacEmail({
            sender: { email: senderEmail, name: senderName },
            to: [{ email: toEmail, name: toName || toEmail }],
            subject,
            htmlContent
        });
    } catch (error) {
        console.error('❌ Error enviando email de cumpleaños:', error.message);
    }
}

async function procesarCumpleanosDelDia() {
    const supabase = getSupabase();
    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const dia = hoy.getDate();
    const fechaActual = hoy.toISOString().slice(0, 10);

    const resultados = {
        usuarios: [],
        tiendas: [],
        cupones: []
    };

    const compradores = await obtenerCumpleaneros(supabase, {
        tabla: 'usuarios',
        campos: ['email', 'nombre'],
        fechaCampo: 'fecha_nacimiento',
        consentPublicoCampo: 'acepta_cumple_publico',
        consentBeneficioCampo: 'acepta_cumple_descuento'
    }, mes, dia);

    const tiendas = await obtenerCumpleaneros(supabase, {
        tabla: 'tenants',
        campos: ['slug', 'nombre_empresa', 'email_contacto'],
        fechaCampo: 'fecha_nacimiento_responsable',
        consentPublicoCampo: 'acepta_cumple_home',
        consentBeneficioCampo: 'acepta_cumple_beneficio'
    }, mes, dia);

    for (const usuario of compradores) {
        try {
            const beneficio = usuario.consentBeneficio
                ? await generarBeneficioCumpleanosUsuario(supabase, usuario, fechaActual)
                : null;

            await enviarEmailCumpleanosUsuario(usuario, beneficio);

            resultados.usuarios.push({
                email: usuario.email,
                nombre: usuario.nombre,
                beneficio
            });

            if (beneficio?.cupon) {
                resultados.cupones.push(beneficio.cupon);
            }
        } catch (error) {
            console.warn('⚠️ No se pudo procesar cumpleaños usuario:', usuario.email, error.message);
        }
    }

    for (const tienda of tiendas) {
        try {
            const beneficio = tienda.consentBeneficio
                ? await generarBeneficioCumpleanosTienda(supabase, tienda, fechaActual)
                : null;

            await enviarEmailCumpleanosTienda(tienda, beneficio);

            resultados.tiendas.push({
                slug: tienda.slug,
                nombre: tienda.nombre_empresa,
                beneficio
            });

            if (beneficio?.cupon) {
                resultados.cupones.push(beneficio.cupon);
            }
        } catch (error) {
            console.warn('⚠️ No se pudo procesar cumpleaños tienda:', tienda.slug, error.message);
        }
    }

    return resultados;
}

async function obtenerCumpleaneros(supabase, config, mes, dia) {
    try {
        const { data, error } = await supabase
            .from(config.tabla)
            .select([
                ...config.campos,
                `${config.fechaCampo}`,
                `${config.consentPublicoCampo}`,
                `${config.consentBeneficioCampo}`,
                'cumple_ultima_notificacion'
            ].join(', '))
            .not(config.fechaCampo, 'is', null);

        if (error) throw error;
        if (!data) return [];

        return data
            .filter(row => {
                if (!row[config.fechaCampo]) return false;
                const fecha = new Date(row[config.fechaCampo]);
                if ((fecha.getMonth() + 1) !== mes || fecha.getDate() !== dia) {
                    return false;
                }
                if (row.cumple_ultima_notificacion) {
                    const ultima = new Date(row.cumple_ultima_notificacion);
                    if (ultima.getFullYear() === new Date().getFullYear()) {
                        return false;
                    }
                }
                return true;
            })
            .map(row => ({
                ...row,
                consentPublico: Boolean(row[config.consentPublicoCampo]),
                consentBeneficio: Boolean(row[config.consentBeneficioCampo])
            }));
    } catch (error) {
        console.warn(`⚠️ No se pudo obtener cumpleaños en ${config.tabla}:`, error.message);
        return [];
    }
}

async function generarBeneficioCumpleanosUsuario(supabase, usuario, fechaActual) {
    const cupon = {
        codigo: `CUMPLE-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        descuento: '70%',
        condiciones: 'Válido por 7 días en productos seleccionados',
        fecha: fechaActual,
        destinatario: usuario.email
    };

    await registrarCumpleanosHistorial(supabase, {
        tipo: 'usuario',
        referencia: usuario.email,
        fecha: fechaActual,
        cupon: JSON.stringify(cupon),
        beneficio: 'Descuento especial cumpleañero (70%)'
    });

    await actualizarUltimaNotificacion(supabase, 'usuarios', 'email', usuario.email);

    return { cupon, mensaje: 'Descuento especial del 70% en productos seleccionados' };
}

async function generarBeneficioCumpleanosTienda(supabase, tienda, fechaActual) {
    const beneficio = {
        tipo: 'upgrade_enterprise',
        descripcion: 'Upgrade gratis a plan Enterprise por 30 días',
        vigencia_dias: 30,
        fecha: fechaActual,
        slug: tienda.slug
    };

    await registrarCumpleanosHistorial(supabase, {
        tipo: 'tenant',
        referencia: tienda.slug,
        fecha: fechaActual,
        beneficio: JSON.stringify(beneficio)
    });

    await actualizarUltimaNotificacion(supabase, 'tenants', 'slug', tienda.slug);

    return beneficio;
}

async function registrarCumpleanosHistorial(supabase, { tipo, referencia, fecha, cupon, beneficio }) {
    try {
        await supabase
            .from('cumpleanos_historial')
            .insert({
                tipo,
                referencia_slug: referencia,
                fecha,
                'cupón_generado': cupon || null,
                beneficio: beneficio || null,
                enviado: true,
                mensaje: beneficio ? 'Beneficio otorgado de cumpleaños' : 'Saludos de cumpleaños enviados'
            });
    } catch (error) {
        console.warn('⚠️ No se pudo registrar cumpleaños en historial:', error.message);
    }
}

async function actualizarUltimaNotificacion(supabase, tabla, campoId, valor) {
    try {
        await supabase
            .from(tabla)
            .update({ cumple_ultima_notificacion: new Date().toISOString() })
            .eq(campoId, valor);
    } catch (error) {
        console.warn('⚠️ No se pudo actualizar última notificación de cumpleaños:', error.message);
    }
}

async function enviarEmailCumpleanosUsuario(usuario, beneficio) {
    const titulo = beneficio
        ? '🎉 ¡Feliz cumpleaños con regalo Cresalia!'
        : '🎉 ¡Feliz cumpleaños parte de Cresalia!';

    const beneficioHtml = beneficio?.cupon
        ? `<div style="margin:20px 0; padding:18px; border-radius:12px; background:linear-gradient(135deg,#7C3AED15,#5B21B620);">
                <h3 style="margin:0 0 8px 0; color:#5B21B6;">🎁 Tu regalo de cumpleaños</h3>
                <p style="margin:0; font-size:1.05rem; color:#312E81;">Cupón: <strong>${beneficio.cupon.codigo}</strong></p>
                <p style="margin:8px 0 0 0; color:#4338CA;">${beneficio.mensaje}</p>
                <small style="color:#6B7280;">Entrega válida por 7 días. Usalo en tu tienda favorita.</small>
            </div>`
        : '';

    const htmlContent = `
        <div style="font-family:'Poppins','Segoe UI',sans-serif; background:#f8fafc; padding:24px;">
            <div style="max-width:640px; margin:0 auto; background:white; border-radius:20px; padding:28px; box-shadow:0 18px 40px rgba(15,23,42,0.1);">
                <h2 style="margin-top:0; color:#7C3AED;">${titulo}</h2>
                <p style="color:#475569; line-height:1.6;">
                    Hola ${escapeHtml(usuario.nombre || usuario.email || 'parte de nuestra comunidad')} 💜<br><br>
                    Gracias por ser parte de Cresalia. Hoy celebramos tu vida y todo lo que aportás a esta comunidad de amor, emprendimiento y contención.
                </p>
                ${beneficioHtml}
                <p style="color:#475569; line-height:1.6;">
                    Te esperamos en la plataforma para seguir acompañándote. Recordá que tenés disponible apoyo emocional, mentorías y beneficios especiales cada vez que los necesites.
                </p>
                <p style="color:#64748B; font-style:italic;">Con todo nuestro cariño,<br>Tu familia Cresalia</p>
            </div>
        </div>`;

    await enviarEmail({
        toEmail: usuario.email,
        toName: usuario.nombre,
        subject: 'Feliz cumpleaños 🎂 - Un detalle especial de Cresalia',
        htmlContent
    });
}

async function enviarEmailCumpleanosTienda(tienda, beneficio) {
    const beneficioHtml = beneficio
        ? `<div style="margin:20px 0; padding:18px; border-radius:12px; background:linear-gradient(135deg,#7C3AED15,#5B21B620);">
                <h3 style="margin:0 0 8px 0; color:#5B21B6;">🎁 Beneficio por tu cumpleaños</h3>
                <p style="margin:0; font-size:1.05rem; color:#312E81;">Upgrade a <strong>Plan Enterprise</strong> por 30 días.</p>
                <p style="margin:8px 0 0 0; color:#4338CA;">Nuestro equipo activará el beneficio y te avisará cuando esté listo.</p>
            </div>`
        : '';

    const nombreTienda = tienda.nombre_empresa || tienda.slug;

    const htmlContent = `
        <div style="font-family:'Poppins','Segoe UI',sans-serif; background:#f8fafc; padding:24px;">
            <div style="max-width:640px; margin:0 auto; background:white; border-radius:20px; padding:28px; box-shadow:0 18px 40px rgba(15,23,42,0.1);">
                <h2 style="margin-top:0; color:#0EA5E9;">🎉 ¡Feliz cumpleaños ${escapeHtml(nombreTienda)}!</h2>
                <p style="color:#475569; line-height:1.6;">
                    Gracias por construir impacto con Cresalia. Nos enorgullece verte crecer y celebrar tu camino emprendedor.
                </p>
                ${beneficioHtml}
                <p style="color:#475569; line-height:1.6;">
                    Si querés aparecer en nuestra portada como cumpleañero del mes, asegurate de activar tu consentimiento en el panel.
                    Estamos a un mensaje de ayudarte en lo que necesites.
                </p>
                <p style="color:#64748B; font-style:italic;">Éxitos y prosperidad para tu empresa,<br>Tu equipo Cresalia</p>
            </div>
        </div>`;

    await enviarEmail({
        toEmail: tienda.email_contacto,
        toName: nombreTienda,
        subject: '🎂 ¡Felices cumpleaños, emprendedora!',
        htmlContent
    });
}

module.exports = {
    procesarCumpleanosDelDia
};



