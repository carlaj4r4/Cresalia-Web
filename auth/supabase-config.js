// ===== CONFIGURACIÓN DE SUPABASE =====
// Sistema de autenticación para múltiples tiendas CRESALIA

// CONFIGURACIÓN SEGURA - NO EXPONER CLAVES REALES
const SUPABASE_CONFIG = {
    // 🔗 URL de tu proyecto (se puede inyectar vía env en Vercel)
    url: (typeof window !== 'undefined' && window.__SUPABASE_URL__) ||
         (typeof process !== 'undefined' && process.env && process.env.SUPABASE_URL) ||
         'https://lvdgklwcgrmfbqwghxhl.supabase.co',
    
    // 🔑 Clave anónima (pública). Se espera que venga de env; este valor es placeholder.
    anonKey: (typeof window !== 'undefined' && window.__SUPABASE_ANON_KEY__) ||
             (typeof process !== 'undefined' && process.env && process.env.SUPABASE_ANON_KEY) ||
             'REEMPLAZAR_CON_SUPABASE_ANON_KEY',
    
    // Configuración de autenticación
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
};

// Inicializar cliente de Supabase (usamos nombre distinto para no chocar con el SDK global)
let supabaseClient = null;

// Función para inicializar Supabase (con espera si es necesario)
function initSupabase() {
    if (typeof supabaseClient === 'undefined' || !supabaseClient) {
        console.log('🔐 Inicializando Supabase...');
        
        // Esperar a que la librería esté disponible (hasta 5 segundos)
        let attempts = 0;
        const maxAttempts = 50; // 50 intentos x 100ms = 5 segundos
        
        const tryInit = () => {
            if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
                try {
                    supabaseClient = window.supabase.createClient(
                        SUPABASE_CONFIG.url,
                        SUPABASE_CONFIG.anonKey,
                        { auth: SUPABASE_CONFIG.auth }
                    );
                    
                    // Validar que el cliente se creó correctamente
                    if (!supabaseClient || typeof supabaseClient.from !== 'function') {
                        throw new Error('El cliente de Supabase no se creó correctamente');
                    }
                    
                    console.log('✅ Supabase inicializado correctamente');
                    console.log('🔍 Cliente validado - método from disponible:', typeof supabaseClient.from);
                    
                    if (typeof window !== 'undefined') {
                        window.SUPABASE_CLIENT = supabaseClient;
                        window.SUPABASE_CONFIG = SUPABASE_CONFIG;
                    }
                    return supabaseClient;
                } catch (error) {
                    console.error('❌ Error creando cliente de Supabase:', error);
                    attempts++;
                    if (attempts < maxAttempts) {
                        console.log(`⏳ Reintentando inicialización... (intento ${attempts}/${maxAttempts})`);
                        setTimeout(tryInit, 100);
                        return null;
                    }
                    return null;
                }
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    console.log(`⏳ Esperando SDK de Supabase... (intento ${attempts}/${maxAttempts})`);
                    setTimeout(tryInit, 100);
                    return null;
                } else {
                    console.error('❌ Librería de Supabase no se cargó después de 5 segundos');
                    console.error('💡 Verifica que el script de Supabase esté cargado antes de este archivo');
                    console.error('💡 URL esperada del SDK: https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
                    return null;
                }
            }
        };
        
        return tryInit();
    }
    
    if (typeof window !== 'undefined' && supabaseClient) {
        window.SUPABASE_CLIENT = supabaseClient;
        window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    }
    return supabaseClient;
}

// Inicializar automáticamente cuando el DOM esté listo
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => initSupabase(), 100);
        });
    } else {
        setTimeout(() => initSupabase(), 100);
    }
}

// Hacer la función disponible globalmente
window.initSupabase = initSupabase;

// Función para verificar si el usuario está autenticado
async function verificarSesion() {
    const client = initSupabase();
    const { data: { session }, error } = await client.auth.getSession();
    
    if (error) {
        console.error('Error verificando sesión:', error);
        return null;
    }
    
    return session;
}

// Función para obtener datos del usuario actual
async function obtenerUsuarioActual() {
    const client = initSupabase();
    const { data: { user }, error } = await client.auth.getUser();
    
    if (error) {
        console.error('Error obteniendo usuario:', error);
        return null;
    }
    
    return user;
}

// Función para obtener datos de la tienda del usuario
async function obtenerDatosTienda(userId) {
    const client = initSupabase();
    
    const { data, error } = await client
        .from('tiendas')
        .select('*')
        .eq('user_id', userId)
        .single();
    
    if (error) {
        console.error('Error obteniendo datos de tienda:', error);
        return null;
    }
    
    return data;
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_CONFIG,
        initSupabase,
        verificarSesion,
        obtenerUsuarioActual,
        obtenerDatosTienda
    };
}

