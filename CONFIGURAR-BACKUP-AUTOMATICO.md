# 🔧 Configurar Backup Automático de Supabase

Esta guía te explica cómo configurar los backups automáticos usando GitHub Actions.

---

## ✅ **Lo que ya está listo:**

1. ✅ Script de backup (`scripts/backup-supabase.js`)
2. ✅ Workflow de GitHub Actions para backup diario (`.github/workflows/backup-daily.yml`)
3. ✅ Workflow para backup manual (`.github/workflows/backup-manual.yml`)

---

## 🚀 **Pasos para Configurar:**

### **Paso 1: Obtener tu Service Key de Supabase**

⚠️ **IMPORTANTE**: Necesitas la **Service Role Key** (no la anon key), que tiene permisos de administrador.

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Ve a **Settings** → **API**
3. Busca la sección **Project API keys**
4. Copia la **`service_role`** key (⚠️ **MUY SECRETA**, nunca la compartas)
5. También necesitas tu **Project URL** (ejemplo: `https://zbomxayytvwjbdzbegcw.supabase.co`)

---

### **Paso 2: Configurar Secrets en GitHub**

Los secrets son variables de entorno seguras que GitHub Actions usará para conectarse a Supabase.

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú izquierdo, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**

**Agregar primer secret:**
- **Name:** `SUPABASE_URL`
- **Secret:** Tu Project URL de Supabase (ejemplo: `https://zbomxayytvwjbdzbegcw.supabase.co`)
- Click en **Add secret**

**Agregar segundo secret:**
- **Name:** `SUPABASE_SERVICE_KEY`
- **Secret:** Tu service_role key de Supabase (la que copiaste en el paso 1)
- Click en **Add secret**

✅ **Listo!** Ya tienes los secrets configurados.

---

### **Paso 3: Verificar que el Workflow esté activo**

1. Ve a la pestaña **Actions** en tu repositorio de GitHub
2. Deberías ver dos workflows:
   - **Backup Diario de Supabase** (se ejecuta automáticamente cada día)
   - **Backup Manual de Supabase** (se puede ejecutar cuando quieras)

---

## 🧪 **Probar el Backup Manualmente:**

Antes de esperar al backup automático, es buena idea probarlo manualmente:

1. Ve a **Actions** en GitHub
2. Click en **Backup Manual de Supabase** en el menú izquierdo
3. Click en **Run workflow**
4. Selecciona la rama `main`
5. Click en **Run workflow** (botón verde)
6. Espera a que termine (1-2 minutos)
7. Una vez completado, click en el workflow que se ejecutó
8. Al final de la página, en la sección **Artifacts**, descarga el backup

✅ **Si funciona, el backup automático también funcionará!**

---

## 📅 **Horario del Backup Automático:**

Por defecto, el backup se ejecuta **diariamente a las 2:00 AM UTC**.

**Para Argentina (UTC-3):**
- 2:00 AM UTC = **11:00 PM del día anterior** (hora de Argentina)

**Para cambiar el horario:**
1. Edita `.github/workflows/backup-daily.yml`
2. Busca la línea: `- cron: '0 2 * * *'`
3. Cambia la hora (formato: minuto hora día mes día-semana)
   - Ejemplo para 3 AM UTC: `'0 3 * * *'`
   - Ejemplo para medianoche UTC: `'0 0 * * *'`

**Herramienta útil:** [Crontab.guru](https://crontab.guru/) para crear expresiones cron

---

## 📦 **Descargar Backups:**

Los backups se guardan como **artefactos** en GitHub Actions:

1. Ve a **Actions** en GitHub
2. Click en cualquier ejecución del workflow (verde = exitoso, rojo = falló)
3. Al final de la página, en la sección **Artifacts**, verás los archivos
4. Click para descargar el backup (archivo `.tar.gz`)
5. Los artefactos se eliminan automáticamente después de 30 días (configurable)

---

## 🔍 **Verificar que Funciona:**

### **Después de la primera ejecución automática (al día siguiente):**

1. Ve a **Actions** en GitHub
2. Deberías ver una ejecución del workflow "Backup Diario de Supabase"
3. El ícono debe ser verde ✅ (éxito) o rojo ❌ (error)
4. Si es verde, ¡funciona perfecto!
5. Si es rojo, revisa los logs para ver qué falló

---

## ❌ **Solución de Problemas:**

### **Error: "SUPABASE_URL not found"**
- ✅ Verifica que hayas creado el secret `SUPABASE_URL` en GitHub
- ✅ Verifica que el nombre sea exactamente `SUPABASE_URL` (sin espacios, mayúsculas)

### **Error: "SUPABASE_SERVICE_KEY not found"**
- ✅ Verifica que hayas creado el secret `SUPABASE_SERVICE_KEY` en GitHub
- ✅ Verifica que el nombre sea exactamente `SUPABASE_SERVICE_KEY`

### **Error: "Permission denied" o "Unauthorized"**
- ✅ Verifica que estés usando la **service_role key** (no la anon key)
- ✅ Verifica que la key esté correcta (sin espacios al inicio/final)

### **Backup no se ejecuta automáticamente**
- ✅ Verifica que el workflow esté en la rama `main` (no en otra rama)
- ✅ GitHub Actions necesita que el workflow esté en la rama por defecto
- ✅ Verifica que GitHub Actions esté habilitado en tu repositorio (Settings → Actions)

---

## 📊 **Monitoreo:**

### **Cómo saber si el backup falló:**

1. GitHub te puede enviar emails cuando un workflow falla (configurar en Settings → Notifications)
2. Revisar periódicamente la pestaña **Actions** (semanalmente)
3. Si ves un ícono rojo ❌, haz click y revisa los logs

### **Configurar notificaciones de email:**

1. Ve a tu perfil de GitHub
2. Settings → Notifications
3. En **Actions**, activa:
   - ✅ Failed workflows only (recomendado)
   - O ✅ All workflows (si quieres notificaciones de todo)

---

## 🔄 **Retención de Backups:**

- **Backups diarios:** Se eliminan después de **30 días** (configurable en el workflow)
- **Backups manuales:** Se eliminan después de **90 días**

**Para cambiar la retención:**
- Edita `.github/workflows/backup-daily.yml`
- Busca `retention-days: 30`
- Cambia el número (en días)

**Recomendación:** Descarga backups importantes manualmente y guárdalos en un lugar seguro (Google Drive, Dropbox, etc.)

---

## 📋 **Resumen de Configuración:**

```
✅ Paso 1: Obtener Service Key de Supabase (5 min)
✅ Paso 2: Configurar Secrets en GitHub (2 min)
✅ Paso 3: Probar backup manual (2 min)
✅ Listo! El backup se ejecutará automáticamente cada día
```

**Tiempo total:** ~10 minutos

---

## 💡 **Consejos:**

1. **Probar primero:** Siempre prueba el backup manual antes de confiar en el automático
2. **Verificar periódicamente:** Revisa semanalmente que los backups se estén ejecutando
3. **Descargar importantes:** Si haces cambios importantes, descarga el backup manualmente
4. **Múltiples copias:** Considera tener backups en múltiples lugares (GitHub + Google Drive)

---

## 🆘 **¿Necesitas Ayuda?**

Si algo no funciona:
1. Revisa los logs del workflow en GitHub Actions
2. Verifica que los secrets estén configurados correctamente
3. Prueba ejecutar el script localmente primero:
   ```bash
   export SUPABASE_URL="tu-url"
   export SUPABASE_SERVICE_KEY="tu-key"
   node scripts/backup-supabase.js
   ```

---

**Última actualización:** 27 de Enero, 2025  
**Estado:** ✅ Listo para configurar

