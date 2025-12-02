# 📧 Guía Completa: Widget de Brevo Chat

## 🎯 Dos Modos de Funcionamiento

### **Modo 1: Widget Oficial de Brevo** (con BREVO_CHAT_ID)
- ✅ Se carga el widget completo de Brevo
- ✅ Conversaciones integradas
- ✅ Panel de administración
- ⚠️ **Permite elegir la posición** en el panel de configuración de Brevo
- ⚠️ La posición se guarda en el panel de Brevo, no en nuestro código

### **Modo 2: Widget Simple de Contacto** (sin BREVO_CHAT_ID)
- ✅ Botón simple que abre el cliente de email
- ✅ Siempre visible en la esquina inferior derecha
- ✅ No requiere configuración
- ✅ Posición fija: `right: 100px, bottom: 20px`

---

## 📍 Dónde Aparece

### ✅ **Páginas donde SÍ aparece:**
- `index-cresalia.html`
- Páginas de tiendas públicas (`/tiendas/ejemplo-tienda/index.html`)
- Comunidades (`/comunidades/...`)
- Cualquier página pública

### ❌ **Páginas donde NO aparece:**
- Paneles de administración (`/tiendas/.../admin-final.html`)
- Paneles de admin (`/admin-...`)

---

## 🔧 Configuración del Widget Oficial

### **Problema Común:**
"El widget pregunta dónde colocarlo pero luego no aparece"

### **Solución:**
1. **Ve al panel de Brevo:**
   - https://app.brevo.com
   - Conversaciones → Configuración → Widget

2. **Configura la posición:**
   - Elige la posición (por ejemplo: "Esquina inferior derecha")
   - **Guarda la configuración**
   - Espera unos minutos para que se actualice

3. **Verifica que el CHAT_ID esté configurado:**
   - En Vercel: Variables de entorno → `BREVO_CHAT_ID`
   - O en el HTML: `window.BREVO_CHAT_ID = 'tu-chat-id'`

---

## 📝 Ubicación del Widget Simple

### **Posición Actual:**
```css
position: fixed;
bottom: 20px;
right: 100px;
z-index: 7999;
```

### **Por qué en `right: 100px`:**
- Los chatbots IA y Soporte están en `right: 20px`
- El widget de Brevo está en `right: 100px` para no superponerse
- El botón de Feedback está en `right: 90px, bottom: 90px`

---

## 🐛 Troubleshooting

### **1. Widget no aparece en ninguna página:**
- ✅ Verifica que el script esté cargado: `<script src="js/widget-brevo-chat.js"></script>`
- ✅ Abre la consola (F12) y busca logs que empiecen con `🔍 Verificando widget Brevo`
- ✅ Verifica que no estés en una página de admin

### **2. Widget aparece pero en posición incorrecta:**
- **Si usas widget oficial:** Configura la posición en el panel de Brevo
- **Si usas widget simple:** La posición está fija en `right: 100px, bottom: 20px`

### **3. Widget aparece solo en algunas páginas:**
- ✅ Verifica que el script esté incluido en todas las páginas públicas
- ✅ Revisa los logs en la consola para ver por qué no se inicializa

---

## 🔄 Cambiar de Modo

### **Usar Widget Oficial:**
```html
<script>
    window.BREVO_CHAT_ID = 'tu-chat-id-de-brevo';
</script>
<script src="js/widget-brevo-chat.js"></script>
```

### **Usar Widget Simple:**
```html
<!-- No configures BREVO_CHAT_ID -->
<script src="js/widget-brevo-chat.js"></script>
```

---

## ✅ Estado Actual

- ✅ Widget simple funciona en todas las páginas públicas
- ✅ Widget oficial funciona si está configurado `BREVO_CHAT_ID`
- ✅ No aparece en páginas de admin
- ✅ Logs de depuración en consola

---

## 📞 Contacto del Widget Simple

Por defecto, el widget simple envía emails a:
- **Email:** `cresalia25@gmail.com`
- **Asunto:** "Consulta desde Cresalia"

Para cambiarlo, edita `defaultEmail` en `js/widget-brevo-chat.js`:
```javascript
defaultEmail: 'tu-email@ejemplo.com',
```



