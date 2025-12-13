# 💾 Guía: Backups Automáticos de Supabase

## ✅ Lo que tienes ahora

1. **Documentación** (`ESTRATEGIA_RESPALDOS.md`) - Plan de respaldos
2. **Sistema básico** (`auth/backup-system.js`) - Solo para localStorage (frontend)
3. **Script nuevo** (`scripts/backup-supabase.js`) - Para respaldar Supabase

---

## 🎯 Sistema de Backup de Supabase

### ¿Qué hace?

El script `scripts/backup-supabase.js`:
- ✅ Descarga TODAS las tablas de Supabase como JSON
- ✅ Guarda cada tabla en un archivo separado
- ✅ Crea un archivo de información del backup
- ✅ Limpia backups antiguos automáticamente

### 📋 Tablas que respalda (por defecto):

- `tenants` - Tus clientes
- `tiendas` - Información de tiendas
- `productos` - Catálogo de productos
- `ordenes` - Ventas realizadas
- `orden_items` - Items de cada orden
- `usuarios` - Usuarios del sistema
- `feedbacks` - Feedback de usuarios
- `posts_comunidades` - Posts de comunidades
- `comentarios_foro` - Comentarios
- `tickets_soporte` - Tickets de soporte

**Puedes agregar más tablas editando el array `tablas` en el script.**

---

## 🚀 Cómo Usar

### Paso 1: Instalar dependencia (si no la tienes)

```bash
cd backend
npm install @supabase/supabase-js
```

### Paso 2: Obtener tu Service Key de Supabase

⚠️ **IMPORTANTE**: Necesitas la **Service Key** (no la anon key)

1. Ve a tu proyecto en Supabase
2. Settings (⚙️) → API
3. Busca **"service_role" key** (no la anon key)
4. Cópiala (empieza con `eyJ...`)

### Paso 3: Configurar variables de entorno

**Opción A: Windows PowerShell**
```powershell
$env:SUPABASE_URL="https://tu-proyecto.supabase.co"
$env:SUPABASE_SERVICE_KEY="tu-service-key-aqui"
```

**Opción B: Crear archivo `.env` en la carpeta `scripts/`**
```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=tu-service-key-aqui
```

**⚠️ IMPORTANTE**: 
- NUNCA subas el `.env` a Git
- La Service Key es SENSIBLE (puede leer/escribir todo)

### Paso 4: Ejecutar backup manual

```bash
node scripts/backup-supabase.js
```

### Paso 5: Ver los backups

Los backups se guardan en: `backups/`

```
backups/
├── tenants_2025-01-27T10-30-00-000Z.json
├── productos_2025-01-27T10-30-00-000Z.json
├── ordenes_2025-01-27T10-30-00-000Z.json
└── backup-info_2025-01-27T10-30-00-000Z.json
```

---

## ⏰ Backups Automáticos

### Opción 1: GitHub Actions (Gratis)

Crea `.github/workflows/backup-daily.yml`:

```yaml
name: Backup Diario Supabase

on:
  schedule:
    - cron: '0 2 * * *' # Cada día a las 2 AM
  workflow_dispatch: # Permitir ejecución manual

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Instalar dependencias
        run: |
          cd backend
          npm install @supabase/supabase-js
      
      - name: Ejecutar backup
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
        run: node scripts/backup-supabase.js
      
      - name: Subir backups a GitHub (opcional)
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add backups/
          git commit -m "Backup automático $(date)" || exit 0
          git push
```

Luego agrega los secrets en GitHub:
1. Settings → Secrets → Actions
2. Agrega `SUPABASE_URL`
3. Agrega `SUPABASE_SERVICE_KEY`

### Opción 2: Cron Job Local (si tienes servidor)

```bash
# Editar crontab
crontab -e

# Agregar línea (backup cada día a las 2 AM)
0 2 * * * cd /ruta/a/tu/proyecto && node scripts/backup-supabase.js
```

### Opción 3: Vercel Cron Jobs (si usas Vercel)

Crear `api/backup-cron.js`:

```javascript
export default async function handler(req, res) {
    // Solo permitir desde Vercel Cron
    if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Ejecutar backup
    const { BackupSupabase } = require('../../scripts/backup-supabase');
    const backup = new BackupSupabase();
    await backup.hacerBackupCompleto();
    
    return res.json({ success: true });
}
```

Y agregar en `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/backup-cron",
    "schedule": "0 2 * * *"
  }]
}
```

---

## 📦 Restaurar desde Backup

### Restaurar una tabla específica:

1. Abre el archivo JSON del backup (ej: `productos_2025-01-27T10-30-00-000Z.json`)
2. Ve a Supabase → SQL Editor
3. Ejecuta:

```sql
-- Limpiar tabla actual (¡CUIDADO! Esto borra todo)
TRUNCATE TABLE productos;

-- Insertar desde backup
-- (Copia el contenido del JSON y ajusta según la estructura)
INSERT INTO productos (columna1, columna2, ...)
VALUES ...;
```

⚠️ **Mejor práctica**: Prueba primero en una tabla de prueba.

---

## 🔒 Seguridad

- ✅ Los backups NO incluyen contraseñas (están hasheadas en Supabase Auth)
- ✅ La Service Key es sensible - guárdala segura
- ✅ NO subas backups a Git si contienen datos sensibles
- ✅ Encripta backups si los guardas en la nube

---

## 💡 Tips

1. **Prueba primero**: Ejecuta el backup manualmente antes de automatizar
2. **Retención**: El script limpia backups > 30 días (puedes cambiar)
3. **Verificar**: Revisa que los archivos JSON tengan datos
4. **Espacio**: Los backups pueden crecer, revisa el espacio en disco

---

## ❓ Preguntas Frecuentes

**P: ¿Cuánto espacio ocupan los backups?**
R: Depende de tus datos. Ejemplo: 1000 productos ≈ 1-2 MB.

**P: ¿Puedo hacer backup solo de ciertas tablas?**
R: Sí, edita el array `tablas` en el script.

**P: ¿Los backups incluyen imágenes?**
R: No, solo datos de la base de datos. Las imágenes están en Storage.

**P: ¿Puedo automatizar backups de Storage también?**
R: Sí, pero requiere otro script (más complejo).

---

## ✅ Checklist

- [ ] Script de backup creado (`scripts/backup-supabase.js`)
- [ ] Service Key obtenida de Supabase
- [ ] Variables de entorno configuradas
- [ ] Backup manual ejecutado exitosamente
- [ ] Backups automáticos configurados (GitHub Actions/Cron/Vercel)
- [ ] Prueba de restauración realizada

---

**¡Listo! Ahora tienes backups automáticos de Supabase completamente gratis.** 💜

