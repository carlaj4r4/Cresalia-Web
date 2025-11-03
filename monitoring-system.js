#!/usr/bin/env node

/**
 * 📊 Sistema de Monitoreo - Cresalia-Web
 * 
 * Monitorea el estado del servidor, base de datos y APIs
 * Envía alertas automáticas si hay problemas
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class MonitoringSystem {
    constructor() {
        this.config = {
            // URLs a monitorear
            urls: [
                {
                    name: 'Frontend Vercel',
                    url: 'https://cresalia-web.vercel.app',
                    type: 'frontend',
                    critical: true
                },
                {
                    name: 'Backend Railway',
                    url: 'https://cresalia-backend-production.up.railway.app/api/health',
                    type: 'api',
                    critical: true
                },
                {
                    name: 'API Productos',
                    url: 'https://cresalia-backend-production.up.railway.app/api/productos',
                    type: 'api',
                    critical: false
                }
            ],
            
            // Configuración de monitoreo
            interval: 5 * 60 * 1000, // 5 minutos
            timeout: 10000, // 10 segundos
            retries: 3,
            
            // Archivos de logs
            logFile: './monitoring.log',
            alertFile: './alerts.log',
            
            // Configuración de alertas
            alerts: {
                enabled: true,
                email: 'carla.crimi.95@gmail.com',
                maxAlertsPerHour: 3
            }
        };
        
        this.stats = {
            totalChecks: 0,
            successfulChecks: 0,
            failedChecks: 0,
            lastCheck: null,
            uptime: 100,
            alertsSent: 0,
            lastAlert: null
        };
        
        console.log('📊 Sistema de Monitoreo Cresalia-Web iniciado');
        console.log('💜 "Empezamos pocos, crecemos mucho"');
    }

    // Realizar check de salud de una URL
    async checkUrl(urlConfig) {
        return new Promise((resolve) => {
            const client = urlConfig.url.startsWith('https:') ? https : http;
            const startTime = Date.now();
            
            const request = client.request(urlConfig.url, {
                method: 'GET',
                timeout: this.config.timeout,
                headers: {
                    'User-Agent': 'Cresalia-Monitoring/2.0.0'
                }
            }, (response) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                const result = {
                    name: urlConfig.name,
                    url: urlConfig.url,
                    type: urlConfig.type,
                    status: response.statusCode,
                    responseTime: responseTime,
                    success: response.statusCode >= 200 && response.statusCode < 400,
                    timestamp: new Date().toISOString(),
                    critical: urlConfig.critical
                };
                
                resolve(result);
            });
            
            request.on('error', (error) => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                
                resolve({
                    name: urlConfig.name,
                    url: urlConfig.url,
                    type: urlConfig.type,
                    status: 0,
                    responseTime: responseTime,
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                    critical: urlConfig.critical
                });
            });
            
            request.on('timeout', () => {
                request.destroy();
                resolve({
                    name: urlConfig.name,
                    url: urlConfig.url,
                    type: urlConfig.type,
                    status: 0,
                    responseTime: this.config.timeout,
                    success: false,
                    error: 'Timeout',
                    timestamp: new Date().toISOString(),
                    critical: urlConfig.critical
                });
            });
            
            request.end();
        });
    }

    // Realizar check con reintentos
    async checkWithRetries(urlConfig) {
        let lastResult = null;
        
        for (let i = 0; i < this.config.retries; i++) {
            lastResult = await this.checkUrl(urlConfig);
            
            if (lastResult.success) {
                break;
            }
            
            if (i < this.config.retries - 1) {
                console.log(`⚠️ Reintentando ${urlConfig.name} (${i + 1}/${this.config.retries})`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
            }
        }
        
        return lastResult;
    }

    // Realizar todos los checks
    async performChecks() {
        console.log(`\n🔍 Realizando checks de monitoreo - ${new Date().toLocaleString()}`);
        
        const results = [];
        
        for (const urlConfig of this.config.urls) {
            console.log(`📡 Verificando ${urlConfig.name}...`);
            const result = await this.checkWithRetries(urlConfig);
            results.push(result);
            
            // Log del resultado
            if (result.success) {
                console.log(`✅ ${result.name}: OK (${result.responseTime}ms)`);
            } else {
                console.log(`❌ ${result.name}: FALLO (${result.error || 'HTTP ' + result.status})`);
            }
        }
        
        return results;
    }

    // Actualizar estadísticas
    updateStats(results) {
        this.stats.totalChecks++;
        this.stats.lastCheck = new Date().toISOString();
        
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        
        this.stats.successfulChecks += successful;
        this.stats.failedChecks += failed;
        
        // Calcular uptime
        this.stats.uptime = (this.stats.successfulChecks / this.stats.totalChecks) * 100;
        
        console.log(`📊 Estadísticas: ${successful}/${results.length} OK, Uptime: ${this.stats.uptime.toFixed(2)}%`);
    }

    // Verificar si hay problemas críticos
    checkCriticalIssues(results) {
        const criticalFailures = results.filter(r => r.critical && !r.success);
        
        if (criticalFailures.length > 0) {
            console.log(`🚨 PROBLEMAS CRÍTICOS DETECTADOS: ${criticalFailures.length}`);
            
            for (const failure of criticalFailures) {
                console.log(`   ❌ ${failure.name}: ${failure.error || 'HTTP ' + failure.status}`);
            }
            
            return criticalFailures;
        }
        
        return [];
    }

    // Enviar alerta
    async sendAlert(criticalFailures) {
        if (!this.config.alerts.enabled) return;
        
        // Verificar límite de alertas por hora
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        
        if (this.stats.lastAlert && this.stats.lastAlert > oneHourAgo) {
            if (this.stats.alertsSent >= this.config.alerts.maxAlertsPerHour) {
                console.log('⚠️ Límite de alertas por hora alcanzado');
                return;
            }
        }
        
        const alertMessage = this.createAlertMessage(criticalFailures);
        console.log(`📧 Enviando alerta: ${alertMessage}`);
        
        // Aquí podrías integrar con servicios como:
        // - Email (SendGrid, Mailgun)
        // - Slack
        // - Discord
        // - WhatsApp
        // - SMS
        
        this.stats.alertsSent++;
        this.stats.lastAlert = now;
        
        // Guardar alerta en archivo
        this.logAlert(alertMessage);
    }

    // Crear mensaje de alerta
    createAlertMessage(criticalFailures) {
        const timestamp = new Date().toLocaleString();
        let message = `🚨 ALERTA CRESALIA-WEB - ${timestamp}\n\n`;
        
        message += `Problemas críticos detectados:\n`;
        
        for (const failure of criticalFailures) {
            message += `❌ ${failure.name}: ${failure.error || 'HTTP ' + failure.status}\n`;
            message += `   URL: ${failure.url}\n`;
            message += `   Tiempo: ${failure.responseTime}ms\n\n`;
        }
        
        message += `Estadísticas actuales:\n`;
        message += `📊 Uptime: ${this.stats.uptime.toFixed(2)}%\n`;
        message += `🔍 Checks totales: ${this.stats.totalChecks}\n`;
        message += `✅ Exitosos: ${this.stats.successfulChecks}\n`;
        message += `❌ Fallidos: ${this.stats.failedChecks}\n\n`;
        
        message += `💜 "Empezamos pocos, crecemos mucho"`;
        
        return message;
    }

    // Log de alertas
    logAlert(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}\n`;
        
        fs.appendFileSync(this.config.alertFile, logEntry);
    }

    // Log de monitoreo
    logMonitoring(results) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            results,
            stats: { ...this.stats }
        };
        
        fs.appendFileSync(this.config.logFile, JSON.stringify(logEntry) + '\n');
    }

    // Generar reporte de estado
    generateStatusReport() {
        const report = {
            timestamp: new Date().toISOString(),
            status: this.stats.uptime > 95 ? 'HEALTHY' : this.stats.uptime > 80 ? 'DEGRADED' : 'CRITICAL',
            uptime: this.stats.uptime,
            stats: { ...this.stats },
            urls: this.config.urls.map(url => ({
                name: url.name,
                type: url.type,
                critical: url.critical
            }))
        };
        
        return report;
    }

    // Ciclo principal de monitoreo
    async monitoringLoop() {
        try {
            const results = await this.performChecks();
            this.updateStats(results);
            
            const criticalFailures = this.checkCriticalIssues(results);
            
            if (criticalFailures.length > 0) {
                await this.sendAlert(criticalFailures);
            }
            
            this.logMonitoring(results);
            
            // Generar reporte de estado cada hora
            if (this.stats.totalChecks % 12 === 0) { // Cada 12 checks (1 hora)
                const report = this.generateStatusReport();
                console.log(`📋 Reporte de estado: ${report.status} (${report.uptime.toFixed(2)}% uptime)`);
            }
            
        } catch (error) {
            console.error('❌ Error en el ciclo de monitoreo:', error.message);
        }
    }

    // Iniciar monitoreo
    start() {
        console.log('🚀 Iniciando monitoreo continuo...');
        console.log(`⏰ Intervalo: ${this.config.interval / 1000 / 60} minutos`);
        console.log(`🎯 URLs monitoreadas: ${this.config.urls.length}`);
        
        // Ejecutar primer check inmediatamente
        this.monitoringLoop();
        
        // Programar checks periódicos
        setInterval(() => {
            this.monitoringLoop();
        }, this.config.interval);
        
        console.log('✅ Monitoreo iniciado. Presiona Ctrl+C para detener.');
    }

    // Detener monitoreo
    stop() {
        console.log('\n🛑 Deteniendo sistema de monitoreo...');
        
        const finalReport = this.generateStatusReport();
        console.log(`📊 Reporte final: ${finalReport.status} (${finalReport.uptime.toFixed(2)}% uptime)`);
        
        process.exit(0);
    }
}

// Manejar señales de terminación
process.on('SIGINT', () => {
    console.log('\n🛑 Recibida señal de terminación...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Recibida señal de terminación...');
    process.exit(0);
});

// Ejecutar si es llamado directamente
if (require.main === module) {
    const monitoring = new MonitoringSystem();
    monitoring.start();
}

module.exports = MonitoringSystem;























