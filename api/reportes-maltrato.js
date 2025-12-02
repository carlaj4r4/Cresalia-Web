// ===== API: Reportes de Maltrato Animal =====
// Endpoint para gestionar reportes de maltrato animal

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
            // Crear nuevo reporte
            const reporte = req.body;
            
            // Validación básica
            if (!reporte.tipo_maltrato || !reporte.tipo_animal || !reporte.descripcion) {
                return res.status(400).json({
                    success: false,
                    error: 'Faltan campos requeridos: tipo_maltrato, tipo_animal, descripcion'
                });
            }
            
            // Guardar en Supabase
            const response = await fetch(`${SUPABASE_URL}/rest/v1/reportes_maltrato_animal`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    tipo_maltrato: reporte.tipo_maltrato,
                    tipo_animal: reporte.tipo_animal,
                    ciudad: reporte.ciudad,
                    provincia: reporte.provincia,
                    direccion: reporte.direccion || null,
                    descripcion: reporte.descripcion,
                    urgencia: reporte.urgencia || 'media',
                    fotos: reporte.fotos || [],
                    anonimo: reporte.anonimo !== false,
                    email: reporte.anonimo ? null : (reporte.email || null),
                    telefono: reporte.anonimo ? null : (reporte.telefono || null),
                    reportado_por_hash: reporte.reportado_por_hash || null,
                    estado: 'pendiente'
                })
            });
            
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Error en Supabase: ${error}`);
            }
            
            const data = await response.json();
            
            return res.status(200).json({
                success: true,
                message: 'Reporte enviado correctamente',
                reporte: data[0] || data
            });
        }
        
        if (req.method === 'GET') {
            // Obtener reportes (solo para moderadores)
            const { estado, urgencia, provincia } = req.query;
            
            let url = `${SUPABASE_URL}/rest/v1/reportes_maltrato_animal?order=fecha_reporte.desc`;
            
            if (estado) {
                url += `&estado=eq.${estado}`;
            }
            if (urgencia) {
                url += `&urgencia=eq.${urgencia}`;
            }
            if (provincia) {
                url += `&provincia=eq.${provincia}`;
            }
            
            const response = await fetch(url, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Error obteniendo reportes');
            }
            
            const data = await response.json();
            
            return res.status(200).json({
                success: true,
                reportes: data
            });
        }
        
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
        
    } catch (error) {
        console.error('❌ Error en reportes-maltrato.js:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            details: error.message
        });
    }
};



