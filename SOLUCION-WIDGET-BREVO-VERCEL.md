# 🔧 SOLUCIÓN: WIDGET DE BREVO NO APARECE EN VERCEL

## ⚠️ **PROBLEMA:**
El widget de Brevo no aparece en la versión desplegada en Vercel, aunque funciona localmente.

---

## 🔍 **CAUSAS POSIBLES:**

### **1. Content Security Policy (CSP)**
El CSP puede estar bloqueando el script de Brevo.

**Solución:** Ya está corregido en `index-cresalia.html`:
- Agregado `https://*.brevo.com` a `script-src`
- Agregado `https://*.brevo.com` a `connect-src`
- Agregado `https://*.brevo.com` a `frame-src`
- Agregado `https://*.brevo.com` a `img-src`

### **2. Script No Se Carga**
El script de Brevo puede no estar cargando correctamente.

**Verificación:**
1. Abre DevTools → Console
2. Busca mensajes de error relacionados con Brevo
3. Verifica que aparezca: `✅ Script de Brevo Conversations inyectado correctamente`

### **3. CHAT_ID No Configurado**
El `CHAT_ID` de Brevo puede no estar configurado.

**Solución:**
- El `CHAT_ID` por defecto está en `js/widget-brevo-chat.js`
- Si necesitas cambiarlo, edita la variable `BREVO_CHAT_CONFIG.chatId`

### **4. Widget Se Carga Pero No Es Visible**
El widget puede estar cargándose pero no ser visible.

**Verificación:**
1. Abre DevTools → Elements
2. Busca `.brevo-conversations-widget` o `[data-brevo-conversations]`
3. Verifica que tenga `display: block` o `visibility: visible`

---

## ✅ **SOLUCIONES IMPLEMENTADAS:**

### **1. CSP Actualizado:**
```html
script-src ... https://*.brevo.com;
connect-src ... https://*.brevo.com;
frame-src ... https://*.brevo.com;
img-src ... https://*.brevo.com;
```

### **2. Logo Personalizado:**
- El widget ahora muestra el logo de Cresalia
- Logo en el botón del widget
- Logo en el header del panel de chat

### **3. Widget de Respaldo:**
- Si el widget oficial no carga, se muestra un widget simple de contacto
- El widget simple tiene el logo de Cresalia

### **4. Verificación Automática:**
- El script verifica si el widget oficial se cargó
- Si no se carga en 5 segundos, muestra el widget simple

---

## 🛠️ **VERIFICACIÓN MANUAL:**

### **1. Verificar en Console:**
```javascript
// Debe mostrar el CHAT_ID
console.log(window.BrevoConversationsID);

// Debe mostrar el objeto BrevoConversations
console.log(window.BrevoConversations);
```

### **2. Verificar en Network:**
1. Abre DevTools → Network
2. Recarga la página
3. Busca `brevo-conversations.js`
4. Verifica que se cargue correctamente (status 200)

### **3. Verificar en Elements:**
1. Abre DevTools → Elements
2. Busca `brevo-conversations-widget`
3. Verifica que exista en el DOM

---

## 🎯 **SI EL WIDGET SIGUE SIN APARECER:**

### **Opción 1: Verificar CHAT_ID**
1. Ve a tu panel de Brevo
2. Copia el CHAT_ID correcto
3. Actualiza `js/widget-brevo-chat.js`:
```javascript
chatId: 'TU_CHAT_ID_AQUI',
```

### **Opción 2: Verificar Dominio en Brevo**
1. Ve a tu panel de Brevo → Settings → Domains
2. Asegúrate de que tu dominio de Vercel esté agregado
3. Ejemplo: `tu-proyecto.vercel.app`

### **Opción 3: Usar Widget Simple**
Si el widget oficial no funciona, el widget simple se activará automáticamente después de 5 segundos.

---

## 📋 **CHECKLIST DE VERIFICACIÓN:**

- [ ] CSP actualizado con `https://*.brevo.com`
- [ ] CHAT_ID configurado correctamente
- [ ] Dominio de Vercel agregado en Brevo
- [ ] Script de Brevo se carga (Network tab)
- [ ] No hay errores en Console
- [ ] Widget aparece en el DOM (Elements tab)
- [ ] Logo personalizado se muestra

---

## 🎨 **LOGO PERSONALIZADO:**

El logo de Cresalia ahora aparece:
- ✅ En el botón flotante del widget
- ✅ En el header del panel de chat
- ✅ En el widget simple de contacto

**Ubicación del logo:** `/assets/logo/logo-cresalia.png`

---

## 💡 **RECOMENDACIONES:**

1. **Esperar 5-10 segundos** después de cargar la página para que el widget aparezca
2. **Limpiar cache** del navegador si no aparece
3. **Verificar en modo incógnito** para descartar extensiones
4. **Verificar en diferentes navegadores** (Chrome, Edge, Firefox)

---

**💜 "Empezamos pocos, crecemos mucho"**

