# 🚀 GUÍA DE ADMINISTRACIÓN FRIOCAS

## 📋 ÍNDICE
1. [Acceso al Panel](#acceso-al-panel)
2. [Gestión de Productos](#gestión-de-productos)
3. [Gestión de Categorías](#gestión-de-categorías)
4. [Configuración General](#configuración-general)
5. [Solución de Problemas](#solución-de-problemas)

---

## 🔐 ACCESO AL PANEL

### **Contraseña Actual:**
- **🔑 Contraseña:** `FRIOCAS2024ADMIN`
- **🔑 Contraseña Alternativa:** `ADMIN123` (usar botón "Cambiar a ADMIN123")

### **Pasos para Acceder:**
1. Abrir `admin-friocas.html` en el navegador
2. Ingresar la contraseña
3. Hacer clic en "Acceder al Panel"

---

## 📦 GESTIÓN DE PRODUCTOS

### **✅ PROBLEMAS SOLUCIONADOS:**

#### **1. Error 404 en Imágenes:**
- **❌ ANTES:** Solo aceptaba URLs externas
- **✅ AHORA:** Acepta archivos locales y URLs
- **💡 SOLUCIÓN:** Selector de archivos integrado

#### **2. Categorías Mejoradas:**
- **❌ ANTES:** Categorías hardcodeadas
- **✅ AHORA:** Categorías dinámicas con colores
- **💡 SOLUCIÓN:** Sistema de categorías personalizable

### **📝 CÓMO AGREGAR PRODUCTOS:**

#### **Método 1: Con Archivo Local**
1. Hacer clic en "Agregar Producto"
2. Llenar información básica:
   - **Nombre:** Nombre del producto
   - **Categoría:** Seleccionar categoría
   - **Precio:** Precio en pesos
   - **Stock:** Cantidad disponible
   - **Descripción:** Descripción del producto
   - **Marca:** Marca del producto

3. **Para la imagen:**
   - Hacer clic en "Seleccionar Archivo"
   - Elegir imagen del producto
   - La ruta se genera automáticamente: `assets/productos/[categoria]/[nombre].jpg`

#### **Método 2: Con URL Externa**
1. En el campo "Imagen del Producto"
2. Pegar URL completa: `https://ejemplo.com/imagen.jpg`

### **🎨 CÓMO ORGANIZAR IMÁGENES:**

#### **Estructura de Carpetas Recomendada:**
```
assets/
├── productos/
│   ├── limpiadores/
│   │   ├── bug-remover.jpg
│   │   ├── alcaline-wheels.jpg
│   │   └── iron-warning.jpg
│   ├── shampoo/
│   │   ├── ice-shampoo.jpg
│   │   ├── energy-shampoo.jpg
│   │   └── pure-foam.jpg
│   ├── ceras/
│   │   ├── extreme-detail.jpg
│   │   └── illusion-wax.jpg
│   └── accesorios/
│       ├── microfibra.jpg
│       └── cepillos.jpg
└── categorias/
    ├── limpiadores.jpg
    ├── shampoo.jpg
    └── ceras.jpg
```

---

## 🏷️ GESTIÓN DE CATEGORÍAS

### **✅ NUEVAS FUNCIONALIDADES:**

#### **1. Botón de Confirmar:**
- **✅ AHORA:** Botón "Guardar Categoría" funcional
- **💡 FUNCIÓN:** Guarda automáticamente en localStorage

#### **2. Selector de Color:**
- **🎨 FUNCIÓN:** Elegir color para identificar categoría
- **💡 USO:** Diferenciar categorías en la interfaz

#### **3. Previsualización de Imagen:**
- **🖼️ FUNCIÓN:** Vista previa de imagen antes de guardar
- **💡 USO:** Verificar que la imagen es correcta

### **📝 CÓMO CREAR CATEGORÍAS:**

1. **Ir a:** Configuración General → Gestión de Categorías
2. **Hacer clic:** "Agregar Categoría"
3. **Llenar información:**
   - **Nombre:** Nombre de la categoría
   - **Descripción:** Descripción de la categoría
   - **Imagen:** Imagen representativa
   - **Color:** Color para identificar la categoría

4. **Hacer clic:** "Guardar Categoría"

---

## ⚙️ CONFIGURACIÓN GENERAL

### **✅ PROBLEMAS SOLUCIONADOS:**

#### **1. Secciones Duplicadas:**
- **❌ ANTES:** Secciones repetidas sin diseño
- **✅ AHORA:** Secciones organizadas y con diseño
- **💡 SOLUCIÓN:** Reorganización completa del contenido

#### **2. Diseño Mejorado:**
- **🎨 ANTES:** Diseño básico
- **✅ AHORA:** Diseño moderno y responsive
- **💡 SOLUCIÓN:** Nuevos estilos CSS

### **📋 SECCIONES DISPONIBLES:**

#### **1. Información de Contacto:**
- Nombre de la empresa
- Dirección
- Teléfono
- Email
- Horarios de atención

#### **2. Redes Sociales:**
- WhatsApp
- Instagram
- Facebook

#### **3. Configuración de Pagos:**
- Método de pago principal
- Datos bancarios

#### **4. Configuración del Sistema:**
- Moneda
- Zona horaria
- Notificaciones (Email/WhatsApp)

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### **❌ ERROR: "Failed to load resource: 404"**

#### **Causa:**
- Imagen no encontrada en la ruta especificada

#### **Solución:**
1. **Verificar ruta:** Asegurar que la imagen existe
2. **Usar selector de archivo:** En lugar de URL manual
3. **Organizar carpetas:** Seguir estructura recomendada

### **❌ ERROR: "Not allowed to load local resource"**

#### **Causa:**
- Navegador bloqueando archivos locales

#### **Solución:**
1. **Usar servidor local:** Abrir con Live Server en VS Code
2. **O usar ruta relativa:** `assets/productos/categoria/imagen.jpg`
3. **O subir a servidor:** Usar URL externa

### **❌ PROBLEMA: No aparece botón de confirmar**

#### **Causa:**
- JavaScript no cargado correctamente

#### **Solución:**
1. **Recargar página:** F5
2. **Verificar consola:** F12 → Console
3. **Limpiar caché:** Ctrl + Shift + R

### **❌ PROBLEMA: Secciones sin diseño**

#### **Causa:**
- CSS no cargado correctamente

#### **Solución:**
1. **Verificar archivo CSS:** `styles-admin-friocas.css`
2. **Recargar página:** F5
3. **Limpiar caché:** Ctrl + Shift + R

---

## 🎯 MEJORES PRÁCTICAS

### **📁 ORGANIZACIÓN DE ARCHIVOS:**
1. **Crear carpetas** antes de agregar productos
2. **Usar nombres descriptivos** para imágenes
3. **Mantener estructura** de carpetas consistente

### **🖼️ IMÁGENES:**
1. **Formato recomendado:** JPG o PNG
2. **Tamaño recomendado:** 800x600 píxeles
3. **Peso máximo:** 500KB por imagen

### **📝 NOMBRES DE PRODUCTOS:**
1. **Usar nombres claros** y descriptivos
2. **Incluir marca** cuando sea relevante
3. **Evitar caracteres especiales** en nombres de archivos

### **🏷️ CATEGORÍAS:**
1. **Usar colores diferentes** para cada categoría
2. **Mantener descripciones** breves y claras
3. **Usar imágenes representativas** de la categoría

---

## 🚀 FUNCIONES AVANZADAS

### **📊 ANALYTICS:**
- Ventas por día
- Productos más vendidos
- Conversión de combos
- Clientes únicos

### **💾 BACKUP:**
- Exportar datos
- Importar datos
- Backup automático

### **🔔 NOTIFICACIONES:**
- Email automático
- WhatsApp automático
- Notificaciones en tiempo real

---

## 📞 SOPORTE

### **🔧 Si tienes problemas:**
1. **Verificar consola:** F12 → Console
2. **Revisar esta guía:** Buscar solución
3. **Contactar soporte:** Con captura de pantalla del error

### **💡 CONSEJOS:**
- **Hacer backup** antes de cambios importantes
- **Probar en navegador** Chrome o Firefox
- **Mantener actualizado** el sistema

---

**🎉 ¡Tu panel de administración FRIOCAS está listo para usar!**
