# 📧 Guía: Widget de Brevo Chat

## 🔍 Problema: Widget no aparece en index-cresalia.html

### ✅ Solución Implementada

He agregado logs de depuración y mejorado la lógica de inicialización para que el widget **SIEMPRE** aparezca.

---

## 🎯 Cómo Funciona Ahora

### **1. Verificación de Página**
El widget verifica si está en:
- ✅ `index-cresalia.html` (o `/`)
- ✅ Páginas de tiendas (`/tiendas/...`)

### **2. Dos Modos de Funcionamiento**

#### **Modo 1: Con BREVO_CHAT_ID (Widget Completo)**
Si tienes configurado `BREVO_CHAT_ID`:
- Se carga el widget completo de Brevo Chat
- Conversaciones integradas
- Panel de administración

#### **Modo 2: Sin BREVO_CHAT_ID (Widget Simple)**
Si **NO** tienes `BREVO_CHAT_ID`:
- Se muestra un botón simple de contacto
- Abre el cliente de email del usuario
- Envía email a: `cresalia25@gmail.com`

---

## 🔧 Configuración

### **Opción 1: Usar Widget Simple (Actual)**
No necesitas configurar nada. El widget simple aparecerá automáticamente.

### **Opción 2: Configurar BREVO_CHAT_ID**

1. **Obtener CHAT_ID de Brevo:**
   - Ir a [brevo.com](https://www.brevo.com)
   - Panel → Conversaciones → Configuración
   - Copiar el CHAT_ID

2. **Configurar en Vercel:**
   - Variables de entorno → `BREVO_CHAT_ID`
   - Valor: Tu CHAT_ID

3. **O configurar en el HTML:**
```html
<script>
    window.BREVO_CHAT_ID = 'tu-chat-id-aqui';
</script>
<script src="js/widget-brevo-chat.js"></script>
```

---

## 🐛 Debugging

Abre la consola del navegador (F12) y verás logs como:

```
🔍 Verificando widget Brevo: {
    pathname: "/index-cresalia.html",
    isTiendaPage: false,
    isIndexCresalia: true,
    chatId: null,
    enabled: true
}
✅ Página válida para mostrar widget Brevo
📧 No hay CHAT_ID, usando widget simple de contacto
✅ Widget de contacto simple creado correctamente
```

---

## 📍 Ubicación del Widget

- **Botón de Feedback General**: `bottom: 90px, right: 90px`
- **Widget de Brevo**: `bottom: 20px, right: 20px`

---

## ✅ Verificación

1. Abre `index-cresalia.html`
2. Abre la consola del navegador (F12)
3. Busca los logs del widget
4. Verifica que aparezca el botón en la esquina inferior derecha

Si aún no aparece, revisa:
- ✅ Que el script esté cargando: `js/widget-brevo-chat.js`
- ✅ Que no haya errores en la consola
- ✅ Que la página tenga `index-cresalia.html` en la URL



