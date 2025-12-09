# 🔧 Configurar URLs de Redirección en Supabase

## ⚠️ Problema Actual

El email de confirmación de Supabase tiene un link a `localhost`, que no funciona en producción.

## ✅ Solución

### Paso 1: Ir a Supabase Dashboard

1. Ve a https://app.supabase.com
2. Selecciona tu proyecto **CRESALIA-Tiendas**
3. Ve a **Authentication** → **URL Configuration**

### Paso 2: Configurar Site URL

En **Site URL**, pon:
```
https://cresalia-web.vercel.app
```

### Paso 3: Configurar Redirect URLs

En **Redirect URLs**, agrega estas URLs (una por línea):
```
https://cresalia-web.vercel.app/login-comprador.html
https://cresalia-web.vercel.app/login-tienda.html
https://cresalia-web.vercel.app/registro-comprador.html
https://cresalia-web.vercel.app/registro-tienda.html
https://cresalia-web.vercel.app/index-cresalia.html
http://localhost:8080/login-comprador.html
http://localhost:8080/login-tienda.html
http://localhost:8080/registro-comprador.html
http://localhost:8080/registro-tienda.html
http://localhost:8080/index-cresalia.html
```

**Nota:** Supabase NO acepta asteriscos (`*`) en las URLs. Debes agregar cada URL específica que necesites.

### Paso 4: Guardar

Haz clic en **Save** y espera unos segundos.

## 📧 Qué Hace Esto

Ahora cuando un usuario se registre:
1. Recibirá un email de confirmación
2. Al hacer clic en el link del email
3. Será redirigido a `https://cresalia-web.vercel.app/login-comprador.html` (o login-tienda.html según corresponda)
4. Ya no verá "localhost not found"

## 🔍 Verificar que Funcionó

1. Intenta registrarte con un nuevo email
2. Revisa tu bandeja de entrada
3. Haz clic en el link de confirmación del email
4. Deberías ser redirigido a la página de login en producción

## 📝 Nota

Los cambios en el código (`auth/auth-system.js`) ya están hechos para usar estas URLs automáticamente según si estás en producción o desarrollo local.

