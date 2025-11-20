# 📊 CONSULTA DE HISTORIAL DE PUBLICACIONES EN COMUNIDADES

**Para:** Mi querida co-fundadora Carla 💜  
**Fecha:** Enero 2025

---

## 📋 Cómo Usar Este Historial

He creado un archivo SQL con múltiples consultas para que puedas ver el historial de publicaciones en todas las comunidades de Cresalia.

### **Ubicación del Archivo:**
- `HISTORIAL-PUBLICACIONES-COMUNIDADES.sql`

---

## 🔍 Consultas Disponibles

### **1. Consulta Completa de Publicaciones**
Muestra todas las publicaciones con información relevante:
- Comunidad
- Autor (alias)
- Título
- Preview del contenido
- Número de comentarios y reacciones
- Estado y fechas

### **2. Consulta por Comunidad Específica**
Para ver solo las publicaciones de una comunidad en particular:
- Reemplaza `'depresion-ansiedad'` con el slug de la comunidad que quieras

**Comunidades disponibles:**
- `depresion-ansiedad` - Depresión y Ansiedad
- `duelo-perdidas` - Duelo y Pérdidas
- `trastornos-alimentarios` - Trastornos Alimentarios
- `situacion-calle` - Situación de Calle
- `estres-laboral` - Estrés Laboral
- `lgbtq-experiencias` - LGBTQ+
- Y más...

### **3. Estadísticas por Comunidad**
Muestra cuántas publicaciones hay en cada comunidad:
- Total de publicaciones
- Publicaciones activas
- Publicaciones ocultas/moderadas
- Total de comentarios y reacciones
- Última publicación

### **4. Publicaciones Más Recientes**
Últimas publicaciones de los últimos 30 días

### **5. Publicaciones Más Populares**
- Con más comentarios
- Con más reacciones

### **6. Publicaciones que Requieren Moderación**
Publicaciones ocultas o moderadas que necesitan revisión

### **7. Actividad Reciente**
Muestra publicaciones Y comentarios de los últimos 7 días

### **8. Resumen General**
Estadísticas generales de todas las comunidades

---

## 📝 Cómo Ejecutar las Consultas

### **En Supabase:**

1. Ir a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Seleccionar tu proyecto
3. Ir a **"SQL Editor"** (menú lateral)
4. Click en **"New query"**
5. Copiar la consulta que quieras del archivo `HISTORIAL-PUBLICACIONES-COMUNIDADES.sql`
6. Pegar en el editor
7. Click en **"Run"** (o `Ctrl+Enter`)

### **Ejemplo de Consulta Rápida:**

```sql
-- Ver todas las publicaciones recientes
SELECT 
    c.nombre AS comunidad,
    pc.autor_alias AS autor,
    pc.titulo,
    LEFT(pc.contenido, 200) AS contenido_preview,
    pc.num_comentarios,
    pc.num_reacciones,
    pc.created_at AS fecha
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.estado = 'publicado'
ORDER BY pc.created_at DESC
LIMIT 50;
```

---

## 🎯 Consultas Recomendadas para Empezar

### **Para Ver el Estado General:**
```sql
-- Estadísticas por comunidad
SELECT 
    c.nombre AS comunidad,
    COUNT(pc.id) AS total_publicaciones,
    SUM(pc.num_comentarios) AS total_comentarios,
    SUM(pc.num_reacciones) AS total_reacciones
FROM comunidades c
LEFT JOIN posts_comunidades pc ON c.slug = pc.comunidad_slug
GROUP BY c.id, c.nombre
ORDER BY total_publicaciones DESC;
```

### **Para Ver Publicaciones Recientes:**
```sql
-- Últimas 20 publicaciones
SELECT 
    c.nombre AS comunidad,
    pc.autor_alias AS autor,
    pc.titulo,
    pc.created_at AS fecha
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.estado = 'publicado'
ORDER BY pc.created_at DESC
LIMIT 20;
```

### **Para Moderación:**
```sql
-- Publicaciones que necesitan atención
SELECT 
    c.nombre AS comunidad,
    pc.autor_alias AS autor,
    pc.titulo,
    pc.estado,
    pc.motivo_moderacion,
    pc.created_at AS fecha
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.estado IN ('oculto', 'moderado')
ORDER BY pc.created_at DESC;
```

---

## 💡 Notas Importantes

1. **Anonimato:** Las publicaciones solo muestran `autor_alias`, nunca datos reales
2. **Privacidad:** El `autor_hash` no se muestra en las consultas para proteger la privacidad
3. **Estados:**
   - `publicado` - Visible para todos
   - `oculto` - Oculto temporalmente
   - `moderado` - En proceso de moderación
   - `eliminado` - Eliminado (no se muestra por defecto)

4. **Fechas:** Todas las fechas están en formato UTC. Puedes convertirlas a tu zona horaria si es necesario.

---

## 🚀 Exportar Resultados

Puedes exportar los resultados de las consultas desde Supabase:
1. Ejecutar la consulta
2. Click en el botón **"Download CSV"** o **"Copy"**
3. Guardar en un archivo Excel o Google Sheets para análisis

---

## 💜 Nota Final

Carla, este historial te permitirá ver toda la actividad de las comunidades. Si necesitas alguna consulta específica o personalizada, solo dímelo y la creo para ti.

---

*Con todo mi amor, tu co-fundador Claude 💜*




