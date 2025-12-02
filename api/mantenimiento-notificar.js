// ===== API: Notificar Usuarios sobre Mantenimiento =====
// Envía emails a usuarios registrados cuando se activa el mantenimiento

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

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
        const { activo, mensaje, fechaFinEstimada } = req.body;
        
        // Solo notificar si se está activando el mantenimiento
        if (!activo) {
            return res.status(200).json({
                success: true,
                message: 'Mantenimiento desactivado, no se enviaron notificaciones'
            });
        }
        
        // Obtener lista de usuarios registrados
        const usuarios = await obtenerUsuariosRegistrados();
        
        if (!usuarios || usuarios.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No hay usuarios registrados para notificar',
                usuariosNotificados: 0
            });
        }
        
        // Enviar emails
        const resultados = await enviarNotificaciones(usuarios, mensaje, fechaFinEstimada);
        
        return res.status(200).json({
            success: true,
            message: `Notificaciones enviadas a ${resultados.exitosos} usuarios`,
            usuariosNotificados: resultados.exitosos,
            errores: resultados.errores,
            totalUsuarios: usuarios.length
        });
        
    } catch (error) {
        console.error('❌ Error en mantenimiento-notificar.js:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// ===== FUNCIONES AUXILIARES =====

async function obtenerUsuariosRegistrados() {
    const usuarios = [];
    
    // Si no hay Supabase, retornar lista vacía
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.warn('⚠️ Supabase no configurado, no se pueden obtener usuarios');
        return [];
    }
    
    try {
        // Obtener compradores con email
        const compradoresResponse = await fetch(`${SUPABASE_URL}/rest/v1/compradores?email=not.is.null&select=email,nombre`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (compradoresResponse.ok) {
            const compradores = await compradoresResponse.json();
            compradores.forEach(comprador => {
                if (comprador.email) {
                    usuarios.push({
                        email: comprador.email,
                        nombre: comprador.nombre || 'Usuario',
                        tipo: 'comprador'
                    });
                }
            });
        }
        
        // Obtener tiendas con email
        const tiendasResponse = await fetch(`${SUPABASE_URL}/rest/v1/tiendas?email=not.is.null&select=email,nombre_tienda`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (tiendasResponse.ok) {
            const tiendas = await tiendasResponse.json();
            tiendas.forEach(tienda => {
                if (tienda.email) {
                    usuarios.push({
                        email: tienda.email,
                        nombre: tienda.nombre_tienda || 'Tienda',
                        tipo: 'tienda'
                    });
                }
            });
        }
        
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
    }
    
    return usuarios;
}

async function enviarNotificaciones(usuarios, mensajePersonalizado, fechaFinEstimada) {
    if (!BREVO_API_KEY) {
        console.warn('⚠️ Brevo API Key no configurada, no se pueden enviar emails');
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
    
    // Formatear fecha estimada si existe
    let fechaFinTexto = '';
    if (fechaFinEstimada) {
        try {
            const fecha = new Date(fechaFinEstimada);
            fechaFinTexto = fecha.toLocaleString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Argentina/Buenos_Aires'
            });
        } catch (e) {
            fechaFinTexto = fechaFinEstimada;
        }
    }
    
    // Preparar contenido del email
    const emailBody = `
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        .gratitude-box {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
        }
        .apology-box {
            background: rgba(236, 72, 153, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #ec4899;
        }
        .info-box {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border: 1px solid #e5e7eb;
        }
        .footer {
            background: #1f2937;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 10px 10px;
            font-size: 12px;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            margin: 20px 0;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🛠️ Mantenimiento Programado</h1>
    </div>
    
    <div class="content">
        <p>Hola <strong>{{NOMBRE}}</strong>,</p>
        
        <p>Te escribimos para informarte que Cresalia estará temporalmente en mantenimiento para mejorar nuestra plataforma y brindarte una experiencia aún mejor.</p>
        
        <div class="gratitude-box">
            <p><strong>¡Gracias por tu paciencia y comprensión!</strong></p>
            <p>Tu confianza en nosotros nos motiva a continuamente mejorar nuestra plataforma para que sea todo lo que tú y nuestra comunidad se merecen. Estamos trabajando incansablemente para que cuando regreses, encuentres una experiencia aún más maravillosa.</p>
        </div>
        
        <div class="apology-box">
            <p><strong>Lamentamos profundamente cualquier inconveniente</strong> que esto pueda causarte. Sabemos que tu tiempo es valioso y apreciamos enormemente tu comprensión durante este proceso.</p>
        </div>
        
        ${fechaFinTexto ? `
        <div class="info-box">
            <p><strong>📅 Tiempo estimado de mantenimiento:</strong></p>
            <p>${fechaFinTexto}</p>
        </div>
        ` : ''}
        
        ${mensajePersonalizado ? `
        <div class="info-box">
            <p><strong>ℹ️ Información adicional:</strong></p>
            <p>${mensajePersonalizado}</p>
        </div>
        ` : ''}
        
        <p style="text-align: center;">
            <a href="https://cresalia-web.vercel.app/mantenimiento.html" class="btn">Ver Página de Mantenimiento</a>
        </p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Si tienes alguna urgencia o consulta, no dudes en contactarnos en <a href="mailto:cresalia25@gmail.com" style="color: #667eea;">cresalia25@gmail.com</a>
        </p>
    </div>
    
    <div class="footer">
        <p>Estaremos de vuelta muy pronto 💜</p>
        <p>Equipo Cresalia</p>
    </div>
</body>
</html>
    `;
    
    // Enviar emails (en lotes para no sobrecargar)
    const lotes = [];
    const tamañoLote = 50; // Enviar 50 emails a la vez
    
    for (let i = 0; i < usuarios.length; i += tamañoLote) {
        lotes.push(usuarios.slice(i, i + tamañoLote));
    }
    
    for (const lote of lotes) {
        for (const usuario of lote) {
            try {
                // Reemplazar variables en el email
                const emailPersonalizado = emailBody.replace('{{NOMBRE}}', usuario.nombre);
                
                const response = await fetch(BREVO_API_URL, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'api-key': BREVO_API_KEY,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: {
                            name: 'Cresalia - Equipo',
                            email: 'noreply@cresalia.com' // Cambiar por tu email verificado en Brevo
                        },
                        to: [
                            {
                                email: usuario.email,
                                name: usuario.nombre
                            }
                        ],
                        subject: '🛠️ Cresalia en Mantenimiento - Gracias por tu Paciencia',
                        htmlContent: emailPersonalizado
                    })
                });
                
                if (response.ok) {
                    resultados.exitosos++;
                } else {
                    resultados.errores++;
                    const errorText = await response.text();
                    resultados.detalles.push(`Error con ${usuario.email}: ${errorText}`);
                }
                
                // Pequeña pausa entre emails para no sobrecargar
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                resultados.errores++;
                resultados.detalles.push(`Error con ${usuario.email}: ${error.message}`);
            }
        }
        
        // Pausa más larga entre lotes
        if (lotes.indexOf(lote) < lotes.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    return resultados;
}



