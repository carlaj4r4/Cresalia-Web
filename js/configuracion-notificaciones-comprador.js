/**
 * 🔔 Panel de Configuración de Notificaciones para COMPRADORES
 * 
 * Sistema adaptado para que los compradores también puedan configurar
 * sus preferencias de notificaciones
 */

/**
 * Abrir modal de configuración de notificaciones para compradores
 */
function abrirConfiguracionNotificacionesComprador() {
    // Crear el modal si no existe
    let modal = document.getElementById('modalNotificacionesComprador');
    if (!modal) {
        modal = crearModalNotificacionesComprador();
        document.body.appendChild(modal);
    }
    
    // Mostrar modal
    modal.style.display = 'flex';
    
    // Inicializar estado
    if (typeof inicializarTabNotificacionesComprador === 'function') {
        inicializarTabNotificacionesComprador();
    }
}

/**
 * Cerrar modal
 */
function cerrarModalNotificacionesComprador() {
    const modal = document.getElementById('modalNotificacionesComprador');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Crear el modal de notificaciones
 */
function crearModalNotificacionesComprador() {
    const modal = document.createElement('div');
    modal.id = 'modalNotificacionesComprador';
    modal.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 10000;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 20px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); position: relative;">
            <div style="position: sticky; top: 0; background: linear-gradient(135deg, #EC4899, #F43F5E); color: white; padding: 30px; text-align: center; border-radius: 20px 20px 0 0; z-index: 10;">
                <button onclick="cerrarModalNotificacionesComprador()" style="position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">×</button>
                <h2 style="margin: 0; font-size: 28px;"><i class="fas fa-bell"></i> Configuración de Notificaciones</h2>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Personalizá qué notificaciones querés recibir</p>
            </div>
            
            <div style="padding: 40px;">
                <!-- Estado de Permisos -->
                <div id="estadoPermisoNotifComprador" style="margin-bottom: 30px; padding: 20px; border-radius: 12px; text-align: center;">
                    <!-- Se actualiza dinámicamente -->
                </div>
                
                <!-- Panel de Activación General -->
                <div style="background: #F8FAFC; padding: 24px; border-radius: 16px; border: 1px solid #E5E7EB; margin-bottom: 30px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 20px;">
                        <div>
                            <h4 style="margin: 0; color: #374151; font-size: 18px;">
                                <i class="fas fa-bell"></i> Activar Notificaciones Push
                            </h4>
                            <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">
                                Recibe alertas en tiempo real sobre tus compras y ofertas
                            </p>
                        </div>
                        <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                            <input type="checkbox" id="notificacionesActivasGeneralComprador" onchange="toggleNotificacionesGeneralesComprador(this.checked)">
                            <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                        </label>
                    </div>
                </div>
                
                <!-- Categorías de Notificaciones para Compradores -->
                <div id="categoriasNotificacionesComprador">
                    <h4 style="margin: 0 0 20px; color: #374151;">📋 Selecciona qué notificaciones querés recibir:</h4>
                    
                    <div style="display: grid; gap: 16px;">
                        <!-- Ofertas y Descuentos -->
                        <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #EC4899, #F43F5E); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-percentage" style="color: white; font-size: 18px;"></i>
                                    </div>
                                    <div>
                                        <h5 style="margin: 0; color: #374151; font-size: 16px;">Ofertas y Descuentos</h5>
                                        <p style="margin: 0; color: #6B7280; font-size: 13px;">Promociones especiales y descuentos exclusivos</p>
                                    </div>
                                </div>
                            </div>
                            <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                                <input type="checkbox" id="notifOfertasComprador" checked onchange="guardarPreferenciasNotifComprador()">
                                <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                            </label>
                        </div>
                        
                        <!-- Estado de Pedidos -->
                        <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3B82F6, #60A5FA); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-truck" style="color: white; font-size: 18px;"></i>
                                    </div>
                                    <div>
                                        <h5 style="margin: 0; color: #374151; font-size: 16px;">Estado de Pedidos</h5>
                                        <p style="margin: 0; color: #6B7280; font-size: 13px;">Actualizaciones sobre tus compras</p>
                                    </div>
                                </div>
                            </div>
                            <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                                <input type="checkbox" id="notifPedidosComprador" checked onchange="guardarPreferenciasNotifComprador()">
                                <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                            </label>
                        </div>
                        
                        <!-- Nuevos Productos -->
                        <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10B981, #059669); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-sparkles" style="color: white; font-size: 18px;"></i>
                                    </div>
                                    <div>
                                        <h5 style="margin: 0; color: #374151; font-size: 16px;">Nuevos Productos</h5>
                                        <p style="margin: 0; color: #6B7280; font-size: 13px;">De tus tiendas favoritas</p>
                                    </div>
                                </div>
                            </div>
                            <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                                <input type="checkbox" id="notifNuevosProductosComprador" checked onchange="guardarPreferenciasNotifComprador()">
                                <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                            </label>
                        </div>
                        
                        <!-- Mensajes de Vendedores -->
                        <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #8B5CF6, #7C3AED); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-comments" style="color: white; font-size: 18px;"></i>
                                    </div>
                                    <div>
                                        <h5 style="margin: 0; color: #374151; font-size: 16px;">Mensajes de Vendedores</h5>
                                        <p style="margin: 0; color: #6B7280; font-size: 13px;">Respuestas a tus consultas</p>
                                    </div>
                                </div>
                            </div>
                            <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                                <input type="checkbox" id="notifMensajesComprador" checked onchange="guardarPreferenciasNotifComprador()">
                                <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                            </label>
                        </div>
                        
                        <!-- Alertas de Precio -->
                        <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #F59E0B, #F97316); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-tag" style="color: white; font-size: 18px;"></i>
                                    </div>
                                    <div>
                                        <h5 style="margin: 0; color: #374151; font-size: 16px;">Alertas de Precio</h5>
                                        <p style="margin: 0; color: #6B7280; font-size: 13px;">Cuando baja el precio de productos que te interesan</p>
                                    </div>
                                </div>
                            </div>
                            <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                                <input type="checkbox" id="notifPreciosComprador" checked onchange="guardarPreferenciasNotifComprador()">
                                <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                            </label>
                        </div>
                        
                        <!-- Stock Disponible -->
                        <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #06B6D4, #0891B2); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-box" style="color: white; font-size: 18px;"></i>
                                    </div>
                                    <div>
                                        <h5 style="margin: 0; color: #374151; font-size: 16px;">Stock Disponible</h5>
                                        <p style="margin: 0; color: #6B7280; font-size: 13px;">Cuando vuelven productos que buscabas</p>
                                    </div>
                                </div>
                            </div>
                            <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                                <input type="checkbox" id="notifStockComprador" checked onchange="guardarPreferenciasNotifComprador()">
                                <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                            </label>
                        </div>
                        
                        <!-- Comunidad y Eventos -->
                        <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #EC4899, #DB2777); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-users" style="color: white; font-size: 18px;"></i>
                                    </div>
                                    <div>
                                        <h5 style="margin: 0; color: #374151; font-size: 16px;">Comunidad y Eventos</h5>
                                        <p style="margin: 0; color: #6B7280; font-size: 13px;">Actividades y novedades de la comunidad</p>
                                    </div>
                                </div>
                            </div>
                            <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                                <input type="checkbox" id="notifComunidadComprador" onchange="guardarPreferenciasNotifComprador()">
                                <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Botón de Prueba -->
                <div style="margin-top: 30px; text-align: center; padding: 20px; background: #FEF2F8; border-radius: 12px; border: 1px solid #FBCFE8;">
                    <h4 style="margin: 0 0 10px 0; color: #BE185D;">
                        <i class="fas fa-vial"></i> Probar Notificaciones
                    </h4>
                    <p style="margin: 0 0 15px 0; color: #6B7280; font-size: 14px;">
                        Enviá una notificación de prueba para verificar que funciona
                    </p>
                    <button onclick="probarNotificacionPushComprador()" style="background: linear-gradient(135deg, #EC4899, #F43F5E); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(236,72,153,0.3);">
                        <i class="fas fa-paper-plane"></i> Enviar Notificación de Prueba
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

/**
 * Guardar preferencias de notificaciones para compradores
 */
function guardarPreferenciasNotifComprador() {
    const preferencias = {
        activas: document.getElementById('notificacionesActivasGeneralComprador')?.checked ?? true,
        tipos: {
            ofertas: document.getElementById('notifOfertasComprador')?.checked ?? true,
            pedidos: document.getElementById('notifPedidosComprador')?.checked ?? true,
            nuevos_productos: document.getElementById('notifNuevosProductosComprador')?.checked ?? true,
            mensajes: document.getElementById('notifMensajesComprador')?.checked ?? true,
            precios: document.getElementById('notifPreciosComprador')?.checked ?? true,
            stock: document.getElementById('notifStockComprador')?.checked ?? true,
            comunidad: document.getElementById('notifComunidadComprador')?.checked ?? false
        },
        ultimaActualizacion: new Date().toISOString(),
        tipo_usuario: 'comprador'
    };
    
    localStorage.setItem('preferencias_notificaciones_cresalia_comprador', JSON.stringify(preferencias));
    console.log('✅ Preferencias de notificaciones guardadas (comprador)');
    
    // Mostrar feedback
    mostrarFeedbackGuardado();
}

/**
 * Inicializar tab de notificaciones para compradores
 */
function inicializarTabNotificacionesComprador() {
    // Verificar estado actual del permiso
    if ('Notification' in window) {
        actualizarEstadoPermisoComprador(Notification.permission);
    }
    
    // Cargar preferencias guardadas
    const preferencias = cargarPreferenciasNotifComprador();
    
    // Actualizar checkboxes
    if (document.getElementById('notificacionesActivasGeneralComprador')) {
        document.getElementById('notificacionesActivasGeneralComprador').checked = preferencias.activas;
    }
    
    if (document.getElementById('notifOfertasComprador')) {
        document.getElementById('notifOfertasComprador').checked = preferencias.tipos.ofertas;
    }
    if (document.getElementById('notifPedidosComprador')) {
        document.getElementById('notifPedidosComprador').checked = preferencias.tipos.pedidos;
    }
    if (document.getElementById('notifNuevosProductosComprador')) {
        document.getElementById('notifNuevosProductosComprador').checked = preferencias.tipos.nuevos_productos;
    }
    if (document.getElementById('notifMensajesComprador')) {
        document.getElementById('notifMensajesComprador').checked = preferencias.tipos.mensajes;
    }
    if (document.getElementById('notifPreciosComprador')) {
        document.getElementById('notifPreciosComprador').checked = preferencias.tipos.precios;
    }
    if (document.getElementById('notifStockComprador')) {
        document.getElementById('notifStockComprador').checked = preferencias.tipos.stock;
    }
    if (document.getElementById('notifComunidadComprador')) {
        document.getElementById('notifComunidadComprador').checked = preferencias.tipos.comunidad;
    }
    
    // Habilitar/deshabilitar categorías según estado general
    if (!preferencias.activas) {
        const checkboxes = document.querySelectorAll('#categoriasNotificacionesComprador input[type="checkbox"]');
        checkboxes.forEach(cb => cb.disabled = true);
        document.getElementById('categoriasNotificacionesComprador').style.opacity = '0.5';
    }
}

/**
 * Cargar preferencias de notificaciones para compradores
 */
function cargarPreferenciasNotifComprador() {
    const preferencias = localStorage.getItem('preferencias_notificaciones_cresalia_comprador');
    if (preferencias) {
        return JSON.parse(preferencias);
    }
    return {
        activas: true,
        tipos: {
            ofertas: true,
            pedidos: true,
            nuevos_productos: true,
            mensajes: true,
            precios: true,
            stock: true,
            comunidad: false
        }
    };
}

/**
 * Toggle notificaciones generales para compradores
 */
function toggleNotificacionesGeneralesComprador(activo) {
    if (activo) {
        // Solicitar permisos
        solicitarPermisosNotificaciones();
    } else {
        // Desactivar todas las notificaciones
        const checkboxes = document.querySelectorAll('#categoriasNotificacionesComprador input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = false;
            cb.disabled = true;
        });
    }
    
    // Actualizar estado visual
    document.getElementById('categoriasNotificacionesComprador').style.opacity = activo ? '1' : '0.5';
    
    guardarPreferenciasNotifComprador();
}

/**
 * Actualizar estado visual del permiso para compradores
 */
function actualizarEstadoPermisoComprador(permission) {
    const estadoDiv = document.getElementById('estadoPermisoNotifComprador');
    if (!estadoDiv) return;
    
    if (permission === 'granted') {
        estadoDiv.innerHTML = `
            <div style="background: #ECFDF5; border: 2px solid #10B981; border-radius: 12px; padding: 20px;">
                <i class="fas fa-check-circle" style="color: #10B981; font-size: 32px;"></i>
                <h4 style="margin: 10px 0 5px 0; color: #10B981;">✅ Notificaciones Activadas</h4>
                <p style="margin: 0; color: #6B7280; font-size: 14px;">Ya estás recibiendo notificaciones en tiempo real</p>
            </div>
        `;
    } else if (permission === 'denied') {
        estadoDiv.innerHTML = `
            <div style="background: #FEF2F2; border: 2px solid #EF4444; border-radius: 12px; padding: 20px;">
                <i class="fas fa-times-circle" style="color: #EF4444; font-size: 32px;"></i>
                <h4 style="margin: 10px 0 5px 0; color: #EF4444;">❌ Notificaciones Bloqueadas</h4>
                <p style="margin: 5px 0; color: #6B7280; font-size: 14px;">Los permisos están bloqueados en tu navegador</p>
                <button onclick="mostrarInstruccionesDesbloquear()" style="margin-top: 10px; background: #EF4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    📖 Ver cómo desbloquear
                </button>
            </div>
        `;
    } else {
        estadoDiv.innerHTML = `
            <div style="background: #FEF3C7; border: 2px solid #F59E0B; border-radius: 12px; padding: 20px;">
                <i class="fas fa-bell-slash" style="color: #F59E0B; font-size: 32px;"></i>
                <h4 style="margin: 10px 0 5px 0; color: #F59E0B;">⚠️ Permisos Pendientes</h4>
                <p style="margin: 5px 0; color: #6B7280; font-size: 14px;">Activá las notificaciones para recibir alertas en tiempo real</p>
                <button onclick="solicitarPermisosNotificaciones()" style="margin-top: 10px; background: #F59E0B; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    🔔 Activar Notificaciones
                </button>
            </div>
        `;
    }
}

/**
 * Probar notificación push para compradores
 */
async function probarNotificacionPushComprador() {
    // Verificar permisos
    if (Notification.permission !== 'granted') {
        const concedido = await solicitarPermisosNotificaciones();
        if (!concedido) return;
    }
    
    // Enviar notificación de prueba
    try {
        const notification = new Notification('🛍️ Notificación de Prueba - Comprador', {
            body: '¡Funciona perfectamente! Ya estás recibiendo notificaciones sobre tus compras.',
            icon: '/assets/logo/logo-cresalia.png',
            badge: '/assets/logo/logo-cresalia.png',
            tag: 'prueba-comprador',
            requireInteraction: false,
            vibrate: [200, 100, 200],
            data: {
                url: window.location.href,
                tipo: 'prueba'
            }
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
        
        console.log('✅ Notificación de prueba enviada (comprador)');
        
        // Mostrar feedback
        setTimeout(() => {
            alert('✅ ¡Notificación enviada!\n\nSi la viste, significa que todo funciona correctamente.');
        }, 500);
        
    } catch (error) {
        console.error('Error enviando notificación de prueba:', error);
        alert('❌ Error enviando notificación de prueba.\n\nVerifica que los permisos estén activados.');
    }
}

// Click fuera del modal para cerrar
document.addEventListener('click', function(e) {
    const modal = document.getElementById('modalNotificacionesComprador');
    if (modal && e.target === modal) {
        cerrarModalNotificacionesComprador();
    }
});

console.log('🔔 Sistema de notificaciones para compradores cargado');
