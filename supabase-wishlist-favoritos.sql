-- ========================================
-- TABLA DE WISHLIST/FAVORITOS PARA CRESALIA
-- ========================================
-- Esta tabla almacena los favoritos de los compradores
-- Soporta múltiples listas: servicios, tiendas, favoritos generales y listas personalizadas por tienda
-- OPCIONAL: Solo necesaria si quieres persistencia en la nube (sincronización entre dispositivos)

-- ===== TABLA PRINCIPAL DE WISHLIST =====
CREATE TABLE IF NOT EXISTS wishlist_favoritos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comprador_id UUID REFERENCES compradores(id) ON DELETE CASCADE,
    
    -- Tipo de lista
    tipo_lista TEXT NOT NULL DEFAULT 'favoritos' CHECK (tipo_lista IN ('favoritos', 'servicios', 'tiendas', 'tienda_personalizada')),
    
    -- Información del item
    item_id TEXT NOT NULL, -- ID del producto/servicio/tienda
    item_tipo TEXT NOT NULL CHECK (item_tipo IN ('producto', 'servicio', 'tienda')),
    item_nombre TEXT NOT NULL,
    item_precio DECIMAL(10, 2),
    item_imagen TEXT,
    
    -- Información de la tienda (si aplica)
    tienda_id UUID,
    tienda_nombre TEXT,
    
    -- Lista personalizada (si es lista específica de tienda)
    lista_personalizada_id TEXT, -- ID de la lista personalizada (ej: "tienda_123")
    lista_personalizada_nombre TEXT, -- Nombre de la lista (ej: "Mi Tienda Favorita")
    
    -- Metadata
    agregado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Evitar duplicados
    UNIQUE(comprador_id, item_id, tipo_lista, lista_personalizada_id)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_wishlist_comprador ON wishlist_favoritos(comprador_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_tipo ON wishlist_favoritos(tipo_lista);
CREATE INDEX IF NOT EXISTS idx_wishlist_item ON wishlist_favoritos(item_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_tienda ON wishlist_favoritos(tienda_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_agregado ON wishlist_favoritos(agregado_at);

-- ===== TABLA DE LISTAS PERSONALIZADAS =====
-- Para almacenar metadatos de listas personalizadas por tienda
CREATE TABLE IF NOT EXISTS wishlist_listas_personalizadas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comprador_id UUID REFERENCES compradores(id) ON DELETE CASCADE,
    
    -- Identificador único de la lista
    lista_id TEXT NOT NULL, -- Ej: "tienda_123"
    nombre_lista TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'tienda' CHECK (tipo IN ('tienda', 'servicio')),
    
    -- Información de la tienda
    tienda_id UUID,
    tienda_nombre TEXT NOT NULL,
    
    -- Metadata
    creada_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Un comprador solo puede tener una lista por tienda
    UNIQUE(comprador_id, lista_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_listas_comprador ON wishlist_listas_personalizadas(comprador_id);
CREATE INDEX IF NOT EXISTS idx_listas_tienda ON wishlist_listas_personalizadas(tienda_id);

-- ===== FUNCIONES Y TRIGGERS =====

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_wishlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para wishlist_favoritos
CREATE TRIGGER trigger_wishlist_updated_at
    BEFORE UPDATE ON wishlist_favoritos
    FOR EACH ROW
    EXECUTE FUNCTION update_wishlist_updated_at();

-- Trigger para wishlist_listas_personalizadas
CREATE TRIGGER trigger_listas_updated_at
    BEFORE UPDATE ON wishlist_listas_personalizadas
    FOR EACH ROW
    EXECUTE FUNCTION update_wishlist_updated_at();

-- ===== ROW LEVEL SECURITY (RLS) =====

-- Habilitar RLS
ALTER TABLE wishlist_favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_listas_personalizadas ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para wishlist_favoritos
-- Los usuarios solo pueden ver sus propios favoritos
CREATE POLICY "compradores_ver_sus_favoritos" ON wishlist_favoritos
    FOR SELECT
    USING (comprador_id IN (
        SELECT id FROM compradores WHERE user_id = auth.uid()
    ));

-- Los usuarios pueden insertar sus propios favoritos
CREATE POLICY "compradores_insertar_favoritos" ON wishlist_favoritos
    FOR INSERT
    WITH CHECK (comprador_id IN (
        SELECT id FROM compradores WHERE user_id = auth.uid()
    ));

-- Los usuarios pueden actualizar sus propios favoritos
CREATE POLICY "compradores_actualizar_favoritos" ON wishlist_favoritos
    FOR UPDATE
    USING (comprador_id IN (
        SELECT id FROM compradores WHERE user_id = auth.uid()
    ));

-- Los usuarios pueden eliminar sus propios favoritos
CREATE POLICY "compradores_eliminar_favoritos" ON wishlist_favoritos
    FOR DELETE
    USING (comprador_id IN (
        SELECT id FROM compradores WHERE user_id = auth.uid()
    ));

-- Políticas de seguridad para wishlist_listas_personalizadas
CREATE POLICY "compradores_ver_sus_listas" ON wishlist_listas_personalizadas
    FOR SELECT
    USING (comprador_id IN (
        SELECT id FROM compradores WHERE user_id = auth.uid()
    ));

CREATE POLICY "compradores_insertar_listas" ON wishlist_listas_personalizadas
    FOR INSERT
    WITH CHECK (comprador_id IN (
        SELECT id FROM compradores WHERE user_id = auth.uid()
    ));

CREATE POLICY "compradores_actualizar_listas" ON wishlist_listas_personalizadas
    FOR UPDATE
    USING (comprador_id IN (
        SELECT id FROM compradores WHERE user_id = auth.uid()
    ));

CREATE POLICY "compradores_eliminar_listas" ON wishlist_listas_personalizadas
    FOR DELETE
    USING (comprador_id IN (
        SELECT id FROM compradores WHERE user_id = auth.uid()
    ));

-- ===== VISTAS ÚTILES (SEGURAS) =====
-- Nota: Las vistas se crean como SECURITY INVOKER para evitar problemas de seguridad

-- Vista para obtener resumen de favoritos por comprador
CREATE OR REPLACE VIEW vista_resumen_favoritos
WITH (security_invoker = true) AS
SELECT 
    comprador_id,
    tipo_lista,
    COUNT(*) as total_items,
    MIN(agregado_at) as item_mas_antiguo,
    MAX(agregado_at) as item_mas_reciente
FROM wishlist_favoritos
GROUP BY comprador_id, tipo_lista;

-- Vista para obtener servicios con límite de 100
CREATE OR REPLACE VIEW vista_servicios_favoritos
WITH (security_invoker = true) AS
SELECT 
    w.*,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY w.comprador_id ORDER BY w.agregado_at) > 100 
        THEN true 
        ELSE false 
    END as excede_limite
FROM wishlist_favoritos w
WHERE w.tipo_lista = 'servicios'
ORDER BY w.comprador_id, w.agregado_at;

-- ===== COMENTARIOS =====

COMMENT ON TABLE wishlist_favoritos IS 'Almacena los favoritos de los compradores, organizados por tipo: favoritos generales, servicios, tiendas y listas personalizadas';
COMMENT ON TABLE wishlist_listas_personalizadas IS 'Almacena metadatos de listas personalizadas creadas por los compradores para organizar favoritos por tienda';
COMMENT ON COLUMN wishlist_favoritos.tipo_lista IS 'Tipo de lista: favoritos (general), servicios, tiendas, o tienda_personalizada';
COMMENT ON COLUMN wishlist_favoritos.item_tipo IS 'Tipo de item: producto, servicio o tienda';
COMMENT ON COLUMN wishlist_favoritos.lista_personalizada_id IS 'ID de la lista personalizada si el item pertenece a una lista específica de tienda';

-- ===== NOTAS IMPORTANTES =====
-- 
-- 1. Esta tabla es OPCIONAL - El sistema funciona perfectamente con localStorage
-- 2. Solo necesitas esta tabla si quieres:
--    - Sincronización entre dispositivos
--    - Backup en la nube
--    - Análisis de datos de favoritos
--    - Recuperación de datos si se borra localStorage
--
-- 3. Si usas localStorage solamente:
--    - Funciona offline
--    - No requiere backend
--    - Más rápido
--    - Pero solo funciona en el mismo navegador/dispositivo
--
-- 4. Límite de 100 servicios:
--    - Se valida en el frontend (localStorage)
--    - Si usas Supabase, puedes agregar un CHECK constraint adicional
--    - El sistema muestra recordatorio de antigüedad cuando se alcanza el límite

