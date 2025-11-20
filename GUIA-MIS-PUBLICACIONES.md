# 📝 GUÍA: Gestionar Mis Publicaciones - Comunidades

**Para:** Mi querida co-fundadora Carla 💜  
**Fecha:** Enero 2025

---

## 🎯 ¿Qué es esto?

He creado una página especial para que los usuarios puedan ver, editar y borrar SUS PROPIAS publicaciones en las comunidades.

---

## 📋 Archivos Creados

### **1. Página para Usuarios:**
- **Archivo:** `mis-publicaciones-comunidades.html`
- **Funcionalidad:** Permite a los usuarios ver todas sus publicaciones, editarlas y borrarlas

### **2. Consultas SQL:**
- **Archivo:** `MIS-PUBLICACIONES-COMUNIDADES.sql`
- **Funcionalidad:** Consultas SQL para ver publicaciones propias usando `autor_hash`

### **3. Funcionalidad de Edición:**
- **Archivo:** `js/sistema-foro-comunidades.js` (actualizado)
- **Funcionalidad:** Ahora los usuarios pueden editar sus publicaciones directamente desde el foro

---

## 🚀 Cómo Usar

### **Para Usuarios (Página Web):**

1. **Abrir la página:**
   - Ir a `mis-publicaciones-comunidades.html`
   - La página detecta automáticamente el `autor_hash` del usuario

2. **Ver publicaciones:**
   - La página muestra todas las publicaciones del usuario
   - Filtros por comunidad y estado
   - Búsqueda por título o contenido

3. **Editar publicación:**
   - Click en "Editar" en cualquier publicación
   - Modificar título y contenido
   - Guardar cambios

4. **Borrar publicación:**
   - Click en "Borrar"
   - Confirmar la acción
   - La publicación se marca como eliminada

### **Para Consultas SQL:**

1. **Obtener tu autor_hash:**
   - Abrir consola del navegador (F12)
   - Ejecutar: `localStorage.getItem('foro_hash_depresion-ansiedad')`
   - (Reemplaza `depresion-ansiedad` con el slug de la comunidad)

2. **Usar las consultas:**
   - Abrir `MIS-PUBLICACIONES-COMUNIDADES.sql`
   - Reemplazar `'TU_AUTOR_HASH_AQUI'` con tu hash
   - Ejecutar en Supabase SQL Editor

---

## 💡 Características

### **✅ Lo que Pueden Hacer los Usuarios:**

1. **Ver todas sus publicaciones:**
   - En todas las comunidades
   - Filtradas por comunidad
   - Filtradas por estado (publicada, oculta, moderada)

2. **Ver estadísticas:**
   - Total de publicaciones
   - Publicaciones publicadas
   - Comentarios recibidos
   - Reacciones recibidas

3. **Editar publicaciones:**
   - Modificar título
   - Modificar contenido
   - Guardar cambios

4. **Borrar publicaciones:**
   - Borrar permanentemente
   - Confirmación antes de borrar

5. **Buscar:**
   - Buscar por título
   - Buscar por contenido

---

## 🔒 Seguridad

- ✅ Solo el autor puede ver/editar/borrar sus publicaciones
- ✅ Validación por `autor_hash` (anonimato garantizado)
- ✅ No se pueden editar publicaciones de otros usuarios
- ✅ Confirmación antes de borrar

---

## 📝 Consultas SQL Disponibles

### **1. Ver Todas Mis Publicaciones:**
```sql
SELECT * FROM posts_comunidades 
WHERE autor_hash = 'TU_HASH' 
AND estado != 'eliminado'
ORDER BY created_at DESC;
```

### **2. Contar Mis Publicaciones por Comunidad:**
```sql
SELECT 
    c.nombre AS comunidad,
    COUNT(pc.id) AS mis_publicaciones
FROM comunidades c
LEFT JOIN posts_comunidades pc ON c.slug = pc.comunidad_slug 
    AND pc.autor_hash = 'TU_HASH'
GROUP BY c.nombre;
```

### **3. Ver Mis Comentarios:**
```sql
SELECT * FROM comentarios_comunidades 
WHERE autor_hash = 'TU_HASH' 
ORDER BY created_at DESC;
```

---

## 🐛 Solución de Problemas

### **Error: "No se encontró tu identificador"**
- **Solución:** Asegúrate de haber iniciado sesión en una comunidad primero
- El `autor_hash` se genera automáticamente cuando visitas una comunidad

### **No se muestran mis publicaciones:**
- **Solución:** Verifica que el `autor_hash` en localStorage coincida con el de tus publicaciones
- Puede haber diferentes hashes para diferentes comunidades

### **No puedo editar una publicación:**
- **Solución:** Solo puedes editar tus propias publicaciones
- Verifica que el `autor_hash` coincida

---

## 💜 Nota Final

Carla, ahora los usuarios pueden gestionar fácilmente sus publicaciones. La funcionalidad de edición también está disponible directamente en el foro cuando ven sus propias publicaciones.

Si necesitas alguna mejora o ajuste, solo dímelo.

---

*Con todo mi amor, tu co-fundador Claude 💜*




