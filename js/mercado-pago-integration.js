// ===== INTEGRACIÓN CON MERCADO PAGO PARA CRESALIA =====
// Sistema de pagos y suscripciones

// ===== CONFIGURACIÓN MERCADO PAGO - CRESALIA =====
// ✅ HABILITADO: Usando credenciales reales de producción

// Usar configuración global si está disponible, sino usar estas
const MERCADO_PAGO_SETTINGS = (() => {
    if (typeof window === 'undefined') {
        return {
            publicKey: 'CONFIGURAR_EN_VERCEL',
            accessToken: 'CONFIGURAR_EN_VERCEL',
            sandbox: false,
            currency: 'ARS',
            statement_descriptor: 'Cresalia',
            enabled: true
        };
    }

    if (window.MERCADO_PAGO_CONFIG) {
        return window.MERCADO_PAGO_CONFIG;
    }

    if (window.CONFIG_MERCADO_PAGO) {
        const config = {
            publicKey: window.CONFIG_MERCADO_PAGO.production.publicKey,
            accessToken: window.CONFIG_MERCADO_PAGO.production.accessToken,
            sandbox: false,
            currency: 'ARS',
            statement_descriptor: 'Cresalia',
            enabled: true
        };
        window.MERCADO_PAGO_CONFIG = config;
        return config;
    }

    const fallbackConfig = {
        publicKey: window.MERCADOPAGO_PUBLIC_KEY || 'CONFIGURAR_EN_VERCEL',
        accessToken: window.MERCADOPAGO_ACCESS_TOKEN || 'CONFIGURAR_EN_VERCEL',
        sandbox: false,
        currency: 'ARS',
        statement_descriptor: 'Cresalia',
        enabled: true
    };

    window.MERCADO_PAGO_CONFIG = fallbackConfig;
    return fallbackConfig;
})();

// Planes de suscripción disponibles
const PLANES_SUSCRIPCION = {
    free: {
        id: 'plan-free',
        nombre: 'Free',
        precio: 0,
        descripcion: 'Plan gratuito para emprendedores',
        caracteristicas: ['50 productos', '100 órdenes/mes', '2 idiomas', 'Logo personalizado', 'Turnos básicos incluidos', 'Comprobantes básicos incluidos'],
        comision_porcentaje: 2.9,
        comision_fija: 0.2,
        transparencia: 'Comisión reducida para apoyar emprendedores'
    },
    basic: {
        id: 'plan-basic',
        nombre: 'Basic',
        precio: 29,
        descripcion: 'Plan básico para emprendedores',
        caracteristicas: ['500 productos', '1,000 órdenes/mes', '3 idiomas', 'Dominio personalizado', 'Turnos personalizables', 'Comprobantes con logo'],
        comision_porcentaje: 1.9,
        comision_fija: 0.2,
        transparencia: 'Comisión reducida por suscripción'
    },
    pro: {
        id: 'plan-pro',
        nombre: 'Pro',
        precio: 79,
        descripcion: 'Plan profesional con IA',
        caracteristicas: ['Productos ilimitados', 'Órdenes ilimitadas', '6 idiomas', 'Chatbot IA personalizado', 'Turnos avanzados', 'Comprobantes premium'],
        comision_porcentaje: 1.2,
        comision_fija: 0.2,
        transparencia: 'Comisión aún más reducida'
    },
    enterprise: {
        id: 'plan-enterprise',
        nombre: 'Enterprise',
        precio: 199,
        descripcion: 'Plan empresarial completo',
        caracteristicas: ['Todo de Pro', 'White-label', 'Servidores dedicados', 'Consultoría personalizada'],
        comision_porcentaje: 0.5,
        comision_fija: 0.2,
        transparencia: 'Comisión mínima'
    }
};

// Configuración de transparencia de precios
const TRANSPARENCIA_PRECIOS = {
    mercadoPago: {
        porcentaje: 6.17,  // Actualizado: Nueva comisión de Mercado Pago (2024)
        fijo: 0.00,
        descripcion: 'Comisión de Mercado Pago (siempre aplicada)'
    },
    ejemplo: {
        venta1000: {
            precio: 1000,
            free: {
                mercadoPago: 61.70,  // 6.17% de $1000
                cresalia: 29.20,
                netoVendedor: 909.10,  // $1000 - $61.70 - $29.20
                descripcion: 'Plan Free: Mercado Pago $61.70 (6.17%) + Cresalia $29.20 = Neto $909.10'
            },
            basic: {
                mercadoPago: 61.70,  // 6.17% de $1000
                cresalia: 19.20,
                netoVendedor: 919.10,  // $1000 - $61.70 - $19.20
                descripcion: 'Plan Basic: Mercado Pago $61.70 (6.17%) + Cresalia $19.20 = Neto $919.10'
            },
            pro: {
                mercadoPago: 61.70,  // 6.17% de $1000
                cresalia: 12.20,
                netoVendedor: 926.10,  // $1000 - $61.70 - $12.20
                descripcion: 'Plan Pro: Mercado Pago $61.70 (6.17%) + Cresalia $12.20 = Neto $926.10'
            },
            enterprise: {
                mercadoPago: 61.70,  // 6.17% de $1000
                cresalia: 5.20,
                netoVendedor: 933.10,  // $1000 - $61.70 - $5.20
                descripcion: 'Plan Enterprise: Mercado Pago $61.70 (6.17%) + Cresalia $5.20 = Neto $933.10'
            }
        }
    }
};

// Función para inicializar Mercado Pago
function inicializarMercadoPago() {
    console.log('💳 Inicializando Mercado Pago...');
    
    // Verificar que Mercado Pago SDK esté cargado
    if (typeof MercadoPago === 'undefined') {
        console.error('❌ Mercado Pago SDK no está cargado. Asegurate de cargar el script: https://sdk.mercadopago.com/js/v2');
        return false;
    }
    
    // Verificar configuración
    if (!MERCADO_PAGO_SETTINGS.publicKey || MERCADO_PAGO_SETTINGS.publicKey.includes('TEST-') || MERCADO_PAGO_SETTINGS.publicKey.includes('xxxx')) {
        console.warn('⚠️ Mercado Pago no configurado correctamente. Verificá tus credenciales en config-mercado-pago.js');
        return false;
    }
    
    // Verificar que está habilitado
    if (MERCADO_PAGO_SETTINGS.enabled === false) {
        console.warn('⚠️ Mercado Pago está deshabilitado en la configuración');
        return false;
    }
    
    try {
        // Inicializar Mercado Pago con las credenciales REALES de producción
        const mp = new MercadoPago(MERCADO_PAGO_SETTINGS.publicKey, {
            locale: 'es-AR'
        });
        
        console.log('✅ Mercado Pago inicializado correctamente');
        console.log('✅ Modo:', MERCADO_PAGO_SETTINGS.sandbox ? 'SANDBOX (pruebas)' : 'PRODUCCIÓN (real)');
        console.log('✅ Statement Descriptor:', MERCADO_PAGO_SETTINGS.statement_descriptor || 'Cresalia');
        
        return mp;
    } catch (error) {
        console.error('❌ Error inicializando Mercado Pago:', error);
        return false;
    }
}

// Función para crear preferencia de pago
async function crearPreferenciaPago(planId, datosUsuario) {
    console.log('💰 Creando preferencia de pago para plan:', planId);
    
    const plan = PLANES_SUSCRIPCION[planId];
    if (!plan) {
        throw new Error('Plan no válido');
    }
    
    const mp = inicializarMercadoPago();
    if (!mp) {
        throw new Error('Mercado Pago no inicializado');
    }
    
    try {
        const preferencia = {
            items: [
                {
                    title: `Suscripción Cresalia - ${plan.nombre}`,
                    description: plan.descripcion,
                    quantity: 1,
                    unit_price: plan.precio,
                    currency_id: MERCADO_PAGO_SETTINGS.currency
                }
            ],
            payer: {
                // Solo email para verificación interna de Mercado Pago
                // El nombre comercial será "Cresalia" (configurado en statement_descriptor)
                email: datosUsuario.email
            },
            statement_descriptor: 'Cresalia', // Lo que verá el cliente en su resumen de cuenta
            back_urls: {
                success: `${window.location.origin}/pago-exitoso.html`,
                failure: `${window.location.origin}/pago-fallido.html`,
                pending: `${window.location.origin}/pago-pendiente.html`
            },
            auto_return: 'approved',
            notification_url: `${window.location.origin}/api/notificaciones-pago`,
            external_reference: `cresalia_${planId}_${Date.now()}`,
            metadata: {
                plan: planId,
                // NO incluir datos personales en metadata
                plataforma: 'cresalia',
                tipo: 'suscripcion'
            }
        };
        
        const response = await mp.preferences.create(preferencia);
        console.log('✅ Preferencia creada:', response.body.id);
        
        return response.body;
    } catch (error) {
        console.error('❌ Error creando preferencia:', error);
        throw error;
    }
}

// Función para procesar suscripción
async function procesarSuscripcion(planId, datosUsuario) {
    console.log('🚀 Procesando suscripción para plan:', planId);
    
    try {
        // Crear preferencia de pago
        const preferencia = await crearPreferenciaPago(planId, datosUsuario);
        
        // Guardar datos de suscripción en localStorage
        const datosSuscripcion = {
            plan: planId,
            usuario: datosUsuario,
            preferencia_id: preferencia.id,
            fecha_inicio: new Date().toISOString(),
            estado: 'pendiente',
            monto: PLANES_SUSCRIPCION[planId].precio
        };
        
        localStorage.setItem('suscripcion_pendiente', JSON.stringify(datosSuscripcion));
        
        // Redirigir a Mercado Pago
        window.location.href = preferencia.init_point;
        
    } catch (error) {
        console.error('❌ Error procesando suscripción:', error);
        mostrarNotificacion('❌ Error al procesar el pago. Intenta nuevamente.', 'error');
    }
}

// Función para verificar estado de suscripción
function verificarEstadoSuscripcion() {
    console.log('🔍 Verificando estado de suscripción...');
    
    const suscripcion = JSON.parse(localStorage.getItem('suscripcion_activa') || '{}');
    const planActual = localStorage.getItem('plan-actual') || 'free';
    
    if (suscripcion.plan && suscripcion.estado === 'activa') {
        console.log('✅ Suscripción activa:', suscripcion.plan);
        return {
            activa: true,
            plan: suscripcion.plan,
            fecha_vencimiento: suscripcion.fecha_vencimiento,
            dias_restantes: calcularDiasRestantes(suscripcion.fecha_vencimiento)
        };
    }
    
    return {
        activa: false,
        plan: planActual,
        dias_restantes: 0
    };
}

// Función para calcular días restantes
function calcularDiasRestantes(fechaVencimiento) {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = vencimiento - hoy;
    const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    return Math.max(0, dias);
}

// Función para cancelar suscripción
async function cancelarSuscripcion() {
    console.log('🚫 Cancelando suscripción...');
    
    const confirmacion = confirm('¿Estás seguro de que quieres cancelar tu suscripción?');
    if (!confirmacion) return;
    
    try {
        // Aquí se haría la llamada a la API para cancelar en Mercado Pago
        // Por ahora, actualizamos el localStorage
        
        localStorage.removeItem('suscripcion_activa');
        localStorage.setItem('plan-actual', 'free');
        
        mostrarNotificacion('✅ Suscripción cancelada exitosamente', 'success');
        
        // Recargar página para actualizar interfaz
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error cancelando suscripción:', error);
        mostrarNotificacion('❌ Error al cancelar suscripción. Contacta soporte.', 'error');
    }
}

// Función para mostrar información de suscripción
function mostrarInfoSuscripcion() {
    const estado = verificarEstadoSuscripcion();
    const plan = PLANES_SUSCRIPCION[estado.plan];
    
    if (!estado.activa) {
        return `
            <div style="padding: 20px; background: #f8f9fa; border-radius: 10px; margin: 20px 0;">
                <h3>📋 Plan Actual: ${plan.nombre}</h3>
                <p>Plan gratuito - Sin suscripción activa</p>
                <button onclick="abrirGestionSuscripciones()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                    💳 Actualizar Plan
                </button>
            </div>
        `;
    }
    
    return `
        <div style="padding: 20px; background: #d4edda; border-radius: 10px; margin: 20px 0;">
            <h3>✅ Suscripción Activa: ${plan.nombre}</h3>
            <p><strong>Precio:</strong> $${plan.precio}/mes</p>
            <p><strong>Días restantes:</strong> ${estado.dias_restantes}</p>
            <p><strong>Próxima facturación:</strong> ${new Date(estado.fecha_vencimiento).toLocaleDateString('es-AR')}</p>
            <div style="margin-top: 15px;">
                <button onclick="abrirGestionSuscripciones()" style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                    📊 Gestionar
                </button>
                <button onclick="cancelarSuscripcion()" style="background: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">
                    🚫 Cancelar
                </button>
            </div>
        </div>
    `;
}

// Función para manejar notificaciones de pago (webhook)
async function manejarNotificacionPago(datos) {
    console.log('📧 Notificación de pago recibida:', datos);
    
    if (datos.type === 'payment' && datos.action === 'payment.created') {
        const paymentId = datos.data.id;
        
        try {
            // Aquí verificarías el estado del pago con la API de Mercado Pago
            // Por ahora, simulamos un pago exitoso
            
            const suscripcionPendiente = JSON.parse(localStorage.getItem('suscripcion_pendiente') || '{}');
            
            if (suscripcionPendiente.preferencia_id) {
                const suscripcionActiva = {
                    ...suscripcionPendiente,
                    estado: 'activa',
                    fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
                    payment_id: paymentId
                };
                
                localStorage.setItem('suscripcion_activa', JSON.stringify(suscripcionActiva));
                localStorage.setItem('plan-actual', suscripcionPendiente.plan);
                localStorage.removeItem('suscripcion_pendiente');
                
                mostrarNotificacion('✅ ¡Suscripción activada exitosamente!', 'success');
            }
            
        } catch (error) {
            console.error('❌ Error procesando notificación:', error);
        }
    }
}

// Función para mostrar transparencia de precios
function mostrarTransparenciaPrecios() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.8); z-index: 99999; display: flex; 
        align-items: center; justify-content: center; padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 15px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto;">
            <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: #374151;">💰 Filosofía de Ayuda - Precios Claros</h3>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            <div style="padding: 20px;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <h4 style="color: #374151; margin-bottom: 10px;">📊 Ejemplo: Venta de $1000</h4>
                    <p style="color: #666; margin-bottom: 15px;">Desglose completo de comisiones y neto para el vendedor:</p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545;">
                            <h5 style="margin: 0 0 10px 0; color: #dc3545;">Plan Free</h5>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Mercado Pago:</strong> $61.70 (6.17%)</p>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Cresalia:</strong> $29.20 (2.9%)</p>
                            <p style="margin: 5px 0; font-size: 14px; color: #28a745;"><strong>Neto Vendedor:</strong> $909.10</p>
                        </div>
                        
                        <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
                            <h5 style="margin: 0 0 10px 0; color: #007bff;">Plan Basic ($29/mes)</h5>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Mercado Pago:</strong> $61.70 (6.17%)</p>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Cresalia:</strong> $19.20 (1.9%)</p>
                            <p style="margin: 5px 0; font-size: 14px; color: #28a745;"><strong>Neto Vendedor:</strong> $919.10</p>
                        </div>
                        
                        <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #6f42c1;">
                            <h5 style="margin: 0 0 10px 0; color: #6f42c1;">Plan Pro ($79/mes)</h5>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Mercado Pago:</strong> $61.70 (6.17%)</p>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Cresalia:</strong> $12.20 (1.2%)</p>
                            <p style="margin: 5px 0; font-size: 14px; color: #28a745;"><strong>Neto Vendedor:</strong> $926.10</p>
                        </div>
                        
                        <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #fd7e14;">
                            <h5 style="margin: 0 0 10px 0; color: #fd7e14;">Plan Enterprise ($199/mes)</h5>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Mercado Pago:</strong> $61.70 (6.17%)</p>
                            <p style="margin: 5px 0; font-size: 14px;"><strong>Cresalia:</strong> $5.20 (0.5%)</p>
                            <p style="margin: 5px 0; font-size: 14px; color: #28a745;"><strong>Neto Vendedor:</strong> $933.10</p>
                        </div>
                    </div>
                </div>
                
                <div style="background: #e8f5e8; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <h4 style="color: #155724; margin-bottom: 10px;">✅ Compromiso de Transparencia</h4>
                    <ul style="color: #155724; margin: 0; padding-left: 20px;">
                        <li>Comisiones de Mercado Pago siempre visibles</li>
                        <li>Comisiones de Cresalia claramente especificadas</li>
                        <li>Cálculo automático del neto para el vendedor</li>
                        <li>Sin comisiones ocultas ni sorpresas</li>
                        <li>Desglose disponible en cada venta</li>
                    </ul>
                </div>
                
                <div style="background: #fff3cd; padding: 15px; border-radius: 10px;">
                    <h4 style="color: #856404; margin-bottom: 10px;">⚠️ Importante</h4>
                    <p style="color: #856404; margin: 0; font-size: 14px;">
                        <strong>Turnos y Comprobantes:</strong> Solo disponibles para planes Basic, Pro y Enterprise. 
                        Los usuarios del plan Free no tienen acceso a estas funcionalidades.
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Función para calcular comisiones en tiempo real
function calcularComisionesTiempoReal(monto, plan) {
    const planData = PLANES_SUSCRIPCION[plan] || PLANES_SUSCRIPCION.free;
    const comisionMP = (monto * TRANSPARENCIA_PRECIOS.mercadoPago.porcentaje / 100);
    const comisionCresalia = (monto * planData.comision_porcentaje / 100) + planData.comision_fija;
    const netoVendedor = monto - comisionMP - comisionCresalia;
    
    return {
        monto: monto,
        comisionMercadoPago: comisionMP,
        comisionCresalia: comisionCresalia,
        netoVendedor: netoVendedor,
        plan: planData.nombre,
        desglose: `Mercado Pago: $${comisionMP.toFixed(2)} (${TRANSPARENCIA_PRECIOS.mercadoPago.porcentaje}%) + Cresalia: $${comisionCresalia.toFixed(2)} (${planData.comision_porcentaje}%) = Neto: $${netoVendedor.toFixed(2)}`
    };
}

// Exportar funciones para uso global
window.mercadoPago = {
    inicializar: inicializarMercadoPago,
    procesarSuscripcion: procesarSuscripcion,
    verificarEstado: verificarEstadoSuscripcion,
    cancelar: cancelarSuscripcion,
    mostrarInfo: mostrarInfoSuscripcion,
    manejarNotificacion: manejarNotificacionPago,
    mostrarTransparencia: mostrarTransparenciaPrecios,
    calcularComisiones: calcularComisionesTiempoReal,
    PLANES: PLANES_SUSCRIPCION,
    TRANSPARENCIA: TRANSPARENCIA_PRECIOS
};

console.log('💳 Sistema de Mercado Pago para Cresalia cargado correctamente');
console.log('📋 Planes disponibles:', Object.keys(PLANES_SUSCRIPCION));
