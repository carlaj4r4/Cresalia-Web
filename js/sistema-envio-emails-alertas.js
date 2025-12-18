/**
 * 📧 Sistema de Envío Automático de Emails para Alertas
 * Se integra con el panel de creación de alertas
 */

class SistemaEnvioEmailsAlertas {
    constructor() {
        // Usar Supabase Edge Function en lugar de Vercel
        this.apiUrl = `${window.supabaseUrl}/functions/v1/enviar-emails-alerta`;
        this.init();
    }

    init() {
        console.log('📧 Sistema de envío de emails para alertas inicializado');
        
        // Escuchar evento de nueva alerta creada
        document.addEventListener('alerta-creada', (event) => {
            this.manejarNuevaAlerta(event.detail);
        });
    }

    async manejarNuevaAlerta(alerta) {
        const { id, titulo, alcance } = alerta;
        
        console.log(`📧 Nueva alerta creada (ID: ${id}). Enviando emails...`);

        // Mostrar notificación de progreso
        if (typeof elegantNotifications !== 'undefined') {
            elegantNotifications.show(
                `📧 Enviando emails a usuarios ${alcance === 'global' ? 'globales' : 'cercanos'}...`,
                'info',
                5000
            );
        }

        try {
            // Obtener el anon key de Supabase
            const anonKey = window.supabaseAnonKey || window.SUPABASE_ANON_KEY;
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${anonKey}`
                },
                body: JSON.stringify({
                    alerta_id: id
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error enviando emails');
            }

            // Mostrar resultado
            console.log('✅ Emails enviados:', data);

            if (typeof elegantNotifications !== 'undefined') {
                const mensaje = `✅ ${data.usuarios_notificados} usuario${data.usuarios_notificados !== 1 ? 's' : ''} notificado${data.usuarios_notificados !== 1 ? 's' : ''} por email`;
                elegantNotifications.show(mensaje, 'success');
            }

            // Disparar evento personalizado
            document.dispatchEvent(new CustomEvent('emails-alertas-enviados', {
                detail: data
            }));

        } catch (error) {
            console.error('❌ Error enviando emails:', error);
            
            if (typeof elegantNotifications !== 'undefined') {
                elegantNotifications.show(
                    `❌ Error enviando emails: ${error.message}`,
                    'error'
                );
            }
        }
    }

    // Método manual para reenviar emails de una alerta existente
    async reenviarEmails(alertaId) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    alerta_id: alertaId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error reenviando emails');
            }

            if (typeof elegantNotifications !== 'undefined') {
                elegantNotifications.show(
                    `✅ Emails reenviados a ${data.usuarios_notificados} usuarios`,
                    'success'
                );
            }

            return data;

        } catch (error) {
            console.error('❌ Error reenviando emails:', error);
            
            if (typeof elegantNotifications !== 'undefined') {
                elegantNotifications.show(
                    `❌ Error: ${error.message}`,
                    'error'
                );
            }
            
            throw error;
        }
    }
}

// Inicializar automáticamente
if (typeof window !== 'undefined') {
    window.sistemaEnvioEmailsAlertas = new SistemaEnvioEmailsAlertas();
    console.log('✅ Sistema de envío de emails para alertas cargado');
}

// Función helper para integrar con formularios existentes
window.enviarAlertaConEmails = async function(alertaData) {
    try {
        // 1. Crear la alerta en Supabase
        const { data: alerta, error } = await supabaseClient
            .from('alertas_emergencia_comunidades')
            .insert([alertaData])
            .select()
            .single();

        if (error) throw error;

        console.log('✅ Alerta creada:', alerta);

        // 2. Disparar evento para que se envíen los emails
        document.dispatchEvent(new CustomEvent('alerta-creada', {
            detail: alerta
        }));

        return alerta;

    } catch (error) {
        console.error('❌ Error creando alerta:', error);
        throw error;
    }
};
