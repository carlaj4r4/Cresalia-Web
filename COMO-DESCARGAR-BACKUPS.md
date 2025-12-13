# 📥 Cómo Descargar los Backups de Supabase

## ✅ **¡El Backup Funcionó!**

Veo que el workflow "Backup Manual de Supabase #2" se completó exitosamente (✅ verde).

---

## 📍 **Dónde Están los Backups:**

Los backups se guardan como **"Artifacts" (Artefactos)** en GitHub Actions. No se descargan automáticamente, tienes que descargarlos manualmente.

---

## 🔽 **Cómo Descargar el Backup:**

### **Paso 1: Ir al Workflow Completado**

1. En la pestaña **"Actions"** de GitHub
2. Haz click en **"Backup Manual de Supabase"** (en el menú izquierdo)
3. Haz click en el workflow que se completó exitosamente (el que tiene ✅ verde)
   - Ejemplo: "Backup Manual de Supabase #2: Manually run by carlaj4r4"

### **Paso 2: Descargar el Artefacto**

1. **Desplázate hacia abajo** en la página del workflow
2. Al final de la página, verás una sección llamada **"Artifacts"** (Artefactos)
3. Deberías ver algo como:
   ```
   Artifacts
   └── supabase-backup-manual-2
   ```
4. **Haz click en el nombre del artefacto** (ejemplo: `supabase-backup-manual-2`)
5. Se descargará un archivo `.zip` con todos los backups

### **Paso 3: Extraer el Archivo**

1. El archivo descargado será un `.zip` (ejemplo: `supabase-backup-manual-2.zip`)
2. **Extrae el archivo** (click derecho → Extraer todo)
3. Dentro encontrarás:
   - Archivos JSON por cada tabla respaldada
   - Un archivo `backup-info_*.json` con información del backup
   - Un archivo `.tar.gz` comprimido (opcional)

---

## 📁 **Estructura del Backup:**

Cuando extraigas el `.zip`, verás algo como:

```
supabase-backup-manual-2/
├── tiendas_2025-01-27T...json
├── productos_2025-01-27T...json
├── compradores_2025-01-27T...json
├── ordenes_2025-01-27T...json
├── backup-info_2025-01-27T...json
└── backup-manual-2025-01-27T...tar.gz
```

Cada archivo JSON contiene todos los registros de esa tabla.

---

## ⏰ **Retención de Backups:**

- **Backups manuales:** Se guardan por **90 días** en GitHub
- **Backups diarios:** Se guardan por **30 días** en GitHub

**Recomendación:** Descarga los backups importantes y guárdalos en otro lugar (Google Drive, Dropbox, etc.)

---

## 🔍 **Si No Ves la Sección "Artifacts":**

1. **Verifica que el workflow se completó exitosamente:**
   - Debe tener un ✅ verde
   - Si tiene ❌ rojo, el backup falló

2. **Espera unos segundos:**
   - Los artefactos pueden tardar unos segundos en aparecer después de que el workflow termine

3. **Refresca la página:**
   - A veces necesitas refrescar (F5) para ver los artefactos

4. **Verifica que el step "Subir backups como artefacto" se ejecutó:**
   - En los logs del workflow, busca el step "📤 Subir backups como artefacto"
   - Debe tener un ✅ verde

---

## 📊 **Ver el Contenido del Backup:**

### **Opción 1: Ver en GitHub (sin descargar)**

1. Haz click en el artefacto
2. GitHub mostrará una lista de archivos
3. Puedes hacer click en cada archivo JSON para ver su contenido (si es pequeño)

### **Opción 2: Descargar y Ver Localmente**

1. Descarga el `.zip`
2. Extrae los archivos
3. Abre los archivos JSON con cualquier editor de texto o navegador
4. Los archivos JSON están formateados, así que son fáciles de leer

---

## 🔄 **Backups Automáticos:**

El **"Backup Diario de Supabase"** se ejecutará automáticamente cada día a las 2:00 AM UTC (11:00 PM hora Argentina).

Para descargar un backup diario:
1. Ve a **Actions** → **Backup Diario de Supabase**
2. Haz click en el último workflow ejecutado
3. Descarga el artefacto igual que con el backup manual

---

## 💡 **Consejos:**

1. **Descarga backups importantes:** Si haces cambios importantes, descarga el backup manualmente
2. **Guarda en múltiples lugares:** GitHub + Google Drive + tu computadora
3. **Verifica periódicamente:** Revisa semanalmente que los backups se estén ejecutando
4. **Nombra tus backups:** Cuando descargues, renombra el archivo con la fecha para organizarte

---

## ✅ **Checklist:**

- [ ] Puedo ver el workflow completado (✅ verde)
- [ ] Veo la sección "Artifacts" al final de la página
- [ ] Puedo descargar el archivo `.zip`
- [ ] Puedo extraer y ver los archivos JSON
- [ ] Entiendo que los backups se guardan por 30-90 días en GitHub

---

**¡Felicidades! Tu sistema de backups automáticos está funcionando!** 🎉

