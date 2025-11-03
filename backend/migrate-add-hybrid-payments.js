// ===== MIGRACIÓN: SISTEMA DE PAGOS HÍBRIDO =====
// Suscripciones van a Cresalia, ventas van a las tiendas

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'cresalia.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Creando sistema de pagos híbrido...');

// Tabla para configuración de ventas por tienda
db.run(`
    CREATE TABLE IF NOT EXISTS tenant_sales_config (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        access_token TEXT NOT NULL,
        public_key TEXT NOT NULL,
        configured_at TEXT NOT NULL,
        type TEXT DEFAULT 'sales_only',
        status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla tenant_sales_config:', err);
    } else {
        console.log('✅ Tabla tenant_sales_config creada');
    }
});

// Tabla para suscripciones de Cresalia
db.run(`
    CREATE TABLE IF NOT EXISTS cresalia_subscriptions (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        plan TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        cresalia_email TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla cresalia_subscriptions:', err);
    } else {
        console.log('✅ Tabla cresalia_subscriptions creada');
    }
});

// Tabla para ventas de tiendas
db.run(`
    CREATE TABLE IF NOT EXISTS store_sales (
        id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        product_id TEXT,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        store_email TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla store_sales:', err);
    } else {
        console.log('✅ Tabla store_sales creada');
    }
});

// Tabla para transacciones híbridas (historial completo)
db.run(`
    CREATE TABLE IF NOT EXISTS hybrid_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tenant_id TEXT NOT NULL,
        transaction_id TEXT NOT NULL,
        transaction_type TEXT NOT NULL, -- 'subscription' o 'sale'
        plan_or_product TEXT,
        amount REAL NOT NULL,
        recipient TEXT NOT NULL, -- 'cresalia' o email de la tienda
        status TEXT NOT NULL,
        metadata TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    )
`, (err) => {
    if (err) {
        console.error('❌ Error creando tabla hybrid_transactions:', err);
    } else {
        console.log('✅ Tabla hybrid_transactions creada');
    }
});

// Insertar datos de ejemplo para testing
db.run(`
    INSERT OR IGNORE INTO tenant_sales_config 
    (tenant_id, email, access_token, public_key, configured_at, type, status, created_at) 
    VALUES 
    ('demo_tenant', 'demo@ejemplo.com', 'APP_USR-1234567890123456-123456-123456789012345678901234567890-123456789', 'APP_USR-1234567890123456-123456-123456789012345678901234567890-123456789', datetime('now'), 'sales_only', 'active', datetime('now'))
`, (err) => {
    if (err) {
        console.error('❌ Error insertando configuración de ventas de ejemplo:', err);
    } else {
        console.log('✅ Configuración de ventas de ejemplo insertada');
    }
});

db.run(`
    INSERT OR IGNORE INTO cresalia_subscriptions 
    (id, tenant_id, plan, amount, status, cresalia_email, created_at) 
    VALUES 
    ('cresalia_sub_demo_1', 'demo_tenant', 'pro', 79.00, 'approved', 'crisla965@gmail.com', datetime('now'))
`, (err) => {
    if (err) {
        console.error('❌ Error insertando suscripción de ejemplo:', err);
    } else {
        console.log('✅ Suscripción de ejemplo insertada');
    }
});

db.run(`
    INSERT OR IGNORE INTO store_sales 
    (id, tenant_id, product_id, amount, status, store_email, created_at) 
    VALUES 
    ('store_sale_demo_1', 'demo_tenant', 'producto_1', 50.00, 'approved', 'demo@ejemplo.com', datetime('now'))
`, (err) => {
    if (err) {
        console.error('❌ Error insertando venta de ejemplo:', err);
    } else {
        console.log('✅ Venta de ejemplo insertada');
    }
});

db.run(`
    INSERT OR IGNORE INTO hybrid_transactions 
    (tenant_id, transaction_id, transaction_type, plan_or_product, amount, recipient, status, metadata, created_at) 
    VALUES 
    ('demo_tenant', 'cresalia_sub_demo_1', 'subscription', 'pro', 79.00, 'crisla965@gmail.com', 'approved', '{"plan":"pro","tenant_name":"Demo Store"}', datetime('now')),
    ('demo_tenant', 'store_sale_demo_1', 'sale', 'producto_1', 50.00, 'demo@ejemplo.com', 'approved', '{"product_id":"producto_1","tenant_name":"Demo Store"}', datetime('now'))
`, (err) => {
    if (err) {
        console.error('❌ Error insertando transacciones híbridas de ejemplo:', err);
    } else {
        console.log('✅ Transacciones híbridas de ejemplo insertadas');
    }
});

// Cerrar conexión
db.close((err) => {
    if (err) {
        console.error('❌ Error cerrando base de datos:', err);
    } else {
        console.log('✅ Sistema de pagos híbrido creado');
        console.log('');
        console.log('💳 Cómo funciona el sistema híbrido:');
        console.log('');
        console.log('🏢 SUSCRIPCIONES (Para Cresalia):');
        console.log('   • Planes: Básico ($29), Pro ($79), Enterprise ($199)');
        console.log('   • Van directamente a la cuenta de Cresalia');
        console.log('   • Pago por usar la plataforma');
        console.log('   • Renovación automática mensual');
        console.log('');
        console.log('🛍️ VENTAS (Para las Tiendas):');
        console.log('   • Productos y servicios que vendan');
        console.log('   • Van directamente a su cuenta de Mercado Pago');
        console.log('   • 100% para la tienda, sin comisiones de Cresalia');
        console.log('   • Control total de sus ingresos');
        console.log('');
        console.log('📊 Transparencia Total:');
        console.log('   ✅ Cada uno recibe lo que le corresponde');
        console.log('   ✅ Sin intermediarios en las ventas');
        console.log('   ✅ Suscripciones claras para Cresalia');
        console.log('   ✅ Confianza mutua entre Cresalia y tiendas');
        console.log('');
        console.log('📋 Tablas creadas:');
        console.log('   - tenant_sales_config (Configuración de ventas)');
        console.log('   - cresalia_subscriptions (Suscripciones de Cresalia)');
        console.log('   - store_sales (Ventas de tiendas)');
        console.log('   - hybrid_transactions (Historial híbrido)');
        console.log('');
        console.log('💰 Beneficios para Cresalia:');
        console.log('   ✅ Ingresos predecibles de suscripciones');
        console.log('   ✅ No dependes de comisiones de ventas');
        console.log('   ✅ Modelo de negocio claro y sostenible');
        console.log('   ✅ Las tiendas confían en ti');
        console.log('');
        console.log('🚀 Sistema híbrido listo para usar!');
    }
});























