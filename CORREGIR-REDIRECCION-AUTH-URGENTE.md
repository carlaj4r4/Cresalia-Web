# 🚨 URGENTE: Corregir Redirección de Autenticación

## ❌ Problema Actual

Cuando los usuarios confirman su email, están siendo redirigidos a un **panel con errores** en lugar del panel correcto.

**Panel CORRECTO que debe usarse:**
```
https://cresalia.com/tiendas/ejemplo-tienda/admin-final.html
```

---

## 🔧 SOLUCIÓN: Configurar en Supabase Dashboard

### **PASO 1: Ir a Configuración de Auth**

1. Ir a: https://supabase.com/dashboard
2. Seleccionar proyecto **"Cresalia"** (tiendas)
3. En la barra lateral: **Authentication** (🔐)
4. Click en **"URL Configuration"**

---

### **PASO 2: Configurar URLs de Redirección**

Buscar y actualizar estas configuraciones:

#### **Site URL** (URL principal del sitio)
```
https://cresalia.com
```

#### **Redirect URLs** (URLs permitidas para redirección)
Agregar TODAS estas:
```
https://cresalia.com/tiendas/ejemplo-tienda/admin-final.html
https://cresalia.com/tiendas/ejemplo-tienda/admin-final.html?*
https://cresalia.com/*
http://localhost:*
```

---

### **PASO 3: Configurar Email Templates**

1. En Authentication → Click en **"Email Templates"**
2. Seleccionar **"Confirm signup"**
3. Buscar la línea con `{{ .ConfirmationURL }}`
4. Modificar para que redirija al panel correcto:

**Cambiar de:**
```html
<a href="{{ .ConfirmationURL }}">Confirm your mail</a>
```

**A:**
```html
<a href="{{ .ConfirmationURL }}?redirect_to=https://cresalia.com/tiendas/ejemplo-tienda/admin-final.html">Confirmar email</a>
```

---

### **PASO 4: Configurar en Vercel (Variables de Entorno)**

Si usás variables de entorno en Vercel, también actualizar:

1. Ir a: https://vercel.com/dashboard
2. Tu proyecto → Settings → Environment Variables
3. Buscar o agregar:

```
NEXT_PUBLIC_SITE_URL=https://cresalia.com
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=https://cresalia.com/tiendas/ejemplo-tienda/admin-final.html
```

---

## 📧 Email de Bienvenida No Se Envía

### **Causa Posible**

Supabase **NO envía un "email de bienvenida" automáticamente**. Solo envía:
1. **Email de confirmación** (cuando el usuario se registra)
2. **Reset password** (cuando solicita cambio de contraseña)
3. **Magic link** (si usás ese método)

### **Solución: Crear Email de Bienvenida Automático**

Necesitás configurar un **Database Trigger** que envíe el email cuando el usuario confirma:

#### **SQL para Trigger de Bienvenida**

```sql
-- Función para enviar email de bienvenida
CREATE OR REPLACE FUNCTION enviar_email_bienvenida()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo si el email fue confirmado recientemente
    IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
        
        -- Aquí puedes:
        -- 1. Llamar a Brevo API para enviar email
        -- 2. Insertar en una tabla de cola de emails
        -- 3. Usar Supabase Edge Function
        
        RAISE NOTICE 'Usuario confirmado: %. Enviar email de bienvenida', NEW.email;
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger en auth.users
DROP TRIGGER IF EXISTS trigger_bienvenida ON auth.users;

CREATE TRIGGER trigger_bienvenida
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION enviar_email_bienvenida();
```

#### **Alternativa: Edge Function de Bienvenida**

Crear una Edge Function que escuche eventos de auth y envíe el email:

**Archivo:** `supabase/functions/enviar-bienvenida/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { user } = await req.json()
  
  // Enviar email de bienvenida con Brevo
  const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')
  
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: {
        name: 'Cresalia',
        email: 'bienvenida@cresalia.com'
      },
      to: [{ email: user.email }],
      subject: '🎉 ¡Bienvenido a Cresalia!',
      htmlContent: `
        <h1>¡Hola ${user.user_metadata?.nombre || 'nuevo usuario'}!</h1>
        <p>Gracias por confirmar tu email. Ya podés empezar a usar Cresalia.</p>
        <a href="https://cresalia.com/tiendas/ejemplo-tienda/admin-final.html">
          Ir al Panel de Administración
        </a>
      `
    })
  })
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

---

## 🔍 Verificar Configuración Actual

### **Ver qué URL está configurada:**

1. Supabase Dashboard → Tu proyecto
2. Authentication → URL Configuration
3. Ver **"Site URL"** y **"Redirect URLs"**
4. Capturar pantalla si es necesario

---

## ✅ Checklist de Corrección

- [ ] Site URL configurada: `https://cresalia.com`
- [ ] Redirect URLs incluyen: `https://cresalia.com/tiendas/ejemplo-tienda/admin-final.html`
- [ ] Email template de confirmación actualizado
- [ ] Trigger de bienvenida creado (opcional)
- [ ] Edge Function de bienvenida deployada (opcional)
- [ ] Probar registro de nuevo usuario

---

## 🧪 Cómo Probar

1. **Crear usuario de prueba** con un email temporal (ejemplo: `test+123@tudominio.com`)
2. **Revisar email** de confirmación
3. **Click en link** de confirmación
4. **Verificar redirección** → ¿Va a `admin-final.html`? ✅
5. **Verificar email de bienvenida** (si implementaste el trigger)

---

## 📱 Importante para PWA y Móvil

Si también querés que funcione en PWA/móvil, agregar en Redirect URLs:

```
cresalia://auth/callback
com.cresalia.app://auth/callback
capacitor://localhost/auth/callback
```

---

## 🆘 Si No Podés Acceder al Dashboard

Si no tenés acceso al Dashboard de Supabase o necesitás que te ayude:

1. Dame acceso temporal, o
2. Enviame screenshot de la configuración actual, o
3. Decime qué pantalla ves y te guío paso a paso

---

💜 ¿En cuál paso estás? ¿Necesitás que te guíe con capturas de pantalla?
