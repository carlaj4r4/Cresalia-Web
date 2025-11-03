# 🛡️ Guía Rápida de Moderación - Foro de Comunidades

## 🚀 Para Empezar YA

### Paso 1: Ejecutar SQL de Moderación

Ejecutá este archivo en Supabase:
- **Archivo:** `supabase-moderation-foro.sql`
- **Qué hace:** Crea tablas para banear usuarios y registrar acciones de moderación

---

## 📝 Cómo Banear un Usuario (AHORA)

### Método 1: Directamente en Supabase

1. **Encontrar el hash del usuario:**
   - Ir a Supabase → Table Editor → `posts_comunidades`
   - Buscar el post problemático
   - Copiar el `autor_hash` (ej: `a3f5b2c9...`)

2. **Banear:**
   ```sql
   INSERT INTO usuarios_baneados_foro (autor_hash, comunidad_slug, motivo, moderador)
   VALUES ('HASH-DEL-USUARIO', 'estres-laboral', 'Comentarios irrespetuosos', 'CRISLA');
   ```

3. **Banear de TODAS las comunidades:**
   ```sql
   INSERT INTO usuarios_baneados_foro (autor_hash, comunidad_slug, motivo, moderador)
   VALUES ('HASH-DEL-USUARIO', NULL, 'Violación grave de reglas', 'CRISLA');
   -- NULL = todas las comunidades
   ```

---

## 🗑️ Cómo Ocultar/Eliminar Posts/Comentarios

### Ocultar un post:
```sql
UPDATE posts_comunidades 
SET estado = 'oculto', 
    motivo_moderacion = 'Contenido irrespetuoso'
WHERE id = 'UUID-DEL-POST';
```

### Eliminar un post:
```sql
UPDATE posts_comunidades 
SET estado = 'eliminado', 
    motivo_moderacion = 'Spam'
WHERE id = 'UUID-DEL-POST';
```

### Ocultar un comentario:
```sql
UPDATE comentarios_comunidades 
SET estado = 'oculto', 
    motivo_moderacion = 'Comentario irrespetuoso'
WHERE id = 'UUID-DEL-COMENTARIO';
```

---

## 📊 Ver Usuarios Baneados

```sql
-- Ver todos los baneados activos
SELECT * FROM usuarios_baneados_foro 
WHERE estado = 'activo';

-- Ver baneados de una comunidad específica
SELECT * FROM usuarios_baneados_foro 
WHERE estado = 'activo' 
AND (comunidad_slug = 'estres-laboral' OR comunidad_slug IS NULL);
```

---

## 🔓 Desbanear un Usuario

```sql
UPDATE usuarios_baneados_foro 
SET estado = 'levantado',
    fecha_desbaneo = NOW()
WHERE autor_hash = 'HASH-DEL-USUARIO';
```

---

## 🎯 Flujo Recomendado

1. **Primera vez:** Ocultar post + advertencia
2. **Reincidencia:** Banear usuario (por hash)
3. **Grave:** Banear + eliminar todos sus posts

---

## ⚠️ Importante

- Los posts/comentarios con `estado = 'oculto'` NO se muestran (pero existen en la DB)
- Los posts/comentarios con `estado = 'eliminado'` NO se muestran (pero existen en la DB)
- Los usuarios baneados verán un mensaje cuando intenten publicar
- El ban es por hash, NO por email (mantiene anonimato)

---

**Documentación completa:** Ver `SISTEMA-MODERACION-FORO-COMUNIDADES.md`

💜 Tu co-fundador,

Claude

