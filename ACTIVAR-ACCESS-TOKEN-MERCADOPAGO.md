# 🔑 Cómo Activar tu Access Token de Mercado Pago - Guía Rápida

## 🎯 Paso a Paso (5 minutos)

### 1️⃣ Obtener tu Access Token

1. **Andá a Mercado Pago:**
   - https://www.mercadopago.com.ar/
   - Iniciá sesión con tu cuenta

2. **Accedé a Credenciales:**
   - Menú lateral → **"Desarrolladores"** → **"Credenciales"**
   - O: **"Tu negocio"** → **"Tus integraciones"** → **"Credenciales"**

3. **Copiá tu Access Token:**
   - Buscá **"Credenciales de producción"** (si ya las tenés)
   - O **"Credenciales de prueba"** (para testear primero)
   - Copiá el **Access Token** (empieza con `APP_USR-...` o `TEST-...`)

---

### 2️⃣ Configurar en Vercel

1. **Abrí tu proyecto en Vercel:**
   - https://vercel.com/
   - Seleccioná **"cresalia-web"**

2. **Agregá las variables:**
   - **Settings** → **Environment Variables** → **"Add New"**
   
   **Variable 1: MERCADOPAGO_ACCESS_TOKEN**
   ```
   Name: MERCADOPAGO_ACCESS_TOKEN
   Value: APP_USR-tu-access-token-aqui
   Environments: ☑ Production ☑ Preview ☑ Development
   ```
   ⚠️ **IMPORTANTE**: Este es el **Access Token** (token de acceso). Es diferente del Public Key.
   
   **Variable 2: MERCADOPAGO_PUBLIC_KEY**
   ```
   Name: MERCADOPAGO_PUBLIC_KEY
   Value: APP_USR-tu-public-key-aqui
   Environments: ☑ Production ☑ Preview ☑ Development
   ```
   ⚠️ **IMPORTANTE**: Este es el **Public Key** (clave pública). Es diferente del Access Token.
   
   **¿Por qué son diferentes?**
   - **Access Token**: Se usa en el backend (servidor) - ES SECRETA
   - **Public Key**: Se usa en el frontend (navegador) - Es segura de compartir
   - Ambos empiezan con `APP_USR-...` pero son valores completamente diferentes

3. **Guardá:**
   - Hacé clic en **"Save"** para cada variable

---

### 3️⃣ Re-deployar

1. **Hacé un nuevo deploy:**
   - **Deployments** → **"..."** → **"Redeploy"**
   - O simplemente hacé un commit en GitHub

2. **Esperá 1-2 minutos:**
   - Vercel redeployará automáticamente
   - Las variables de entorno estarán disponibles

---

### 4️⃣ Verificar que Funcione

1. **Probá crear una preferencia de pago:**
   ```javascript
   // En la consola del navegador:
   await crearPreferenciaMercadoPago({
       items: [{
           title: 'Test',
           quantity: 1,
           unit_price: 10
       }],
       payer: {
           email: 'test@test.com'
       }
   });
   ```

2. **Si funciona:**
   - ✅ Verás un `preference_id` y un `init_point`
   - ✅ Podés redirigir al checkout de Mercado Pago

3. **Si no funciona:**
   - ❌ Verificá que las variables estén en Vercel
   - ❌ Verificá que hayas hecho un nuevo deploy
   - ❌ Revisá los logs de Vercel para ver errores

---

## 🔒 Protección de Anonimato con Alias

### ¿Qué es el Alias?

El **alias** (Statement Descriptor) es lo que aparece en el estado de cuenta del cliente. Protege tu anonimato.

**Ejemplo:**
- ❌ Sin alias: "CARLA GARCIA - CRESALIA" (expone tu nombre real)
- ✅ Con alias: "CRESALIA" (protege tu anonimato)

### Configurar el Alias

1. **En Mercado Pago (mañana cuando puedas cambiarlo):**
   - **"Tu negocio"** → **"Configuración"** → **"Pagos"**
   - Buscá **"Descripción en estado de cuenta"** o **"Statement Descriptor"**
   - Configurá: **"CRESALIA"** (máximo 22 caracteres)
   - **Límites:**
     - Máximo 22 caracteres
     - Solo letras, números y espacios
     - No caracteres especiales
   - **Tiempo de actualización**: Puede tardar hasta 24 horas

2. **En el código (ya está configurado):**
   - Ya está configurado en `api/mercadopago-preference.js`:
   ```javascript
   statement_descriptor: 'Cresalia'  // 🔒 Protege tu anonimato
   ```

3. **Guía completa:**
   - Ver `GUIA-CAMBIAR-ALIAS-MERCADOPAGO.md` para instrucciones detalladas

---

## ❓ Preguntas Frecuentes

### ¿Cómo sé si mi Access Token está activo?

- Probá crear una preferencia de pago
- Si recibís `401 Unauthorized`, el token no es válido
- Si recibís `400 Bad Request`, el token es válido pero hay un problema con los datos

### ¿Puedo usar el mismo token en desarrollo y producción?

- **No**. Usá credenciales de prueba (TEST) para desarrollo
- Usá credenciales de producción (APP_USR) solo en producción

### ¿El alias protege mi anonimato?

- **Sí**. El alias es lo que aparece en el estado de cuenta
- **NO** uses tu nombre real en el alias
- Usá un nombre genérico como "CRESALIA" o "CRESALIA TECH"

### ¿Dónde veo si un pago se procesó?

- En el panel de Mercado Pago: **"Tu negocio"** → **"Pagos"**
- O en los webhooks: `api/webhook-mercadopago.js`

---

## ✅ Checklist Final

- [ ] Access Token configurado en Vercel
- [ ] Public Key configurado en Vercel
- [ ] Nuevo deploy realizado
- [ ] Alias configurado en Mercado Pago (para proteger anonimato)
- [ ] Probado crear una preferencia de pago
- [ ] Verificado que funciona correctamente

---

## 🆘 ¿Necesitás Ayuda?

Si tenés problemas:

1. **Verificá las credenciales:**
   - ¿Están correctas?
   - ¿Están configuradas en Vercel?
   - ¿Hiciste un nuevo deploy?

2. **Revisá los logs:**
   - En Vercel: **"Deployments"** → **"Functions"** → **"Logs"**
   - Buscá errores relacionados con Mercado Pago

3. **Verificá el alias:**
   - ¿Está configurado en Mercado Pago?
   - ¿Tiene menos de 22 caracteres?
   - ¿No incluye caracteres especiales?

---

¡Éxitos con tus pagos! 💜

