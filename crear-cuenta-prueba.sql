-- ============================================
-- 🔐 CREAR CUENTA DE PRUEBA PARA TESTING
-- Cresalia Platform - Cuenta demo
-- ============================================

-- ===== 1. CREAR USUARIO DE PRUEBA EN AUTH =====
-- Nota: Esto se hace desde el dashboard de Supabase Auth, no desde SQL
-- Ve a: Authentication > Users > Invite User
-- Email: demo-tienda@cresalia.com
-- Password: Demo123456!

-- ===== 2. INSERTAR DATOS DE LA TIENDA DE PRUEBA =====
-- Primero necesitamos obtener el user_id del usuario creado
-- Esto se puede hacer desde el dashboard o con una función

-- Insertar tienda de prueba (reemplaza 'USER_ID_AQUI' con el ID real del usuario)
INSERT INTO tiendas (
    user_id,
    nombre_tienda,
    email,
    plan,
    subdomain,
    activa,
    configuracion
) VALUES (
    'USER_ID_AQUI', -- Reemplazar con el ID real del usuario
    'Tienda Demo Cresalia',
    'demo-tienda@cresalia.com',
    'pro',
    'demo-tienda',
    true,
    '{
        "colores": {
            "primario": "#667eea",
            "secundario": "#764ba2"
        },
        "contacto": {
            "telefono": "+1234567890",
            "whatsapp": "+1234567890",
            "direccion": "123 Demo Street, Demo City"
        },
        "negocio": {
            "descripcion": "Tienda de demostración de Cresalia",
            "categoria": "Tecnología",
            "horarios": "Lunes a Viernes: 9:00 - 18:00"
        }
    }'::jsonb
) ON CONFLICT (user_id) DO NOTHING;

-- ===== 3. INSERTAR COMPRADOR DE PRUEBA =====
INSERT INTO compradores (
    email,
    nombre,
    telefono,
    activo
) VALUES (
    'demo-comprador@cresalia.com',
    'Comprador Demo',
    '+1234567891',
    true
) ON CONFLICT (email) DO NOTHING;

-- ===== 4. VERIFICAR DATOS INSERTADOS =====
-- Ejecutar estas consultas para verificar que todo se insertó correctamente

-- Ver tienda de prueba
SELECT * FROM tiendas WHERE subdomain = 'demo-tienda';

-- Ver comprador de prueba
SELECT * FROM compradores WHERE email = 'demo-comprador@cresalia.com';

-- Ver productos de ejemplo
SELECT * FROM productos WHERE tienda_id = 'demo-tienda';

-- Ver servicios de ejemplo
SELECT * FROM servicios WHERE tienda_id = 'demo-tienda';

-- Ver feedbacks de ejemplo
SELECT * FROM tienda_feedbacks WHERE tienda_id = 'demo-tienda';














