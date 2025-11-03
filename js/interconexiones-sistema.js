// ===== SISTEMA DE INTERCONEXIONES CRESALIA =====
// Interconecta bots IA, soportes de ayuda, ofertas y medios de pago

console.log('🔗 Iniciando sistema de interconexiones...');

// ===== INTERCONEXIÓN BOTS IA CON OFERTAS =====
const INTERCONEXION_BOTS = {
    // Función para notificar al bot IA sobre nuevas ofertas
    notificarBotIANuevaOferta: function(oferta) {
        console.log('🤖 Notificando bot IA sobre nueva oferta:', oferta);
        
        // Obtener configuración del bot IA
        const configBot = JSON.parse(localStorage.getItem('cresaliaBotConfig') || '{}');
        
        if (configBot.activo) {
            // Crear mensaje automático para el bot
            const mensajeBot = `
                🎉 ¡Nueva oferta disponible!
                
                ${oferta.titulo}
                ${oferta.descripcion}
                
                Precio: $${oferta.precio}
                Descuento: ${oferta.descuento}%
                
                ¡No te la pierdas! 🚀
            `;
            
            // Guardar mensaje en configuración del bot
            const configActualizada = {
                ...configBot,
                mensajeOferta: mensajeBot,
                ultimaOferta: new Date().toISOString()
            };
            
            localStorage.setItem('cresaliaBotConfig', JSON.stringify(configActualizada));
            
            console.log('✅ Bot IA actualizado con nueva oferta');
        }
    },
    
    // Función para notificar al soporte de ayuda sobre nuevas promociones
    notificarSoporteNuevaPromo: function(promocion) {
        console.log('🆘 Notificando soporte de ayuda sobre nueva promoción:', promocion);
        
        // Obtener configuración del soporte
        const configSoporte = JSON.parse(localStorage.getItem('soporteAyudaConfig') || '{}');
        
        if (configSoporte.activo) {
            // Crear respuesta automática para el soporte
            const respuestaSoporte = `
                📢 Nueva promoción disponible:
                
                ${promocion.nombre}
                ${promocion.descripcion}
                
                Válida hasta: ${promocion.fechaFin}
                Código: ${promocion.codigo}
                
                ¡Aprovecha esta oportunidad! 💰
            `;
            
            // Guardar respuesta en configuración del soporte
            const configActualizada = {
                ...configSoporte,
                respuestaPromo: respuestaSoporte,
                ultimaPromo: new Date().toISOString()
            };
            
            localStorage.setItem('soporteAyudaConfig', JSON.stringify(configActualizada));
            
            console.log('✅ Soporte de ayuda actualizado con nueva promoción');
        }
    }
};

// ===== MEDIOS DE PAGO PARA TIENDAS =====
const MEDIOS_PAGO_TIENDAS = {
    // Medios de pago disponibles para tiendas
    mediosDisponibles: [
        {
            id: 'mercadopago',
            nombre: 'Mercado Pago',
            descripcion: 'Pagos con tarjeta, transferencia y efectivo',
            comision: '3.49% + $0.00',
            activacion: 'Inmediata',
            icono: '💳',
            color: '#00B4DB'
        },
        {
            id: 'transferencia',
            nombre: 'Transferencia Bancaria',
            descripcion: 'Transferencia directa a tu cuenta',
            comision: 'Sin comisión',
            activacion: 'Inmediata',
            icono: '🏦',
            color: '#28a745'
        },
        {
            id: 'efectivo',
            nombre: 'Efectivo',
            descripcion: 'Pago en efectivo al recibir',
            comision: 'Sin comisión',
            activacion: 'Inmediata',
            icono: '💵',
            color: '#ffc107'
        },
        {
            id: 'crypto',
            nombre: 'Criptomonedas',
            descripcion: 'Bitcoin, Ethereum y otras criptos',
            comision: '1-2%',
            activacion: '24-48 horas',
            icono: '₿',
            color: '#f7931a'
        }
    ],
    
    // Función para mostrar medios de pago disponibles
    mostrarMediosPago: function() {
        console.log('💳 Mostrando medios de pago para tiendas...');
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.8); z-index: 99999; display: flex; 
            align-items: center; justify-content: center; padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 15px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto;">
                <div style="padding: 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; color: #374151;">💳 Medios de Pago para tu Tienda</h3>
                    <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
                </div>
                <div style="padding: 20px;">
                    <div style="display: grid; gap: 20px;">
                        ${this.mediosDisponibles.map(medio => `
                            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border-left: 4px solid ${medio.color};">
                                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                                    <div style="width: 50px; height: 50px; background: ${medio.color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                                        ${medio.icono}
                                    </div>
                                    <div style="flex: 1;">
                                        <h4 style="margin: 0; color: #374151;">${medio.nombre}</h4>
                                        <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 0.9rem;">${medio.descripcion}</p>
                                    </div>
                                    <button onclick="activarMedioPago('${medio.id}')" style="background: ${medio.color}; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
                                        Activar
                                    </button>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; background: white; padding: 15px; border-radius: 8px;">
                                    <div>
                                        <strong style="color: #374151;">Comisión:</strong>
                                        <p style="margin: 5px 0 0 0; color: #4b5563; font-size: 0.9rem;">${medio.comision}</p>
                                    </div>
                                    <div>
                                        <strong style="color: #374151;">Activación:</strong>
                                        <p style="margin: 5px 0 0 0; color: #4b5563; font-size: 0.9rem;">${medio.activacion}</p>
                                    </div>
                                    <div>
                                        <strong style="color: #374151;">Estado:</strong>
                                        <p style="margin: 5px 0 0 0; color: #4b5563; font-size: 0.9rem;" id="estado-${medio.id}">Inactivo</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; border-left: 4px solid #22c55e; margin-top: 20px;">
                        <h4 style="color: #155724; margin-bottom: 10px;">💡 Consejos para Elegir Medios de Pago</h4>
                        <ul style="color: #155724; margin: 0; padding-left: 20px;">
                            <li><strong>Mercado Pago:</strong> Ideal para ventas online, acepta todas las tarjetas</li>
                            <li><strong>Transferencia:</strong> Perfecto para ventas grandes, sin comisiones</li>
                            <li><strong>Efectivo:</strong> Ideal para ventas presenciales y locales</li>
                            <li><strong>Criptomonedas:</strong> Para clientes tech-savvy, pagos internacionales</li>
                        </ul>
                    </div>
                    
                    <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; border-left: 4px solid #0ea5e9; margin-top: 20px;">
                        <h4 style="color: #0c4a6e; margin-bottom: 15px;">💳 Configurar Datos de Pago</h4>
                        <div style="display: grid; gap: 15px;">
                            <div>
                                <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 600;">Alias de Mercado Pago:</label>
                                <input type="text" id="aliasMercadoPago" placeholder="ej: mi.tienda.cresalia" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.9rem;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 600;">CBU (Clave Bancaria Uniforme):</label>
                                <input type="text" id="cbu" placeholder="0000000000000000000000" maxlength="22" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.9rem;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; color: #374151; font-weight: 600;">CVU (Clave Virtual Uniforme):</label>
                                <input type="text" id="cvu" placeholder="0000000000000000000000" maxlength="22" style="width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.9rem;">
                            </div>
                            <button onclick="guardarDatosPago()" style="background: #0ea5e9; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; margin-top: 10px;">
                                💾 Guardar Datos de Pago
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    // Función para activar un medio de pago
    activarMedioPago: function(medioId) {
        console.log('✅ Activando medio de pago:', medioId);
        
        // Obtener medios activos
        const mediosActivos = JSON.parse(localStorage.getItem('mediosPagoActivos') || '[]');
        
        if (!mediosActivos.includes(medioId)) {
            mediosActivos.push(medioId);
            localStorage.setItem('mediosPagoActivos', JSON.stringify(mediosActivos));
            
            // Actualizar estado en la interfaz
            const estadoElement = document.getElementById(`estado-${medioId}`);
            if (estadoElement) {
                estadoElement.textContent = 'Activo';
                estadoElement.style.color = '#22c55e';
            }
            
            // Mostrar notificación
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('✅ Medio de pago activado exitosamente', 'success');
            }
        }
    },
    
    // Función para guardar datos de pago
    guardarDatosPago: function() {
        const aliasMercadoPago = document.getElementById('aliasMercadoPago').value.trim();
        const cbu = document.getElementById('cbu').value.trim();
        const cvu = document.getElementById('cvu').value.trim();
        
        if (!aliasMercadoPago && !cbu && !cvu) {
            alert('⚠️ Por favor, completa al menos un campo de datos de pago');
            return;
        }
        
        const datosPago = {
            aliasMercadoPago: aliasMercadoPago,
            cbu: cbu,
            cvu: cvu,
            fechaActualizacion: new Date().toISOString()
        };
        
        localStorage.setItem('datos_pago_tienda', JSON.stringify(datosPago));
        
        console.log('✅ Datos de pago guardados:', datosPago);
        
        // Mostrar notificación
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('💳 Datos de pago guardados correctamente', 'success');
        } else {
            alert('✅ Datos de pago guardados correctamente');
        }
    }
};

// ===== INTERCONEXIÓN AUTOMÁTICA =====
const INTERCONEXION_AUTOMATICA = {
    // Función para configurar interconexiones automáticas
    configurarInterconexiones: function() {
        console.log('🔗 Configurando interconexiones automáticas...');
        
        // Observar cambios en ofertas
        this.observarCambiosOfertas();
        
        // Observar cambios en promociones
        this.observarCambiosPromociones();
        
        console.log('✅ Interconexiones automáticas configuradas');
    },
    
    // Observar cambios en ofertas
    observarCambiosOfertas: function() {
        // Crear observador para cambios en localStorage
        const observer = new MutationObserver(() => {
            const ofertas = JSON.parse(localStorage.getItem('ofertas_tienda') || '[]');
            const ultimaOferta = localStorage.getItem('ultimaOfertaNotificada');
            
            if (ofertas.length > 0) {
                const ofertaMasReciente = ofertas[ofertas.length - 1];
                if (ofertaMasReciente.id !== ultimaOferta) {
                    // Notificar al bot IA
                    INTERCONEXION_BOTS.notificarBotIANuevaOferta(ofertaMasReciente);
                    localStorage.setItem('ultimaOfertaNotificada', ofertaMasReciente.id);
                }
            }
        });
        
        // Observar cambios en el DOM
        observer.observe(document.body, { childList: true, subtree: true });
    },
    
    // Observar cambios en promociones
    observarCambiosPromociones: function() {
        // Crear observador para cambios en localStorage
        const observer = new MutationObserver(() => {
            const promociones = JSON.parse(localStorage.getItem('promociones_tienda') || '[]');
            const ultimaPromo = localStorage.getItem('ultimaPromoNotificada');
            
            if (promociones.length > 0) {
                const promoMasReciente = promociones[promociones.length - 1];
                if (promoMasReciente.id !== ultimaPromo) {
                    // Notificar al soporte de ayuda
                    INTERCONEXION_BOTS.notificarSoporteNuevaPromo(promoMasReciente);
                    localStorage.setItem('ultimaPromoNotificada', promoMasReciente.id);
                }
            }
        });
        
        // Observar cambios en el DOM
        observer.observe(document.body, { childList: true, subtree: true });
    }
};

// ===== FUNCIONES GLOBALES =====
window.mostrarMediosPago = MEDIOS_PAGO_TIENDAS.mostrarMediosPago.bind(MEDIOS_PAGO_TIENDAS);
window.activarMedioPago = MEDIOS_PAGO_TIENDAS.activarMedioPago.bind(MEDIOS_PAGO_TIENDAS);
window.guardarDatosPago = MEDIOS_PAGO_TIENDAS.guardarDatosPago.bind(MEDIOS_PAGO_TIENDAS);

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    INTERCONEXION_AUTOMATICA.configurarInterconexiones();
});

console.log('🔗 Sistema de interconexiones cargado correctamente');

