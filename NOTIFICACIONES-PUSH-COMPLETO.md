# 🔔 Sistema de Notificaciones Push - Cresalia

## ❓ **PROBLEMA RESUELTO: Múltiples Solicitudes de Permisos**

### **Problema:**
En algunos celulares aparecían hasta 3 veces las solicitudes de permiso para notificaciones push.

### **Causa:**
Múltiples sistemas estaban solicitando permisos independientemente:
1. `js/sistema-notificaciones-push.js` - Sistema principal
2. `index-cresalia.html` - Solicitud manual después de 2 segundos
3. `js/sistema-alertas-comunidades.js` - Sistema de alertas
4. `js/sistema-alertas-emergencia-global.js` - Sistema de emergencias

### **Solución Implementada:**
✅ **Sistema centralizado de permisos:**
- Solo `js/sistema-notificaciones-push.js` solicita permisos
- Usa `sessionStorage` para evitar múltiples solicitudes en la misma sesión
- Los demás sistemas solo verifican si ya están concedidos
- Espera 2 segundos antes de solicitar (mejor UX)

---

## 📋 **NOTIFICACIONES PUSH ACTUALES**

### **1. Notificaciones de Bienvenida** 🎉
- **Cuándo:** Al conceder permisos por primera vez
- **Mensaje:** "¡Bienvenido a Cresalia! Las notificaciones están activadas."
- **Tipo:** General

### **2. Notificaciones de Turnos** 📅
- **Cuándo:** 
  - 30 minutos antes del turno
  - 1 hora antes del turno
- **Mensaje:** "Tu turno con [cliente] es en [tiempo]"
- **Tipo:** Turnos (configurable)

### **3. Notificaciones de Pagos** 💳
- **Cuándo:** Cuando hay pagos pendientes de confirmar
- **Mensaje:** "Tienes [X] pagos pendientes"
- **Tipo:** Pagos (deshabilitado por defecto)

### **4. Notificaciones de Ofertas** 🎉
- **Cuándo:** Cuando hay ofertas activas
- **Mensaje:** "Tienes [X] ofertas activas"
- **Tipo:** Ofertas (deshabilitado por defecto)

### **5. Notificaciones de Comentarios en Foros** 💬
- **Cuándo:** Cuando alguien comenta en tu post
- **Mensaje:** "Nuevo comentario en [título del post]"
- **Mensaje completo:** "[Autor] comentó: [primeros 50 caracteres]..."
- **Tipo:** Foros (habilitado por defecto)

### **6. Notificaciones de Alertas de Emergencia** 🚨
- **Cuándo:** Cuando se reporta una emergencia en tu zona
- **Mensaje:** "Alerta de Emergencia - [tipo]"
- **Tipo:** Emergencias

### **7. Notificaciones de Chat (Brevo)** 💬 **[NUEVO]**
- **Cuándo:** Cuando llega un nuevo mensaje en el widget de chat
- **Mensaje:** "Nuevo mensaje en Cresalia"
- **Condiciones:**
  - Solo si la ventana está en segundo plano (`document.hidden`)
  - Solo si las notificaciones de chat están habilitadas
  - Verifica cada 30 segundos si hay mensajes no leídos
- **Tipo:** Chat (habilitado por defecto)

---

## ⚙️ **CONFIGURACIÓN**

### **Configuración por Defecto:**
```javascript
{
    activas: true,
    sonido: false,        // Sin sonido por defecto
    vibrar: false,        // Sin vibración por defecto
    tipos: {
        turnos: true,     // ✅ Habilitado
        pagos: false,     // ❌ Deshabilitado
        ofertas: false,   // ❌ Deshabilitado
        general: false,   // ❌ Deshabilitado
        chat: true        // ✅ Habilitado (nuevo)
    }
}
```

### **Cómo Configurar:**
1. **Desde el código:** Usar `window.configurarNotificaciones()`
2. **Desde localStorage:** Editar `configuracionNotificaciones`
3. **Deshabilitar chat:** `localStorage.setItem('notificaciones_chat_brevo', 'false')`

---

## 🔧 **CÓMO FUNCIONA EL WIDGET DE CHAT**

### **Problema Reportado:**
El widget de chat (Brevo) no enviaba notificaciones push aunque se hubieran permitido.

### **Solución Implementada:**
1. **Observador de cambios:** Detecta cuando aparecen nuevos mensajes en el widget
2. **Verificación periódica:** Cada 30 segundos verifica si hay mensajes no leídos (solo si la ventana está en segundo plano)
3. **Eventos personalizados:** Escucha eventos `brevo-message-received` si el widget los emite
4. **Condiciones:**
   - Solo envía notificaciones si la ventana está en segundo plano
   - Solo si las notificaciones de chat están habilitadas
   - Solo si hay permisos concedidos

### **Limitaciones:**
- El widget oficial de Brevo no expone eventos nativos para nuevos mensajes
- La solución usa observadores y verificación periódica como alternativa
- Funciona mejor cuando la ventana está en segundo plano

---

## 📝 **RESUMEN DE CAMBIOS**

### **Archivos Modificados:**
1. ✅ `js/sistema-notificaciones-push.js`
   - Sistema centralizado de permisos
   - Prevención de múltiples solicitudes
   - Mejor manejo de errores

2. ✅ `js/sistema-alertas-comunidades.js`
   - Removida solicitud de permisos
   - Solo verifica si ya están concedidos

3. ✅ `js/sistema-alertas-emergencia-global.js`
   - Removida solicitud de permisos
   - Solo verifica si ya están concedidos

4. ✅ `index-cresalia.html`
   - Removida solicitud manual de permisos
   - Confía en el sistema centralizado

5. ✅ `js/widget-brevo-chat.js`
   - Agregado sistema de notificaciones para chat
   - Observador de cambios en el widget
   - Verificación periódica de mensajes no leídos

---

## ✅ **RESULTADO**

- ✅ **Una sola solicitud de permisos** por sesión
- ✅ **Notificaciones de chat funcionando** cuando la ventana está en segundo plano
- ✅ **Sistema centralizado** y fácil de mantener
- ✅ **Mejor experiencia de usuario** sin solicitudes repetidas

---

**Última actualización:** 2025-01-27

