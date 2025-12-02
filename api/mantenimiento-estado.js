// ===== API: Estado de Mantenimiento =====
// Maneja el estado de mantenimiento de la plataforma

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        // Por ahora, usar localStorage/Vercel KV o una tabla de Supabase
        // Por simplicidad, vamos a usar una tabla en Supabase
        
        if (req.method === 'GET') {
            // Obtener estado actual
            const estado = await obtenerEstadoMantenimiento();
            
            return res.status(200).json({
                activo: estado.activo || false,
                mensaje: estado.mensaje || null,
                fechaInicio: estado.fecha_inicio || null,
                fechaFinEstimada: estado.fecha_fin_estimada || null
            });
        }
        
        if (req.method === 'POST') {
            const { activo, mensaje, fechaFinEstimada } = req.body;
            
            // Validación básica
            if (typeof activo !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    error: 'El campo "activo" debe ser true o false'
                });
            }
            
            // Actualizar estado
            const resultado = await actualizarEstadoMantenimiento({
                activo,
                mensaje: mensaje || null,
                fecha_fin_estimada: fechaFinEstimada || null
            });
            
            return res.status(200).json({
                success: true,
                message: activo ? 'Mantenimiento activado' : 'Mantenimiento desactivado',
                estado: resultado
            });
        }
        
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
        
    } catch (error) {
        console.error('❌ Error en mantenimiento-estado.js:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// ===== FUNCIONES AUXILIARES =====

async function obtenerEstadoMantenimiento() {
    // Si no hay Supabase configurado, usar un estado por defecto
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        // Usar un estado simple almacenado (podría usar Vercel KV en producción)
        return {
            activo: false,
            mensaje: null,
            fecha_inicio: null,
            fecha_fin_estimada: null
        };
    }
    
    try {
        // Obtener el estado más reciente de Supabase
        const response = await fetch(`${SUPABASE_URL}/rest/v1/mantenimiento_plataforma?order=fecha_inicio.desc&limit=1`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
                const estado = data[0];
                // Solo considerar activo si no tiene fecha_fin o fecha_fin es futura
                const ahora = new Date();
                const fechaFin = estado.fecha_fin ? new Date(estado.fecha_fin) : null;
                
                return {
                    activo: estado.activo && (!fechaFin || fechaFin > ahora),
                    mensaje: estado.mensaje,
                    fecha_inicio: estado.fecha_inicio,
                    fecha_fin_estimada: estado.fecha_fin_estimada
                };
            }
        }
    } catch (error) {
        console.error('Error obteniendo estado de Supabase:', error);
    }
    
    return {
        activo: false,
        mensaje: null,
        fecha_inicio: null,
        fecha_fin_estimada: null
    };
}

async function actualizarEstadoMantenimiento(datos) {
    // Si no hay Supabase, simplemente retornar los datos
    if (!SUPABASE_URL || !SUPABASE_KEY) {
        return {
            ...datos,
            fecha_inicio: datos.activo ? new Date().toISOString() : null
        };
    }
    
    try {
        const ahora = new Date().toISOString();
        
        const payload = {
            activo: datos.activo,
            mensaje: datos.mensaje,
            fecha_inicio: datos.activo ? ahora : null,
            fecha_fin: datos.activo ? null : ahora,
            fecha_fin_estimada: datos.fecha_fin_estimada,
            actualizado_en: ahora
        };
        
        // Insertar nuevo registro de estado
        const response = await fetch(`${SUPABASE_URL}/rest/v1/mantenimiento_plataforma`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            const data = await response.json();
            return data[0] || payload;
        }
    } catch (error) {
        console.error('Error actualizando estado en Supabase:', error);
    }
    
    return {
        ...datos,
        fecha_inicio: datos.activo ? new Date().toISOString() : null
    };
}



