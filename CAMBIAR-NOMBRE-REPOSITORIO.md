# 📝 Cambiar Nombre del Repositorio en GitHub

## 🎯 **Tienes 2 Opciones:**

### **Opción 1: Renombrar el Repositorio Existente (Más Fácil)**

1. **Andá a GitHub:**
   - https://github.com/carlaj4r4/friocas-web
   - Click en **"Settings"** (arriba a la derecha)

2. **Bajá hasta "Repository name":**
   - Cambiá `friocas-web` por `Cresalia-Web` (o el nombre que quieras)
   - Click en **"Rename"**

3. **Actualizar remoto local (una sola vez):**
   ```powershell
   git remote set-url origin https://github.com/carlaj4r4/Cresalia-Web.git
   ```

**✅ Ventaja:** Mantenés todo el historial

---

### **Opción 2: Crear Repositorio Nuevo**

1. **Crear nuevo repositorio en GitHub:**
   - https://github.com/new
   - Nombre: `Cresalia-Web`
   - **NO marques** "Add a README"
   - Click en "Create repository"

2. **Cambiar remoto:**
   ```powershell
   git remote remove origin
   git remote add origin https://github.com/carlaj4r4/Cresalia-Web.git
   ```

3. **Subir:**
   ```powershell
   git push -u origin main
   ```

---

## 🎯 **Recomendación:**

**Usá la Opción 1** (renombrar) - es más fácil y mantenés todo el historial.

---

## ✅ **Después de Cambiar:**

Una vez que cambies el nombre, podés seguir usando:
```powershell
git push
git pull
```

Todo funcionará igual, solo que el repositorio tendrá el nuevo nombre.

