CREATE TABLE IF NOT EXISTS conversaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tipo_usuario TEXT NOT NULL,
    nombre_usuario TEXT NOT NULL,
    email_usuario TEXT NOT NULL,
    estado TEXT DEFAULT 'activa',
    leida_por_soporte BOOLEAN DEFAULT false,
    prioridad TEXT DEFAULT 'normal',
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_ultimo_mensaje TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_cierre TIMESTAMP WITH TIME ZONE,
    atendido_por TEXT DEFAULT 'Pendiente'
);

CREATE TABLE IF NOT EXISTS mensajes_chat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversacion_id UUID REFERENCES conversaciones(id) ON DELETE CASCADE,
    remitente TEXT NOT NULL,
    autor_nombre TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT false,
    fecha_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversaciones_user_id ON conversaciones(user_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_conversacion ON mensajes_chat(conversacion_id);

ALTER TABLE conversaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes_chat ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios_ver_sus_conversaciones" ON conversaciones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usuarios_crear_conversaciones" ON conversaciones FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "usuarios_ver_sus_mensajes" ON mensajes_chat FOR SELECT USING (conversacion_id IN (SELECT id FROM conversaciones WHERE user_id = auth.uid()));
CREATE POLICY "usuarios_crear_sus_mensajes" ON mensajes_chat FOR INSERT WITH CHECK (conversacion_id IN (SELECT id FROM conversaciones WHERE user_id = auth.uid()));




















