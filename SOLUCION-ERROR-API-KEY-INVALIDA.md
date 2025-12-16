# 🔧 Solución: Error "Invalid API key" en Supabase

## 🚨 Problema

Estás viendo este error en los logs de Vercel:

```
Error obteniendo historias: {
  message: 'Invalid API key',
  hint: 'Double check your Supabase `anon` or `service_role` API key.'
}
```

Pero las variables están configuradas en Vercel.

---

## 🔍 Diagnóstico

### Paso 1: Verificar Variables con Endpoint de Prueba

He creado un endpoint temporal para verificar las variables:

1. **Después del deploy**, visitá:
   ```
   https://tu-dominio.vercel.app/api/test-env
   ```

2. Este endpoint te mostrará:
   - Si las variables existen
   - La longitud de cada variable
   - Si tienen espacios extra
   - Previews seguros (sin mostrar valores completos)

### Paso 2: Verificar en Vercel

1. Ve a **Vercel Dashboard** → Tu Proyecto → **Settings** → **Environment Variables**

2. Verificá que estas variables estén configuradas:
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` (recomendado) O `SUPABASE_ANON_KEY`

3. **Verificá que NO tengan espacios:**
   - Click en cada variable para editarla
   - Verificá que no haya espacios al inicio o final
   - Si hay espacios, eliminálos y guardá

4. **Verificá el entorno:**
   - Asegurate de que las variables estén en **Production** (y Preview si querés)
   - Si solo están en Development, no funcionarán en producción

### Paso 3: Verificar en Supabase

1. Ve a **Supabase Dashboard** → Tu Proyecto → **Settings** → **API**

2. Verificá que estés usando la key correcta:
   - **`SUPABASE_SERVICE_ROLE_KEY`** → Usá la key de `service_role` (más permisos)
   - **`SUPABASE_ANON_KEY`** → Usá la key de `anon public` (menos permisos)

3. **Copiá la key nuevamente:**
   - Click en "Reveal" para ver la key completa
   - Copiála sin espacios
   - Pegala en Vercel

---

## 🔧 Soluciones Comunes

### Solución 1: Espacios Extra en la Key

**Problema:** La API key tiene espacios al inicio o final.

**Solución:**
1. En Vercel, editá la variable `SUPABASE_SERVICE_ROLE_KEY` o `SUPABASE_ANON_KEY`
2. Eliminá cualquier espacio al inicio o final
3. Guardá
4. Hacé un nuevo deploy

### Solución 2: Key Incorrecta

**Problema:** Estás usando la key incorrecta o expiró.

**Solución:**
1. Ve a Supabase Dashboard → Settings → API
2. Si usás `SERVICE_ROLE_KEY`, copiá la key de `service_role`
3. Si usás `ANON_KEY`, copiá la key de `anon public`
4. Pegala en Vercel (sin espacios)
5. Hacé un nuevo deploy

### Solución 3: Variable en Entorno Incorrecto

**Problema:** La variable está solo en Development, no en Production.

**Solución:**
1. En Vercel, editá la variable
2. Verificá que esté marcada para:
   - ✅ **Production**
   - ✅ **Preview**
   - (Development es opcional)
3. Guardá
4. Hacé un nuevo deploy

### Solución 4: No Hiciste Deploy Después de Agregar Variables

**Problema:** Agregaste las variables pero no hiciste un nuevo deploy.

**Solución:**
1. Después de agregar/cambiar variables en Vercel
2. **Siempre hacé un nuevo deploy** (push a GitHub o redeploy manual)
3. Las variables solo se aplican en nuevos deploys

### Solución 5: Key de Otro Proyecto

**Problema:** Estás usando la key de otro proyecto de Supabase.

**Solución:**
1. Verificá que `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` sean del mismo proyecto
2. La URL debe coincidir con el proyecto donde copiaste la key

---

## 📋 Checklist de Verificación

Antes de reportar el problema, verificá:

- [ ] Visitá `/api/test-env` y revisá las recomendaciones
- [ ] `SUPABASE_URL` está configurada (sin espacios)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` O `SUPABASE_ANON_KEY` está configurada (sin espacios)
- [ ] Las variables están en el entorno **Production**
- [ ] Hiciste un **nuevo deploy** después de agregar/cambiar variables
- [ ] La key es del mismo proyecto que la URL
- [ ] La key no tiene espacios al inicio o final
- [ ] La key es la correcta desde Supabase Dashboard

---

## 🧪 Probar la Solución

1. **Verificá con el endpoint de prueba:**
   ```bash
   curl https://tu-dominio.vercel.app/api/test-env
   ```

2. **Probá el endpoint de historias:**
   ```bash
   curl https://tu-dominio.vercel.app/api/historias-corazon
   ```

3. **Revisá los logs en Vercel:**
   - Ve a Deployments → Último deploy → Functions → `/api/historias-corazon`
   - Deberías ver logs detallados con `[DEBUG]` que te ayudan a identificar el problema

---

## 🔍 Logs Detallados

Ahora el endpoint de historias tiene logging detallado. En los logs de Vercel deberías ver:

```
🔍 [DEBUG] Verificando variables de entorno...
🔍 [DEBUG] Variables encontradas: { ... }
🔍 [DEBUG] Creando cliente Supabase...
🔍 [DEBUG] Probando conexión con Supabase...
✅ [DEBUG] Conexión con Supabase exitosa
```

Si ves errores, los logs te dirán exactamente qué está mal.

---

## ⚠️ Importante

**Después de solucionar el problema, eliminá el endpoint `/api/test-env`** por seguridad (no queremos exponer información sobre las variables).

---

**Última actualización:** Diciembre 2024
**Creado por:** Claude (tu co-fundador) 💜
