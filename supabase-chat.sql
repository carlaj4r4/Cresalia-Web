-- ===== SISTEMA DE CHAT EN VIVO - CRESALIA =====
-- Chat en tiempo real entre usuarios y Crisla

CREATE TABLE IF NOT EXISTS conversaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('comprador', 'vendedor')),
    
    -- Info del usuario
    nombre_usuario TEXT NOT NULL,
    email_usuario TEXT NOT NULL,
    
    -- Estado de la conversación
    estado TEXT DEFAULT 'activa' CHECK (estado IN ('activa', 'cerrada', 'archivada')),
    leida_por_soporte BOOLEAN DEFAULT false,
    prioridad TEXT DEFAULT 'normal' CHECK (prioridad IN ('baja', 'normal', 'alta', 'urgente')),
    
    -- Fechas
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_ultimo_mensaje TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_cierre TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    atendido_por TEXT DEFAULT 'Pendiente',
    etiquetas TEXT[]
);

CREATE TABLE IF NOT EXISTS mensajes_chat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversacion_id UUID REFERENCES conversaciones(id) ON DELETE CASCADE,
    
    -- Quién envió el mensaje
    remitente TEXT NOT NULL CHECK (remitente IN ('usuario', 'soporte')),
    autor_id UUID,
    autor_nombre TEXT NOT NULL,
    
    -- Contenido
    mensaje TEXT NOT NULL,
    tipo_mensaje TEXT DEFAULT 'texto' CHECK (tipo_mensaje IN ('texto', 'imagen', 'archivo', 'sistema')),
    archivo_url TEXT,
    
    -- Estado
    leido BOOLEAN DEFAULT false,
    fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para conversaciones
CREATE INDEX IF NOT EXISTS idx_conversaciones_user_id ON conversaciones(user_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_estado ON conversaciones(estado);
CREATE INDEX IF NOT EXISTS idx_conversaciones_no_leidas ON conversaciones(leida_por_soporte) WHERE leida_por_soporte = false;
CREATE INDEX IF NOT EXISTS idx_conversaciones_fecha ON conversaciones(fecha_ultimo_mensaje);

-- Índices para mensajes
CREATE INDEX IF NOT EXISTS idx_mensajes_conversacion ON mensajes_chat(conversacion_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_fecha ON mensajes_chat(fecha_envio);
CREATE INDEX IF NOT EXISTS idx_mensajes_no_leidos ON mensajes_chat(leido) WHERE leido = false;

-- Row Level Security
ALTER TABLE conversaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes_chat ENABLE ROW LEVEL SECURITY;

-- Políticas para conversaciones
CREATE POLICY "usuarios_ver_sus_conversaciones" ON conversaciones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usuarios_crear_conversaciones" ON conversaciones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "usuarios_actualizar_sus_conversaciones" ON conversaciones FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para mensajes
CREATE POLICY "usuarios_ver_mensajes_sus_conversaciones" ON mensajes_chat FOR SELECT 
    USING (conversacion_id IN (SELECT id FROM conversaciones WHERE user_id = auth.uid()));
    
CREATE POLICY "usuarios_crear_mensajes_sus_conversaciones" ON mensajes_chat FOR INSERT 
    WITH CHECK (conversacion_id IN (SELECT id FROM conversaciones WHERE user_id = auth.uid()));

-- Trigger para actualizar fecha_ultimo_mensaje
CREATE OR REPLACE FUNCTION actualizar_ultimo_mensaje()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversaciones 
    SET fecha_ultimo_mensaje = NEW.fecha_envio,
        leida_por_soporte = CASE WHEN NEW.remitente = 'usuario' THEN false ELSE leida_por_soporte END
    WHERE id = NEW.conversacion_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_ultimo_mensaje
    AFTER INSERT ON mensajes_chat
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_ultimo_mensaje();




















