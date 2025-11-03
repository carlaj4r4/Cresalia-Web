// ===== CONFIGURACIÓN SEGURA DE SUPABASE =====
// Sistema de autenticación para múltiples tiendas CRESALIA
// IMPORTANTE: Este archivo NO debe contener claves reales

// Configuración segura usando variables de entorno
const SUPABASE_CONFIG = {
    // Las claves deben obtenerse de variables de entorno o un servidor seguro
    url: process.env.SUPABASE_URL || 'https://tu-proyecto.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'tu-clave-anonima-aqui',
    
    // Configuración de autenticación segura
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // Cambiado a false por seguridad
        flowType: 'pkce' // Usar PKCE para mayor seguridad
    }
};

// Función para validar configuración
function validarConfiguracion() {
    if (SUPABASE_CONFIG.url.includes('tu-proyecto') || 
        SUPABASE_CONFIG.anonKey.includes('tu-clave')) {
        console.error('🚨 CONFIGURACIÓN INSEGURA: Reemplaza las claves por las reales');
        return false;
    }
    return true;
}

// Inicializar cliente de Supabase de forma segura
let supabase = null;

function initSupabase() {
    if (!validarConfiguracion()) {
        throw new Error('Configuración de Supabase no válida');
    }
    
    if (typeof supabase === 'undefined' || !supabase) {
        console.log('🔐 Inicializando Supabase de forma segura...');
        
        if (typeof window.supabase !== 'undefined') {
            supabase = window.supabase.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey,
                { 
                    auth: SUPABASE_CONFIG.auth,
                    // Configuraciones de seguridad adicionales
                    global: {
                        headers: {
                            'X-Client-Info': 'cresalia-web'
                        }
                    }
                }
            );
            console.log('✅ Supabase inicializado de forma segura');
        } else {
            console.error('❌ Librería de Supabase no cargada');
        }
    }
    return supabase;
}

// Función para verificar sesión con validación adicional
async function verificarSesion() {
    try {
        const supabase = initSupabase();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Error verificando sesión:', error);
            return null;
        }
        
        // Validar que la sesión no esté expirada
        if (session && session.expires_at && session.expires_at < Date.now() / 1000) {
            console.log('Sesión expirada, cerrando...');
            await supabase.auth.signOut();
            return null;
        }
        
        return session;
    } catch (error) {
        console.error('Error en verificación de sesión:', error);
        return null;
    }
}

// Función para obtener usuario con validación
async function obtenerUsuarioActual() {
    try {
        const supabase = initSupabase();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
            console.error('Error obteniendo usuario:', error);
            return null;
        }
        
        // Validar que el usuario tenga los campos necesarios
        if (user && (!user.email || !user.id)) {
            console.error('Usuario inválido');
            return null;
        }
        
        return user;
    } catch (error) {
        console.error('Error obteniendo usuario:', error);
        return null;
    }
}

// Función para obtener datos de tienda con RLS (Row Level Security)
async function obtenerDatosTienda(userId) {
    try {
        const supabase = initSupabase();
        
        // Verificar que el userId sea válido
        if (!userId || typeof userId !== 'string') {
            throw new Error('ID de usuario inválido');
        }
        
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
    } catch (error) {
        console.error('Error obteniendo datos de tienda:', error);
        return null;
    }
}

// Función para cerrar sesión de forma segura
async function cerrarSesionSegura() {
    try {
        const supabase = initSupabase();
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Error cerrando sesión:', error);
        } else {
            console.log('✅ Sesión cerrada de forma segura');
        }
        
        // Limpiar datos locales
        localStorage.removeItem('cresalia_sesion_activa');
        localStorage.removeItem('cresalia_session_token');
        localStorage.removeItem('cresalia_user_data');
        
    } catch (error) {
        console.error('Error cerrando sesión:', error);
    }
}

// Hacer las funciones disponibles globalmente
window.initSupabase = initSupabase;
window.verificarSesion = verificarSesion;
window.obtenerUsuarioActual = obtenerUsuarioActual;
window.obtenerDatosTienda = obtenerDatosTienda;
window.cerrarSesionSegura = cerrarSesionSegura;

// Exportar para Node.js si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_CONFIG,
        initSupabase,
        verificarSesion,
        obtenerUsuarioActual,
        obtenerDatosTienda,
        cerrarSesionSegura
    };
}





