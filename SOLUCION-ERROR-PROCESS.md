# ✅ Solución: Error `process is not defined`

## 🔍 Problema
El error `Uncaught ReferenceError: process is not defined` ocurría porque:
- `process.env` solo existe en **Node.js** (backend)
- En el **navegador** (frontend) no existe `process`
- El código intentaba usar `process.env.BREVO_CHAT_ID`

---

## ✅ Solución Aplicada

### **Antes:**
```javascript
chatId: window.BREVO_CHAT_ID || process.env.BREVO_CHAT_ID || null,
```

### **Después:**
```javascript
chatId: (typeof window !== 'undefined' && window.BREVO_CHAT_ID) ? window.BREVO_CHAT_ID : null,
```

---

## 📝 Explicación

Ahora el código:
1. ✅ Verifica que `window` exista (protección para SSR)
2. ✅ Solo usa `window.BREVO_CHAT_ID` si está disponible
3. ✅ Si no existe, devuelve `null` (y se usa el widget simple de contacto)

---

## 🎯 Resultado

- ✅ **Sin errores en consola** por `process`
- ✅ **Widget simple de contacto** aparece automáticamente
- ✅ **Widget completo de Brevo** aparecerá si configuras `window.BREVO_CHAT_ID`

---

## 🔧 Para Configurar BREVO_CHAT_ID (Opcional)

Si querés usar el widget completo de Brevo, agregá esto **ANTES** de cargar el script:

```html
<script>
    window.BREVO_CHAT_ID = 'tu-chat-id-de-brevo';
</script>
<script src="js/widget-brevo-chat.js"></script>
```

---

## ⚠️ Sobre el Error `v2:1`

El error `v2:1 Uncaught (in promise) #<Object>` viene del **SDK de Mercado Pago** y es un error separado. No afecta el widget de Brevo.

Si querés investigarlo:
- Abre la pestaña "Network" en DevTools
- Busca `mercadopago.com/js/v2`
- Revisa los errores en la consola relacionados con Mercado Pago

Pero este error NO impide que el widget de Brevo funcione.

---

## ✅ Todo Listo

Ahora el widget debería aparecer correctamente en `index-cresalia.html` sin errores.



