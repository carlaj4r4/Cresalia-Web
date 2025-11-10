const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Importar configuración de seguridad
const {
    generalLimiter,
    authLimiter,
    sensitiveLimiter,
    helmetConfig,
    securityLogger,
    detectSuspiciousActivity
} = require('./security-config');

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== MIDDLEWARE DE SEGURIDAD ====================

// Headers de seguridad con Helmet
app.use(helmetConfig);

// Rate limiting general
app.use(generalLimiter);

// Detección de actividad sospechosa
app.use(detectSuspiciousActivity);

// CORS configurado
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://cresalia.vercel.app', 'https://cresalia-web.vercel.app']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging de inicio
securityLogger.log('INFO', 'Servidor Cresalia Multi-tenant iniciando con medidas de seguridad avanzadas');

// Conectar a la base de datos
const dbPath = path.join(__dirname, 'cresalia.db');
const db = new sqlite3.Database(dbPath);

console.log('🚀 Servidor Cresalia Multi-tenant iniciando...');
console.log('📊 Conectando a la base de datos...');

// Verificar conexión
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='tenants'", (err, row) => {
    if (err) {
        console.error('❌ Error al conectar con la base de datos:', err.message);
    } else if (!row) {
        console.log('⚠️  Base de datos no inicializada. Ejecuta: npm run init-multitenancy');
    } else {
        console.log('✅ Base de datos multi-tenant conectada correctamente');
    }
});

// ==================== MIDDLEWARE DE TENANT ====================
/**
 * Middleware para identificar el tenant actual
 * Puede ser por:
 * 1. Subdominio: tienda1.cresalia.com
 * 2. Path: /api/tienda1/productos
 * 3. Header: X-Tenant-Slug
 */
function identifyTenant(req, res, next) {
    let tenantSlug = null;

    // 1. Intentar obtener de header (útil para APIs)
    if (req.headers['x-tenant-slug']) {
        tenantSlug = req.headers['x-tenant-slug'];
    }
    // 2. Intentar obtener del path (/api/:tenant/...)
    else if (req.params.tenant) {
        tenantSlug = req.params.tenant;
    }
    // 3. Intentar obtener del subdominio
    else {
        const host = req.get('host') || '';
        const subdomain = host.split('.')[0];
        if (subdomain && subdomain !== 'localhost' && subdomain !== 'www' && !subdomain.match(/^\d+\.\d+\.\d+\.\d+$/)) {
            tenantSlug = subdomain;
        }
    }

    if (!tenantSlug) {
        // Sin tenant especificado, usar tenant demo por defecto
        tenantSlug = 'demo-store';
    }

    // Buscar tenant en la base de datos
    db.get('SELECT * FROM tenants WHERE slug = ? AND activo = 1', [tenantSlug], (err, tenant) => {
        if (err) {
            console.error('Error al buscar tenant:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (!tenant) {
            return res.status(404).json({ 
                error: 'Tienda no encontrada',
                message: `La tienda "${tenantSlug}" no existe o está inactiva.`
            });
        }

        // Verificar estado del tenant
        if (tenant.estado !== 'activo') {
            return res.status(403).json({ 
                error: 'Tienda no disponible',
                message: 'Esta tienda está temporalmente suspendida.'
            });
        }

        // Adjuntar tenant al request
        req.tenant = tenant;
        req.tenantId = tenant.id;
        
        console.log(`🏪 Tenant identificado: ${tenant.nombre_empresa} (${tenant.slug})`);
        next();
    });
}

// ==================== RUTAS DE AUTENTICACIÓN ====================

// Login de tenant
app.post('/api/auth/login', (req, res) => {
    const { email, password, tenant } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email y contraseña son requeridos'
        });
    }

    const tenantSlug = tenant || req.headers['x-tenant-slug'] || 'demo-store';
    
    // Buscar tenant por email
    const query = `
        SELECT t.*, u.id as user_id, u.nombre, u.rol 
        FROM tenants t 
        LEFT JOIN usuarios u ON t.id = u.tenant_id 
        WHERE t.email_contacto = ? AND t.slug = ?
    `;
    
    db.get(query, [email, tenantSlug], (err, row) => {
        if (err) {
            console.error('Error en login:', err);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
        
        if (!row) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        
        // Verificar contraseña (en producción usar bcrypt)
        if (row.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        
        // Generar token simple (en producción usar JWT)
        const token = Buffer.from(`${row.id}:${Date.now()}`).toString('base64');
        
        res.json({
            success: true,
            token: token,
            user: {
                id: row.user_id,
                nombre: row.nombre || row.nombre_empresa,
                email: row.email_contacto,
                rol: row.rol || 'admin',
                tenant_id: row.id,
                tenant_slug: row.slug
            }
        });
    });
});

// Verificar token
app.get('/api/auth/verify', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token no proporcionado'
        });
    }
    
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [tenantId, timestamp] = decoded.split(':');
        
        // Verificar que el token no sea muy viejo (24 horas)
        if (Date.now() - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }
        
        res.json({
            success: true,
            tenant_id: tenantId
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
});

// ===== ENDPOINTS DE SUSCRIPCIÓN =====

// Actualizar suscripción de tenant
app.put('/api/tenants/:id/subscription', (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    
    const sql = `
        UPDATE tenants 
        SET plan = ?, subscription_end = ?, payment_status = ?, 
            last_payment = ?, transaction_id = ?, plan_changed_at = ?
        WHERE id = ?
    `;
    
    db.run(sql, [
        updateData.plan,
        updateData.subscription_end,
        updateData.payment_status,
        updateData.last_payment,
        updateData.transaction_id,
        updateData.plan_changed_at || new Date().toISOString(),
        id
    ], function(err) {
        if (err) {
            console.error('Error actualizando suscripción:', err);
            return res.status(500).json({ error: 'Error actualizando suscripción' });
        }
        
        res.json({ 
            success: true, 
            message: 'Suscripción actualizada',
            changes: this.changes 
        });
    });
});

// Obtener todas las suscripciones para monitoreo
app.get('/api/subscriptions/monitor', (req, res) => {
    const sql = `
        SELECT id, nombre, plan, subscription_end, payment_status, 
               last_payment, created_at, email
        FROM tenants 
        WHERE plan != 'starter' OR subscription_end IS NOT NULL
        ORDER BY subscription_end ASC
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error obteniendo suscripciones:', err);
            return res.status(500).json({ error: 'Error obteniendo suscripciones' });
        }
        
        // Calcular días hasta expiración
        const now = new Date();
        const subscriptions = rows.map(row => ({
            ...row,
            days_until_expiry: row.subscription_end 
                ? Math.ceil((new Date(row.subscription_end) - now) / (24 * 60 * 60 * 1000))
                : null,
            is_expired: row.subscription_end 
                ? new Date(row.subscription_end) < now 
                : false
        }));
        
        res.json({ subscriptions });
    });
});

// Procesar renovación automática
app.post('/api/subscriptions/:id/renew', (req, res) => {
    const { id } = req.params;
    const { months = 1, transaction_id } = req.body;
    
    const sql = `
        UPDATE tenants 
        SET subscription_end = datetime(subscription_end, '+${months} months'),
            last_payment = ?,
            payment_status = 'active',
            transaction_id = ?
        WHERE id = ?
    `;
    
    db.run(sql, [
        new Date().toISOString(),
        transaction_id,
        id
    ], function(err) {
        if (err) {
            console.error('Error renovando suscripción:', err);
            return res.status(500).json({ error: 'Error renovando suscripción' });
        }
        
        res.json({ 
            success: true, 
            message: 'Suscripción renovada',
            changes: this.changes 
        });
    });
});

// Degradar a plan gratuito
app.post('/api/subscriptions/:id/downgrade', (req, res) => {
    const { id } = req.params;
    const { reason = 'Payment failed' } = req.body;
    
    const sql = `
        UPDATE tenants 
        SET plan = 'starter',
            subscription_end = NULL,
            payment_status = 'expired',
            downgraded_at = ?,
            downgrade_reason = ?
        WHERE id = ?
    `;
    
    db.run(sql, [
        new Date().toISOString(),
        reason,
        id
    ], function(err) {
        if (err) {
            console.error('Error degradando suscripción:', err);
            return res.status(500).json({ error: 'Error degradando suscripción' });
        }
        
        res.json({ 
            success: true, 
            message: 'Suscripción degradada a plan gratuito',
            changes: this.changes 
        });
    });
});

// Obtener estadísticas de suscripciones
app.get('/api/subscriptions/stats', (req, res) => {
    const sql = `
        SELECT 
            plan,
            COUNT(*) as count,
            SUM(CASE WHEN payment_status = 'active' THEN 1 ELSE 0 END) as active_count,
            SUM(CASE WHEN subscription_end < datetime('now') THEN 1 ELSE 0 END) as expired_count,
            SUM(CASE WHEN subscription_end BETWEEN datetime('now') AND datetime('now', '+7 days') THEN 1 ELSE 0 END) as expiring_soon_count
        FROM tenants 
        GROUP BY plan
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error obteniendo estadísticas:', err);
            return res.status(500).json({ error: 'Error obteniendo estadísticas' });
        }
        
        const stats = {
            by_plan: rows,
            total_subscriptions: rows.reduce((sum, row) => sum + row.count, 0),
            total_active: rows.reduce((sum, row) => sum + row.active_count, 0),
            total_expired: rows.reduce((sum, row) => sum + row.expired_count, 0),
            total_expiring_soon: rows.reduce((sum, row) => sum + row.expiring_soon_count, 0),
            last_check: new Date().toISOString()
        };
        
        res.json(stats);
    });
});

// ===== ENDPOINTS DE PAGOS =====

// Crear preferencia de Mercado Pago
app.post('/api/payments/mercadopago/preference', (req, res) => {
    const { items, payer, back_urls, external_reference } = req.body;
    
    // En producción, aquí usarías el SDK de Mercado Pago
    // const mercadopago = require('mercadopago');
    // mercadopago.configure({ access_token: 'TU_ACCESS_TOKEN' });
    
    // Simulación para demo
    const preference = {
        id: `pref_${Date.now()}`,
        init_point: `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref_${Date.now()}`,
        sandbox_init_point: `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref_${Date.now()}`,
        items: items,
        payer: payer,
        back_urls: back_urls,
        external_reference: external_reference
    };
    
    // Guardar preferencia en base de datos
    const sql = `INSERT INTO payment_preferences (id, tenant_id, plan, amount, status, created_at) 
                 VALUES (?, ?, ?, ?, 'pending', ?)`;
    
    db.run(sql, [
        preference.id,
        payer.email, // Usar email como tenant_id temporal
        items[0].title,
        items[0].unit_price,
        new Date().toISOString()
    ], function(err) {
        if (err) {
            console.error('Error guardando preferencia:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({
            success: true,
            id: preference.id,
            init_point: preference.sandbox_init_point // Usar sandbox para demo
        });
    });
});

// Crear intención de pago de Stripe
app.post('/api/payments/stripe/intent', (req, res) => {
    const { amount, currency, metadata } = req.body;
    
    // En producción, aquí usarías el SDK de Stripe
    // const stripe = require('stripe')('sk_test_...');
    
    // Simulación para demo
    const paymentIntent = {
        id: `pi_${Date.now()}`,
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount,
        currency: currency,
        status: 'requires_payment_method',
        metadata: metadata
    };
    
    // Guardar intención en base de datos
    const sql = `INSERT INTO payment_intents (id, tenant_id, plan, amount, status, created_at) 
                 VALUES (?, ?, ?, ?, 'pending', ?)`;
    
    db.run(sql, [
        paymentIntent.id,
        metadata.tenant_id,
        metadata.plan,
        amount / 100, // Convertir de centavos a dólares
        new Date().toISOString()
    ], function(err) {
        if (err) {
            console.error('Error guardando intención:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({
            success: true,
            client_secret: paymentIntent.client_secret,
            id: paymentIntent.id
        });
    });
});

// Webhook de Mercado Pago (para recibir notificaciones de pago)
app.post('/api/payments/mercadopago/webhook', (req, res) => {
    const { type, data } = req.body;
    
    if (type === 'payment') {
        const paymentId = data.id;
        
        // En producción, aquí verificarías el pago con Mercado Pago
        // const payment = await mercadopago.payment.findById(paymentId);
        
        // Simulación para demo
        const paymentStatus = Math.random() > 0.1 ? 'approved' : 'rejected'; // 90% éxito
        
        // Actualizar estado del pago
        const sql = `UPDATE payment_preferences SET status = ?, updated_at = ? WHERE id = ?`;
        
        db.run(sql, [paymentStatus, new Date().toISOString(), paymentId], function(err) {
            if (err) {
                console.error('Error actualizando pago:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            
            // Si el pago fue aprobado, renovar suscripción
            if (paymentStatus === 'approved') {
                this.handleSuccessfulPayment(paymentId, 'mercadopago');
            }
            
            res.json({ success: true, status: paymentStatus });
        });
    } else {
        res.json({ success: true, message: 'Webhook recibido' });
    }
});

// Webhook de Stripe (para recibir notificaciones de pago)
app.post('/api/payments/stripe/webhook', (req, res) => {
    const { type, data } = req.body;
    
    if (type === 'payment_intent.succeeded') {
        const paymentIntent = data.object;
        
        // Actualizar estado del pago
        const sql = `UPDATE payment_intents SET status = 'succeeded', updated_at = ? WHERE id = ?`;
        
        db.run(sql, [new Date().toISOString(), paymentIntent.id], function(err) {
            if (err) {
                console.error('Error actualizando pago:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            
            // Renovar suscripción
            this.handleSuccessfulPayment(paymentIntent.id, 'stripe');
            
            res.json({ success: true, status: 'succeeded' });
        });
    } else {
        res.json({ success: true, message: 'Webhook recibido' });
    }
});

// Manejar pago exitoso
function handleSuccessfulPayment(paymentId, provider) {
    // Obtener información del pago
    const sql = provider === 'mercadopago' 
        ? `SELECT * FROM payment_preferences WHERE id = ?`
        : `SELECT * FROM payment_intents WHERE id = ?`;
    
    db.get(sql, [paymentId], (err, payment) => {
        if (err) {
            console.error('Error obteniendo pago:', err);
            return;
        }
        
        if (payment) {
            // Renovar suscripción del tenant
            const renewalData = {
                plan: payment.plan,
                subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
                payment_status: 'active',
                last_payment: new Date().toISOString(),
                transaction_id: paymentId
            };
            
            // Actualizar tenant
            const updateSql = `UPDATE tenants SET plan = ?, subscription_end = ?, 
                              payment_status = ?, last_payment = ?, transaction_id = ?
                              WHERE id = ?`;
            
            db.run(updateSql, [
                renewalData.plan,
                renewalData.subscription_end,
                renewalData.payment_status,
                renewalData.last_payment,
                renewalData.transaction_id,
                payment.tenant_id
            ], function(err) {
                if (err) {
                    console.error('Error renovando suscripción:', err);
                } else {
                    console.log(`✅ Suscripción renovada para tenant: ${payment.tenant_id}`);
                }
            });
        }
    });
}

// ===== ENDPOINTS DE PAGOS DISTRIBUIDOS =====

// Guardar configuración de pagos de una tienda
app.post('/api/tenants/:id/payment-config', (req, res) => {
    const { id } = req.params;
    const { email, access_token, public_key, configured_at } = req.body;
    
    const sql = `
        INSERT OR REPLACE INTO tenant_payment_config 
        (tenant_id, email, access_token, public_key, configured_at, status)
        VALUES (?, ?, ?, ?, ?, 'active')
    `;
    
    db.run(sql, [id, email, access_token, public_key, configured_at], function(err) {
        if (err) {
            console.error('Error guardando configuración de pagos:', err);
            return res.status(500).json({ error: 'Error guardando configuración' });
        }
        
        res.json({ 
            success: true, 
            message: 'Configuración de pagos guardada',
            changes: this.changes 
        });
    });
});

// Obtener configuración de pagos de una tienda
app.get('/api/tenants/:id/payment-config', (req, res) => {
    const { id } = req.params;
    
    const sql = `SELECT * FROM tenant_payment_config WHERE tenant_id = ? AND status = 'active'`;
    
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Error obteniendo configuración:', err);
            return res.status(500).json({ error: 'Error obteniendo configuración' });
        }
        
        if (row) {
            res.json({ 
                success: true, 
                config: {
                    email: row.email,
                    access_token: row.access_token,
                    public_key: row.public_key,
                    configured_at: row.configured_at
                }
            });
        } else {
            res.json({ 
                success: false, 
                message: 'Configuración no encontrada' 
            });
        }
    });
});

// Verificar configuración de pagos
app.post('/api/payments/verify-config', (req, res) => {
    const { tenant_id, access_token, public_key } = req.body;
    
    // En producción, aquí verificarías con la API de Mercado Pago
    // const mercadopago = require('mercadopago');
    // mercadopago.configure({ access_token });
    
    // Simulación para demo
    const isValid = access_token.startsWith('APP_USR_') && public_key.startsWith('APP_USR_');
    
    if (isValid) {
        res.json({ 
            success: true, 
            message: 'Configuración válida',
            verified_at: new Date().toISOString()
        });
    } else {
        res.json({ 
            success: false, 
            error: 'Credenciales inválidas' 
        });
    }
});

// Crear preferencia de pago para tienda específica
app.post('/api/payments/mercadopago/store-preference', (req, res) => {
    const { tenant_id, preference, payment_config } = req.body;
    
    // En producción, aquí usarías el SDK de Mercado Pago con las credenciales de la tienda
    // const mercadopago = require('mercadopago');
    // mercadopago.configure({ access_token: payment_config.access_token });
    
    // Simulación para demo
    const storePreference = {
        id: `pref_${tenant_id}_${Date.now()}`,
        init_point: `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=pref_${tenant_id}_${Date.now()}`,
        items: preference.items,
        payer: preference.payer,
        back_urls: preference.back_urls,
        external_reference: preference.external_reference,
        metadata: preference.metadata
    };
    
    // Guardar preferencia
    const sql = `
        INSERT INTO store_payment_preferences 
        (id, tenant_id, plan, amount, net_amount, commission, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
    `;
    
    db.run(sql, [
        storePreference.id,
        tenant_id,
        preference.items[0].title,
        preference.items[0].unit_price,
        preference.metadata.net_amount,
        preference.metadata.cresalia_commission,
        new Date().toISOString()
    ], function(err) {
        if (err) {
            console.error('Error guardando preferencia de tienda:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({
            success: true,
            id: storePreference.id,
            init_point: storePreference.init_point
        });
    });
});

// Webhook para pagos distribuidos
app.post('/api/payments/mercadopago/store-webhook', (req, res) => {
    const { type, data } = req.body;
    
    if (type === 'payment') {
        const paymentId = data.id;
        
        // En producción, aquí verificarías el pago con Mercado Pago
        // const payment = await mercadopago.payment.findById(paymentId);
        
        // Simulación para demo
        const paymentStatus = Math.random() > 0.1 ? 'approved' : 'rejected';
        
        // Actualizar estado del pago
        const sql = `UPDATE store_payment_preferences SET status = ?, updated_at = ? WHERE id = ?`;
        
        db.run(sql, [paymentStatus, new Date().toISOString(), paymentId], function(err) {
            if (err) {
                console.error('Error actualizando pago de tienda:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            
            // Si el pago fue aprobado, procesar comisión
            if (paymentStatus === 'approved') {
                this.processStorePaymentSuccess(paymentId);
            }
            
            res.json({ success: true, status: paymentStatus });
        });
    } else {
        res.json({ success: true, message: 'Webhook recibido' });
    }
});

// Procesar pago exitoso de tienda
function processStorePaymentSuccess(paymentId) {
    // Obtener información del pago
    const sql = `SELECT * FROM store_payment_preferences WHERE id = ?`;
    
    db.get(sql, [paymentId], (err, payment) => {
        if (err) {
            console.error('Error obteniendo pago de tienda:', err);
            return;
        }
        
        if (payment) {
            // Actualizar suscripción del tenant
            const renewalData = {
                plan: payment.plan,
                subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                payment_status: 'active',
                last_payment: new Date().toISOString(),
                transaction_id: paymentId
            };
            
            // Actualizar tenant
            const updateSql = `UPDATE tenants SET plan = ?, subscription_end = ?, 
                              payment_status = ?, last_payment = ?, transaction_id = ?
                              WHERE id = ?`;
            
            db.run(updateSql, [
                renewalData.plan,
                renewalData.subscription_end,
                renewalData.payment_status,
                renewalData.last_payment,
                renewalData.transaction_id,
                payment.tenant_id
            ], function(err) {
                if (err) {
                    console.error('Error renovando suscripción de tienda:', err);
                } else {
                    console.log(`✅ Suscripción renovada para tienda: ${payment.tenant_id}`);
                    
                    // Registrar comisión
                    this.recordCresaliaCommission(payment.tenant_id, payment.amount, payment.commission);
                }
            });
        }
    });
}

// Registrar comisión de Cresalia
function recordCresaliaCommission(tenantId, amount, commission) {
    const sql = `
        INSERT INTO cresalia_commissions 
        (tenant_id, transaction_amount, commission_amount, commission_rate, created_at)
        VALUES (?, ?, ?, 0.1, ?)
    `;
    
    db.run(sql, [tenantId, amount, commission, new Date().toISOString()], function(err) {
        if (err) {
            console.error('Error registrando comisión:', err);
        } else {
            console.log(`💰 Comisión registrada: $${commission} de $${amount} para tenant ${tenantId}`);
        }
    });
}

// Obtener estadísticas de comisiones
app.get('/api/payments/commissions/stats', (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) as total_transactions,
            SUM(transaction_amount) as total_revenue,
            SUM(commission_amount) as total_commissions,
            AVG(commission_amount) as avg_commission
        FROM cresalia_commissions
        WHERE created_at >= datetime('now', '-30 days')
    `;
    
    db.get(sql, [], (err, row) => {
        if (err) {
            console.error('Error obteniendo estadísticas de comisiones:', err);
            return res.status(500).json({ error: 'Error obteniendo estadísticas' });
        }
        
        res.json({
            success: true,
            stats: {
                total_transactions: row.total_transactions || 0,
                total_revenue: row.total_revenue || 0,
                total_commissions: row.total_commissions || 0,
                avg_commission: row.avg_commission || 0,
                period: 'last_30_days',
                last_check: new Date().toISOString()
            }
        });
    });
});

// ===== ENDPOINTS DE PAGOS HÍBRIDOS =====

// Guardar configuración de ventas de una tienda
app.post('/api/tenants/:id/sales-payment-config', (req, res) => {
    const { id } = req.params;
    const { email, access_token, public_key, configured_at, type } = req.body;
    
    const sql = `
        INSERT OR REPLACE INTO tenant_sales_config 
        (tenant_id, email, access_token, public_key, configured_at, type, status)
        VALUES (?, ?, ?, ?, ?, ?, 'active')
    `;
    
    db.run(sql, [id, email, access_token, public_key, configured_at, type], function(err) {
        if (err) {
            console.error('Error guardando configuración de ventas:', err);
            return res.status(500).json({ error: 'Error guardando configuración' });
        }
        
        res.json({ 
            success: true, 
            message: 'Configuración de ventas guardada',
            changes: this.changes 
        });
    });
});

// Obtener configuración de ventas de una tienda
app.get('/api/tenants/:id/sales-payment-config', (req, res) => {
    const { id } = req.params;
    
    const sql = `SELECT * FROM tenant_sales_config WHERE tenant_id = ? AND status = 'active'`;
    
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Error obteniendo configuración de ventas:', err);
            return res.status(500).json({ error: 'Error obteniendo configuración' });
        }
        
        if (row) {
            res.json({ 
                success: true, 
                config: {
                    email: row.email,
                    access_token: row.access_token,
                    public_key: row.public_key,
                    configured_at: row.configured_at,
                    type: row.type
                }
            });
        } else {
            res.json({ 
                success: false, 
                message: 'Configuración de ventas no encontrada' 
            });
        }
    });
});

// Verificar configuración de ventas
app.post('/api/payments/verify-sales-config', (req, res) => {
    const { tenant_id, access_token, public_key, type } = req.body;
    
    // En producción, aquí verificarías con la API de Mercado Pago
    // const mercadopago = require('mercadopago');
    // mercadopago.configure({ access_token });
    
    // Simulación para demo
    const isValid = access_token.startsWith('APP_USR_') && public_key.startsWith('APP_USR_');
    
    if (isValid) {
        res.json({ 
            success: true, 
            message: 'Configuración de ventas válida',
            verified_at: new Date().toISOString()
        });
    } else {
        res.json({ 
            success: false, 
            error: 'Credenciales inválidas' 
        });
    }
});

// Crear suscripción para Cresalia
app.post('/api/payments/mercadopago/cresalia-subscription', (req, res) => {
    const { tenant_id, preference, cresalia_config } = req.body;
    
    // En producción, aquí usarías el SDK de Mercado Pago con las credenciales de Cresalia
    // const mercadopago = require('mercadopago');
    // mercadopago.configure({ access_token: cresalia_config.access_token });
    
    // Simulación para demo
    const subscriptionPreference = {
        id: `cresalia_sub_${tenant_id}_${Date.now()}`,
        init_point: `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=cresalia_sub_${tenant_id}_${Date.now()}`,
        items: preference.items,
        payer: preference.payer,
        back_urls: preference.back_urls,
        external_reference: preference.external_reference,
        metadata: preference.metadata
    };
    
    // Guardar suscripción
    const sql = `
        INSERT INTO cresalia_subscriptions 
        (id, tenant_id, plan, amount, status, cresalia_email, created_at)
        VALUES (?, ?, ?, ?, 'pending', ?, ?)
    `;
    
    db.run(sql, [
        subscriptionPreference.id,
        tenant_id,
        preference.metadata.plan,
        preference.items[0].unit_price,
        cresalia_config.email,
        new Date().toISOString()
    ], function(err) {
        if (err) {
            console.error('Error guardando suscripción de Cresalia:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({
            success: true,
            id: subscriptionPreference.id,
            init_point: subscriptionPreference.init_point
        });
    });
});

// Crear venta para tienda
app.post('/api/payments/mercadopago/store-sale', (req, res) => {
    const { tenant_id, preference, sales_config } = req.body;
    
    // En producción, aquí usarías el SDK de Mercado Pago con las credenciales de la tienda
    // const mercadopago = require('mercadopago');
    // mercadopago.configure({ access_token: sales_config.access_token });
    
    // Simulación para demo
    const salePreference = {
        id: `store_sale_${tenant_id}_${Date.now()}`,
        init_point: `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=store_sale_${tenant_id}_${Date.now()}`,
        items: preference.items,
        payer: preference.payer,
        back_urls: preference.back_urls,
        external_reference: preference.external_reference,
        metadata: preference.metadata
    };
    
    // Guardar venta
    const sql = `
        INSERT INTO store_sales 
        (id, tenant_id, product_id, amount, status, store_email, created_at)
        VALUES (?, ?, ?, ?, 'pending', ?, ?)
    `;
    
    db.run(sql, [
        salePreference.id,
        tenant_id,
        preference.metadata.product_id,
        preference.items[0].unit_price,
        sales_config.email,
        new Date().toISOString()
    ], function(err) {
        if (err) {
            console.error('Error guardando venta de tienda:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({
            success: true,
            id: salePreference.id,
            init_point: salePreference.init_point
        });
    });
});

// Webhook para suscripciones de Cresalia
app.post('/api/payments/mercadopago/cresalia-webhook', (req, res) => {
    const { type, data } = req.body;
    
    if (type === 'payment') {
        const paymentId = data.id;
        
        // En producción, aquí verificarías el pago con Mercado Pago
        // const payment = await mercadopago.payment.findById(paymentId);
        
        // Simulación para demo
        const paymentStatus = Math.random() > 0.1 ? 'approved' : 'rejected';
        
        // Actualizar estado de la suscripción
        const sql = `UPDATE cresalia_subscriptions SET status = ?, updated_at = ? WHERE id = ?`;
        
        db.run(sql, [paymentStatus, new Date().toISOString(), paymentId], function(err) {
            if (err) {
                console.error('Error actualizando suscripción de Cresalia:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            
            // Si la suscripción fue aprobada, activar plan
            if (paymentStatus === 'approved') {
                this.activateCresaliaSubscription(paymentId);
            }
            
            res.json({ success: true, status: paymentStatus });
        });
    } else {
        res.json({ success: true, message: 'Webhook recibido' });
    }
});

// Webhook para ventas de tiendas
app.post('/api/payments/mercadopago/store-sale-webhook', (req, res) => {
    const { type, data } = req.body;
    
    if (type === 'payment') {
        const paymentId = data.id;
        
        // En producción, aquí verificarías el pago con Mercado Pago
        // const payment = await mercadopago.payment.findById(paymentId);
        
        // Simulación para demo
        const paymentStatus = Math.random() > 0.1 ? 'approved' : 'rejected';
        
        // Actualizar estado de la venta
        const sql = `UPDATE store_sales SET status = ?, updated_at = ? WHERE id = ?`;
        
        db.run(sql, [paymentStatus, new Date().toISOString(), paymentId], function(err) {
            if (err) {
                console.error('Error actualizando venta de tienda:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            
            // Si la venta fue aprobada, notificar a Crisla
            if (paymentStatus === 'approved') {
                this.notifyCrislaSale(paymentId);
            }
            
            res.json({ success: true, status: paymentStatus });
        });
    } else {
        res.json({ success: true, message: 'Webhook recibido' });
    }
});

// Activar suscripción de Cresalia
function activateCresaliaSubscription(paymentId) {
    // Obtener información de la suscripción
    const sql = `SELECT * FROM cresalia_subscriptions WHERE id = ?`;
    
    db.get(sql, [paymentId], (err, subscription) => {
        if (err) {
            console.error('Error obteniendo suscripción de Cresalia:', err);
            return;
        }
        
        if (subscription) {
            // Actualizar suscripción del tenant
            const renewalData = {
                plan: subscription.plan,
                subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                payment_status: 'active',
                last_payment: new Date().toISOString(),
                transaction_id: paymentId
            };
            
            // Actualizar tenant
            const updateSql = `UPDATE tenants SET plan = ?, subscription_end = ?, 
                              payment_status = ?, last_payment = ?, transaction_id = ?
                              WHERE id = ?`;
            
            db.run(updateSql, [
                renewalData.plan,
                renewalData.subscription_end,
                renewalData.payment_status,
                renewalData.last_payment,
                renewalData.transaction_id,
                subscription.tenant_id
            ], function(err) {
                if (err) {
                    console.error('Error activando suscripción:', err);
                } else {
                    console.log(`✅ Suscripción activada para tienda: ${subscription.tenant_id}`);
                    console.log(`💰 Pago recibido por Cresalia: $${subscription.amount}`);
                }
            });
        }
    });
}

// Notificar venta a Crisla
function notifyCrislaSale(paymentId) {
    // Obtener información de la venta
    const sql = `SELECT * FROM store_sales WHERE id = ?`;
    
    db.get(sql, [paymentId], (err, sale) => {
        if (err) {
            console.error('Error obteniendo venta:', err);
            return;
        }
        
        if (sale) {
            console.log(`🛍️ Venta procesada para tienda: ${sale.tenant_id}`);
            console.log(`💰 Venta: $${sale.amount} (va a la tienda)`);
            
            // Aquí podrías enviar notificación a Crisla si quieres
            // Pero la venta va 100% a la tienda
        }
    });
}

// Obtener estadísticas híbridas
app.get('/api/payments/hybrid/stats', (req, res) => {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM cresalia_subscriptions WHERE status = 'approved') as total_subscriptions,
            (SELECT SUM(amount) FROM cresalia_subscriptions WHERE status = 'approved') as total_subscription_revenue,
            (SELECT COUNT(*) FROM store_sales WHERE status = 'approved') as total_sales,
            (SELECT SUM(amount) FROM store_sales WHERE status = 'approved') as total_sales_revenue
    `;
    
    db.get(sql, [], (err, row) => {
        if (err) {
            console.error('Error obteniendo estadísticas híbridas:', err);
            return res.status(500).json({ error: 'Error obteniendo estadísticas' });
        }
        
        res.json({
            success: true,
            stats: {
                subscriptions: {
                    count: row.total_subscriptions || 0,
                    revenue: row.total_subscription_revenue || 0
                },
                sales: {
                    count: row.total_sales || 0,
                    revenue: row.total_sales_revenue || 0
                },
                last_check: new Date().toISOString()
            }
        });
    });
});

// ===== ENDPOINTS DE PAGOS SIMPLES =====

// Guardar configuración simple de ventas
app.post('/api/tenants/:id/simple-sales-config', (req, res) => {
    const { id } = req.params;
    const { email, configured_at, type } = req.body;
    
    const sql = `
        INSERT OR REPLACE INTO simple_sales_config 
        (tenant_id, email, configured_at, type, status, created_at)
        VALUES (?, ?, ?, ?, 'active', ?)
    `;
    
    db.run(sql, [id, email, configured_at, type, new Date().toISOString()], function(err) {
        if (err) {
            console.error('Error guardando configuración simple:', err);
            return res.status(500).json({ error: 'Error guardando configuración' });
        }
        
        res.json({ 
            success: true, 
            message: 'Configuración simple guardada',
            changes: this.changes 
        });
    });
});

// Obtener configuración simple de ventas
app.get('/api/tenants/:id/simple-sales-config', (req, res) => {
    const { id } = req.params;
    
    const sql = `SELECT * FROM simple_sales_config WHERE tenant_id = ? AND status = 'active'`;
    
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Error obteniendo configuración simple:', err);
            return res.status(500).json({ error: 'Error obteniendo configuración' });
        }
        
        if (row) {
            res.json({ 
                success: true, 
                config: {
                    email: row.email,
                    configured_at: row.configured_at,
                    type: row.type
                }
            });
        } else {
            res.json({ 
                success: false, 
                message: 'Configuración simple no encontrada' 
            });
        }
    });
});

// Crear suscripción simple (link para Cresalia)
app.post('/api/payments/simple-subscription', (req, res) => {
    const { tenant_id, plan, amount, cresalia_email } = req.body;
    
    // Generar ID único
    const subscriptionId = `simple_sub_${tenant_id}_${Date.now()}`;
    
    // Generar link de pago (en producción sería un link real de MP)
    const paymentLink = `https://mpago.la/${Math.random().toString(36).substr(2, 8)}`;
    
    // Guardar suscripción
    const sql = `
        INSERT INTO simple_subscriptions 
        (id, tenant_id, plan, amount, status, cresalia_email, payment_link, created_at)
        VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)
    `;
    
    db.run(sql, [
        subscriptionId,
        tenant_id,
        plan,
        amount,
        cresalia_email,
        paymentLink,
        new Date().toISOString()
    ], function(err) {
        if (err) {
            console.error('Error guardando suscripción simple:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({
            success: true,
            id: subscriptionId,
            payment_link: paymentLink,
            message: 'Link de pago generado para Cresalia'
        });
    });
});

// Crear venta simple (link para tienda)
app.post('/api/payments/simple-sale', (req, res) => {
    const { tenant_id, product, amount, store_email } = req.body;
    
    // Generar ID único
    const saleId = `simple_sale_${tenant_id}_${Date.now()}`;
    
    // Generar link de pago (en producción sería un link real de MP)
    const paymentLink = `https://mpago.la/${Math.random().toString(36).substr(2, 8)}`;
    
    // Guardar venta
    const sql = `
        INSERT INTO simple_sales 
        (id, tenant_id, product_id, amount, status, store_email, payment_link, created_at)
        VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)
    `;
    
    db.run(sql, [
        saleId,
        tenant_id,
        product.id || 'producto',
        amount,
        store_email,
        paymentLink,
        new Date().toISOString()
    ], function(err) {
        if (err) {
            console.error('Error guardando venta simple:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({
            success: true,
            id: saleId,
            payment_link: paymentLink,
            message: 'Link de pago generado para la tienda'
        });
    });
});

// Confirmar pago de suscripción
app.post('/api/payments/simple-subscription/confirm', (req, res) => {
    const { subscription_id, payment_confirmed } = req.body;
    
    const status = payment_confirmed ? 'approved' : 'rejected';
    
    // Actualizar suscripción
    const sql = `UPDATE simple_subscriptions SET status = ?, updated_at = ? WHERE id = ?`;
    
    db.run(sql, [status, new Date().toISOString(), subscription_id], function(err) {
        if (err) {
            console.error('Error confirmando suscripción:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (payment_confirmed) {
            // Activar suscripción
            this.activateSimpleSubscription(subscription_id);
        }
        
        res.json({ 
            success: true, 
            status: status,
            message: payment_confirmed ? 'Suscripción activada' : 'Suscripción rechazada'
        });
    });
});

// Confirmar pago de venta
app.post('/api/payments/simple-sale/confirm', (req, res) => {
    const { sale_id, payment_confirmed } = req.body;
    
    const status = payment_confirmed ? 'approved' : 'rejected';
    
    // Actualizar venta
    const sql = `UPDATE simple_sales SET status = ?, updated_at = ? WHERE id = ?`;
    
    db.run(sql, [status, new Date().toISOString(), sale_id], function(err) {
        if (err) {
            console.error('Error confirmando venta:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (payment_confirmed) {
            // Notificar venta exitosa
            this.notifySimpleSale(sale_id);
        }
        
        res.json({ 
            success: true, 
            status: status,
            message: payment_confirmed ? 'Venta confirmada' : 'Venta rechazada'
        });
    });
});

// Activar suscripción simple
function activateSimpleSubscription(subscriptionId) {
    // Obtener información de la suscripción
    const sql = `SELECT * FROM simple_subscriptions WHERE id = ?`;
    
    db.get(sql, [subscriptionId], (err, subscription) => {
        if (err) {
            console.error('Error obteniendo suscripción simple:', err);
            return;
        }
        
        if (subscription) {
            // Actualizar suscripción del tenant
            const renewalData = {
                plan: subscription.plan,
                subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                payment_status: 'active',
                last_payment: new Date().toISOString(),
                transaction_id: subscriptionId
            };
            
            // Actualizar tenant
            const updateSql = `UPDATE tenants SET plan = ?, subscription_end = ?, 
                              payment_status = ?, last_payment = ?, transaction_id = ?
                              WHERE id = ?`;
            
            db.run(updateSql, [
                renewalData.plan,
                renewalData.subscription_end,
                renewalData.payment_status,
                renewalData.last_payment,
                renewalData.transaction_id,
                subscription.tenant_id
            ], function(err) {
                if (err) {
                    console.error('Error activando suscripción simple:', err);
                } else {
                    console.log(`✅ Suscripción simple activada para tienda: ${subscription.tenant_id}`);
                    console.log(`💰 Pago recibido por Cresalia: $${subscription.amount}`);
                }
            });
        }
    });
}

// Notificar venta simple
function notifySimpleSale(saleId) {
    // Obtener información de la venta
    const sql = `SELECT * FROM simple_sales WHERE id = ?`;
    
    db.get(sql, [saleId], (err, sale) => {
        if (err) {
            console.error('Error obteniendo venta simple:', err);
            return;
        }
        
        if (sale) {
            console.log(`🛍️ Venta simple procesada para tienda: ${sale.tenant_id}`);
            console.log(`💰 Venta: $${sale.amount} (va a la tienda)`);
        }
    });
}

// Obtener estadísticas simples
app.get('/api/payments/simple/stats', (req, res) => {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM simple_subscriptions WHERE status = 'approved') as total_subscriptions,
            (SELECT SUM(amount) FROM simple_subscriptions WHERE status = 'approved') as total_subscription_revenue,
            (SELECT COUNT(*) FROM simple_sales WHERE status = 'approved') as total_sales,
            (SELECT SUM(amount) FROM simple_sales WHERE status = 'approved') as total_sales_revenue
    `;
    
    db.get(sql, [], (err, row) => {
        if (err) {
            console.error('Error obteniendo estadísticas simples:', err);
            return res.status(500).json({ error: 'Error obteniendo estadísticas' });
        }
        
        res.json({
            success: true,
            stats: {
                subscriptions: {
                    count: row.total_subscriptions || 0,
                    revenue: row.total_subscription_revenue || 0
                },
                sales: {
                    count: row.total_sales || 0,
                    revenue: row.total_sales_revenue || 0
                },
                last_check: new Date().toISOString()
            }
        });
    });
});

// ==================== RUTAS PÚBLICAS (SIN TENANT) ====================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '2.0.0-multitenancy'
    });
});

// Listar todos los tenants activos (para directorio de tiendas)
app.get('/api/tenants', (req, res) => {
    db.all(`SELECT id, slug, nombre_empresa, eslogan, descripcion, logo_url, 
                   color_primario, color_secundario, created_at 
            FROM tenants WHERE activo = 1 AND estado = 'activo'
            ORDER BY created_at DESC`, 
    (err, tenants) => {
        if (err) {
            console.error('Error al obtener tenants:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json({ tenants });
    });
});

// ==================== RUTAS CON TENANT (PATH-BASED) ====================

// Obtener configuración del tenant
app.get('/api/:tenant/config', identifyTenant, (req, res) => {
    const config = {
        id: req.tenant.id,
        slug: req.tenant.slug,
        nombre: req.tenant.nombre_empresa,
        eslogan: req.tenant.eslogan,
        descripcion: req.tenant.descripcion,
        logo: req.tenant.logo_url,
        favicon: req.tenant.favicon_url,
        colores: {
            primario: req.tenant.color_primario,
            secundario: req.tenant.color_secundario,
            acento: req.tenant.color_acento
        },
        fuente: req.tenant.fuente_principal,
        moneda: req.tenant.moneda,
        idioma: req.tenant.idioma,
        envio: {
            costo: req.tenant.costo_envio,
            gratis_desde: req.tenant.envio_gratis_desde
        },
        pagos: {
            online: req.tenant.permite_pagos_online,
            efectivo: req.tenant.permite_pagos_efectivo
        }
    };
    
    res.json({ config });
});

// Obtener productos del tenant
app.get('/api/:tenant/productos', identifyTenant, (req, res) => {
    const { categoria, destacado, busqueda, ordenar, limite = 20, pagina = 1 } = req.query;
    
    let query = `
        SELECT p.*, c.nombre as categoria_nombre 
        FROM productos p 
        LEFT JOIN categorias c ON p.categoria_id = c.id 
        WHERE p.tenant_id = ? AND p.activo = 1
    `;
    let params = [req.tenantId];
    
    // Filtros
    if (categoria) {
        query += ' AND p.categoria_id = ?';
        params.push(categoria);
    }
    
    if (destacado === 'true') {
        query += ' AND p.destacado = 1';
    }
    
    if (busqueda) {
        query += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
        params.push(`%${busqueda}%`, `%${busqueda}%`);
    }
    
    // Ordenamiento
    switch (ordenar) {
        case 'precio_asc':
            query += ' ORDER BY p.precio ASC';
            break;
        case 'precio_desc':
            query += ' ORDER BY p.precio DESC';
            break;
        case 'nombre':
            query += ' ORDER BY p.nombre ASC';
            break;
        case 'destacado':
            query += ' ORDER BY p.destacado DESC, p.nombre ASC';
            break;
        case 'popular':
            query += ' ORDER BY p.ventas_totales DESC';
            break;
        default:
            query += ' ORDER BY p.created_at DESC';
    }
    
    // Paginación
    const offset = (pagina - 1) * limite;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limite), offset);
    
    db.all(query, params, (err, productos) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        // Procesar JSON
        productos.forEach(producto => {
            if (producto.imagenes) {
                try {
                    producto.imagenes = JSON.parse(producto.imagenes);
                } catch (e) {
                    producto.imagenes = [];
                }
            }
            if (producto.caracteristicas) {
                try {
                    producto.caracteristicas = JSON.parse(producto.caracteristicas);
                } catch (e) {
                    producto.caracteristicas = {};
                }
            }
        });
        
        res.json({ productos, tenant: req.tenant.slug });
    });
});

// Obtener un producto específico
app.get('/api/:tenant/productos/:id', identifyTenant, (req, res) => {
    const productId = req.params.id;
    
    db.get(`SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id 
            WHERE p.id = ? AND p.tenant_id = ? AND p.activo = 1`,
        [productId, req.tenantId],
        (err, producto) => {
            if (err) {
                console.error('Error al obtener producto:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            
            // Procesar JSON
            if (producto.imagenes) {
                try {
                    producto.imagenes = JSON.parse(producto.imagenes);
                } catch (e) {
                    producto.imagenes = [];
                }
            }
            if (producto.caracteristicas) {
                try {
                    producto.caracteristicas = JSON.parse(producto.caracteristicas);
                } catch (e) {
                    producto.caracteristicas = {};
                }
            }
            
            // Incrementar visitas
            db.run('UPDATE productos SET visitas = visitas + 1 WHERE id = ?', [productId]);
            
            res.json({ producto });
        });
});

// Obtener categorías del tenant
app.get('/api/:tenant/categorias', identifyTenant, (req, res) => {
    db.all(`SELECT c.*, COUNT(p.id) as productos_count 
            FROM categorias c 
            LEFT JOIN productos p ON c.id = p.categoria_id AND p.activo = 1
            WHERE c.tenant_id = ? AND c.activo = 1 
            GROUP BY c.id 
            ORDER BY c.orden ASC, c.nombre ASC`,
        [req.tenantId],
        (err, categorias) => {
            if (err) {
                console.error('Error al obtener categorías:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            res.json({ categorias });
        });
});

// Crear orden
app.post('/api/:tenant/ordenes', identifyTenant, (req, res) => {
    const {
        cliente_nombre,
        cliente_email,
        cliente_telefono,
        productos,
        direccion_envio,
        ciudad,
        codigo_postal,
        metodo_pago,
        notas_cliente,
        cupon_codigo
    } = req.body;

    // Validaciones básicas
    if (!cliente_nombre || !cliente_email || !productos || productos.length === 0) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'Se requiere nombre, email y al menos un producto'
        });
    }

    // Generar número de orden único
    const numeroOrden = `ORD-${req.tenant.slug.toUpperCase()}-${Date.now()}`;

    // Calcular totales (simplificado - debería validar con productos reales)
    const subtotal = productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
    const costoEnvio = subtotal >= req.tenant.envio_gratis_desde ? 0 : req.tenant.costo_envio;
    const total = subtotal + costoEnvio;

    // Insertar orden
    db.run(`INSERT INTO ordenes (
        tenant_id, numero_orden, cliente_nombre, cliente_email, cliente_telefono,
        subtotal, costo_envio, total, direccion_envio, ciudad, codigo_postal,
        metodo_pago, notas_cliente, ip_address, user_agent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.tenantId, numeroOrden, cliente_nombre, cliente_email, cliente_telefono,
         subtotal, costoEnvio, total, direccion_envio, ciudad, codigo_postal,
         metodo_pago, notas_cliente, req.ip, req.get('user-agent')],
        function(err) {
            if (err) {
                console.error('Error al crear orden:', err);
                return res.status(500).json({ error: 'Error al procesar la orden' });
            }

            const ordenId = this.lastID;

            // Insertar items de la orden
            const stmt = db.prepare(`INSERT INTO orden_items (
                orden_id, producto_id, producto_nombre, cantidad, precio_unitario, subtotal
            ) VALUES (?, ?, ?, ?, ?, ?)`);

            productos.forEach(producto => {
                stmt.run([
                    ordenId,
                    producto.id,
                    producto.nombre,
                    producto.cantidad,
                    producto.precio,
                    producto.precio * producto.cantidad
                ]);
            });

            stmt.finalize();

            res.status(201).json({
                success: true,
                orden: {
                    id: ordenId,
                    numero_orden: numeroOrden,
                    total: total
                }
            });
        });
});

// ==================== RUTAS DE FAQs ====================

// Obtener FAQs del tenant
app.get('/api/:tenant/faqs', identifyTenant, (req, res) => {
    const { categoria, busqueda, limite = 50 } = req.query;
    
    let query = 'SELECT * FROM faqs WHERE tenant_id = ? AND activo = 1';
    let params = [req.tenantId];
    
    if (categoria) {
        query += ' AND categoria = ?';
        params.push(categoria);
    }
    
    if (busqueda) {
        query += ' AND (pregunta LIKE ? OR respuesta LIKE ? OR tags LIKE ?)';
        const searchTerm = `%${busqueda}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }
    
    query += ' ORDER BY orden ASC, created_at DESC LIMIT ?';
    params.push(parseInt(limite));
    
    db.all(query, params, (err, faqs) => {
        if (err) {
            console.error('Error obteniendo FAQs:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        // Parsear tags JSON
        faqs.forEach(faq => {
            if (faq.tags) {
                try {
                    faq.tags = JSON.parse(faq.tags);
                } catch (e) {
                    faq.tags = [];
                }
            }
        });
        
        res.json({ faqs });
    });
});

// Obtener categorías de FAQs
app.get('/api/:tenant/faqs/categorias', identifyTenant, (req, res) => {
    db.all(`SELECT DISTINCT categoria, COUNT(*) as count 
            FROM faqs 
            WHERE tenant_id = ? AND activo = 1 
            GROUP BY categoria 
            ORDER BY categoria`,
        [req.tenantId],
        (err, categorias) => {
            if (err) {
                console.error('Error obteniendo categorías:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            res.json({ categorias });
        });
});

// Registrar vista de FAQ
app.post('/api/:tenant/faqs/:id/view', identifyTenant, (req, res) => {
    const faqId = req.params.id;
    
    db.run('UPDATE faqs SET visitas = visitas + 1 WHERE id = ? AND tenant_id = ?',
        [faqId, req.tenantId],
        (err) => {
            if (err) {
                console.error('Error registrando vista:', err);
                return res.status(500).json({ error: 'Error interno' });
            }
            res.json({ success: true });
        });
});

// Marcar FAQ como útil/no útil
app.post('/api/:tenant/faqs/:id/vote', identifyTenant, (req, res) => {
    const faqId = req.params.id;
    const { helpful } = req.body; // true o false
    
    const field = helpful ? 'votos_util' : 'votos_no_util';
    
    db.run(`UPDATE faqs SET ${field} = ${field} + 1 WHERE id = ? AND tenant_id = ?`,
        [faqId, req.tenantId],
        (err) => {
            if (err) {
                console.error('Error registrando voto:', err);
                return res.status(500).json({ error: 'Error interno' });
            }
            res.json({ success: true });
        });
});

// Crear FAQ (solo admin)
app.post('/api/:tenant/faqs', identifyTenant, (req, res) => {
    // TODO: Verificar que sea admin
    const { categoria, pregunta, respuesta, tags, orden } = req.body;
    
    if (!pregunta || !respuesta) {
        return res.status(400).json({ error: 'Pregunta y respuesta son requeridas' });
    }
    
    const tagsJSON = tags ? JSON.stringify(tags) : null;
    
    db.run(`INSERT INTO faqs (tenant_id, categoria, pregunta, respuesta, tags, orden)
            VALUES (?, ?, ?, ?, ?, ?)`,
        [req.tenantId, categoria || 'General', pregunta, respuesta, tagsJSON, orden || 0],
        function(err) {
            if (err) {
                console.error('Error creando FAQ:', err);
                return res.status(500).json({ error: 'Error al crear FAQ' });
            }
            
            res.status(201).json({
                success: true,
                faq: {
                    id: this.lastID,
                    pregunta,
                    respuesta
                }
            });
        });
});

// Obtener estadísticas del tenant (solo para admin)
app.get('/api/:tenant/stats', identifyTenant, (req, res) => {
    // TODO: Agregar autenticación de admin
    
    db.get(`SELECT 
            COUNT(DISTINCT id) as total_productos,
            COUNT(DISTINCT CASE WHEN activo = 1 THEN id END) as productos_activos,
            SUM(stock) as stock_total
        FROM productos WHERE tenant_id = ?`,
        [req.tenantId],
        (err, productosStats) => {
            if (err) {
                console.error('Error al obtener stats de productos:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            db.get(`SELECT 
                    COUNT(*) as total_ordenes,
                    SUM(total) as ingresos_totales,
                    AVG(total) as ticket_promedio
                FROM ordenes WHERE tenant_id = ?`,
                [req.tenantId],
                (err, ordenesStats) => {
                    if (err) {
                        console.error('Error al obtener stats de órdenes:', err);
                        return res.status(500).json({ error: 'Error interno del servidor' });
                    }

                    res.json({
                        productos: productosStats,
                        ordenes: ordenesStats,
                        tenant: {
                            nombre: req.tenant.nombre_empresa,
                            plan: req.tenant.plan,
                            limite_productos: req.tenant.limite_productos,
                            limite_ordenes: req.tenant.limite_ordenes_mes
                        }
                    });
                });
        });
});

// ==================== RUTAS DE AUTENTICACIÓN ====================

// Login de admin del tenant
app.post('/api/:tenant/auth/admin/login', identifyTenant, (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'Email y contraseña son requeridos' 
        });
    }

    db.get(`SELECT * FROM usuarios 
            WHERE tenant_id = ? AND email = ? AND rol = 'admin_tenant' AND activo = 1`,
        [req.tenantId, email],
        (err, user) => {
            if (err) {
                console.error('Error en login admin:', err);
                return res.status(500).json({ 
                    success: false,
                    message: 'Error interno del servidor' 
                });
            }

            if (!user) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Credenciales inválidas o no tienes permisos de administrador' 
                });
            }

            // En producción, usar bcrypt para verificar password
            // const bcrypt = require('bcryptjs');
            // const passwordMatch = bcrypt.compareSync(password, user.password);
            
            // Por ahora, comparación simple (CAMBIAR en producción)
            if (user.password !== password) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Contraseña incorrecta' 
                });
            }

            // Actualizar último acceso
            db.run('UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

            // En producción, generar JWT token real
            const token = `token_${user.id}_${Date.now()}`;

            res.json({
                success: true,
                message: 'Login exitoso',
                token: token,
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol
                }
            });
        });
});

// Login de cliente (comprador)
app.post('/api/:tenant/auth/cliente/login', identifyTenant, (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'Email y contraseña son requeridos' 
        });
    }

    db.get(`SELECT * FROM usuarios 
            WHERE tenant_id = ? AND email = ? AND rol = 'cliente' AND activo = 1`,
        [req.tenantId, email],
        (err, user) => {
            if (err) {
                console.error('Error en login cliente:', err);
                return res.status(500).json({ 
                    success: false,
                    message: 'Error interno del servidor' 
                });
            }

            if (!user) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Email o contraseña incorrectos' 
                });
            }

            // Verificar password (en producción usar bcrypt)
            if (user.password !== password) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Email o contraseña incorrectos' 
                });
            }

            // Actualizar último acceso
            db.run('UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

            const token = `token_${user.id}_${Date.now()}`;

            res.json({
                success: true,
                message: 'Login exitoso',
                token: token,
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol
                }
            });
        });
});

// Registro de cliente
app.post('/api/:tenant/auth/cliente/register', identifyTenant, (req, res) => {
    const { nombre, email, password, telefono } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'Nombre, email y contraseña son requeridos' 
        });
    }

    // Verificar si el email ya existe
    db.get('SELECT id FROM usuarios WHERE tenant_id = ? AND email = ?',
        [req.tenantId, email],
        (err, existing) => {
            if (err) {
                console.error('Error verificando email:', err);
                return res.status(500).json({ 
                    success: false,
                    message: 'Error interno del servidor' 
                });
            }

            if (existing) {
                return res.status(409).json({ 
                    success: false,
                    message: 'Este email ya está registrado' 
                });
            }

            // Crear usuario (en producción, hashear password con bcrypt)
            db.run(`INSERT INTO usuarios (tenant_id, nombre, email, password, telefono, rol)
                    VALUES (?, ?, ?, ?, ?, 'cliente')`,
                [req.tenantId, nombre, email, password, telefono],
                function(err) {
                    if (err) {
                        console.error('Error creando usuario:', err);
                        return res.status(500).json({ 
                            success: false,
                            message: 'Error al registrar usuario' 
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: 'Usuario registrado exitosamente',
                        userId: this.lastID
                    });
                });
        });
});

// Verificar rol de usuario
app.get('/api/:tenant/auth/verificar-rol', identifyTenant, (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ esAdmin: false });
    }

    db.get('SELECT rol FROM usuarios WHERE tenant_id = ? AND email = ?',
        [req.tenantId, email],
        (err, user) => {
            if (err || !user) {
                return res.json({ esAdmin: false });
            }

            res.json({ 
                esAdmin: user.rol === 'admin_tenant',
                rol: user.rol 
            });
        });
});

// ==================== SISTEMA DE APOYO EMPRENDEDOR ====================

// Registrar check-in emocional
app.post('/api/:tenant/apoyo/checkin', identifyTenant, (req, res) => {
    const { emocion, metricas, anonimo, timestamp } = req.body;
    
    db.run(`INSERT INTO apoyo_checkins 
            (tenant_id, emocion, metricas, anonimo, created_at)
            VALUES (?, ?, ?, ?, ?)`,
        [req.tenantId, emocion, JSON.stringify(metricas), anonimo ? 1 : 0, timestamp],
        function(err) {
            if (err) {
                console.error('Error guardando check-in:', err);
                return res.status(500).json({ error: 'Error interno' });
            }

            // Enviar notificación a Carla si es emoción negativa
            if (['dificil', 'abrumado'].includes(emocion)) {
                notifyCarlaApoyoUrgente(req.tenant, emocion, anonimo);
            }

            res.json({ success: true, checkin_id: this.lastID });
        });
});

// Enviar mensaje de apoyo (con auto-clasificación)
app.post('/api/:tenant/apoyo/mensaje', identifyTenant, (req, res) => {
    const { emocion, mensaje, metricas, anonimo, permitir_contacto, timestamp } = req.body;
    
    // Auto-clasificar urgencia
    const urgencia = clasificarUrgencia(emocion, mensaje);
    const recursos = sugerirRecursos(emocion, mensaje);
    
    // Guardar mensaje
    db.run(`INSERT INTO apoyo_mensajes 
            (tenant_id, emocion, mensaje, metricas, urgencia, anonimo, permitir_contacto, estado, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente', ?)`,
        [req.tenantId, emocion, mensaje, JSON.stringify(metricas), urgencia, anonimo ? 1 : 0, permitir_contacto ? 1 : 0, timestamp],
        function(err) {
            if (err) {
                console.error('Error guardando mensaje:', err);
                return res.status(500).json({ error: 'Error interno' });
            }

            const mensajeId = this.lastID;

            // Notificar a Carla si es urgente
            if (urgencia === 'critica' || urgencia === 'alta') {
                notifyCarlaApoyoUrgente({
                    tenant: req.tenant.nombre_empresa,
                    tenant_slug: req.tenant.slug,
                    emocion: emocion,
                    mensaje: mensaje,
                    urgencia: urgencia,
                    anonimo: anonimo,
                    mensaje_id: mensajeId
                });
            }

            res.json({ 
                success: true,
                urgencia: urgencia,
                recursos_sugeridos: recursos,
                mensaje_id: mensajeId,
                tiempo_respuesta: urgencia === 'critica' ? '2-4 horas' : urgencia === 'alta' ? '4-8 horas' : '24-48 horas'
            });
        });
});

// Obtener estadísticas de apoyo (para Carla)
app.get('/api/apoyo/stats', (req, res) => {
    // Solo accesible por super admin
    db.all(`SELECT 
                emocion,
                COUNT(*) as count,
                DATE(created_at) as fecha
            FROM apoyo_checkins
            WHERE created_at >= date('now', '-30 days')
            GROUP BY emocion, DATE(created_at)
            ORDER BY fecha DESC`,
        (err, stats) => {
            if (err) {
                console.error('Error obteniendo stats de apoyo:', err);
                return res.status(500).json({ error: 'Error interno' });
            }

            // Llamadas pendientes
            db.all(`SELECT * FROM apoyo_llamadas 
                    WHERE estado = 'pendiente' 
                    ORDER BY created_at DESC`,
                (err, llamadas) => {
                    res.json({
                        checkins: stats,
                        llamadas_pendientes: llamadas || []
                    });
                });
        });
});

// Responder mensaje de apoyo (solo Carla)
app.post('/api/apoyo/responder/:mensajeId', (req, res) => {
    // TODO: Verificar que sea super admin (Carla)
    const { mensajeId } = req.params;
    const { respuesta } = req.body;
    
    if (!respuesta) {
        return res.status(400).json({ error: 'Respuesta es requerida' });
    }

    // Actualizar mensaje con respuesta
    db.run(`UPDATE apoyo_mensajes SET 
            respuesta = ?,
            respondido_por = 'Carla',
            respondido_at = CURRENT_TIMESTAMP,
            estado = 'respondido'
            WHERE id = ?`,
        [respuesta, mensajeId],
        (err) => {
            if (err) {
                console.error('Error guardando respuesta:', err);
                return res.status(500).json({ error: 'Error interno' });
            }

            // Obtener datos del tenant para notificar
            db.get(`SELECT t.*, m.anonimo, m.permitir_contacto 
                    FROM apoyo_mensajes m 
                    JOIN tenants t ON m.tenant_id = t.id 
                    WHERE m.id = ?`,
                [mensajeId],
                (err, data) => {
                    if (data && data.permitir_contacto) {
                        // Enviar notificación al emprendedor
                        notifyEmprendedorRespuesta(data);
                    }
                });

            res.json({ success: true });
        });
});

// Obtener todos los mensajes de apoyo (para Carla)
app.get('/api/apoyo/mensajes', (req, res) => {
    // TODO: Verificar que sea super admin
    const { urgencia, estado, limite = 50 } = req.query;
    
    let query = `SELECT m.*, t.nombre_empresa, t.slug, t.plan
                 FROM apoyo_mensajes m
                 JOIN tenants t ON m.tenant_id = t.id
                 WHERE 1=1`;
    let params = [];
    
    if (urgencia) {
        query += ' AND m.urgencia = ?';
        params.push(urgencia);
    }
    
    if (estado) {
        query += ' AND m.estado = ?';
        params.push(estado);
    }
    
    query += ' ORDER BY m.urgencia DESC, m.created_at DESC LIMIT ?';
    params.push(parseInt(limite));
    
    db.all(query, params, (err, mensajes) => {
        if (err) {
            console.error('Error obteniendo mensajes:', err);
            return res.status(500).json({ error: 'Error interno' });
        }
        
        // Parsear JSON
        mensajes.forEach(m => {
            if (m.metricas) {
                try {
                    m.metricas = JSON.parse(m.metricas);
                } catch (e) {
                    m.metricas = {};
                }
            }
        });
        
        res.json({ mensajes });
    });
});

// Funciones helper
function clasificarUrgencia(emocion, mensaje) {
    const palabrasCriticas = [
        'rendir', 'rendirme', 'dejar', 'abandonar', 'ya no puedo',
        'suicida', 'depresión', 'deprimido', 'crisis', 'ayuda urgente',
        'desesperado', 'no sé qué hacer', 'perdido todo'
    ];
    
    const palabrasAltas = [
        'abrumado', 'miedo', 'pánico', 'ansiedad', 'preocupado',
        'fracaso', 'no funciona', 'mal', 'terrible', 'difícil',
        'problema serio', 'urgente', 'desesperado'
    ];
    
    const mensajeLower = mensaje.toLowerCase();
    
    // Crítica
    if (emocion === 'abrumado' && palabrasCriticas.some(p => mensajeLower.includes(p))) {
        return 'critica';
    }
    
    // Alta
    if ((emocion === 'abrumado' || emocion === 'dificil') || 
        palabrasAltas.some(p => mensajeLower.includes(p))) {
        return 'alta';
    }
    
    // Media
    if (emocion === 'regular' || mensaje.includes('?')) {
        return 'media';
    }
    
    // Baja
    return 'baja';
}

function sugerirRecursos(emocion, mensaje) {
    const recursos = [];
    const mensajeLower = mensaje.toLowerCase();
    
    // Sugerir recursos según keywords
    if (mensajeLower.includes('venta') || mensajeLower.includes('no vend') || mensajeLower.includes('cliente')) {
        recursos.push({
            tipo: 'consejos',
            icono: '💡',
            titulo: 'Estrategias de Ventas',
            descripcion: 'Tips para conseguir tus primeras ventas'
        });
    }
    
    if (mensajeLower.includes('marketing') || mensajeLower.includes('difund') || mensajeLower.includes('promoc')) {
        recursos.push({
            tipo: 'marketing',
            icono: '📣',
            titulo: 'Marketing para Principiantes',
            descripcion: 'Cómo dar a conocer tu tienda sin gastar mucho'
        });
    }
    
    if (mensajeLower.includes('miedo') || mensajeLower.includes('duda') || mensajeLower.includes('insegur')) {
        recursos.push({
            tipo: 'motivacion',
            icono: '🔥',
            titulo: 'Supera tus Miedos',
            descripcion: 'Recordatorios y motivación para seguir adelante'
        });
    }
    
    // Siempre sugerir comunidad
    recursos.push({
        tipo: 'comunidad',
        icono: '🤝',
        titulo: 'Habla con Otros Emprendedores',
        descripcion: 'Comparte con personas que entienden por lo que pasas'
    });
    
    return recursos;
}

function notifyCarlaApoyoUrgente(data) {
    console.log(`🚨 MENSAJE URGENTE (${data.urgencia.toUpperCase()}):`, {
        tenant: data.anonimo ? '[ANÓNIMO]' : data.tenant,
        emocion: data.emocion,
        preview: data.mensaje.substring(0, 100)
    });
    // En producción: enviar email/SMS/notificación push a Carla
}

function notifyEmprendedorRespuesta(tenant) {
    console.log(`📧 Notificar respuesta a: ${tenant.nombre_empresa}`);
    // En producción: enviar email al emprendedor
}

// ==================== RUTAS DE ADMIN (CREAR NUEVO TENANT) ====================

// Crear nuevo tenant (registro de nuevo cliente)
app.post('/api/tenants/register', (req, res) => {
    const {
        slug,
        nombre_empresa,
        email_contacto,
        telefono,
        password,
        descripcion,
        plan = 'free'
    } = req.body;

    // Validaciones
    if (!slug || !nombre_empresa || !email_contacto || !password) {
        return res.status(400).json({ 
            error: 'Datos incompletos',
            message: 'Se requiere slug, nombre de empresa, email y contraseña'
        });
    }

    // Validar slug (solo minúsculas, números y guiones)
    if (!/^[a-z0-9-]+$/.test(slug)) {
        return res.status(400).json({ 
            error: 'Slug inválido',
            message: 'El slug solo puede contener letras minúsculas, números y guiones'
        });
    }

    // Configurar límites según el plan
    const planLimits = {
        free: { productos: 50, ordenes: 100 },
        basic: { productos: 200, ordenes: 500 },
        pro: { productos: 1000, ordenes: 2000 },
        enterprise: { productos: -1, ordenes: -1 } // Ilimitado
    };
    
    const limits = planLimits[plan] || planLimits.free;

    // Crear tenant
    db.run(`INSERT INTO tenants (
        slug, nombre_empresa, email_contacto, telefono, descripcion, plan, estado, limite_productos, limite_ordenes_mes
    ) VALUES (?, ?, ?, ?, ?, ?, 'activo', ?, ?)`,
        [slug, nombre_empresa, email_contacto, telefono, descripcion || '', plan, limits.productos, limits.ordenes],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(409).json({ 
                        error: 'Slug ya existe',
                        message: 'Este nombre de tienda ya está en uso'
                    });
                }
                console.error('Error al crear tenant:', err);
                return res.status(500).json({ error: 'Error al crear la tienda' });
            }

            const tenantId = this.lastID;

            // Crear usuario admin para el tenant
            const bcrypt = require('bcryptjs');
            const hashedPassword = bcrypt.hashSync(password, 10);

            db.run(`INSERT INTO usuarios (
                tenant_id, nombre, email, password, rol
            ) VALUES (?, ?, ?, ?, 'admin_tenant')`,
                [tenantId, nombre_empresa, email_contacto, hashedPassword],
                (err) => {
                    if (err) {
                        console.error('Error al crear usuario admin:', err);
                        // Rollback: eliminar tenant si falla la creación del admin
                        db.run('DELETE FROM tenants WHERE id = ?', [tenantId]);
                        return res.status(500).json({ error: 'Error al crear usuario administrador' });
                    }

                    res.status(201).json({
                        success: true,
                        message: '¡Tienda creada exitosamente!',
                        tenant: {
                            id: tenantId,
                            slug: slug,
                            nombre: nombre_empresa,
                            url: `http://localhost:${PORT}/${slug}`
                        }
                    });
                });
        });
});

// ==================== INICIAR SERVIDOR ====================

app.listen(PORT, () => {
    console.log(`\n🎉 Servidor Cresalia Multi-tenant corriendo en puerto ${PORT}`);
    console.log(`📍 URL local: http://localhost:${PORT}`);
    console.log(`🏪 Tienda demo: http://localhost:${PORT}/demo-store`);
    console.log(`\n💡 Accede a cualquier tienda: http://localhost:${PORT}/api/{slug}/productos`);
});

// ==================== RUTAS PARA CREACIÓN DE CARPETAS ====================

// Crear estructura de carpetas para nueva tienda
app.post('/api/crear-carpeta-tienda', (req, res) => {
    const { slug, nombre, descripcion, email } = req.body;
    
    if (!slug || !nombre) {
        return res.status(400).json({ error: 'Slug y nombre son requeridos' });
    }
    
    try {
        const fs = require('fs');
        const path = require('path');
        
        // Crear estructura de carpetas
        const tiendaPath = path.join(__dirname, '..', 'tiendas', slug);
        const assetsPath = path.join(tiendaPath, 'assets');
        const logoPath = path.join(assetsPath, 'logo');
        const productosPath = path.join(assetsPath, 'productos');
        const dataPath = path.join(tiendaPath, 'data');
        
        // Crear directorios
        fs.mkdirSync(tiendaPath, { recursive: true });
        fs.mkdirSync(assetsPath, { recursive: true });
        fs.mkdirSync(logoPath, { recursive: true });
        fs.mkdirSync(productosPath, { recursive: true });
        fs.mkdirSync(dataPath, { recursive: true });
        
        // Crear archivo de configuración
        const config = {
            slug: slug,
            nombre: nombre,
            descripcion: descripcion,
            email: email,
            contacto: {
                email: email,
                telefono: '',
                whatsapp: ''
            },
            ubicacion: {
                direccion: '',
                ciudad: '',
                pais: 'Argentina',
                coordenadas: {
                    lat: null,
                    lng: null
                }
            },
            envios: {
                costo: 0,
                gratis_desde: 0
            },
            pagos: {
                online: true,
                efectivo: true
            },
            colores: {
                primario: '#7C3AED',
                secundario: '#A78BFA',
                acento: '#EC4899'
            },
            created_at: new Date().toISOString()
        };
        
        fs.writeFileSync(path.join(tiendaPath, 'config.json'), JSON.stringify(config, null, 2));
        
        // Crear archivo index.html personalizado
        const templatePath = path.join(__dirname, '..', 'tiendas', 'templates', 'tienda-base.html');
        if (fs.existsSync(templatePath)) {
            let template = fs.readFileSync(templatePath, 'utf8');
            
            // Reemplazar placeholders
            template = template.replace(/\{\{NOMBRE_TIENDA\}\}/g, nombre);
            template = template.replace(/\{\{DESCRIPCION_TIENDA\}\}/g, descripcion);
            template = template.replace(/\{\{EMAIL_TIENDA\}\}/g, email);
            template = template.replace(/\{\{SLUG_TIENDA\}\}/g, slug);
            template = template.replace(/\{\{COLOR_PRIMARIO\}\}/g, config.colores.primario);
            template = template.replace(/\{\{COLOR_SECUNDARIO\}\}/g, config.colores.secundario);
            template = template.replace(/\{\{COLOR_ACENTO\}\}/g, config.colores.acento);
            
            fs.writeFileSync(path.join(tiendaPath, 'index.html'), template);
        }
        
        // Crear archivo de configuración JavaScript
        const jsTemplatePath = path.join(__dirname, '..', 'tiendas', 'templates', 'tienda-config.js');
        if (fs.existsSync(jsTemplatePath)) {
            let jsTemplate = fs.readFileSync(jsTemplatePath, 'utf8');
            
            // Reemplazar placeholders
            jsTemplate = jsTemplate.replace(/\{\{SLUG_TIENDA\}\}/g, slug);
            jsTemplate = jsTemplate.replace(/\{\{NOMBRE_TIENDA\}\}/g, nombre);
            jsTemplate = jsTemplate.replace(/\{\{DESCRIPCION_TIENDA\}\}/g, descripcion);
            jsTemplate = jsTemplate.replace(/\{\{EMAIL_TIENDA\}\}/g, email);
            
            fs.writeFileSync(path.join(tiendaPath, 'tienda-config.js'), jsTemplate);
        }
        
        console.log(`✅ Estructura de tienda creada: ${tiendaPath}`);
        res.json({ 
            success: true, 
            message: 'Estructura de tienda creada exitosamente',
            path: tiendaPath 
        });
        
    } catch (error) {
        console.error('Error creando estructura de tienda:', error);
        res.status(500).json({ error: 'Error al crear estructura de tienda' });
    }
});

// Crear estructura de carpetas para nuevo usuario
app.post('/api/crear-carpeta-usuario', (req, res) => {
    const { id, nombre, email, telefono } = req.body;
    
    if (!id || !nombre || !email) {
        return res.status(400).json({ error: 'ID, nombre y email son requeridos' });
    }
    
    try {
        const fs = require('fs');
        const path = require('path');
        
        // Crear estructura de carpetas
        const usuarioPath = path.join(__dirname, '..', 'usuarios', id);
        const assetsPath = path.join(usuarioPath, 'assets');
        const avatarPath = path.join(assetsPath, 'avatar');
        const uploadsPath = path.join(assetsPath, 'uploads');
        const dataPath = path.join(usuarioPath, 'data');
        
        // Crear directorios
        fs.mkdirSync(usuarioPath, { recursive: true });
        fs.mkdirSync(assetsPath, { recursive: true });
        fs.mkdirSync(avatarPath, { recursive: true });
        fs.mkdirSync(uploadsPath, { recursive: true });
        fs.mkdirSync(dataPath, { recursive: true });
        
        // Crear archivo de configuración
        const config = {
            id: id,
            nombre: nombre,
            email: email,
            telefono: telefono || '',
            fechaNacimiento: '',
            preferencias: '',
            direcciones: [],
            metodosPago: [],
            created_at: new Date().toISOString()
        };
        
        fs.writeFileSync(path.join(usuarioPath, 'config.json'), JSON.stringify(config, null, 2));
        
        // Crear archivo profile.html personalizado
        const templatePath = path.join(__dirname, '..', 'usuarios', 'templates', 'usuario-base.html');
        if (fs.existsSync(templatePath)) {
            let template = fs.readFileSync(templatePath, 'utf8');
            
            // Reemplazar placeholders
            template = template.replace(/\{\{ID_USUARIO\}\}/g, id);
            template = template.replace(/\{\{NOMBRE_USUARIO\}\}/g, nombre);
            template = template.replace(/\{\{EMAIL_USUARIO\}\}/g, email);
            template = template.replace(/\{\{TELEFONO_USUARIO\}\}/g, telefono || '');
            template = template.replace(/\{\{FECHA_NACIMIENTO\}\}/g, '');
            template = template.replace(/\{\{PREFERENCIAS_USUARIO\}\}/g, '');
            template = template.replace(/\{\{DIRECCIONES_USUARIO\}\}/g, '[]');
            template = template.replace(/\{\{METODOS_PAGO_USUARIO\}\}/g, '[]');
            
            fs.writeFileSync(path.join(usuarioPath, 'profile.html'), template);
        }
        
        // Crear archivo de configuración JavaScript
        const jsTemplatePath = path.join(__dirname, '..', 'usuarios', 'templates', 'usuario-config.js');
        if (fs.existsSync(jsTemplatePath)) {
            let jsTemplate = fs.readFileSync(jsTemplatePath, 'utf8');
            
            // Reemplazar placeholders
            jsTemplate = jsTemplate.replace(/\{\{ID_USUARIO\}\}/g, id);
            jsTemplate = jsTemplate.replace(/\{\{NOMBRE_USUARIO\}\}/g, nombre);
            jsTemplate = jsTemplate.replace(/\{\{EMAIL_USUARIO\}\}/g, email);
            jsTemplate = jsTemplate.replace(/\{\{TELEFONO_USUARIO\}\}/g, telefono || '');
            
            fs.writeFileSync(path.join(usuarioPath, 'usuario-config.js'), jsTemplate);
        }
        
        console.log(`✅ Estructura de usuario creada: ${usuarioPath}`);
        res.json({ 
            success: true, 
            message: 'Estructura de usuario creada exitosamente',
            path: usuarioPath 
        });
        
    } catch (error) {
        console.error('Error creando estructura de usuario:', error);
        res.status(500).json({ error: 'Error al crear estructura de usuario' });
    }
});

// ==================== ENDPOINTS DE RESPALDO EMOCIONAL ====================

// Enviar mensaje de respaldo emocional
app.post('/api/apoyo/mensaje', (req, res) => {
    const { tenant_id, emocion, mensaje, anonimo, permitir_contacto } = req.body;
    
    if (!tenant_id || !emocion || !mensaje) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }
    
    // Auto-clasificar urgencia
    const urgencia = clasificarUrgencia(emocion, mensaje);
    
    // Generar recursos sugeridos
    const recursos = generarRecursosSugeridos(mensaje);
    
    const stmt = db.prepare(`
        INSERT INTO apoyo_mensajes (
            tenant_id, emocion, mensaje, urgencia, anonimo, 
            permitir_contacto, estado, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pendiente', datetime('now'))
    `);
    
    stmt.run([tenant_id, emocion, mensaje, urgencia, anonimo, permitir_contacto], function(err) {
        if (err) {
            console.error('Error guardando mensaje de apoyo:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({
            id: this.lastID,
            urgencia: urgencia,
            recursos_sugeridos: recursos,
            mensaje: 'Mensaje enviado exitosamente'
        });
    });
    
    stmt.finalize();
});

// Obtener todos los mensajes de apoyo (para Carla)
app.get('/api/apoyo/mensajes', (req, res) => {
    const { urgencia, estado } = req.query;
    
    let query = `
        SELECT am.*, t.nombre_empresa, t.plan
        FROM apoyo_mensajes am
        LEFT JOIN tenants t ON am.tenant_id = t.slug
        WHERE 1=1
    `;
    const params = [];
    
    if (urgencia) {
        query += ' AND am.urgencia = ?';
        params.push(urgencia);
    }
    
    if (estado) {
        query += ' AND am.estado = ?';
        params.push(estado);
    }
    
    query += ' ORDER BY CASE am.urgencia WHEN "critica" THEN 1 WHEN "alta" THEN 2 WHEN "media" THEN 3 WHEN "baja" THEN 4 END, am.created_at DESC';
    
    db.all(query, params, (err, mensajes) => {
        if (err) {
            console.error('Error obteniendo mensajes de apoyo:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json(mensajes);
    });
});

// Responder mensaje de apoyo
app.post('/api/apoyo/responder/:id', (req, res) => {
    const { id } = req.params;
    const { respuesta, respondido_por } = req.body;
    
    if (!respuesta || !respondido_por) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }
    
    const stmt = db.prepare(`
        UPDATE apoyo_mensajes 
        SET respuesta = ?, respondido_por = ?, respondido_at = datetime('now'), estado = 'respondido'
        WHERE id = ?
    `);
    
    stmt.run([respuesta, respondido_por, id], function(err) {
        if (err) {
            console.error('Error actualizando respuesta:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }
        
        res.json({ mensaje: 'Respuesta enviada exitosamente' });
    });
    
    stmt.finalize();
});

// ==================== ENDPOINTS DE SOPORTE TÉCNICO ====================

// Crear ticket de soporte técnico
app.post('/api/soporte/ticket', (req, res) => {
    const { asunto, categoria, prioridad, mensaje, email } = req.body;
    
    if (!asunto || !categoria || !prioridad || !mensaje || !email) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    
    const stmt = db.prepare(`
        INSERT INTO soporte_tickets (
            asunto, categoria, prioridad, mensaje, email, estado, created_at
        ) VALUES (?, ?, ?, ?, ?, 'abierto', datetime('now'))
    `);
    
    stmt.run([asunto, categoria, prioridad, mensaje, email], function(err) {
        if (err) {
            console.error('Error creando ticket de soporte:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({
            id: this.lastID,
            mensaje: 'Ticket creado exitosamente'
        });
    });
    
    stmt.finalize();
});

// Obtener tickets de soporte
app.get('/api/soporte/tickets', (req, res) => {
    const { estado, prioridad } = req.query;
    
    let query = 'SELECT * FROM soporte_tickets WHERE 1=1';
    const params = [];
    
    if (estado) {
        query += ' AND estado = ?';
        params.push(estado);
    }
    
    if (prioridad) {
        query += ' AND prioridad = ?';
        params.push(prioridad);
    }
    
    query += ' ORDER BY 
        CASE prioridad 
            WHEN "alta" THEN 1 
            WHEN "media" THEN 2 
            WHEN "baja" THEN 3 
        END,
        created_at DESC';
    
    db.all(query, params, (err, tickets) => {
        if (err) {
            console.error('Error obteniendo tickets:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json(tickets);
    });
});

// ==================== ENDPOINTS PARA CHATBOT DINÁMICO ====================

// Obtener productos para chatbot
app.get('/api/:tenant/productos', (req, res) => {
    const { tenant } = req.params;
    const { limite = 50 } = req.query;
    
    db.all(`
        SELECT id, nombre, descripcion, precio, categoria_id, imagen, destacado
        FROM productos 
        WHERE tenant_id = ? AND activo = 1
        ORDER BY destacado DESC, created_at DESC
        LIMIT ?
    `, [tenant, parseInt(limite)], (err, productos) => {
        if (err) {
            console.error('Error obteniendo productos para chatbot:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json(productos);
    });
});

// Obtener ofertas para chatbot
app.get('/api/:tenant/ofertas', (req, res) => {
    const { tenant } = req.params;
    
    db.all(`
        SELECT id, titulo, descripcion, descuento, fecha_inicio, fecha_fin, activa
        FROM ofertas 
        WHERE tenant_id = ? AND activa = 1
        AND (fecha_fin IS NULL OR fecha_fin >= date('now'))
        ORDER BY created_at DESC
    `, [tenant], (err, ofertas) => {
        if (err) {
            console.error('Error obteniendo ofertas para chatbot:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json(ofertas);
    });
});

// Obtener FAQ para chatbot
app.get('/api/:tenant/faq', (req, res) => {
    const { tenant } = req.params;
    
    db.all(`
        SELECT id, pregunta, respuesta, categoria, orden
        FROM faq 
        WHERE tenant_id = ? AND activa = 1
        ORDER BY orden ASC, created_at DESC
    `, [tenant], (err, faq) => {
        if (err) {
            console.error('Error obteniendo FAQ para chatbot:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json(faq);
    });
});

// Obtener soporte técnico para chatbot
app.get('/api/:tenant/soporte', (req, res) => {
    const { tenant } = req.params;
    
    db.all(`
        SELECT id, tema, solucion, categoria, orden
        FROM soporte_temas 
        WHERE tenant_id = ? AND activo = 1
        ORDER BY orden ASC, created_at DESC
    `, [tenant], (err, soporte) => {
        if (err) {
            console.error('Error obteniendo soporte para chatbot:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json(soporte);
    });
});

// Actualizar conocimiento del chatbot
app.post('/api/:tenant/chatbot/update', (req, res) => {
    const { tenant } = req.params;
    const { tipo, datos } = req.body;
    
    // Aquí se podría implementar lógica para actualizar el conocimiento
    // Por ahora, solo confirmamos que se recibió la solicitud
    console.log(`🤖 Actualizando conocimiento del chatbot para ${tenant}:`, tipo);
    
    res.json({ 
        success: true, 
        message: 'Conocimiento del chatbot actualizado',
        tenant: tenant,
        tipo: tipo
    });
});

// ==================== FUNCIONES AUXILIARES ====================

// Función para clasificar urgencia
function clasificarUrgencia(emocion, mensaje) {
    const mensajeLower = mensaje.toLowerCase();
    
    // Palabras críticas
    const palabrasCriticas = ['rendirme', 'crisis', 'ya no puedo', 'perdido todo', 'no aguanto más'];
    if (emocion === 'abrumado' && palabrasCriticas.some(palabra => mensajeLower.includes(palabra))) {
        return 'critica';
    }
    
    // Palabras de alta urgencia
    const palabrasAltas = ['miedo', 'fracaso', 'mal', 'difícil', 'ansiedad', 'abrumado'];
    if (emocion === 'abrumado' || emocion === 'dificil' || palabrasAltas.some(palabra => mensajeLower.includes(palabra))) {
        return 'alta';
    }
    
    // Urgencia media
    if (emocion === 'regular' || mensajeLower.includes('?')) {
        return 'media';
    }
    
    // Urgencia baja
    if (emocion === 'bien' || emocion === 'excelente') {
        return 'baja';
    }
    
    return 'media';
}

// Función para generar recursos sugeridos
function generarRecursosSugeridos(mensaje) {
    const mensajeLower = mensaje.toLowerCase();
    const recursos = [];
    
    // Recursos basados en palabras clave
    if (mensajeLower.includes('venta') || mensajeLower.includes('vender')) {
        recursos.push({
            titulo: 'Estrategias de Ventas',
            icono: 'fas fa-chart-line',
            descripcion: 'Tips para conseguir tus primeras ventas'
        });
    }
    
    if (mensajeLower.includes('marketing') || mensajeLower.includes('promocionar')) {
        recursos.push({
            titulo: 'Marketing para Principiantes',
            icono: 'fas fa-bullhorn',
            descripcion: 'Cómo dar a conocer tu tienda'
        });
    }
    
    if (mensajeLower.includes('miedo') || mensajeLower.includes('duda') || mensajeLower.includes('fracaso')) {
        recursos.push({
            titulo: 'Supera tus Miedos',
            icono: 'fas fa-fire',
            descripcion: 'Motivación para seguir adelante'
        });
    }
    
    // Recurso siempre presente
    recursos.push({
        titulo: 'Habla con Otros Emprendedores',
        icono: 'fas fa-users',
        descripcion: 'Comunidad de apoyo'
    });
    
    return recursos;
}

// Manejar cierre graceful
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    db.close((err) => {
        if (err) {
            console.error('Error al cerrar DB:', err);
        } else {
            console.log('✅ Base de datos cerrada correctamente');
        }
        process.exit(0);
    });
});

app.all('/api/tasks/cumpleanos', async (req, res) => {
    try {
        const resultado = await procesarCumpleanosDelDia();
        res.json({ success: true, ...resultado });
    } catch (error) {
        console.error('❌ Error procesando cumpleaños:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

async function procesarCumpleanosDelDia() {
    if (!supabase) {
        throw new Error('Supabase no configurado');
    }

    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const dia = hoy.getDate();
    const fechaActual = hoy.toISOString().slice(0, 10);

    const resultados = {
        usuarios: [],
        tiendas: [],
        cupones: []
    };

    const compradores = await obtenerCumpleaneros({
        tabla: 'usuarios',
        campos: ['email', 'nombre'],
        fechaCampo: 'fecha_nacimiento',
        consentPublicoCampo: 'acepta_cumple_publico',
        consentBeneficioCampo: 'acepta_cumple_descuento'
    }, mes, dia);

    const tiendas = await obtenerCumpleaneros({
        tabla: 'tenants',
        campos: ['slug', 'nombre_empresa', 'email_contacto'],
        fechaCampo: 'fecha_nacimiento_responsable',
        consentPublicoCampo: 'acepta_cumple_home',
        consentBeneficioCampo: 'acepta_cumple_beneficio'
    }, mes, dia);

    for (const usuario of compradores) {
        try {
            const beneficio = usuario.consentBeneficio
                ? await generarBeneficioCumpleanosUsuario(usuario, fechaActual)
                : null;

            await enviarEmailCumpleanosUsuario(usuario, beneficio);

            resultados.usuarios.push({
                email: usuario.email,
                nombre: usuario.nombre,
                beneficio
            });

            if (beneficio?.cupon) {
                resultados.cupones.push(beneficio.cupon);
            }
        } catch (error) {
            console.warn('⚠️ No se pudo procesar cumpleaños usuario:', usuario.email, error.message);
        }
    }

    for (const tienda of tiendas) {
        try {
            const beneficio = tienda.consentBeneficio
                ? await generarBeneficioCumpleanosTienda(tienda, fechaActual)
                : null;

            await enviarEmailCumpleanosTienda(tienda, beneficio);

            resultados.tiendas.push({
                slug: tienda.slug,
                nombre: tienda.nombre_empresa,
                beneficio
            });

            if (beneficio?.cupon) {
                resultados.cupones.push(beneficio.cupon);
            }
        } catch (error) {
            console.warn('⚠️ No se pudo procesar cumpleaños tienda:', tienda.slug, error.message);
        }
    }

    return resultados;
}

async function obtenerCumpleaneros(config, mes, dia) {
    try {
        const { data, error } = await supabase
            .from(config.tabla)
            .select([
                ...config.campos,
                `${config.fechaCampo}`,
                `${config.consentPublicoCampo}`,
                `${config.consentBeneficioCampo}`,
                'cumple_ultima_notificacion'
            ].join(', '))
            .not(config.fechaCampo, 'is', null);

        if (error) throw error;
        if (!data) return [];

        return data
            .filter(row => {
                if (!row[config.fechaCampo]) return false;
                const fecha = new Date(row[config.fechaCampo]);
                if ((fecha.getMonth() + 1) !== mes || fecha.getDate() !== dia) {
                    return false;
                }
                if (row.cumple_ultima_notificacion) {
                    const ultima = new Date(row.cumple_ultima_notificacion);
                    if (ultima.getFullYear() === new Date().getFullYear()) {
                        return false;
                    }
                }
                return true;
            })
            .map(row => ({
                ...row,
                consentPublico: Boolean(row[config.consentPublicoCampo]),
                consentBeneficio: Boolean(row[config.consentBeneficioCampo])
            }));
    } catch (error) {
        console.warn(`⚠️ No se pudo obtener cumpleaños en ${config.tabla}:`, error.message);
        return [];
    }
}

async function generarBeneficioCumpleanosUsuario(usuario, fechaActual) {
    const cupón = {
        codigo: `CUMPLE-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
        descuento: '70%',
        condiciones: 'Válido por 7 días en productos seleccionados',
        fecha: fechaActual,
        destinatario: usuario.email
    };

    await registrarCumpleanosHistorial({
        tipo: 'usuario',
        referencia: usuario.email,
        fecha: fechaActual,
        cupon: JSON.stringify(cupón),
        beneficio: 'Descuento especial cumpleañero (70%)'
    });

    await actualizarUltimaNotificacion('usuarios', 'email', usuario.email);

    return { cupon: cupón, mensaje: 'Descuento especial del 70% en productos seleccionados' };
}

async function generarBeneficioCumpleanosTienda(tienda, fechaActual) {
    const beneficio = {
        tipo: 'upgrade_enterprise',
        descripcion: 'Upgrade gratis a plan Enterprise por 30 días',
        vigencia_dias: 30,
        fecha: fechaActual,
        slug: tienda.slug
    };

    await registrarCumpleanosHistorial({
        tipo: 'tenant',
        referencia: tienda.slug,
        fecha: fechaActual,
        beneficio: JSON.stringify(beneficio)
    });

    await actualizarUltimaNotificacion('tenants', 'slug', tienda.slug);

    return beneficio;
}

async function registrarCumpleanosHistorial({ tipo, referencia, fecha, cupon, beneficio }) {
    try {
        await supabase
            .from('cumpleanos_historial')
            .insert({
                tipo,
                referencia_slug: referencia,
                fecha,
                cupón_generado: cupon || null,
                beneficio: beneficio || null,
                enviado: true,
                mensaje: beneficio ? 'Beneficio otorgado de cumpleaños' : 'Saludos de cumpleaños enviados'
            });
    } catch (error) {
        console.warn('⚠️ No se pudo registrar cumpleaños en historial:', error.message);
    }
}

async function actualizarUltimaNotificacion(tabla, campoId, valor) {
    try {
        await supabase
            .from(tabla)
            .update({ cumple_ultima_notificacion: new Date().toISOString() })
            .eq(campoId, valor);
    } catch (error) {
        console.warn('⚠️ No se pudo actualizar última notificación de cumpleaños:', error.message);
    }
}

async function enviarEmailCumpleanosUsuario(usuario, beneficio) {
    const titulo = beneficio
        ? '🎉 ¡Feliz cumpleaños con regalo Cresalia!'
        : '🎉 ¡Feliz cumpleaños parte de Cresalia!';

    const beneficioHtml = beneficio?.cupon
        ? `<div style="margin:20px 0; padding:18px; border-radius:12px; background:linear-gradient(135deg,#7C3AED15,#5B21B620);">
                <h3 style="margin:0 0 8px 0; color:#5B21B6;">🎁 Tu regalo de cumpleaños</h3>
                <p style="margin:0; font-size:1.05rem; color:#312E81;">Cupón: <strong>${beneficio.cupon.codigo}</strong></p>
                <p style="margin:8px 0 0 0; color:#4338CA;">${beneficio.mensaje}</p>
                <small style="color:#6B7280;">Entrega válida por 7 días. Usalo en tu tienda favorita.</small>
            </div>`
        : '';

    const htmlContent = `
        <div style="font-family:'Poppins','Segoe UI',sans-serif; background:#f8fafc; padding:24px;">
            <div style="max-width:640px; margin:0 auto; background:white; border-radius:20px; padding:28px; box-shadow:0 18px 40px rgba(15,23,42,0.1);">
                <h2 style="margin-top:0; color:#7C3AED;">${titulo}</h2>
                <p style="color:#475569; line-height:1.6;">
                    Hola ${escapeHtml(usuario.nombre || usuario.email || 'parte de nuestra comunidad')} 💜<br><br>
                    Gracias por ser parte de Cresalia. Hoy celebramos tu vida y todo lo que aportás a esta comunidad de amor, emprendimiento y contención.
                </p>
                ${beneficioHtml}
                <p style="color:#475569; line-height:1.6;">
                    Te esperamos en la plataforma para seguir acompañándote. Recordá que tenés disponible apoyo emocional, mentorías y beneficios especiales cada vez que los necesites.
                </p>
                <p style="color:#64748B; font-style:italic;">Con todo nuestro cariño,<br>Tu familia Cresalia</p>
            </div>
        </div>`;

    await enviarEmailTransaccional({
        toEmail: usuario.email,
        toName: usuario.nombre,
        subject: 'Feliz cumpleaños 🎂 - Un detalle especial de Cresalia',
        htmlContent
    });
}

async function enviarEmailCumpleanosTienda(tienda, beneficio) {
    const beneficioHtml = beneficio
        ? `<div style="margin:20px 0; padding:18px; border-radius:12px; background:linear-gradient(135deg,#7C3AED15,#5B21B620);">
                <h3 style="margin:0 0 8px 0; color:#5B21B6;">🎁 Beneficio por tu cumpleaños</h3>
                <p style="margin:0; font-size:1.05rem; color:#312E81;">Upgrade a <strong>Plan Enterprise</strong> por 30 días.</p>
                <p style="margin:8px 0 0 0; color:#4338CA;">Nuestro equipo activará el beneficio y te avisará cuando esté listo.</p>
            </div>`
        : '';

    const htmlContent = `
        <div style="font-family:'Poppins','Segoe UI',sans-serif; background:#f8fafc; padding:24px;">
            <div style="max-width:640px; margin:0 auto; background:white; border-radius:20px; padding:28px; box-shadow:0 18px 40px rgba(15,23,42,0.1);">
                <h2 style="margin-top:0; color:#0EA5E9;">🎉 ¡Feliz cumpleaños ${escapeHtml(tienda.nombre_empresa || tienda.slug)}!</h2>
                <p style="color:#475569; line-height:1.6;">
                    Gracias por construir impacto con Cresalia. Nos enorgullece verte crecer y celebrar tu camino emprendedor.
                </p>
                ${beneficioHtml}
                <p style="color:#475569; line-height:1.6;">
                    Si querés aparecer en nuestra portada como cumpleañero del mes, asegurate de activar tu consentimiento en el panel.
                    Estamos a un mensaje de ayudarte en lo que necesites.
                </p>
                <p style="color:#64748B; font-style:italic;">Éxitos y prosperidad para tu empresa,<br>Tu equipo Cresalia</p>
            </div>
        </div>`;

    await enviarEmailTransaccional({
        toEmail: tienda.email_contacto,
        toName: tienda.nombre_empresa,
        subject: '🎂 ¡Felices cumpleaños, emprendedora!',
        htmlContent
    });
}
