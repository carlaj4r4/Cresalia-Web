# 🔐 Configuración Segura de MercadoPago - CRESALIA

## ⚠️ IMPORTANTE: Seguridad de Credenciales

### ❌ NUNCA expongas ACCESS_TOKEN en el cliente
- El **ACCESS_TOKEN** es una credencial **PRIVADA** y **SENSIBLE**
- Si alguien lo obtiene, puede hacer operaciones en tu cuenta de MercadoPago
- **Solo debe usarse en el servidor/backend**

### ✅ PUBLIC_KEY es segura de exponer
- La **PUBLIC_KEY** está diseñada para usarse en el cliente
- Es pública y no permite operaciones sensibles
- Puede estar en el código frontend sin problemas

---

## 📋 Configuración en Vercel

### Variables para el Cliente (Frontend)
Estas variables **SÍ** deben tener el prefijo `NEXT_PUBLIC_`:

1. **`NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`**
   - Tu clave pública de MercadoPago
   - Segura de exponer en el navegador
   - Se usa para inicializar el SDK de MercadoPago en el cliente

### Variables para el Servidor (Backend/API)
Estas variables **NO** deben tener el prefijo `NEXT_PUBLIC_`:

1. **`MERCADOPAGO_ACCESS_TOKEN`** (SIN prefijo)
   - Tu token de acceso privado
   - **NUNCA** debe estar en el cliente
   - Solo se usa en API routes o serverless functions

---

## 🏗️ Arquitectura Segura

### Flujo Correcto:

```
┌─────────────┐
│   Cliente   │
│  (Navegador)│
└──────┬──────┘
       │
       │ 1. Usa PUBLIC_KEY para inicializar SDK
       │
       ▼
┌─────────────────┐
│  MercadoPago SDK│
│  (En el cliente)│
└──────┬──────────┘
       │
       │ 2. Crea preferencia de pago
       │    (requiere ACCESS_TOKEN)
       │
       ▼
┌──────────────────┐
│  API Backend     │
│  (Vercel/Server) │
│  - Usa ACCESS_TOKEN│
│  - Crea preferencia│
└──────┬───────────┘
       │
       │ 3. Retorna preferencia_id
       │
       ▼
┌─────────────┐
│   Cliente   │
│  (Navegador)│
└─────────────┘
```

---

## 🔧 Cómo Configurar

### Paso 1: Variables en Vercel

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Settings** → **Environment Variables**

2. Agrega estas variables:

   **Para el Cliente (con prefijo):**
   ```
   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY = tu_public_key_aqui
   ```

   **Para el Servidor (sin prefijo):**
   ```
   MERCADOPAGO_ACCESS_TOKEN = tu_access_token_aqui
   ```

3. Selecciona los entornos donde aplican (Production, Preview, Development)

4. Haz un nuevo **Deploy**

### Paso 2: Crear API Endpoint en Vercel

Crea un archivo en tu proyecto: `/api/mercadopago/crear-preferencia.js`

```javascript
// /api/mercadopago/crear-preferencia.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // ACCESS_TOKEN solo disponible en el servidor
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    if (!accessToken) {
        return res.status(500).json({ error: 'ACCESS_TOKEN no configurado' });
    }
    
    try {
        // Crear preferencia usando ACCESS_TOKEN
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
```

### Paso 3: Modificar el Cliente

En lugar de crear la preferencia directamente en el cliente, llamar al API:

```javascript
// En lugar de esto (❌ INSEGURO):
const mp = new MercadoPago(publicKey);
const preference = await mp.preferences.create({...});

// Hacer esto (✅ SEGURO):
const response = await fetch('/api/mercadopago/crear-preferencia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        items: [...],
        payer: {...}
    })
});
const preference = await response.json();
```

---

## ✅ Checklist de Seguridad

- [ ] `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` configurada en Vercel
- [ ] `MERCADOPAGO_ACCESS_TOKEN` configurada en Vercel (SIN prefijo)
- [ ] ACCESS_TOKEN **NO** está en ningún archivo del cliente
- [ ] Todas las operaciones que requieren ACCESS_TOKEN van por API
- [ ] El código del cliente solo usa PUBLIC_KEY
- [ ] Los endpoints de API validan las solicitudes

---

## 🚨 Qué NO Hacer

❌ **NUNCA** pongas ACCESS_TOKEN en:
- Variables con prefijo `NEXT_PUBLIC_`
- Archivos JavaScript del cliente
- Código que se ejecuta en el navegador
- localStorage o sessionStorage
- URLs o parámetros de query

✅ **SIEMPRE** usa ACCESS_TOKEN solo en:
- API routes de Vercel
- Serverless functions
- Backend/Server-side code

---

## 📚 Recursos

- [Documentación de MercadoPago - Seguridad](https://www.mercadopago.com.ar/developers/es/docs/security/credentials)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Última actualización:** Diciembre 2024
**Creado por:** Claude (tu co-fundador) 💜
