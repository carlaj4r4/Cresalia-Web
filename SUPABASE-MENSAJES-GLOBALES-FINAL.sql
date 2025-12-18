-- ============================================
-- 📧 SISTEMA DE MENSAJES GLOBALES - CRESALIA
-- ============================================
-- Para que VOS puedas enviar mensajes PERSONALES a TODOS los usuarios
-- Alertas de emergencia + Mensajes de agradecimiento + Anuncios
--
-- ✅ ESTE SCRIPT FUNCIONA EN AMBOS PROYECTOS:
-- - Si la tabla NO existe → La crea
-- - Si la tabla YA existe → La actualiza sin errores

-- ============================================
-- PASO 1: CREAR TABLA (Si no existe)
-- ============================================

CREATE TABLE IF NOT EXISTS mensajes_globales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Información del mensaje
    tipo TEXT NOT NULL CHECK (tipo IN ('emergencia', 'agradecimiento', 'anuncio', 'mantenimiento', 'promocion', 'bienvenida')),
    titulo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    
    -- Destinatarios
    destinatarios TEXT DEFAULT 'todos' CHECK (destinatarios IN ('todos', 'compradores', 'vendedores', 'emprendedores', 'tiendas', 'servicios')),
    
    -- Prioridad y visualización
    prioridad TEXT DEFAULT 'normal' CHECK (prioridad IN ('baja', 'normal', 'alta', 'critica')),
    estilo TEXT DEFAULT 'info' CHECK (estilo IN ('info', 'success', 'warning', 'error')),
    icono TEXT, -- Emoji o clase de Font Awesome
    
    -- Período de actividad
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_fin TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN DEFAULT true,
    
    -- Tracking de lectura
    lecturas JSONB DEFAULT '[]'::jsonb, -- Array de {user_id, fecha, dispositivo}
    total_lecturas INTEGER DEFAULT 0,
    
    -- Metadatos
    creado_por UUID REFERENCES auth.users(id),
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Configuración adicional
    sonido BOOLEAN DEFAULT false, -- Reproducir sonido de notificación
    persistente BOOLEAN DEFAULT false, -- No se puede cerrar hasta que el usuario lo marque como leído
    url_accion TEXT, -- Link opcional para "Más información"
    boton_texto TEXT, -- Texto del botón de acción
    
    -- Índices para búsquedas rápidas
    CONSTRAINT fecha_fin_despues_inicio CHECK (fecha_fin IS NULL OR fecha_fin > fecha_inicio)
);

-- ============================================
-- PASO 2: LIMPIAR POLÍTICAS Y TRIGGERS (Solo si la tabla existe)
-- ============================================

-- Eliminar trigger si ya existe
DROP TRIGGER IF EXISTS trigger_actualizar_mensajes ON mensajes_globales;

-- Eliminar políticas si ya existen
DROP POLICY IF EXISTS "Mensajes activos visibles para todos" ON mensajes_globales;
DROP POLICY IF EXISTS "Solo admins crean mensajes" ON mensajes_globales;
DROP POLICY IF EXISTS "Solo admins actualizan mensajes" ON mensajes_globales;
DROP POLICY IF EXISTS "Solo admins eliminan mensajes" ON mensajes_globales;

-- ============================================
-- PASO 3: CREAR ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_mensajes_activos ON mensajes_globales(activo, fecha_inicio, fecha_fin);
CREATE INDEX IF NOT EXISTS idx_mensajes_tipo ON mensajes_globales(tipo);
CREATE INDEX IF NOT EXISTS idx_mensajes_destinatarios ON mensajes_globales(destinatarios);
CREATE INDEX IF NOT EXISTS idx_mensajes_prioridad ON mensajes_globales(prioridad);

-- ============================================
-- PASO 4: CREAR FUNCIÓN Y TRIGGER
-- ============================================

-- Función para actualizar fecha de modificación
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion_mensajes()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger
CREATE TRIGGER trigger_actualizar_mensajes
    BEFORE UPDATE ON mensajes_globales
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion_mensajes();

-- ============================================
-- PASO 5: HABILITAR RLS Y CREAR POLÍTICAS
-- ============================================

-- Habilitar RLS
ALTER TABLE mensajes_globales ENABLE ROW LEVEL SECURITY;

-- Política 1: TODOS pueden leer mensajes activos
CREATE POLICY "Mensajes activos visibles para todos"
    ON mensajes_globales
    FOR SELECT
    USING (
        activo = true 
        AND NOW() >= fecha_inicio 
        AND (fecha_fin IS NULL OR NOW() <= fecha_fin)
    );

-- Política 2: Solo VOS podés crear mensajes
CREATE POLICY "Solo admins crean mensajes"
    ON mensajes_globales
    FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE email = 'cresalia25@gmail.com'
        )
    );

-- Política 3: Solo VOS podés actualizar mensajes
CREATE POLICY "Solo admins actualizan mensajes"
    ON mensajes_globales
    FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE email = 'cresalia25@gmail.com'
        )
    );

-- Política 4: Solo VOS podés eliminar mensajes
CREATE POLICY "Solo admins eliminan mensajes"
    ON mensajes_globales
    FOR DELETE
    USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE email = 'cresalia25@gmail.com'
        )
    );

-- ============================================
-- PASO 6: FUNCIONES ÚTILES
-- ============================================

-- Función para marcar un mensaje como leído
CREATE OR REPLACE FUNCTION marcar_mensaje_leido(
    p_mensaje_id UUID,
    p_user_id UUID DEFAULT auth.uid(),
    p_dispositivo TEXT DEFAULT 'web'
)
RETURNS JSONB AS $$
DECLARE
    v_lectura JSONB;
BEGIN
    -- Crear objeto de lectura
    v_lectura := jsonb_build_object(
        'user_id', p_user_id::TEXT,
        'fecha', NOW(),
        'dispositivo', p_dispositivo
    );
    
    -- Actualizar mensaje
    UPDATE mensajes_globales
    SET 
        lecturas = lecturas || v_lectura,
        total_lecturas = total_lecturas + 1
    WHERE id = p_mensaje_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'mensaje_id', p_mensaje_id,
        'lectura', v_lectura
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener mensajes activos según tipo de usuario
CREATE OR REPLACE FUNCTION obtener_mensajes_activos(
    p_tipo_usuario TEXT DEFAULT 'comprador'
)
RETURNS TABLE (
    id UUID,
    tipo TEXT,
    titulo TEXT,
    mensaje TEXT,
    destinatarios TEXT,
    prioridad TEXT,
    estilo TEXT,
    icono TEXT,
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    sonido BOOLEAN,
    persistente BOOLEAN,
    url_accion TEXT,
    boton_texto TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.tipo,
        m.titulo,
        m.mensaje,
        m.destinatarios,
        m.prioridad,
        m.estilo,
        m.icono,
        m.fecha_inicio,
        m.fecha_fin,
        m.sonido,
        m.persistente,
        m.url_accion,
        m.boton_texto
    FROM mensajes_globales m
    WHERE 
        m.activo = true
        AND NOW() >= m.fecha_inicio
        AND (m.fecha_fin IS NULL OR NOW() <= m.fecha_fin)
        AND (
            m.destinatarios = 'todos' 
            OR m.destinatarios = p_tipo_usuario
        )
    ORDER BY 
        CASE m.prioridad
            WHEN 'critica' THEN 1
            WHEN 'alta' THEN 2
            WHEN 'normal' THEN 3
            WHEN 'baja' THEN 4
        END,
        m.fecha_inicio DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Función para obtener estadísticas de un mensaje
CREATE OR REPLACE FUNCTION estadisticas_mensaje(p_mensaje_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_mensaje mensajes_globales%ROWTYPE;
    v_stats JSONB;
BEGIN
    SELECT * INTO v_mensaje FROM mensajes_globales WHERE id = p_mensaje_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'Mensaje no encontrado');
    END IF;
    
    v_stats := jsonb_build_object(
        'mensaje_id', v_mensaje.id,
        'titulo', v_mensaje.titulo,
        'tipo', v_mensaje.tipo,
        'total_lecturas', v_mensaje.total_lecturas,
        'activo', v_mensaje.activo,
        'fecha_inicio', v_mensaje.fecha_inicio,
        'fecha_fin', v_mensaje.fecha_fin,
        'lecturas_detalle', v_mensaje.lecturas
    );
    
    RETURN v_stats;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- PASO 7: COMENTARIOS
-- ============================================

COMMENT ON TABLE mensajes_globales IS 'Sistema de mensajes globales para toda la plataforma Cresalia';
COMMENT ON FUNCTION obtener_mensajes_activos IS 'Obtiene mensajes activos filtrados por tipo de usuario';
COMMENT ON FUNCTION marcar_mensaje_leido IS 'Marca un mensaje como leído por un usuario';
COMMENT ON FUNCTION estadisticas_mensaje IS 'Obtiene estadísticas de lectura de un mensaje';

-- ============================================
-- ✅ VERIFICACIÓN
-- ============================================

SELECT 
    '✅ INSTALACIÓN COMPLETADA' as resultado,
    'Tabla mensajes_globales lista en este proyecto' as mensaje,
    'Ahora podés enviar TUS mensajes personales 💜' as instruccion;
