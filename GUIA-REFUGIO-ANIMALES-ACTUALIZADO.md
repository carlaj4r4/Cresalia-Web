# 🐾 Guía: Refugio de Animales Digital - Actualización

## ✅ Cambios Implementados

### 1. **Subida de Archivos (Imágenes/Videos)**

**Antes:**
- ❌ Solo se podían usar URLs de imágenes
- ❌ No se podían subir archivos directamente

**Ahora:**
- ✅ Subida directa de archivos (imágenes y videos)
- ✅ Almacenamiento en Supabase Storage
- ✅ Soporte para múltiples archivos
- ✅ Preview antes de subir
- ✅ Validación de tamaño y tipo

**Especificaciones:**
- **Imágenes**: Máximo 10MB (jpg, png, gif, webp)
- **Videos**: Máximo 50MB (mp4, webm, mov, avi)
- **Múltiples archivos**: Se pueden subir varios a la vez

---

### 2. **Sistema de Cumpleaños de Animales**

**Nueva funcionalidad:**
- ✅ Fecha de adopción o rescate
- ✅ Cálculo automático de años desde adopción/rescate
- ✅ Celebración mensual de "cumpleaños"
- ✅ API endpoint para obtener animales que cumplen años

**Cómo funciona:**
1. Al publicar un animal, se puede agregar la fecha de adopción/rescate
2. El sistema calcula automáticamente cuántos años tiene desde esa fecha
3. Cada mes, se muestran los animales que cumplen años (aniversario de adopción/rescate)
4. Se pueden ver en una sección especial con diseño de celebración

---

## 📋 Archivos Creados/Modificados

### SQL (Base de Datos)
- ✅ `supabase-cresalia-animales-actualizado.sql` - Agrega columnas y cambios necesarios

**Cambios en la tabla `animales_necesitan_ayuda`:**
- Nueva columna: `fecha_adopcion_rescate` (DATE)
- Columna `fotos` cambiada de `TEXT[]` a `JSONB` para almacenar referencias a Supabase Storage

**Formato nuevo de `fotos`:**
```json
[
  {
    "type": "image",
    "url": "https://...",
    "uploaded_at": "2024-12-01T12:00:00Z"
  },
  {
    "type": "video",
    "url": "https://...",
    "uploaded_at": "2024-12-01T12:00:00Z"
  }
]
```

---

### API Endpoints

#### 1. `/api/animales-subir-archivo.js`
**Función:** Subir archivos (imágenes/videos) a Supabase Storage

**Método:** POST

**Body:**
```json
{
  "file": "data:image/jpeg;base64,..." o "base64...",
  "filename": "nombre-archivo.jpg",
  "mimetype": "image/jpeg"
}
```

**Respuesta:**
```json
{
  "success": true,
  "file": {
    "type": "image",
    "url": "https://...",
    "path": "animales/images/image_123.jpg",
    "filename": "image_123.jpg",
    "size": 123456,
    "uploaded_at": "2024-12-01T12:00:00Z"
  }
}
```

---

#### 2. `/api/animales-cumpleanos.js`
**Función:** Obtener animales que cumplen años (aniversario de adopción/rescate)

**Método:** GET

**Query Parameters:**
- `mes` (opcional): Mes a buscar (1-12). Si no se especifica, usa el mes actual.
- `año` (opcional): Año a buscar. Si no se especifica, usa el año actual.

**Ejemplo:**
```
GET /api/animales-cumpleanos?mes=12&año=2024
```

**Respuesta:**
```json
{
  "success": true,
  "mes": 12,
  "año": 2024,
  "total": 5,
  "animales": [
    {
      "id": 1,
      "nombre": "Luna",
      "tipo_animal": "perro",
      "fecha_adopcion_rescate": "2020-12-15",
      "años_desde_adopcion_rescate": 4,
      "fecha_cumpleanos": "12-15",
      "tipo_celebracion": "aniversario_adopcion_rescate",
      ...
    }
  ]
}
```

---

### JavaScript

#### `js/sistema-cresalia-animales.js`

**Nuevas funciones:**
- `archivoABase64(file)` - Convierte archivo a base64
- `cargarAnimalesCumpleanos(mes, año)` - Carga animales que cumplen años
- `renderizarAnimalesCumpleanos(animales, mes, año)` - Renderiza lista de cumpleaños

**Modificaciones:**
- `mostrarModalPublicarAnimal()` - Agregado campo para fecha de adopción/rescate y subida de archivos
- `publicarAnimalQueNecesitaAyuda()` - Ahora acepta `fecha_adopcion_rescate` y maneja archivos subidos
- `renderizarAnimalesNecesitanAyuda()` - Muestra fecha de adopción/rescate y soporta videos

---

## 🚀 Configuración Necesaria

### 1. Ejecutar SQL de Actualización

Ejecutá `supabase-cresalia-animales-actualizado.sql` en Supabase para:
- Agregar columna `fecha_adopcion_rescate`
- Migrar `fotos` de `TEXT[]` a `JSONB`
- Crear índices para búsquedas por fecha

---

### 2. Crear Bucket en Supabase Storage

**Nombre del bucket:** `animales-files`

**Pasos:**
1. Ir a Supabase Dashboard → Storage
2. Crear nuevo bucket llamado `animales-files`
3. Configurar políticas de acceso:
   - **Lectura pública**: Permitir lectura a todos
   - **Escritura**: Solo autenticados o usar Service Role Key

---

### 3. Variables de Entorno en Vercel

Asegurate de tener configuradas:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (recomendado para subir archivos)
- O `SUPABASE_ANON_KEY` (si configuraste políticas públicas)

---

## 📝 Uso

### Subir Archivos

1. Al publicar un animal, seleccioná archivos (imágenes/videos)
2. Se mostrará un preview de los archivos seleccionados
3. Al enviar el formulario, los archivos se subirán automáticamente a Supabase Storage
4. Las URLs se guardarán en la base de datos

### Cumpleaños de Animales

1. Al publicar un animal, completá la fecha de adopción/rescate (opcional)
2. El sistema calculará automáticamente los años desde esa fecha
3. Cada mes, se mostrarán los animales que cumplen años en una sección especial
4. Se pueden ver llamando a `cargarAnimalesCumpleanos()` o visitando `/api/animales-cumpleanos`

---

## 🎯 Próximos Pasos (Opcionales)

- [ ] Agregar notificaciones cuando un animal cumple años
- [ ] Integrar con el sistema de celebraciones existente
- [ ] Agregar filtros por mes/año en la interfaz
- [ ] Mejorar el diseño de la sección de cumpleaños
- [ ] Agregar opción para editar fecha de adopción/rescate después de publicar

---

## 💜 Nota Importante

**Sobre el monotributo:**
- No necesitás monotributo para desarrollar y construir la plataforma
- Solo lo necesitarás cuando tengas ingresos reales
- Mientras tanto, podés desarrollar y probar sin problemas

**Confíá en el proceso. Construí la plataforma. Cuando tengas ingresos, entonces te registrás.** 💜

---

¡Éxitos con Cresalia! 💜

