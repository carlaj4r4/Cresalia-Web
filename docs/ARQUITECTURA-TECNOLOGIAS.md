# 🏗️ Arquitectura y Tecnologías - Cresalia

**Fecha:** 2025-01-27

---

## ✅ **NO Usamos Frameworks de JavaScript**

Cresalia está construido con **JavaScript Vanilla** (JavaScript puro) sin frameworks como React, Vue, Angular, etc.

---

## 📚 **Librerías que SÍ Usamos**

### 1. **Bootstrap CSS** (Solo Estilos)
- **Para qué:** Sistema de grillas y componentes CSS
- **No es framework JS:** Solo estilos, no JavaScript
- **Uso:** Layout responsive, componentes visuales

### 2. **Chart.js** (Solo Gráficos)
- **Para qué:** Crear gráficos interactivos
- **Uso:** Dashboard, reportes, estadísticas
- **No es framework:** Solo para visualización de datos

### 3. **Font Awesome** (Solo Iconos)
- **Para qué:** Iconos vectoriales
- **Uso:** Iconos en toda la plataforma
- **No es framework:** Solo iconos CSS

### 4. **Supabase JS SDK** (Cliente de Base de Datos)
- **Para qué:** Conectar con Supabase (base de datos)
- **Uso:** Todas las operaciones de base de datos
- **No es framework:** Solo cliente para API de Supabase

### 5. **Mercado Pago SDK** (Integración de Pagos)
- **Para qué:** Procesar pagos con Mercado Pago
- **Uso:** Checkout de pagos
- **No es framework:** Solo integración de pagos

### 6. **Sentry** (Monitoreo - Opcional)
- **Para qué:** Detectar errores automáticamente
- **Uso:** Monitoreo de errores en producción
- **No es framework:** Solo herramienta de monitoreo

---

## 💻 **Stack Tecnológico Completo**

### Frontend
- ✅ **HTML5** - Estructura
- ✅ **CSS3** - Estilos (con Bootstrap para grillas)
- ✅ **JavaScript Vanilla** - Lógica (sin frameworks)
- ✅ **Font Awesome** - Iconos

### Backend
- ✅ **Vercel Serverless Functions** - API endpoints
- ✅ **Node.js** - Runtime para funciones serverless
- ✅ **Supabase** - Base de datos PostgreSQL

### Base de Datos
- ✅ **PostgreSQL** (a través de Supabase)
- ✅ **Supabase Storage** - Almacenamiento de archivos

### Integraciones
- ✅ **Mercado Pago CheckoutAPI** - Pagos
- ✅ **Brevo (Sendinblue)** - Chat de email
- ✅ **Sentry** (opcional) - Monitoreo de errores

---

## 🎯 **¿Por Qué NO Frameworks?**

### Ventajas de JavaScript Vanilla:

1. **Más Rápido**
   - No hay "overhead" de frameworks
   - Carga más rápida
   - Menos código para descargar

2. **Más Simple**
   - Fácil de entender
   - No necesitás aprender React/Vue/etc
   - Código más directo

3. **Más Flexible**
   - Podés hacer lo que quieras
   - No estás limitado por el framework
   - Control total del código

4. **Mejor para SEO**
   - HTML renderizado directamente
   - No necesita JavaScript para mostrar contenido
   - Mejor indexación en Google

5. **Más Fácil de Mantener**
   - Menos dependencias
   - Menos actualizaciones
   - Menos problemas de compatibilidad

---

## 📦 **Estructura del Proyecto**

```
Cresalia-Web/
├── index-cresalia.html          # Página principal (HTML + JS vanilla)
├── tiendas/                     # Páginas de tiendas (HTML + JS vanilla)
├── comunidades/                  # Comunidades (HTML + JS vanilla)
├── api/                         # Serverless functions (Node.js)
├── js/                          # JavaScript vanilla
├── css/                         # Estilos CSS
└── docs/                        # Documentación
```

---

## 🔧 **Cómo Funciona**

### Frontend:
1. **HTML** define la estructura
2. **CSS** define los estilos
3. **JavaScript Vanilla** agrega interactividad
4. **Librerías** solo para funcionalidades específicas (gráficos, iconos, etc.)

### Backend:
1. **Vercel Serverless Functions** (Node.js)
2. **Supabase** como base de datos
3. **APIs REST** para comunicación

---

## ✅ **Resumen**

**NO usamos frameworks de JavaScript** como:
- ❌ React
- ❌ Vue
- ❌ Angular
- ❌ Svelte
- ❌ Next.js
- ❌ Nuxt

**SÍ usamos:**
- ✅ JavaScript Vanilla
- ✅ Librerías específicas (Chart.js, Font Awesome, etc.)
- ✅ CSS puro + Bootstrap (solo para grillas)

**Ventaja:** Código más simple, más rápido, más fácil de mantener.

---

**Última actualización:** 2025-01-27  
**Mantenido por:** Equipo Cresalia 💜


