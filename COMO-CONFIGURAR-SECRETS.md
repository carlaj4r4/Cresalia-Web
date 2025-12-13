# 🔐 Cómo Configurar Secrets en GitHub para el Backup

## ❌ **Error Actual:**
```
Error: Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.
```

**Esto significa que el secret `SUPABASE_URL` no está configurado o está vacío.**

---

## ✅ **Solución: Configurar los Secrets**

### **Paso 1: Obtener tus Credenciales de Supabase**

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. En la sección **"Project API keys"**, encuentra:
   - **Project URL**: Es algo como `https://zbomxayytvwjbdzbegcw.supabase.co`
   - **service_role key**: Es una clave MUY LARGA (más de 200 caracteres)

⚠️ **IMPORTANTE**: Usa la **service_role** key (no la anon key). La service_role key tiene permisos de administrador.

---

### **Paso 2: Configurar Secrets en GitHub**

1. **Ve a tu repositorio en GitHub**
   - URL: `https://github.com/carlaj4r4/Cresalia-Web`

2. **Ve a Settings:**
   - Click en la pestaña **"Settings"** (arriba, en la barra de navegación)

3. **Navega a Secrets:**
   - En el menú izquierdo, busca **"Secrets and variables"**
   - Click en **"Actions"** (no "Dependabot")

4. **Crear el primer Secret:**
   - Click en el botón verde **"New repository secret"**
   - **Name:** `SUPABASE_URL`
   - **Secret:** Pega tu Project URL de Supabase
     - Ejemplo: `https://zbomxayytvwjbdzbegcw.supabase.co`
   - Click en **"Add secret"**

5. **Crear el segundo Secret:**
   - Click en **"New repository secret"** de nuevo
   - **Name:** `SUPABASE_SERVICE_KEY`
   - **Secret:** Pega tu service_role key (la clave muy larga)
   - Click en **"Add secret"**

---

### **Paso 3: Verificar que los Secrets estén Configurados**

En la página de Secrets deberías ver:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_KEY`

**Nota:** No podrás ver los valores completos por seguridad, solo los nombres.

---

### **Paso 4: Probar de Nuevo**

1. Ve a la pestaña **"Actions"**
2. Click en **"Backup Manual de Supabase"**
3. Click en **"Run workflow"** → **"Run workflow"**
4. Ahora debería funcionar! ✅

---

## 🔍 **Verificar que el Secret tenga el Formato Correcto**

### **SUPABASE_URL debe:**
- ✅ Empezar con `https://` (o `http://`)
- ✅ Terminar con `.supabase.co`
- ✅ Ejemplo correcto: `https://zbomxayytvwjbdzbegcw.supabase.co`

### **SUPABASE_SERVICE_KEY debe:**
- ✅ Ser MUY LARGA (más de 200 caracteres)
- ✅ Ser la **service_role** key (no la anon key)
- ✅ Empezar con algo como: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## ⚠️ **Errores Comunes:**

### **Error: "SUPABASE_URL is empty"**
- El secret no está creado
- El nombre del secret está mal escrito (debe ser exactamente `SUPABASE_URL`)
- Hay espacios al inicio o final del valor

### **Error: "Invalid supabaseUrl"**
- La URL no empieza con `http://` o `https://`
- La URL está vacía
- Hay espacios o caracteres extraños en la URL

### **Error: "Unauthorized" o "Permission denied"**
- Estás usando la **anon key** en vez de la **service_role key**
- La service_role key está incorrecta o truncada

---

## 📸 **Ubicación Visual:**

```
GitHub Repositorio
│
└── Settings
    └── Secrets and variables
        └── Actions  ← 🎯 AQUÍ configuras los secrets
            ├── New repository secret
            ├── SUPABASE_URL (debe existir)
            └── SUPABASE_SERVICE_KEY (debe existir)
```

---

## ✅ **Checklist:**

Antes de ejecutar el workflow de nuevo, verifica:

- [ ] Tengo mi Project URL de Supabase (empieza con `https://`)
- [ ] Tengo mi service_role key (muy larga, más de 200 caracteres)
- [ ] Creé el secret `SUPABASE_URL` en GitHub
- [ ] Creé el secret `SUPABASE_SERVICE_KEY` en GitHub
- [ ] Los nombres de los secrets son exactamente: `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` (mayúsculas, guión bajo)
- [ ] No hay espacios al inicio o final de los valores

---

## 🆘 **Si Sigue Sin Funcionar:**

1. **Verifica los logs del workflow:**
   - En el step "🔍 Verificar secrets (debug)" deberías ver:
     - ✅ SUPABASE_URL está configurado
     - ✅ SUPABASE_SERVICE_KEY está configurado

2. **Si ves "SUPABASE_URL is empty":**
   - El secret no está configurado
   - O el nombre está mal escrito
   - Verifica en Settings → Secrets and variables → Actions

3. **Si ves el error de URL inválida:**
   - Verifica que la URL empiece con `https://`
   - Verifica que no haya espacios

---

**Una vez configurados los secrets, ejecuta el workflow de nuevo y debería funcionar!** ✅

