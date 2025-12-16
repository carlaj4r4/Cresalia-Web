# 🔔 CÓMO VER NOTIFICACIONES EN CRESALIA

## 📍 Dónde Aparecen las Notificaciones

Las notificaciones en Cresalia aparecen en diferentes lugares según el tipo:

### 1. **Notificaciones en la Página (Toast/Alert)**

Aparecen en la **esquina superior derecha** de la pantalla:

- ✅ **Éxito** (verde): Operaciones exitosas, confirmaciones
- ❌ **Error** (rojo): Errores, problemas
- ⚠️ **Advertencia** (amarillo): Avisos importantes
- ℹ️ **Info** (azul): Información general

**Características:**
- Se muestran automáticamente por 3-5 segundos
- Desaparecen solas
- Pueden apilarse si hay múltiples notificaciones
- Son visibles mientras navegás por la página

### 2. **Notificaciones del Navegador (Push)**

Aparecen como **notificaciones del sistema operativo**:

- 📱 En móviles: Como notificaciones push del navegador
- 💻 En desktop: Como notificaciones del sistema
- Aparecen incluso si la página no está abierta (si está permitido)

**Para activarlas:**
1. El navegador te pedirá permiso la primera vez
2. Click en **"Permitir"** cuando aparezca el popup
3. Si rechazaste, podés activarlas desde:
   - Chrome: 🔒 (candado) → Notificaciones → Permitir
   - Firefox: 🔒 (candado) → Permisos → Notificaciones → Permitir

### 3. **Notificaciones en el Login**

En `login-comprador.html` y `login-tienda.html`:

- Aparecen **dentro del formulario de login**
- Justo arriba de los campos de email y contraseña
- Se muestran cuando:
  - ✅ Login exitoso
  - ❌ Credenciales incorrectas
  - ✅ Email confirmado
  - ⚠️ Errores de conexión

---

## 🔍 Cómo Ver Todas las Notificaciones

### Opción 1: Consola del Navegador (F12)

1. Abrí la consola: **F12** o **Click derecho → Inspeccionar → Console**
2. Buscá mensajes que empiecen con:
   - `✅` (éxito)
   - `❌` (error)
   - `📧` (email)
   - `🔔` (notificación)

### Opción 2: Historial de Notificaciones (si está implementado)

Algunas páginas tienen un historial de notificaciones. Buscá:
- Un ícono de campana 🔔 en la esquina superior
- Un botón "Notificaciones" en el menú
- Un panel lateral con historial

### Opción 3: localStorage (Técnico)

Las notificaciones pueden guardarse en `localStorage`. En la consola (F12):

```javascript
// Ver notificaciones guardadas
JSON.parse(localStorage.getItem('notificaciones_cresalia') || '[]')
```

---

## 📧 Notificaciones por Email

Algunas notificaciones también se envían por email:

- ✅ **Email de bienvenida** (después del registro)
- ✅ **Confirmación de email** (Supabase)
- ✅ **Notificaciones de alertas** (si las activaste)
- ✅ **Emails de compra** (si configuraste)

**Para verificar:**
1. Revisá tu bandeja de entrada
2. Revisá la carpeta de spam
3. Verificá que tu email esté correcto en tu perfil

---

## 🐛 Si No Ves Notificaciones

### Problema 1: Notificaciones bloqueadas

**Solución:**
1. Verificá los permisos del navegador
2. Permití notificaciones para `cresalia-web.vercel.app`
3. Recargá la página

### Problema 2: Notificaciones muy rápidas

**Solución:**
- Las notificaciones aparecen y desaparecen rápido
- Abrí la consola (F12) para ver los mensajes completos
- Algunas notificaciones se guardan en `localStorage`

### Problema 3: Notificaciones fuera de pantalla

**Solución:**
- Las notificaciones aparecen en la **esquina superior derecha**
- Si tenés la ventana pequeña, pueden estar fuera de vista
- Hacé scroll hacia arriba o agrandá la ventana

---

## ✅ Tipos de Notificaciones que Verás

### Después del Login:
- `✅ ¡Bienvenido de nuevo!`
- `✅ ¡Bienvenido a Cresalia! 🎉`

### Después del Registro:
- `✅ Registro exitoso. Revisa tu email para confirmar tu cuenta`
- `✅ Email de bienvenida enviado`

### Errores:
- `❌ Credenciales incorrectas`
- `❌ Error al conectar con el servidor`
- `⚠️ Hubo un problema al confirmar tu email`

### Confirmación de Email:
- `✅ ¡Email confirmado! Tu perfil se está creando...`
- `✅ ¡Cuenta confirmada! Redirigiendo...`

---

## 📱 Notificaciones Push (Móvil)

Si estás en móvil y activaste las notificaciones push:

1. **Aparecen como notificaciones del sistema**
2. **Pueden aparecer incluso si la app está cerrada**
3. **Se guardan en el centro de notificaciones del móvil**

**Para verlas:**
- Deslizá hacia abajo desde la parte superior de la pantalla
- Buscá el ícono de notificaciones 🔔

---

## 🔧 Configuración de Notificaciones

### Activar/Desactivar Notificaciones Push

1. Ve a la configuración de tu cuenta (si está disponible)
2. Buscá "Notificaciones" o "Permisos"
3. Activa/desactiva según prefieras

### Cambiar Tipo de Notificaciones

Algunas notificaciones se pueden configurar:
- ✅ Email + Notificación en página
- ✅ Solo notificación en página
- ✅ Solo email
- ❌ Sin notificaciones

---

**Resumen:** Las notificaciones aparecen principalmente en la **esquina superior derecha** de la página. Si no las ves, abrí la consola (F12) para ver los mensajes completos.
