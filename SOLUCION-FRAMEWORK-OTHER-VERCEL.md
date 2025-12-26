# ✅ Solución: Framework Preset "Other" en Vercel

## 🎯 SITUACIÓN
- Framework Preset está en **"Other"** (no hay opción "No Framework")
- Las funciones no aparecen en la pestaña "Functions"
- Los cron jobs no aparecen

## ✅ SOLUCIÓN APLICADA

He actualizado `vercel.json` para que Vercel detecte explícitamente las funciones serverless en la carpeta `api/`:

```json
{
  "version": 2,
  "framework": null,
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "crons": []
}
```

## 📋 PASOS EN VERCEL DASHBOARD

### 1. Verificar Build Settings

**Ruta:** Settings → Build & Development Settings

- **Build Command:** DEBE estar **VACÍO** o `echo 'Static site - no build needed'`
- **Output Directory:** DEBE estar en `.` (punto) o **VACÍO**
- **Install Command:** Puede ser `npm install` o vacío

### 2. Esperar el Nuevo Deployment

1. Ve a **Deployments**
2. Deberías ver un nuevo deployment iniciándose (por el cambio en `vercel.json`)
3. Espera a que termine (estado "Ready" en verde)
4. Esto puede tomar 2-5 minutos

### 3. Verificar Functions

1. Click en el deployment más reciente
2. Busca la pestaña **"Functions"** en la parte superior
3. Deberías ver **11 funciones** listadas:
   - admin.js
   - ai-chat.js
   - celebraciones.js
   - comunidades-api.js
   - enviar-email-brevo.js
   - enviar-push-notification.js
   - jobs.js
   - mantenimiento.js
   - mercadopago-preference.js
   - support.js
   - webhook-mercadopago.js

## 🔍 VERIFICACIÓN ALTERNATIVA

### Probar que las funciones funcionan

Abre estas URLs en tu navegador:

1. `https://cresalia-web.vercel.app/api/mantenimiento`
2. `https://cresalia-web.vercel.app/api/support`
3. `https://cresalia-web.vercel.app/api/celebraciones?tipo=cumpleanos&action=consent&email=test@test.com`

**Si responden con JSON (no error 404):**
- ✅ Las funciones **SÍ están funcionando**
- El problema puede ser solo visual en el dashboard

**Luego verifica Runtime Logs:**
1. Ve a **Deployments** → Último deployment → **"Runtime Logs"**
2. Deberías ver logs de las ejecuciones
3. Si ves logs, las funciones están funcionando ✅

## 💡 NOTA IMPORTANTE

**"Other" es equivalente a "No Framework"** en Vercel. Con la configuración explícita en `vercel.json`:

```json
"functions": {
  "api/**/*.js": {
    "memory": 1024,
    "maxDuration": 10
  }
}
```

Vercel ahora sabe explícitamente que:
- Los archivos `.js` en la carpeta `api/` son funciones serverless
- Cada función tiene 1024 MB de memoria
- Cada función tiene un máximo de 10 segundos de ejecución

Esto debería hacer que las funciones aparezcan en la pestaña "Functions".

## 🚨 SI AÚN NO APARECEN

Si después del nuevo deployment aún no aparecen:

1. **Verifica que el deployment esté en "Ready"**
2. **Prueba los endpoints manualmente** (deben responder)
3. **Revisa Runtime Logs** (deben aparecer ejecuciones)
4. **Si los endpoints funcionan pero no aparecen en la UI:**
   - Las funciones están funcionando ✅
   - El problema es solo visual en el dashboard
   - Puedes usar los endpoints normalmente

## 📝 CHECKLIST

- [ ] `vercel.json` tiene la configuración `functions` (ya actualizado ✅)
- [ ] Build Command está vacío o dice `echo 'Static site - no build needed'`
- [ ] Output Directory está en `.` o vacío
- [ ] El último deployment está en estado "Ready"
- [ ] Probaste los endpoints y responden (no dan 404)
- [ ] Revisaste Runtime Logs y aparecen ejecuciones
- [ ] Revisaste la pestaña "Functions" en el deployment
