# 🔔 Agregar Tab de Notificaciones en Admin Panel

## ✅ Archivos Creados

1. ✅ `js/configuracion-notificaciones-panel.js` - Sistema completo
2. ✅ `perfil-comprador.html` eliminado (usamos demo-buyer-interface.html)
3. ✅ Navegación adaptativa implementada en `index-cresalia.html`

---

## 🎯 Lo que Falta Agregar Manualmente

El tab de "Notificaciones" ya está agregado en los botones, pero falta el contenido del tab.

### **Paso 1: Buscar en `admin-final.html`**

Busca esta línea (aproximadamente línea 4645-4665):

```html
<div id="tabContenidoMultimedia" style="display: none;">
    <h3 style="margin: 0 0 20px; color: #374151;">📸 Multimedia</h3>
```

### **Paso 2: ANTES de esa línea, agregar:**

```html
<div id="tabContenidoNotificaciones" style="display: none;">
    <h3 style="margin: 0 0 20px; color: #374151;">🔔 Configuración de Notificaciones Push</h3>
    
    <!-- Estado de Permisos -->
    <div id="estadoPermisoNotif" style="margin-bottom: 30px; padding: 20px; border-radius: 12px; text-align: center;">
        <!-- Se actualiza dinámicamente -->
    </div>
    
    <!-- Panel de Activación General -->
    <div style="background: #F8FAFC; padding: 24px; border-radius: 16px; border: 1px solid #E5E7EB; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
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
                    <div style="display: flex; align-items: center; gap: 10px;">
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
                    <div style="display: flex; align-items: center; gap: 10px;">
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
                    <div style="display: flex; align-items: center; gap: 10px;">
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
                    <div style="display: flex; align-items: center; gap: 10px;">
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
                    <div style="display: flex; align-items: center; gap: 10px;">
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
                    <div style="display: flex; align-items: center; gap: 10px;">
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
                    <div style="display: flex; align-items: center; gap: 10px;">
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
                    <div style="display: flex; align-items: center; gap: 10px;">
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
        
        .slider-notif input:checked + .slider-notif {
            background-color: #10B981;
        }
        
        .slider-notif input:checked + .slider-notif:before {
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
```

### **Paso 3: Buscar la función `mostrarTabConfiguracion`**

Busca una función que se llame así (probablemente en la parte de JavaScript del archivo).

Agregar el caso para 'notificaciones':

```javascript
function mostrarTabConfiguracion(tab) {
    // Ocultar todos los tabs
    const tabs = ['Informacion', 'Ubicacion', 'Empresa', 'Multimedia', 'Notificaciones', 'Bot', 'Ayuda', 'Contenido'];
    tabs.forEach(t => {
        const elemento = document.getElementById(`tabContenido${t}`);
        const boton = document.getElementById(`tab${t}`);
        if (elemento) elemento.style.display = 'none';
        if (boton) {
            boton.style.background = '#E5E7EB';
            boton.style.color = '#374151';
        }
    });
    
    // Mostrar el tab seleccionado
    const tabName = tab.charAt(0).toUpperCase() + tab.slice(1);
    const elemento = document.getElementById(`tabContenido${tabName}`);
    const boton = document.getElementById(`tab${tabName}`);
    
    if (elemento) elemento.style.display = 'block';
    if (boton) {
        boton.style.background = '#667eea';
        boton.style.color = 'white';
    }
    
    // Si es el tab de notificaciones, inicializar
    if (tab === 'notificaciones') {
        inicializarTabNotificaciones();
    }
}
```

---

## 🎯 Características del Sistema

### **Control Total**:
- ✅ Activar/desactivar notificaciones generales
- ✅ Control granular por categoría:
  - Nuevas ventas
  - Mensajes de clientes
  - Turnos reservados
  - Stock bajo
  - Pagos recibidos
  - Comentarios y reseñas
  - Promociones de Cresalia
  - Nuevos seguidores

### **Estado Visual**:
- 🟢 **Verde**: Permisos concedidos y activos
- 🔴 **Rojo**: Permisos bloqueados
- 🟡 **Amarillo**: Permisos pendientes

### **Botón de Prueba**:
- Envía notificación de prueba para verificar que funciona
- Feedback inmediato

### **Switches Animados**:
- iOS-style toggles
- Feedback visual al cambiar
- Se guardan automáticamente

---

## 🚀 Funcionalidad

**Al cambiar cualquier opción**:
1. Se guarda automáticamente en `localStorage`
2. Se actualiza el sistema de notificaciones
3. Se muestra feedback de guardado
4. Se respeta la preferencia en todas las notificaciones futuras

**Al hacer click en "Probar"**:
1. Verifica permisos
2. Envía notificación de prueba
3. Muestra si funcionó o no

---

## 💡 Ventajas

- ✅ **Fácil de usar**: Switches simples
- ✅ **Visual**: Iconos y colores por categoría
- ✅ **Responsive**: Funciona en mobile
- ✅ **Guardado automático**: Sin botón "Guardar"
- ✅ **Feedback claro**: Muestra estado actual
- ✅ **Prueba integrada**: Botón de test

---

## 📋 Resumen

**Archivos modificados**:
1. ✅ `tiendas/ejemplo-tienda/admin-final.html` - Agregado botón tab "Notificaciones"
2. ✅ `tiendas/ejemplo-tienda/admin-final.html` - Agregados scripts necesarios
3. ✅ `js/configuracion-notificaciones-panel.js` - Sistema completo creado

**Falta agregar manualmente**:
- HTML del tab de notificaciones (copiar del código de arriba)
- Actualizar función `mostrarTabConfiguracion` (si existe)

---

¿Querés que busque dónde insertar exactamente el HTML o preferís hacerlo manualmente con las instrucciones de arriba?
