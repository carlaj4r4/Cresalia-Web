# 📱 Nombre de Aplicación en Solicitudes de Permisos

## 🎯 **OBJETIVO**

Cambiar el nombre que aparece en las solicitudes de permisos de **"cresalia-web.vercel.app"** a **"Cresalia"**.

---

## ✅ **CAMBIOS REALIZADOS**

### **1. Manifest.json**
- ✅ `"name": "Cresalia"` (antes: "Cresalia - Plataforma de Emprendedores")
- ✅ `"short_name": "Cresalia"` (ya estaba correcto)
- ✅ Cache busting actualizado a `v=6.0`

### **2. Meta Tags en index-cresalia.html**
- ✅ `<meta name="application-name" content="Cresalia">`
- ✅ `<meta name="apple-mobile-web-app-title" content="Cresalia">`
- ✅ Manifest link actualizado a `/manifest.json?v=6.0`

---

## 📋 **CÓMO FUNCIONA**

### **Notificaciones Push:**
El nombre que aparece en las solicitudes de permisos de notificaciones viene del:
1. **Manifest.json** → `"name"` o `"short_name"`
2. **Meta tag** → `<meta name="application-name">`
3. **Título de la página** → `<title>`

### **Ubicación:**
El nombre que aparece en las solicitudes de permisos de ubicación viene del:
1. **Manifest.json** → `"name"` o `"short_name"`
2. **Dominio del sitio** (si no hay manifest)

---

## ⚠️ **LIMITACIONES DEL NAVEGADOR**

### **Por qué no siempre aparece "Cresalia":**

1. **Cache del navegador:**
   - El navegador puede tener cacheado el manifest anterior
   - **Solución:** Limpiar cache o usar modo incógnito

2. **Navegadores diferentes:**
   - Chrome/Edge: Usa principalmente el manifest
   - Firefox: Puede usar el dominio si no encuentra el manifest
   - Safari: Usa `apple-mobile-web-app-title`

3. **Páginas diferentes:**
   - Si una página no tiene el manifest cargado, usará el dominio
   - **Solución:** Asegurar que todas las páginas tengan el manifest

4. **HTTPS requerido:**
   - El manifest solo funciona completamente en HTTPS
   - En desarrollo local puede no funcionar correctamente

---

## 🔍 **VERIFICACIÓN**

### **Cómo verificar que funciona:**

1. **Limpiar cache del navegador:**
   - Chrome: `Ctrl+Shift+Delete` → Limpiar datos de navegación
   - O usar modo incógnito

2. **Verificar manifest:**
   - Abrir: `https://cresalia-web.vercel.app/manifest.json`
   - Verificar que `"name": "Cresalia"`

3. **Probar solicitud de permisos:**
   - Abrir la página en modo incógnito
   - Debería aparecer "Cresalia" en lugar del dominio

---

## 📝 **SOBRE LA UBICACIÓN**

### **¿Por qué no se pide en todos lados?**

Es **normal** que la ubicación no se pida en todas las páginas/celulares:

1. **Depende del código:**
   - Solo se pide si hay código que usa `navigator.geolocation.getCurrentPosition()`
   - No todas las páginas lo necesitan

2. **Depende del navegador:**
   - Chrome: Pide permiso la primera vez
   - Firefox: Puede ser más restrictivo
   - Safari (iOS): Muy restrictivo, solo en contextos específicos

3. **Depende del contexto:**
   - HTTPS: Funciona mejor
   - HTTP: Puede no funcionar
   - Localhost: Funciona para desarrollo

4. **Páginas que SÍ piden ubicación:**
   - `index-cresalia.html` - Para calcular distancias a tiendas
   - Comunidades con alertas de emergencia
   - Sistema de check-in de emergencias

5. **Páginas que NO piden ubicación:**
   - Páginas de admin
   - Páginas de comunidades sin alertas
   - Páginas estáticas

---

## ✅ **RESULTADO ESPERADO**

Después de estos cambios:
- ✅ Las solicitudes de **notificaciones push** deberían mostrar **"Cresalia"**
- ✅ Las solicitudes de **ubicación** deberían mostrar **"Cresalia"** (si el manifest está cargado)
- ⚠️ Puede requerir limpiar cache del navegador para ver los cambios

---

**Última actualización:** 2025-01-27

