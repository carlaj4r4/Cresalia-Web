# 🛒 CÓMO VER MIS COMPRAS EN CRESALIA

## 📍 Dónde Encontrar "Mis Compras"

Los compradores pueden ver sus compras de **3 formas diferentes**:

---

## ✅ OPCIÓN 1: Desde el Botón "Mi Cuenta" (Recomendado)

### Paso a Paso:

1. **Iniciá sesión** como comprador en `login-comprador.html`
2. **Andá a la página principal** (`index-cresalia.html`)
3. **Click en "Mi Cuenta"** (esquina superior derecha, ícono de usuario 👤)
4. **Se abrirá un modal** con tus opciones
5. **Click en "Mis Compras"** (botón con ícono de bolsa de compras 🛒)

**Resultado:** Se abrirá la página `mis-compras.html` con tu historial completo.

---

## ✅ OPCIÓN 2: Acceso Directo

**URL directa:**
```
https://cresalia-web.vercel.app/mis-compras.html
```

O si estás en localhost:
```
http://localhost:8080/mis-compras.html
```

**Nota:** Debes estar logueado para ver tus compras. Si no estás logueado, te redirigirá al login.

---

## ✅ OPCIÓN 3: Desde el Modal de Historiales

Si tenés el sistema de historiales activo:

1. En cualquier página, podés llamar a la función:
   ```javascript
   mostrarHistorialCompras()
   ```
2. O usar el sistema de historiales:
   ```javascript
   historySystem.showHistoryModal('comprador')
   ```

---

## 📊 Qué Verás en "Mis Compras"

### 1. **Estadísticas en la Parte Superior**

- 📦 **Total de Compras**: Cantidad total de compras realizadas
- 📅 **Compras Este Mes**: Compras del mes actual
- 💰 **Total Gastado**: Suma de todas tus compras

### 2. **Filtros**

Podés filtrar tus compras por estado:
- **Todas**: Muestra todas las compras
- **Completadas**: Compras finalizadas
- **Enviadas**: Compras que ya fueron enviadas
- **Pendientes**: Compras en proceso

### 3. **Lista de Compras**

Cada compra muestra:
- 📦 **Número de compra**
- 🏪 **Tienda** donde compraste
- 📅 **Fecha** de la compra
- 💳 **Método de pago** usado
- 💰 **Total** pagado
- ✅ **Estado** de la compra (con colores)
- 📋 **Productos** comprados (nombre, cantidad, precio)
- 📍 **Dirección de entrega** (si está disponible)

---

## 🔍 Cómo Funciona

### Datos desde Supabase

Las compras se cargan desde la tabla `historial_compras` en Supabase:

- ✅ Se filtran por tu email (`comprador_email`)
- ✅ Se ordenan por fecha (más recientes primero)
- ✅ Se agrupan por fecha y tienda (compras del mismo día en la misma tienda)

### Fallback a localStorage

Si Supabase no está disponible, se cargan desde `localStorage`:

```javascript
localStorage.getItem('historial_compras')
```

---

## 🆘 Si No Ves Tus Compras

### Problema 1: No estás logueado

**Solución:**
1. Iniciá sesión en `login-comprador.html`
2. Volvé a `mis-compras.html`

### Problema 2: No tienes compras registradas

**Solución:**
- Las compras se registran automáticamente cuando completás una compra
- Si no ves compras, puede ser que:
  - Aún no hayas realizado ninguna compra
  - Las compras no se guardaron correctamente
  - Hay un problema con la conexión a Supabase

### Problema 3: Error al cargar

**Solución:**
1. Abrí la consola (F12) para ver el error
2. Verificá que la tabla `historial_compras` exista en Supabase
3. Verificá que tengas permisos (RLS) para ver tus compras

---

## 📱 Responsive

La página está optimizada para:
- ✅ **Desktop**: Vista completa con estadísticas y lista
- ✅ **Tablet**: Layout adaptado
- ✅ **Móvil**: Diseño responsive, fácil de usar

---

## 🔄 Actualización Automática

Las compras se actualizan:
- ✅ **Automáticamente** cuando completás una compra
- ✅ **Al recargar** la página `mis-compras.html`
- ✅ **Desde Supabase** en tiempo real (si está configurado)

---

## 📋 Requisitos

Para ver tus compras necesitás:

1. ✅ **Estar registrado** como comprador
2. ✅ **Haber iniciado sesión**
3. ✅ **Tener al menos una compra** realizada
4. ✅ **Conexión a Supabase** (o tener compras en localStorage)

---

## 🎨 Características de la Página

- ✅ **Diseño moderno** con gradientes y sombras
- ✅ **Estadísticas visuales** con tarjetas
- ✅ **Filtros interactivos** para organizar compras
- ✅ **Cards de compras** con toda la información
- ✅ **Estados con colores** (verde=completado, azul=enviado, amarillo=pendiente)
- ✅ **Responsive** para todos los dispositivos
- ✅ **Botón "Volver"** para regresar al inicio

---

## 🔗 Integración con Otros Sistemas

La página se integra con:

- ✅ **Sistema de historiales** (`js/historiales-sistema.js`)
- ✅ **Sistema de historiales completo** (`js/history-system.js`)
- ✅ **Supabase** para datos persistentes
- ✅ **localStorage** como fallback

---

**Resumen:** Los compradores pueden ver sus compras desde el botón **"Mi Cuenta" → "Mis Compras"** o accediendo directamente a `mis-compras.html`. La página muestra estadísticas, filtros y el historial completo de compras desde Supabase.
