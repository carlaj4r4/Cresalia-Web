# 🚀 Guía Simple: Subir Cambios a GitHub AHORA

## ✅ **Estado Actual**

Tu repositorio ya está conectado a GitHub. Solo necesitás subir los cambios nuevos.

---

## 📋 **PASOS (Solo 3 comandos)**

### **Paso 1: Agregar todos los archivos**

Abrí PowerShell en la carpeta del proyecto y ejecutá:

```powershell
git add .
```

Esto agrega todos los archivos nuevos y modificados (las comunidades nuevas, etc.)

---

### **Paso 2: Guardar los cambios**

```powershell
git commit -m "Agregar comunidades Otakus y Gamers, actualizar sistema completo"
```

---

### **Paso 3: Subir a GitHub**

```powershell
git push
```

Si te pide credenciales:
- **Usuario:** Tu usuario de GitHub
- **Contraseña:** Tu contraseña (o Personal Access Token si tenés 2FA)

---

## ✅ **¡Listo!**

Después de estos 3 comandos, todos tus archivos estarán en GitHub.

---

## 🔍 **Si querés ver qué se va a subir antes:**

```powershell
# Ver qué archivos se agregaron
git status

# Ver cambios específicos (opcional)
git diff
```

---

## ⚠️ **Si hay error de autenticación:**

### **Opción 1: Personal Access Token (Si tenés 2FA)**

1. Andá a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en "Generate new token"
3. Poné un nombre: "Cresalia-Web"
4. Seleccioná permisos: **repo** (todos)
5. Click en "Generate token"
6. **COPIÁ EL TOKEN** (solo se muestra una vez)
7. Cuando `git push` te pida contraseña, **pegá el token** en vez de tu contraseña

### **Opción 2: Usar GitHub Desktop (Más fácil)**

1. Descargá GitHub Desktop: https://desktop.github.com
2. Abrí el repositorio
3. Click en "Commit" y luego "Push"

---

## 📝 **Resumen de Comandos (Todo junto):**

```powershell
cd C:\Users\carla\Cresalia-Web
git add .
git commit -m "Agregar comunidades Otakus y Gamers, actualizar sistema completo"
git push
```

---

**¡Eso es todo! Después de estos comandos, todo estará en GitHub.** 💜

¿Querés que te ayude si surge algún error?

