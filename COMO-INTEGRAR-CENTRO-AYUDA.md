# 🚀 Cómo Integrar el Centro de Ayuda Interactivo

**Fecha:** 27 de Enero, 2025

---

## ✅ Archivos Creados

1. ✅ `js/centro-ayuda-widget.js` - Widget interactivo completo
2. ✅ `css/centro-ayuda.css` - Estilos responsive

---

## 📝 Integración en tus Páginas

### **Opción 1: Integración Simple (Recomendada)**

Agrega estos dos archivos antes del cierre de `</body>` en cualquier página:

```html
<!-- Centro de Ayuda Interactivo -->
<link rel="stylesheet" href="css/centro-ayuda.css">
<script src="js/centro-ayuda-widget.js"></script>
```

**Ejemplo completo:**

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Tienda - Cresalia</title>
    <!-- Tus otros estilos -->
</head>
<body>
    <!-- Tu contenido aquí -->
    
    <!-- Centro de Ayuda Interactivo -->
    <link rel="stylesheet" href="css/centro-ayuda.css">
    <script src="js/centro-ayuda-widget.js"></script>
    
    <!-- Tus otros scripts -->
</body>
</html>
```

---

### **Opción 2: Integración con Font Awesome**

Si usas Font Awesome (recomendado para los iconos):

```html
<!-- Font Awesome (si no lo tienes ya) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Centro de Ayuda -->
<link rel="stylesheet" href="css/centro-ayuda.css">
<script src="js/centro-ayuda-widget.js"></script>
```

---

## 🎯 Características del Widget

### **✅ Funcionalidades:**

1. **Búsqueda Inteligente**
   - Búsqueda en tiempo real
   - Busca en FAQs y guías
   - Sugerencias automáticas

2. **Categorías Organizadas**
   - 8 categorías principales
   - Navegación fácil
   - Iconos visuales

3. **Preguntas Frecuentes**
   - 10+ FAQs pre-cargadas
   - Respuestas detalladas
   - Sistema de "útil/no útil"

4. **Guías Paso a Paso**
   - 3 guías interactivas
   - Navegación paso a paso
   - Barra de progreso

5. **Formulario de Contacto**
   - Contacto directo con soporte
   - Email: cresalia25@gmail.com

---

## 📱 Diseño Responsive

### **Móviles (< 480px):**
- Botón flotante: 56x56px
- Panel: 100% ancho, 90vh alto
- Grid de categorías: 2 columnas
- Optimizado para touch

### **Tablets (481px - 768px):**
- Panel: 500px máximo
- Grid de categorías: 2 columnas
- Navegación táctil

### **Desktop (> 768px):**
- Panel: 450px máximo
- Botón flotante: 60x60px
- Hover effects

---

## 🎨 Personalización

### **Cambiar Colores:**

Edita `css/centro-ayuda.css` y busca:

```css
/* Color principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Reemplaza con tus colores:

```css
background: linear-gradient(135deg, #TU_COLOR_1 0%, #TU_COLOR_2 100%);
```

### **Cambiar Posición del Botón:**

```css
.centro-ayuda-btn {
    bottom: 20px;  /* Cambia la posición vertical */
    right: 20px;  /* Cambia la posición horizontal */
}
```

---

## 🔧 Configuración Avanzada

### **Agregar Más FAQs:**

Edita `js/centro-ayuda-widget.js` y agrega en el método `loadFAQs()`:

```javascript
{
    id: 11,
    categoria: 'tienda',
    pregunta: '¿Tu pregunta aquí?',
    respuesta: 'Tu respuesta aquí...',
    tags: ['tag1', 'tag2']
}
```

### **Agregar Más Guías:**

Edita `js/centro-ayuda-widget.js` y agrega en el método `loadGuias()`:

```javascript
{
    id: 4,
    titulo: 'Tu Guía',
    categoria: 'tienda',
    tiempo: '5 minutos',
    pasos: [
        { numero: 1, titulo: 'Paso 1', contenido: 'Descripción...' }
    ]
}
```

---

## 📊 Páginas Recomendadas para Integrar

1. ✅ **Página principal** (`index.html` o `index-cresalia.html`)
2. ✅ **Panel de administración** (`admin-final.html`)
3. ✅ **Página de registro** (`registro-tienda.html`)
4. ✅ **Tienda pública** (páginas de tiendas)

---

## 🚀 Próximos Pasos

1. **Integrar en tus páginas principales**
2. **Probar en móvil** (muy importante)
3. **Personalizar colores** si es necesario
4. **Agregar más FAQs** según feedback de usuarios

---

## ❓ Preguntas Frecuentes

### **¿Funciona sin conexión?**
No, necesita conexión para cargar los archivos CSS y JS.

### **¿Puedo cambiar el idioma?**
Sí, edita los textos en `js/centro-ayuda-widget.js`.

### **¿Puedo integrarlo con mi API de soporte?**
Sí, edita el método `submitContacto()` en `js/centro-ayuda-widget.js`.

### **¿Funciona en todos los navegadores?**
Sí, funciona en Chrome, Firefox, Safari, Edge (versiones modernas).

---

**Última actualización:** 27 de Enero, 2025  
**Mantenido por:** Equipo Cresalia 💜

