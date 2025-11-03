-- ===== TABLA DE DIARIOS EMOCIONALES - CRESALIA =====
-- Permite que Crisla vea las entradas del diario para dar mejor soporte

CREATE TABLE IF NOT EXISTS diarios_emocionales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tienda_id UUID REFERENCES tiendas(id) ON DELETE CASCADE,
    
    -- Contenido del diario
    fecha_entrada DATE NOT NULL DEFAULT CURRENT_DATE,
    emocion TEXT NOT NULL CHECK (emocion IN ('feliz', 'motivado', 'neutral', 'estresado', 'preocupado', 'frustrado', 'ansioso')),
    titulo TEXT,
    reflexion TEXT NOT NULL,
    logros TEXT,
    desafios TEXT,
    aprendizajes TEXT,
    gratitud TEXT,
    
    -- Contexto del negocio
    ventas_del_dia INTEGER DEFAULT 0,
    estado_negocio TEXT,
    
    -- Metadata
    privacidad TEXT DEFAULT 'privado' CHECK (privacidad IN ('privado', 'compartido_soporte')),
    leido_por_soporte BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Respuesta de Crisla
    respuesta_crisla TEXT,
    fecha_respuesta TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_diarios_user_id ON diarios_emocionales(user_id);
CREATE INDEX IF NOT EXISTS idx_diarios_tienda_id ON diarios_emocionales(tienda_id);
CREATE INDEX IF NOT EXISTS idx_diarios_fecha ON diarios_emocionales(fecha_entrada);
CREATE INDEX IF NOT EXISTS idx_diarios_emocion ON diarios_emocionales(emocion);
CREATE INDEX IF NOT EXISTS idx_diarios_no_leidos ON diarios_emocionales(leido_por_soporte) WHERE leido_por_soporte = false;

-- Row Level Security
ALTER TABLE diarios_emocionales ENABLE ROW LEVEL SECURITY;

-- Los usuarios ven solo SUS entradas
CREATE POLIdiarios_emocionalesCY "usuarios_ver_sus_diarios" ON diarios_emocionales FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usuarios_crear_diarios" ON  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "usuarios_actualizar_sus_diarios" ON diarios_emocionales FOR UPDATE USING (auth.uid() = user_id);

-- Política especial: Crisla puede ver todos los diarios compartidos con soporte
-- (Cuando uses service key en tu panel master)




















