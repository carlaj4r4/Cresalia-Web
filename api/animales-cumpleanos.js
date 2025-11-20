/**
 * 🎂 API: Cumpleaños de Animales
 * Obtiene animales que cumplen años (aniversario de adopción/rescate) en el mes actual
 * Co-fundadores: Carla & Claude
 */

const { createClient } = require('@supabase/supabase-js');

// Función para aplicar CORS
function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async (req, res) => {
    applyCors(res);
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            message: 'Método no permitido. Usa GET para obtener animales que cumplen años.'
        });
    }
    
    try {
        // Obtener credenciales de Supabase
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            return res.status(500).json({
                success: false,
                message: 'Configuración de Supabase no encontrada.'
            });
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Obtener mes actual
        const ahora = new Date();
        const mesActual = ahora.getMonth() + 1; // getMonth() devuelve 0-11, necesitamos 1-12
        
        // Obtener parámetros de query
        const { mes, año } = req.query;
        const mesBuscar = mes ? parseInt(mes) : mesActual;
        const añoBuscar = año ? parseInt(año) : ahora.getFullYear();
        
        // Validar mes
        if (mesBuscar < 1 || mesBuscar > 12) {
            return res.status(400).json({
                success: false,
                message: 'Mes inválido. Debe ser entre 1 y 12.'
            });
        }
        
        // Obtener animales que cumplen años en el mes especificado
        // Buscamos animales cuya fecha_adopcion_rescate esté en el mes especificado
        const inicioMes = `${añoBuscar}-${String(mesBuscar).padStart(2, '0')}-01`;
        const finMes = new Date(añoBuscar, mesBuscar, 0).getDate(); // Último día del mes
        const finMesStr = `${añoBuscar}-${String(mesBuscar).padStart(2, '0')}-${String(finMes).padStart(2, '0')}`;
        
        const { data: animales, error } = await supabase
            .from('animales_necesitan_ayuda')
            .select(`
                *,
                organizaciones_animales (
                    nombre_organizacion,
                    tipo,
                    contacto_email,
                    contacto_telefono
                )
            `)
            .not('fecha_adopcion_rescate', 'is', null)
            .gte('fecha_adopcion_rescate', inicioMes)
            .lte('fecha_adopcion_rescate', finMesStr)
            .in('estado', ['activa', 'en_proceso'])
            .order('fecha_adopcion_rescate', { ascending: true });
        
        if (error) {
            console.error('❌ Error obteniendo animales:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener animales que cumplen años.',
                error: error.message
            });
        }
        
        // Calcular años desde adopción/rescate
        const animalesConAños = (animales || []).map(animal => {
            if (!animal.fecha_adopcion_rescate) {
                return null;
            }
            
            const fechaAdopcion = new Date(animal.fecha_adopcion_rescate);
            const hoy = new Date();
            
            let años = hoy.getFullYear() - fechaAdopcion.getFullYear();
            const mesDiff = hoy.getMonth() - fechaAdopcion.getMonth();
            
            // Si aún no llegó el día/mes del aniversario este año, restar un año
            if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaAdopcion.getDate())) {
                años--;
            }
            
            return {
                ...animal,
                años_desde_adopcion_rescate: años,
                fecha_cumpleanos: `${mesBuscar}-${fechaAdopcion.getDate()}`, // Mes-día del cumpleaños
                tipo_celebracion: 'aniversario_adopcion_rescate'
            };
        }).filter(animal => animal !== null);
        
        // Retornar resultados
        return res.status(200).json({
            success: true,
            mes: mesBuscar,
            año: añoBuscar,
            total: animalesConAños.length,
            animales: animalesConAños,
            message: `Se encontraron ${animalesConAños.length} animales que cumplen años en ${mesBuscar}/${añoBuscar}`
        });
        
    } catch (error) {
        console.error('❌ Error en /api/animales-cumpleanos:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor.',
            error: error.message
        });
    }
};

