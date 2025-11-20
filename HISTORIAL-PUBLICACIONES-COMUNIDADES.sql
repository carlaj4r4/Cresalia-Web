-- ===== HISTORIAL DE PUBLICACIONES EN COMUNIDADES - CRESALIA =====
-- Script para consultar todas las publicaciones de las comunidades
-- Para: Mi querida co-fundadora Carla 💜

-- ===== CONSULTA COMPLETA DE PUBLICACIONES =====
-- Muestra todas las publicaciones con información relevante

SELECT 
    pc.id,
    c.nombre AS comunidad,
    c.slug AS comunidad_slug,
    pc.autor_alias AS autor_alias,
    pc.titulo,
    LEFT(pc.contenido, 200) AS contenido_preview, -- Primeros 200 caracteres
    pc.num_comentarios,
    pc.num_reacciones,
    pc.estado,
    pc.motivo_moderacion,
    pc.etiquetas,
    pc.created_at AS fecha_publicacion,
    pc.updated_at AS fecha_actualizacion,
    pc.deleted_at AS fecha_eliminacion
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.estado != 'eliminado' -- Solo mostrar posts que no están eliminados permanentemente
ORDER BY pc.created_at DESC;

-- ===== CONSULTA POR COMUNIDAD ESPECÍFICA =====
-- Reemplaza 'depresion-ansiedad' con el slug de la comunidad que quieras

SELECT 
    pc.id,
    c.nombre AS comunidad,
    pc.autor_alias AS autor_alias,
    pc.titulo,
    LEFT(pc.contenido, 300) AS contenido_preview,
    pc.num_comentarios,
    pc.num_reacciones,
    pc.estado,
    pc.created_at AS fecha_publicacion
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE c.slug = 'depresion-ansiedad' -- Cambiar por el slug deseado
ORDER BY pc.created_at DESC;

-- ===== ESTADÍSTICAS GENERALES POR COMUNIDAD =====
-- Muestra cuántas publicaciones hay en cada comunidad

SELECT 
    c.nombre AS comunidad,
    c.slug,
    COUNT(pc.id) AS total_publicaciones,
    COUNT(CASE WHEN pc.estado = 'publicado' THEN 1 END) AS publicaciones_activas,
    COUNT(CASE WHEN pc.estado = 'oculto' THEN 1 END) AS publicaciones_ocultas,
    COUNT(CASE WHEN pc.estado = 'moderado' THEN 1 END) AS publicaciones_moderadas,
    SUM(pc.num_comentarios) AS total_comentarios,
    SUM(pc.num_reacciones) AS total_reacciones,
    MAX(pc.created_at) AS ultima_publicacion
FROM comunidades c
LEFT JOIN posts_comunidades pc ON c.slug = pc.comunidad_slug
GROUP BY c.id, c.nombre, c.slug
ORDER BY total_publicaciones DESC;

-- ===== PUBLICACIONES MÁS RECIENTES (ÚLTIMOS 30 DÍAS) =====

SELECT 
    pc.id,
    c.nombre AS comunidad,
    pc.autor_alias AS autor_alias,
    pc.titulo,
    LEFT(pc.contenido, 200) AS contenido_preview,
    pc.num_comentarios,
    pc.num_reacciones,
    pc.created_at AS fecha_publicacion
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.created_at >= NOW() - INTERVAL '30 days'
    AND pc.estado = 'publicado'
ORDER BY pc.created_at DESC;

-- ===== PUBLICACIONES CON MÁS COMENTARIOS =====

SELECT 
    pc.id,
    c.nombre AS comunidad,
    pc.autor_alias AS autor_alias,
    pc.titulo,
    LEFT(pc.contenido, 200) AS contenido_preview,
    pc.num_comentarios,
    pc.num_reacciones,
    pc.created_at AS fecha_publicacion
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.estado = 'publicado'
ORDER BY pc.num_comentarios DESC
LIMIT 20;

-- ===== PUBLICACIONES CON MÁS REACCIONES =====

SELECT 
    pc.id,
    c.nombre AS comunidad,
    pc.autor_alias AS autor_alias,
    pc.titulo,
    LEFT(pc.contenido, 200) AS contenido_preview,
    pc.num_comentarios,
    pc.num_reacciones,
    pc.created_at AS fecha_publicacion
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.estado = 'publicado'
ORDER BY pc.num_reacciones DESC
LIMIT 20;

-- ===== PUBLICACIONES QUE REQUIEREN MODERACIÓN =====

SELECT 
    pc.id,
    c.nombre AS comunidad,
    pc.autor_alias AS autor_alias,
    pc.titulo,
    LEFT(pc.contenido, 300) AS contenido_preview,
    pc.estado,
    pc.motivo_moderacion,
    pc.created_at AS fecha_publicacion
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.estado IN ('oculto', 'moderado')
ORDER BY pc.created_at DESC;

-- ===== COMENTARIOS DE UNA PUBLICACIÓN ESPECÍFICA =====
-- Ejemplo: Ver comentarios de una publicación específica
-- Reemplaza el UUID de ejemplo con el ID real de la publicación

-- EJEMPLO (descomentar y reemplazar el UUID):
-- SELECT 
--     cc.id,
--     cc.autor_alias AS autor_alias,
--     cc.contenido,
--     cc.estado,
--     cc.comentario_padre_id,
--     cc.created_at AS fecha_comentario
-- FROM comentarios_comunidades cc
-- WHERE cc.post_id = '00000000-0000-0000-0000-000000000000'::uuid  -- Reemplazar con UUID real
--     AND cc.estado = 'publicado'
-- ORDER BY cc.created_at ASC;

-- ===== ACTIVIDAD RECIENTE (PUBLICACIONES + COMENTARIOS) =====

SELECT 
    'publicacion' AS tipo,
    pc.id,
    c.nombre AS comunidad,
    pc.autor_alias AS autor,
    pc.titulo AS contenido_titulo,
    LEFT(pc.contenido, 150) AS contenido_preview,
    pc.created_at AS fecha
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.estado = 'publicado'
    AND pc.created_at >= NOW() - INTERVAL '7 days'

UNION ALL

SELECT 
    'comentario' AS tipo,
    cc.id,
    c.nombre AS comunidad,
    cc.autor_alias AS autor,
    'Comentario en: ' || pc.titulo AS contenido_titulo,
    LEFT(cc.contenido, 150) AS contenido_preview,
    cc.created_at AS fecha
FROM comentarios_comunidades cc
INNER JOIN posts_comunidades pc ON cc.post_id = pc.id
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE cc.estado = 'publicado'
    AND cc.created_at >= NOW() - INTERVAL '7 days'

ORDER BY fecha DESC;

-- ===== RESUMEN GENERAL =====
-- Estadísticas generales de todas las comunidades

SELECT 
    COUNT(DISTINCT c.id) AS total_comunidades,
    COUNT(DISTINCT pc.id) AS total_publicaciones,
    COUNT(DISTINCT CASE WHEN pc.estado = 'publicado' THEN pc.id END) AS publicaciones_activas,
    COUNT(DISTINCT cc.id) AS total_comentarios,
    COUNT(DISTINCT rc.id) AS total_reacciones,
    COUNT(DISTINCT pc.autor_hash) AS total_autores_unicos
FROM comunidades c
LEFT JOIN posts_comunidades pc ON c.slug = pc.comunidad_slug
LEFT JOIN comentarios_comunidades cc ON pc.id = cc.post_id
LEFT JOIN reacciones_comunidades rc ON pc.id = rc.post_id OR cc.id = rc.comentario_id;

