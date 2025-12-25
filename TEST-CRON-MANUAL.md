# 🧪 Cómo Probar el Cron Job Manualmente

## 📋 Pasos para Probar

### 1. Obtener la URL de tu API en Vercel

Tu endpoint está en:
```
https://[tu-proyecto].vercel.app/api/cron-mensaje-festivo
```

O si tienes un dominio personalizado:
```
https://[tu-dominio]/api/cron-mensaje-festivo
```

### 2. Probar Manualmente

Abre en tu navegador o usa curl:

```bash
# Con forzar=true para ejecutar fuera del 24 de diciembre
https://[tu-proyecto].vercel.app/api/cron-mensaje-festivo?forzar=true
```

### 3. Ver Logs en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en **"Deployments"**
3. Selecciona el deployment más reciente
4. Haz clic en **"Functions"** o **"Logs"**
5. Busca `/api/cron-mensaje-festivo`
6. Verás todos los `console.log()` que agregamos

### 4. Verificar Variables de Entorno

En Vercel Dashboard:
1. Settings → Environment Variables
2. Verifica que estén configuradas:
   - ✅ `BREVO_API_KEY`
   - ✅ `SUPABASE_URL`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY`
   - ✅ `VAPID_PUBLIC_KEY`
   - ✅ `VAPID_PRIVATE_KEY`

### 5. Verificar que el Cron Esté Configurado

En `vercel.json` debe estar:
```json
{
  "crons": [
    {
      "path": "/api/cron-mensaje-festivo",
      "schedule": "0 0 24 12 *"
    }
  ]
}
```

## 🔍 Qué Buscar en los Logs

Cuando ejecutes el cron (con `?forzar=true`), deberías ver:

```
🚀 Cron job ejecutado: [fecha]
📋 Query params: { forzar: 'true' }
🔍 Method: GET
📅 Fecha actual: [fecha]
🎄 Es 24 de diciembre: false
🔧 Forzar ejecución: true
✅ Iniciando ejecución del cron job...
🔍 Verificando configuración...
📧 BREVO_API_KEY: ✅ Configurada
🗄️ SUPABASE_URL: ✅ Configurada
🔑 SUPABASE_KEY: ✅ Configurada
🔑 VAPID_PUBLIC_KEY: ✅ Configurada
🔐 VAPID_PRIVATE_KEY: ✅ Configurada
📊 Obteniendo usuarios de Supabase...
📧 Enviando emails a X compradores...
✅ Push enviado a [nombre] (X dispositivos)
...
✅ Envío masivo completado: {...}
```

## ⚠️ Problemas Comunes

### No aparecen logs
- Verifica que hayas hecho un nuevo deploy después de agregar los `console.log()`
- Los logs solo aparecen cuando el endpoint se ejecuta
- Prueba con `?forzar=true` para ejecutarlo manualmente

### "No es 24 de diciembre"
- Esto es normal si no es 24 de diciembre
- Usa `?forzar=true` para probar manualmente

### Variables no configuradas
- Verifica en Vercel Dashboard → Settings → Environment Variables
- Asegúrate de que estén en todos los ambientes (Production, Preview, Development)
- Haz un nuevo deploy después de agregar variables

### El cron no se ejecuta automáticamente
- El cron solo se ejecuta el 24 de diciembre a las 00:00 UTC
- Para probar antes, usa `?forzar=true`
- Verifica que `vercel.json` tenga la configuración correcta

## 📅 Schedule del Cron

El cron está configurado para ejecutarse:
- **Fecha**: 24 de diciembre
- **Hora**: 00:00 UTC
- **Formato**: `0 0 24 12 *` (minuto hora día mes día-semana)

Para cambiar la fecha, edita `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron-mensaje-festivo",
      "schedule": "0 0 24 12 *"  // Cambia esto
    }
  ]
}
```

Formato cron: `minuto hora día mes día-semana`
- `0 0 24 12 *` = 24 de diciembre a las 00:00
- `0 12 * * *` = Todos los días a las 12:00
- `*/5 * * * *` = Cada 5 minutos (para testing)
