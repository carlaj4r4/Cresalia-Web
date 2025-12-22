// ==================== FUNCIÓN CONSOLIDADA: ADMIN ====================
// Reemplaza: admin-tenants.js, admin-reportes.js

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const PLAN_PRICES = {
    free: 0,
    basic: 29,
    pro: 79,
    enterprise: 199
};

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'cresalia25@gmail.com';

module.exports = async (req, res) => {
    applyCors(res);

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const supabase = getSupabase();
        // Detectar acción desde URL o query param
        let action = req.query.action;
        if (!action && req.url) {
            if (req.url.includes('/admin-reportes')) action = 'reportes';
            else if (req.url.includes('/admin-tenants')) action = 'tenants';
            else if (req.url.includes('/reportes-maltrato') || req.url.includes('/api/reportes') && req.query?.type === 'maltrato') action = 'maltrato';
            else if (req.url.includes('/alertas-servicios-enviar') || req.url.includes('/api/reportes') && req.query?.type === 'alertas') action = 'alertas';
            else if (req.url.includes('/emergencias-enviar-emails') || req.url.includes('/api/reportes') && req.query?.type === 'emergencias') action = 'emergencias';
        }
        action = (action || 'tenants').toLowerCase();

        switch (action) {
            case 'tenants':
                return await handleTenants(supabase, req, res);
            case 'reportes':
                return await handleReportes(supabase, req, res);
            case 'maltrato':
            case 'alertas':
            case 'emergencias':
                return await handleReportesEspeciales(supabase, req, res, action);
            default:
                res.status(400).json({ success: false, error: `Acción "${action}" no válida. Use: tenants, reportes, maltrato, alertas, emergencias` });
        }
    } catch (error) {
        console.error('❌ Error en API admin:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};

// ==================== TENANTS ====================
async function handleTenants(supabase, req, res) {
    if (req.method === 'GET') {
        const { tenant_id, estado, plan } = req.query;
        let query = supabase.from('tiendas').select('*');
        
        if (tenant_id) query = query.eq('id', tenant_id);
        if (estado) query = query.eq('estado', estado);
        if (plan) query = query.eq('plan', plan);
        
        const { data: tenants, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;

        const stats = {
            total_tenants: tenants?.length || 0,
            active_tenants: tenants?.filter(t => t.estado === 'activo').length || 0,
            total_mrr: tenants?.reduce((sum, t) => sum + (PLAN_PRICES[t.plan] || 0), 0) || 0
        };

        const tenantsConMetricas = await Promise.all((tenants || []).map(async (tenant) => {
            const { count: productosCount } = await supabase
                .from('productos')
                .select('*', { count: 'exact', head: true })
                .eq('tienda_id', tenant.id)
                .catch(() => ({ count: 0 }));

            const inicioMes = new Date();
            inicioMes.setDate(1);
            inicioMes.setHours(0, 0, 0, 0);

            const { count: ordenesCount } = await supabase
                .from('ordenes')
                .select('*', { count: 'exact', head: true })
                .eq('tienda_id', tenant.id)
                .gte('created_at', inicioMes.toISOString())
                .catch(() => ({ count: 0 }));

            return {
                ...tenant,
                metricas: {
                    productos: productosCount || 0,
                    ordenes_mes: ordenesCount || 0
                }
            };
        }));

        return res.status(200).json({ success: true, stats, tenants: tenantsConMetricas });
    }

    if (req.method === 'PUT') {
        const cuerpo = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const { tenant_id, estado, plan } = cuerpo;

        if (!tenant_id) {
            return res.status(400).json({ success: false, error: 'tenant_id requerido' });
        }

        const updateData = {};
        if (estado) updateData.estado = estado;
        if (plan) updateData.plan = plan;

        const { data, error } = await supabase
            .from('tiendas')
            .update(updateData)
            .eq('id', tenant_id)
            .select()
            .single();

        if (error) throw error;
        return res.status(200).json({ success: true, data });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
}

// ==================== REPORTES ====================
async function handleReportes(supabase, req, res) {
    if (req.method === 'GET') {
        const { tipo, fecha_inicio, fecha_fin } = req.query;

        if (tipo === 'ventas') {
            const inicio = fecha_inicio || new Date(new Date().getFullYear(), 0, 1).toISOString();
            const fin = fecha_fin || new Date().toISOString();

            const { data: ordenes, error } = await supabase
                .from('ordenes')
                .select('*, orden_items(*)')
                .gte('created_at', inicio)
                .lte('created_at', fin)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const totalVentas = (ordenes || []).reduce((sum, orden) => {
                const items = orden.orden_items || [];
                return sum + items.reduce((itemSum, item) => itemSum + (item.precio * item.cantidad), 0);
            }, 0);

            return res.status(200).json({
                success: true,
                total_ventas: totalVentas,
                total_ordenes: ordenes?.length || 0,
                ordenes: ordenes || []
            });
        }

        if (tipo === 'tenants') {
            const { data: tenants, error } = await supabase
                .from('tiendas')
                .select('id, nombre_tienda, estado, plan, created_at')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const porPlan = {};
            (tenants || []).forEach(tenant => {
                const plan = tenant.plan || 'free';
                porPlan[plan] = (porPlan[plan] || 0) + 1;
            });

            return res.status(200).json({
                success: true,
                total: tenants?.length || 0,
                por_plan: porPlan,
                tenants: tenants || []
            });
        }

        if (tipo === 'soporte') {
            const { data: tickets, error } = await supabase
                .from('tickets_soporte')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;

            const porEstado = {};
            (tickets || []).forEach(ticket => {
                const estado = ticket.estado || 'pendiente';
                porEstado[estado] = (porEstado[estado] || 0) + 1;
            });

            return res.status(200).json({
                success: true,
                total: tickets?.length || 0,
                por_estado: porEstado,
                tickets: tickets || []
            });
        }

        return res.status(400).json({ success: false, error: `Tipo "${tipo}" no válido. Use: ventas, tenants, soporte` });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
}

