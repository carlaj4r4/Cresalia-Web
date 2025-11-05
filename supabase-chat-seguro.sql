-- ===== CRESALIA CHAT SEGURO =====
-- Sistema de chat seguro entre usuarios con moderación automática y protección avanzada
-- Co-fundadores: Crisla & Claude

-- ===== 1. CONVERSACIONES ENTRE USUARIOS =====
CREATE TABLE IF NOT EXISTS conversaciones_chat_seguro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Usuarios de la conversación
    usuario1_id TEXT NOT NULL, -- Hash o ID del usuario
    usuario1_nombre TEXT NOT NULL,
    usuario1_verificado BOOLEAN DEFAULT false,
    usuario1_edad INTEGER, -- Para proteger menores
    
    usuario2_id TEXT NOT NULL,
    usuario2_nombre TEXT NOT NULL,
    usuario2_verificado BOOLEAN DEFAULT false,
    usuario2_edad INTEGER,
    
    -- Estado y configuración
    estado TEXT DEFAULT 'activa' CHECK (estado IN ('activa', 'archivada', 'bloqueada', 'reportada')),
    tipo_conversacion TEXT DEFAULT 'individual' CHECK (tipo_conversacion IN ('individual', 'grupo')),
    
    -- Privacidad
    usuario1_bloqueo BOOLEAN DEFAULT false,
    usuario2_bloqueo BOOLEAN DEFAULT false,
    usuario1_archivado BOOLEAN DEFAULT false,
    usuario2_archivado BOOLEAN DEFAULT false,
    
    -- Fechas
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_ultimo_mensaje TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_cierre TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    total_mensajes INTEGER DEFAULT 0,
    mensajes_bloqueados INTEGER DEFAULT 0, -- Mensajes bloqueados por moderación
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 2. MENSAJES =====
CREATE TABLE IF NOT EXISTS mensajes_chat_seguro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversacion_id UUID REFERENCES conversaciones_chat_seguro(id) ON DELETE CASCADE,
    
    -- Remitente
    remitente_id TEXT NOT NULL,
    remitente_nombre TEXT NOT NULL,
    remitente_verificado BOOLEAN DEFAULT false,
    
    -- Contenido
    mensaje TEXT NOT NULL,
    mensaje_original TEXT, -- Mensaje antes de ser filtrado
    tipo_mensaje TEXT DEFAULT 'texto' CHECK (tipo_mensaje IN ('texto', 'imagen', 'archivo', 'sistema', 'emoji')),
    archivo_url TEXT,
    
    -- Moderación
    moderado BOOLEAN DEFAULT false,
    moderado_por TEXT, -- 'automatico', 'humano', o ID del moderador
    nivel_riesgo TEXT CHECK (nivel_riesgo IN ('bajo', 'medio', 'alto', 'critico')),
    razon_bloqueo TEXT,
    contenido_editado BOOLEAN DEFAULT false, -- Si fue editado automáticamente
    
    -- Estado
    leido BOOLEAN DEFAULT false,
    eliminado BOOLEAN DEFAULT false,
    eliminado_por TEXT, -- 'usuario', 'moderador', 'sistema'
    
    -- Características especiales
    mensaje_temporal BOOLEAN DEFAULT false, -- Se auto-elimina después de X tiempo
    tiempo_vida_minutos INTEGER, -- Para mensajes temporales
    solo_una_vez BOOLEAN DEFAULT false, -- Solo se puede leer una vez
    
    -- Fechas
    fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_lectura TIMESTAMP WITH TIME ZONE,
    fecha_eliminacion TIMESTAMP WITH TIME ZONE,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 3. GRUPOS DE CHAT =====
CREATE TABLE IF NOT EXISTS grupos_chat_seguro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información del grupo
    nombre TEXT NOT NULL,
    descripcion TEXT,
    imagen_url TEXT,
    tema TEXT, -- Tema del grupo (ej: 'vendedores', 'compradores', 'comunidad_gamers')
    
    -- Configuración
    tipo_grupo TEXT DEFAULT 'publico' CHECK (tipo_grupo IN ('publico', 'privado', 'invitacion')),
    max_miembros INTEGER DEFAULT 100,
    edad_minima INTEGER DEFAULT 13, -- Edad mínima para unirse
    
    -- Moderación
    moderadores TEXT[], -- Array de IDs de moderadores
    reglas TEXT[], -- Reglas del grupo
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    verificado BOOLEAN DEFAULT false, -- Grupos verificados por Cresalia
    
    -- Estadísticas
    total_miembros INTEGER DEFAULT 0,
    total_mensajes INTEGER DEFAULT 0,
    
    -- Fechas
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    creado_por TEXT NOT NULL,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 4. MIEMBROS DE GRUPOS =====
CREATE TABLE IF NOT EXISTS miembros_grupos_chat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grupo_id UUID REFERENCES grupos_chat_seguro(id) ON DELETE CASCADE,
    
    usuario_id TEXT NOT NULL,
    usuario_nombre TEXT NOT NULL,
    rol TEXT DEFAULT 'miembro' CHECK (rol IN ('miembro', 'moderador', 'administrador')),
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    silenciado BOOLEAN DEFAULT false,
    fecha_silenciado TIMESTAMP WITH TIME ZONE,
    
    -- Fechas
    fecha_union TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(grupo_id, usuario_id)
);

-- ===== 5. REPORTES DE CONTENIDO =====
CREATE TABLE IF NOT EXISTS reportes_chat_seguro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Qué se reporta
    tipo_reporte TEXT NOT NULL CHECK (tipo_reporte IN ('acoso', 'contenido_inapropiado', 'spam', 'phishing', 'menor_peligro', 'otro')),
    mensaje_id UUID REFERENCES mensajes_chat_seguro(id) ON DELETE SET NULL,
    conversacion_id UUID REFERENCES conversaciones_chat_seguro(id) ON DELETE SET NULL,
    grupo_id UUID REFERENCES grupos_chat_seguro(id) ON DELETE SET NULL,
    
    -- Quién reporta
    reportado_por TEXT NOT NULL,
    reportado_por_nombre TEXT NOT NULL,
    
    -- A quién se reporta
    reportado_usuario_id TEXT,
    reportado_usuario_nombre TEXT,
    
    -- Detalles
    descripcion TEXT NOT NULL,
    evidencia TEXT[], -- URLs de screenshots o evidencia
    
    -- Estado
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'revisando', 'resuelto', 'rechazado', 'escalado')),
    revisado_por TEXT, -- ID del moderador
    accion_tomada TEXT, -- Qué se hizo (ej: 'bloqueado_usuario', 'eliminado_mensaje', 'advertencia')
    
    -- Fechas
    fecha_reporte TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_revision TIMESTAMP WITH TIME ZONE,
    fecha_resolucion TIMESTAMP WITH TIME ZONE,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 6. BLOQUEOS DE USUARIOS =====
CREATE TABLE IF NOT EXISTS bloqueos_chat_seguro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Quién bloquea a quién
    bloqueador_id TEXT NOT NULL,
    bloqueado_id TEXT NOT NULL,
    
    -- Razón (opcional)
    razon TEXT,
    tipo_bloqueo TEXT DEFAULT 'usuario' CHECK (tipo_bloqueo IN ('usuario', 'sistema', 'moderador')),
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    
    -- Fechas
    fecha_bloqueo TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_desbloqueo TIMESTAMP WITH TIME ZONE,
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(bloqueador_id, bloqueado_id)
);

-- ===== 7. VERIFICACIONES DE USUARIOS =====
CREATE TABLE IF NOT EXISTS verificaciones_chat_seguro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    usuario_id TEXT NOT NULL UNIQUE,
    usuario_hash TEXT NOT NULL, -- Hash único del usuario
    
    -- Información de verificación
    nombre_verificado TEXT,
    edad_verificada INTEGER,
    fecha_nacimiento DATE,
    tipo_verificacion TEXT CHECK (tipo_verificacion IN ('email', 'telefono', 'documento', 'identidad_completa')),
    
    -- Estado
    verificado BOOLEAN DEFAULT false,
    nivel_verificacion TEXT DEFAULT 'ninguno' CHECK (nivel_verificacion IN ('ninguno', 'basico', 'intermedio', 'completo')),
    
    -- Para menores
    es_menor BOOLEAN DEFAULT false,
    tutor_contacto TEXT, -- Email del tutor si es menor
    
    -- Fechas
    fecha_verificacion TIMESTAMP WITH TIME ZONE,
    fecha_expiracion TIMESTAMP WITH TIME ZONE, -- Si la verificación expira
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== 8. LOGS DE MODERACIÓN AUTOMÁTICA =====
CREATE TABLE IF NOT EXISTS moderacion_automatica_chat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Mensaje moderado
    mensaje_id UUID REFERENCES mensajes_chat_seguro(id) ON DELETE SET NULL,
    
    -- Detección
    tipo_deteccion TEXT NOT NULL CHECK (tipo_deteccion IN ('palabra_prohibida', 'acoso', 'spam', 'phishing', 'contenido_sexual', 'bullying')),
    confianza DECIMAL(3,2) DEFAULT 0.0, -- 0.0 a 1.0
    palabras_detectadas TEXT[], -- Palabras que activaron el filtro
    
    -- Acción tomada
    accion TEXT NOT NULL CHECK (accion IN ('advertencia', 'editar', 'bloquear', 'eliminar', 'reportar_humano')),
    mensaje_editado TEXT, -- Si se editó, el nuevo mensaje
    
    -- Fechas
    fecha_deteccion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    creado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== ÍNDICES =====
CREATE INDEX IF NOT EXISTS idx_conversaciones_usuario1 ON conversaciones_chat_seguro(usuario1_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_usuario2 ON conversaciones_chat_seguro(usuario2_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_estado ON conversaciones_chat_seguro(estado);
CREATE INDEX IF NOT EXISTS idx_conversaciones_fecha ON conversaciones_chat_seguro(fecha_ultimo_mensaje DESC);

CREATE INDEX IF NOT EXISTS idx_mensajes_conversacion ON mensajes_chat_seguro(conversacion_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_remitente ON mensajes_chat_seguro(remitente_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_fecha ON mensajes_chat_seguro(fecha_envio DESC);
CREATE INDEX IF NOT EXISTS idx_mensajes_moderado ON mensajes_chat_seguro(moderado);
CREATE INDEX IF NOT EXISTS idx_mensajes_riesgo ON mensajes_chat_seguro(nivel_riesgo);

CREATE INDEX IF NOT EXISTS idx_grupos_tema ON grupos_chat_seguro(tema);
CREATE INDEX IF NOT EXISTS idx_grupos_activo ON grupos_chat_seguro(activo);
CREATE INDEX IF NOT EXISTS idx_grupos_verificado ON grupos_chat_seguro(verificado);

CREATE INDEX IF NOT EXISTS idx_miembros_grupo ON miembros_grupos_chat(grupo_id);
CREATE INDEX IF NOT EXISTS idx_miembros_usuario ON miembros_grupos_chat(usuario_id);

CREATE INDEX IF NOT EXISTS idx_reportes_estado ON reportes_chat_seguro(estado);
CREATE INDEX IF NOT EXISTS idx_reportes_tipo ON reportes_chat_seguro(tipo_reporte);
CREATE INDEX IF NOT EXISTS idx_reportes_fecha ON reportes_chat_seguro(fecha_reporte DESC);

CREATE INDEX IF NOT EXISTS idx_bloqueos_bloqueador ON bloqueos_chat_seguro(bloqueador_id);
CREATE INDEX IF NOT EXISTS idx_bloqueos_bloqueado ON bloqueos_chat_seguro(bloqueado_id);
CREATE INDEX IF NOT EXISTS idx_bloqueos_activo ON bloqueos_chat_seguro(activo);

CREATE INDEX IF NOT EXISTS idx_verificaciones_usuario ON verificaciones_chat_seguro(usuario_id);
CREATE INDEX IF NOT EXISTS idx_verificaciones_verificado ON verificaciones_chat_seguro(verificado);

CREATE INDEX IF NOT EXISTS idx_moderacion_mensaje ON moderacion_automatica_chat(mensaje_id);
CREATE INDEX IF NOT EXISTS idx_moderacion_tipo ON moderacion_automatica_chat(tipo_deteccion);
CREATE INDEX IF NOT EXISTS idx_moderacion_fecha ON moderacion_automatica_chat(fecha_deteccion DESC);

-- ===== ROW LEVEL SECURITY =====
ALTER TABLE conversaciones_chat_seguro ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes_chat_seguro ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos_chat_seguro ENABLE ROW LEVEL SECURITY;
ALTER TABLE miembros_grupos_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes_chat_seguro ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloqueos_chat_seguro ENABLE ROW LEVEL SECURITY;
ALTER TABLE verificaciones_chat_seguro ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderacion_automatica_chat ENABLE ROW LEVEL SECURITY;

-- ===== POLÍTICAS RLS =====

-- Conversaciones: Usuarios solo ven sus propias conversaciones
DROP POLICY IF EXISTS "conversaciones_own_read" ON conversaciones_chat_seguro;
CREATE POLICY "conversaciones_own_read" ON conversaciones_chat_seguro
    FOR SELECT USING (
        usuario1_id = current_setting('app.current_user_hash', true) OR
        usuario2_id = current_setting('app.current_user_hash', true)
    );

DROP POLICY IF EXISTS "conversaciones_own_create" ON conversaciones_chat_seguro;
CREATE POLICY "conversaciones_own_create" ON conversaciones_chat_seguro
    FOR INSERT WITH CHECK (
        usuario1_id = current_setting('app.current_user_hash', true) OR
        usuario2_id = current_setting('app.current_user_hash', true)
    );

-- Mensajes: Solo en conversaciones propias
DROP POLICY IF EXISTS "mensajes_own_read" ON mensajes_chat_seguro;
CREATE POLICY "mensajes_own_read" ON mensajes_chat_seguro
    FOR SELECT USING (
        conversacion_id IN (
            SELECT id FROM conversaciones_chat_seguro
            WHERE usuario1_id = current_setting('app.current_user_hash', true) OR
                  usuario2_id = current_setting('app.current_user_hash', true)
        )
    );

DROP POLICY IF EXISTS "mensajes_own_create" ON mensajes_chat_seguro;
CREATE POLICY "mensajes_own_create" ON mensajes_chat_seguro
    FOR INSERT WITH CHECK (
        remitente_id = current_setting('app.current_user_hash', true) AND
        conversacion_id IN (
            SELECT id FROM conversaciones_chat_seguro
            WHERE usuario1_id = current_setting('app.current_user_hash', true) OR
                  usuario2_id = current_setting('app.current_user_hash', true)
        )
    );

-- Grupos: Públicos para todos, privados solo para miembros
DROP POLICY IF EXISTS "grupos_public_read" ON grupos_chat_seguro;
CREATE POLICY "grupos_public_read" ON grupos_chat_seguro
    FOR SELECT USING (tipo_grupo = 'publico' OR activo = true);

DROP POLICY IF EXISTS "grupos_public_create" ON grupos_chat_seguro;
CREATE POLICY "grupos_public_create" ON grupos_chat_seguro
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "grupos_public_update" ON grupos_chat_seguro;
CREATE POLICY "grupos_public_update" ON grupos_chat_seguro
    FOR UPDATE USING (creado_por = current_setting('app.current_user_hash', true) OR 
                      current_setting('app.current_user_hash', true) = ANY(moderadores));

-- Miembros de grupos: Cualquiera puede unirse a grupos públicos
DROP POLICY IF EXISTS "miembros_grupos_read" ON miembros_grupos_chat;
CREATE POLICY "miembros_grupos_read" ON miembros_grupos_chat
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "miembros_grupos_create" ON miembros_grupos_chat;
CREATE POLICY "miembros_grupos_create" ON miembros_grupos_chat
    FOR INSERT WITH CHECK (true);

-- Reportes: Cualquiera puede crear reportes
DROP POLICY IF EXISTS "reportes_create" ON reportes_chat_seguro;
CREATE POLICY "reportes_create" ON reportes_chat_seguro
    FOR INSERT WITH CHECK (true);

-- Bloqueos: Solo ver tus propios bloqueos
DROP POLICY IF EXISTS "bloqueos_own_read" ON bloqueos_chat_seguro;
CREATE POLICY "bloqueos_own_read" ON bloqueos_chat_seguro
    FOR SELECT USING (bloqueador_id = current_setting('app.current_user_hash', true));

-- ===== TRIGGERS =====

-- Actualizar fecha_ultimo_mensaje en conversación
CREATE OR REPLACE FUNCTION actualizar_ultimo_mensaje_chat_seguro()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversaciones_chat_seguro
    SET fecha_ultimo_mensaje = NEW.fecha_envio,
        total_mensajes = total_mensajes + 1
    WHERE id = NEW.conversacion_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_ultimo_mensaje_chat_seguro
    AFTER INSERT ON mensajes_chat_seguro
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_ultimo_mensaje_chat_seguro();

-- Actualizar contador de mensajes bloqueados
CREATE OR REPLACE FUNCTION actualizar_mensajes_bloqueados()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.moderado = true AND OLD.moderado = false THEN
        UPDATE conversaciones_chat_seguro
        SET mensajes_bloqueados = mensajes_bloqueados + 1
        WHERE id = NEW.conversacion_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_mensajes_bloqueados
    AFTER UPDATE ON mensajes_chat_seguro
    FOR EACH ROW
    WHEN (OLD.moderado IS DISTINCT FROM NEW.moderado)
    EXECUTE FUNCTION actualizar_mensajes_bloqueados();

-- Actualizar contador de miembros en grupos
CREATE OR REPLACE FUNCTION actualizar_miembros_grupo()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE grupos_chat_seguro
        SET total_miembros = total_miembros + 1
        WHERE id = NEW.grupo_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE grupos_chat_seguro
        SET total_miembros = GREATEST(0, total_miembros - 1)
        WHERE id = OLD.grupo_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_miembros_grupo
    AFTER INSERT OR DELETE ON miembros_grupos_chat
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_miembros_grupo();

-- ===== COMENTARIOS =====
COMMENT ON TABLE conversaciones_chat_seguro IS 'Conversaciones entre usuarios en Cresalia Chat Seguro';
COMMENT ON TABLE mensajes_chat_seguro IS 'Mensajes individuales con moderación automática';
COMMENT ON TABLE grupos_chat_seguro IS 'Grupos de chat temáticos y seguros';
COMMENT ON TABLE miembros_grupos_chat IS 'Miembros de grupos de chat';
COMMENT ON TABLE reportes_chat_seguro IS 'Reportes de contenido inapropiado o acoso';
COMMENT ON TABLE bloqueos_chat_seguro IS 'Usuarios bloqueados por otros usuarios';
COMMENT ON TABLE verificaciones_chat_seguro IS 'Verificaciones de identidad de usuarios';
COMMENT ON TABLE moderacion_automatica_chat IS 'Logs de moderación automática de mensajes';

