# 🔧 Solución: Emails de Recuperación de Contraseña No Llegan

## ❌ Problema

Los emails de recuperación de contraseña no están llegando a los usuarios.

---

## ✅ Soluciones Implementadas

### **1. Corregido Error `ReferenceError: initSupabase is not defined`**

**Archivo:** `demo-buyer-interface.html`

- ✅ Corregido error de sintaxis en línea 3095 (`</script>`n` → `</script>`)
- ✅ Cambiado script de `/config-supabase-seguro.js` a `auth/supabase-config.js`
- ✅ Agregada función `esperarInitSupabase()` para esperar a que `initSupabase` esté disponible
- ✅ Modificadas funciones `cargarDatosUsuario()`, `cerrarSesionComprador()`, `subirAvatarASupabase()` para usar `esperarInitSupabase()`

### **2. Corregida Redirección en `reset-password.html`**

**Archivo:** `auth/reset-password.html`

- ✅ Mejorada detección de tipo de usuario para verificar primero en tabla `tiendas` (más confiable)
- ✅ Agregada función `esperarInitSupabaseReset()` para esperar a que `initSupabase` esté disponible
- ✅ Mejorado procesamiento del hash de reset password

---

## 🔍 Verificar Configuración de Supabase para Emails

### **Paso 1: Verificar Email Templates en Supabase**

1. Ir a **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Verificar que existe el template **"Reset Password"**
3. Verificar que el template contiene:
   ```
   {{ .ConfirmationURL }}
   ```
4. Verificar que el template usa la URL correcta:
   ```
   https://cresalia-web.vercel.app/auth/reset-password.html
   ```

### **Paso 2: Verificar Redirect URLs en Supabase**

1. Ir a **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Verificar que existe en **Redirect URLs**:
   ```
   https://cresalia-web.vercel.app/auth/reset-password.html
   https://cresalia-web.vercel.app/**
   ```
3. Si no existe, agregarlo y hacer clic en **"Save"**

### **Paso 3: Verificar SMTP Settings (Opcional)**

Si los emails de Supabase no llegan, puedes configurar un SMTP personalizado:

1. Ir a **Supabase Dashboard** → **Settings** → **Auth**
2. Buscar **"SMTP Settings"**
3. Configurar con tu proveedor de email (Gmail, SendGrid, etc.)

**NOTA:** Supabase tiene un límite de emails gratuitos por día. Si excediste el límite, los emails no llegarán.

---

## 🧪 Verificar que Funciona

### **Test 1: Verificar Función de Recuperación**

1. Abrir `login.html` o `login-comprador.html`
2. Hacer clic en "¿Olvidaste tu contraseña?"
3. Ingresar un email válido
4. Verificar en consola:
   ```
   📧 Enviando email de recuperación...
   🔗 URL de redirección para reset password: https://cresalia-web.vercel.app/auth/reset-password.html
   ✅ Email enviado
   ```

### **Test 2: Verificar Email Recibido**

1. Revisar la bandeja de entrada del email
2. Si no llega, revisar:
   - Carpeta de spam
   - Límite de emails de Supabase (Dashboard → Settings → Usage)
   - Configuración de SMTP

### **Test 3: Verificar Redirección Después de Reset**

1. Hacer clic en el enlace del email
2. Ingresar nueva contraseña
3. Verificar que redirige correctamente:
   - **Vendedores/Emprendedores/Servicios** → `admin-final.html`
   - **Compradores** → `demo-buyer-interface.html`

---

## 📋 Archivos Modificados

- ✅ `demo-buyer-interface.html`
  - Corregido error de sintaxis
  - Corregido script de Supabase config
  - Agregada función `esperarInitSupabase()`
  - Mejoradas funciones que usan `initSupabase()`

- ✅ `auth/reset-password.html`
  - Mejorada detección de tipo de usuario
  - Agregada función `esperarInitSupabaseReset()`
  - Mejorado procesamiento del hash

---

## ⚠️ Posibles Problemas Adicionales

### **1. Límite de Emails de Supabase**

Supabase tiene un límite de emails gratuitos. Verificar en:
- **Supabase Dashboard** → **Settings** → **Usage**

### **2. Emails en Spam**

Los emails de Supabase pueden ir a spam. Verificar:
- Carpeta de spam
- Configurar SMTP personalizado si es necesario

### **3. URL de Redirección Incorrecta**

Si la URL de redirección no está en la lista de URLs permitidas de Supabase, el enlace no funcionará.

---

## 💡 Recomendaciones

1. **Configurar SMTP Personalizado** (si los emails de Supabase no llegan)
   - Usar Gmail, SendGrid, o Brevo
   - Configurar en Supabase Dashboard → Settings → Auth → SMTP Settings

2. **Monitorear Uso de Emails**
   - Revisar Dashboard → Settings → Usage regularmente
   - Considerar upgrade si se excede el límite

3. **Probar con Diferentes Emails**
   - Probar con Gmail, Outlook, etc.
   - Verificar que no estén bloqueados por el servidor

---

¿Querés que verifique la configuración de Supabase o que configure un SMTP personalizado? 😊💜
