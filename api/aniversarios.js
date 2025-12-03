// ==================== FUNCIÓN CONSOLIDADA: ANIVERSARIOS ====================
// Reemplaza: aniversarios-celebracion.js, aniversarios-configuracion.js

const { createClient } = require('@supabase/supabase-js');

let supabaseClient = null;

function getSupabase() {
    if (supabaseClient) return supabaseClient;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
        throw new Error('Variables SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no configuradas');
    }
    supabaseClient = createClient(url, key);
    return supabaseClient;
}

function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const TABLA_POR_TIPO = {
    tienda: 'tiendas',
    servicio: 'servicios',
    comprador: 'compradores'
};

const DEFAULT_COLORES = {
    cumpleanos_fundador: { fondo: '#EC4899', texto: '#FFFFFF', acento: '#7C3AED' },
    aniversario_negocio: { fondo: '#0EA5E9', texto: '#FFFFFF', acento: '#10B981' },
    aniversario_cresalia: { fondo: '#7C3AED', texto: '#FFFFFF', acento: '#EC4899' }
};

const DEFAULT_MENSAJES = {
    cumpleanos_fundador: 'Sabemos que sos una persona luchadora e increíble. Hoy merecés un respiro lleno de cosas lindas.',
    aniversario_negocio: 'Cada paso que diste hasta acá es valioso. Respirá y celebremos este camino.',
    aniversario_cresalia: 'Gracias por ser parte de Cresalia. Crecemos juntos, a tu ritmo.'
};

// ==================== ACCIÓN: CELEBRACIÓN ====================
async function handleCelebracion(supabase, req, res) {
    const tipo = (req.query.tipo || 'tienda').toLowerCase();
    if (!TABLA_POR_TIPO[tipo]) {
        return res.status(400).json({ success: false, message: 'Tipo inválido' });
    }

    const slug = (req.query.slug || '').toLowerCase();
    const email = (req.query.email || '').toLowerCase();
    const id = req.query.id || null;

    const registro = await obtenerRegistro(supabase, tipo, { slug, email, id });
    if (!registro) {
        return res.status(200).json({
            success: false,
            celebraciones: [],
            mensaje: 'No encontramos información para esta tienda o servicio.'
        });
    }

    const celebraciones = construirCelebraciones(registro, tipo);
    const personalizacion = await obtenerPersonalizacion(supabase, tipo, registro, { slug, email, id });
    const combos = await obtenerCombos(supabase, tipo, registro);
    const bienestar = await obtenerPersonalizacionBienestar(supabase, tipo, registro, { slug, email, id });

    const celebracionesEnriquecidas = celebraciones.map(item => {
        const personalizacionItem = (personalizacion && personalizacion[item.tipo]) || {};
        const colores = personalizacionItem.colores || {};
        const duracionDias = personalizacionItem.duracion_dias || 1;
        const estaEnRango = estaEnRangoCelebracion(item, duracionDias);
        
        if (!estaEnRango) return null;
        
        return {
            ...item,
            colores: {
                fondo: colores.color_fondo || DEFAULT_COLORES[item.tipo]?.fondo,
                texto: colores.color_texto || DEFAULT_COLORES[item.tipo]?.texto,
                acento: colores.color_accento || DEFAULT_COLORES[item.tipo]?.acento,
                secundario: colores.color_secundario || DEFAULT_COLORES[item.tipo]?.acento
            },
            combosDestacados: combos.filter(combo => combo.tipo_celebracion === item.tipo),
            metricas: construirMetricas(registro, item.tipo),
            mensaje: item.mensaje || DEFAULT_MENSAJES[item.tipo] || DEFAULT_MENSAJES.cumpleanos_fundador,
            duracionDias: duracionDias
        };
    }).filter(item => item !== null);

    res.status(200).json({
        success: true,
        celebrando: celebracionesEnriquecidas.length > 0,
        celebraciones: celebracionesEnriquecidas,
        bienestar
    });
}

// ==================== ACCIÓN: CONFIGURACIÓN ====================
async function handleConfiguracion(supabase, req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Método no permitido' });
    }

    const payload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { tipo, slug, email, id, tipo_celebracion, duracion_dias, color_fondo, color_texto, color_accento, estilo_banner, mensaje_bienvenida, mensaje_subtitulo, aplicar_en_tienda, aplicar_en_portada } = payload;

    if (!tipo || !['tienda', 'servicio'].includes(tipo)) {
        return res.status(400).json({ success: false, message: 'Tipo inválido. Debe ser "tienda" o "servicio".' });
    }

    if (!slug && !email && !id) {
        return res.status(400).json({ success: false, message: 'Se requiere slug, email o id.' });
    }

    if (!tipo_celebracion || !['cumpleanos_fundador', 'aniversario_negocio'].includes(tipo_celebracion)) {
        return res.status(400).json({ success: false, message: 'Tipo de celebración inválido.' });
    }

    if (duracion_dias && (duracion_dias < 1 || duracion_dias > 30)) {
        return res.status(400).json({ success: false, message: 'Duración debe estar entre 1 y 30 días.' });
    }

    const tabla = tipo === 'servicio' ? 'servicios' : 'tiendas';
    let registro = null;

    if (id) {
        const { data, error } = await supabase.from(tabla).select('id, slug, email').eq('id', id).maybeSingle();
        if (!error && data) registro = data;
    } else if (slug) {
        const camposSlug = ['slug', 'subdomain', 'tienda_slug', 'servicio_slug'];
        for (const campo of camposSlug) {
            const { data, error } = await supabase.from(tabla).select('id, slug, email').eq(campo, slug).maybeSingle();
            if (!error && data) { registro = data; break; }
        }
    } else if (email) {
        const camposEmail = ['email', 'email_contacto', 'correo'];
        for (const campo of camposEmail) {
            const { data, error } = await supabase.from(tabla).select('id, slug, email').ilike(campo, email).maybeSingle();
            if (!error && data) { registro = data; break; }
        }
    }

    if (!registro) {
        return res.status(404).json({ success: false, message: 'No se encontró la tienda o servicio.' });
    }

    const datosPersonalizacion = {
        tipo_negocio: tipo,
        tienda_id: tipo === 'tienda' ? registro.id : null,
        servicio_id: tipo === 'servicio' ? registro.id : null,
        tienda_slug: tipo === 'tienda' ? (registro.slug || slug) : null,
        servicio_slug: tipo === 'servicio' ? (registro.slug || slug) : null,
        tienda_email: registro.email || email || null,
        tipo_celebracion,
        color_fondo: color_fondo || '#7C3AED',
        color_texto: color_texto || '#FFFFFF',
        color_accento: color_accento || '#EC4899',
        estilo_banner: estilo_banner || 'degradado',
        aplicar_en_tienda: aplicar_en_tienda !== false,
        aplicar_en_portada: aplicar_en_portada !== false,
        activo: true,
        updated_at: new Date().toISOString()
    };

    let query = supabase
        .from('aniversarios_personalizacion')
        .select('id')
        .eq('tipo_negocio', tipo)
        .eq('tipo_celebracion', tipo_celebracion);

    if (tipo === 'servicio') {
        query = query.eq('servicio_slug', registro.slug || slug);
    } else {
        query = query.eq('tienda_slug', registro.slug || slug);
    }

    const { data: existing } = await query.maybeSingle();
    let resultado;

    if (existing && existing.id) {
        const { data, error } = await supabase
            .from('aniversarios_personalizacion')
            .update(datosPersonalizacion)
            .eq('id', existing.id)
            .select()
            .maybeSingle();
        if (error) throw error;
        resultado = data;
    } else {
        const { data, error } = await supabase
            .from('aniversarios_personalizacion')
            .insert(datosPersonalizacion)
            .select()
            .maybeSingle();
        if (error) throw error;
        resultado = data;
    }

    if (duracion_dias) {
        try {
            await supabase
                .from(tabla)
                .update({ [`duracion_celebracion_${tipo_celebracion}`]: duracion_dias })
                .eq('id', registro.id);
        } catch (err) {
            console.warn('No se pudo guardar duración:', err.message);
        }
    }

    if (mensaje_bienvenida || mensaje_subtitulo) {
        try {
            const datosBienestar = {
                tipo_negocio: tipo,
                tienda_id: tipo === 'tienda' ? registro.id : null,
                servicio_id: tipo === 'servicio' ? registro.id : null,
                comprador_email: null,
                mensaje_bienvenida: mensaje_bienvenida || null,
                mensaje_aniversario: mensaje_subtitulo || null,
                color_principal: color_fondo || '#7C3AED',
                color_secundario: color_accento || '#EC4899',
                activo: true,
                updated_at: new Date().toISOString()
            };

            let queryBienestar = supabase
                .from('bienestar_personalizacion')
                .select('id')
                .eq('tipo_negocio', tipo);

            if (tipo === 'servicio') {
                queryBienestar = queryBienestar.eq('servicio_id', registro.id);
            } else {
                queryBienestar = queryBienestar.eq('tienda_id', registro.id);
            }

            const { data: existingBienestar } = await queryBienestar.maybeSingle();

            if (existingBienestar && existingBienestar.id) {
                await supabase.from('bienestar_personalizacion').update(datosBienestar).eq('id', existingBienestar.id);
            } else {
                await supabase.from('bienestar_personalizacion').insert(datosBienestar);
            }
        } catch (err) {
            console.warn('No se pudo guardar personalización de bienestar:', err.message);
        }
    }

    res.status(200).json({
        success: true,
        message: 'Configuración guardada correctamente',
        data: resultado
    });
}

// ==================== FUNCIONES AUXILIARES ====================
async function obtenerRegistro(supabase, tipo, { slug, email, id }) {
    const tabla = TABLA_POR_TIPO[tipo];
    if (!tabla) return null;

    if (id) {
        const { data, error } = await supabase.from(tabla).select('*').eq('id', id).maybeSingle();
        if (!error && data) return data;
    }

    if (slug) {
        const posiblesCampos = ['slug', 'subdomain', 'tienda_slug', 'servicio_slug'];
        for (const campo of posiblesCampos) {
            const { data, error } = await supabase.from(tabla).select('*').eq(campo, slug).maybeSingle();
            if (!error && data) return data;
        }
    }

    if (email) {
        const camposEmail = ['email', 'email_contacto', 'correo'];
        for (const campo of camposEmail) {
            const { data, error } = await supabase.from(tabla).select('*').ilike(campo, email).maybeSingle();
            if (!error && data) return data;
        }
    }

    return null;
}

function construirCelebraciones(registro, tipo) {
    const hoy = new Date();
    const celebraciones = [];

    if (tipo === 'tienda' || tipo === 'servicio') {
        if (esHoy(registro.fecha_nacimiento_responsable) && esVerdadero(registro.acepta_cumple_home)) {
            celebraciones.push({
                tipo: 'cumpleanos_fundador',
                titulo: '¡Felicidades y bienvenido, [nombre]!',
                subtitulo: 'Hoy celebramos tu vida y tu fuerza emprendedora.',
                icono: '🎂',
                etiqueta: 'Cumpleaños del Fundador'
            });
        }

        const fechaNegocio = registro.fecha_creacion_negocio || registro.fecha_creacion || registro.fecha_registro;
        if (esHoy(fechaNegocio) && esVerdadero(registro.acepta_aniversario_negocio_home)) {
            celebraciones.push({
                tipo: 'aniversario_negocio',
                titulo: '¡Felicidades y bienvenido, [nombre]!',
                subtitulo: 'Cada capítulo escrito con esfuerzo merece una celebración.',
                icono: '🏢',
                etiqueta: 'Aniversario del Negocio'
            });
        }

        const fechaCresalia = registro.fecha_registro || registro.created_at;
        if (esHoy(fechaCresalia) && esVerdadero(registro.acepta_aniversario_cresalia_home)) {
            celebraciones.push({
                tipo: 'aniversario_cresalia',
                titulo: '¡Gracias por crecer con Cresalia, [nombre]!',
                subtitulo: 'Estamos felices de acompañarte en este viaje.',
                icono: '🎊',
                etiqueta: 'Aniversario en Cresalia'
            });
        }
    }

    if (tipo === 'comprador') {
        if (esHoy(registro.fecha_nacimiento) && esVerdadero(registro.acepta_cumple_publico)) {
            celebraciones.push({
                tipo: 'cumpleanos_fundador',
                titulo: '¡Bienvenido y Feliz Cumpleaños, [nombre]!',
                subtitulo: 'Tu presencia en la comunidad Cresalia es un regalo.',
                icono: '🎂',
                etiqueta: 'Cumpleaños'
            });
        }

        const fechaRegistro = registro.fecha_registro || registro.created_at;
        if (esHoy(fechaRegistro) && esVerdadero(registro.acepta_aniversario_publico)) {
            celebraciones.push({
                tipo: 'aniversario_cresalia',
                titulo: '¡Bienvenido y Feliz Aniversario, [nombre]!',
                subtitulo: 'Gracias por ser parte de Cresalia, crecemos a tu ritmo.',
                icono: '🎉',
                etiqueta: 'Aniversario en Cresalia'
            });
        }
    }

    return celebraciones;
}

async function obtenerPersonalizacion(supabase, tipo, registro, { slug, email, id }) {
    const tipoNegocio = tipo === 'servicio' ? 'servicio' : 'tienda';
    let query = supabase
        .from('aniversarios_personalizacion')
        .select('*')
        .eq('tipo_negocio', tipoNegocio)
        .eq('activo', true);

    if (slug) {
        if (tipoNegocio === 'servicio') {
            query = query.eq('servicio_slug', slug);
        } else {
            query = query.eq('tienda_slug', slug);
        }
    } else if (id) {
        if (tipoNegocio === 'servicio') {
            query = query.eq('servicio_id', id);
        } else {
            query = query.eq('tienda_id', id);
        }
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) return null;

    const personalizaciones = {};
    data.forEach(item => {
        personalizaciones[item.tipo_celebracion] = {
            colores: {
                color_fondo: item.color_fondo,
                color_texto: item.color_texto,
                color_accento: item.color_accento,
                color_secundario: item.color_accento
            },
            duracion_dias: item.duracion_dias || 1,
            aplicar_en_tienda: item.aplicar_en_tienda !== false,
            aplicar_en_portada: item.aplicar_en_portada !== false
        };
    });

    return personalizaciones;
}

async function obtenerCombos(supabase, tipo, registro) {
    try {
        let query = supabase
            .from('aniversarios_combos')
            .select('*')
            .eq('tipo_negocio', tipo === 'servicio' ? 'servicio' : 'tienda')
            .eq('activo', true);

        if (registro.slug) {
            if (tipo === 'servicio') {
                query = query.eq('servicio_slug', registro.slug);
            } else {
                query = query.eq('tienda_slug', registro.slug);
            }
        }

        const { data, error } = await query
            .order('destacado', { ascending: false })
            .order('fecha_inicio', { ascending: false })
            .limit(5);

        if (error || !data) return [];

        const mesActual = new Date().getMonth() + 1;
        return data.filter(combo => combo.mes_celebracion === mesActual);
    } catch (error) {
        console.warn('No se pudieron obtener combos:', error.message);
        return [];
    }
}

async function obtenerPersonalizacionBienestar(supabase, tipo, registro, { slug, email, id }) {
    try {
        const tipoNegocio = tipo === 'servicio' ? 'servicio' : tipo;
        let query = supabase
            .from('bienestar_personalizacion')
            .select('*')
            .eq('tipo_negocio', tipoNegocio);

        if (slug) {
            if (tipoNegocio === 'servicio') {
                query = query.eq('servicio_slug', slug);
            } else if (tipoNegocio === 'tienda') {
                query = query.eq('tienda_slug', slug);
            }
        } else if (id) {
            if (tipoNegocio === 'servicio') {
                query = query.eq('servicio_id', id);
            } else if (tipoNegocio === 'tienda') {
                query = query.eq('tienda_id', id);
            }
        } else if (tipoNegocio === 'comprador' && email) {
            query = query.eq('comprador_email', email);
        }

        const { data, error } = await query.maybeSingle();
        if (error || !data) return null;

        return {
            colores: {
                color_principal: data.color_principal,
                color_secundario: data.color_secundario,
                color_fondo: data.color_fondo,
                color_texto: data.color_texto
            },
            mensajes: {
                bienvenida: data.mensaje_bienvenida,
                aniversario: data.mensaje_aniversario,
                general: data.mensaje_general
            }
        };
    } catch (error) {
        console.warn('No se pudo obtener personalización de bienestar:', error.message);
        return null;
    }
}

function construirMetricas(registro, tipoCelebracion) {
    if (!registro || tipoCelebracion === 'cumpleanos_fundador') return [];

    const metricas = [];
    if (registro.total_ventas_anual) {
        metricas.push({ valor: `+${registro.total_ventas_anual}`, label: 'Ventas este año' });
    }
    if (registro.nuevos_clientes_mes) {
        metricas.push({ valor: `+${registro.nuevos_clientes_mes}`, label: 'Clientes nuevos este mes' });
    }
    return metricas;
}

function esHoy(fecha) {
    if (!fecha) return false;
    const hoy = new Date();
    const fechaComparar = new Date(fecha);
    if (Number.isNaN(fechaComparar.getTime())) return false;
    return (
        fechaComparar.getUTCDate() === hoy.getUTCDate() &&
        fechaComparar.getUTCMonth() === hoy.getUTCMonth()
    );
}

function estaEnRangoCelebracion(celebracion, duracionDias = 1) {
    if (!celebracion || !celebracion.fechaCelebracion || duracionDias < 1) return false;
    const hoy = new Date();
    const fechaCelebracion = new Date(celebracion.fechaCelebracion);
    if (Number.isNaN(fechaCelebracion.getTime())) return false;
    
    const diaCelebracion = fechaCelebracion.getUTCDate();
    const mesCelebracion = fechaCelebracion.getUTCMonth();
    const anioCelebracion = fechaCelebracion.getUTCFullYear();
    const diaHoy = hoy.getUTCDate();
    const mesHoy = hoy.getUTCMonth();
    const anioHoy = hoy.getUTCFullYear();
    
    if (mesHoy === mesCelebracion && anioHoy === anioCelebracion) {
        const diferencia = diaHoy - diaCelebracion;
        return diferencia >= 0 && diferencia < duracionDias;
    }
    
    if (mesHoy === (mesCelebracion + 1) % 12 || (mesHoy === 0 && mesCelebracion === 11 && anioHoy === anioCelebracion + 1)) {
        const diasEnMesCelebracion = new Date(anioCelebracion, mesCelebracion + 1, 0).getDate();
        const diasRestantes = diasEnMesCelebracion - diaCelebracion;
        if (duracionDias > diasRestantes) {
            const diasExtendidos = duracionDias - diasRestantes;
            return diaHoy < diasExtendidos;
        }
    }
    
    return false;
}

function esVerdadero(valor) {
    return valor === true || valor === 1 || valor === 'true' || valor === '1';
}

// ==================== HANDLER PRINCIPAL ====================
module.exports = async (req, res) => {
    applyCors(res);

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const supabase = getSupabase();
        const action = req.query.action || 'celebracion';

        switch (action) {
            case 'celebracion':
                await handleCelebracion(supabase, req, res);
                break;
            case 'configuracion':
                await handleConfiguracion(supabase, req, res);
                break;
            default:
                res.status(400).json({ success: false, message: `Acción "${action}" no válida. Use: celebracion, configuracion` });
        }
    } catch (error) {
        console.error('❌ Error en API aniversarios:', error.message);
        res.status(500).json({
            success: false,
            message: 'Ocurrió un problema al procesar la solicitud',
            error: error.message
        });
    }
};

