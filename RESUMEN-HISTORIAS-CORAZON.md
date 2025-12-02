# 💜 Sistema: Historias con Corazón Cresalia

## 🎯 Propósito

Permitir que los **clientes VIP** compartan sus historias de emprendimiento en un espacio público y opcional en `index-cresalia.html`.

---

## ✨ Características

### **Para Clientes VIP:**
- ✅ Compartir su historia de emprendimiento
- ✅ Subir foto de su negocio o equipo
- ✅ Elegir si es pública o privada
- ✅ Editar su historia cuando quiera
- ✅ Eliminar (desactivar) su historia

### **Para Visitantes:**
- ✅ Ver historias públicas de clientes VIP
- ✅ Inspirarse con las historias de éxito
- ✅ Conocer a otros emprendedores

---

## 📁 Archivos Creados

### **1. Frontend:**
- ✅ `js/historias-corazon-cresalia.js` - Sistema de visualización
- ✅ Sección en `index-cresalia.html` (antes del `</body>`)

### **2. Backend:**
- ✅ `api/historias-corazon.js` - API endpoint para CRUD

### **3. Base de Datos:**
- ✅ `supabase-historias-corazon-cresalia.sql` - Tabla y políticas RLS

---

## 🗄️ Estructura de la Tabla

```sql
historias_corazon_cresalia:
- id (BIGSERIAL)
- cliente_id (VARCHAR) - ID del cliente VIP
- nombre_negocio (TEXT)
- tipo_negocio (TEXT) - 'tienda', 'servicio', 'otro'
- historia (TEXT) - Contenido de la historia
- foto_url (TEXT) - URL de la foto
- publica (BOOLEAN) - Si es pública o privada
- activa (BOOLEAN) - Si está activa (no eliminada)
- fecha_publicacion (TIMESTAMP)
- fecha_actualizacion (TIMESTAMP)
```

---

## 🔐 Seguridad

### **Políticas RLS:**
- ✅ Cualquiera puede leer historias públicas
- ✅ Solo el cliente puede ver su propia historia (incluso si no es pública)
- ✅ Solo clientes VIP pueden crear historias (verificado en API)
- ✅ Solo el cliente puede actualizar/eliminar su propia historia

### **Verificación en API:**
- ✅ Verifica que el cliente sea VIP antes de permitir crear/actualizar
- ✅ Verifica que la historia pertenezca al cliente antes de eliminar

---

## 📍 Ubicación en la Página

La sección aparece en `index-cresalia.html`:
- Antes del `</body>`
- Solo se muestra si hay historias públicas
- Diseño responsive con grid

---

## 🎨 Diseño

- ✅ Cards con gradiente superior (Cresalia colors)
- ✅ Avatar circular con foto o inicial
- ✅ Hover effect (elevación)
- ✅ Responsive (1 columna en móviles)
- ✅ Mensaje cuando no hay historias

---

## 🔄 Próximos Pasos

1. **Ejecutar SQL en Supabase:**
   ```sql
   -- Ejecutar supabase-historias-corazon-cresalia.sql
   ```

2. **Crear panel para clientes VIP:**
   - Formulario para compartir/editar historia
   - Upload de foto
   - Toggle público/privado

3. **Agregar enlace en el footer:**
   - "Historias con Corazón" → `#historias-corazon`

---

## ✅ Estado Actual

- ✅ Sección HTML creada
- ✅ JavaScript de visualización creado
- ✅ API endpoint creado
- ✅ Tabla SQL creada
- ⏳ Pendiente: Ejecutar SQL en Supabase
- ⏳ Pendiente: Panel para que clientes VIP compartan historias



