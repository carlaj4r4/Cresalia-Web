// ===== API: Calificaciones de Empleadores - Cresalia Jobs =====
// Gestiona calificaciones de empleadores por parte de empleados

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        if (req.method === 'POST') {
            const { accion } = req.body;
            
            if (accion === 'crear') {
                return await crearCalificacion(req, res);
            } else {
                return res.status(400).json({
                    success: false,
                    error: 'Acción no válida. Usa: crear'
                });
            }
        }
        
        if (req.method === 'GET') {
            return await obtenerCalificaciones(req, res);
        }
        
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
        
    } catch (error) {
        console.error('❌ Error en jobs-calificaciones.js:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// ===== CREAR CALIFICACIÓN =====
async function crearCalificacion(req, res) {
    try {
        const {
            empleador_id,
            oferta_id,
            calificacion,
            puntualidad_pago,
            trato_respetuoso,
            condiciones_trabajo,
            comunicacion,
            comentario,
            es_anonimo
        } = req.body;
        
        // Validaciones básicas
        if (!empleador_id || !oferta_id || !calificacion) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos: empleador_id, oferta_id, calificacion'
            });
        }
        
        if (calificacion < 1 || calificacion > 5) {
            return res.status(400).json({
                success: false,
                error: 'La calificación debe estar entre 1 y 5 estrellas'
            });
        }
        
        // Insertar en Supabase
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        
        const { data, error } = await supabase
            .from('jobs_calificaciones_empleadores')
            .insert({
                empleador_id,
                oferta_id,
                calificacion,
                puntualidad_pago: puntualidad_pago || null,
                trato_respetuoso: trato_respetuoso || null,
                condiciones_trabajo: condiciones_trabajo || null,
                comunicacion: comunicacion || null,
                comentario: comentario || null,
                es_anonimo: es_anonimo || false,
                activo: true
            })
            .select()
            .single();
        
        if (error) {
            console.error('Error insertando calificación:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al guardar la calificación',
                details: error.message
            });
        }
        
        // Actualizar estadísticas del empleador (opcional, puede hacerse con trigger)
        // Por ahora solo retornamos éxito
        
        return res.status(200).json({
            success: true,
            data: data,
            message: 'Calificación enviada correctamente'
        });
        
    } catch (error) {
        console.error('Error en crearCalificacion:', error);
        return res.status(500).json({
            success: false,
            error: 'Error al crear la calificación',
            details: error.message
        });
    }
}

// ===== OBTENER CALIFICACIONES =====
async function obtenerCalificaciones(req, res) {
    try {
        const { empleador_id, oferta_id, activo = true } = req.query;
        
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        
        let query = supabase
            .from('jobs_calificaciones_empleadores')
            .select('*');
        
        if (empleador_id) {
            query = query.eq('empleador_id', empleador_id);
        }
        
        if (oferta_id) {
            query = query.eq('oferta_id', oferta_id);
        }
        
        if (activo === 'true' || activo === true) {
            query = query.eq('activo', true);
        }
        
        query = query.order('fecha_creacion', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) {
            console.error('Error obteniendo calificaciones:', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener las calificaciones',
                details: error.message
            });
        }
        
        return res.status(200).json({
            success: true,
            data: data || []
        });
        
    } catch (error) {
        console.error('Error en obtenerCalificaciones:', error);
        return res.status(500).json({
            success: false,
            error: 'Error al obtener las calificaciones',
            details: error.message
        });
    }
}


