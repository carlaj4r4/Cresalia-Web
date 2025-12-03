// ==================== FUNCIÓN CONSOLIDADA: CUMPLEAÑOS ====================
// Reemplaza: cumpleanos-resumen.js, cumpleanos-interacciones.js, 
//            cumpleaneros-compradores.js, compradores-cumple-consent.js

const { createClient } = require('@supabase/supabase-js');

let supabaseClient = null;

function getSupabase() {
    if (supabaseClient) return supabaseClient;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
        throw new Error('SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configuradas');
    }
    supabaseClient = createClient(url, key);
    return supabaseClient;
}

function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sanitizarTexto(valor, maxLength = 280) {
    if (!valor) return null;
    return String(valor).trim().slice(0, maxLength);
}

function obtenerNombreMes(numeroMes) {
    const nombres = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return nombres[numeroMes - 1] || '';
}

// ==================== ACCIÓN: RESUMEN ====================
async function handleResumen(supabase, req, res) {
    const ahora = new Date();
    const mesParam = parseInt(req.query.mes, 10);
    const mes = (!Number.isNaN(mesParam) && mesParam >= 1 && mesParam <= 12)
        ? mesParam
        : (ahora.getMonth() + 1);

    const yearParam = parseInt(req.query.anio || req.query.year, 10);
    const year = (!Number.isNaN(yearParam) && yearParam >= 2020) ? yearParam : ahora.getFullYear();

    const inicioMes = new Date(Date.UTC(year, mes - 1, 1, 0, 0, 0));
    const finMes = new Date(Date.UTC(year, mes, 1, 0, 0, 0));

    const tablaCompradores = process.env.SUPABASE_COMPRADORES_TABLE || 'usuarios';

    // Obtener celebrantes
    const { data: celebrantesData, error: errorCelebrantes } = await supabase
        .from(tablaCompradores)
        .select(`
            id, user_id, email, nombre, nombre_completo, username, alias,
            fecha_nacimiento, acepta_cumple_publico, acepta_cumple_descuento, mensaje_cumple_publico
        `)
        .eq('acepta_cumple_publico', true)
        .not('fecha_nacimiento', 'is', null);

    if (errorCelebrantes) {
        throw new Error(`No se pudo obtener la lista de cumpleaños: ${errorCelebrantes.message}`);
    }

    const celebrantes = (celebrantesData || [])
        .filter(row => {
            if (!row.fecha_nacimiento) return false;
            const fecha = new Date(`${row.fecha_nacimiento}T00:00:00`);
            return (fecha.getMonth() + 1) === mes;
        })
        .map(row => {
            const fecha = new Date(`${row.fecha_nacimiento}T00:00:00`);
            return {
                referencia: row.email || row.user_id || row.id || row.username || row.alias || null,
                email: row.email || null,
                nombre: row.nombre_completo || row.nombre || row.alias || row.email || 'Comprador Cresalia',
                dia: fecha ? fecha.getDate() : null,
                aceptaBeneficio: Boolean(row.acepta_cumple_descuento),
                mensaje: row.mensaje_cumple_publico || null
            };
        })
        .sort((a, b) => (a.dia || 31) - (b.dia || 31));

    const referencias = celebrantes.map(item => item.referencia).filter(Boolean);
    const hoy = new Date();
    const celebranHoy = celebrantes.filter(item => item.dia === hoy.getDate());
    const proximos = celebrantes.filter(item => item.dia >= hoy.getDate()).slice(0, 7);

    // Obtener interacciones
    let interacciones = { totalAbrazos: 0, totalMensajes: 0, mensajesRecientes: [] };
    if (referencias.length > 0) {
        const { data: interaccionesData } = await supabase
            .from('cumpleanos_interacciones')
            .select('referencia, tipo, autor, mensaje, created_at')
            .in('referencia', referencias)
            .gte('created_at', inicioMes.toISOString())
            .lt('created_at', finMes.toISOString())
            .order('created_at', { ascending: false })
            .limit(200);

        (interaccionesData || []).forEach(item => {
            if (item.tipo === 'abrazo') interacciones.totalAbrazos += 1;
            else if (item.tipo === 'mensaje' && item.mensaje && interacciones.mensajesRecientes.length < 15) {
                interacciones.mensajesRecientes.push({
                    referencia: item.referencia,
                    autor: item.autor || 'Comunidad Cresalia',
                    mensaje: item.mensaje,
                    fecha: item.created_at
                });
                interacciones.totalMensajes += 1;
            }
        });
    }

    // Obtener beneficios
    const { data: beneficiosData } = await supabase
        .from('cumpleanos_historial')
        .select('tipo, referencia_slug, cupón_generado, beneficio')
        .gte('fecha', inicioMes.toISOString().slice(0, 10))
        .lt('fecha', finMes.toISOString().slice(0, 10));

    const beneficios = {
        cuponesGenerados: 0,
        upgradesOtorgados: 0,
        detalle: []
    };

    (beneficiosData || []).forEach(item => {
        if (item['cupón_generado']) beneficios.cuponesGenerados += 1;
        if (item.beneficio) {
            try {
                const beneficio = typeof item.beneficio === 'string' ? JSON.parse(item.beneficio) : item.beneficio;
                if (beneficio && beneficio.tipo === 'upgrade_enterprise') beneficios.upgradesOtorgados += 1;
            } catch (_) {}
        }
        if (beneficios.detalle.length < 10) {
            beneficios.detalle.push({
                referencia: item.referencia_slug,
                tipo: item.tipo,
                cupón: Boolean(item['cupón_generado']),
                beneficio: item.beneficio || null
            });
        }
    });

    res.status(200).json({
        success: true,
        mesNumero: mes,
        mesNombre: obtenerNombreMes(mes),
        year,
        celebrantes: {
            total: celebrantes.length,
            conBeneficio: celebrantes.filter(item => item.aceptaBeneficio).length,
            hoy: celebranHoy,
            proximos,
            lista: celebrantes
        },
        interacciones,
        beneficios
    });
}

// ==================== ACCIÓN: INTERACCIONES ====================
async function handleInteracciones(supabase, req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }

    const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const referencia = sanitizarTexto(cuerpo.referencia, 120);
    const tipo = sanitizarTexto(cuerpo.tipo, 20);
    const autor = sanitizarTexto(cuerpo.autor, 120);
    const mensaje = sanitizarTexto(cuerpo.mensaje, 600);

    if (!referencia) {
        return res.status(400).json({ success: false, message: 'Referencia de cumpleañero requerida' });
    }

    if (!tipo || !['abrazo', 'mensaje'].includes(tipo)) {
        return res.status(400).json({ success: false, message: 'Tipo inválido. Debe ser "abrazo" o "mensaje"' });
    }

    if (tipo === 'mensaje' && (!mensaje || mensaje.length < 3)) {
        return res.status(400).json({ success: false, message: 'El mensaje debe tener al menos 3 caracteres' });
    }

    const payload = {
        referencia,
        tipo,
        autor: autor || null,
        mensaje: tipo === 'mensaje' ? mensaje : null,
        metadata: {
            ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'desconocida',
            user_agent: req.headers['user-agent'] || 'desconocido'
        }
    };

    const { error } = await supabase.from('cumpleanos_interacciones').insert(payload);
    if (error) {
        console.error('❌ Error guardando interacción:', error.message);
        return res.status(500).json({ success: false, message: 'No se pudo registrar la interacción' });
    }

    // Obtener resumen
    const { data: resumenData } = await supabase
        .from('cumpleanos_interacciones')
        .select('tipo, autor, mensaje, created_at')
        .eq('referencia', referencia)
        .order('created_at', { ascending: false })
        .limit(100);

    const resumen = (resumenData || []).reduce((acc, item) => {
        if (item.tipo === 'abrazo') acc.abrazos += 1;
        else if (item.tipo === 'mensaje' && item.mensaje) {
            acc.mensajes.push({
                autor: item.autor || 'Comunidad Cresalia',
                mensaje: item.mensaje,
                fecha: item.created_at
            });
        }
        return acc;
    }, { abrazos: 0, mensajes: [] });

    res.status(200).json({ success: true, referencia, resumen });
}

// ==================== ACCIÓN: COMPRADORES ====================
async function handleCompradores(supabase, req, res) {
    const ahora = new Date();
    const mesParam = parseInt(req.query.mes, 10);
    const mes = (!Number.isNaN(mesParam) && mesParam >= 1 && mesParam <= 12)
        ? mesParam
        : (ahora.getMonth() + 1);

    const tablaCompradores = process.env.SUPABASE_COMPRADORES_TABLE || 'compradores';

    const { data, error } = await supabase
        .from(tablaCompradores)
        .select(`
            id, user_id, email, nombre, nombre_completo, username, alias, display_name,
            fecha_nacimiento, acepta_cumple_publico, acepta_cumple_descuento,
            avatar_url, foto_perfil, imagen_perfil, profile_picture,
            ciudad, localidad, pais, country, direccion_principal
        `)
        .eq('acepta_cumple_publico', true)
        .not('fecha_nacimiento', 'is', null);

    if (error) {
        throw new Error(`No se pudo obtener compradores: ${error.message}`);
    }

    const compradores = (data || [])
        .filter(row => {
            if (!row.fecha_nacimiento) return false;
            const fecha = new Date(`${row.fecha_nacimiento}T00:00:00`);
            return (fecha.getMonth() + 1) === mes;
        })
        .map(row => {
            const fecha = new Date(`${row.fecha_nacimiento}T00:00:00`);
            let ubicacion = { ciudad: row.ciudad || row.localidad || null, pais: row.pais || row.country || null };
            if ((!ubicacion.ciudad || !ubicacion.pais) && row.direccion_principal) {
                try {
                    const direccion = typeof row.direccion_principal === 'string' ? JSON.parse(row.direccion_principal) : row.direccion_principal;
                    if (direccion && typeof direccion === 'object') {
                        ubicacion.ciudad = ubicacion.ciudad || direccion.ciudad || direccion.city || null;
                        ubicacion.pais = ubicacion.pais || direccion.pais || direccion.country || null;
                    }
                } catch (_) {}
            }
            return {
                id: row.id || row.user_id || row.email,
                referencia: row.email || row.user_id || row.id || row.username || row.alias || null,
                email: row.email || null,
                nombre: row.nombre_completo || row.nombre || row.username || row.display_name || row.alias || row.email || 'Comprador Cresalia',
                avatar: row.avatar_url || row.foto_perfil || row.imagen_perfil || row.profile_picture || null,
                ciudad: ubicacion.ciudad,
                pais: ubicacion.pais,
                dia: fecha ? fecha.getDate() : null,
                aceptaBeneficio: Boolean(row.acepta_cumple_descuento)
            };
        })
        .sort((a, b) => (a.dia || 31) - (b.dia || 31));

    res.status(200).json({
        success: true,
        mesNumero: mes,
        mesNombre: obtenerNombreMes(mes),
        compradores
    });
}

// ==================== ACCIÓN: CONSENT ====================
async function handleConsent(supabase, req, res) {
    const tabla = process.env.SUPABASE_COMPRADORES_TABLE || 'compradores';

    if (req.method === 'GET') {
        const email = (req.query.email || '').toString().trim().toLowerCase();
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email requerido' });
        }

        const { data, error } = await supabase
            .from(tabla)
            .select('email, nombre, nombre_completo, acepta_cumple_publico, acepta_cumple_descuento, fecha_nacimiento, mensaje_cumple_publico')
            .eq('email', email)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ success: true, data: null, message: 'No encontramos un comprador con ese email' });
        }

        res.status(200).json({
            success: true,
            data: {
                email: data.email || null,
                nombre: data.nombre || data.nombre_completo || null,
                acepta_cumple_publico: Boolean(data.acepta_cumple_publico),
                acepta_cumple_descuento: Boolean(data.acepta_cumple_descuento),
                fecha_nacimiento: data.fecha_nacimiento || null,
                mensaje_cumple_publico: data.mensaje_cumple_publico || null
            }
        });
        return;
    }

    if (req.method === 'POST') {
        const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const email = (cuerpo.email || '').toString().trim().toLowerCase();
        const aceptaPublico = Boolean(cuerpo.acepta_cumple_publico);
        const aceptaDescuento = Boolean(cuerpo.acepta_cumple_descuento);
        const fechaNacimiento = cuerpo.fecha_nacimiento ? new Date(cuerpo.fecha_nacimiento).toISOString().slice(0, 10) : null;
        const mensaje = sanitizarTexto(cuerpo.mensaje_cumple_publico, 280);

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email requerido' });
        }

        const updateData = {
            acepta_cumple_publico: aceptaPublico,
            acepta_cumple_descuento: aceptaDescuento
        };
        if (fechaNacimiento) updateData.fecha_nacimiento = fechaNacimiento;
        if (mensaje !== null) updateData.mensaje_cumple_publico = mensaje;

        const { error } = await supabase
            .from(tabla)
            .update(updateData)
            .eq('email', email);

        if (error) throw error;

        res.status(200).json({ success: true, message: 'Preferencias actualizadas correctamente' });
        return;
    }

    res.status(405).json({ success: false, message: 'Método no permitido' });
}

// ==================== HANDLER PRINCIPAL ====================
module.exports = async (req, res) => {
    applyCors(res);

    if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
    }

    try {
        const supabase = getSupabase();
        const action = req.query.action || 'resumen';

        switch (action) {
            case 'resumen':
                await handleResumen(supabase, req, res);
                break;
            case 'interacciones':
                await handleInteracciones(supabase, req, res);
                break;
            case 'compradores':
                await handleCompradores(supabase, req, res);
                break;
            case 'consent':
                await handleConsent(supabase, req, res);
                break;
            default:
                res.status(400).json({ success: false, message: `Acción "${action}" no válida. Use: resumen, interacciones, compradores, consent` });
        }
    } catch (error) {
        console.error('❌ Error en API cumpleanos:', error.message);
        res.status(500).json({
            success: false,
            message: 'Ocurrió un problema al procesar la solicitud'
        });
    }
};

