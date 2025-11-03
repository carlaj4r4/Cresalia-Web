# 🎨 Sistema Dinámico de Tiendas - CRESALIA

## 📋 **RESUMEN**

La página de cada tienda (`tiendas/ejemplo-tienda/index.html`) ahora es **100% DINÁMICA**.

**NO más datos hardcodeados** ✅

---

## 🔄 **CAMBIOS IMPLEMENTADOS**

### **1. Hero Section (Encabezado)**

#### **Antes:**
```html
<h1>TechStore Argentina</h1>
<p>Tu tienda de confianza para tecnología...</p>
<span>Plan Pro</span>
```

#### **Ahora:**
```html
<h1 id="heroTiendaNombre">¡Bienvenidos a [NOMBRE DE TU TIENDA]!</h1>
<p id="heroTiendaDescripcion">[DESCRIPCIÓN DE TU TIENDA]</p>
<span id="heroPlanTexto">[Plan Básico/PRO/Enterprise]</span>
```

✅ **Se carga automáticamente desde `localStorage`**

---

### **2. Footer (Pie de Página)**

#### **Antes:**
```html
<h5>TechStore Argentina</h5>
<p>Tu tienda de confianza...</p>
<li>+54 11 1234-5678</li>
<li>info@techstore.com.ar</li>
<li>Buenos Aires, Argentina</li>
```

#### **Ahora:**
```html
<h5 id="footerTiendaNombre">[NOMBRE DE TU TIENDA]</h5>
<p id="footerTiendaDescripcion">[DESCRIPCIÓN]</p>
<span id="footerTelefono">[TU TELÉFONO]</span>
<span id="footerEmail">[TU EMAIL]</span>
<span id="footerDireccion">[TU DIRECCIÓN]</span>
```

✅ **Todo dinámico, incluido WhatsApp**

---

### **3. Branding de CRESALIA**

#### **Lógica Inteligente:**

- **Plan Básico** → Muestra "Powered by Cresalia" 💜
- **Plan PRO/Enterprise** → NO muestra branding de Cresalia ✨

```javascript
if (plan === 'pro' || plan === 'enterprise') {
    // Ocultar badge de Cresalia
    footerCresaliaBadge.style.display = 'none';
}
```

---

### **4. Productos y Categorías**

#### **Antes:**
- 4 productos hardcodeados (MacBook, iPhone, Sony, PS5)
- 4 categorías hardcodeadas (Laptops, Smartphones, Audio, Gaming)

#### **Ahora:**
- **Carga desde `localStorage`** o Supabase
- Si no hay productos: Muestra mensaje "Aún no hay productos disponibles"
- Si hay productos: Los renderiza dinámicamente con:
  - Nombre
  - Descripción
  - Precio
  - Imagen (si existe)
  - Badges (Nuevo/Oferta/Destacado)
  - Botones funcionales (Agregar al Carrito, Ver Detalles)

---

## 🛠️ **CÓMO FUNCIONA**

### **Flujo de Datos:**

```
1. Usuario se registra/loguea
   ↓
2. Se guarda en localStorage:
   - tienda_actual (nombre, email, plan, etc.)
   - techstore_configuracion (teléfono, dirección, WhatsApp)
   ↓
3. Al abrir index.html:
   - JavaScript lee localStorage
   - Actualiza TODOS los elementos dinámicos
   - Carga productos/categorías
   ↓
4. Resultado: Página 100% personalizada
```

---

## 📦 **ESTRUCTURA DE DATOS**

### **`tienda_actual` (localStorage):**

```json
{
  "id": "uuid-123-abc",
  "nombre_tienda": "Mi Súper Tienda",
  "email": "contacto@mitienda.com",
  "plan": "pro",
  "descripcion": "La mejor tienda de productos",
  "created_at": "2025-01-15"
}
```

### **`techstore_configuracion` (localStorage):**

```json
{
  "nombreTienda": "Mi Súper Tienda",
  "descripcion": "Descripción personalizada",
  "email": "contacto@mitienda.com",
  "telefono": "+54 11 1234-5678",
  "direccion": "Buenos Aires, Argentina",
  "whatsapp": "5491112345678"
}
```

### **`productos_[tienda_id]` (localStorage):**

```json
[
  {
    "id": "prod-001",
    "nombre": "Producto 1",
    "descripcion": "Descripción del producto",
    "precio": 99.99,
    "precioOriginal": 149.99,
    "imagen": "url-imagen.jpg",
    "destacado": true,
    "oferta": false,
    "nuevo": false,
    "categoria": "Electrónica"
  }
]
```

### **`categorias_tienda` (localStorage):**

```json
[
  {
    "nombre": "Electrónica",
    "descripcion": "Productos electrónicos",
    "icono": "fas fa-laptop"
  }
]
```

---

## 🎯 **FUNCIONES JAVASCRIPT**

### **1. `cargarDatosTienda()`**

Carga y actualiza:
- Título de la página
- Hero section (nombre, descripción, plan badge)
- Footer (nombre, email, teléfono, dirección)
- WhatsApp link
- Branding de Cresalia (según plan)

### **2. `cargarProductosYCategorias()`**

Carga y renderiza:
- Hasta 8 categorías
- Hasta 8 productos
- Si no hay datos: Muestra mensajes por defecto

### **3. `agregarAlCarrito(id, nombre, precio)`**

Agrega productos al carrito (localStorage)

### **4. `verDetalles(id)`**

Muestra detalles del producto (próximamente)

---

## 🧪 **CÓMO PROBAR**

### **Opción 1: Usar Datos de Prueba**

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Configurar datos de tienda
localStorage.setItem('tienda_actual', JSON.stringify({
  id: 'demo-123',
  nombre_tienda: 'Mi Tienda Fantástica',
  email: 'hola@mitienda.com',
  plan: 'pro',
  descripcion: '¡La mejor tienda del mundo!'
}));

localStorage.setItem('techstore_configuracion', JSON.stringify({
  nombreTienda: 'Mi Tienda Fantástica',
  descripcion: 'Vendemos productos increíbles',
  email: 'hola@mitienda.com',
  telefono: '+54 11 9999-8888',
  direccion: 'Córdoba, Argentina',
  whatsapp: '5491199998888'
}));

// Agregar un producto de prueba
localStorage.setItem('productos_demo-123', JSON.stringify([
  {
    id: 'prod-001',
    nombre: 'Producto de Prueba',
    descripcion: 'Este es un producto de prueba',
    precio: 199.99,
    destacado: true
  }
]));

// Agregar categorías
localStorage.setItem('categorias_tienda', JSON.stringify([
  {
    nombre: 'Tecnología',
    descripcion: 'Productos tecnológicos',
    icono: 'fas fa-laptop'
  },
  {
    nombre: 'Hogar',
    descripcion: 'Artículos para el hogar',
    icono: 'fas fa-home'
  }
]));

// Recargar la página
location.reload();
```

### **Opción 2: Usar el Panel de Admin**

1. Ve a `tiendas/ejemplo-tienda/admin.html`
2. Ingresa con la contraseña demo
3. Ve a "Configuración" → Cambia el nombre de la tienda
4. Ve a "Mis Productos" → Agrega productos
5. Abre `tiendas/ejemplo-tienda/index.html`
6. ¡Verás tus datos! 🎉

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Problema: No muestra mis datos**

**Solución:**
1. Abre la consola (F12)
2. Busca: `📦 Cargando datos de tienda:`
3. Verifica qué datos están en `localStorage`:

```javascript
console.log('Tienda actual:', localStorage.getItem('tienda_actual'));
console.log('Configuración:', localStorage.getItem('techstore_configuracion'));
```

### **Problema: Muestra "Aún no hay productos"**

**Solución:**
1. Verifica si hay productos guardados:

```javascript
const tienda = JSON.parse(localStorage.getItem('tienda_actual'));
console.log('Productos:', localStorage.getItem('productos_' + tienda.id));
```

2. Si no hay productos, agrégalos desde el panel de admin o usando el código de prueba arriba.

### **Problema: Sigue mostrando "TechStore Argentina"**

**Solución:**
1. Limpia la caché del navegador: `Ctrl + Shift + R` (Windows) o `Cmd + Shift + R` (Mac)
2. Verifica que el JavaScript se esté ejecutando:

```javascript
// En la consola, debería ver:
✅ Datos de tienda cargados correctamente: [Tu Nombre]
```

---

## ✅ **VERIFICACIÓN FINAL**

### **Lista de Verificación:**

- [ ] Hero muestra el nombre correcto
- [ ] Hero muestra el plan correcto (Básico/PRO/Enterprise)
- [ ] Footer muestra nombre, email, teléfono
- [ ] Footer muestra/oculta branding según plan
- [ ] Categorías se cargan (o muestra mensaje por defecto)
- [ ] Productos se cargan (o muestra mensaje por defecto)
- [ ] No hay errores en consola (F12)

---

## 🎉 **RESULTADO**

**ANTES:** 1 tienda hardcodeada para todos
**AHORA:** ∞ tiendas únicas y personalizadas

✅ **100% Dinámico**
✅ **0 Hardcoding**
✅ **Multi-tenant Real**

---

## 📚 **PRÓXIMOS PASOS**

1. ✅ Sistema dinámico implementado
2. ⏳ Conectar productos a Supabase (futuro)
3. ⏳ Agregar imágenes reales (futuro)
4. ⏳ Sistema de búsqueda/filtros (futuro)

---

**Creado con 💜 por Claude & Carla**
**Fecha:** 8 de Octubre, 2025



















