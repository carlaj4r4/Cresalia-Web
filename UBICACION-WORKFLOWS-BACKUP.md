# 📍 Dónde Encontrar los Workflows de Backup

## ❓ **El Problema:**
Los workflows de GitHub Actions **NO aparecen en Settings**. Aparecen en la pestaña **"Actions"** del repositorio.

---

## ✅ **Cómo Ver y Ejecutar los Workflows:**

### **Paso 1: Ir a la pestaña "Actions"**

1. En tu repositorio de GitHub, busca la pestaña **"Actions"** en la barra superior
   - Está entre "Pull requests" y "Projects"
   
2. Click en **"Actions"**

3. En el menú izquierdo, deberías ver:
   - **"Backup Diario de Supabase"** (se ejecuta automáticamente cada día)
   - **"Backup Manual de Supabase"** (puedes ejecutarlo cuando quieras)

4. Si no los ves, verifica que:
   - El archivo `.github/workflows/backup-daily.yml` esté en la rama `main`
   - GitHub Actions esté habilitado (ver más abajo)

---

## ⚙️ **Configurar Secrets (Variables de Entorno):**

Los secrets SÍ se configuran en **Settings**:

### **Paso 1: Ir a Settings → Secrets**

1. Click en **"Settings"** (pestaña superior)
2. En el menú izquierdo, busca **"Actions"**
3. Click en **"Secrets and variables"**
4. Click en **"Actions"** (no "Dependabot")
5. Click en **"New repository secret"**

### **Paso 2: Agregar los dos Secrets:**

**Secret 1:**
- **Name:** `SUPABASE_URL`
- **Secret:** Tu URL de Supabase (ejemplo: `https://zbomxayytvwjbdzbegcw.supabase.co`)
- Click en **"Add secret"**

**Secret 2:**
- **Name:** `SUPABASE_SERVICE_KEY`
- **Secret:** Tu service_role key de Supabase
- Click en **"Add secret"**

---

## 🔍 **Si No Ves los Workflows:**

### **Verificar que GitHub Actions esté habilitado:**

1. Ve a **Settings** → **Actions** → **General** (donde estás ahora)
2. En **"Actions permissions"**, asegúrate de que esté seleccionado:
   - ✅ **"Allow all actions and reusable workflows"** (o al menos una opción que permita workflows)
   - ❌ NO debe estar en "Disable actions"
3. Click en **"Save"** si cambiaste algo

### **Verificar que los archivos estén en el repositorio:**

1. Ve a la pestaña **"Code"** de tu repositorio
2. Busca la carpeta `.github/workflows/`
3. Deberías ver:
   - `backup-daily.yml`
   - `backup-manual.yml`

**Si no los ves:**
- Los archivos pueden no haberse subido todavía
- Verifica que hayas hecho `git push` correctamente

---

## 🧪 **Probar que Funciona:**

### **Ejecutar Backup Manual:**

1. Ve a la pestaña **"Actions"**
2. Click en **"Backup Manual de Supabase"** (en el menú izquierdo)
3. Click en el botón **"Run workflow"** (botón verde arriba a la derecha)
4. Selecciona la rama `main`
5. Click en **"Run workflow"** (botón verde)

**Espera 1-2 minutos** y verás:
- ✅ Un círculo amarillo (en progreso)
- ✅ Un check verde (completado)
- ❌ Una X roja (falló - revisa los logs)

**Si falla:**
- Click en el workflow fallido
- Revisa los logs para ver el error
- Probablemente falta configurar los secrets

---

## 📸 **Ubicación Visual:**

```
GitHub Repositorio
│
├── Code          ← Archivos del código
├── Issues
├── Pull requests
├── Actions       ← 🎯 AQUÍ están los workflows!
│   ├── Backup Diario de Supabase
│   └── Backup Manual de Supabase
├── Projects
├── Security
├── Insights
└── Settings      ← 🎯 AQUÍ configuras los secrets
    └── Secrets and variables → Actions
```

---

## ✅ **Checklist Rápido:**

- [ ] Los archivos `.github/workflows/*.yml` están en el repositorio
- [ ] GitHub Actions está habilitado (Settings → Actions → General)
- [ ] Los secrets están configurados (Settings → Secrets → Actions)
- [ ] Puedo ver los workflows en la pestaña "Actions"
- [ ] Puedo ejecutar el backup manual

---

## 🆘 **Si Sigue Sin Funcionar:**

**Dime:**
1. ¿Ves la pestaña "Actions" en tu repositorio?
2. ¿Qué ves cuando haces click en "Actions"?
3. ¿Aparece algún mensaje o está vacío?
4. ¿Tienes los archivos `.github/workflows/backup-daily.yml` y `backup-manual.yml`?

Con esa información puedo ayudarte mejor! 💜

