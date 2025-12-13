# 🔧 Solucionar Error en Backup de Supabase

## 📍 **Cómo Ver el Error:**

1. En GitHub Actions, haz click en el workflow que falló (el que tiene la ❌ roja)
2. Haz click en el job "Crear Backup Manual" (o "Crear Backup de Supabase")
3. Expande cada step para ver los logs
4. Busca líneas que empiecen con `❌` o `Error:`

---

## 🔍 **Errores Comunes y Soluciones:**

### **Error 1: "SUPABASE_URL not found" o "SUPABASE_SERVICE_KEY not found"**

**Síntoma:**
```
❌ Error: Configura SUPABASE_URL y SUPABASE_SERVICE_KEY en variables de entorno
```

**Solución:**
1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Verifica que tengas estos dos secrets:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
3. Si no los tienes, créalos:
   - Click en **"New repository secret"**
   - Agrega cada uno con su valor correspondiente

---

### **Error 2: "Permission denied" o "Unauthorized"**

**Síntoma:**
```
❌ Error: new row violates row-level security policy
❌ Error: permission denied
❌ Error: unauthorized
```

**Solución:**
- Verifica que estés usando la **service_role key** (no la anon key)
- La service_role key tiene permisos de administrador
- Se encuentra en Supabase Dashboard → Settings → API → Project API keys → service_role

---

### **Error 3: "Cannot find module '@supabase/supabase-js'"**

**Síntoma:**
```
Error: Cannot find module '@supabase/supabase-js'
```

**Solución:**
- El workflow debería instalar las dependencias automáticamente
- Si falla, puede ser un problema de conexión o de configuración del package.json
- Revisa el step "Instalar dependencias" en los logs

---

### **Error 4: "Table does not exist"**

**Síntoma:**
```
❌ Error respaldando tabla: relation "nombre_tabla" does not exist
```

**Solución:**
- Algunas tablas pueden no existir todavía en tu Supabase
- Esto es normal si aún no has creado ciertas tablas
- El script intentará respaldar todas, y si alguna no existe, mostrará un error pero continuará con las demás
- Puedes editar el script para comentar tablas que no necesitas respaldar

---

### **Error 5: Script no se encuentra**

**Síntoma:**
```
Error: Cannot find module './backup-supabase.js'
```

**Solución:**
- Verifica que el archivo `scripts/backup-supabase.js` exista en tu repositorio
- Ve a la pestaña "Code" → busca `scripts/backup-supabase.js`
- Si no existe, necesitas subirlo al repositorio

---

## 🧪 **Probar Localmente Primero (Recomendado):**

Antes de depurar en GitHub Actions, prueba el script localmente:

1. **Instalar dependencias:**
   ```bash
   cd scripts
   npm install @supabase/supabase-js
   ```

2. **Ejecutar el script:**
   ```bash
   # En Windows PowerShell:
   $env:SUPABASE_URL="tu-url-aqui"
   $env:SUPABASE_SERVICE_KEY="tu-key-aqui"
   node backup-supabase.js
   ```

3. **Si funciona localmente:**
   - El problema es la configuración en GitHub Actions (probablemente los secrets)
   
4. **Si falla localmente:**
   - El problema es el script o las credenciales
   - Revisa que las credenciales sean correctas

---

## 📋 **Checklist de Verificación:**

Antes de volver a ejecutar el workflow, verifica:

- [ ] Los secrets están configurados en GitHub (Settings → Secrets → Actions)
- [ ] `SUPABASE_URL` tiene el valor correcto (tu Project URL)
- [ ] `SUPABASE_SERVICE_KEY` tiene el valor correcto (service_role key, no anon key)
- [ ] El archivo `scripts/backup-supabase.js` existe en el repositorio
- [ ] El archivo `.github/workflows/backup-manual.yml` existe en el repositorio
- [ ] GitHub Actions está habilitado (Settings → Actions → General)

---

## 🆘 **Si Nada Funciona:**

**Compárteme:**
1. El error exacto que aparece en los logs (copia y pega)
2. El step que falló (ej: "Ejecutar Backup", "Instalar dependencias", etc.)
3. Si probaste ejecutarlo localmente y qué pasó

Con esa información puedo ayudarte mejor! 💜

