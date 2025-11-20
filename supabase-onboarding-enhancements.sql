-- Supabase onboarding and mentorship enhancements
ALTER TABLE tiendas ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE tiendas ADD COLUMN IF NOT EXISTS pais VARCHAR(100);
ALTER TABLE tiendas ADD COLUMN IF NOT EXISTS ciudad VARCHAR(100);

CREATE TABLE IF NOT EXISTS mentor_sesiones (
    id SERIAL PRIMARY KEY,
    tienda_slug VARCHAR(255) NOT NULL,
    mentor_email VARCHAR(255),
    mentor_nombre VARCHAR(255),
    alumno_email VARCHAR(255),
    alumno_nombre VARCHAR(255),
    tema VARCHAR(255),
    tipo VARCHAR(50),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duracion_minutos INTEGER,
    calificacion DECIMAL(3,2),
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mentor_sesiones_tienda ON mentor_sesiones(tienda_slug);
CREATE INDEX IF NOT EXISTS idx_mentor_sesiones_fecha ON mentor_sesiones(fecha);

CREATE TABLE IF NOT EXISTS mentor_metricas_resumen (
    tienda_slug TEXT PRIMARY KEY,
    sesiones INTEGER DEFAULT 0,
    horas_totales NUMERIC(10,2) DEFAULT 0,
    calificacion_promedio NUMERIC(5,2) DEFAULT 0,
    temas JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tiendas ADD COLUMN IF NOT EXISTS origen VARCHAR(255);
ALTER TABLE tiendas ADD COLUMN IF NOT EXISTS objetivo TEXT;

CREATE TABLE IF NOT EXISTS ubicaciones_tienda (
    id BIGSERIAL PRIMARY KEY,
    tenant_slug TEXT NOT NULL,
    tenant_id BIGINT,
    referencia_local TEXT,
    nombre TEXT NOT NULL,
    direccion TEXT,
    tipo TEXT,
    horarios TEXT,
    contacto TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    precision DOUBLE PRECISION,
    fuente TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ubicaciones_tienda_referencia ON ubicaciones_tienda(tenant_slug, referencia_local);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_tienda_tenant ON ubicaciones_tienda(tenant_slug);

CREATE TABLE IF NOT EXISTS ubicaciones_usuarios (
    id BIGSERIAL PRIMARY KEY,
    tenant_slug TEXT,
    tenant_id BIGINT,
    usuario_email TEXT,
    usuario_tipo TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    precision DOUBLE PRECISION,
    fuente TEXT,
    contexto TEXT,
    metadata JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ubicaciones_usuarios_tenant ON ubicaciones_usuarios(tenant_slug, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ubicaciones_usuarios_email ON ubicaciones_usuarios(usuario_email);

