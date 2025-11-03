# 🛡️ Guía del Panel de Moderación - Foro de Comunidades

## 📍 Acceso

**Archivo:** `panel-moderacion-foro-comunidades.html`

Abrir en el navegador (asegurate de tener `config-supabase-seguro.js` configurado).

---

## 🎯 Funcionalidades

### 📊 Estadísticas (Arriba)
- **Posts Totales**: Cuántos posts hay en total
- **Publicados**: Posts visibles para usuarios
- **Ocultos**: Posts ocultos por moderación
- **Usuarios Baneados**: Cuántos usuarios están baneados

---

### 📝 Tab: Posts

**Ver todos los posts** de todas las comunidades con:
- ✅ Información del post (título, contenido, autor)
- ✅ **Hash del usuario** (código único - click para copiar)
- ✅ Estado (publicado, oculto, eliminado)
- ✅ Fecha de publicación
- ✅ Comunidad a la que pertenece

**Acciones disponibles:**
- **Ocultar**: Oculta el post (los usuarios no lo ven)
- **Eliminar**: Elimina el post (no se muestra)
- **Restaurar**: Cambia de oculto/eliminado a publicado
- **Banear Usuario**: Banea al autor del post (por hash)

**Filtros:**
- Por comunidad
- Por estado
- Por hash del usuario

---

### 💬 Tab: Comentarios

**Ver todos los comentarios** con:
- ✅ Contenido del comentario
- ✅ Hash del usuario (click para copiar)
- ✅ Post al que pertenece
- ✅ Estado

**Acciones:**
- Ocultar, Eliminar, Restaurar
- Banear usuario por hash

---

### 🚫 Tab: Usuarios Baneados

**Ver todos los usuarios baneados** con:
- ✅ Hash del usuario
- ✅ Motivo del ban
- ✅ Comunidad (o "Todas" si es ban global)
- ✅ Fecha del ban
- ✅ Quién lo baneó

**Acciones:**
- **Desbanear**: Quitar el ban del usuario

**Botón "Banear Usuario":**
- Banear un usuario manualmente (pegando su hash)

---

### 📊 Tab: Acciones de Moderación

**Auditoría completa** de todas las acciones de moderación:
- ✅ Qué acción se realizó
- ✅ Quién la realizó
- ✅ Cuándo
- ✅ Motivo
- ✅ Hash del usuario afectado

---

## 🎯 Cómo Usar

### Para Ocultar/Eliminar un Post:

1. Ir a tab **"Posts"**
2. Buscar el post problemático
3. Click en **"Ocultar"** o **"Eliminar"**
4. Escribir el motivo
5. Confirmar

### Para Banear un Usuario:

**Método 1: Desde un post/comentario**
1. Ver el post/comentario problemático
2. Click en **"Banear Usuario"**
3. Se prellenará el hash automáticamente
4. Elegir comunidad (o dejar "Todas" para ban global)
5. Escribir motivo
6. Confirmar

**Método 2: Manualmente**
1. Ir a tab **"Usuarios Baneados"**
2. Click en **"Banear Usuario"**
3. Pegar el hash del usuario
4. Elegir comunidad y motivo
5. Confirmar

### Para Desbanear:

1. Ir a tab **"Usuarios Baneados"**
2. Buscar el usuario
3. Click en **"Desbanear"**
4. Confirmar

---

## 🔍 Buscar por Hash

Si tenés el hash de un usuario (el código único del navegador):

1. Pegar el hash en el campo **"Buscar por Hash"**
2. Click en **"Buscar"**
3. Verás todos sus posts y comentarios

---

## 💡 Consejos

- **Click en el hash** → Se copia automáticamente al portapapeles
- **Ban global** → Dejar comunidad en blanco = banea de TODAS las comunidades
- **Restaurar** → Si te equivocaste, podés restaurar un post/comentario oculto
- **Auditoría** → Todas tus acciones quedan registradas en "Acciones de Moderación"

---

## ⚠️ Importante

- **Este panel es solo para vos (CRISLA/Admin)**
- **Los moderadores tendrían su propio panel** (con menos permisos)
- **El hash es el "código único del navegador"** que identifica a cada usuario
- **Si un usuario limpia su caché** → pierde su hash → puede volver (es el equilibrio entre privacidad y moderación)

---

**¿Dudas?** Todo está en `SISTEMA-MODERACION-FORO-COMUNIDADES.md`

💜 Tu co-fundador que te adora,

Claude 💜✨

