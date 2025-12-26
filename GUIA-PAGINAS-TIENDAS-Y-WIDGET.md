# 📖 Guía: Páginas de Tiendas y Widget de Acceso

## 🏪 ¿Qué son las Páginas de Tiendas?

Las páginas de tiendas son las páginas públicas donde los clientes ven y compran productos. Cada tienda tiene su propia carpeta en `tiendas/[nombre-tienda]/`.

### **Estructura de una Tienda:**

```
tiendas/ejemplo-tienda/
├── index.html              # Página pública de la tienda (donde compran los clientes)
├── admin.html              # Panel de administración (donde gestionas tu tienda)
├── admin-final.html        # Panel admin mejorado
├── widget-acceso-directo.html    # Widget para acceso rápido al panel
└── widget-acceso-comunidad.html  # Widget para acceso a comunidades
```

## 🎯 ¿Cómo Funcionan?

### **1. Página Pública (`index.html`)**
- **URL:** `https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/index.html`
- **Para quién:** Clientes/compradores
- **Qué hace:** Muestra productos, permite comprar, ver detalles, etc.
- **Es dinámica:** Se carga automáticamente con los datos de tu tienda

### **2. Panel de Administración (`admin.html` o `admin-final.html`)**
- **URL:** `https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-final.html`
- **Para quién:** Tú (el vendedor)
- **Qué hace:** Gestionar productos, ver ventas, configurar tienda, etc.
- **Requiere login:** Debes iniciar sesión para acceder

### **3. Widget de Acceso Directo (`widget-acceso-directo.html`)**
- **URL:** Se genera automáticamente con parámetros
- **Para qué:** Acceso rápido al panel desde un enlace personalizado
- **Cómo funciona:** Redirige automáticamente al panel admin

## 🔧 ¿Qué Hacer con el Widget?

### **Opción 1: Usar el Widget Generado (Recomendado)**

1. **Ve a tu panel admin:** `admin-final.html`
2. **Navega a:** "Widget de Acceso Directo" (en el menú)
3. **Activa el widget:** Marca el checkbox "Activar Widget de Acceso Directo"
4. **Copia la URL generada:** Se genera automáticamente con tu logo y nombre
5. **Úsala donde quieras:** Puedes compartirla, guardarla como favorito, etc.

**Ejemplo de URL generada:**
```
https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/widget-acceso-directo.html?url=https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-final.html&logo=https://ejemplo.com/logo.png&nombre=Mi%20Tienda
```

### **Opción 2: Usar el Código HTML Generado**

Si quieres incrustar el widget en otra página:

1. **Genera el widget** en `admin-final.html`
2. **Copia el código HTML** que se muestra
3. **Pégalo en tu página** (pero **NO lo guardes como archivo**)

**⚠️ IMPORTANTE:** El código HTML generado es para **copiar y pegar en otra página**, NO para guardarlo como archivo. Si lo guardas como archivo, las variables no se procesarán y verás `$%7BwidgetUrl%7D`.

## ❌ Problema: `$%7BwidgetUrl%7D` en la URL

### **¿Qué significa?**
- `$%7BwidgetUrl%7D` = `{widgetUrl}` codificado en URL
- Significa que se está usando el texto literal `{widgetUrl}` en lugar de la variable procesada

### **¿Por qué pasa?**
Esto ocurre cuando:
1. Se copia el código HTML generado y se guarda como archivo sin procesar
2. Se usa el código HTML directamente sin reemplazar las variables

### **Solución:**
**NO guardes el código HTML generado como archivo.** El código es para:
- Copiar y pegar en otra página web
- Usar en un iframe
- Incrustar en tu sitio

**Si necesitas un archivo HTML del widget, usa directamente:**
- `widget-acceso-directo.html` (ya existe y funciona)
- Solo agrega los parámetros en la URL: `?url=...&logo=...&nombre=...`

## 📝 Ejemplo de Uso Correcto

### **Correcto ✅:**
```
https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/widget-acceso-directo.html?url=https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-final.html&logo=https://ejemplo.com/logo.png&nombre=Mi%20Tienda
```

### **Incorrecto ❌:**
```
file:///C:/Users/carla/Cresalia-Web/tiendas/ejemplo-tienda/$%7BwidgetUrl%7D
```

## 🎯 Resumen: ¿Qué Hacer?

1. **Para acceder a tu tienda pública:**
   - Usa: `tiendas/ejemplo-tienda/index.html`
   - O la URL completa en producción

2. **Para acceder a tu panel admin:**
   - Usa: `tiendas/ejemplo-tienda/admin-final.html`
   - O genera un widget de acceso directo

3. **Para usar el widget:**
   - Genera la URL en `admin-final.html` → "Widget de Acceso Directo"
   - Copia la URL generada (no el código HTML)
   - Úsala directamente o compártela

4. **NO hagas:**
   - Guardar el código HTML generado como archivo
   - Usar `{widgetUrl}` literalmente en URLs
   - Crear archivos con nombres que contengan variables

## 💡 ¿Necesitas Más Ayuda?

Si tienes problemas específicos con:
- **Acceso a la tienda:** Verifica que `index.html` esté en la carpeta correcta
- **Panel admin:** Verifica que tengas sesión activa
- **Widget:** Usa la URL generada, no el código HTML como archivo
