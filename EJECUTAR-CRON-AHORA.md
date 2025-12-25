# 🚀 Ejecutar Cron de Mensajes Festivos AHORA

## ⚠️ El cron no se ejecutó automáticamente

El cron estaba configurado para ejecutarse el 24 de diciembre a las 00:00 UTC, pero no se ejecutó. Puedes ejecutarlo manualmente ahora.

## 📋 Pasos para Ejecutar Manualmente

### Opción 1: Desde el Navegador

1. Abre tu navegador
2. Ve a esta URL (reemplaza `[tu-proyecto]` con tu URL de Vercel):
   ```
   https://[tu-proyecto].vercel.app/api/cron-mensaje-festivo?forzar=true
   ```
   
   Si tu proyecto es `cresalia-web`, sería:
   ```
   https://cresalia-web.vercel.app/api/cron-mensaje-festivo?forzar=true
   ```

3. Deberías ver una respuesta JSON con el resultado del envío

### Opción 2: Desde la Terminal (PowerShell)

```powershell
# Reemplaza [tu-proyecto] con tu URL de Vercel
Invoke-WebRequest -Uri "https://[tu-proyecto].vercel.app/api/cron-mensaje-festivo?forzar=true" -Method GET
```

### Opción 3: Desde Vercel Dashboard

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Tu proyecto → **Functions**
3. Busca `/api/cron-mensaje-festivo`
4. Haz clic en **"Invoke"** o **"Test"**
5. Agrega el parámetro: `?forzar=true`

## 🔍 Verificar Resultado

Después de ejecutar, deberías ver en la respuesta:

```json
{
  "exito": true,
  "mensaje": "Envío masivo completado",
  "total_usuarios": X,
  "emails_enviados": X,
  "emails_error": 0,
  "notificaciones_push_enviadas": X,
  "fecha_ejecucion": "..."
}
```

## 📊 Ver Logs Detallados

1. Ve a Vercel Dashboard → Tu proyecto → **Deployments**
2. Selecciona el deployment más reciente
3. Haz clic en **"Functions"** o **"Logs"**
4. Busca `/api/cron-mensaje-festivo`
5. Verás todos los logs detallados del proceso

## ⚠️ Posibles Problemas

### "No es 24 de diciembre"
- Esto es normal, por eso usamos `?forzar=true`
- El parámetro `forzar=true` ignora la verificación de fecha

### "BREVO_API_KEY no configurada"
- Ve a Vercel Dashboard → Settings → Environment Variables
- Verifica que `BREVO_API_KEY` esté configurada
- Haz un nuevo deploy si acabas de agregarla

### "Supabase no configurado"
- Verifica que `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` estén configuradas
- Asegúrate de que estén en todos los ambientes (Production, Preview, Development)

### No se envían emails
- Verifica que `BREVO_API_KEY` sea válida
- Verifica que los usuarios tengan emails válidos en Supabase
- Revisa los logs para ver errores específicos

## 🔄 Para el Próximo Año

Si quieres que se ejecute automáticamente el próximo año, puedes:

1. **Cambiar el schedule** en `vercel.json`:
   ```json
   {
     "crons": [
       {
         "path": "/api/cron-mensaje-festivo",
         "schedule": "0 0 24 12 *"  // 24 de diciembre a las 00:00 UTC
       }
     ]
   }
   ```

2. **O ejecutarlo manualmente** cada año con `?forzar=true`

3. **O crear múltiples schedules** para diferentes fechas festivas
