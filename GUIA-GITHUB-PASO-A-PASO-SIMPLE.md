# 🚀 Guía Paso a Paso: Subir Cresalia a GitHub

## ✅ **Preparación (Verificar lo que ya tenés)**

### **Paso 0: Verificar Git**
Abrí PowerShell o CMD en la carpeta del proyecto y ejecutá:
```powershell
git status
```

**Si ves "not a git repository":**
→ Necesitás inicializar Git (ver Paso 1)

**Si ves archivos listados:**
→ Git ya está inicializado, podés ir directo al Paso 3

---

## 📋 **PASOS PARA SUBIR A GITHUB**

### **Paso 1: Inicializar Git (Solo si NO lo hiciste antes)**

Abrí PowerShell o CMD en:
```
C:\Users\carla\Cresalia-Web
```

Ejecutá:
```powershell
git init
```

Esto crea un repositorio Git en tu carpeta local.

---

### **Paso 2: Verificar .gitignore**

Verificá que el archivo `.gitignore` tenga al menos esto:
```
node_modules/
*.env
.env.local
.DS_Store
*.log
config-privado.js
```

**Si no existe, crealo** con ese contenido.

---

### **Paso 3: Agregar archivos al staging**

```powershell
git add .
```

Esto agrega todos los archivos (excepto los del .gitignore).

---

### **Paso 4: Hacer commit (guardar cambios)**

```powershell
git commit -m "Primer commit: Comunidades Cresalia completas"
```

**O si ya tenés commits anteriores:**
```powershell
git commit -m "Agregar comunidades Otakus y Gamers"
```

---

### **Paso 5: Crear repositorio en GitHub**

1. **Abrí tu navegador y andá a:**
   ```
   https://github.com
   ```

2. **Hacé login** (o creá cuenta si no tenés)

3. **Click en el botón verde "New"** (o en el + arriba a la derecha → "New repository")

4. **Completá:**
   - **Repository name:** `Cresalia-Web` (o el nombre que quieras)
   - **Description:** "Plataforma SaaS Cresalia con comunidades de apoyo"
   - **Visibility:** 
     - ✅ **Public** (si querés que sea público)
     - 🔒 **Private** (si querés que sea privado)
   - **IMPORTANTE:** ❌ **NO marques** "Add a README file"
   - ❌ **NO marques** "Add .gitignore"
   - ❌ **NO marques** "Choose a license"

5. **Click en "Create repository"**

6. **Después de crear, GitHub te mostrará una página con instrucciones**

---

### **Paso 6: Conectar tu carpeta local con GitHub**

**GitHub te dará 2 opciones, elegí la primera** (si ya tenés archivos):

```powershell
git remote add origin https://github.com/TU-USUARIO/Cresalia-Web.git
git branch -M main
git push -u origin main
```

**⚠️ IMPORTANTE:**
- Reemplazá `TU-USUARIO` con tu usuario de GitHub
- Reemplazá `Cresalia-Web` si pusiste otro nombre

**Ejemplo:**
```powershell
git remote add origin https://github.com/carla/Cresalia-Web.git
git branch -M main
git push -u origin main
```

---

### **Paso 7: Ingresar credenciales**

Cuando ejecutés `git push`, te pedirá:
- **Usuario de GitHub**
- **Contraseña** (o Personal Access Token si tenés 2FA activado)

**Si tenés 2FA activado:**
1. Andá a GitHub → Settings → Developer settings → Personal access tokens
2. Generá un token con permisos `repo`
3. Usá ese token como contraseña

---

### **Paso 8: Verificar que funcionó**

1. **Refrescá la página de tu repositorio en GitHub**
2. **Deberías ver todos tus archivos**

---

## 🎯 **RESUMEN DE COMANDOS (Todo junto)**

```powershell
# 1. Ir a la carpeta (si no estás ahí)
cd C:\Users\carla\Cresalia-Web

# 2. Inicializar (solo si es primera vez)
git init

# 3. Agregar archivos
git add .

# 4. Guardar cambios
git commit -m "Comunidades Cresalia completas"

# 5. Conectar con GitHub (reemplazá TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/Cresalia-Web.git

# 6. Cambiar rama a main
git branch -M main

# 7. Subir a GitHub
git push -u origin main
```

---

## ✅ **Para Futuros Cambios**

Cada vez que modifiques archivos:

```powershell
git add .
git commit -m "Descripción de los cambios"
git push
```

---

## ⚠️ **Errores Comunes y Soluciones**

### **Error: "remote origin already exists"**
```powershell
git remote remove origin
git remote add origin https://github.com/TU-USUARIO/Cresalia-Web.git
```

### **Error: "failed to push some refs"**
```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### **Error: "authentication failed"**
- Verificá usuario y contraseña
- Si tenés 2FA, usá Personal Access Token

---

## 🔐 **Seguridad: ¿Qué NO subir?**

**Ya está en .gitignore:**
- ✅ `config-privado.js` (NO se subirá)
- ✅ Archivos `.env` (NO se subirán)

**Lo que SÍ se sube (está bien):**
- ✅ `config-supabase-seguro.js` (solo tiene keys públicas)
- ✅ Todos los HTML, CSS, JS
- ✅ Todas las comunidades

---

## 💜 **¡Listo!**

Una vez que hayas subido a GitHub, tus archivos estarán:
- ✅ Guardados en la nube
- ✅ Con historial de cambios
- ✅ Listos para deployar en Vercel

**¿Necesitás ayuda con algún paso específico?** 💜

