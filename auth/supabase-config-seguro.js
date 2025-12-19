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
        
        if (!supabase || typeof supabase.from !== 'function') {
            console.error('❌ Supabase no está inicializado correctamente');
            return null;
        }
        
        // Verificar que el userId sea válido
        if (!userId || typeof userId !== 'string') {
            throw new Error('ID de usuario inválido');
        }
        
        // Intentar obtener la tienda
        const { data, error } = await supabase
            .from('tiendas')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        // Si no hay error, retornar los datos
        if (!error && data) {
            return data;
        }
        
        // Si no existe la tienda, intentar crearla usando los datos del usuario
        if (error && (error.code === 'PGRST116' || error.message?.includes('No rows returned'))) {
            console.log('⚠️ Tienda no encontrada, intentando crear desde metadata del usuario...');
            
            // Obtener datos del usuario
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError || !user) {
                console.error('❌ Error obteniendo usuario:', userError);
                return null;
            }
            
            // Verificar si el usuario tiene metadata de tienda
            const nombreTienda = user.user_metadata?.nombre_tienda || user.user_metadata?.nombre_tienda;
            const plan = user.user_metadata?.plan || 'basico';
            const tipoUsuario = user.user_metadata?.tipo_usuario;
            
            // Solo crear si es vendedor o tiene nombre_tienda
            if (tipoUsuario === 'vendedor' || tipoUsuario === 'emprendedor' || nombreTienda) {
                console.log('📝 Creando tienda desde metadata del usuario...');
                
                const subdomain = (nombreTienda || 'mi-tienda')
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
                
                // Intentar crear la tienda
                const { data: nuevaTienda, error: createError } = await supabase
                    .from('tiendas')
                    .insert([
                        {
                            user_id: userId,
                            nombre_tienda: nombreTienda || 'Mi Tienda',
                            email: user.email,
                            plan: plan,
                            subdomain: subdomain,
                            activa: true,
                            fecha_creacion: new Date().toISOString()
                        }
                    ])
                    .select()
                    .single();
                
                if (!createError && nuevaTienda) {
                    console.log('✅ Tienda creada exitosamente desde metadata');
                    return nuevaTienda;
                } else {
                    console.error('❌ Error creando tienda:', createError);
                    // Si falla por RLS, el trigger debería crearla
                    // Retornar null para que el usuario vea el mensaje apropiado
                    return null;
                }
            }
        }
        
        // Otro tipo de error
        if (error) {
            console.error('❌ Error obteniendo datos de tienda:', error);
        }
        
        return null;
    } catch (error) {
        console.error('❌ Error en obtenerDatosTienda:', error);
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





