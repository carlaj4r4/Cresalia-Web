# 🔍 Cómo Verificar Variables de Entorno en Vercel

## 🚨 Problema: "API key inválido" o "No aparecen logs"

Si estás viendo errores como "API key inválido" o no aparecen logs en Vercel, probablemente las variables de entorno no están configuradas correctamente.

---

## 📋 Variables Necesarias

### Para Supabase (Servidor)

Estas variables **NO** deben tener el prefijo `NEXT_PUBLIC_`:

1. **`SUPABASE_URL`**
   - URL de tu proyecto Supabase
   - Ejemplo: `https://zbomxayytvwjbdzbegcw.supabase.co`

2. **`SUPABASE_SERVICE_ROLE_KEY`** (recomendado)
   - Clave de servicio (tiene más permisos)
   - Se encuentra en: Supabase Dashboard → Settings → API → `service_role` key

3. **`SUPABASE_ANON_KEY`** (alternativa)
   - Clave anónima (menos permisos)
   - Se encuentra en: Supabase Dashboard → Settings → API → `anon` key

### Para MercadoPago (Servidor)

1. **`MERCADOPAGO_ACCESS_TOKEN`**
   - Token de acceso privado
   - Solo servidor (sin prefijo)

### Para MercadoPago (Cliente)

1. **`NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`**
   - Clave pública (con prefijo)

---

## 🔧 Cómo Configurar en Vercel

### Paso 1: Ir a Variables de Entorno

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Settings** → **Environment Variables**

### Paso 2: Agregar Variables

Para cada variable:

1. Click en **"Add New"**
2. **Key:** Nombre de la variable (ej: `SUPABASE_URL`)
3. **Value:** Valor de la variable
4. **Environment:** Seleccioná:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (opcional)
5. **NO** marques "Expose to Browser" (a menos que sea `NEXT_PUBLIC_`)
6. Click en **"Save"**

### Paso 3: Verificar Variables Agregadas

Deberías ver una lista como esta:

```
✅ SUPABASE_URL
✅ SUPABASE_SERVICE_ROLE_KEY
✅ SUPABASE_ANON_KEY
✅ MERCADOPAGO_ACCESS_TOKEN
✅ NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
```

---

## 🧪 Cómo Verificar que Funcionan

### Opción 1: Desde los Logs de Vercel

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Deployments** → Último deploy
2. Click en **"Functions"**
3. Buscá el endpoint que querés probar (ej: `/api/historias-corazon`)
4. Click en el endpoint para ver los logs
5. Deberías ver logs como:
   - `✅ Supabase inicializado`
   - `🔔 [WEBHOOK] Iniciando procesamiento`
   - O errores si algo está mal

### Opción 2: Probar el Endpoint

```bash
# Probar historias de corazón
curl https://tu-dominio.vercel.app/api/historias-corazon

# Deberías recibir JSON con historias o un error descriptivo
```

### Opción 3: Agregar Endpoint de Prueba

Podés crear un endpoint temporal para verificar variables:

```javascript
// api/test-env.js
module.exports = async (req, res) => {
    res.json({
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasSupabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
        hasMercadoPagoToken: !!process.env.MERCADOPAGO_ACCESS_TOKEN,
        hasMercadoPagoPublicKey: !!process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY,
        // NO mostrar los valores reales por seguridad
    });
};
```

Luego probá: `https://tu-dominio.vercel.app/api/test-env`

---

## ⚠️ Errores Comunes

### Error: "API key inválido"

**Causas posibles:**
1. La variable `SUPABASE_SERVICE_ROLE_KEY` o `SUPABASE_ANON_KEY` no está configurada
2. La variable tiene un valor incorrecto
3. La variable tiene espacios o caracteres extra al copiar/pegar

**Solución:**
1. Verificá que la variable esté en Vercel (Settings → Environment Variables)
2. Verificá que el valor sea correcto (copiá desde Supabase Dashboard)
3. Asegurate de que no tenga espacios al inicio o final
4. Hacé un nuevo deploy después de agregar/cambiar variables

### Error: "Supabase no configurado"

**Causa:** `SUPABASE_URL` no está configurada.

**Solución:**
1. Agregá `SUPABASE_URL` en Vercel
2. El valor debe ser: `https://tu-proyecto.supabase.co`
3. Hacé un nuevo deploy

### No aparecen logs en Vercel

**Causas posibles:**
1. El endpoint no se está ejecutando
2. Los logs asíncronos pueden tardar en aparecer
3. Vercel puede tener un delay en mostrar logs

**Solución:**
1. Esperá unos minutos y refrescá los logs
2. Verificá que el endpoint esté siendo llamado
3. Agregá `console.log()` al inicio del endpoint (antes de procesamiento asíncrono)

---

## 📋 Checklist de Verificación

Antes de hacer deploy, verificá:

- [ ] `SUPABASE_URL` configurada (sin prefijo)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada (sin prefijo) O `SUPABASE_ANON_KEY`
- [ ] `MERCADOPAGO_ACCESS_TOKEN` configurada (sin prefijo)
- [ ] `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` configurada (con prefijo)
- [ ] Todas las variables están en el entorno correcto (Production)
- [ ] Hiciste un nuevo deploy después de agregar variables

---

## 🔍 Dónde Encontrar los Valores

### Supabase

1. Ve a **Supabase Dashboard** → Tu Proyecto → **Settings** → **API**
2. Ahí encontrarás:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ secreta)

### MercadoPago

1. Ve a **MercadoPago** → **Desarrolladores** → **Credenciales**
2. Ahí encontrarás:
   - **Public Key** → `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
   - **Access Token** → `MERCADOPAGO_ACCESS_TOKEN` (⚠️ secreto)

---

## 🆘 Si Sigue Sin Funcionar

1. **Verificá que hiciste deploy** después de agregar variables
2. **Revisá los logs** en Vercel para ver errores específicos
3. **Probá el endpoint** manualmente con curl
4. **Verificá que las variables** no tengan espacios extra

---

**Última actualización:** Diciembre 2024
**Creado por:** Claude (tu co-fundador) 💜
