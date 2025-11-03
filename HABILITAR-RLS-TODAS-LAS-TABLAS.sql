-- ===== HABILITAR RLS EN TODAS LAS TABLAS DE CRESALIA =====
-- IMPORTANTE: Ejecutar este script en Supabase Dashboard → SQL Editor

-- ===== TABLAS PRINCIPALES =====
ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE compradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;

-- ===== COMUNIDADES =====
ALTER TABLE comunidad_vendedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunidad_compradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes_comunidad ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloqueos_individuales ENABLE ROW LEVEL SECURITY;
ALTER TABLE respuestas_comunidad ENABLE ROW LEVEL SECURITY;

-- ===== SISTEMA DE MAPAS =====
ALTER TABLE ubicaciones_tiendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE puntos_retiro ENABLE ROW LEVEL SECURITY;

-- ===== SISTEMA DE TURNOS =====
ALTER TABLE configuracion_turnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnos_reservados ENABLE ROW LEVEL SECURITY;
ALTER TABLE comprobantes_turnos ENABLE ROW LEVEL SECURITY;

-- ===== HISTORIALES =====
ALTER TABLE historial_ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones_financieras ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_pagos_completo ENABLE ROW LEVEL SECURITY;

-- ===== SUSCRIPCIONES Y PAGOS =====
ALTER TABLE suscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_comisiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE transparencia_precios ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria_transacciones ENABLE ROW LEVEL SECURITY;

-- ===== FEEDBACKS Y VALORACIONES =====
ALTER TABLE feedbacks_generales ENABLE ROW LEVEL SECURITY;
ALTER TABLE valoraciones_tiendas ENABLE ROW LEVEL SECURITY;

-- ===== SISTEMAS AVANZADOS =====
ALTER TABLE estados_animo_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones_emocionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones_notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones_activas ENABLE ROW LEVEL SECURITY;
ALTER TABLE actividad_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE intentos_login ENABLE ROW LEVEL SECURITY;
ALTER TABLE ubicaciones_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones_seguridad ENABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones_ia ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_demanda ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_precios ENABLE ROW LEVEL SECURITY;
ALTER TABLE datos_tendencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE estado_interconexiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_interconexion ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones_personalizacion ENABLE ROW LEVEL SECURITY;

-- ===== POLÍTICAS DE SEGURIDAD =====
-- Políticas para tiendas (solo el usuario ve su tienda)
CREATE POLICY "Users can only see their own tienda" ON tiendas
    FOR ALL USING (auth.uid()::text = user_id);

-- Políticas para compradores (solo el usuario ve sus datos)
CREATE POLICY "Users can only see their own comprador data" ON compradores
    FOR ALL USING (auth.uid()::text = user_id);

-- Políticas para productos (solo la tienda ve sus productos)
CREATE POLICY "Users can only manage their own productos" ON productos
    FOR ALL USING (auth.uid()::text = tienda_id);

-- Políticas para servicios (solo la tienda ve sus servicios)
CREATE POLICY "Users can only manage their own servicios" ON servicios
    FOR ALL USING (auth.uid()::text = tienda_id);

-- Políticas para comunidades (solo el usuario ve sus datos)
CREATE POLICY "Users can only see their own comunidad data" ON comunidad_vendedores
    FOR ALL USING (auth.uid()::text = vendedor_id);

CREATE POLICY "Users can only see their own comprador comunidad data" ON comunidad_compradores
    FOR ALL USING (auth.uid()::text = comprador_id);

-- Políticas para reportes (solo el reportador ve sus reportes)
CREATE POLICY "Users can only see their own reportes" ON reportes_comunidad
    FOR ALL USING (auth.uid()::text = reportador_id);

-- Políticas para historiales (solo el usuario ve sus historiales)
CREATE POLICY "Users can only see their own historial_ventas" ON historial_ventas
    FOR ALL USING (auth.uid()::text = tienda_id);

CREATE POLICY "Users can only see their own historial_compras" ON historial_compras
    FOR ALL USING (auth.uid()::text = comprador_id);

-- Políticas para sistemas avanzados (solo el usuario ve sus datos)
CREATE POLICY "Users can only see their own estados_animo" ON estados_animo_usuarios
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own configuraciones_emocionales" ON configuraciones_emocionales
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own notificaciones" ON historial_notificaciones
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own sesiones" ON sesiones_activas
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own actividad" ON actividad_usuario
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own ubicaciones" ON ubicaciones_usuario
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own configuraciones_seguridad" ON configuraciones_seguridad
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own analytics" ON metricas_analytics
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own reportes_analytics" ON reportes_analytics
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own configuraciones_ia" ON configuraciones_ia
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own datos_demanda" ON datos_demanda
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own datos_precios" ON datos_precios
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own datos_tendencias" ON datos_tendencias
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own interconexiones" ON estado_interconexiones
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own eventos_interconexion" ON eventos_interconexion
    FOR ALL USING (auth.uid() = usuario_id);

CREATE POLICY "Users can only see their own personalizacion" ON configuraciones_personalizacion
    FOR ALL USING (auth.uid() = usuario_id);

-- ===== VERIFICACIÓN =====
-- Para verificar que RLS está habilitado en todas las tablas:
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true
ORDER BY tablename;





