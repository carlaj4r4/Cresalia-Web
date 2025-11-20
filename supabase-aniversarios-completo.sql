-- ============================================================
-- SISTEMA COMPLETO DE ANIVERSARIOS Y CELEBRACIONES
-- Cresalia - Múltiples tipos de celebraciones
-- Ejecutar una sola vez en Supabase SQL Editor
-- ============================================================

BEGIN;

-- ============================================================
-- 1. COMPRADORES - Aniversarios y Cumpleaños
-- ============================================================
ALTER TABLE compradores
    -- Cumpleaños del comprador
    ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE,
    ADD COLUMN IF NOT EXISTS acepta_cumple_publico BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS acepta_cumple_descuento BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS mensaje_cumple_publico TEXT,
    
    -- Aniversario en Cresalia (se calcula automáticamente desde fecha_registro)
    ADD COLUMN IF NOT EXISTS acepta_aniversario_publico BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS acepta_aniversario_descuento BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS mensaje_aniversario_publico TEXT,
    
    -- Control de notificaciones
    ADD COLUMN IF NOT EXISTS cumple_ultima_notificacion TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS aniversario_ultima_notificacion TIMESTAMP WITH TIME ZONE;

-- ============================================================
-- 2. TIENDAS - Múltiples tipos de aniversarios
-- IMPORTANTE: Las tiendas y servicios son entidades separadas
-- ============================================================
-- Verificar si existe tabla "tiendas" y agregar columnas
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tiendas') THEN
        ALTER TABLE tiendas
            -- Cumpleaños del fundador/responsable
            ADD COLUMN IF NOT EXISTS fecha_nacimiento_responsable DATE,
            ADD COLUMN IF NOT EXISTS acepta_cumple_home BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS acepta_cumple_beneficio BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS mensaje_cumple_publico TEXT,
            
            -- Aniversario de creación de la tienda
            ADD COLUMN IF NOT EXISTS fecha_creacion_negocio DATE,
            ADD COLUMN IF NOT EXISTS acepta_aniversario_negocio_home BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS acepta_aniversario_negocio_beneficio BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS mensaje_aniversario_negocio_publico TEXT,
            
            -- Aniversario en Cresalia (se calcula desde fecha_registro o fecha_creacion)
            ADD COLUMN IF NOT EXISTS acepta_aniversario_cresalia_home BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS acepta_aniversario_cresalia_beneficio BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS mensaje_aniversario_cresalia_publico TEXT,
            
            -- Control de notificaciones
            ADD COLUMN IF NOT EXISTS cumple_ultima_notificacion TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS aniversario_negocio_ultima_notificacion TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS aniversario_cresalia_ultima_notificacion TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- ============================================================
-- 2B. SERVICIOS - Múltiples tipos de aniversarios
-- Los servicios son diferentes de las tiendas y tienen su propia tabla
-- ============================================================
-- Verificar si existe tabla "servicios" y agregar columnas
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'servicios') THEN
        -- Nota: Los servicios pueden tener su propio responsable o usar el de la tienda padre
        -- Por ahora agregamos campos básicos, pero pueden necesitar referencia a tienda_id
        ALTER TABLE servicios
            -- Cumpleaños del responsable del servicio
            ADD COLUMN IF NOT EXISTS fecha_nacimiento_responsable DATE,
            ADD COLUMN IF NOT EXISTS acepta_cumple_home BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS acepta_cumple_beneficio BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS mensaje_cumple_publico TEXT,
            
            -- Aniversario de creación del servicio
            ADD COLUMN IF NOT EXISTS fecha_creacion_negocio DATE,
            ADD COLUMN IF NOT EXISTS acepta_aniversario_negocio_home BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS acepta_aniversario_negocio_beneficio BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS mensaje_aniversario_negocio_publico TEXT,
            
            -- Aniversario en Cresalia (se calcula desde fecha_creacion)
            ADD COLUMN IF NOT EXISTS acepta_aniversario_cresalia_home BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS acepta_aniversario_cresalia_beneficio BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS mensaje_aniversario_cresalia_publico TEXT,
            
            -- Control de notificaciones
            ADD COLUMN IF NOT EXISTS cumple_ultima_notificacion TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS aniversario_negocio_ultima_notificacion TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS aniversario_cresalia_ultima_notificacion TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Si tenés tabla "tenants" en lugar de "tiendas", descomentá esto:
-- DO $$
-- BEGIN
--     IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tenants') THEN
--         ALTER TABLE tenants
--             ADD COLUMN IF NOT EXISTS fecha_nacimiento_responsable DATE,
--             ADD COLUMN IF NOT EXISTS acepta_cumple_home BOOLEAN DEFAULT FALSE,
--             ADD COLUMN IF NOT EXISTS acepta_cumple_beneficio BOOLEAN DEFAULT FALSE,
--             ADD COLUMN IF NOT EXISTS mensaje_cumple_publico TEXT,
--             ADD COLUMN IF NOT EXISTS fecha_creacion_negocio DATE,
--             ADD COLUMN IF NOT EXISTS acepta_aniversario_negocio_home BOOLEAN DEFAULT FALSE,
--             ADD COLUMN IF NOT EXISTS acepta_aniversario_negocio_beneficio BOOLEAN DEFAULT FALSE,
--             ADD COLUMN IF NOT EXISTS mensaje_aniversario_negocio_publico TEXT,
--             ADD COLUMN IF NOT EXISTS acepta_aniversario_cresalia_home BOOLEAN DEFAULT FALSE,
--             ADD COLUMN IF NOT EXISTS acepta_aniversario_cresalia_beneficio BOOLEAN DEFAULT FALSE,
--             ADD COLUMN IF NOT EXISTS mensaje_aniversario_cresalia_publico TEXT,
--             ADD COLUMN IF NOT EXISTS cumple_ultima_notificacion TIMESTAMP WITH TIME ZONE,
--             ADD COLUMN IF NOT EXISTS aniversario_negocio_ultima_notificacion TIMESTAMP WITH TIME ZONE,
--             ADD COLUMN IF NOT EXISTS aniversario_cresalia_ultima_notificacion TIMESTAMP WITH TIME ZONE;
--     END IF;
-- END $$;

-- ============================================================
-- 3. TABLA DE COMBOS/DESCUENTOS ESPECIALES DE CELEBRACIÓN
-- Las tiendas pueden crear combos/descuentos para su mes de aniversario
-- ============================================================
CREATE TABLE IF NOT EXISTS aniversarios_combos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Referencia a la tienda o servicio (son diferentes)
    tipo_negocio TEXT CHECK (tipo_negocio IN ('tienda', 'servicio')) NOT NULL,
    tienda_id UUID, -- o INTEGER si usás SERIAL
    servicio_id UUID, -- ID del servicio si es tipo 'servicio'
    tienda_slug TEXT,
    servicio_slug TEXT, -- Slug del servicio si aplica
    tienda_email TEXT,
    
    -- Tipo de celebración
    tipo_celebracion TEXT CHECK (tipo_celebracion IN (
        'cumpleanos_fundador',
        'aniversario_negocio',
        'aniversario_cresalia'
    )) NOT NULL,
    
    -- Mes de celebración (1-12)
    mes_celebracion INTEGER CHECK (mes_celebracion >= 1 AND mes_celebracion <= 12) NOT NULL,
    
    -- Información del combo/descuento
    titulo TEXT NOT NULL,
    descripcion TEXT,
    descuento_porcentaje INTEGER CHECK (descuento_porcentaje >= 0 AND descuento_porcentaje <= 100),
    descuento_monto DECIMAL(10,2),
    productos_incluidos JSONB DEFAULT '[]'::jsonb, -- IDs de productos
    servicios_incluidos JSONB DEFAULT '[]'::jsonb, -- IDs de servicios
    
    -- Vigencia
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    
    -- Estado
    activo BOOLEAN DEFAULT TRUE,
    destacado BOOLEAN DEFAULT FALSE, -- Para aparecer en portada
    
    -- Imagen/banner del combo
    imagen_url TEXT,
    
    -- Métricas
    veces_visto INTEGER DEFAULT 0,
    veces_usado INTEGER DEFAULT 0,
    
    -- Control
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aniversarios_combos_tienda ON aniversarios_combos(tipo_negocio, tienda_slug, servicio_slug);
CREATE INDEX IF NOT EXISTS idx_aniversarios_combos_mes ON aniversarios_combos(mes_celebracion);
CREATE INDEX IF NOT EXISTS idx_aniversarios_combos_activo ON aniversarios_combos(activo, destacado);
CREATE INDEX IF NOT EXISTS idx_aniversarios_combos_vigencia ON aniversarios_combos(fecha_inicio, fecha_fin);

-- ============================================================
-- 4. HISTORIAL DE CELEBRACIONES Y BENEFICIOS
-- ============================================================
-- Primero dropear la tabla si existe sin tipo_celebracion y recrearla
DROP TABLE IF EXISTS cumpleanos_historial CASCADE;

CREATE TABLE cumpleanos_historial (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT CHECK (tipo IN ('usuario', 'tenant', 'tienda')) NOT NULL,
    tipo_celebracion TEXT CHECK (tipo_celebracion IN (
        'cumpleanos',
        'aniversario_negocio',
        'aniversario_cresalia'
    )) NOT NULL,
    referencia_slug TEXT NOT NULL, -- email usuario o slug tienda
    fecha DATE NOT NULL,
    cupón_generado TEXT,
    beneficio TEXT, -- JSON con detalles del beneficio
    mensaje TEXT,
    enviado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cumpleanos_historial_tipo_fecha
    ON cumpleanos_historial(tipo, tipo_celebracion, fecha DESC);

-- ============================================================
-- 5. INTERACCIONES PÚBLICAS (abrazos y mensajes)
-- ============================================================
-- Primero dropear la tabla si existe sin tipo_celebracion y recrearla
DROP TABLE IF EXISTS cumpleanos_interacciones CASCADE;

CREATE TABLE cumpleanos_interacciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referencia TEXT NOT NULL, -- email o slug
    tipo TEXT CHECK (tipo IN ('abrazo', 'mensaje')) NOT NULL,
    tipo_celebracion TEXT CHECK (tipo_celebracion IN (
        'cumpleanos',
        'aniversario_negocio',
        'aniversario_cresalia'
    )),
    autor TEXT,
    mensaje TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cumpleanos_interacciones_referencia
    ON cumpleanos_interacciones(referencia, tipo_celebracion, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cumpleanos_interacciones_tipo
    ON cumpleanos_interacciones(tipo);

-- ============================================================
-- 6. PERSONALIZACIÓN VISUAL DE CELEBRACIONES
-- Colores, banners, estilos personalizables por tienda
-- ============================================================
CREATE TABLE IF NOT EXISTS aniversarios_personalizacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Referencia a la tienda o servicio (son diferentes)
    tipo_negocio TEXT CHECK (tipo_negocio IN ('tienda', 'servicio')) NOT NULL,
    tienda_id UUID,
    servicio_id UUID, -- ID del servicio si es tipo 'servicio'
    tienda_slug TEXT,
    servicio_slug TEXT, -- Slug del servicio si aplica
    tienda_email TEXT,
    
    -- Tipo de celebración que se personaliza
    -- NOTA: aniversario_cresalia NO es personalizable (colores fijos de marca)
    tipo_celebracion TEXT CHECK (tipo_celebracion IN (
        'cumpleanos_fundador',
        'aniversario_negocio'
    )) NOT NULL,
    
    -- Colores del banner
    color_fondo TEXT DEFAULT '#7C3AED', -- Color de fondo del banner
    color_texto TEXT DEFAULT '#FFFFFF', -- Color del texto
    color_accento TEXT DEFAULT '#EC4899', -- Color de acento/botones
    
    -- Estilos adicionales
    estilo_banner TEXT CHECK (estilo_banner IN ('solido', 'degradado', 'con_imagen')) DEFAULT 'degradado',
    imagen_banner_url TEXT, -- URL de imagen personalizada para el banner
    opacidad_fondo DECIMAL(3,2) DEFAULT 0.95 CHECK (opacidad_fondo >= 0 AND opacidad_fondo <= 1),
    
    -- Fuente y tipografía
    fuente_titulo TEXT DEFAULT 'Poppins',
    tamaño_titulo INTEGER DEFAULT 24 CHECK (tamaño_titulo >= 12 AND tamaño_titulo <= 72),
    fuente_texto TEXT DEFAULT 'Poppins',
    tamaño_texto INTEGER DEFAULT 16 CHECK (tamaño_texto >= 10 AND tamaño_texto <= 24),
    
    -- Animaciones y efectos (opcional)
    animacion_entrada TEXT CHECK (animacion_entrada IN ('fade', 'slide', 'zoom', 'none')) DEFAULT 'fade',
    mostrar_confeti BOOLEAN DEFAULT TRUE,
    
    -- Sincronización con página de tienda
    aplicar_en_tienda BOOLEAN DEFAULT TRUE, -- Si se aplica en la página de la tienda también
    aplicar_en_portada BOOLEAN DEFAULT TRUE, -- Si se aplica en la portada de Cresalia
    
    -- Duración del banner (1-30 días)
    duracion_dias INTEGER DEFAULT 1 CHECK (duracion_dias >= 1 AND duracion_dias <= 30), -- Duración del banner en días (máximo 30 días)
    
    -- Control
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Una personalización por tipo de celebración por tienda/servicio
    -- Constraint único: una tienda/servicio solo puede tener una personalización por tipo de celebración
    CONSTRAINT unique_personalizacion UNIQUE (tipo_negocio, tienda_slug, servicio_slug, tipo_celebracion)
);

CREATE INDEX IF NOT EXISTS idx_aniversarios_personalizacion_tienda 
    ON aniversarios_personalizacion(tipo_negocio, tienda_slug, servicio_slug, tipo_celebracion);
CREATE INDEX IF NOT EXISTS idx_aniversarios_personalizacion_activo 
    ON aniversarios_personalizacion(activo, aplicar_en_portada);

-- ============================================================
-- 7. PERSONALIZACIÓN DEL SISTEMA DE BIENESTAR EMOCIONAL
-- Colores y mensajes personalizados para el sistema de bienestar
-- ============================================================
CREATE TABLE IF NOT EXISTS bienestar_personalizacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Referencia a la tienda o servicio
    tipo_negocio TEXT CHECK (tipo_negocio IN ('tienda', 'servicio', 'comprador')) NOT NULL,
    tienda_id UUID,
    servicio_id UUID,
    comprador_email TEXT, -- Para compradores
    
    -- Colores del sistema de bienestar
    color_principal TEXT DEFAULT '#7C3AED', -- Color principal del sistema
    color_secundario TEXT DEFAULT '#EC4899', -- Color secundario
    color_fondo TEXT DEFAULT '#F8FAFC', -- Color de fondo
    color_texto TEXT DEFAULT '#1F2937', -- Color del texto
    
    -- Mensaje de bienvenida personalizado
    mensaje_bienvenida TEXT DEFAULT 'Bienvenido y Feliz Cumpleaños!', -- Mensaje para cumpleaños
    mensaje_aniversario TEXT DEFAULT 'Bienvenido y Feliz Aniversario!', -- Mensaje para aniversario
    mensaje_general TEXT DEFAULT 'Bienvenido!', -- Mensaje general
    
    -- Control
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Una personalización por tipo de negocio
    CONSTRAINT unique_bienestar_personalizacion UNIQUE (tipo_negocio, tienda_id, servicio_id, comprador_email)
);

CREATE INDEX IF NOT EXISTS idx_bienestar_personalizacion_tipo 
    ON bienestar_personalizacion(tipo_negocio, tienda_id, servicio_id, comprador_email);
CREATE INDEX IF NOT EXISTS idx_bienestar_personalizacion_activo 
    ON bienestar_personalizacion(activo);

COMMIT;

