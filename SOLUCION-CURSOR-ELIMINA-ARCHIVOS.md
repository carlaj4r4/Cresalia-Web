# 🔧 Solución: Por qué Cursor parece eliminar archivos

## ⚠️ Posibles Causas

### 1. **Auto-save / Auto-format de Cursor**
- Cursor puede tener auto-guardado que reformatea el código
- Algunas extensiones pueden estar "corrigiendo" código automáticamente
- **Solución:** Verifica la configuración de auto-save en Cursor

### 2. **Archivos en .gitignore**
- `config-supabase-seguro.js` está en `.gitignore` (línea 54)
- Git no lo rastrea, pero el archivo existe localmente
- **Importante:** Los archivos HTML que modificamos NO están en .gitignore

### 3. **Sincronización de workspace**
- Si tienes Cursor abierto en múltiples ventanas, pueden sobrescribirse
- El workspace puede estar sincronizándose con Git y revertiendo cambios
- **Solución:** Cierra todas las instancias excepto una

### 4. **Cache del editor**
- Cursor puede estar mostrando una versión cacheada del archivo
- Los cambios están guardados pero no se reflejan visualmente
- **Solución:** Cierra y vuelve a abrir Cursor

### 5. **Extensiones que interfieren**
- Extensiones de formateo automático (Prettier, ESLint, etc.)
- Extensiones de Git que pueden estar revertiendo cambios
- **Solución:** Revisa las extensiones activas

## ✅ Soluciones Recomendadas

### Solución 1: Verificar que los cambios están guardados
```bash
# Verificar el estado actual de los archivos
git status

# Ver los cambios en un archivo específico
git diff login-comprador.html
```

### Solución 2: Forzar guardado
1. **Ctrl + K, S** (guardar todos los archivos)
2. O **File → Save All**

### Solución 3: Desactivar auto-format temporalmente
1. Ir a **Settings** (Ctrl + ,)
2. Buscar "format on save"
3. Desactivar temporalmente

### Solución 4: Verificar configuración de Git
```bash
# Ver si hay cambios sin commitear
git status --short

# Ver el historial de commits recientes
git log --oneline -5
```

### Solución 5: Hacer commit inmediatamente después de cambios
- Después de cada modificación importante, hacer commit y push
- Esto asegura que los cambios están guardados en Git

## 📋 Archivos que SÍ están siendo rastreados por Git

✅ **Estos archivos están en Git y sus cambios se guardan:**
- `login-comprador.html` ✅
- `login-tienda.html` ✅
- `registro-comprador.html` ✅
- `registro-tienda.html` ✅
- `auth/supabase-config.js` ✅
- `index-cresalia.html` ✅

❌ **Este archivo NO está en Git (está en .gitignore):**
- `config-supabase-seguro.js` (pero existe localmente)

## 🔍 Cómo verificar si realmente se eliminaron

1. **Revisar Git:**
   ```bash
   git log --oneline --all -- login-comprador.html
   ```

2. **Ver cambios recientes:**
   ```bash
   git diff HEAD~1 login-comprador.html
   ```

3. **Verificar si el archivo existe:**
   ```bash
   ls -la login-comprador.html
   # O en Windows:
   dir login-comprador.html
   ```

## 💡 Prevención

1. **Hacer commit frecuentemente:**
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push
   ```

2. **Usar Git para verificar cambios:**
   ```bash
   git status
   git diff
   ```

3. **Configurar auto-save adecuadamente:**
   - Settings → "auto save" → "afterDelay" (500ms)

4. **Revisar extensiones:**
   - Desactivar extensiones que puedan interferir
   - Especialmente formateadores automáticos

## 🆘 Si los archivos realmente desaparecen

1. **Recuperar desde Git:**
   ```bash
   git checkout HEAD -- login-comprador.html
   ```

2. **Ver historial:**
   ```bash
   git log --all --full-history -- login-comprador.html
   ```

3. **Recuperar desde commit específico:**
   ```bash
   git checkout <commit-hash> -- login-comprador.html
   ```

## 📝 Nota Importante

**Los archivos que hemos modificado HOY están commitados y pusheados:**
- Commit `7649b81`: Correcciones de API key y registro
- Commit `66d866a`: Correcciones de páginas de login

**Estos cambios están seguros en GitHub y NO se pueden perder**, incluso si Cursor los "elimina" localmente, siempre puedes recuperarlos desde Git.



