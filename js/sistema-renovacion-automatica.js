// ===== SISTEMA DE RENOVACIÓN AUTOMÁTICA DE SUSCRIPCIONES - CRESALIA =====
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: Enero 2025

class SistemaRenovacionAutomatica {
    constructor() {
        this.config = {
            // Días antes del vencimiento para intentar renovar
            diasAntesRenovacion: 3,
            // Intentos máximos si falla el pago
            intentosMaximos: 3,
            // Días entre intentos
            diasEntreIntentos: 2,
            // Webhook URL (configurar en Mercado Pago)
            webhookUrl: `${window.location.origin}/api/webhooks/mercadopago`
        };
        
        this.init();
    }

    async init() {
        console.log('🔄 Sistema de Renovación Automática iniciado');
        
        // Verificar suscripciones próximas a vencer cada hora
        setInterval(() => {
            this.verificarSuscripcionesPorVencer();
        }, 60 * 60 * 1000); // Cada hora

        // Verificar inmediatamente al cargar
        this.verificarSuscripcionesPorVencer();
    }

    // ===== 1. VERIFICAR SUSCRIPCIONES POR VENCER =====
    async verificarSuscripcionesPorVencer() {
        try {
            console.log('🔍 Verificando suscripciones por vencer...');
            
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
            const diasAntes = this.config.diasAntesRenovacion;

            for (const suscripcion of suscripciones) {
                const fechaVencimiento = new Date(suscripcion.fecha_vencimiento);
                const diasRestantes = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));

                // Si está dentro del período de renovación
                if (diasRestantes <= diasAntes && diasRestantes >= 0) {
                    await this.procesarRenovacion(suscripcion);
                }
                
                // Si ya venció pero aún no se renovó
                if (diasRestantes < 0) {
                    await this.manejarVencimiento(suscripcion);
                }
            }

        } catch (error) {
            console.error('❌ Error verificando suscripciones:', error);
        }
    }

    // ===== 2. PROCESAR RENOVACIÓN AUTOMÁTICA =====
    async procesarRenovacion(suscripcion) {
        try {
            console.log(`🔄 Procesando renovación para suscripción: ${suscripcion.id}`);

            // Verificar si ya se intentó renovar recientemente
            const ultimoIntento = await this.obtenerUltimoIntentoRenovacion(suscripcion.id);
            
            if (ultimoIntento && ultimoIntento.intentos >= this.config.intentosMaximos) {
                console.warn(`⚠️ Máximo de intentos alcanzado para suscripción: ${suscripcion.id}`);
                await this.suspenderSuscripcion(suscripcion, 'pago_fallido');
                return;
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

            // Obtener información del plan
            const planData = this.obtenerDatosPlan(suscripcion.plan);
            
            // Crear preferencia de pago para renovación
            const preferencia = await this.crearPreferenciaRenovacion(suscripcion, tienda, planData);

            if (preferencia.success) {
                // Registrar intento de renovación
                await this.registrarIntentoRenovacion(suscripcion.id, 'en_proceso', preferencia.preference_id);
                
                // Notificar al usuario
                await this.notificarRenovacionPendiente(tienda, suscripcion, preferencia);
                
                console.log(`✅ Renovación iniciada para suscripción: ${suscripcion.id}`);
            } else {
                await this.registrarIntentoRenovacion(suscripcion.id, 'fallido', null, preferencia.error);
                console.error('❌ Error creando preferencia de renovación:', preferencia.error);
            }

        } catch (error) {
            console.error('❌ Error procesando renovación:', error);
            await this.registrarIntentoRenovacion(suscripcion.id, 'error', null, error.message);
        }
    }

    // ===== 3. CREAR PREFERENCIA DE RENOVACIÓN =====
    async crearPreferenciaRenovacion(suscripcion, tienda, planData) {
        try {
            // Usar el sistema de Mercado Pago existente
            const preferencia = {
                items: [
                    {
                        title: `Renovación Cresalia ${planData.nombre} - ${tienda.nombre}`,
                        description: `Renovación mensual del plan ${planData.nombre}`,
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
                external_reference: `renewal_${suscripcion.id}_${Date.now()}`,
                notification_url: this.config.webhookUrl,
                metadata: {
                    type: 'subscription_renewal',
                    subscription_id: suscripcion.id,
                    plan: suscripcion.plan,
                    tienda_id: tienda.id
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

    // ===== 4. MANEJAR VENCIMIENTO =====
    async manejarVencimiento(suscripcion) {
        try {
            console.log(`⏰ Suscripción vencida: ${suscripcion.id}`);

            // Intentar renovar inmediatamente
            const ultimoIntento = await this.obtenerUltimoIntentoRenovacion(suscripcion.id);
            
            // Si no se ha intentado renovar o fue hace más de X días, intentar de nuevo
            if (!ultimoIntento || this.diasDesdeUltimoIntento(ultimoIntento) >= this.config.diasEntreIntentos) {
                await this.procesarRenovacion(suscripcion);
            } else {
                // Si ya se intentó y falló, suspender
                if (ultimoIntento.intentos >= this.config.intentosMaximos) {
                    await this.suspenderSuscripcion(suscripcion, 'pago_fallido');
                }
            }

        } catch (error) {
            console.error('❌ Error manejando vencimiento:', error);
        }
    }

    // ===== 5. SUSPENDER SUSCRIPCIÓN =====
    async suspenderSuscripcion(suscripcion, razon) {
        try {
            console.log(`🚫 Suspendiendo suscripción: ${suscripcion.id}, Razón: ${razon}`);

            // Actualizar estado de suscripción
            const { error: updateError } = await supabase
                .from('suscripciones')
                .update({
                    estado: 'vencida',
                    updated_at: new Date().toISOString()
                })
                .eq('id', suscripcion.id);

            if (updateError) {
                console.error('❌ Error actualizando suscripción:', updateError);
                return;
            }

            // Actualizar plan de la tienda a 'free'
            const { error: tiendaError } = await supabase
                .from('tiendas')
                .update({
                    plan: 'free',
                    estado: 'suspendida',
                    razon_suspension: razon,
                    fecha_suspension: new Date().toISOString()
                })
                .eq('id', suscripcion.tienda_id);

            if (tiendaError) {
                console.error('❌ Error actualizando tienda:', tiendaError);
            }

            // Notificar al usuario
            await this.notificarSuspension(suscripcion, razon);

            console.log(`✅ Suscripción suspendida: ${suscripcion.id}`);

        } catch (error) {
            console.error('❌ Error suspendiendo suscripción:', error);
        }
    }

    // ===== 6. PROCESAR PAGO EXITOSO (LLAMADO POR WEBHOOK) =====
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

            // Calcular nueva fecha de vencimiento (30 días desde ahora)
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

            // Registrar pago
            await this.registrarPagoRenovacion(suscripcion, paymentId);

            // Actualizar estado de la tienda
            const { error: tiendaError } = await supabase
                .from('tiendas')
                .update({
                    plan: suscripcion.plan,
                    estado: 'activa',
                    razon_suspension: null,
                    fecha_suspension: null
                })
                .eq('id', suscripcion.tienda_id);

            if (tiendaError) {
                console.error('❌ Error actualizando tienda:', tiendaError);
            }

            // Notificar renovación exitosa
            await this.notificarRenovacionExitosa(suscripcion);

            console.log(`✅ Renovación completada exitosamente: ${suscripcion.id}`);

            return { success: true };

        } catch (error) {
            console.error('❌ Error procesando pago exitoso:', error);
            return { success: false, error: error.message };
        }
    }

    // ===== 7. FUNCIONES AUXILIARES =====

    async obtenerUltimoIntentoRenovacion(subscriptionId) {
        try {
            const { data, error } = await supabase
                .from('intentos_renovacion')
                .select('*')
                .eq('suscripcion_id', subscriptionId)
                .order('fecha_intento', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('❌ Error obteniendo último intento:', error);
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

    async registrarPagoRenovacion(suscripcion, paymentId) {
        try {
            const planData = this.obtenerDatosPlan(suscripcion.plan);

            const { error } = await supabase
                .from('pagos_suscripciones')
                .insert({
                    suscripcion_id: suscripcion.id,
                    tienda_id: suscripcion.tienda_id,
                    monto: planData.precio,
                    comision: planData.precio * 0.029, // 2.9% comisión
                    metodo_pago: 'mercadopago',
                    estado: 'aprobado',
                    payment_id: paymentId,
                    external_reference: `renewal_${suscripcion.id}_${Date.now()}`,
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

    diasDesdeUltimoIntento(intento) {
        const fechaIntento = new Date(intento.fecha_intento);
        const hoy = new Date();
        return Math.ceil((hoy - fechaIntento) / (1000 * 60 * 60 * 24));
    }

    async notificarRenovacionPendiente(tienda, suscripcion, preferencia) {
        // Aquí iría la lógica de notificación por email
        console.log('📧 Notificando renovación pendiente');
        // TODO: Implementar notificación por email
    }

    async notificarRenovacionExitosa(suscripcion) {
        // Aquí iría la lógica de notificación por email
        console.log(`📧 Notificando renovación exitosa para suscripción: ${suscripcion.id}`);
        // TODO: Implementar notificación por email
    }

    async notificarSuspension(suscripcion, razon) {
        // Aquí iría la lógica de notificación por email
        console.log(`📧 Notificando suspensión para suscripción: ${suscripcion.id}`);
        // TODO: Implementar notificación por email
    }
}

// ===== TABLA NECESARIA EN SUPABASE =====
// Ejecutar este SQL en Supabase:

/*
CREATE TABLE IF NOT EXISTS intentos_renovacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    suscripcion_id UUID REFERENCES suscripciones(id) ON DELETE CASCADE,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('en_proceso', 'exitoso', 'fallido', 'error')),
    preference_id VARCHAR(255),
    error TEXT,
    intentos INTEGER DEFAULT 1,
    fecha_intento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intentos_renovacion_suscripcion ON intentos_renovacion(suscripcion_id);
CREATE INDEX IF NOT EXISTS idx_intentos_renovacion_fecha ON intentos_renovacion(fecha_intento);
*/

// Instancia global
window.sistemaRenovacionAutomatica = new SistemaRenovacionAutomatica();

console.log('✅ Sistema de Renovación Automática cargado');


