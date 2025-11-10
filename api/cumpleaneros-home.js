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

function clasificarNegocio(row) {
    const posibleServicio = [
        row.es_servicio,
        row.tipo_negocio,
        row.tipo_servicio,
        row.segmento,
        row.categoria_principal,
        row.rubro
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    if (posibleServicio.includes('serv') || posibleServicio.includes('mentor') || posibleServicio.includes('consulta')) {
        return 'servicios';
    }

    return 'tiendas';
}

function mapearTenant(row) {
    const fecha = row.fecha_nacimiento_responsable
        ? new Date(`${row.fecha_nacimiento_responsable}T00:00:00`)
        : null;

    return {
        slug: row.slug,
        nombre: row.nombre_empresa,
        descripcion: row.descripcion || row.eslogan || '',
        logo: row.logo_url || null,
        ciudad: row.ciudad || row.ubicacion_ciudad || null,
        pais: row.pais || row.ubicacion_pais || null,
        categoria: row.categoria_principal || row.segmento || row.rubro || null,
        dia: fecha ? fecha.getDate() : null,
        clasificacion: clasificarNegocio(row)
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

        const { data, error } = await supabase
            .from('tenants')
            .select(`
                slug,
                nombre_empresa,
                descripcion,
                eslogan,
                logo_url,
                ciudad,
                pais,
                categoria_principal,
                tipo_negocio,
                tipo_servicio,
                segmento,
                rubro,
                es_servicio,
                acepta_cumple_home,
                fecha_nacimiento_responsable
            `)
            .eq('acepta_cumple_home', true)
            .not('fecha_nacimiento_responsable', 'is', null);

        if (error) {
            console.error('❌ Error consultando cumpleañeros:', error.message);
            return res.status(500).json({ success: false, message: 'No se pudo obtener la lista de cumpleañeros' });
        }

        const celebrandoMes = (data || [])
            .filter(row => {
                if (!row.fecha_nacimiento_responsable) return false;
                const fecha = new Date(`${row.fecha_nacimiento_responsable}T00:00:00`);
                return (fecha.getMonth() + 1) === mes;
            })
            .map(mapearTenant)
            .sort((a, b) => (a.dia || 31) - (b.dia || 31));

        const resultado = {
            success: true,
            mesNumero: mes,
            mesNombre: obtenerNombreMes(mes),
            total: celebrandoMes.length,
            tiendas: celebrandoMes.filter(item => item.clasificacion === 'tiendas'),
            servicios: celebrandoMes.filter(item => item.clasificacion === 'servicios')
        };

        res.status(200).json(resultado);
    } catch (error) {
        console.error('❌ Error en cumpleañeros-home:', error.message);
        res.status(500).json({
            success: false,
            message: 'Ocurrió un problema al cargar los cumpleañeros'
        });
    }
};

