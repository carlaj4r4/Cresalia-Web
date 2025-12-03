// ==================== FUNCIÓN CONSOLIDADA: JOBS ====================
// Reemplaza: jobs-calificaciones.js, jobs-calificaciones-empleados.js, jobs-verificacion-pago.js

const { createClient } = require('@supabase/supabase-js');

let supabaseClient = null;

function getSupabase() {
    if (supabaseClient) return supabaseClient;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
        throw new Error('Supabase no configurado');
    }
    supabaseClient = createClient(url, key);
    return supabaseClient;
}

function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async (req, res) => {
    applyCors(res);

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const supabase = getSupabase();
        const action = (req.query.action || req.body?.accion || 'calificaciones').toLowerCase();

        switch (action) {
            case 'calificaciones':
            case 'calificaciones-empleadores':
                return await handleCalificacionesEmpleadores(supabase, req, res);
            case 'calificaciones-empleados':
                return await handleCalificacionesEmpleados(supabase, req, res);
            case 'verificacion-pago':
                return await handleVerificacionPago(supabase, req, res);
            default:
                res.status(400).json({ success: false, error: `Acción "${action}" no válida. Use: calificaciones, calificaciones-empleados, verificacion-pago` });
        }
    } catch (error) {
        console.error('❌ Error en API jobs:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// ==================== CALIFICACIONES EMPLEADORES ====================
async function handleCalificacionesEmpleadores(supabase, req, res) {
    if (req.method === 'GET') {
        const { empleador_id, oferta_id } = req.query;
        let query = supabase.from('jobs_calificaciones_empleadores').select('*');
        
        if (empleador_id) query = query.eq('empleador_id', empleador_id);
        if (oferta_id) query = query.eq('oferta_id', oferta_id);
        
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json({ success: true, data: data || [] });
    }

    if (req.method === 'POST') {
        const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const { empleador_id, oferta_id, calificacion, puntualidad_pago, trato_respetuoso, condiciones_trabajo, comunicacion, comentario, es_anonimo } = cuerpo;

        if (!empleador_id || !oferta_id || !calificacion) {
            return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
        }

        const { data, error } = await supabase
            .from('jobs_calificaciones_empleadores')
            .insert({
                empleador_id, oferta_id, calificacion,
                puntualidad_pago, trato_respetuoso, condiciones_trabajo, comunicacion,
                comentario, es_anonimo: es_anonimo !== false
            })
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json({ success: true, data });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
}

// ==================== CALIFICACIONES EMPLEADOS ====================
async function handleCalificacionesEmpleados(supabase, req, res) {
    if (req.method === 'GET') {
        const { empleado_id, oferta_id } = req.query;
        let query = supabase.from('jobs_calificaciones_empleados').select('*');
        
        if (empleado_id) query = query.eq('empleado_id', empleado_id);
        if (oferta_id) query = query.eq('oferta_id', oferta_id);
        
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json({ success: true, data: data || [] });
    }

    if (req.method === 'POST') {
        const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const { empleado_id, oferta_id, empleador_id, calificacion, calidad_trabajo, puntualidad, responsabilidad, comunicacion, comentario, es_anonimo } = cuerpo;

        if (!empleado_id || !oferta_id || !calificacion) {
            return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
        }

        const { data, error } = await supabase
            .from('jobs_calificaciones_empleados')
            .insert({
                empleado_id, oferta_id, empleador_id, calificacion,
                calidad_trabajo, puntualidad, responsabilidad, comunicacion,
                comentario, es_anonimo: es_anonimo !== false
            })
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json({ success: true, data });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
}

// ==================== VERIFICACIÓN PAGO ====================
async function handleVerificacionPago(supabase, req, res) {
    if (req.method === 'GET') {
        const { oferta_id, empleador_id } = req.query;
        let query = supabase.from('jobs_verificaciones_pago').select('*');
        
        if (oferta_id) query = query.eq('oferta_id', oferta_id);
        if (empleador_id) query = query.eq('empleador_id', empleador_id);
        
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        return res.status(200).json({ success: true, data: data || [] });
    }

    if (req.method === 'POST') {
        const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const { oferta_id, empleador_id, empleado_id, fue_pagado, monto_pactado, monto_recibido, fecha_pago_esperada, fecha_pago_real, evidencias, descripcion } = cuerpo;

        if (!oferta_id || !empleador_id || fue_pagado === undefined) {
            return res.status(400).json({ success: false, error: 'Faltan campos requeridos' });
        }

        const { data, error } = await supabase
            .from('jobs_verificaciones_pago')
            .insert({
                oferta_id, empleador_id, empleado_id,
                fue_pagado, monto_pactado, monto_recibido,
                fecha_pago_esperada, fecha_pago_real, evidencias, descripcion
            })
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json({ success: true, data });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
}

