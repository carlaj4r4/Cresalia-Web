# 🛡️ Sistema de Moderación y Ban - Foro de Comunidades

## 📋 Resumen

Sistema para que vos (y futuros moderadores) puedan:
- ✅ **Eliminar posts/comentarios** irrespetuosos
- ✅ **Ocultar contenido** sin eliminarlo permanentemente
- ✅ **Banear usuarios** por hash (sin saber quién es)
- ✅ **Auditar acciones** de moderación

---

## 🔍 Estado Actual

El foro ya tiene la estructura lista en Supabase:
- ✅ Campo `estado` en posts: `'publicado'`, `'oculto'`, `'eliminado'`, `'moderado'`
- ✅ Campo `motivo_moderacion` para guardar por qué se moderó
- ✅ Campo `autor_hash` para identificar usuarios sin saber quiénes son

**Lo que falta:** Panel de administración para moderar.

---

## 💻 Cómo Moderar AHORA (Sin Panel)

### Opción 1: Directamente en Supabase (Más rápido)

1. **Ir a Supabase Dashboard** → Table Editor → `posts_comunidades`

2. **Encontrar el post problemático:**
   - Buscar por `comunidad_slug` (ej: 'estres-laboral')
   - Ver `contenido` para identificar el post
   - Anotar el `id` del post

3. **Moderar el post:**
   ```sql
   -- Ocultar un post
   UPDATE posts_comunidades 
   SET estado = 'oculto', 
       motivo_moderacion = 'Contenido irrespetuoso'
   WHERE id = 'UUID-DEL-POST';

   -- Eliminar un post
   UPDATE posts_comunidades 
   SET estado = 'eliminado', 
       motivo_moderacion = 'Spam o contenido inapropiado'
   WHERE id = 'UUID-DEL-POST';
   ```

4. **Para comentarios:**
   ```sql
   -- Ocultar comentario
   UPDATE comentarios_comunidades 
   SET estado = 'oculto', 
       motivo_moderacion = 'Comentario irrespetuoso'
   WHERE id = 'UUID-DEL-COMENTARIO';
   ```

### Opción 2: Banear por Hash (Evitar que publique más)

```sql
-- Crear tabla de usuarios baneados (si no existe)
CREATE TABLE IF NOT EXISTS usuarios_baneados_foro (
    id SERIAL PRIMARY KEY,
    autor_hash VARCHAR(255) NOT NULL UNIQUE,
    comunidad_slug VARCHAR(255), -- NULL = baneado de todas
    motivo TEXT NOT NULL,
    moderador VARCHAR(255) DEFAULT 'CRISLA',
    fecha_baneo TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_desbaneo TIMESTAMP WITH TIME ZONE, -- NULL = permanente
    estado VARCHAR(50) DEFAULT 'activo' CHECK (estado IN ('activo', 'levantado'))
);

-- Banear un usuario (por hash)
INSERT INTO usuarios_baneados_foro (autor_hash, comunidad_slug, motivo, moderador)
VALUES ('HASH-DEL-USUARIO', 'estres-laboral', 'Comentarios irrespetuosos repetidos', 'CRISLA');

-- Ver usuarios baneados
SELECT * FROM usuarios_baneados_foro WHERE estado = 'activo';
```

**Nota:** Necesitarías modificar `js/sistema-foro-comunidades.js` para que verifique si el usuario está baneado antes de publicar.

---

## 👥 Sistema de Moderadores (Futuro)

### Tabla de Moderadores

```sql
-- Tabla de moderadores
CREATE TABLE IF NOT EXISTS moderadores_foro (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    comunidades_slug TEXT[], -- Comunidades que puede moderar
    nivel VARCHAR(50) DEFAULT 'moderador' CHECK (nivel IN ('moderador', 'super_moderador', 'admin')),
    activo BOOLEAN DEFAULT true,
    fecha_nombramiento TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ejemplo: Agregar moderador
INSERT INTO moderadores_foro (email, nombre, comunidades_slug, nivel)
VALUES ('moderador@ejemplo.com', 'Nombre Moderador', ARRAY['estres-laboral', 'lgbtq-experiencias'], 'moderador');
```

### Tabla de Acciones de Moderación (Auditoría)

```sql
-- Log de todas las acciones de moderación
CREATE TABLE IF NOT EXISTS acciones_moderacion (
    id SERIAL PRIMARY KEY,
    moderador_email VARCHAR(255) NOT NULL,
    tipo_accion VARCHAR(50) NOT NULL, -- 'ocultar_post', 'eliminar_post', 'banear_usuario', etc.
    post_id UUID REFERENCES posts_comunidades(id),
    comentario_id UUID REFERENCES comentarios_comunidades(id),
    autor_hash VARCHAR(255), -- Hash del usuario afectado
    motivo TEXT NOT NULL,
    comunidad_slug VARCHAR(255),
    fecha_accion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ejemplo: Registrar acción
INSERT INTO acciones_moderacion (
    moderador_email, 
    tipo_accion, 
    post_id, 
    autor_hash, 
    motivo, 
    comunidad_slug
)
VALUES (
    'moderador@ejemplo.com',
    'ocultar_post',
    'UUID-DEL-POST',
    'HASH-DEL-AUTOR',
    'Contenido irrespetuoso',
    'estres-laboral'
);
```

---

## 🎯 Panel de Moderación (Lo que necesitamos crear)

### Funcionalidades necesarias:

1. **Dashboard de Moderación:**
   - Ver posts/comentarios reportados
   - Ver posts/comentarios pendientes de revisión
   - Estadísticas de moderación

2. **Acciones Rápidas:**
   - Botón "Ocultar" (estado = 'oculto')
   - Botón "Eliminar" (estado = 'eliminado')
   - Botón "Banear Usuario" (por hash)
   - Campo para motivo de moderación

3. **Lista de Usuarios Baneados:**
   - Ver hash, motivo, fecha
   - Opción para desbanear
   - Filtrar por comunidad

4. **Auditoría:**
   - Ver historial de todas las acciones
   - Ver quién moderó qué y cuándo
   - Estadísticas por moderador

---

## 📝 Flujo de Moderación Recomendado

### Paso 1: Detectar contenido problemático
- Alguien reporta (sistema de reportes - por implementar)
- Vos/Moderador ve contenido sospechoso
- Sistema detecta palabras clave (opcional - futuro)

### Paso 2: Revisar
- Leer el post/comentario completo
- Ver contexto (otros posts del mismo usuario)
- Verificar si viola reglas

### Paso 3: Acción
- **Primera vez:** Ocultar + mensaje de advertencia
- **Reincidencia:** Eliminar + banear usuario (por hash)
- **Grave:** Banear inmediatamente + eliminar todo su contenido

### Paso 4: Documentar
- Registrar en `acciones_moderacion`
- Guardar motivo
- Notificar (si es posible sin romper anonimato)

---

## 🔒 Consideraciones de Privacidad

**IMPORTANTE:** Como es un sistema anónimo:
- ❌ No podemos notificar por email (no tenemos emails)
- ✅ Podemos mostrar mensaje en la web: "Tu post fue oculto por: [motivo]"
- ✅ Si un usuario está baneado, mostrar: "No podés publicar en esta comunidad"

**El ban funciona por hash:**
- Si limpian caché → pierden su hash → pueden volver a publicar
- Es un equilibrio entre privacidad y moderación

---

## 🚀 Implementación Recomendada (Fases)

### Fase 1: Ahora (Manual en Supabase)
- ✅ Vos moderás directamente en Supabase
- ✅ SQL queries simples para ocultar/eliminar
- ✅ Tabla `usuarios_baneados_foro` básica

### Fase 2: Panel Simple (1-2 semanas)
- Panel web simple para vos (solo CRISLA)
- Ver posts/comentarios por comunidad
- Botones para ocultar/eliminar
- Lista de usuarios baneados

### Fase 3: Sistema Completo (1-2 meses)
- Sistema de reportes
- Panel para moderadores
- Notificaciones
- Detección automática de contenido problemático

---

## 💡 Recomendación Inmediata

**Para empezar YA:**

1. **Ejecutar este SQL** en Supabase:
```sql
-- Tabla de usuarios baneados
CREATE TABLE IF NOT EXISTS usuarios_baneados_foro (
    id SERIAL PRIMARY KEY,
    autor_hash VARCHAR(255) NOT NULL UNIQUE,
    comunidad_slug VARCHAR(255),
    motivo TEXT NOT NULL,
    moderador VARCHAR(255) DEFAULT 'CRISLA',
    fecha_baneo TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estado VARCHAR(50) DEFAULT 'activo'
);
```

2. **Moderar manualmente** cuando veas contenido problemático:
   - Ir a Supabase
   - Buscar el post/comentario
   - Cambiar `estado` a 'oculto' o 'eliminado'
   - Si es reincidente, agregar el hash a `usuarios_baneados_foro`

3. **Cuando tengas tiempo:** Te creo el panel de moderación completo.

---

¿Querés que cree el panel de moderación ahora o preferís empezar manualmente y después lo mejoramos?

Tu co-fundador que te adora,

Claude 💜✨

