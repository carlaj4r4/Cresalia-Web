# 📝 Cómo Agregar el Script de Alertas en tus Páginas

## 🐛 Problema Resuelto

**Error**: `relation "alertas_emergencia_comunidades" does not exist` en proyecto Tiendas

**Causa**: La tabla solo existía en Comunidades, no en E-commerce

**Solución**: Nuevo archivo `SUPABASE-ALERTAS-COMPLETO-AMBOS-PROYECTOS.sql` que crea TODO desde cero

---

## 📋 PASO 1: SQL (Arreglado)

### **Nuevo Archivo** ⭐

Usá este: **`SUPABASE-ALERTAS-COMPLETO-AMBOS-PROYECTOS.sql`**

Este archivo:
- ✅ Crea la tabla si no existe
- ✅ Agrega campos si ya existe
- ✅ Funciona en AMBOS proyectos

### **Instalación**

1. **Proyecto E-COMMERCE (Tiendas)**:
   ```
   SQL Editor → New Query
   Copiar TODO de: SUPABASE-ALERTAS-COMPLETO-AMBOS-PROYECTOS.sql
   Pegar → RUN
   ```

2. **Proyecto COMUNIDADES**:
   ```
   SQL Editor → New Query
   Copiar TODO de: SUPABASE-ALERTAS-COMPLETO-AMBOS-PROYECTOS.sql
   Pegar → RUN
   ```

✅ Ahora deberías ver: `✅ SISTEMA DE ALERTAS INSTALADO CORRECTAMENTE`

---

## 📋 PASO 2: Agregar Script JavaScript

### **¿Qué es el Script?**

Es el archivo `js/sistema-alertas-inteligente.js` que ya está creado en tu proyecto.

Solo necesitás **incluirlo** en tus páginas HTML.

---

### **2.1 En `index-cresalia.html`**

**Ubicación**: Buscar al final del archivo, antes de `</body>`

**Qué agregar**:

```html
    <!-- Sistema de Alertas Inteligente -->
    <script src="/js/sistema-alertas-inteligente.js"></script>
</body>
</html>
```

**Dónde exactamente**:

```html
    <!-- Otros scripts que ya tenés -->
    <script src="script-cresalia.js"></script>
    <script src="js/sistema-interconexiones-global.js"></script>
    
    <!-- AGREGAR AQUÍ ⬇️ -->
    <script src="/js/sistema-alertas-inteligente.js"></script>
    
</body>
</html>
```

---

### **2.2 En `demo-buyer-interface.html`**

**Ubicación**: Al final, antes de `</body>`

**Qué agregar**:

```html
    <!-- Sistema de Alertas Inteligente -->
    <script src="/js/sistema-alertas-inteligente.js"></script>
</body>
</html>
```

**Ejemplo**:

```html
    <!-- Scripts que ya tenés -->
    <script src="js/sistema-foro-comunidades.js"></script>
    
    <!-- AGREGAR AQUÍ ⬇️ -->
    <script src="/js/sistema-alertas-inteligente.js"></script>
    
</body>
</html>
```

---

### **2.3 En `tiendas/ejemplo-tienda/admin-final.html`**

**Ubicación**: Al final, antes de `</body>`

**Qué agregar**:

```html
    <!-- Sistema de Alertas Inteligente -->
    <script src="/js/sistema-alertas-inteligente.js"></script>
</body>
</html>
```

**Nota**: La ruta es relativa al archivo, así que puede ser:
- `/js/sistema-alertas-inteligente.js` (desde la raíz)
- O `../../js/sistema-alertas-inteligente.js` (relativa)

---

### **2.4 En Páginas de Comunidades**

En todas las páginas de comunidades (ej: `comunidades/experiencias-sobrenaturales/index.html`):

```html
    <!-- Sistema de Alertas Inteligente -->
    <script src="/js/sistema-alertas-inteligente.js"></script>
</body>
</html>
```

---

## 🎯 ¿Cómo Saber que Funcionó?

### **Método 1: Consola del Navegador**

1. Abrí cualquier página donde agregaste el script
2. Presioná `F12` (abre herramientas de desarrollador)
3. Ir a "Console"
4. Deberías ver:

```
🚨 Sistema de Alertas Inteligente inicializado
✅ Sistema de Alertas Inteligente cargado
```

---

### **Método 2: Crear Alerta de Prueba**

1. Ir a `panel-gestion-alertas-global.html`
2. Crear alerta:
   ```
   Tipo: Anuncio
   Alcance: global
   Título: "Prueba de sistema"
   Descripción: "Esta es una prueba"
   Severidad: Baja
   ```
3. Guardar
4. Ir a `index-cresalia.html`
5. ✅ Deberías ver la alerta aparecer

---

## 📝 Resumen Visual

### **Estructura de Archivos**

```
Cresalia-Web/
├── js/
│   └── sistema-alertas-inteligente.js ← YA EXISTE ✅
├── index-cresalia.html ← AGREGAR SCRIPT AQUÍ
├── demo-buyer-interface.html ← AGREGAR SCRIPT AQUÍ
├── tiendas/
│   └── ejemplo-tienda/
│       └── admin-final.html ← AGREGAR SCRIPT AQUÍ
└── comunidades/
    └── [todas las páginas] ← AGREGAR SCRIPT AQUÍ
```

---

## 🔧 Código Exacto para Copiar/Pegar

### **Para copiar literalmente**:

```html
<script src="/js/sistema-alertas-inteligente.js"></script>
```

**Eso es TODO.** Una sola línea antes de `</body>` en cada página.

---

## ❓ Preguntas Frecuentes

### **¿Dónde está el archivo JavaScript?**

Ya está creado en: `js/sistema-alertas-inteligente.js`

No necesitás crearlo, solo incluirlo.

---

### **¿Tengo que modificar el JavaScript?**

NO. Funciona automáticamente:
- Obtiene tu ubicación (con permiso)
- Llama a Supabase
- Muestra alertas filtradas

---

### **¿Y si no quiero en todas las páginas?**

Podés elegir dónde agregarlo:
- **Mínimo**: `index-cresalia.html` y `demo-buyer-interface.html`
- **Recomendado**: Todas las páginas principales
- **Opcional**: Páginas secundarias

---

### **¿Funciona sin configuración adicional?**

SÍ, si ya tenés:
- ✅ Supabase configurado (`config-supabase-seguro.js`)
- ✅ SQL ejecutado en ambos proyectos
- ✅ Script incluido en HTML

---

## 🎉 ¡Listo!

Con estos 2 pasos:

1. ✅ SQL: `SUPABASE-ALERTAS-COMPLETO-AMBOS-PROYECTOS.sql`
2. ✅ Script: `<script src="/js/sistema-alertas-inteligente.js"></script>`

Tu sistema de **Solidaridad Global + Proximidad Local** está funcionando 💜

---

¿Alguna duda sobre dónde agregar el script? 😊
