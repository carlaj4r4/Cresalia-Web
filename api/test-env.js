// ===== API: TEST DE VARIABLES DE ENTORNO =====
// Endpoint temporal para verificar que las variables estén configuradas correctamente
// ⚠️ ELIMINAR ESTE ARCHIVO DESPUÉS DE DEBUGGEAR (por seguridad)

module.exports = async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Solo GET permitido' });
    }
    
    try {
        // Verificar variables de Supabase
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
        
        // Verificar variables de MercadoPago
        const mercadoPagoToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
        const mercadoPagoPublicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
        
        // Respuesta (sin mostrar valores completos por seguridad)
        const response = {
            timestamp: new Date().toISOString(),
            supabase: {
                url: {
                    exists: !!supabaseUrl,
                    length: supabaseUrl ? supabaseUrl.length : 0,
                    preview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : null,
                    hasSpaces: supabaseUrl ? (supabaseUrl.trim() !== supabaseUrl) : false
                },
                serviceRoleKey: {
                    exists: !!supabaseServiceKey,
                    length: supabaseServiceKey ? supabaseServiceKey.length : 0,
                    preview: supabaseServiceKey ? `${supabaseServiceKey.substring(0, 10)}...` : null,
                    lastChars: supabaseServiceKey ? `...${supabaseServiceKey.substring(supabaseServiceKey.length - 10)}` : null,
                    hasSpaces: supabaseServiceKey ? (supabaseServiceKey.trim() !== supabaseServiceKey) : false
                },
                anonKey: {
                    exists: !!supabaseAnonKey,
                    length: supabaseAnonKey ? supabaseAnonKey.length : 0,
                    preview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : null,
                    lastChars: supabaseAnonKey ? `...${supabaseAnonKey.substring(supabaseAnonKey.length - 10)}` : null,
                    hasSpaces: supabaseAnonKey ? (supabaseAnonKey.trim() !== supabaseAnonKey) : false
                }
            },
            mercadoPago: {
                accessToken: {
                    exists: !!mercadoPagoToken,
                    length: mercadoPagoToken ? mercadoPagoToken.length : 0,
                    preview: mercadoPagoToken ? `${mercadoPagoToken.substring(0, 10)}...` : null,
                    hasSpaces: mercadoPagoToken ? (mercadoPagoToken.trim() !== mercadoPagoToken) : false
                },
                publicKey: {
                    exists: !!mercadoPagoPublicKey,
                    length: mercadoPagoPublicKey ? mercadoPagoPublicKey.length : 0,
                    preview: mercadoPagoPublicKey ? `${mercadoPagoPublicKey.substring(0, 10)}...` : null,
                    hasSpaces: mercadoPagoPublicKey ? (mercadoPagoPublicKey.trim() !== mercadoPagoPublicKey) : false
                }
            },
            recommendations: []
        };
        
        // Agregar recomendaciones
        if (!supabaseUrl) {
            response.recommendations.push('❌ Agregá SUPABASE_URL en Vercel');
        }
        if (!supabaseServiceKey && !supabaseAnonKey) {
            response.recommendations.push('❌ Agregá SUPABASE_SERVICE_ROLE_KEY o SUPABASE_ANON_KEY en Vercel');
        }
        if (supabaseServiceKey && supabaseServiceKey.trim() !== supabaseServiceKey) {
            response.recommendations.push('⚠️ SUPABASE_SERVICE_ROLE_KEY tiene espacios extra (recortá los espacios)');
        }
        if (supabaseAnonKey && supabaseAnonKey.trim() !== supabaseAnonKey) {
            response.recommendations.push('⚠️ SUPABASE_ANON_KEY tiene espacios extra (recortá los espacios)');
        }
        if (supabaseUrl && supabaseUrl.trim() !== supabaseUrl) {
            response.recommendations.push('⚠️ SUPABASE_URL tiene espacios extra (recortá los espacios)');
        }
        if (!mercadoPagoToken) {
            response.recommendations.push('⚠️ Agregá MERCADOPAGO_ACCESS_TOKEN en Vercel (opcional)');
        }
        if (!mercadoPagoPublicKey) {
            response.recommendations.push('⚠️ Agregá NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY en Vercel (opcional)');
        }
        
        if (response.recommendations.length === 0) {
            response.recommendations.push('✅ Todas las variables están configuradas correctamente');
        }
        
        return res.status(200).json(response);
        
    } catch (error) {
        console.error('Error en test-env:', error);
        return res.status(500).json({ 
            error: error.message || 'Error interno',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
