# Estructura de Reacciones en Supabase

## Estado Actual

Actualmente, las reacciones se guardan como un objeto JSON en el campo `reacciones` de la tabla `posts_comunidades`:

```json
{
  "apoyo": 5,
  "entristece": 2,
  "me_identifico": 3,
  "gracias": 1
}
```

**Esto funciona perfectamente** y no requiere cambios en Supabase. El sistema es simple y eficiente.

## Opción Mejorada (Opcional)

Si en el futuro quieres tracking individual de reacciones por usuario (para saber quién reaccionó y evitar reacciones duplicadas), podrías crear una tabla separada:

```sql
CREATE TABLE IF NOT EXISTS reacciones_posts (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT REFERENCES posts_comunidades(id) ON DELETE CASCADE,
    usuario_hash VARCHAR(255) NOT NULL,
    tipo_reaccion VARCHAR(50) NOT NULL, -- 'apoyo', 'entristece', 'me_identifico', 'gracias'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, usuario_hash, tipo_reaccion) -- Evitar reacciones duplicadas
);

CREATE INDEX idx_reacciones_post ON reacciones_posts(post_id);
CREATE INDEX idx_reacciones_usuario ON reacciones_posts(usuario_hash);
```

**Pero esto NO es necesario ahora.** El sistema actual funciona bien y es más simple.

## Recomendación

**Mantener el sistema actual** (JSON en `posts_comunidades.reacciones`) porque:
- ✅ Funciona perfectamente
- ✅ Es más simple
- ✅ No requiere cambios en Supabase
- ✅ Es más rápido (menos queries)
- ✅ Es suficiente para el propósito actual

Solo considerar la tabla separada si en el futuro necesitas:
- Saber quién reaccionó específicamente
- Evitar que un usuario reaccione múltiples veces
- Mostrar "Ya reaccionaste" al usuario

