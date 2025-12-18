/**
 * 🔔 Script para inyectar dinámicamente el tab de Notificaciones
 * 
 * Este script crea el contenido del tab de notificaciones si no existe
 */

(function() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inyectarTabNotificaciones);
    } else {
        inyectarTabNotificaciones();
    }
    
    function inyectarTabNotificaciones() {
        // Verificar si ya existe el contenido del tab
        if (document.getElementById('tabContenidoNotificaciones')) {
            console.log('✅ Tab de notificaciones ya existe');
            return;
        }
        
        // Buscar el contenedor padre
        const contenedorConfig = document.getElementById('contenidoConfiguracion');
        if (!contenedorConfig) {
            console.warn('⚠️ No se encontró contenedor de configuración');
            return;
        }
        
        // Crear el HTML del tab
        const tabHTML = `
<div id="tabContenidoNotificaciones" style="display: none;">
    <h3 style="margin: 0 0 20px; color: #374151;">🔔 Configuración de Notificaciones Push</h3>
    
    <!-- Estado de Permisos -->
    <div id="estadoPermisoNotif" style="margin-bottom: 30px; padding: 20px; border-radius: 12px; text-align: center;">
        <!-- Se actualiza dinámicamente -->
    </div>
    
    <!-- Panel de Activación General -->
    <div style="background: #F8FAFC; padding: 24px; border-radius: 16px; border: 1px solid #E5E7EB; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div>
                <h4 style="margin: 0; color: #374151; font-size: 18px;">
                    <i class="fas fa-bell"></i> Activar Notificaciones Push
                </h4>
                <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">
                    Recibe alertas en tiempo real en tu dispositivo
                </p>
            </div>
            <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                <input type="checkbox" id="notificacionesActivasGeneral" onchange="toggleNotificacionesGenerales(this.checked)">
                <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
            </label>
        </div>
    </div>
    
    <!-- Categorías de Notificaciones -->
    <div id="categoriasNotificaciones">
        <h4 style="margin: 0 0 20px; color: #374151;">📋 Selecciona qué notificaciones quieres recibir:</h4>
        
        <div style="display: grid; gap: 16px;">
            <!-- Ventas -->
            <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #10B981, #059669); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-shopping-cart" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <h5 style="margin: 0; color: #374151; font-size: 16px;">Nuevas Ventas</h5>
                            <p style="margin: 0; color: #6B7280; font-size: 13px;">Cuando alguien compra tus productos</p>
                        </div>
                    </div>
                </div>
                <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                    <input type="checkbox" id="notifVentas" checked onchange="guardarPreferenciasNotif()">
                    <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                </label>
            </div>
            
            <!-- Mensajes -->
            <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3B82F6, #60A5FA); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-comments" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <h5 style="margin: 0; color: #374151; font-size: 16px;">Mensajes de Clientes</h5>
                            <p style="margin: 0; color: #6B7280; font-size: 13px;">Cuando te escriben tus clientes</p>
                        </div>
                    </div>
                </div>
                <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                    <input type="checkbox" id="notifMensajes" checked onchange="guardarPreferenciasNotif()">
                    <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                </label>
            </div>
            
            <!-- Turnos -->
            <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #F59E0B, #F97316); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-calendar-check" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <h5 style="margin: 0; color: #374151; font-size: 16px;">Turnos Reservados</h5>
                            <p style="margin: 0; color: #6B7280; font-size: 13px;">Cuando reservan o cancelan turnos</p>
                        </div>
                    </div>
                </div>
                <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                    <input type="checkbox" id="notifTurnos" checked onchange="guardarPreferenciasNotif()">
                    <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                </label>
            </div>
            
            <!-- Stock Bajo -->
            <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #EF4444, #F43F5E); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-exclamation-triangle" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <h5 style="margin: 0; color: #374151; font-size: 16px;">Stock Bajo</h5>
                            <p style="margin: 0; color: #6B7280; font-size: 13px;">Alertas cuando el stock es crítico</p>
                        </div>
                    </div>
                </div>
                <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                    <input type="checkbox" id="notifStock" checked onchange="guardarPreferenciasNotif()">
                    <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                </label>
            </div>
            
            <!-- Pagos -->
            <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #8B5CF6, #7C3AED); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-credit-card" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <h5 style="margin: 0; color: #374151; font-size: 16px;">Pagos Recibidos</h5>
                            <p style="margin: 0; color: #6B7280; font-size: 13px;">Cuando se confirma un pago</p>
                        </div>
                    </div>
                </div>
                <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                    <input type="checkbox" id="notifPagos" checked onchange="guardarPreferenciasNotif()">
                    <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                </label>
            </div>
            
            <!-- Comentarios/Reviews -->
            <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #F59E0B, #D97706); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-star" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <h5 style="margin: 0; color: #374151; font-size: 16px;">Comentarios y Reseñas</h5>
                            <p style="margin: 0; color: #6B7280; font-size: 13px;">Cuando te dejan comentarios o reviews</p>
                        </div>
                    </div>
                </div>
                <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                    <input type="checkbox" id="notifComentarios" checked onchange="guardarPreferenciasNotif()">
                    <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                </label>
            </div>
            
            <!-- Promociones -->
            <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #EC4899, #F472B6); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-percentage" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <h5 style="margin: 0; color: #374151; font-size: 16px;">Promociones de Cresalia</h5>
                            <p style="margin: 0; color: #6B7280; font-size: 13px;">Tips y promociones especiales</p>
                        </div>
                    </div>
                </div>
                <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                    <input type="checkbox" id="notifPromociones" onchange="guardarPreferenciasNotif()">
                    <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                </label>
            </div>
            
            <!-- Seguimientos -->
            <div class="notif-category" style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #06B6D4, #0891B2); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-user-plus" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <h5 style="margin: 0; color: #374151; font-size: 16px;">Nuevos Seguidores</h5>
                            <p style="margin: 0; color: #6B7280; font-size: 13px;">Cuando alguien te empieza a seguir</p>
                        </div>
                    </div>
                </div>
                <label class="switch-notif" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                    <input type="checkbox" id="notifSeguidores" checked onchange="guardarPreferenciasNotif()">
                    <span class="slider-notif" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px;"></span>
                </label>
            </div>
        </div>
    </div>
    
    <!-- Botón de Prueba -->
    <div style="margin-top: 30px; text-align: center; padding: 20px; background: #F0F9FF; border-radius: 12px; border: 1px solid #BAE6FD;">
        <h4 style="margin: 0 0 10px 0; color: #0369A1;">
            <i class="fas fa-vial"></i> Probar Notificaciones
        </h4>
        <p style="margin: 0 0 15px 0; color: #6B7280; font-size: 14px;">
            Envía una notificación de prueba para verificar que funciona
        </p>
        <button onclick="probarNotificacionPush()" style="background: linear-gradient(135deg, #3B82F6, #60A5FA); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
            <i class="fas fa-paper-plane"></i> Enviar Notificación de Prueba
        </button>
    </div>
    
    <!-- CSS para los switches -->
    <style>
        .switch-notif input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .slider-notif:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        
        .switch-notif input:checked + .slider-notif {
            background-color: #10B981;
        }
        
        .switch-notif input:checked + .slider-notif:before {
            transform: translateX(26px);
        }
        
        .notif-category {
            transition: all 0.3s;
        }
        
        .notif-category:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transform: translateX(5px);
        }
    </style>
</div>
        `;
        
        // Insertar al inicio del contenedor
        contenedorConfig.insertAdjacentHTML('afterbegin', tabHTML);
        
        console.log('✅ Tab de notificaciones inyectado correctamente');
        
        // Inicializar
        if (typeof inicializarTabNotificaciones === 'function') {
            inicializarTabNotificaciones();
        }
    }
    
    // Interceptar la función mostrarTabConfiguracion si existe
    const originalMostrarTab = window.mostrarTabConfiguracion;
    if (originalMostrarTab) {
        window.mostrarTabConfiguracion = function(tab) {
            // Llamar función original
            originalMostrarTab(tab);
            
            // Si es el tab de notificaciones, inicializar
            if (tab === 'notificaciones' && typeof inicializarTabNotificaciones === 'function') {
                setTimeout(() => inicializarTabNotificaciones(), 100);
            }
        };
    }
})();

console.log('🔔 Script de inyección de tab de notificaciones cargado');
