# 🔧 Solución: Error "alerta_id es requerido"

## ❌ Problema

La Edge Function muestra el error: **"alerta_id es requerido"**

Esto significa que:
- ✅ La Edge Function **SÍ está funcionando** (se ejecutó correctamente)
- ❌ Pero el request **no incluye** el `alerta_id` en el body

---

## 🔍 Causa Raíz

Cuando se crea una alerta desde `panel-gestion-alertas-global.html`, el código:

1. ✅ Inserta la alerta en Supabase correctamente
2. ❌ **NO dispara** el evento `alerta-creada`
3. ❌ Por lo tanto, el sistema de emails **nunca se activa**

El sistema de emails (`sistema-envio-emails-alertas.js`) escucha el evento `alerta-creada` para enviar los emails automáticamente. Si el evento no se dispara, nunca se llama a la Edge Function.

---

## ✅ Solución Implementada

### **1. Agregar disparo de evento después de crear alerta**

En `panel-gestion-alertas-global.html`, después de crear la alerta:

```javascript
// Después de insertar la alerta
const alertaCreada = data[0];

// 🔥 DISPARAR EVENTO para que se envíen los emails automáticamente
document.dispatchEvent(new CustomEvent('alerta-creada', {
    detail: alertaCreada  // ← Esto incluye el ID de la alerta
}));
```

### **2. Verificar que el sistema de emails esté cargado**

El archivo `js/sistema-envio-emails-alertas.js` debe estar incluido en el HTML:

```html
<script src="js/sistema-envio-emails-alertas.js"></script>
```

---

## 🧪 Cómo Verificar

### **Test 1: Crear una alerta y ver logs**

1. Abrir **DevTools** (F12) → **Console**
2. Ir a `panel-gestion-alertas-global.html`
3. Crear una nueva alerta
4. Verificar en la consola:
   - ✅ `📧 Disparando evento alerta-creada para ID: X`
   - ✅ `📧 Nueva alerta creada (ID: X). Enviando emails...`
   - ✅ `📧 Enviando request a Edge Function: { alerta_id: X }`
   - ✅ `✅ Emails enviados: { usuarios_notificados: ... }`

### **Test 2: Ver logs de Edge Function**

1. Ir a **Supabase Dashboard** → **Edge Functions** → **enviar-emails-alerta**
2. Click en **"Logs"**
3. Crear una alerta
4. Verificar logs:
   - ✅ `📧 Procesando alerta ID: X` (NO debería decir "alerta_id es requerido")

---

## 📋 Checklist de Verificación

- [ ] `panel-gestion-alertas-global.html` dispara evento `alerta-creada` después de crear alerta
- [ ] `js/sistema-envio-emails-alertas.js` está incluido en el HTML
- [ ] El evento incluye `detail: alertaCreada` con el ID
- [ ] Los logs muestran que se envía el request con `alerta_id`

---

## 💡 ¿Qué es el `alerta_id`?

El `alerta_id` es el **ID único** de la alerta que se crea en la tabla `alertas_emergencia_comunidades`.

- Se genera automáticamente por Supabase cuando insertas una alerta
- Es un número (BIGSERIAL) que identifica cada alerta
- Se necesita para:
  - Buscar los datos de la alerta
  - Buscar usuarios cercanos a notificar
  - Registrar qué emails se enviaron

---

## 🎯 Resultado Esperado

Después de estos cambios:

✅ **Al crear una alerta** → Se dispara evento `alerta-creada`  
✅ **El sistema de emails escucha** → Llama a Edge Function con `alerta_id`  
✅ **Edge Function recibe** → `{"alerta_id": 123}`  
✅ **Emails se envían** → A usuarios cercanos o globales  

---

## 🚨 Si Sigue el Error

### **Debug Adicional:**

1. **Verificar que el evento se dispara**:
   ```javascript
   // En la consola del navegador
   document.addEventListener('alerta-creada', (e) => {
       console.log('Evento recibido:', e.detail);
   });
   ```

2. **Verificar que el sistema de emails está cargado**:
   ```javascript
   // En la consola
   console.log(window.sistemaEnvioEmailsAlertas);
   // Debería mostrar el objeto, no undefined
   ```

3. **Verificar que `alerta.id` existe**:
   ```javascript
   // En panel-gestion-alertas-global.html, después de crear alerta
   console.log('Alerta creada:', alertaCreada);
   console.log('ID de alerta:', alertaCreada.id);
   ```

---

¿Probamos crear una alerta ahora para verificar que funciona? 😊💜
