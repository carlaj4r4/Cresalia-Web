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

function obtenerNombreMes(numeroMes) {
    const nombres = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return nombres[numeroMes - 1] || '';
}

function obtenerReferencia(row) {
    return (
        row.email ||
        row.user_id ||
        row.id ||
        row.username ||
        row.alias ||
        row.nombre_completo ||
        null
    );
}

function normalizarCelebrante(row) {
    const fecha = row.fecha_nacimiento
        ? new Date(`${row.fecha_nacimiento}T00:00:00`)
        : null;

    return {
        referencia: obtenerReferencia(row),
        email: row.email || null,
        nombre: row.nombre_completo || row.nombre || row.alias || row.email || 'Comprador Cresalia',
        dia: fecha ? fecha.getDate() : null,
        aceptaBeneficio: Boolean(row.acepta_cumple_descuento),
        mensaje: row.mensaje_cumple_publico || null
    };
}

async function obtenerCelebrantes(supabase, tablaCompradores, mes) {
    const { data, error } = await supabase
        .from(tablaCompradores)
        .select(`
            id,
            user_id,
            email,
            nombre,
            nombre_completo,
            username,
            alias,
            fecha_nacimiento,
            acepta_cumple_publico,
            acepta_cumple_descuento,
            mensaje_cumple_publico
        `)
        .eq('acepta_cumple_publico', true)
        .not('fecha_nacimiento', 'is', null);

    if (error) {
        throw new Error(`No se pudo obtener la lista de cumpleaños: ${error.message}`);
    }

    return (data || [])
        .filter(row => {
            if (!row.fecha_nacimiento) return false;
            const fecha = new Date(`${row.fecha_nacimiento}T00:00:00`);
            return (fecha.getMonth() + 1) === mes;
        })
        .map(normalizarCelebrante)
        .sort((a, b) => (a.dia || 31) - (b.dia || 31));
}

async function obtenerInteracciones(supabase, referencias, inicioMes, finMes) {
    if (!referencias || referencias.length === 0) {
        return {
            totalAbrazos: 0,
            totalMensajes: 0,
            mensajesRecientes: []
        };
    }

    const referenciasValidas = referencias.filter(Boolean);
    if (referenciasValidas.length === 0) {
        return {
            totalAbrazos: 0,
            totalMensajes: 0,
            mensajesRecientes: []
        };
    }

    const { data, error } = await supabase
        .from('cumpleanos_interacciones')
        .select('referencia, tipo, autor, mensaje, created_at')
        .in('referencia', referenciasValidas)
        .gte('created_at', inicioMes.toISOString())
        .lt('created_at', finMes.toISOString())
        .order('created_at', { ascending: false })
        .limit(200);

    if (error) {
        throw new Error(`No se pudieron obtener interacciones: ${error.message}`);
    }

    let totalAbrazos = 0;
    let totalMensajes = 0;
    const mensajesRecientes = [];

    (data || []).forEach(item => {
        if (item.tipo === 'abrazo') {
            totalAbrazos += 1;
        } else if (item.tipo === 'mensaje' && item.mensaje) {
            totalMensajes += 1;
            if (mensajesRecientes.length < 15) {
                mensajesRecientes.push({
                    referencia: item.referencia,
                    autor: item.autor || 'Comunidad Cresalia',
                    mensaje: item.mensaje,
                    fecha: item.created_at
                });
            }
        }
    });

    return {
        totalAbrazos,
        totalMensajes,
        mensajesRecientes
    };
}

async function obtenerBeneficios(supabase, inicioMes, finMes) {
    const { data, error } = await supabase
        .from('cumpleanos_historial')
        .select('tipo, referencia_slug, cupón_generado, beneficio')
        .gte('fecha', inicioMes.toISOString().slice(0, 10))
        .lt('fecha', finMes.toISOString().slice(0, 10));

    if (error) {
        throw new Error(`No se pudieron obtener beneficios: ${error.message}`);
    }

    let cuponesGenerados = 0;
    let upgradesOtorgados = 0;
    const detalle = [];

    (data || []).forEach(item => {
        if (item['cupón_generado']) {
            cuponesGenerados += 1;
        }
        if (item.beneficio) {
            try {
                const beneficio = typeof item.beneficio === 'string'
                    ? JSON.parse(item.beneficio)
                    : item.beneficio;
                if (beneficio && beneficio.tipo === 'upgrade_enterprise') {
                    upgradesOtorgados += 1;
                }
            } catch (_error) {
                // ignorar parse error
            }
        }
        if (detalle.length < 10) {
            detalle.push({
                referencia: item.referencia_slug,
                tipo: item.tipo,
                cupón: Boolean(item['cupón_generado']),
                beneficio: item.beneficio || null
            });
        }
    });

    return {
        cuponesGenerados,
        upgradesOtorgados,
        detalle
    };
}

module.exports = async (req, res) => {
    try {
        const supabase = getSupabase();

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

        const celebrantes = await obtenerCelebrantes(supabase, tablaCompradores, mes);
        const referencias = celebrantes.map(item => item.referencia).filter(Boolean);
        const interacciones = await obtenerInteracciones(supabase, referencias, inicioMes, finMes);
        const beneficios = await obtenerBeneficios(supabase, inicioMes, finMes);

        const hoy = new Date();
        const diasComparacion = celebrantes.map(item => item.dia).filter(Boolean);

        const celebranHoy = celebrantes.filter(item => item.dia === hoy.getDate());
        const proximos = celebrantes
            .filter(item => item.dia >= hoy.getDate())
            .slice(0, 7);

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
    } catch (error) {
        console.error('❌ Error en API cumpleanos-resumen:', error.message);
        res.status(500).json({
            success: false,
            message: 'Ocurrió un problema al generar el resumen de cumpleaños'
        });
    }
};



