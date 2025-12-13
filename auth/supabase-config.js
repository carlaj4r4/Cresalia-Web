// ===== CONFIGURACIÓN DE SUPABASE =====
// Sistema de autenticación para múltiples tiendas CRESALIA

// CONFIGURACIÓN SEGURA - NO EXPONER CLAVES REALES
const SUPABASE_CONFIG = {
    // 🔗 URL de tu proyecto (desde Supabase Dashboard → Settings → API)
    url: 'https://zbomxayytvwjbdzbegcw.supabase.co',
    
    // 🔑 Clave anónima (pública) - Usa la misma que config-supabase-seguro.js
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpib214YXl5dHZ3amJkemJlZ2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwODczMDMsImV4cCI6MjA3NzY2MzMwM30.ZYpckr8rPaN1vAemdjHxPSe6QvF6R1Ylic6JoNKnsBA',
    
    // Configuración de autenticación
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
};

// Inicializar cliente de Supabase
let supabase = null;

// Función para inicializar Supabase (con espera si es necesario)
function initSupabase() {
    if (typeof supabase === 'undefined' || !supabase) {
        console.log('🔐 Inicializando Supabase...');
        
        // Esperar a que la librería esté disponible (hasta 5 segundos)
        let attempts = 0;
        const maxAttempts = 50; // 50 intentos x 100ms = 5 segundos
        
        const tryInit = () => {
            if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
                try {
                    supabase = window.supabase.createClient(
                        SUPABASE_CONFIG.url,
                        SUPABASE_CONFIG.anonKey,
                        { auth: SUPABASE_CONFIG.auth }
                    );
                    
                    // Validar que el cliente se creó correctamente
                    if (!supabase || typeof supabase.from !== 'function') {
                        throw new Error('El cliente de Supabase no se creó correctamente');
                    }
                    
                    // Intentar refrescar el schema haciendo una consulta simple
                    // Esto ayuda a que Supabase sincronice el schema cache
                    try {
                        // Hacer una consulta simple para refrescar el schema
                        await supabase.from('compradores').select('id').limit(0).single();
                    } catch (schemaError) {
                        // Ignorar errores - solo estamos refrescando el cache
                        console.log('ℹ️ Schema cache se refrescará cuando sea necesario');
                    }
                    
                    console.log('✅ Supabase inicializado correctamente');
                    console.log('🔍 Cliente validado - método from disponible:', typeof supabase.from);
                    
                    if (typeof window !== 'undefined') {
                        window.SUPABASE_CLIENT = supabase;
                        window.SUPABASE_CONFIG = SUPABASE_CONFIG;
                    }
                    return supabase;
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
    
    if (typeof window !== 'undefined' && supabase) {
        window.SUPABASE_CLIENT = supabase;
        window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    }
    return supabase;
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
    const supabase = initSupabase();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
        console.error('Error verificando sesión:', error);
        return null;
    }
    
    return session;
}

// Función para obtener datos del usuario actual
async function obtenerUsuarioActual() {
    const supabase = initSupabase();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
        console.error('Error obteniendo usuario:', error);
        return null;
    }
    
    return user;
}

// Función para obtener datos de la tienda del usuario
async function obtenerDatosTienda(userId) {
    const supabase = initSupabase();
    
    const { data, error } = await supabase
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

