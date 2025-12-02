/**
 * 👑 API: Gestión de Tenants (Super Admin)
 * Endpoints para gestionar todos los tenants de Cresalia
 */

const { createClient } = require('@supabase/supabase-js');

function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

// Precios de planes
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
    
    try {
        const supabase = getSupabase();
        const { tenant_id, estado, plan } = req.query;
        const path = req.url.split('?')[0].replace('/api/admin-tenants', '');
        
        // GET /api/admin-tenants - Obtener todos los tenants
        if (req.method === 'GET' && (!path || path === '' || path === '/')) {
            const { data: tenants, error } = await supabase
                .from('tiendas')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            // Calcular métricas
            const stats = {
                total_tenants: tenants?.length || 0,
                active_tenants: tenants?.filter(t => t.estado === 'activo').length || 0,
                total_mrr: tenants?.reduce((sum, t) => sum + (PLAN_PRICES[t.plan] || 0), 0) || 0
            };
            
            // Agregar métricas a cada tenant
            const tenantsConMetricas = await Promise.all((tenants || []).map(async (tenant) => {
                // Contar productos
                const { count: productosCount } = await supabase
                    .from('productos')
                    .select('*', { count: 'exact', head: true })
                    .eq('tienda_id', tenant.id)
                    .catch(() => ({ count: 0 }));
                
                // Contar órdenes del mes actual
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
                    mrr: PLAN_PRICES[tenant.plan] || 0,
                    total_productos: productosCount || 0,
                    ordenes_mes: ordenesCount || 0
                };
            }));
            
            return res.status(200).json({
                success: true,
                tenants: tenantsConMetricas,
                stats
            });
        }
        
        // GET /api/admin-tenants?tenant_id=xxx - Obtener un tenant específico
        if (req.method === 'GET' && tenant_id && path === '') {
            const { data: tenant, error } = await supabase
                .from('tiendas')
                .select('*')
                .eq('id', tenant_id)
                .single();
            
            if (error) throw error;
            if (!tenant) {
                return res.status(404).json({
                    success: false,
                    error: 'Tenant no encontrado'
                });
            }
            
            return res.status(200).json({
                success: true,
                tenant
            });
        }
        
        // POST /api/admin-tenants?tenant_id=xxx - Cambiar estado o plan
        if (req.method === 'POST' && tenant_id) {
            const { estado: estadoBody, plan: planBody, motivo } = req.body;
            
            // Cambiar estado
            if (estadoBody) {
            
                if (!['activo', 'suspendido', 'cancelado'].includes(estadoBody)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Estado inválido. Debe ser: activo, suspendido o cancelado'
                    });
                }
                
                const { data, error } = await supabase
                    .from('tiendas')
                    .update({
                        estado: estadoBody,
                        motivo_suspension: motivo || null,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', tenant_id)
                    .select()
                    .single();
                
                if (error) throw error;
                
                return res.status(200).json({
                    success: true,
                    message: `Tenant ${estadoBody} exitosamente`,
                    tenant: data
                });
            }
            
            // Cambiar plan
            if (planBody) {
            
                if (!['free', 'basic', 'pro', 'enterprise'].includes(planBody)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Plan inválido'
                    });
                }
                
                const { data, error } = await supabase
                    .from('tiendas')
                    .update({
                        plan: planBody,
                        fecha_cambio_plan: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', tenant_id)
                    .select()
                    .single();
                
                if (error) throw error;
                
                return res.status(200).json({
                    success: true,
                    message: `Plan cambiado a ${planBody} exitosamente`,
                    tenant: data
                });
            }
            
            return res.status(400).json({
                success: false,
                error: 'Debes proporcionar "estado" o "plan" en el body'
            });
        }
        
        return res.status(405).json({
            success: false,
            error: 'Método no permitido'
        });
        
    } catch (error) {
        console.error('❌ Error en admin-tenants:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Error interno del servidor'
        });
    }
};