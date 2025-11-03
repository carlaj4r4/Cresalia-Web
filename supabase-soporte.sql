-- ===== TABLA DE TICKETS DE SOPORTE - CRESALIA =====
-- Sistema para que compradores y vendedores reporten problemas

CREATE TABLE IF NOT EXISTS tickets_soporte (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('comprador', 'vendedor')),
    
    -- Información del ticket
    asunto TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    categoria TEXT NOT NULL CHECK (categoria IN ('error_tecnico', 'problema_pago', 'problema_producto', 'consulta', 'otro')),
    prioridad TEXT DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
    
    -- Estado del ticket
    estado TEXT DEFAULT 'abierto' CHECK (estado IN ('abierto', 'en_proceso', 'resuelto', 'cerrado')),
    
    -- Información del usuario
    email_usuario TEXT NOT NULL,
    nombre_usuario TEXT,
    
    -- Información adicional
    url_pagina TEXT,
    navegador TEXT,
    captura_pantalla TEXT,
    
    -- Respuestas (JSON array)
    respuestas JSONB DEFAULT '[]'::jsonb,
    
    -- Fechas
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_resolucion TIMESTAMP WITH TIME ZONE,
    
    -- Quién lo atendió
    atendido_por TEXT
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets_soporte(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON tickets_soporte(estado);
CREATE INDEX IF NOT EXISTS idx_tickets_prioridad ON tickets_soporte(prioridad);
CREATE INDEX IF NOT EXISTS idx_tickets_categoria ON tickets_soporte(categoria);
CREATE INDEX IF NOT EXISTS idx_tickets_fecha ON tickets_soporte(fecha_creacion);

-- Row Level Security
ALTER TABLE tickets_soporte ENABLE ROW LEVEL SECURITY;

-- Políticas: Los usuarios pueden ver solo SUS tickets
CREATE POLICY "usuarios_ver_sus_tickets" ON tickets_soporte FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usuarios_crear_tickets" ON tickets_soporte FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "usuarios_actualizar_sus_tickets" ON tickets_soporte FOR UPDATE USING (auth.uid() = user_id);

-- Política especial: TÚ (Carla) puedes ver TODOS los tickets
-- Necesitarás crear un usuario admin especial en Supabase




















