# 🔐 Variables de Entorno para Webhook de MercadoPago

## ⚠️ IMPORTANTE: NO uses NEXT_PUBLIC_ para el Webhook

El webhook es una **función serverless** que se ejecuta **solo en el servidor**. Por lo tanto:

### ❌ NO uses:
```
NEXT_PUBLIC_MERCADOPAGO_ACCESS_TOKEN  ❌ (INCORRECTO)
```

### ✅ SÍ usa:
```
MERCADOPAGO_ACCESS_TOKEN  ✅ (CORRECTO - sin prefijo)
```

---

## 📋 Variables Necesarias

### Para el Webhook (SIN prefijo `NEXT_PUBLIC_`)

Estas variables **NO** deben tener el prefijo porque son **privadas** y solo se usan en el servidor:

1. **`MERCADOPAGO_ACCESS_TOKEN`**
   - Token de acceso privado
   - Se usa solo en el servidor (webhook y crear preferencia)
   - **NUNCA** debe estar en el cliente

2. **`SUPABASE_URL`** (opcional, para guardar webhooks)
   - URL de tu proyecto Supabase
   - Solo se usa en el servidor

3. **`SUPABASE_SERVICE_ROLE_KEY`** (opcional, para guardar webhooks)
   - Clave de servicio de Supabase
   - Solo se usa en el servidor

### Para el Cliente (CON prefijo `NEXT_PUBLIC_`)

Esta variable **SÍ** debe tener el prefijo porque es **pública** y se usa en el navegador:

1. **`NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`**
   - Clave pública de MercadoPago
   - Segura de exponer en el navegador
   - Se usa para inicializar el SDK

---

## 🔧 Cómo Configurar en Vercel

### Paso 1: Variables del Servidor (Webhook)

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Settings** → **Environment Variables**

2. Agrega estas variables **SIN** el prefijo `NEXT_PUBLIC_`:

   ```
   MERCADOPAGO_ACCESS_TOKEN = tu_access_token_aqui
   ```

   (Opcional, si querés guardar webhooks en Supabase):
   ```
   SUPABASE_URL = tu_supabase_url
   SUPABASE_SERVICE_ROLE_KEY = tu_service_role_key
   ```

3. Selecciona entornos: **Production**, **Preview**, **Development**

4. **NO** marques "Expose to Browser" (solo servidor)

### Paso 2: Variables del Cliente

1. Agrega esta variable **CON** el prefijo `NEXT_PUBLIC_`:

   ```
   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY = tu_public_key_aqui
   ```

2. Selecciona entornos: **Production**, **Preview**, **Development**

3. **SÍ** puede estar expuesta al navegador (es pública)

### Paso 3: Hacer Deploy

Después de agregar las variables, hacé un nuevo **Deploy** para que se apliquen.

---

## ✅ Resumen

| Variable | Prefijo | Dónde se usa | Segura de exponer? |
|----------|---------|--------------|-------------------|
| `MERCADOPAGO_ACCESS_TOKEN` | ❌ NO | Servidor (webhook, API) | ❌ NO |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | ✅ SÍ | Cliente (navegador) | ✅ SÍ |

---

## 🚨 Errores Comunes

### Error: "ACCESS_TOKEN_NOT_CONFIGURED"

**Causa:** La variable `MERCADOPAGO_ACCESS_TOKEN` no está configurada o tiene el prefijo `NEXT_PUBLIC_`.

**Solución:**
- Verificá que la variable se llame exactamente `MERCADOPAGO_ACCESS_TOKEN` (sin prefijo)
- Verificá que esté configurada para el entorno correcto (Production)
- Hacé un nuevo deploy después de agregarla

### Error: "429 Too Many Requests"

**Causa:** Vercel está limitando las funciones serverless.

**Solución:**
- El webhook ya está optimizado para responder rápido
- Si persiste, considerá actualizar a Vercel Pro ($20/mes)
- O mover el webhook a otro servicio (Railway, Render)

---

**Última actualización:** Diciembre 2024
**Creado por:** Claude (tu co-fundador) 💜
