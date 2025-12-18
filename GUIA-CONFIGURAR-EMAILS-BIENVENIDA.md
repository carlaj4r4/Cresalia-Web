# 📧 Guía: Configurar Emails de Bienvenida

## ✅ Archivos Creados

He creado TODO el sistema de emails de bienvenida para tiendas, servicios y emprendedores:

### **Templates HTML** (3 archivos):
1. ✅ `templates/email-bienvenida-tienda.html` - Email para tiendas
2. ✅ `templates/email-bienvenida-servicio.html` - Email para servicios  
3. ✅ `templates/email-bienvenida-emprendedor.html` - Email para emprendedores

### **Módulo JavaScript**:
4. ✅ `js/email-bienvenida.js` - Sistema completo de envío de emails

---

## 🚀 Instalación en 5 Pasos

### **Paso 1: Crear Cuenta en Resend** (2 minutos)

1. Ve a: https://resend.com
2. Click **"Sign Up"**
3. Crea cuenta con tu email
4. Confirma tu email

✅ **Plan gratuito**: 3,000 emails/mes (más que suficiente)

---

### **Paso 2: Obtener API Key** (1 minuto)

1. Una vez logueado, ve a: **API Keys** (menú lateral)
2. Click **"Create API Key"**
3. Nombre: `Cresalia Production`
4. Permisos: **"Sending access"**
5. Click **"Create"**
6. **COPIA LA KEY** (solo se muestra una vez): `re_xxxxxxxxx`

---

### **Paso 3: Configurar Dominio (Opcional pero Recomendado)** (5 minutos)

**Opción A: Usar dominio propio** (recomendado):

1. En Resend, ve a **Domains**
2. Click **"Add Domain"**
3. Ingresa tu dominio: `cresalia.com`
4. Resend te dará registros DNS para agregar:
   ```
   Tipo: MX
   Host: @
   Value: feedback-smtp.resend.com
   Priority: 10
   
   Tipo: TXT
   Host: @
   Value: v=spf1 include:amazonses.com ~all
   
   ... (más registros)
   ```
5. Agrega estos registros en tu proveedor de DNS (ej: Vercel, Cloudflare)
6. Espera 5-10 minutos para verificación
7. Una vez verificado, podés usar: `hola@cresalia.com`

**Opción B: Usar dominio de prueba de Resend** (más rápido):

- Usa: `onboarding@resend.dev`
- Limitación: Solo puede enviar a tu propio email (para testing)

---

### **Paso 4: Configurar API Key en Vercel** (2 minutos)

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto **Cresalia-Web**
3. Ve a **Settings** → **Environment Variables**
4. Agrega NUEVA variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_xxxxxxxxx` (tu API key de Resend)
   - **Environments**: Production, Preview, Development (selecciona todos)
5. Click **"Save"**

---

### **Paso 5: Actualizar Archivos de Registro** (5 minutos)

Necesitás agregar el código en **3 archivos**:

#### **A) `registro-tienda.html`**

Busca la línea donde está `supabase.auth.signUp` (aproximadamente línea 200-300).

Después de que el registro sea exitoso, agrega:

```html
<script src="/js/email-bienvenida.js"></script>

<script>
// ... código existente de signUp ...

const { data: { session }, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
        data: {
            tipo_usuario: 'vendedor',
            nombre_tienda: nombreTienda,
            // ... otros datos
        }
    }
});

if (!error && session) {
    // NUEVO: Enviar email de bienvenida
    try {
        await enviarEmailBienvenida({
            email: email,
            nombre: nombreTienda,
            tipo: 'tienda',
            subdomain: subdomain,
            plan: plan || 'basico'
        });
        console.log('✅ Email de bienvenida enviado');
    } catch (emailError) {
        console.warn('⚠️ Error enviando email (no crítico):', emailError);
        // No mostrar error al usuario (no bloquea el registro)
    }
    
    // ... resto del código (redirect, etc.)
}
</script>
```

#### **B) `registro-emprendedor.html`**

Similar al anterior, pero cambia el tipo:

```javascript
await enviarEmailBienvenida({
    email: email,
    nombre: nombreEmprendedor,
    tipo: 'emprendedor',  // ← Cambio aquí
    subdomain: subdomain
});
```

#### **C) Para Servicios** (si existe archivo separado)

```javascript
await enviarEmailBienvenida({
    email: email,
    nombre: nombreServicio,
    tipo: 'servicio',  // ← Cambio aquí
    subdomain: subdomain
});
```

---

## 🧪 Paso 6: Probar el Sistema (2 minutos)

### **Opción A: Prueba Manual desde Consola**

1. Abre cualquier página de tu sitio
2. Abre **DevTools** (F12)
3. Ve a **Console**
4. Copia y pega:

```javascript
// Cargar módulo
const script = document.createElement('script');
script.src = '/js/email-bienvenida.js';
document.head.appendChild(script);

// Esperar 1 segundo y probar
setTimeout(async () => {
    const resultado = await enviarEmailBienvenida({
        email: 'tu-email@gmail.com',  // ← Cambia por tu email
        nombre: 'Tienda de Prueba',
        tipo: 'tienda',
        subdomain: 'prueba',
        plan: 'basico'
    });
    console.log('Resultado:', resultado);
}, 1000);
```

5. Revisa tu email en **1-2 minutos**
6. Deberías recibir un email hermoso con el template personalizado!

### **Opción B: Prueba Creando Cuenta Real**

1. Ve a tu página de registro: `https://cresalia.com/registro-tienda.html`
2. Crea una cuenta de prueba
3. Revisa tu email
4. Deberías recibir:
   - Email de confirmación de Supabase
   - **Email de bienvenida personalizado** ← NUEVO

---

## 🎨 Personalizar Templates (Opcional)

Los templates están en `/templates/` y son HTML completo.

**Para editar**:

1. Abre `templates/email-bienvenida-tienda.html`
2. Modifica el HTML como quieras:
   - Cambiar colores
   - Agregar tu logo
   - Modificar texto
   - Agregar más secciones
3. Guarda el archivo
4. El sistema usa templates inline en `js/email-bienvenida.js`
5. Copia el HTML modificado al string del template en el JS

**Recomendación**: Mantener los templates inline (en el JS) para evitar problemas de carga de archivos.

---

## 🔧 Configuración Avanzada

### **Cambiar Email Remitente**

En `js/email-bienvenida.js`, línea 12:

```javascript
const FROM_EMAIL = 'Cresalia <hola@cresalia.com>'; // ← Cambiar aquí
```

**Opciones**:
- `'Equipo Cresalia <soporte@cresalia.com>'`
- `'Bienvenida Cresalia <bienvenida@cresalia.com>'`
- `'noreply@cresalia.com'` (no recomendado, menos personal)

### **Configurar API Key desde Vercel**

En lugar de hardcodear la key en el JS, podés usar variables de entorno:

```javascript
// En js/email-bienvenida.js
const RESEND_API_KEY = process.env.RESEND_API_KEY || 'TU_API_KEY_AQUI';
```

Pero **IMPORTANTE**: Esto solo funciona en el **servidor** (Node.js), NO en el cliente (navegador).

**Para usar en cliente**, necesitarías:
1. Crear un API endpoint en Vercel (`/api/send-email.js`)
2. Llamar a ese endpoint desde el cliente
3. El endpoint lee `process.env.RESEND_API_KEY`

---

## 🛡️ Seguridad

### **⚠️ IMPORTANTE: Proteger API Key**

**NUNCA expongas tu API key en el código del cliente** (navegador).

**Solución Recomendada**:

1. Crea un API endpoint en Vercel:

```javascript
// api/send-welcome-email.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { email, nombre, tipo, subdomain, plan } = req.body;
    
    // Validar datos
    if (!email || !nombre || !tipo) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Enviar email usando API key desde ENV
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'Cresalia <hola@cresalia.com>',
            to: email,
            subject: `¡Bienvenido a Cresalia, ${nombre}!`,
            html: `<h1>Bienvenido ${nombre}!</h1>...`
        })
    });
    
    const data = await response.json();
    return res.status(200).json(data);
}
```

2. Llama al endpoint desde el cliente:

```javascript
// En registro-tienda.html
await fetch('/api/send-welcome-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: email,
        nombre: nombreTienda,
        tipo: 'tienda',
        subdomain: subdomain,
        plan: plan
    })
});
```

---

## 📊 Monitoreo

### **Ver Emails Enviados**

1. Ve a Resend Dashboard: https://resend.com/emails
2. Verás lista de todos los emails enviados
3. Click en cualquier email para ver:
   - Estado (delivered, bounced, opened)
   - Fecha y hora
   - Contenido HTML
   - Errores (si hubo)

### **Logs en Consola**

El sistema registra en console:

```
✅ Email de bienvenida enviado: { email: '...', tipo: 'tienda', id: '...' }
```

O en caso de error:

```
❌ Error enviando email de bienvenida: Error: ...
```

---

## ❓ Troubleshooting

### **Error: "Authorization required"**

**Causa**: API key incorrecta o no configurada

**Solución**:
1. Verifica que copiaste bien la API key
2. Asegúrate que empiece con `re_`
3. Revisa que esté en `RESEND_API_KEY` en Vercel

### **Error: "Invalid from address"**

**Causa**: El email remitente no está verificado

**Solución**:
- Opción 1: Usa `onboarding@resend.dev` (solo para testing)
- Opción 2: Verifica tu dominio en Resend (ver Paso 3)

### **Email no llega**

**Posibles causas**:
1. **Carpeta de spam**: Revisa spam/junk
2. **Dominio no verificado**: Verifica tu dominio en Resend
3. **Límite alcanzado**: Free plan = 3,000/mes
4. **Email inválido**: Verifica que el email sea correcto

### **Error: "CORS"**

**Causa**: Fetch desde cliente bloqueado por CORS

**Solución**: Usar API endpoint en Vercel (ver sección Seguridad)

---

## 💰 Costos

### **Resend Pricing**

| Plan | Emails/mes | Costo |
|---|---|---|
| **Free** | 3,000 | $0 |
| **Pro** | 50,000 | $20/mes |
| **Enterprise** | Ilimitado | Custom |

**Con 3,000 emails/mes gratis podés tener**:
- ~100 registros/día
- ~3,000 registros/mes
- Más que suficiente para empezar!

---

## 📋 Checklist de Implementación

- [ ] Crear cuenta en Resend
- [ ] Obtener API key
- [ ] (Opcional) Verificar dominio
- [ ] Configurar `RESEND_API_KEY` en Vercel
- [ ] Agregar `<script src="/js/email-bienvenida.js"></script>` en páginas de registro
- [ ] Agregar llamada a `enviarEmailBienvenida()` después de `signUp`
- [ ] Hacer commit y push a GitHub
- [ ] Deploy en Vercel
- [ ] Probar con cuenta de prueba
- [ ] Verificar que el email llega
- [ ] ¡Listo! 🎉

---

## 🎉 Resultado Final

**Cuando un usuario se registre**:

1. ✅ Se crea cuenta en Supabase
2. ✅ Se crea registro en tabla `tiendas`/`servicios`
3. ✅ Supabase envía email de confirmación (default)
4. ✅ **TU SISTEMA envía email de bienvenida personalizado** ← NUEVO
5. ✅ Usuario recibe 2 emails:
   - Confirmación de cuenta (Supabase)
   - Bienvenida hermosa con tu template (Resend)

---

## 💡 Tips

1. **Testing**: Usa `onboarding@resend.dev` para probar sin verificar dominio
2. **Templates**: Los templates son responsive (se ven bien en mobile)
3. **Personalización**: Podés agregar más variables (logo, colores, etc.)
4. **Analytics**: Resend te muestra tasas de apertura y clicks
5. **No bloquea registro**: Si falla el email, el registro sigue funcionando

---

## 🚀 Siguientes Pasos (Opcional)

- Agregar emails de bienvenida para **compradores** también
- Crear email de **confirmación de primer producto/servicio**
- Email de **consejos semanales** para nuevos usuarios
- Email de **cumpleaños** (ya tenés el sistema de fechas!)
- Email de **recordatorio** si no completan perfil

---

**¿Querés que te ayude con alguno de estos pasos?** 😊
