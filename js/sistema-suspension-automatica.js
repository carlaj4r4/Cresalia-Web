// ===== SISTEMA DE SUSPENSIÓN AUTOMÁTICA SI FALLA EL PAGO - CRESALIA =====
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: Enero 2025

class SistemaSuspensionAutomatica {
    constructor() {
        this.config = {
            // Período de gracia después del vencimiento (días)
            periodoGracia: 7,
            // Intentos máximos antes de suspender
            intentosMaximos: 3,
            // Días entre intentos de cobro
            diasEntreIntentos: 2,
            // Notificar X días antes de suspender
            diasAntesNotificacion: 3
        };

        this.init();
    }

    async init() {
        console.log('🚫 Sistema de Suspensión Automática iniciado');

        // Verificar suscripciones vencidas cada 6 horas
        setInterval(() => {
            this.verificarSuscripcionesVencidas();
        }, 6 * 60 * 60 * 1000); // Cada 6 horas

        // Verificar inmediatamente al cargar
        this.verificarSuscripcionesVencidas();
    }

    // ===== 1. VERIFICAR SUSCRIPCIONES VENCIDAS =====
    async verificarSuscripcionesVencidas() {
        try {
            console.log('🔍 Verificando suscripciones vencidas...');

            const { data: suscripciones, error } = await supabase
                .from('suscripciones')
                .select('*')
                .eq('estado', 'activa')
                .not('fecha_vencimiento', 'is', null);

            if (error) {
                console.error('❌ Error obteniendo suscripciones:', error);
                return;
            }

            const hoy = new Date();

            for (const suscripcion of suscripciones) {
                const fechaVencimiento = new Date(suscripcion.fecha_vencimiento);
                const diasVencidos = Math.ceil((hoy - fechaVencimiento) / (1000 * 60 * 60 * 24));

                // Si ya venció
                if (diasVencidos > 0) {
                    await this.procesarSuscripcionVencida(suscripcion, diasVencidos);
                }
                
                // Si está por vencer (dentro del período de gracia)
                else if (diasVencidos >= -this.config.periodoGracia && diasVencidos < 0) {
                    await this.notificarVencimientoProximo(suscripcion, Math.abs(diasVencidos));
                }
            }

        } catch (error) {
            console.error('❌ Error verificando suscripciones vencidas:', error);
        }
    }

    // ===== 2. PROCESAR SUSCRIPCIÓN VENCIDA =====
    async procesarSuscripcionVencida(suscripcion, diasVencidos) {
        try {
            console.log(`⏰ Procesando suscripción vencida: ${suscripcion.id}, Días vencidos: ${diasVencidos}`);

            // Si está dentro del período de gracia
            if (diasVencidos <= this.config.periodoGracia) {
                // Intentar renovar automáticamente
                await this.intentarRenovacionAutomatica(suscripcion);
                
                // Notificar que está en período de gracia
                if (diasVencidos === 1) {
                    await this.notificarPeriodoGracia(suscripcion, this.config.periodoGracia - diasVencidos);
                }
                
                return;
            }

            // Si pasó el período de gracia
            if (diasVencidos > this.config.periodoGracia) {
                // Verificar intentos de renovación
                const intentos = await this.obtenerIntentosRenovacion(suscripcion.id);

                // Si ya se intentó renovar y falló
                if (intentos >= this.config.intentosMaximos) {
                    await this.suspenderTienda(suscripcion, 'pago_fallido', diasVencidos);
                } else {
                    // Intentar renovar una vez más
                    await this.intentarRenovacionAutomatica(suscripcion);
                }
            }

        } catch (error) {
            console.error('❌ Error procesando suscripción vencida:', error);
        }
    }

    // ===== 3. INTENTAR RENOVACIÓN AUTOMÁTICA =====
    async intentarRenovacionAutomatica(suscripcion) {
        try {
            console.log(`🔄 Intentando renovación automática para: ${suscripcion.id}`);

            // Verificar último intento
            const ultimoIntento = await this.obtenerUltimoIntentoRenovacion(suscripcion.id);
            
            if (ultimoIntento) {
                const diasDesdeUltimoIntento = Math.ceil(
                    (new Date() - new Date(ultimoIntento.fecha_intento)) / (1000 * 60 * 60 * 24)
                );

                // Si el último intento fue hace menos de X días, no intentar de nuevo
                if (diasDesdeUltimoIntento < this.config.diasEntreIntentos) {
                    console.log(`⏸️ Esperando antes de intentar de nuevo. Último intento: ${diasDesdeUltimoIntento} días atrás`);
                    return;
                }
            }

            // Obtener información de la tienda
            const { data: tienda, error: tiendaError } = await supabase
                .from('tiendas')
                .select('*')
                .eq('id', suscripcion.tienda_id)
                .single();

            if (tiendaError || !tienda) {
                console.error('❌ Error obteniendo tienda:', tiendaError);
                return;
            }

            // Intentar crear preferencia de pago
            const resultado = await this.crearPreferenciaRenovacion(suscripcion, tienda);

            if (resultado.success) {
                // Registrar intento
                await this.registrarIntentoRenovacion(suscripcion.id, 'en_proceso', resultado.preference_id);
                
                // Notificar al usuario
                await this.notificarIntentoRenovacion(suscripcion, tienda, resultado.init_point);
                
                console.log(`✅ Renovación automática iniciada: ${suscripcion.id}`);
            } else {
                // Registrar intento fallido
                await this.registrarIntentoRenovacion(suscripcion.id, 'fallido', null, resultado.error);
                console.error(`❌ Error en renovación automática: ${resultado.error}`);
            }

        } catch (error) {
            console.error('❌ Error intentando renovación automática:', error);
            await this.registrarIntentoRenovacion(suscripcion.id, 'error', null, error.message);
        }
    }

    // ===== 4. CREAR PREFERENCIA DE RENOVACIÓN =====
    async crearPreferenciaRenovacion(suscripcion, tienda) {
        try {
            const planData = this.obtenerDatosPlan(suscripcion.plan);

            const preferencia = {
                items: [
                    {
                        title: `Renovación Cresalia ${planData.nombre} - ${tienda.nombre}`,
                        description: `Renovación automática del plan ${planData.nombre}`,
                        quantity: 1,
                        unit_price: planData.precio
                    }
                ],
                payer: {
                    email: tienda.email_contacto || tienda.email
                },
                back_urls: {
                    success: `${window.location.origin}/success.html?type=renewal&sub_id=${suscripcion.id}`,
                    failure: `${window.location.origin}/failure.html?type=renewal&sub_id=${suscripcion.id}`,
                    pending: `${window.location.origin}/pending.html?type=renewal&sub_id=${suscripcion.id}`
                },
                auto_return: 'approved',
                external_reference: `auto_renewal_${suscripcion.id}_${Date.now()}`,
                notification_url: `${window.location.origin}/api/webhooks/mercadopago`,
                metadata: {
                    type: 'subscription_renewal',
                    subscription_id: suscripcion.id,
                    plan: suscripcion.plan,
                    tienda_id: tienda.id,
                    automatic: true
                }
            };

            // Llamar a la API de Mercado Pago
            const response = await fetch('/api/payments/mercadopago/create-preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preferencia)
            });

            const result = await response.json();

            if (result.success) {
                return {
                    success: true,
                    preference_id: result.preference_id,
                    init_point: result.init_point
                };
            } else {
                return {
                    success: false,
                    error: result.error || 'Error desconocido'
                };
            }

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ===== 5. SUSPENDER TIENDA =====
    async suspenderTienda(suscripcion, razon, diasVencidos) {
        try {
            console.log(`🚫 Suspendiendo tienda: ${suscripcion.tienda_id}, Razón: ${razon}`);

            // Actualizar estado de suscripción
            const { error: suscripcionError } = await supabase
                .from('suscripciones')
                .update({
                    estado: 'vencida',
                    updated_at: new Date().toISOString()
                })
                .eq('id', suscripcion.id);

            if (suscripcionError) {
                console.error('❌ Error actualizando suscripción:', suscripcionError);
            }

            // Actualizar estado de la tienda
            const { error: tiendaError } = await supabase
                .from('tiendas')
                .update({
                    plan: 'free',
                    estado: 'suspendida',
                    razon_suspension: razon,
                    fecha_suspension: new Date().toISOString(),
                    dias_vencido: diasVencidos
                })
                .eq('id', suscripcion.tienda_id);

            if (tiendaError) {
                console.error('❌ Error actualizando tienda:', tiendaError);
            }

            // Bloquear funcionalidades
            await this.bloquearFuncionalidades(suscripcion.tienda_id);

            // Notificar suspensión
            await this.notificarSuspension(suscripcion, razon, diasVencidos);

            console.log(`✅ Tienda suspendida: ${suscripcion.tienda_id}`);

        } catch (error) {
            console.error('❌ Error suspendiendo tienda:', error);
        }
    }

    // ===== 6. BLOQUEAR FUNCIONALIDADES =====
    async bloquearFuncionalidades(tiendaId) {
        try {
            // Marcar tienda como suspendida en localStorage (para frontend)
            localStorage.setItem(`tienda_${tiendaId}_suspendida`, 'true');
            localStorage.setItem(`tienda_${tiendaId}_fecha_suspension`, new Date().toISOString());

            // Aquí podrías agregar más lógica de bloqueo:
            // - Deshabilitar acceso a admin
            // - Mostrar mensaje de suspensión
            // - Bloquear creación de productos/órdenes
            // etc.

            console.log(`🔒 Funcionalidades bloqueadas para tienda: ${tiendaId}`);

        } catch (error) {
            console.error('❌ Error bloqueando funcionalidades:', error);
        }
    }

    // ===== 7. PROCESAR PAGO EXITOSO (LLAMADO POR WEBHOOK) =====
    async procesarPagoExitoso(paymentId, subscriptionId) {
        try {
            console.log(`✅ Procesando pago exitoso: ${paymentId} para suscripción: ${subscriptionId}`);

            // Obtener suscripción
            const { data: suscripcion, error: suscripcionError } = await supabase
                .from('suscripciones')
                .select('*')
                .eq('id', subscriptionId)
                .single();

            if (suscripcionError || !suscripcion) {
                console.error('❌ Error obteniendo suscripción:', suscripcionError);
                return { success: false, error: 'Suscripción no encontrada' };
            }

            // Calcular nueva fecha de vencimiento
            const nuevaFechaVencimiento = new Date();
            nuevaFechaVencimiento.setDate(nuevaFechaVencimiento.getDate() + 30);

            // Actualizar suscripción
            const { error: updateError } = await supabase
                .from('suscripciones')
                .update({
                    estado: 'activa',
                    fecha_vencimiento: nuevaFechaVencimiento.toISOString(),
                    fecha_renovacion: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', suscripcion.id);

            if (updateError) {
                console.error('❌ Error actualizando suscripción:', updateError);
                return { success: false, error: updateError.message };
            }

            // Reactivar tienda
            const { error: tiendaError } = await supabase
                .from('tiendas')
                .update({
                    plan: suscripcion.plan,
                    estado: 'activa',
                    razon_suspension: null,
                    fecha_suspension: null,
                    dias_vencido: null
                })
                .eq('id', suscripcion.tienda_id);

            if (tiendaError) {
                console.error('❌ Error reactivando tienda:', tiendaError);
            }

            // Desbloquear funcionalidades
            await this.desbloquearFuncionalidades(suscripcion.tienda_id);

            // Registrar pago
            await this.registrarPago(suscripcion, paymentId);

            // Notificar reactivación
            await this.notificarReactivacion(suscripcion);

            console.log(`✅ Tienda reactivada: ${suscripcion.tienda_id}`);

            return { success: true };

        } catch (error) {
            console.error('❌ Error procesando pago exitoso:', error);
            return { success: false, error: error.message };
        }
    }

    // ===== 8. DESBLOQUEAR FUNCIONALIDADES =====
    async desbloquearFuncionalidades(tiendaId) {
        try {
            // Remover marca de suspensión
            localStorage.removeItem(`tienda_${tiendaId}_suspendida`);
            localStorage.removeItem(`tienda_${tiendaId}_fecha_suspension`);

            console.log(`🔓 Funcionalidades desbloqueadas para tienda: ${tiendaId}`);

        } catch (error) {
            console.error('❌ Error desbloqueando funcionalidades:', error);
        }
    }

    // ===== 9. FUNCIONES AUXILIARES =====

    async obtenerIntentosRenovacion(subscriptionId) {
        try {
            const { data, error } = await supabase
                .from('intentos_renovacion')
                .select('*')
                .eq('suscripcion_id', subscriptionId)
                .eq('estado', 'fallido');

            if (error) {
                return 0;
            }

            return data.length;
        } catch (error) {
            return 0;
        }
    }

    async obtenerUltimoIntentoRenovacion(subscriptionId) {
        try {
            const { data, error } = await supabase
                .from('intentos_renovacion')
                .select('*')
                .eq('suscripcion_id', subscriptionId)
                .order('fecha_intento', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') {
                return null;
            }

            return data;
        } catch (error) {
            return null;
        }
    }

    async registrarIntentoRenovacion(subscriptionId, estado, preferenceId = null, error = null) {
        try {
            const ultimoIntento = await this.obtenerUltimoIntentoRenovacion(subscriptionId);
            const intentos = ultimoIntento ? ultimoIntento.intentos + 1 : 1;

            const { error: insertError } = await supabase
                .from('intentos_renovacion')
                .insert({
                    suscripcion_id: subscriptionId,
                    estado: estado,
                    preference_id: preferenceId,
                    error: error,
                    intentos: intentos,
                    fecha_intento: new Date().toISOString()
                });

            if (insertError) {
                console.error('❌ Error registrando intento:', insertError);
            }
        } catch (error) {
            console.error('❌ Error registrando intento:', error);
        }
    }

    async registrarPago(suscripcion, paymentId) {
        try {
            const planData = this.obtenerDatosPlan(suscripcion.plan);

            const { error } = await supabase
                .from('pagos_suscripciones')
                .insert({
                    suscripcion_id: suscripcion.id,
                    tienda_id: suscripcion.tienda_id,
                    monto: planData.precio,
                    comision: planData.precio * 0.029,
                    metodo_pago: 'mercadopago',
                    estado: 'aprobado',
                    payment_id: paymentId,
                    external_reference: `auto_renewal_${suscripcion.id}_${Date.now()}`,
                    fecha_pago: new Date().toISOString()
                });

            if (error) {
                console.error('❌ Error registrando pago:', error);
            }
        } catch (error) {
            console.error('❌ Error registrando pago:', error);
        }
    }

    obtenerDatosPlan(plan) {
        const planes = {
            free: { nombre: 'Free', precio: 0 },
            basic: { nombre: 'Básico', precio: 10 },
            pro: { nombre: 'Pro', precio: 50 },
            enterprise: { nombre: 'Enterprise', precio: 100 }
        };
        return planes[plan] || planes.free;
    }

    // ===== 10. NOTIFICACIONES =====

    async notificarVencimientoProximo(suscripcion, diasRestantes) {
        console.log(`📧 Notificando vencimiento próximo: ${diasRestantes} días`);
        // TODO: Implementar notificación por email
    }

    async notificarPeriodoGracia(suscripcion, diasRestantes) {
        console.log(`📧 Notificando período de gracia: ${diasRestantes} días`);
        // TODO: Implementar notificación por email
    }

    async notificarIntentoRenovacion(suscripcion, tienda, paymentLink) {
        console.log(`📧 Notificando intento de renovación`);
        // TODO: Implementar notificación por email con link de pago
    }

    async notificarSuspension(suscripcion, razon, diasVencidos) {
        console.log(`📧 Notificando suspensión`);
        // TODO: Implementar notificación por email
    }

    async notificarReactivacion(suscripcion) {
        console.log(`📧 Notificando reactivación`);
        // TODO: Implementar notificación por email
    }
}

// Instancia global
window.sistemaSuspensionAutomatica = new SistemaSuspensionAutomatica();

console.log('✅ Sistema de Suspensión Automática cargado');


