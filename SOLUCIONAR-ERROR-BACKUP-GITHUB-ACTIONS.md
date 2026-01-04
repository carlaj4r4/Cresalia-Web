# 🔧 Solucionar Error "Run Failed" en Backup de GitHub Actions

**Fecha:** 27 de Enero, 2025

---

## 🎯 Problema Común

El workflow de backup falla con "Run failed" en GitHub Actions. Aquí están las causas más comunes y cómo solucionarlas.

---

## ✅ Soluciones Paso a Paso

### **1. Verificar los Secrets (Más Común)**

Los secrets pueden haber expirado o no estar configurados correctamente.

**Pasos:**
1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Verifica que existan:
   - ✅ `SUPABASE_URL` (debe empezar con `https://`)
   - ✅ `SUPABASE_SERVICE_KEY` (debe ser muy larga, más de 200 caracteres)

**Si faltan o están incorrectos:**
1. Click en el secret
2. Click en **"Update"** o **"Delete"** y créalo de nuevo
3. Obtén los valores correctos desde Supabase Dashboard:
   - **URL**: Settings → API → Project URL
   - **Service Key**: Settings → API → `service_role` key (⚠️ MUY SECRETA)

---

### **2. Verificar los Logs del Workflow**

**Pasos:**
1. Ve a la pestaña **"Actions"** en GitHub
2. Click en el workflow que falló (el que tiene ❌ roja)
3. Click en el job que falló
4. Revisa los logs, especialmente:
   - El paso "🔍 Verificar secrets (debug)"
   - El paso "💾 Ejecutar Backup"
   - Cualquier mensaje de error en rojo

**Errores comunes que verás:**

#### **Error: "SUPABASE_URL secret no está configurado"**
- **Solución**: Agrega el secret `SUPABASE_URL` en Settings → Secrets

#### **Error: "No se encontró scripts/backup-supabase.js"**
- **Solución**: Verifica que el archivo existe en tu repositorio
- Verifica que estás en la rama correcta (generalmente `main`)

#### **Error: "Cannot find module '@supabase/supabase-js'"**
- **Solución**: Ya corregido en los workflows actualizados
- El workflow ahora instala las dependencias correctamente

#### **Error: "ENOENT: no such file or directory, open 'backups/...'"**
- **Solución**: Ya corregido - el workflow ahora crea el directorio automáticamente

---

### **3. Probar el Script Localmente**

Antes de depurar en GitHub Actions, prueba el script localmente:

**Pasos:**
1. Abre terminal en tu proyecto
2. Ve a la carpeta `scripts`:
   ```bash
   cd scripts
   ```
3. Instala dependencias:
   ```bash
   npm install @supabase/supabase-js
   ```
4. Configura variables de entorno:
   ```bash
   # Windows PowerShell
   $env:SUPABASE_URL="https://tu-proyecto.supabase.co"
   $env:SUPABASE_SERVICE_KEY="tu-service-key-aqui"
   
   # Linux/Mac
   export SUPABASE_URL="https://tu-proyecto.supabase.co"
   export SUPABASE_SERVICE_KEY="tu-service-key-aqui"
   ```
5. Ejecuta el script:
   ```bash
   node backup-supabase.js
   ```

**Si funciona localmente pero falla en GitHub Actions:**
- El problema es la configuración en GitHub Actions (probablemente los secrets)

---

### **4. Verificar que GitHub Actions Esté Habilitado**

**Pasos:**
1. Ve a **Settings** → **Actions** → **General**
2. En **"Actions permissions"**, asegúrate de que esté seleccionado:
   - ✅ **"Allow all actions and reusable workflows"**
   - ❌ NO debe estar en "Disable actions"
3. Click en **"Save"**

---

### **5. Verificar que los Archivos Estén en el Repositorio**

**Pasos:**
1. Ve a la pestaña **"Code"** de tu repositorio
2. Verifica que existan:
   - ✅ `.github/workflows/backup-daily.yml`
   - ✅ `.github/workflows/backup-manual.yml`
   - ✅ `scripts/backup-supabase.js`

**Si no los ves:**
- Haz `git add .` y `git commit` y `git push`
- Verifica que estés en la rama `main` (o la rama por defecto)

---

### **6. Re-ejecutar el Workflow**

Después de corregir los problemas:

**Pasos:**
1. Ve a **Actions** → **Backup Manual de Supabase**
2. Click en **"Run workflow"** (botón verde arriba a la derecha)
3. Selecciona la rama `main`
4. Click en **"Run workflow"**
5. Espera 1-2 minutos
6. Verifica que ahora tenga ✅ verde

---

## 🔍 Checklist de Diagnóstico

Antes de pedir ayuda, verifica:

- [ ] Los secrets están configurados en GitHub (Settings → Secrets → Actions)
- [ ] Los secrets tienen los valores correctos (URL y Service Key)
- [ ] El archivo `.github/workflows/backup-daily.yml` existe en el repositorio
- [ ] El archivo `scripts/backup-supabase.js` existe en el repositorio
- [ ] GitHub Actions está habilitado (Settings → Actions → General)
- [ ] El script funciona localmente
- [ ] Estás en la rama correcta (generalmente `main`)

---

## 📧 Si Sigue Fallando

**Dime:**
1. ¿Qué error exacto ves en los logs? (copia el mensaje completo)
2. ¿En qué paso falla? (verificar secrets, instalar dependencias, ejecutar backup)
3. ¿Los secrets están configurados? (sí/no)
4. ¿El script funciona localmente? (sí/no)

---

## ✅ Workflows Actualizados

He actualizado ambos workflows (`backup-daily.yml` y `backup-manual.yml`) con:
- ✅ Mejor manejo de dependencias
- ✅ Creación automática del directorio `backups`
- ✅ Mejor logging y mensajes de error
- ✅ Verificación de que los archivos existen antes de ejecutar

**Próximos pasos:**
1. Haz commit y push de los cambios
2. Re-ejecuta el workflow manual
3. Verifica que ahora funcione

---

*Última actualización: 27 de Enero, 2025*

