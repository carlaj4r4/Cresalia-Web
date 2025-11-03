// ===== CONFIGURACIÓN DE SEGURIDAD AVANZADA - CRESALIA =====
// Medidas de seguridad adicionales para el backend

const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const helmet = require('helmet');

// ===== CONFIGURACIÓN DE RATE LIMITING =====

// Rate limiting general - más estricto
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP cada 15 min
    message: {
        error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo en 15 minutos.',
        retryAfter: 15 * 60
    },
    standardHeaders: true, // Incluir headers de rate limit
    legacyHeaders: false, // Deshabilitar headers legacy
    handler: (req, res) => {
        console.log(`🚨 Rate limit excedido para IP: ${req.ip}`);
        res.status(429).json({
            error: 'Rate limit excedido',
            message: 'Demasiadas solicitudes desde esta IP',
            retryAfter: Math.round(req.rateLimit.resetTime / 1000)
        });
    }
});

// Rate limiting para autenticación - súper estricto
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos de login por IP cada 15 min
    message: {
        error: 'Demasiados intentos de login, intenta de nuevo en 15 minutos.',
        retryAfter: 15 * 60
    },
    skipSuccessfulRequests: true, // No contar requests exitosos
    handler: (req, res) => {
        console.log(`🚨 Intentos de login excedidos para IP: ${req.ip}`);
        res.status(429).json({
            error: 'Demasiados intentos de login',
            message: 'Por seguridad, espera 15 minutos antes de intentar nuevamente',
            retryAfter: Math.round(req.rateLimit.resetTime / 1000)
        });
    }
});

// Rate limiting para APIs sensibles
const sensitiveLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 20, // máximo 20 requests por IP cada 5 min
    message: {
        error: 'Demasiadas solicitudes a endpoints sensibles',
        retryAfter: 5 * 60
    }
});

// ===== CONFIGURACIÓN DE HELMET (HEADERS DE SEGURIDAD) =====

const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false, // Para permitir CDNs
    hsts: {
        maxAge: 31536000, // 1 año
        includeSubDomains: true,
        preload: true
    }
});

// ===== VALIDADORES DE ENTRADA =====

// Validador para usuarios
const validateUser = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username debe tener entre 3 y 30 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username solo puede contener letras, números y guiones bajos')
        .escape(),
    
    body('email')
        .isEmail()
        .withMessage('Email debe ser válido')
        .normalizeEmail()
        .trim(),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password debe tener al menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password debe contener al menos una mayúscula, una minúscula y un número'),
    
    body('tenant_name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Nombre de tienda debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-Z0-9\s\-_]+$/)
        .withMessage('Nombre de tienda contiene caracteres no válidos')
        .escape()
];

// Validador para productos
const validateProduct = [
    body('nombre')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Nombre del producto debe tener entre 1 y 100 caracteres')
        .escape(),
    
    body('descripcion')
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Descripción no puede exceder 1000 caracteres')
        .escape(),
    
    body('precio')
        .isFloat({ min: 0 })
        .withMessage('Precio debe ser un número positivo')
        .toFloat(),
    
    body('categoria_id')
        .isInt({ min: 1 })
        .withMessage('Categoría debe ser un ID válido')
        .toInt()
];

// Validador para mensajes de apoyo emocional
const validateEmotionalSupport = [
    body('mensaje')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Mensaje debe tener entre 10 y 2000 caracteres')
        .escape(),
    
    body('emocion')
        .isIn(['critico', 'muy-mal', 'ansioso', 'frustrado', 'cansado', 'confundido', 'no-especificada'])
        .withMessage('Emoción debe ser una de las opciones válidas'),
    
    body('tenant_id')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Tenant ID debe ser válido')
        .escape()
];

// ===== MIDDLEWARE DE VALIDACIÓN =====

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(`🚨 Errores de validación para IP: ${req.ip}`, errors.array());
        return res.status(400).json({
            error: 'Datos de entrada inválidos',
            details: errors.array()
        });
    }
    next();
};

// ===== LOGGING DE SEGURIDAD =====

const securityLogger = {
    log: (level, message, req = null) => {
        const timestamp = new Date().toISOString();
        const ip = req ? req.ip : 'unknown';
        const userAgent = req ? req.get('User-Agent') : 'unknown';
        
        const logEntry = {
            timestamp,
            level,
            message,
            ip,
            userAgent,
            url: req ? req.originalUrl : null,
            method: req ? req.method : null
        };
        
        console.log(`🔒 [${level.toUpperCase()}] ${timestamp} - ${message} - IP: ${ip}`);
        
        // En producción, aquí guardarías en un archivo de log o base de datos
        // fs.appendFileSync('security.log', JSON.stringify(logEntry) + '\n');
    },
    
    logSuspiciousActivity: (req, reason) => {
        securityLogger.log('WARNING', `Actividad sospechosa detectada: ${reason}`, req);
    },
    
    logFailedAuth: (req, username) => {
        securityLogger.log('ERROR', `Intento de autenticación fallido para usuario: ${username}`, req);
    },
    
    logSuccessfulAuth: (req, username) => {
        securityLogger.log('INFO', `Autenticación exitosa para usuario: ${username}`, req);
    }
};

// ===== MIDDLEWARE DE DETECCIÓN DE ACTIVIDAD SOSPECHOSA =====

const detectSuspiciousActivity = (req, res, next) => {
    const userAgent = req.get('User-Agent') || '';
    const ip = req.ip;
    
    // Detectar user agents sospechosos
    const suspiciousPatterns = [
        /bot/i, /crawler/i, /spider/i, /scraper/i,
        /curl/i, /wget/i, /python/i, /java/i
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
    
    if (isSuspicious && !userAgent.includes('Mozilla')) {
        securityLogger.logSuspiciousActivity(req, `User agent sospechoso: ${userAgent}`);
    }
    
    // Detectar requests anómalos
    if (req.body && typeof req.body === 'object') {
        const bodyStr = JSON.stringify(req.body);
        if (bodyStr.includes('<script') || bodyStr.includes('javascript:')) {
            securityLogger.logSuspiciousActivity(req, 'Posible intento de XSS detectado');
            return res.status(400).json({ error: 'Contenido no permitido detectado' });
        }
    }
    
    next();
};

// ===== EXPORTAR CONFIGURACIONES =====

module.exports = {
    // Rate limiters
    generalLimiter,
    authLimiter,
    sensitiveLimiter,
    
    // Security headers
    helmetConfig,
    
    // Validators
    validateUser,
    validateProduct,
    validateEmotionalSupport,
    validateRequest,
    
    // Security utilities
    securityLogger,
    detectSuspiciousActivity
};























