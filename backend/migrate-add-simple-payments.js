// ===== MIGRACIÓN: SISTEMA DE PAGOS SIMPLE =====
// Sistema súper simple: suscripciones por link, ventas por MP personal

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cresalia.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Creando sistema de pagos simple...');

// Tabla para configuración simple de ventas
db.run(`
    CREATE TABLE IF NOT EXISTS simple_sales_config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        configured_at TEXT NOT NULL,
        type TEXT DEFAULT 'simple_sales',
        status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla simple_sales_config:', err);
    } else {
        console.log('✅ Tabla simple_sales_config creada');
    }
});

// Tabla para suscripciones simples (links)
db.run(`
    CREATE TABLE IF NOT EXISTS simple_subscriptions (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        plan TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        cresalia_email TEXT NOT NULL,
        payment_link TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla simple_subscriptions:', err);
    } else {
        console.log('✅ Tabla simple_subscriptions creada');
    }
});

// Tabla para ventas simples
db.run(`
    CREATE TABLE IF NOT EXISTS simple_sales (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        product_id TEXT,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        store_email TEXT NOT NULL,
        payment_link TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla simple_sales:', err);
    } else {
        console.log('✅ Tabla simple_sales creada');
    }
});

// Tabla para transacciones simples (historial)
db.run(`
    CREATE TABLE IF NOT EXISTS simple_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        transaction_id TEXT NOT NULL,
        transaction_type TEXT NOT NULL, -- 'subscription' o 'sale'
        plan_or_product TEXT,
        amount REAL NOT NULL,
        recipient TEXT NOT NULL, -- email de quien recibe
        status TEXT NOT NULL,
        payment_method TEXT DEFAULT 'mercadopago_link',
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla simple_transactions:', err);
    } else {
        console.log('✅ Tabla simple_transactions creada');
    }
});

// Insertar datos de ejemplo para testing
db.run(`
    INSERT OR IGNORE INTO simple_sales_config 
    (tenant_id, email, configured_at, type, status, created_at) 
    VALUES 
    ('demo_tenant', 'demo@ejemplo.com', datetime('now'), 'simple_sales', 'active', datetime('now'))
`, (err) => {
    if (err) {
        console.error('❌ Error insertando configuración simple de ejemplo:', err);
    } else {
        console.log('✅ Configuración simple de ejemplo insertada');
    }
});

db.run(`
    INSERT OR IGNORE INTO simple_subscriptions 
    (id, tenant_id, plan, amount, status, cresalia_email, payment_link, created_at) 
    VALUES 
    ('simple_sub_demo_1', 'demo_tenant', 'pro', 79.00, 'pending', 'crisla965@gmail.com', 'https://mpago.la/2c3m4n5p6', datetime('now'))
`, (err) => {
    if (err) {
        console.error('❌ Error insertando suscripción simple de ejemplo:', err);
    } else {
        console.log('✅ Suscripción simple de ejemplo insertada');
    }
});

db.run(`
    INSERT OR IGNORE INTO simple_sales 
    (id, tenant_id, product_id, amount, status, store_email, payment_link, created_at) 
    VALUES 
    ('simple_sale_demo_1', 'demo_tenant', 'producto_1', 50.00, 'pending', 'demo@ejemplo.com', 'https://mpago.la/1a2b3c4d5', datetime('now'))
`, (err) => {
    if (err) {
        console.error('❌ Error insertando venta simple de ejemplo:', err);
    } else {
        console.log('✅ Venta simple de ejemplo insertada');
    }
});

// Cerrar conexión
db.close((err) => {
    if (err) {
        console.error('❌ Error cerrando base de datos:', err);
    } else {
        console.log('✅ Sistema de pagos simple creado');
        console.log('');
        console.log('💳 Cómo funciona el sistema simple:');
        console.log('');
        console.log('🏢 SUSCRIPCIONES (Para Cresalia):');
        console.log('   • Sistema genera links de pago');
        console.log('   • Tiendas te pagan a crisla965@gmail.com');
        console.log('   • Planes: Básico ($29), Pro ($79), Enterprise ($199)');
        console.log('   • Sin credenciales complejas');
        console.log('');
        console.log('🛍️ VENTAS (Para las Tiendas):');
        console.log('   • Solo necesitan su email de MP personal');
        console.log('   • Sistema genera links de pago');
        console.log('   • 100% para ellas, sin comisiones');
        console.log('   • Sin ser developers de MP');
        console.log('');
        console.log('📊 Súper Simple:');
        console.log('   ✅ No necesitas ser developer de MP');
        console.log('   ✅ Solo cuentas personales');
        console.log('   ✅ Links automáticos de pago');
        console.log('   ✅ Transparencia total');
        console.log('');
        console.log('📋 Tablas creadas:');
        console.log('   - simple_sales_config (Configuración de ventas)');
        console.log('   - simple_subscriptions (Suscripciones simples)');
        console.log('   - simple_sales (Ventas simples)');
        console.log('   - simple_transactions (Historial simple)');
        console.log('');
        console.log('💰 Para Cresalia:');
        console.log('   ✅ Recibes suscripciones directamente');
        console.log('   ✅ Sin configuración compleja');
        console.log('   ✅ Links automáticos de pago');
        console.log('   ✅ Ingresos predecibles');
        console.log('');
        console.log('🚀 Sistema simple listo para usar!');
    }
});























