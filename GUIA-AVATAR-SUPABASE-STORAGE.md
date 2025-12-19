# 📸 Guía: Guardar Avatar/Logo de Tienda en Supabase Storage

## ✅ Implementación Completada

El código ya está actualizado para guardar avatares/logos en **Supabase Storage** en lugar de solo `localStorage`.

---

## 📋 Pasos para Configurar Supabase Storage

### **Paso 1: Crear el Bucket "avatars"**

1. Ir a **Supabase Dashboard** → **Storage**
2. Click en **"New bucket"**
3. Configurar:
   - **Name**: `avatars`
   - **Public bucket**: ✅ **SÍ** (marcar como público)
   - **File size limit**: `2 MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`
4. Click en **"Create bucket"**

### **Paso 2: Configurar Políticas de Seguridad (RLS)**

1. Ir a **Supabase Dashboard** → **Storage** → **Policies**
2. Seleccionar el bucket `avatars`
3. Click en **"New Policy"**

#### **Política 1: Lectura Pública**
- **Policy name**: `Avatares son públicos para lectura`
- **Allowed operation**: `SELECT`
- **Policy definition**:
```sql
bucket_id = 'avatars'
```

#### **Política 2: Subir Propio Avatar**
- **Policy name**: `Usuarios pueden subir sus propios avatares`
- **Allowed operation**: `INSERT`
- **Policy definition**:
```sql
bucket_id = 'avatars' AND
auth.uid()::text = (storage.foldername(name))[1]
```

#### **Política 3: Actualizar Propio Avatar**
- **Policy name**: `Usuarios pueden actualizar sus propios avatares`
- **Allowed operation**: `UPDATE`
- **Policy definition**:
```sql
bucket_id = 'avatars' AND
auth.uid()::text = (storage.foldername(name))[1]
```

#### **Política 4: Eliminar Propio Avatar**
- **Policy name**: `Usuarios pueden eliminar sus propios avatares`
- **Allowed operation**: `DELETE`
- **Policy definition**:
```sql
bucket_id = 'avatars' AND
auth.uid()::text = (storage.foldername(name))[1]
```

**O ejecutar el script SQL:**
1. Abrir `CREAR-BUCKET-AVATARS-SUPABASE.sql`
2. Copiar todo el código
3. Pegar en **Supabase Dashboard** → **SQL Editor**
4. Click en **"Run"** (▶️)

---

## 🔧 Cómo Funciona

### **1. Subir Avatar**

Cuando el usuario selecciona una imagen:
1. ✅ Se valida tamaño (máx 2MB) y tipo
2. ✅ Se muestra preview inmediato
3. ✅ Se sube a Supabase Storage: `avatars/{user_id}/avatar-{timestamp}.{ext}`
4. ✅ Se obtiene URL pública
5. ✅ Se guarda en `tiendas.configuracion.avatar_url`
6. ✅ Se guarda en `localStorage` como backup

### **2. Cargar Avatar**

Cuando se carga el widget:
1. ✅ Se busca en `tiendas.configuracion.avatar_url` (Supabase)
2. ✅ Si no existe, se busca en `localStorage` (fallback)
3. ✅ Si no existe, se muestra avatar por defecto con iniciales

---

## 📁 Estructura de Archivos en Storage

```
avatars/
├── {user_id_1}/
│   └── avatar-1234567890.jpg
├── {user_id_2}/
│   └── avatar-1234567891.png
└── ...
```

Cada usuario tiene su propia carpeta con su avatar.

---

## 🔍 Verificar que Funciona

### **Test 1: Subir Avatar**

1. Ir a `admin-final.html`
2. Click en el avatar/logo en el widget
3. Seleccionar una imagen
4. Verificar en consola:
   - ✅ `✅ Logo/Avatar de tienda guardado en Supabase: https://...`
5. Verificar en Supabase:
   - **Storage** → **avatars** → Deberías ver la carpeta con el `user_id`
   - **Table Editor** → **tiendas** → `configuracion.avatar_url` debería tener la URL

### **Test 2: Cargar Avatar**

1. Recargar la página
2. Verificar que el avatar se carga automáticamente
3. Verificar que aparece en el widget

---

## 🚨 Solución de Problemas

### **Error: "Bucket 'avatars' not found"**

**Solución:**
1. Crear el bucket manualmente en **Storage** → **New bucket**
2. O ejecutar el script SQL `CREAR-BUCKET-AVATARS-SUPABASE.sql`

### **Error: "new row violates row-level security policy"**

**Solución:**
1. Verificar que las políticas RLS están configuradas
2. Ejecutar el script SQL `CREAR-BUCKET-AVATARS-SUPABASE.sql`

### **Error: "File size exceeds limit"**

**Solución:**
- El límite es 2MB. Reducir el tamaño de la imagen antes de subir.

### **El avatar no se muestra**

**Solución:**
1. Verificar que el bucket es **público**
2. Verificar que la URL en `configuracion.avatar_url` es correcta
3. Verificar en consola si hay errores de CORS

---

## 💡 Ventajas de Usar Supabase Storage

✅ **Persistente**: No se pierde al limpiar `localStorage`  
✅ **Accesible**: URL pública para usar en cualquier lugar  
✅ **Escalable**: Soporta muchos usuarios sin problemas  
✅ **Seguro**: RLS asegura que solo el usuario puede modificar su avatar  
✅ **Backup**: También se guarda en `localStorage` como respaldo  

---

## 📋 Checklist

- [ ] Crear bucket `avatars` en Supabase Storage
- [ ] Configurar políticas RLS (o ejecutar script SQL)
- [ ] Probar subir avatar desde `admin-final.html`
- [ ] Verificar que se guarda en Storage
- [ ] Verificar que se guarda en `tiendas.configuracion.avatar_url`
- [ ] Probar recargar página y verificar que el avatar se carga
- [ ] Verificar que aparece en el widget

---

¿Querés que te guíe paso a paso para crear el bucket en Supabase? 😊💜
