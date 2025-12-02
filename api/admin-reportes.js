/**
 * 📊 API: Reportes Consolidados (Super Admin)
 * Endpoints para generar reportes consolidados de Cresalia
 */

const { createClient } = require('@supabase/supabase-js');

function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getSupabase() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!url || !key) {
        throw new Error('Supabase no configurado');
    }
    
    return createClient(url, key);
}

const PLAN_PRICES = {
    free: 0,
    basic: 29,
    pro: 79,
    enterprise: 199
};

module.exports = async (req, res) => {
    applyCors(res);
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Método no permitido. Solo GET.'
        });
    }
    
    try {
        const supabase = getSupabase();
        const { tipo, mes, año } = req.query;
        
        const mesActual = mes ? parseInt(mes) : new Date().getMonth() + 1;
        const añoActual = año ? parseInt(año) : new Date().getFullYear();
        
        // Reporte de Ingresos
        if (tipo === 'ingresos') {
            const { data: tenants } = await supabase
                .from('tiendas')
                .select('plan, estado, created_at');
            
            const mrrTotal = tenants?.reduce((sum, t) => {
                if (t.estado === 'activo') {
                    return sum + (PLAN_PRICES[t.plan] || 0);
                }
                return sum;
            }, 0) || 0;
            
            // Ingresos por plan
            const ingresosPorPlan = {};
            tenants?.forEach(t => {
                if (t.estado === 'activo') {
                    const precio = PLAN_PRICES[t.plan] || 0;
                    ingresosPorPlan[t.plan] = (ingresosPorPlan[t.plan] || 0) + precio;
                }
            });
            
            // Crecimiento mensual (últimos 6 meses)
            const crecimiento = [];
            for (let i = 5; i >= 0; i--) {
                const fecha = new Date(añoActual, mesActual - i - 1, 1);
                const inicioMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
                const finMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
                
                const { data: tenantsMes } = await supabase
                    .from('tiendas')
                    .select('plan, estado')
                    .lte('created_at', finMes.toISOString())
                    .eq('estado', 'activo');
                
                const mrrMes = tenantsMes?.reduce((sum, t) => sum + (PLAN_PRICES[t.plan] || 0), 0) || 0;
                
                crecimiento.push({
                    mes: fecha.toLocaleString('es-AR', { month: 'long', year: 'numeric' }),
                    mrr: mrrMes
                });
            }
            
            return res.status(200).json({
                success: true,
                reporte: {
                    tipo: 'ingresos',
                    mrr_total: mrrTotal,
                    ingresos_por_plan: ingresosPorPlan,
                    crecimiento_mensual: crecimiento,
                    proyeccion_anual: mrrTotal * 12
                }
            });
        }
        
        // Reporte de Tenants
        if (tipo === 'tenants') {
            const inicioMes = new Date(añoActual, mesActual - 1, 1);
            const finMes = new Date(añoActual, mesActual, 0);
            
            // Nuevos tenants este mes
            const { count: nuevosTenants } = await supabase
                .from('tiendas')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', inicioMes.toISOString())
                .lte('created_at', finMes.toISOString());
            
            // Tenants cancelados
            const { count: cancelados } = await supabase
                .from('tiendas')
                .select('*', { count: 'exact', head: true })
                .eq('estado', 'cancelado')
                .gte('updated_at', inicioMes.toISOString());
            
            // Conversión de planes
            const { data: todosTenants } = await supabase
                .from('tiendas')
                .select('plan, estado');
            
            const distribucionPlanes = {};
            todosTenants?.forEach(t => {
                if (t.estado === 'activo') {
                    distribucionPlanes[t.plan] = (distribucionPlanes[t.plan] || 0) + 1;
                }
            });
            
            // Retención (tenants activos más de 3 meses)
            const tresMesesAtras = new Date();
            tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);
            
            const { count: retencion } = await supabase
                .from('tiendas')
                .select('*', { count: 'exact', head: true })
                .eq('estado', 'activo')
                .lte('created_at', tresMesesAtras.toISOString());
            
            return res.status(200).json({
                success: true,
                reporte: {
                    tipo: 'tenants',
                    nuevos_este_mes: nuevosTenants || 0,
                    cancelados_este_mes: cancelados || 0,
                    distribucion_planes: distribucionPlanes,
                    retencion_3_meses: retencion || 0
                }
            });
        }
        
        // Reporte de Actividad
        if (tipo === 'actividad') {
            // Tenants más activos (por número de productos)
            const { data: productos } = await supabase
                .from('productos')
                .select('tienda_id, tiendas(nombre_empresa)');
            
            const actividadPorTenant = {};
            productos?.forEach(p => {
                const tenantId = p.tienda_id;
                actividadPorTenant[tenantId] = (actividadPorTenant[tenantId] || 0) + 1;
            });
            
            const topTenants = Object.entries(actividadPorTenant)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([tenantId, count]) => ({
                    tenant_id: tenantId,
                    total_productos: count
                }));
            
            // Productos más vendidos (si hay tabla de ventas)
            // Por ahora retornamos estructura básica
            
            return res.status(200).json({
                success: true,
                reporte: {
                    tipo: 'actividad',
                    top_tenants_activos: topTenants,
                    total_productos: productos?.length || 0
                }
            });
        }
        
        // Reporte de Soporte
        if (tipo === 'soporte') {
            const inicioMes = new Date(añoActual, mesActual - 1, 1);
            const finMes = new Date(añoActual, mesActual, 0);
            
            // Tickets abiertos
            const { count: ticketsAbiertos } = await supabase
                .from('tickets_soporte')
                .select('*', { count: 'exact', head: true })
                .eq('estado', 'abierto')
                .catch(() => ({ count: 0 }));
            
            // Tickets del mes
            const { count: ticketsMes } = await supabase
                .from('tickets_soporte')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', inicioMes.toISOString())
                .lte('created_at', finMes.toISOString())
                .catch(() => ({ count: 0 }));
            
            return res.status(200).json({
                success: true,
                reporte: {
                    tipo: 'soporte',
                    tickets_abiertos: ticketsAbiertos || 0,
                    tickets_este_mes: ticketsMes || 0
                }
            });
        }
        
        // Reporte General (todos los reportes)
        if (!tipo || tipo === 'general') {
            // Combinar todos los reportes
            // Por ahora retornamos estructura básica
            return res.status(200).json({
                success: true,
                reporte: {
                    tipo: 'general',
                    mensaje: 'Usa ?tipo=ingresos, ?tipo=tenants, ?tipo=actividad o ?tipo=soporte para reportes específicos'
                }
            });
        }
        
        return res.status(400).json({
            success: false,
            error: 'Tipo de reporte inválido. Usa: ingresos, tenants, actividad, soporte'
        });
        
    } catch (error) {
        console.error('❌ Error en admin-reportes:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Error interno del servidor'
        });
    }
};


