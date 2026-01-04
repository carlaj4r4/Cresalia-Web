# 🔧 Configurar Backups para Dos Proyectos de Supabase

**Fecha:** 27 de Enero, 2025

---

## 🎯 Situación

Tienes **DOS proyectos SEPARADOS de Supabase**:
1. **Cresalia-Tiendas** - Para el e-commerce
2. **Cresalia-Comunidades** - Para las comunidades

Cada proyecto necesita sus propios secrets y se respalda por separado.

---

## ✅ Lo que ya está listo:

1. ✅ Script de backup para Tiendas (`scripts/backup-supabase.js`)
2. ✅ Script de backup para Comunidades (`scripts/backup-supabase-comunidades.js`)
3. ✅ Workflows de GitHub Actions actualizados para ambos proyectos

---

## 🔐 Paso 1: Configurar Secrets en GitHub

Necesitas **4 secrets** en total (2 para cada proyecto):

### **Secrets para Cresalia-Tiendas:**

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click en **"New repository secret"**

**Secret 1:**
- **Name:** `SUPABASE_URL`
- **Secret:** Tu Project URL de Tiendas (ejemplo: `https://xxxx.supabase.co`)
- Click en **"Add secret"**

**Secret 2:**
- **Name:** `SUPABASE_SERVICE_KEY`
- **Secret:** Tu service_role key de Tiendas (la clave larga que empieza con `eyJ...`)
- Click en **"Add secret"**

### **Secrets para Cresalia-Comunidades:**

**Secret 3:**
- **Name:** `SUPABASE_URL_COMUNIDADES`
- **Secret:** Tu Project URL de Comunidades (ejemplo: `https://yyyy.supabase.co`)
- Click en **"Add secret"**

**Secret 4:**
- **Name:** `SUPABASE_SERVICE_KEY_COMUNIDADES`
- **Secret:** Tu service_role key de Comunidades (la clave larga que empieza con `eyJ...`)
- Click en **"Add secret"**

---

## 📋 Paso 2: Obtener las Credenciales

### **Para Cresalia-Tiendas:**

1. Ve a: https://app.supabase.com
2. Selecciona proyecto: **Cresalia-Tiendas**
3. Ve a: **Settings** → **API**
4. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (secret) → `SUPABASE_SERVICE_KEY`

### **Para Cresalia-Comunidades:**

1. En el mismo dashboard, cambia a proyecto: **Cresalia-Comunidades**
2. Ve a: **Settings** → **API**
3. Copia:
   - **Project URL** → `SUPABASE_URL_COMUNIDADES`
   - **service_role key** (secret) → `SUPABASE_SERVICE_KEY_COMUNIDADES`

---

## 🚀 Paso 3: Probar los Backups

### **Probar Backup Manual:**

1. Ve a la pestaña **"Actions"** en GitHub
2. Click en **"Backup Manual de Supabase (Tiendas + Comunidades)"**
3. Click en **"Run workflow"** (botón verde arriba a la derecha)
4. Selecciona la rama `main`
5. Click en **"Run workflow"**
6. Espera 2-3 minutos

**Deberías ver:**
- ✅ Job "Backup Manual Cresalia-Tiendas" - ✅ verde
- ✅ Job "Backup Manual Cresalia-Comunidades" - ✅ verde
- ✅ Job "Notificar resultado" - ✅ verde

**En la sección "Artifacts" verás:**
- `supabase-backup-tiendas-manual-X` (archivos JSON de tiendas)
- `supabase-backup-comunidades-manual-X` (archivos JSON de comunidades)

---

## 📁 Estructura de Backups

Los backups se guardan en carpetas separadas:

```
backups/
├── tiendas/
│   ├── tiendas_2025-01-27T10-30-00-000Z.json
│   ├── productos_2025-01-27T10-30-00-000Z.json
│   ├── ordenes_2025-01-27T10-30-00-000Z.json
│   └── backup-info-tiendas_2025-01-27T10-30-00-000Z.json
│
└── comunidades/
    ├── comunidades_2025-01-27T10-30-00-000Z.json
    ├── posts_comunidades_2025-01-27T10-30-00-000Z.json
    ├── comentarios_comunidades_2025-01-27T10-30-00-000Z.json
    └── backup-info-comunidades_2025-01-27T10-30-00-000Z.json
```

---

## ⏰ Backups Automáticos

Los backups automáticos se ejecutan **diariamente a las 2:00 AM UTC** (11 PM Argentina del día anterior).

Cada backup incluye:
- ✅ Backup de Tiendas (todas las tablas de e-commerce)
- ✅ Backup de Comunidades (todas las tablas de comunidades)

---

## 🔍 Verificar que Funciona

### **Checklist:**

- [ ] Los 4 secrets están configurados en GitHub
- [ ] El backup manual funciona (ambos jobs en verde)
- [ ] Puedes descargar los artefactos
- [ ] Los archivos JSON contienen datos

---

## ❌ Si Algo Falla

### **Error: "SUPABASE_URL_COMUNIDADES secret no está configurado"**
- **Solución**: Agrega el secret `SUPABASE_URL_COMUNIDADES` en Settings → Secrets

### **Error: "SUPABASE_SERVICE_KEY_COMUNIDADES secret no está configurado"**
- **Solución**: Agrega el secret `SUPABASE_SERVICE_KEY_COMUNIDADES` en Settings → Secrets

### **Error: "No se encontró scripts/backup-supabase-comunidades.js"**
- **Solución**: Haz commit y push del nuevo archivo `scripts/backup-supabase-comunidades.js`

---

## 📊 Resumen

**Secrets necesarios:**
1. `SUPABASE_URL` - URL del proyecto Tiendas
2. `SUPABASE_SERVICE_KEY` - Service key del proyecto Tiendas
3. `SUPABASE_URL_COMUNIDADES` - URL del proyecto Comunidades
4. `SUPABASE_SERVICE_KEY_COMUNIDADES` - Service key del proyecto Comunidades

**Workflows:**
- `backup-daily.yml` - Backup automático diario (ambos proyectos)
- `backup-manual.yml` - Backup manual (ambos proyectos)

**Scripts:**
- `scripts/backup-supabase.js` - Backup de Tiendas
- `scripts/backup-supabase-comunidades.js` - Backup de Comunidades

---

*Última actualización: 27 de Enero, 2025*

