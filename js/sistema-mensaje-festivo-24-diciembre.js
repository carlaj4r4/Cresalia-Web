// ===== SISTEMA DE MENSAJE FESTIVO 24 DE DICIEMBRE =====
// Envía email y notificación push a todos los usuarios registrados el 24 de diciembre

class SistemaMensajeFestivo24Diciembre {
    constructor() {
        this.fechaObjetivo = new Date(new Date().getFullYear(), 11, 24); // 24 de diciembre
        this.yaEnviado = this.verificarSiYaEnviado();
    }

    // Verificar si ya se envió el mensaje este año
    verificarSiYaEnviado() {
        const ultimoEnvio = localStorage.getItem('mensaje_festivo_24_enviado');
        if (!ultimoEnvio) return false;
        
        const fechaUltimoEnvio = new Date(ultimoEnvio);
        const añoActual = new Date().getFullYear();
        return fechaUltimoEnvio.getFullYear() === añoActual;
    }

    // Verificar si es 24 de diciembre
    es24DeDiciembre() {
        const ahora = new Date();
        const mes = ahora.getMonth(); // 0-11 (11 = diciembre)
        const dia = ahora.getDate();
        return mes === 11 && dia === 24;
    }

    // Obtener todos los usuarios registrados
    async obtenerTodosUsuarios() {
        try {
            const supabase = await this.obtenerSupabase();
            if (!supabase) {
                console.error('❌ Supabase no disponible');
                return { compradores: [], vendedores: [] };
            }

            // Obtener compradores
            const { data: compradores, error: errorCompradores } = await supabase
                .from('compradores')
                .select('email, nombre_completo, activo')
                .eq('activo', true);

            if (errorCompradores) {
                console.error('❌ Error obteniendo compradores:', errorCompradores);
            }

            // Obtener vendedores/tiendas
            const { data: tiendas, error: errorTiendas } = await supabase
                .from('tiendas')
                .select('email, nombre_tienda, activa')
                .eq('activa', true);

            if (errorTiendas) {
                console.error('❌ Error obteniendo tiendas:', errorTiendas);
            }

            return {
                compradores: compradores || [],
                vendedores: tiendas || []
            };

        } catch (error) {
            console.error('❌ Error obteniendo usuarios:', error);
            return { compradores: [], vendedores: [] };
        }
    }

    // Obtener cliente Supabase
    async obtenerSupabase() {
        // Intentar usar initSupabase si está disponible
        if (typeof window !== 'undefined' && typeof window.initSupabase === 'function') {
            try {
                const supabase = await window.initSupabase();
                if (supabase && typeof supabase.from === 'function') {
                    return supabase;
                }
            } catch (error) {
                console.warn('⚠️ Error inicializando Supabase con initSupabase:', error);
            }
        }

        // Esperar a que Supabase esté disponible en window
        if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.from === 'function') {
            return window.supabase;
        }

        // Intentar cargar desde auth/supabase-config.js (función global)
        if (typeof initSupabase === 'function') {
            try {
                const supabase = await initSupabase();
                if (supabase && typeof supabase.from === 'function') {
                    return supabase;
                }
            } catch (error) {
                console.warn('⚠️ Error con initSupabase global:', error);
            }
        }

        // Esperar un poco y reintentar
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.from === 'function') {
            return window.supabase;
        }
        
        console.error('❌ Supabase no está inicializado correctamente');
        return null;

        return null;
    }

    // Enviar email festivo
    async enviarEmailFestivo(email, nombre, tipo) {
        try {
            const htmlContent = this.obtenerTemplateEmailFestivo(nombre, tipo);
            
            const response = await fetch('/api/enviar-email-brevo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: email,
                    to_name: nombre,
                    subject: '🎄 ¡Felices Fiestas desde Cresalia! 🎉',
                    html_content: htmlContent
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al enviar email');
            }

            return await response.json();
        } catch (error) {
            console.error(`❌ Error enviando email a ${email}:`, error);
            return { success: false, error: error.message };
        }
    }

    // Template de email festivo
    obtenerTemplateEmailFestivo(nombre, tipo) {
        const esVendedor = tipo === 'vendedor';
        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Felices Fiestas desde Cresalia!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); color: white; padding: 40px 30px; text-align: center;">
            <div style="font-size: 60px; margin-bottom: 10px;">🎄✨</div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 600;">¡Felices Fiestas!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Desde Cresalia te deseamos lo mejor</p>
        </div>
        <div style="padding: 40px 30px; color: #333; line-height: 1.8;">
            <h2 style="color: #7C3AED; font-size: 22px; margin-top: 0;">Hola ${nombre},</h2>
            <p>En este día especial, queremos agradecerte por ser parte de nuestra comunidad. Tu confianza en Cresalia significa todo para nosotros.</p>
            <div style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1)); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #7C3AED;">
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #7C3AED;">🎉 Te deseamos un año lleno de buenas noticias</p>
                <p style="margin: 10px 0 0 0; color: #4B5563;">Que el 2025 te traiga oportunidades increíbles, crecimiento personal y profesional, y momentos especiales que recordarás siempre.</p>
            </div>
            ${esVendedor ? `
            <p>Como parte de nuestra comunidad de emprendedores, sabemos que cada día es una oportunidad para crecer. Que este nuevo año esté lleno de ventas exitosas, clientes satisfechos y logros que superen tus expectativas.</p>
            ` : `
            <p>Como parte de nuestra comunidad de compradores, esperamos que encuentres en Cresalia todo lo que necesitas. Que este nuevo año esté lleno de descubrimientos increíbles y experiencias de compra excepcionales.</p>
            `}
            <p style="margin-top: 30px;">No importa cómo fue tu año, cada experiencia fue un paso hacia adelante. Te esperan cosas increíbles, años increíbles llenos de oportunidades y crecimiento.</p>
            <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); color: white; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    🌟 ¡Que tengas unas fiestas maravillosas! 🌟
                </div>
            </div>
            <p style="margin-top: 30px;">Con cariño y gratitud,<br><strong>El equipo de Cresalia</strong> ❤️</p>
        </div>
        <div style="background: #F9FAFB; padding: 30px; text-align: center; color: #6B7280; font-size: 14px;">
            <p><strong>Cresalia</strong> - Plataforma E-commerce Multi-tenant</p>
            <p style="font-size: 12px; color: #9CA3AF; margin-top: 15px;">
                Este email fue enviado automáticamente el 24 de diciembre de ${new Date().getFullYear()}.
            </p>
        </div>
    </div>
</body>
</html>
        `;
    }

    // Enviar notificación push
    enviarNotificacionPush(nombre) {
        try {
            // Verificar si las notificaciones están disponibles
            if (!('Notification' in window)) {
                console.log('⚠️ Notificaciones no disponibles en este navegador');
                return false;
            }

            if (Notification.permission !== 'granted') {
                console.log('⚠️ Permisos de notificación no concedidos');
                return false;
            }

            // Usar el sistema de notificaciones existente
            if (typeof window.sistemaNotificacionesPush !== 'undefined') {
                window.sistemaNotificacionesPush.enviarNotificacion({
                    titulo: '🎄 ¡Felices Fiestas! 🎉',
                    mensaje: `Hola ${nombre}, te deseamos un año lleno de buenas noticias y momentos increíbles. Desde Cresalia, queremos que sepas que te esperan cosas increíbles. 🌟`,
                    icono: '/assets/logo/logo-cresalia.png',
                    tag: 'mensaje-festivo-24'
                });
                return true;
            }

            // Fallback: crear notificación directamente
            const notificacion = new Notification('🎄 ¡Felices Fiestas! 🎉', {
                body: `Hola ${nombre}, te deseamos un año lleno de buenas noticias y momentos increíbles. Desde Cresalia, queremos que sepas que te esperan cosas increíbles. 🌟`,
                icon: '/assets/logo/logo-cresalia.png',
                tag: 'mensaje-festivo-24',
                requireInteraction: false,
                silent: false
            });

            notificacion.onclick = function() {
                window.focus();
                notificacion.close();
            };

            return true;

        } catch (error) {
            console.error('❌ Error enviando notificación push:', error);
            return false;
        }
    }

    // Procesar envío masivo
    async procesarEnvioMasivo() {
        if (!this.es24DeDiciembre()) {
            console.log('ℹ️ No es 24 de diciembre, no se enviará el mensaje festivo');
            return { success: false, message: 'No es 24 de diciembre' };
        }

        if (this.yaEnviado) {
            console.log('ℹ️ El mensaje festivo ya fue enviado este año');
            return { success: false, message: 'Ya enviado este año' };
        }

        console.log('🎄 Iniciando envío masivo de mensajes festivos...');

        try {
            const usuarios = await this.obtenerTodosUsuarios();
            const totalUsuarios = usuarios.compradores.length + usuarios.vendedores.length;
            
            console.log(`📊 Total de usuarios a notificar: ${totalUsuarios}`);
            console.log(`   - Compradores: ${usuarios.compradores.length}`);
            console.log(`   - Vendedores: ${usuarios.vendedores.length}`);

            let emailsEnviados = 0;
            let emailsError = 0;
            let notificacionesEnviadas = 0;

            // Procesar compradores
            for (const comprador of usuarios.compradores) {
                try {
                    // Enviar email
                    const resultadoEmail = await this.enviarEmailFestivo(
                        comprador.email,
                        comprador.nombre_completo || comprador.email,
                        'comprador'
                    );
                    
                    if (resultadoEmail.success) {
                        emailsEnviados++;
                    } else {
                        emailsError++;
                    }

                    // Pequeña pausa para no sobrecargar
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error(`❌ Error procesando comprador ${comprador.email}:`, error);
                    emailsError++;
                }
            }

            // Procesar vendedores
            for (const vendedor of usuarios.vendedores) {
                try {
                    // Enviar email
                    const resultadoEmail = await this.enviarEmailFestivo(
                        vendedor.email,
                        vendedor.nombre_tienda || vendedor.email,
                        'vendedor'
                    );
                    
                    if (resultadoEmail.success) {
                        emailsEnviados++;
                    } else {
                        emailsError++;
                    }

                    // Pequeña pausa para no sobrecargar
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error(`❌ Error procesando vendedor ${vendedor.email}:`, error);
                    emailsError++;
                }
            }

            // Marcar como enviado
            localStorage.setItem('mensaje_festivo_24_enviado', new Date().toISOString());

            console.log('✅ Envío masivo completado:');
            console.log(`   - Emails enviados: ${emailsEnviados}`);
            console.log(`   - Emails con error: ${emailsError}`);
            console.log(`   - Notificaciones push: ${notificacionesEnviadas}`);

            return {
                success: true,
                emailsEnviados,
                emailsError,
                notificacionesEnviadas,
                totalUsuarios
            };

        } catch (error) {
            console.error('❌ Error en envío masivo:', error);
            return { success: false, error: error.message };
        }
    }

    // Inicializar verificación automática
    inicializar() {
        // Verificar cada 15 minutos si es 24 de diciembre (más frecuente para asegurar ejecución)
        setInterval(() => {
            if (this.es24DeDiciembre() && !this.yaEnviado) {
                console.log('🎄 Es 24 de diciembre, iniciando envío de mensajes festivos...');
                this.procesarEnvioMasivo();
            }
        }, 900000); // Cada 15 minutos

        // Verificar inmediatamente al cargar
        if (this.es24DeDiciembre() && !this.yaEnviado) {
            console.log('🎄 Es 24 de diciembre, iniciando envío de mensajes festivos...');
            // Esperar 2 segundos para asegurar que Supabase esté cargado
            setTimeout(() => {
                this.procesarEnvioMasivo();
            }, 2000);
        }

        // También verificar cuando la página se vuelve visible (usuario vuelve a la pestaña)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.es24DeDiciembre() && !this.yaEnviado) {
                console.log('🎄 Página visible en 24 de diciembre, verificando envío...');
                setTimeout(() => {
                    this.procesarEnvioMasivo();
                }, 1000);
            }
        });
    }
}

// Instancia global
const sistemaMensajeFestivo24 = new SistemaMensajeFestivo24Diciembre();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.sistemaMensajeFestivo24 = sistemaMensajeFestivo24;
    window.enviarMensajeFestivo24 = () => sistemaMensajeFestivo24.procesarEnvioMasivo();
}

// Inicializar automáticamente
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            sistemaMensajeFestivo24.inicializar();
        });
    } else {
        sistemaMensajeFestivo24.inicializar();
    }
}

console.log('🎄 Sistema de Mensaje Festivo 24 de Diciembre cargado');
