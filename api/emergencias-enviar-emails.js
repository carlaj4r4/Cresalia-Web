// ===== API: Enviar Emails de Emergencia Masivos =====
// Envía emails a usuarios según su ubicación cuando hay una emergencia activa

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const PLATAFORMA_URL = process.env.PLATAFORMA_URL || 'https://cresalia.com';

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
        const { campana_id, tipo_envio = 'todos' } = req.body;
        
        if (!campana_id) {
            return res.status(400).json({
                success: false,
                error: 'campana_id es requerido'
            });
        }
        
        // Obtener información de la campaña
        const campana = await obtenerCampana(campana_id);
        if (!campana) {
            return res.status(404).json({
                success: false,
                error: 'Campaña no encontrada'
            });
        }
        
        // Obtener usuarios según ubicación
        let usuarios = [];
        if (tipo_envio === 'zona_afectada') {
            usuarios = await obtenerUsuariosEnZonaAfectada(campana);
        } else {
            usuarios = await obtenerTodosUsuariosConUbicacion();
        }
        
        if (!usuarios || usuarios.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No hay usuarios para notificar',
                usuariosNotificados: 0
            });
        }
        
        // Enviar emails
        const resultados = await enviarEmailsEmergencia(usuarios, campana);
        
        return res.status(200).json({
            success: true,
            message: `Emails enviados a ${resultados.exitosos} usuarios`,
            usuariosNotificados: resultados.exitosos,
            errores: resultados.errores,
            totalUsuarios: usuarios.length,
            campana: {
                id: campana.id,
                titulo: campana.titulo,
                ubicacion: campana.ubicacion
            }
        });
        
    } catch (error) {
        console.error('❌ Error en emergencias-enviar-emails.js:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// ===== FUNCIONES AUXILIARES =====

async function obtenerCampana(campanaId) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.warn('⚠️ Supabase no configurado');
        return null;
    }
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/campañas_emergencia?id=eq.${campanaId}&select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.length > 0 ? data[0] : null;
        }
    } catch (error) {
        console.error('Error obteniendo campaña:', error);
    }
    
    return null;
}

async function obtenerUsuariosEnZonaAfectada(campana) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return [];
    }
    
    try {
        // Obtener usuarios con ubicación permitida
        const response = await fetch(`${SUPABASE_URL}/rest/v1/ubicaciones_usuarios_emergencias?permite_emails_emergencia=eq.true&select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            return [];
        }
        
        const ubicaciones = await response.json();
        const usuarios = [];
        
        // Filtrar por zona afectada (si la campaña tiene coordenadas)
        for (const ubicacion of ubicaciones) {
            if (!campana.latitud || !campana.longitud) {
                // Si no hay coordenadas, incluir todos
                usuarios.push({
                    usuario_hash: ubicacion.usuario_hash,
                    latitud: ubicacion.latitud,
                    longitud: ubicacion.longitud,
                    email: ubicacion.email || null // Si se guardó email
                });
            } else {
                // Calcular distancia
                const distancia = calcularDistancia(
                    ubicacion.latitud,
                    ubicacion.longitud,
                    campana.latitud,
                    campana.longitud
                );
                
                const radioAfectacion = campana.radio_afectacion_km || 50;
                
                if (distancia <= radioAfectacion) {
                    usuarios.push({
                        usuario_hash: ubicacion.usuario_hash,
                        latitud: ubicacion.latitud,
                        longitud: ubicacion.longitud,
                        email: ubicacion.email || null
                    });
                }
            }
        }
        
        return usuarios;
    } catch (error) {
        console.error('Error obteniendo usuarios en zona:', error);
        return [];
    }
}

async function obtenerTodosUsuariosConUbicacion() {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return [];
    }
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/ubicaciones_usuarios_emergencias?permite_emails_emergencia=eq.true&select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            return [];
        }
        
        const ubicaciones = await response.json();
        return ubicaciones.map(u => ({
            usuario_hash: u.usuario_hash,
            latitud: u.latitud,
            longitud: u.longitud,
            email: u.email || null
        }));
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        return [];
    }
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = gradosARadianes(lat2 - lat1);
    const dLon = gradosARadianes(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(gradosARadianes(lat1)) * Math.cos(gradosARadianes(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function gradosARadianes(grados) {
    return grados * (Math.PI / 180);
}

async function enviarEmailsEmergencia(usuarios, campana) {
    if (!BREVO_API_KEY) {
        console.warn('⚠️ Brevo API Key no configurada');
        return {
            exitosos: 0,
            errores: usuarios.length,
            detalles: ['Brevo API Key no configurada']
        };
    }
    
    const resultados = {
        exitosos: 0,
        errores: 0,
        detalles: []
    };
    
    const iconosDesastres = {
        'inundacion': '🌊',
        'incendio': '🔥',
        'terremoto': '🌍',
        'tornado': '🌪️',
        'tormenta': '⛈️',
        'otro_desastre': '🚨'
    };
    
    const nombresDesastres = {
        'inundacion': 'Inundación',
        'incendio': 'Incendio',
        'terremoto': 'Terremoto',
        'tornado': 'Tornado',
        'tormenta': 'Tormenta',
        'otro_desastre': 'Desastre Natural'
    };
    
    const icono = iconosDesastres[campana.tipo_desastre] || '🚨';
    const nombre = nombresDesastres[campana.tipo_desastre] || 'Desastre Natural';
    
    // Obtener emails de usuarios (si no están en ubicaciones, buscarlos en otras tablas)
    for (const usuario of usuarios) {
        let email = usuario.email;
        
        // Si no hay email, intentar obtenerlo de otras tablas
        if (!email) {
            email = await obtenerEmailPorHash(usuario.usuario_hash);
        }
        
        if (!email) {
            resultados.errores++;
            resultados.detalles.push(`Usuario ${usuario.usuario_hash} sin email`);
            continue;
        }
        
        try {
            const emailBody = generarEmailEmergencia(campana, icono, nombre, usuario);
            
            const response = await fetch(BREVO_API_URL, {
                method: 'POST',
                headers: {
                    'api-key': BREVO_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sender: {
                        name: 'Cresalia - Sistema de Emergencias',
                        email: 'emergencias@cresalia.com'
                    },
                    to: [{ email: email }],
                    subject: `${icono} Emergencia: ${campana.titulo} - ${campana.ubicacion}`,
                    htmlContent: emailBody
                })
            });
            
            if (response.ok) {
                resultados.exitosos++;
            } else {
                const errorData = await response.json();
                resultados.errores++;
                resultados.detalles.push(`Error enviando a ${email}: ${errorData.message || 'Error desconocido'}`);
            }
        } catch (error) {
            resultados.errores++;
            resultados.detalles.push(`Error enviando a ${email}: ${error.message}`);
        }
    }
    
    return resultados;
}

async function obtenerEmailPorHash(usuarioHash) {
    // Intentar obtener email de varias tablas
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return null;
    }
    
    try {
        // Buscar en compradores
        const compradoresResponse = await fetch(`${SUPABASE_URL}/rest/v1/compradores?select=email`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (compradoresResponse.ok) {
            const compradores = await compradoresResponse.json();
            // Nota: Esto requiere que tengas un hash del email guardado para comparar
            // Por seguridad, mejor guardar el email cuando el usuario permite ubicación
        }
    } catch (error) {
        console.error('Error obteniendo email:', error);
    }
    
    return null;
}

function generarEmailEmergencia(campana, icono, nombre, usuario) {
    const urlComunidad = `${PLATAFORMA_URL}/cresalia-solidario-emergencias/index.html?emergencia=${campana.id}`;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
        }
        .alert-box {
            background: #FEF2F2;
            border-left: 4px solid #EF4444;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .info-box {
            background: #EFF6FF;
            border-left: 4px solid #3B82F6;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #EF4444, #DC2626);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            margin: 20px 0;
            font-weight: 600;
            text-align: center;
        }
        .footer {
            background: #1f2937;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 10px 10px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${icono} ${campana.titulo}</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">${nombre} en ${campana.ubicacion}</p>
    </div>
    
    <div class="content">
        <p>Hola,</p>
        
        <div class="alert-box">
            <p><strong>🚨 Hay una emergencia activa en tu zona.</strong></p>
            <p>${campana.descripcion || 'Se ha reportado una emergencia en la zona donde te encuentras.'}</p>
        </div>
        
        <p>Sabemos que puede ser difícil, pero necesitamos saber si estás bien.</p>
        
        <div class="info-box">
            <p><strong>💜 ¿Qué puedes hacer?</strong></p>
            <ul>
                <li>Si estás bien, confirmarlo en la plataforma</li>
                <li>Si necesitás ayuda, pedirla a la comunidad</li>
                <li>Si conocés personas que no están bien, ayudar a conectarlas con recursos</li>
            </ul>
            <p style="margin-top: 15px; font-size: 0.9rem; color: #1E40AF;">
                <strong>📌 Importante:</strong> Por ahora, Cresalia no puede ofrecer recursos directamente. 
                Todo depende de la solidaridad de nuestra comunidad. Te redirigiremos a las comunidades correspondientes 
                donde podrás encontrar apoyo y ayuda.
            </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${urlComunidad}" class="btn">
                💜 Confirmar que estoy bien / Buscar ayuda
            </a>
        </div>
        
        <p style="color: #6B7280; font-size: 0.9rem; margin-top: 30px;">
            Si no estás en la zona afectada, puedes hacer check-in de todos modos para ayudar a otros 
            miembros de la comunidad que sí están cerca.
        </p>
    </div>
    
    <div class="footer">
        <p>Cresalia - Sistema de Emergencias</p>
        <p>💜 Tu comunidad está acá. No estás solo/a.</p>
    </div>
</body>
</html>
    `;
}


