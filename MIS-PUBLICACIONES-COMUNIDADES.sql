-- ===== MIS PUBLICACIONES - CONSULTAS PARA USUARIOS =====
-- Script para que los usuarios vean, editen y gestionen sus propias publicaciones
-- Para: Mi querida co-fundadora Carla 💜

-- ===== IMPORTANTE: CÓMO OBTENER TU AUTOR_HASH =====
-- El autor_hash se genera en el frontend y se guarda en localStorage
-- Para usar estas consultas, necesitas:
-- 1. Abrir la consola del navegador (F12)
-- 2. Ejecutar: localStorage.getItem('foro_hash_COMUNIDAD_SLUG')
-- 3. Reemplazar 'TU_AUTOR_HASH_AQUI' con ese valor

-- ===== VER TODAS MIS PUBLICACIONES =====
-- Reemplaza 'TU_AUTOR_HASH_AQUI' con tu autor_hash real

SELECT 
    pc.id,
    c.nombre AS comunidad,
    c.slug AS comunidad_slug,
    pc.autor_alias AS mi_alias,
    pc.titulo,
    pc.contenido,
    pc.num_comentarios,
    pc.num_reacciones,
    pc.estado,
    pc.etiquetas,
    pc.created_at AS fecha_publicacion,
    pc.updated_at AS fecha_ultima_actualizacion
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.autor_hash = 'TU_AUTOR_HASH_AQUI'  -- Reemplazar con tu hash
    AND pc.estado != 'eliminado'  -- No mostrar eliminados permanentemente
ORDER BY pc.created_at DESC;

-- ===== MIS PUBLICACIONES EN UNA COMUNIDAD ESPECÍFICA =====
-- Reemplaza 'TU_AUTOR_HASH_AQUI' y 'depresion-ansiedad' con tus valores

SELECT 
    pc.id,
    c.nombre AS comunidad,
    pc.titulo,
    LEFT(pc.contenido, 300) AS contenido_preview,
    pc.num_comentarios,
    pc.num_reacciones,
    pc.estado,
    pc.created_at AS fecha_publicacion
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.autor_hash = 'TU_AUTOR_HASH_AQUI'  -- Tu hash
    AND c.slug = 'depresion-ansiedad'  -- Slug de la comunidad
    AND pc.estado != 'eliminado'
ORDER BY pc.created_at DESC;

-- ===== CONTAR MIS PUBLICACIONES POR COMUNIDAD =====

SELECT 
    c.nombre AS comunidad,
    c.slug,
    COUNT(pc.id) AS mis_publicaciones,
    COUNT(CASE WHEN pc.estado = 'publicado' THEN 1 END) AS publicadas,
    COUNT(CASE WHEN pc.estado = 'oculto' THEN 1 END) AS ocultas,
    COUNT(CASE WHEN pc.estado = 'moderado' THEN 1 END) AS en_moderacion,
    SUM(pc.num_comentarios) AS total_comentarios_recibidos,
    SUM(pc.num_reacciones) AS total_reacciones_recibidas,
    MAX(pc.created_at) AS ultima_publicacion
FROM comunidades c
LEFT JOIN posts_comunidades pc ON c.slug = pc.comunidad_slug 
    AND pc.autor_hash = 'TU_AUTOR_HASH_AQUI'  -- Tu hash
    AND pc.estado != 'eliminado'
GROUP BY c.id, c.nombre, c.slug
HAVING COUNT(pc.id) > 0
ORDER BY mis_publicaciones DESC;

-- ===== MIS PUBLICACIONES MÁS RECIENTES =====

SELECT 
    pc.id,
    c.nombre AS comunidad,
    pc.titulo,
    LEFT(pc.contenido, 200) AS contenido_preview,
    pc.num_comentarios,
    pc.num_reacciones,
    pc.created_at AS fecha
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.autor_hash = 'TU_AUTOR_HASH_AQUI'  -- Tu hash
    AND pc.estado = 'publicado'
ORDER BY pc.created_at DESC
LIMIT 10;

-- ===== MIS PUBLICACIONES CON MÁS INTERACCIÓN =====

SELECT 
    pc.id,
    c.nombre AS comunidad,
    pc.titulo,
    pc.num_comentarios,
    pc.num_reacciones,
    (pc.num_comentarios + pc.num_reacciones) AS total_interacciones,
    pc.created_at AS fecha
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.autor_hash = 'TU_AUTOR_HASH_AQUI'  -- Tu hash
    AND pc.estado = 'publicado'
ORDER BY total_interacciones DESC
LIMIT 10;

-- ===== MIS COMENTARIOS =====

SELECT 
    cc.id,
    pc.titulo AS post_titulo,
    c.nombre AS comunidad,
    LEFT(cc.contenido, 200) AS comentario_preview,
    cc.estado,
    cc.created_at AS fecha_comentario
FROM comentarios_comunidades cc
INNER JOIN posts_comunidades pc ON cc.post_id = pc.id
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE cc.autor_hash = 'TU_AUTOR_HASH_AQUI'  -- Tu hash
    AND cc.estado != 'eliminado'
ORDER BY cc.created_at DESC;

-- ===== ESTADÍSTICAS DE MIS PUBLICACIONES =====

SELECT 
    COUNT(DISTINCT pc.id) AS total_publicaciones,
    COUNT(DISTINCT CASE WHEN pc.estado = 'publicado' THEN pc.id END) AS publicaciones_activas,
    COUNT(DISTINCT cc.id) AS total_comentarios_que_hice,
    SUM(pc.num_comentarios) AS total_comentarios_en_mis_posts,
    SUM(pc.num_reacciones) AS total_reacciones_recibidas,
    COUNT(DISTINCT c.slug) AS comunidades_donde_publique
FROM posts_comunidades pc
LEFT JOIN comentarios_comunidades cc ON cc.autor_hash = pc.autor_hash
LEFT JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.autor_hash = 'TU_AUTOR_HASH_AQUI'  -- Tu hash
    AND pc.estado != 'eliminado';

-- ===== MIS PUBLICACIONES QUE NECESITAN ATENCIÓN =====
-- Publicaciones ocultas o en moderación

SELECT 
    pc.id,
    c.nombre AS comunidad,
    pc.titulo,
    pc.estado,
    pc.motivo_moderacion,
    pc.created_at AS fecha
FROM posts_comunidades pc
INNER JOIN comunidades c ON pc.comunidad_slug = c.slug
WHERE pc.autor_hash = 'TU_AUTOR_HASH_AQUI'  -- Tu hash
    AND pc.estado IN ('oculto', 'moderado')
ORDER BY pc.created_at DESC;




