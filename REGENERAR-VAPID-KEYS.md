# ⚠️ IMPORTANTE: Regenerar VAPID Keys

## 🔐 Las keys fueron expuestas

Las VAPID keys que estaban en la documentación fueron removidas por seguridad. **Debes regenerar nuevas keys** porque las anteriores pueden haber sido comprometidas.

## 🚀 Pasos para Regenerar

### 1. Generar Nuevas Keys

```bash
node scripts/generar-vapid-keys.js
```

Esto mostrará las nuevas keys en la consola. **Copia esas keys inmediatamente**.

### 2. Actualizar en Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Tu proyecto → Settings → Environment Variables
3. **Elimina** las variables antiguas:
   - `VAPID_PUBLIC_KEY` (antigua)
   - `VAPID_PRIVATE_KEY` (antigua)
4. **Agrega** las nuevas keys:
   - `VAPID_PUBLIC_KEY` = [nueva key pública]
   - `VAPID_PRIVATE_KEY` = [nueva key privada]
5. Selecciona todos los ambientes
6. Guarda

### 3. Nuevo Deploy

Después de actualizar las keys:
```bash
git push origin main
```

O haz un nuevo deploy manual en Vercel.

### 4. Nota Importante

⚠️ **Todos los usuarios deberán re-suscribirse a push notifications** después de regenerar las keys, porque las suscripciones anteriores usaban las keys antiguas.

## ✅ Verificación

Después del deploy, verifica en la consola del navegador:
- `✅ Push subscription creada exitosamente`
- `✅ Suscripción guardada en Supabase`

Si ves errores, verifica que las nuevas keys estén correctamente configuradas en Vercel.
