# 🎯 Corrección Paso a Paso - Redirección Auth

## 📸 Lo Que Ves Ahora (Tu Pantalla)

**Site URL:**
```
https://cresalia-web.vercel.app
```

**Redirect URLs (5 actualmente):**
- ❌ `https://cresalia-web.vercel.app/login-comprador.html`
- ❌ `https://cresalia-web.vercel.app/login-tienda.html` (seleccionado)
- ❌ `https://cresalia-web.vercel.app/index-cresalia.html`
- ❌ `https://cresalia-web.vercel.app/registro-comprador.html`
- ❌ `https://cresalia-web.vercel.app/registro-tienda.html`

---

## ✅ Lo Que Debe Quedar

Mantener todo lo anterior PERO agregar:

```
https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-final.html
https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-servicios.html
https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-productos.html
```

---

## 🔧 PASO 1: Agregar las Nuevas URLs

### En la pantalla que estás viendo AHORA:

1. **Buscar el campo de texto** debajo de "Redirect URLs" (donde dice "URLs that auth providers...")

2. **Hay un campo de entrada** (input box) para agregar nuevas URLs

3. **Escribir** (copiar y pegar):
   ```
   https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-final.html
   ```

4. **Presionar Enter** o click en botón **"Add"**

5. **Repetir** para las otras URLs:
   ```
   https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-servicios.html
   https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-productos.html
   ```

6. **Debajo del listado**, click en botón verde **"Save"** o **"Save changes"**

---

## 🔧 PASO 2: Actualizar Site URL (Opcional pero Recomendado)

Si querés que por defecto vaya al admin-final cuando NO se especifica una URL:

1. En el campo **"Site URL"** (arriba)
2. **Cambiar de**:
   ```
   https://cresalia-web.vercel.app
   ```
   
3. **A**:
   ```
   https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-final.html
   ```

4. Click en botón verde **"Save changes"** (al lado del campo)

---

## 📧 PASO 3: Actualizar Email Template

1. **En la misma sección** de Authentication (barra lateral izquierda)
2. Click en **"Email Templates"**
3. Seleccionar **"Confirm signup"**
4. Buscar la línea que tiene el link (algo como `<a href="{{ .ConfirmationURL }}"`)

5. **Cambiar de**:
   ```html
   <a href="{{ .ConfirmationURL }}">Confirm your email</a>
   ```

6. **A**:
   ```html
   <a href="{{ .ConfirmationURL }}?redirect_to=https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-final.html">Confirmar mi email</a>
   ```

7. Scroll hacia abajo, click en **"Save"**

---

## ✅ Resultado Final

Después de estos cambios:

**Redirect URLs (8 total ahora):**
- ✅ `https://cresalia-web.vercel.app/login-comprador.html`
- ✅ `https://cresalia-web.vercel.app/login-tienda.html`
- ✅ `https://cresalia-web.vercel.app/index-cresalia.html`
- ✅ `https://cresalia-web.vercel.app/registro-comprador.html`
- ✅ `https://cresalia-web.vercel.app/registro-tienda.html`
- ✅ `https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-final.html` ← **NUEVO**
- ✅ `https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-servicios.html` ← **NUEVO**
- ✅ `https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-productos.html` ← **NUEVO**

**Site URL:**
```
https://cresalia-web.vercel.app/tiendas/ejemplo-tienda/admin-final.html
```

**Email Template:**
- Ahora redirige a `admin-final.html` ✅

---

## 🧪 Cómo Probar

1. **Crear usuario de prueba** con email temporal
2. **Revisar correo** de confirmación
3. **Click en link**
4. **Verificar**: ¿Te lleva a `admin-final.html`? ✅

---

## 📝 Si No Encuentras el Campo de Entrada

Si no ves un campo para agregar nuevas URLs:

1. **Buscar botón** "Add URL" o "Add Redirect URL"
2. Click ahí y aparecerá un campo
3. Pegar la URL
4. Click en "Add"

O alternativamente:

1. Copiar la lista completa de URLs separadas por comas
2. Buscar opción "Bulk edit" o "Edit as text"
3. Pegar todas las URLs

---

## 🆘 Si Algo Sale Mal

Si después de guardar algo no funciona:

1. **Verificar que se guardó**: Refrescar la página (F5)
2. **Ver las URLs**: Deben aparecer las 8 URLs
3. **Probar de nuevo** el registro/confirmación de email

---

💜 ¿Ya agregaste las URLs? ¿Aparecen en la lista?
