// ===== SISTEMA DE AUTENTICACIÓN CRESALIA =====
// Funciones para login, registro y gestión de sesiones

// ===== REGISTRO DE NUEVOS COMPRADORES =====
async function registrarNuevoComprador(datos) {
    console.log('📝 Registrando nuevo comprador...');
    
    const { email, password, nombreCompleto } = datos;
    
    try {
        const supabase = initSupabase();
        
        if (!supabase) {
            throw new Error('No se pudo inicializar Supabase');
        }
        
        // 1. Crear usuario en Supabase Auth
        console.log('📧 Intentando registrar comprador:', { email, nombreCompleto });
        
        // Determinar URL de redirección según el entorno
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        const redirectUrl = isProduction 
            ? 'https://cresalia-web.vercel.app/login-comprador.html'
            : `${window.location.origin}/login-comprador.html`;

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: redirectUrl,
                data: {
                    nombre_completo: nombreCompleto,
                    tipo_usuario: 'comprador'
                }
            }
        });
        
        console.log('📊 Respuesta de signUp:', { data: authData, error: authError });
        
        if (authError) {
            console.error('❌ Error en signUp:', authError);
            throw authError;
        }
        
        // Verificar que el usuario se creó
        if (!authData.user) {
            throw new Error('No se pudo crear el usuario. Verifica tu configuración de Supabase.');
        }
        
        console.log('✅ Usuario creado en Auth:', authData.user.id);
        
        // 2. Crear registro en tabla de compradores
        const { data: compradorData, error: compradorError } = await supabase
            .from('compradores')
            .insert([
                {
                    user_id: authData.user.id,
                    nombre_completo: nombreCompleto,
                    email: email,
                    activo: true,
                    fecha_registro: new Date().toISOString()
                }
            ])
            .select()
            .single();
        
        if (compradorError) {
            console.error('❌ Error creando comprador:', compradorError);
            // Si falla la inserción en compradores, intentar eliminar el usuario de auth
            await supabase.auth.admin.deleteUser(authData.user.id).catch(() => {});
            throw compradorError;
        }
        
        console.log('✅ Comprador registrado exitosamente');
        
        // Enviar mensaje de bienvenida automático con sistema de emails
        if (window.sistemaEmailsCresalia) {
            await window.sistemaEmailsCresalia.procesarEvento('registro', {
                id: authData.user.id,
                email: email,
                nombre: nombreCompleto,
                tipo: 'comprador'
            });
        } else {
            // Fallback al método anterior
            await enviarMensajeBienvenida(email, nombreCompleto, 'comprador');
        }
        
        return {
            success: true,
            user: authData.user,
            comprador: compradorData,
            token: authData.session?.access_token,
            mensaje: '¡Registro exitoso! Revisa tu email para verificar tu cuenta.'
        };
        
    } catch (error) {
        console.error('❌ Error en registro de comprador:', error);
        return {
            success: false,
            error: error.message,
            mensaje: 'Error al registrar. ' + error.message
        };
    }
}

// ===== REGISTRO DE NUEVOS CLIENTES (VENDEDORES) =====
async function registrarNuevoCliente(datos) {
    console.log('📝 Registrando nuevo cliente (vendedor)...');
    
    const { email, password, nombreTienda, plan } = datos;
    
    try {
        const supabase = initSupabase();
        
        // 1. Crear usuario en Supabase Auth
        console.log('📧 Intentando registrar:', { email, nombreTienda, plan });
        console.log('🔐 Supabase URL:', SUPABASE_CONFIG.url);
        
        // Determinar URL de redirección según el entorno
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        const redirectUrl = isProduction 
            ? 'https://cresalia-web.vercel.app/login-tienda.html'
            : `${window.location.origin}/login-tienda.html`;

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: redirectUrl,
                data: {
                    nombre_tienda: nombreTienda,
                    plan: plan
                }
            }
        });
        
        console.log('📊 Respuesta de signUp:', { data: authData, error: authError });
        
        if (authError) {
            console.error('❌ Error en signUp:', authError);
            throw authError;
        }
        
        // Verificar que el usuario se creó
        if (!authData.user) {
            throw new Error('No se pudo crear el usuario. Verifica tu configuración de Supabase.');
        }
        
        console.log('✅ Usuario creado en Auth:', authData.user.id);
        
        // 2. Crear registro en tabla de tiendas
        const subdomain = nombreTienda
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
        
        const { data: tiendaData, error: tiendaError } = await supabase
            .from('tiendas')
            .insert([
                {
                    user_id: authData.user.id,
                    nombre_tienda: nombreTienda,
                    email: email,
                    plan: plan,
                    subdomain: subdomain,
                    activa: true,
                    fecha_creacion: new Date().toISOString()
                }
            ])
            .select()
            .single();
        
        if (tiendaError) throw tiendaError;
        
        console.log('✅ Cliente registrado exitosamente');
        
        // Enviar mensaje de bienvenida automático
        // Enviar mensaje de bienvenida automático con sistema de emails
        if (window.sistemaEmailsCresalia) {
            await window.sistemaEmailsCresalia.procesarEvento('registro', {
                id: authData.user.id,
                email: email,
                nombre: nombreTienda,
                tipo: 'vendedor'
            });
        } else {
            // Fallback al método anterior
            await enviarMensajeBienvenida(email, nombreTienda, 'vendedor');
        }
        
        return {
            success: true,
            user: authData.user,
            tienda: tiendaData,
            mensaje: '¡Registro exitoso! Revisa tu email para verificar tu cuenta.'
        };
        
    } catch (error) {
        console.error('❌ Error en registro:', error);
        return {
            success: false,
            error: error.message,
            mensaje: 'Error al registrar. ' + error.message
        };
    }
}

// ===== LOGIN DE CLIENTES =====
async function loginCliente(email, password) {
    console.log('🔐 Intentando login...');
    
    try {
        const supabase = initSupabase();
        
        // 1. Autenticar con Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // 2. Obtener datos de la tienda
        const tienda = await obtenerDatosTienda(data.user.id);
        
        // 3. Verificar que la tienda esté activa
        if (!tienda || !tienda.activa) {
            await supabase.auth.signOut();
            throw new Error('Tu tienda no está activa. Contacta a soporte.');
        }
        
        console.log('✅ Login exitoso');
        
        return {
            success: true,
            user: data.user,
            session: data.session,
            tienda: tienda,
            mensaje: '¡Bienvenido de nuevo!'
        };
        
    } catch (error) {
        console.error('❌ Error en login:', error);
        return {
            success: false,
            error: error.message,
            mensaje: 'Credenciales incorrectas o error de conexión'
        };
    }
}

// ===== LOGOUT =====
async function logoutCliente() {
    console.log('👋 Cerrando sesión...');
    
    try {
        const supabase = initSupabase();
        const { error } = await supabase.auth.signOut();
        
        if (error) throw error;
        
        // Limpiar localStorage
        localStorage.removeItem('cresalia_tienda_id');
        localStorage.removeItem('cresalia_user_id');
        
        console.log('✅ Sesión cerrada');
        
        return {
            success: true,
            mensaje: 'Sesión cerrada correctamente'
        };
        
    } catch (error) {
        console.error('❌ Error al cerrar sesión:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// ===== VERIFICAR ACCESO AL ADMIN =====
async function verificarAccesoAdmin() {
    console.log('🔍 Verificando acceso al panel admin...');
    
    try {
        // 1. Verificar sesión activa
        const session = await verificarSesion();
        
        if (!session) {
            console.log('❌ No hay sesión activa');
            return {
                tieneAcceso: false,
                mensaje: 'Debes iniciar sesión para acceder'
            };
        }
        
        // 2. Obtener usuario actual
        const user = await obtenerUsuarioActual();
        
        if (!user) {
            console.log('❌ No se pudo obtener usuario');
            return {
                tieneAcceso: false,
                mensaje: 'Error al verificar usuario'
            };
        }
        
        // 3. Obtener datos de la tienda
        const tienda = await obtenerDatosTienda(user.id);
        
        if (!tienda || !tienda.activa) {
            console.log('❌ Tienda no activa');
            return {
                tieneAcceso: false,
                mensaje: 'Tu tienda no está activa'
            };
        }
        
        console.log('✅ Acceso verificado');
        
        // Guardar en localStorage para uso rápido
        localStorage.setItem('cresalia_tienda_id', tienda.id);
        localStorage.setItem('cresalia_user_id', user.id);
        
        return {
            tieneAcceso: true,
            user: user,
            tienda: tienda,
            mensaje: 'Acceso autorizado'
        };
        
    } catch (error) {
        console.error('❌ Error verificando acceso:', error);
        return {
            tieneAcceso: false,
            error: error.message,
            mensaje: 'Error al verificar acceso'
        };
    }
}

// ===== CAMBIAR CONTRASEÑA =====
async function cambiarPassword(nuevaPassword) {
    console.log('🔑 Cambiando contraseña...');
    
    try {
        const supabase = initSupabase();
        
        const { data, error } = await supabase.auth.updateUser({
            password: nuevaPassword
        });
        
        if (error) throw error;
        
        console.log('✅ Contraseña actualizada');
        
        return {
            success: true,
            mensaje: 'Contraseña actualizada correctamente'
        };
        
    } catch (error) {
        console.error('❌ Error al cambiar contraseña:', error);
        return {
            success: false,
            error: error.message,
            mensaje: 'Error al cambiar contraseña'
        };
    }
}

// ===== RECUPERAR CONTRASEÑA =====
async function recuperarPassword(email) {
    console.log('📧 Enviando email de recuperación...');
    
    try {
        const supabase = initSupabase();
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password.html`
        });
        
        if (error) throw error;
        
        console.log('✅ Email enviado');
        
        return {
            success: true,
            mensaje: 'Te hemos enviado un email para recuperar tu contraseña'
        };
        
    } catch (error) {
        console.error('❌ Error al recuperar contraseña:', error);
        return {
            success: false,
            error: error.message,
            mensaje: 'Error al enviar email de recuperación'
        };
    }
}

// ===== SISTEMA DE MENSAJES DE BIENVENIDA =====
async function enviarMensajeBienvenida(email, nombre, tipoUsuario) {
    console.log(`📧 Enviando mensaje de bienvenida a ${tipoUsuario}:`, email);
    
    try {
        let mensajeBienvenida;
        
        if (tipoUsuario === 'vendedor') {
            mensajeBienvenida = generarMensajeBienvenidaVendedor(nombre);
        } else if (tipoUsuario === 'comprador') {
            mensajeBienvenida = generarMensajeBienvenidaComprador(nombre);
        }
        
        // Crear y descargar el mensaje de bienvenida
        const blob = new Blob([mensajeBienvenida], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bienvenida-${tipoUsuario}-${nombre}-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log(`✅ Mensaje de bienvenida enviado a ${tipoUsuario}:`, email);
        
    } catch (error) {
        console.error('❌ Error enviando mensaje de bienvenida:', error);
    }
}

// Función para generar mensaje de bienvenida para vendedores
function generarMensajeBienvenidaVendedor(nombreTienda) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>¡Bienvenido a Cresalia! - Vendedor</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .highlight { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #666; border-top: 1px solid #e5e7eb; }
        .features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
        .feature-card { background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Bienvenido a Cresalia! 🎉</h1>
            <p style="margin: 0; font-size: 1.1rem;">${nombreTienda}</p>
            <p style="margin: 5px 0; font-size: 0.9rem;">Tu plataforma de comercio digital</p>
        </div>
        
        <div class="content">
            <h2>¡Felicitaciones por unirte a Cresalia! 🚀</h2>
            
            <p>Estamos emocionados de tenerte como parte de nuestra comunidad de emprendedores. Cresalia está diseñada para ayudarte a hacer crecer tu negocio de manera digital.</p>
            
            <div class="highlight">
                <h3>🎯 Lo que puedes hacer en Cresalia:</h3>
                <ul>
                    <li>✅ Crear y gestionar tu tienda online</li>
                    <li>✅ Subir productos y servicios</li>
                    <li>✅ Gestionar ventas y pedidos</li>
                    <li>✅ Sistema de turnos automático</li>
                    <li>✅ Comprobantes personalizados</li>
                    <li>✅ Bot IA para atención al cliente</li>
                    <li>✅ Sistema de transporte local</li>
                    <li>✅ Notas de agradecimiento automáticas</li>
                </ul>
            </div>
            
            <div class="features">
                <div class="feature-card">
                    <h4>🛍️ Tu Tienda</h4>
                    <p>Personaliza tu tienda con tu marca y productos</p>
                </div>
                <div class="feature-card">
                    <h4>📊 Analytics</h4>
                    <p>Ve estadísticas de ventas y rendimiento</p>
                </div>
                <div class="feature-card">
                    <h4>🤖 Bot IA</h4>
                    <p>Atiende clientes 24/7 automáticamente</p>
                </div>
                <div class="feature-card">
                    <h4>💳 Pagos</h4>
                    <p>Gestiona pagos y confirmaciones</p>
                </div>
            </div>
            
            <p>Tu satisfacción es nuestra prioridad. Si tienes alguna pregunta, no dudes en contactarnos.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <p style="font-size: 1.2rem; color: #667eea; font-weight: bold;">
                    ¡Bienvenido a la familia Cresalia! 💜
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>El equipo de Cresalia</strong> te da la bienvenida</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">
                Esta bienvenida fue generada automáticamente por Cresalia - Tu plataforma de confianza para el comercio digital
            </p>
            <p style="font-size: 0.8rem; color: #999; margin-top: 15px;">
                Fecha de registro: ${new Date().toLocaleString('es-ES')}
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

// Función para generar mensaje de bienvenida para compradores
function generarMensajeBienvenidaComprador(nombre) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>¡Bienvenido a Cresalia! - Comprador</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: linear-gradient(135deg, #10B981 0%, #34D399 100%); }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10B981, #34D399); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .highlight { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; color: #666; border-top: 1px solid #e5e7eb; }
        .benefits { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
        .benefit-card { background: #f0f9ff; padding: 15px; border-radius: 8px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Bienvenido a Cresalia! 🛍️</h1>
            <p style="margin: 0; font-size: 1.1rem;">${nombre}</p>
            <p style="margin: 5px 0; font-size: 0.9rem;">Tu plataforma de compras de confianza</p>
        </div>
        
        <div class="content">
            <h2>¡Gracias por elegir Cresalia! 🎉</h2>
            
            <p>Estamos emocionados de tenerte como parte de nuestra comunidad de compradores. Cresalia conecta a emprendedores locales con compradores como tú.</p>
            
            <div class="highlight">
                <h3>🛍️ Lo que puedes hacer en Cresalia:</h3>
                <ul>
                    <li>✅ Explorar tiendas locales</li>
                    <li>✅ Comprar productos únicos</li>
                    <li>✅ Reservar servicios</li>
                    <li>✅ Usar servicios de transporte</li>
                    <li>✅ Calificar y opinar</li>
                    <li>✅ Recibir ofertas especiales</li>
                    <li>✅ Soporte 24/7</li>
                    <li>✅ Compras seguras</li>
                </ul>
            </div>
            
            <div class="benefits">
                <div class="benefit-card">
                    <h4>🏪 Tiendas Locales</h4>
                    <p>Descubre emprendedores de tu región</p>
                </div>
                <div class="benefit-card">
                    <h4>🚗 Servicio de Transporte</h4>
                    <p>Transporte confiable local</p>
                </div>
                <div class="benefit-card">
                    <h4>⭐ Calificaciones</h4>
                    <p>Opina sobre tus compras</p>
                </div>
                <div class="benefit-card">
                    <h4>💬 Soporte</h4>
                    <p>Atención personalizada</p>
                </div>
            </div>
            
            <p>Tu satisfacción es nuestra prioridad. ¡Disfruta explorando todas las opciones que Cresalia tiene para ofrecerte!</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <p style="font-size: 1.2rem; color: #10B981; font-weight: bold;">
                    ¡Bienvenido a la familia Cresalia! 💚
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>El equipo de Cresalia</strong> te da la bienvenida</p>
            <p style="font-size: 0.9rem; margin-top: 10px;">
                Esta bienvenida fue generada automáticamente por Cresalia - Tu plataforma de confianza para el comercio digital
            </p>
            <p style="font-size: 0.8rem; color: #999; margin-top: 15px;">
                Fecha de registro: ${new Date().toLocaleString('es-ES')}
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

// Hacer funciones disponibles globalmente
window.registrarNuevoComprador = registrarNuevoComprador;
window.registrarNuevoCliente = registrarNuevoCliente;
window.loginCliente = loginCliente;
window.logoutCliente = logoutCliente;
window.verificarAccesoAdmin = verificarAccesoAdmin;
window.cambiarPassword = cambiarPassword;
window.recuperarPassword = recuperarPassword;
window.enviarMensajeBienvenida = enviarMensajeBienvenida;

console.log('✅ Sistema de autenticación Cresalia cargado correctamente');
console.log('📋 Funciones disponibles:', {
    registrarNuevoCliente: typeof registrarNuevoCliente,
    loginCliente: typeof loginCliente,
    logoutCliente: typeof logoutCliente,
    verificarAccesoAdmin: typeof verificarAccesoAdmin
});

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        registrarNuevoCliente,
        loginCliente,
        logoutCliente,
        verificarAccesoAdmin,
        cambiarPassword,
        recuperarPassword
    };
}

