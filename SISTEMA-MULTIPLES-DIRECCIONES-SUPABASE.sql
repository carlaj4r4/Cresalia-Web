-- ============================================
-- 📍 SISTEMA DE MÚLTIPLES DIRECCIONES
-- Ya existe en supabase-tabla-clientes.sql, este script es para verificación
-- ============================================

-- Verificar que la tabla existe (ya debería existir según supabase-tabla-clientes.sql)
-- Si no existe, crearla:
CREATE TABLE IF NOT EXISTS direcciones_compradores (
    id BIGSERIAL PRIMARY KEY,
    comprador_id UUID REFERENCES compradores(id) ON DELETE CASCADE, -- CORREGIDO: UUID en lugar de BIGINT
    
    -- Información de la dirección
    alias VARCHAR(50) NOT NULL, -- "Casa", "Trabajo", "Casa de mamá", etc.
    nombre_destinatario VARCHAR(100),
    telefono_contacto VARCHAR(20),
    
    -- Ubicación detallada
    pais VARCHAR(50) NOT NULL DEFAULT 'Argentina',
    provincia VARCHAR(50) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10),
    direccion_completa TEXT NOT NULL,
    referencias TEXT, -- "Portón verde", "Entre X y Y", etc.
    
    -- Configuración
    es_principal BOOLEAN DEFAULT false,
    activa BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_direcciones_comprador ON direcciones_compradores(comprador_id);
CREATE INDEX IF NOT EXISTS idx_direcciones_principal ON direcciones_compradores(comprador_id, es_principal);
CREATE INDEX IF NOT EXISTS idx_direcciones_activa ON direcciones_compradores(comprador_id, activa);

-- ===== RLS (Row Level Security) =====
ALTER TABLE direcciones_compradores ENABLE ROW LEVEL SECURITY;

-- Política: Los compradores solo pueden ver sus propias direcciones
CREATE POLICY "compradores_ver_sus_direcciones" 
ON direcciones_compradores FOR SELECT 
USING (
    comprador_id IN (
        SELECT id FROM compradores WHERE user_id = auth.uid()
    )
);

-- Política: Los compradores pueden insertar sus propias direcciones
CREATE POLICY "compradores_crear_sus_direcciones" 
ON direcciones_compradores FOR INSERT 
WITH CHECK (
    comprador_id IN (
        SELECT id FROM compradores WHERE user_id = auth.uid()
    )
);

-- Política: Los compradores pueden actualizar sus propias direcciones
CREATE POLICY "compradores_actualizar_sus_direcciones" 
ON direcciones_compradores FOR UPDATE 
USING (
    comprador_id IN (
        SELECT id FROM compradores WHERE user_id = auth.uid()
    )
);

-- Política: Los compradores pueden eliminar sus propias direcciones
CREATE POLICY "compradores_eliminar_sus_direcciones" 
ON direcciones_compradores FOR DELETE 
USING (
    comprador_id IN (
        SELECT id FROM compradores WHERE user_id = auth.uid()
    )
);

-- ===== FUNCIÓN: Asegurar solo una dirección principal =====
CREATE OR REPLACE FUNCTION asegurar_una_direccion_principal() RETURNS TRIGGER AS $$
BEGIN
    -- Si se marca como principal, desmarcar las demás
    IF NEW.es_principal = true THEN
        UPDATE direcciones_compradores
        SET es_principal = false
        WHERE comprador_id = NEW.comprador_id 
        AND id != NEW.id 
        AND es_principal = true;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para asegurar solo una dirección principal
DROP TRIGGER IF EXISTS trigger_una_direccion_principal ON direcciones_compradores;
CREATE TRIGGER trigger_una_direccion_principal
    BEFORE INSERT OR UPDATE ON direcciones_compradores
    FOR EACH ROW
    EXECUTE FUNCTION asegurar_una_direccion_principal();

-- ===== COMENTARIOS =====
COMMENT ON TABLE direcciones_compradores IS 'Direcciones múltiples de envío para compradores';
COMMENT ON COLUMN direcciones_compradores.es_principal IS 'Solo una dirección puede ser principal por comprador';
COMMENT ON FUNCTION asegurar_una_direccion_principal IS 'Asegura que solo haya una dirección principal por comprador';
