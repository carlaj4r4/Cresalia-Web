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

function resolverNombreComprador(row) {
    return (
        row.nombre_completo ||
        row.nombre ||
        row.username ||
        row.display_name ||
        row.alias ||
        row.email ||
        'Comprador Cresalia'
    );
}

function resolverAvatar(row) {
    return (
        row.avatar_url ||
        row.foto_perfil ||
        row.imagen_perfil ||
        row.profile_picture ||
        null
    );
}

function extraerUbicacion(row) {
    const ubicacion = {
        ciudad: row.ciudad || row.localidad || null,
        pais: row.pais || row.country || null
    };

    if ((!ubicacion.ciudad || !ubicacion.pais) && row.direccion_principal) {
        try {
            const direccion = typeof row.direccion_principal === 'string'
                ? JSON.parse(row.direccion_principal)
                : row.direccion_principal;

            if (direccion && typeof direccion === 'object') {
                ubicacion.ciudad = ubicacion.ciudad || direccion.ciudad || direccion.city || null;
                ubicacion.pais = ubicacion.pais || direccion.pais || direccion.country || null;
            }
        } catch (error) {
            console.warn('⚠️ No se pudo parsear direccion_principal:', error.message);
        }
    }

    return ubicacion;
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

function mapearComprador(row) {
    const fecha = row.fecha_nacimiento
        ? new Date(`${row.fecha_nacimiento}T00:00:00`)
        : null;

    const ubicacion = extraerUbicacion(row);

    return {
        id: row.id || row.user_id || row.email,
        referencia: obtenerReferencia(row),
        email: row.email || null,
        nombre: resolverNombreComprador(row),
        avatar: resolverAvatar(row),
        ciudad: ubicacion.ciudad,
        pais: ubicacion.pais,
        dia: fecha ? fecha.getDate() : null,
        consentimientoBeneficio: Boolean(row.acepta_cumple_descuento),
        mensajePersonalizado: row.mensaje_cumple_publico || null
    };
}

async function obtenerInteracciones(supabase, referencias) {
    if (!referencias || referencias.length === 0) {
        return {};
    }

    const referenciasFiltradas = referencias.filter(Boolean);
    if (referenciasFiltradas.length === 0) {
        return {};
    }

    const { data, error } = await supabase
        .from('cumpleanos_interacciones')
        .select('referencia, tipo, autor, mensaje, created_at')
        .in('referencia', referenciasFiltradas)
        .order('created_at', { ascending: false })
        .limit(1000);

    if (error) {
        console.warn('⚠️ No se pudieron obtener interacciones de cumpleaños:', error.message);
        return {};
    }

    return (data || []).reduce((acc, item) => {
        if (!acc[item.referencia]) {
            acc[item.referencia] = {
                abrazos: 0,
                mensajes: []
            };
        }

        if (item.tipo === 'abrazo') {
            acc[item.referencia].abrazos += 1;
        } else if (item.tipo === 'mensaje' && item.mensaje) {
            acc[item.referencia].mensajes.push({
                autor: item.autor || 'Comunidad Cresalia',
                mensaje: item.mensaje,
                fecha: item.created_at
            });
        }

        return acc;
    }, {});
}

module.exports = async (req, res) => {
    try {
        const supabase = getSupabase();

        const tablaCompradores = process.env.SUPABASE_COMPRADORES_TABLE || 'usuarios';

        const ahora = new Date();
        const mesParam = parseInt(req.query.mes, 10);
        const mes = (!Number.isNaN(mesParam) && mesParam >= 1 && mesParam <= 12)
            ? mesParam
            : (ahora.getMonth() + 1);

        const seleccion = req.query.campos === 'todos'
            ? '*'
            : [
                'id',
                'user_id',
                'email',
                'nombre',
                'nombre_completo',
                'username',
                'display_name',
                'alias',
                'ciudad',
                'pais',
                'localidad',
                'country',
                'direccion_principal',
                'avatar_url',
                'foto_perfil',
                'imagen_perfil',
                'profile_picture',
                'fecha_nacimiento',
                'acepta_cumple_publico',
                'acepta_cumple_descuento',
                'mensaje_cumple_publico'
            ].join(', ');

        const { data, error } = await supabase
            .from(tablaCompradores)
            .select(seleccion)
            .eq('acepta_cumple_publico', true)
            .not('fecha_nacimiento', 'is', null);

        if (error) {
            console.error('❌ Error consultando compradores cumpleañeros:', error.message);
            return res.status(500).json({
                success: false,
                message: 'No se pudo obtener la lista de cumpleaños de compradores'
            });
        }

        const celebrantesBase = (data || [])
            .filter(row => {
                if (!row.fecha_nacimiento) return false;
                const fecha = new Date(`${row.fecha_nacimiento}T00:00:00`);
                return (fecha.getMonth() + 1) === mes;
            })
            .map(mapearComprador);

        const referencias = celebrantesBase.map(item => item.referencia).filter(Boolean);
        const interacciones = await obtenerInteracciones(supabase, referencias);

        const celebrantes = celebrantesBase
            .map(item => ({
                ...item,
                interacciones: interacciones[item.referencia] || {
                    abrazos: 0,
                    mensajes: []
                }
            }))
            .sort((a, b) => (a.dia || 31) - (b.dia || 31));

        res.status(200).json({
            success: true,
            mesNumero: mes,
            mesNombre: obtenerNombreMes(mes),
            total: celebrantes.length,
            celebrantes
        });
    } catch (error) {
        console.error('❌ Error en API cumpleañeros-compradores:', error.message);
        res.status(500).json({
            success: false,
            message: 'Ocurrió un problema al cargar los cumpleaños de la comunidad'
        });
    }
};


