# 🔗 CONFIGURAR REDIRECCIÓN DE EMAILS EN SUPABASE

## ❌ Problema Actual
Los emails de confirmación de Supabase están redirigiendo a `localhost` en lugar de la URL de producción, y el token se expone en la URL.

## ✅ Solución

### PASO 1: Configurar Site URL en Supabase Dashboard

1. Ve a tu proyecto en Supabase: **https://supabase.com/dashboard**
2. Seleccioná tu proyecto: **zbomxayytvwjbdzbegcw**
3. En el menú lateral, click en **"Authentication"** (Autenticación)
4. Click en **"URL Configuration"** (Configuración de URL)

### PASO 2: Configurar Site URL

En el campo **"Site URL"**, poné:
```
https://cresalia-web.vercel.app
```

⚠️ **IMPORTANTE:** 
- ❌ **NO** uses `http://localhost:8080` o `http://127.0.0.1:8080`
- ✅ **SÍ** usa `https://cresalia-web.vercel.app` (tu URL de producción)

### PASO 3: Configurar Redirect URLs

En el campo **"Redirect URLs"**, agregá estas URLs (una por línea):

```
https://cresalia-web.vercel.app/login-comprador.html
https://cresalia-web.vercel.app/login-tienda.html
https://cresalia-web.vercel.app/**
```

Esto permite que Supabase redirija a estas páginas después de confirmar el email.

### PASO 4: Guardar Cambios

1. Click en **"Save"** (Guardar)
2. Esperá a que se guarden los cambios

---

## 🔐 SEGURIDAD: Token en la URL

### ✅ Cómo funciona actualmente (SEGURO)

El código ya maneja correctamente el token:

1. **Supabase envía el token en el hash** (no en query params):
   ```
   https://cresalia-web.vercel.app/login-comprador.html#access_token=xxx&type=signup
   ```

2. **El hash NO se envía al servidor** (es solo cliente-side)
3. **El código lee el hash** en `login-comprador.html`:
   ```javascript
   const hashParams = new URLSearchParams(window.location.hash.substring(1));
   const accessToken = hashParams.get('access_token');
   ```

4. **El token se usa para establecer la sesión** y luego se elimina del hash

### ⚠️ Por qué es seguro

- ✅ El hash (`#access_token=xxx`) **NO se envía al servidor**
- ✅ Solo es visible en el navegador del usuario
- ✅ No aparece en logs del servidor
- ✅ No se puede interceptar en la red (HTTPS)
- ✅ Se elimina después de usarlo

---

## 🔄 Cambios Realizados en el Código

### 1. `auth/auth-system.js`

**Antes:**
```javascript
const isProduction = window.location.hostname !== 'localhost';
const redirectUrl = isProduction 
    ? 'https://cresalia-web.vercel.app/login-tienda.html'
    : `${window.location.origin}/login-tienda.html`;
```

**Ahora:**
```javascript
// Siempre usar URL de producción para emails
const redirectUrl = 'https://cresalia-web.vercel.app/login-tienda.html';
```

Esto asegura que **siempre** se use la URL de producción, incluso si estás probando en localhost.

### 2. Mejoras en el manejo del schema cache

- Aumenté los intentos de 5 a 8 (igual que compradores)
- Aumenté el tiempo de espera máximo a 15 segundos
- Agregué múltiples métodos para refrescar el schema cache

---

## ✅ Verificación

Después de configurar Supabase Dashboard:

1. **Registrá un nuevo usuario** (comprador o tienda)
2. **Revisá el email de confirmación** de Supabase
3. **Click en el link de confirmación**
4. **Verificá que redirija a:**
   - ✅ `https://cresalia-web.vercel.app/login-comprador.html#access_token=...`
   - ❌ **NO** a `http://localhost:8080/...`

5. **Verificá que el token esté en el hash** (no en query params):
   - ✅ Correcto: `#access_token=xxx&type=signup`
   - ❌ Incorrecto: `?access_token=xxx&type=signup`

---

## 🆘 Troubleshooting

### ❌ Sigue redirigiendo a localhost

**Causa:** La configuración en Supabase Dashboard no se guardó correctamente.

**Solución:**
1. Verificá que el **Site URL** sea `https://cresalia-web.vercel.app`
2. Verificá que las **Redirect URLs** incluyan `https://cresalia-web.vercel.app/**`
3. Guardá los cambios de nuevo
4. Esperá 1-2 minutos para que se propaguen los cambios

---

### ❌ El token aparece en query params (no en hash)

**Causa:** La configuración de Supabase puede estar usando un método antiguo.

**Solución:**
1. Verificá que estés usando la versión más reciente del SDK de Supabase
2. El código ya maneja correctamente el hash, así que esto no debería pasar
3. Si persiste, verificá la configuración de `detectSessionInUrl` en `supabase-config.js`

---

### ❌ Error: "Invalid redirect URL"

**Causa:** La URL de redirección no está en la lista de Redirect URLs permitidas.

**Solución:**
1. Ve a Supabase Dashboard → Authentication → URL Configuration
2. Agregá la URL exacta a **Redirect URLs**:
   ```
   https://cresalia-web.vercel.app/login-comprador.html
   https://cresalia-web.vercel.app/login-tienda.html
   ```
3. O usá el wildcard: `https://cresalia-web.vercel.app/**`

---

## 📚 Referencias

- **Supabase Auth Docs:** https://supabase.com/docs/guides/auth
- **Supabase URL Configuration:** https://supabase.com/docs/guides/auth/url-configuration

---

## ✅ Checklist

Antes de considerar que está configurado correctamente:

- [ ] Site URL configurado como `https://cresalia-web.vercel.app` en Supabase Dashboard
- [ ] Redirect URLs incluyen `https://cresalia-web.vercel.app/**`
- [ ] Cambios guardados en Supabase Dashboard
- [ ] Código actualizado para usar siempre URL de producción
- [ ] Emails de confirmación redirigen a producción (no localhost)
- [ ] Token aparece en hash (no en query params)
- [ ] Sesión se establece correctamente después de confirmar email

---

Si seguís teniendo problemas después de seguir estos pasos, verificá:
1. Los logs de Supabase Dashboard → Logs → Auth
2. La consola del navegador (F12) para ver errores
3. Que la URL de redirección en el email sea la correcta
