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

module.exports = async (req, res) => {
    try {
        const supabase = getSupabase();

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
            
            if (!estaEnRango) {
                return null; // No mostrar si no está en el rango de celebración
            }
            
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
    } catch (error) {
        console.error('❌ Error en aniversarios-celebracion:', error.message);
        res.status(500).json({
            success: false,
            message: 'No pudimos obtener la información de celebraciones',
            error: error.message
        });
    }
};

async function obtenerRegistro(supabase, tipo, { slug, email, id }) {
    const tabla = TABLA_POR_TIPO[tipo];
    if (!tabla) return null;

    const select = '*';

    if (id) {
        const { data, error } = await supabase.from(tabla).select(select).eq('id', id).maybeSingle();
        if (!error && data) return data;
    }

    if (slug) {
        const posiblesCampos = ['slug', 'subdomain', 'tienda_slug', 'servicio_slug'];
        for (const campo of posiblesCampos) {
            const { data, error } = await supabase.from(tabla).select(select).eq(campo, slug).maybeSingle();
            if (!error && data) return data;
        }
    }

    if (email) {
        const camposEmail = ['email', 'email_contacto', 'correo'];
        for (const campo of camposEmail) {
            const { data, error } = await supabase.from(tabla).select(select).ilike(campo, email).maybeSingle();
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
        metricas.push({
            valor: `+${registro.total_ventas_anual}`,
            label: 'Ventas este año'
        });
    }

    if (registro.nuevos_clientes_mes) {
        metricas.push({
            valor: `+${registro.nuevos_clientes_mes}`,
            label: 'Clientes nuevos este mes'
        });
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
    
    // Calcular el día del mes de celebración
    const diaCelebracion = fechaCelebracion.getUTCDate();
    const mesCelebracion = fechaCelebracion.getUTCMonth();
    const anioCelebracion = fechaCelebracion.getUTCFullYear();
    const diaHoy = hoy.getUTCDate();
    const mesHoy = hoy.getUTCMonth();
    const anioHoy = hoy.getUTCFullYear();
    
    // Si es el mismo mes y año, verificar si está en el rango
    if (mesHoy === mesCelebracion && anioHoy === anioCelebracion) {
        const diferencia = diaHoy - diaCelebracion;
        return diferencia >= 0 && diferencia < duracionDias;
    }
    
    // Si el mes actual es el siguiente al de celebración y aún estamos en el rango
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


