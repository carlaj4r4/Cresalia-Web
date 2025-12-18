# 📧 Implementar Email de Bienvenida para Tiendas

## ❌ Estado Actual

El trigger `crear_perfil_tienda()` en Supabase **NO envía emails de bienvenida**.

Solo crea el registro en la tabla `tiendas`, pero no envía ningún email personalizado.

---

## ✅ 3 Opciones para Implementar

### **Opción 1: Frontend (Más Fácil y Recomendada)** ⭐

**Ventajas**:
- ✅ Fácil de implementar
- ✅ No requiere modificar Supabase
- ✅ Control total desde JavaScript

**Pasos**:

1. **Instalar servicio de emails** (gratis):
   - **Resend** (3,000 emails/mes gratis): https://resend.com
   - **SendGrid** (100 emails/día gratis): https://sendgrid.com
   - **Brevo** (300 emails/día gratis): https://www.brevo.com

2. **Crear template de email**:
   ```html
   <!-- email-bienvenida-tienda.html -->
   <!DOCTYPE html>
   <html>
   <head>
       <meta charset="UTF-8">
       <style>
           body { font-family: Arial, sans-serif; background: #f4f4f4; }
           .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 10px; }
           .header { text-align: center; color: #2563EB; }
           .content { margin: 20px 0; line-height: 1.6; }
           .button { display: inline-block; padding: 12px 30px; background: #2563EB; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
       </style>
   </head>
   <body>
       <div class="container">
           <div class="header">
               <h1>🎉 ¡Bienvenido a Cresalia!</h1>
           </div>
           <div class="content">
               <p>Hola <strong>{{NOMBRE_TIENDA}}</strong>,</p>
               <p>¡Estamos muy felices de tenerte en nuestra comunidad! 🚀</p>
               <p>Tu tienda <strong>{{NOMBRE_TIENDA}}</strong> ha sido creada exitosamente.</p>
               <p><strong>Próximos pasos:</strong></p>
               <ul>
                   <li>Completa tu perfil con información de contacto</li>
                   <li>Sube tus primeros productos o servicios</li>
                   <li>Personaliza el diseño de tu tienda</li>
                   <li>Comparte tu link único: <strong>{{SUBDOMAIN}}.cresalia.com</strong></li>
               </ul>
               <p style="text-align: center;">
                   <a href="https://cresalia.com/tiendas/panel.html" class="button">
                       Ir a mi Panel de Tienda
                   </a>
               </p>
               <p>Si tenés alguna duda, estamos acá para ayudarte.</p>
               <p>Saludos,<br><strong>El equipo de Cresalia</strong></p>
           </div>
       </div>
   </body>
   </html>
   ```

3. **Modificar `registro-tienda.html`** (después de registro exitoso):

   ```javascript
   // En registro-tienda.html, después de que signup sea exitoso
   
   // Agregar después de esta línea (buscar en el archivo):
   // const { data: { session }, error } = await supabase.auth.signUp({...})
   
   if (!error && session) {
       // Registro exitoso
       
       // NUEVO: Enviar email de bienvenida
       try {
           await enviarEmailBienvenida({
               email: email,
               nombreTienda: nombreTienda,
               subdomain: subdomain
           });
           console.log('✅ Email de bienvenida enviado');
       } catch (emailError) {
           console.error('⚠️ Error enviando email (no crítico):', emailError);
           // No mostrar error al usuario (no es crítico)
       }
       
       // Mostrar mensaje de éxito
       alert('¡Cuenta creada! Revisa tu email para confirmar.');
       window.location.href = '/tiendas/panel.html';
   }
   
   // NUEVA FUNCIÓN: Enviar email de bienvenida
   async function enviarEmailBienvenida(datos) {
       // Opción 1: Usar API de Resend
       const response = await fetch('https://api.resend.com/emails', {
           method: 'POST',
           headers: {
               'Authorization': 'Bearer re_TU_API_KEY_AQUI',
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({
               from: 'Cresalia <hola@cresalia.com>',
               to: datos.email,
               subject: '🎉 ¡Bienvenido a Cresalia!',
               html: `
                   <h1>¡Hola ${datos.nombreTienda}!</h1>
                   <p>Tu tienda ha sido creada exitosamente.</p>
                   <p>Tu link único: <strong>${datos.subdomain}.cresalia.com</strong></p>
                   <a href="https://cresalia.com/tiendas/panel.html">Ir a mi Panel</a>
               `
           })
       });
       
       if (!response.ok) {
           throw new Error('Error enviando email');
       }
       
       return response.json();
   }
   ```

---

### **Opción 2: Edge Function de Supabase (Intermedio)**

**Ventajas**:
- ✅ Serverless (sin servidor propio)
- ✅ Integrado con Supabase

**Pasos**:

1. **Crear Edge Function en Supabase Dashboard**:
   - Dashboard → Edge Functions → New Function
   - Nombre: `send-welcome-email`

2. **Código de la función**:
   ```typescript
   // supabase/functions/send-welcome-email/index.ts
   
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
   
   const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
   
   serve(async (req) => {
     try {
       const { email, nombreTienda, subdomain } = await req.json()
       
       const res = await fetch('https://api.resend.com/emails', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${RESEND_API_KEY}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           from: 'Cresalia <hola@cresalia.com>',
           to: email,
           subject: '🎉 ¡Bienvenido a Cresalia!',
           html: `<h1>¡Hola ${nombreTienda}!</h1><p>Tu tienda ha sido creada.</p>`
         })
       })
       
       const data = await res.json()
       return new Response(JSON.stringify(data), { status: 200 })
     } catch (error) {
       return new Response(JSON.stringify({ error: error.message }), { status: 500 })
     }
   })
   ```

3. **Llamar desde frontend**:
   ```javascript
   // En registro-tienda.html
   const { data, error } = await supabase.functions.invoke('send-welcome-email', {
       body: { 
           email: email, 
           nombreTienda: nombreTienda, 
           subdomain: subdomain 
       }
   })
   ```

---

### **Opción 3: Trigger SQL con Webhook (Avanzado)**

**Ventajas**:
- ✅ Automático (sin código frontend)
- ✅ Se ejecuta siempre

**Desventajas**:
- ❌ Requiere extensión `pg_net` (solo en Supabase Pro $25/mes)
- ❌ Más complejo

**Pasos** (solo si tenés Supabase Pro):

1. **Habilitar extensión `pg_net`**:
   ```sql
   CREATE EXTENSION IF NOT EXISTS pg_net;
   ```

2. **Modificar trigger**:
   ```sql
   CREATE OR REPLACE FUNCTION crear_perfil_tienda()
   RETURNS TRIGGER AS $$
   DECLARE
       nombre_tienda TEXT;
       subdomain_tienda TEXT;
       response_id bigint;
   BEGIN
       -- ... código actual ...
       
       -- NUEVO: Enviar webhook para email
       SELECT net.http_post(
           url := 'https://tu-edge-function.supabase.co/send-welcome-email',
           headers := '{"Content-Type": "application/json"}'::jsonb,
           body := jsonb_build_object(
               'email', NEW.email,
               'nombreTienda', nombre_tienda,
               'subdomain', subdomain_tienda
           )
       ) INTO response_id;
       
       RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

---

## 🎯 Recomendación

**Usa Opción 1 (Frontend)** porque:
1. ✅ Fácil de implementar (5 minutos)
2. ✅ Gratis (3,000 emails/mes con Resend)
3. ✅ No requiere Supabase Pro
4. ✅ Más control y debugging

---

## 📋 Checklist de Implementación

### **Con Resend (Recomendado)**

- [ ] Crear cuenta en https://resend.com
- [ ] Obtener API Key
- [ ] Verificar dominio (opcional, pero recomendado)
- [ ] Copiar template HTML de email
- [ ] Agregar función `enviarEmailBienvenida()` en `registro-tienda.html`
- [ ] Llamar función después de `signUp` exitoso
- [ ] Probar creando cuenta de prueba
- [ ] Verificar que llega el email

---

## 🧪 Código de Prueba

```javascript
// Probar email manualmente desde consola del navegador

async function probarEmailBienvenida() {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer re_TU_API_KEY',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'Prueba <onboarding@resend.dev>', // Email de prueba de Resend
            to: 'tu-email@gmail.com',
            subject: 'Prueba de Email de Bienvenida',
            html: '<h1>¡Funciona!</h1><p>Email de prueba exitoso.</p>'
        })
    });
    
    const data = await response.json();
    console.log('Resultado:', data);
}

// Ejecutar en consola:
probarEmailBienvenida();
```

---

## 💰 Costos

| Servicio | Gratis | Pago |
|---|---|---|
| **Resend** | 3,000/mes | $20/mes (50,000) |
| **SendGrid** | 100/día | $19.95/mes (50,000) |
| **Brevo** | 300/día | $25/mes (20,000) |

**Recomendación**: Empezar con **Resend** (más generoso y moderno)

---

## 📧 Ejemplo de Email Completo

Ver archivo adjunto: `email-bienvenida-tienda.html`

---

## ❓ ¿Querés que lo implemente?

Si querés, puedo:
1. Crear el template de email HTML completo
2. Modificar `registro-tienda.html` para enviar el email
3. Configurar Resend API (necesitás darme tu API key)
4. Probar con una cuenta de prueba

**¿Qué preferís?** 🚀
