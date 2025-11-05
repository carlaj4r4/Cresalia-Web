// ===== SISTEMA DE SEGURIDAD Y VALIDACIÓN DE ENTRADA - CRESALIA =====
// Sistema centralizado para validar y sanitizar todas las entradas de usuario

class SeguridadValidacionEntrada {
    constructor() {
        this.maxLength = {
            titulo: 200,
            descripcion: 5000,
            mensaje: 2000,
            nombre: 100,
            email: 255,
            telefono: 20,
            url: 500
        };
        
        this.patterns = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            telefono: /^[\d\s\-\+\(\)]+$/,
            url: /^https?:\/\/.+/,
            alfanumerico: /^[a-zA-Z0-9\s\-_áéíóúñÁÉÍÓÚÑ]+$/,
            hash: /^[a-zA-Z0-9]+$/
        };
    }
    
    // ===== SANITIZACIÓN BÁSICA =====
    sanitizar(texto) {
        if (typeof texto !== 'string') {
            if (texto === null || texto === undefined) return '';
            texto = String(texto);
        }
        
        // Trim espacios
        texto = texto.trim();
        
        // Remover caracteres de control
        texto = texto.replace(/[\x00-\x1F\x7F]/g, '');
        
        // Escapar HTML para prevenir XSS
        texto = this.escapeHtml(texto);
        
        return texto;
    }
    
    // ===== ESCAPAR HTML (XSS Protection) =====
    escapeHtml(texto) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return texto.replace(/[&<>"']/g, m => map[m]);
    }
    
    // ===== VALIDAR Y SANITIZAR TEXTO =====
    validarTexto(texto, campo, opciones = {}) {
        const {
            maxLength = this.maxLength[campo] || 1000,
            minLength = 1,
            required = true,
            allowEmpty = false,
            pattern = null
        } = opciones;
        
        // Si no es requerido y está vacío, retornar vacío
        if (!required && (!texto || texto.trim() === '')) {
            return { valido: true, valor: '', error: null };
        }
        
        // Validar que existe
        if (!texto || texto.trim() === '') {
            if (allowEmpty) {
                return { valido: true, valor: '', error: null };
            }
            return { valido: false, valor: null, error: `El campo ${campo} es requerido` };
        }
        
        // Sanitizar
        let valor = this.sanitizar(texto);
        
        // Validar longitud mínima
        if (valor.length < minLength) {
            return { valido: false, valor: null, error: `El campo ${campo} debe tener al menos ${minLength} caracteres` };
        }
        
        // Validar longitud máxima
        if (valor.length > maxLength) {
            return { valido: false, valor: null, error: `El campo ${campo} no puede exceder ${maxLength} caracteres` };
        }
        
        // Validar patrón si existe
        if (pattern && !pattern.test(valor)) {
            return { valido: false, valor: null, error: `El campo ${campo} tiene un formato inválido` };
        }
        
        return { valido: true, valor: valor, error: null };
    }
    
    // ===== VALIDAR EMAIL =====
    validarEmail(email) {
        if (!email || email.trim() === '') {
            return { valido: false, valor: null, error: 'El email es requerido' };
        }
        
        const emailSanitizado = email.trim().toLowerCase();
        
        if (!this.patterns.email.test(emailSanitizado)) {
            return { valido: false, valor: null, error: 'El email tiene un formato inválido' };
        }
        
        if (emailSanitizado.length > this.maxLength.email) {
            return { valido: false, valor: null, error: 'El email es demasiado largo' };
        }
        
        return { valido: true, valor: emailSanitizado, error: null };
    }
    
    // ===== VALIDAR TELEFONO =====
    validarTelefono(telefono) {
        if (!telefono || telefono.trim() === '') {
            return { valido: true, valor: '', error: null }; // Telefono opcional
        }
        
        const telefonoSanitizado = telefono.trim().replace(/\s+/g, '');
        
        if (!this.patterns.telefono.test(telefonoSanitizado)) {
            return { valido: false, valor: null, error: 'El teléfono tiene un formato inválido' };
        }
        
        if (telefonoSanitizado.length > this.maxLength.telefono) {
            return { valido: false, valor: null, error: 'El teléfono es demasiado largo' };
        }
        
        return { valido: true, valor: telefonoSanitizado, error: null };
    }
    
    // ===== VALIDAR URL =====
    validarUrl(url) {
        if (!url || url.trim() === '') {
            return { valido: true, valor: '', error: null }; // URL opcional
        }
        
        const urlSanitizada = url.trim();
        
        if (!this.patterns.url.test(urlSanitizada)) {
            return { valido: false, valor: null, error: 'La URL debe comenzar con http:// o https://' };
        }
        
        if (urlSanitizada.length > this.maxLength.url) {
            return { valido: false, valor: null, error: 'La URL es demasiado larga' };
        }
        
        return { valido: true, valor: urlSanitizada, error: null };
    }
    
    // ===== VALIDAR NÚMERO =====
    validarNumero(numero, opciones = {}) {
        const {
            min = null,
            max = null,
            entero = false,
            required = true
        } = opciones;
        
        if (!numero && numero !== 0) {
            if (required) {
                return { valido: false, valor: null, error: 'El número es requerido' };
            }
            return { valido: true, valor: null, error: null };
        }
        
        const num = entero ? parseInt(numero) : parseFloat(numero);
        
        if (isNaN(num)) {
            return { valido: false, valor: null, error: 'El valor debe ser un número válido' };
        }
        
        if (min !== null && num < min) {
            return { valido: false, valor: null, error: `El número debe ser mayor o igual a ${min}` };
        }
        
        if (max !== null && num > max) {
            return { valido: false, valor: null, error: `El número debe ser menor o igual a ${max}` };
        }
        
        return { valido: true, valor: num, error: null };
    }
    
    // ===== VALIDAR ARRAY =====
    validarArray(array, opciones = {}) {
        const {
            maxItems = 100,
            minItems = 0,
            required = false
        } = opciones;
        
        if (!Array.isArray(array)) {
            if (required) {
                return { valido: false, valor: null, error: 'Se espera un array' };
            }
            return { valido: true, valor: [], error: null };
        }
        
        if (array.length < minItems) {
            return { valido: false, valor: null, error: `Se requieren al menos ${minItems} elementos` };
        }
        
        if (array.length > maxItems) {
            return { valido: false, valor: null, error: `No se pueden exceder ${maxItems} elementos` };
        }
        
        // Sanitizar cada elemento del array
        const arraySanitizado = array.map(item => {
            if (typeof item === 'string') {
                return this.sanitizar(item);
            }
            return item;
        });
        
        return { valido: true, valor: arraySanitizado, error: null };
    }
    
    // ===== DETECTAR INTENTOS DE ATAQUE =====
    detectarAtaques(texto) {
        const ataques = {
            xss: /<script|javascript:|onerror=|onload=|onclick=|onmouseover=/i,
            sqlInjection: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)|('|(;)|(--)|(\/\*)|(\*\/))/i,
            pathTraversal: /\.\.\/|\.\.\\|\.\.%2f|\.\.%5c/i,
            commandInjection: /[;&|`$(){}[\]]/
        };
        
        const detecciones = [];
        
        for (const [tipo, pattern] of Object.entries(ataques)) {
            if (pattern.test(texto)) {
                detecciones.push(tipo);
            }
        }
        
        return detecciones.length > 0 ? {
            detectado: true,
            tipos: detecciones,
            bloqueado: true
        } : {
            detectado: false,
            tipos: [],
            bloqueado: false
        };
    }
    
    // ===== VALIDAR OBJETO COMPLETO =====
    validarObjeto(objeto, esquema) {
        const resultado = {
            valido: true,
            datos: {},
            errores: []
        };
        
        for (const [campo, reglas] of Object.entries(esquema)) {
            const valor = objeto[campo];
            
            // Detectar ataques
            if (typeof valor === 'string') {
                const deteccion = this.detectarAtaques(valor);
                if (deteccion.detectado) {
                    resultado.errores.push(`Intento de ataque detectado en ${campo}: ${deteccion.tipos.join(', ')}`);
                    resultado.valido = false;
                    continue;
                }
            }
            
            // Validar según tipo
            let validacion;
            
            if (reglas.tipo === 'texto') {
                validacion = this.validarTexto(valor, campo, reglas);
            } else if (reglas.tipo === 'email') {
                validacion = this.validarEmail(valor);
            } else if (reglas.tipo === 'telefono') {
                validacion = this.validarTelefono(valor);
            } else if (reglas.tipo === 'url') {
                validacion = this.validarUrl(valor);
            } else if (reglas.tipo === 'numero') {
                validacion = this.validarNumero(valor, reglas);
            } else if (reglas.tipo === 'array') {
                validacion = this.validarArray(valor, reglas);
            } else {
                validacion = { valido: true, valor: valor, error: null };
            }
            
            if (!validacion.valido) {
                resultado.valido = false;
                resultado.errores.push(validacion.error);
            } else {
                resultado.datos[campo] = validacion.valor;
            }
        }
        
        return resultado;
    }
    
    // ===== LIMPIAR OBJETO DE DATOS PELIGROSOS =====
    limpiarObjeto(objeto) {
        const limpio = {};
        
        for (const [clave, valor] of Object.entries(objeto)) {
            if (typeof valor === 'string') {
                // Detectar y bloquear ataques
                const deteccion = this.detectarAtaques(valor);
                if (deteccion.detectado) {
                    console.warn(`⚠️ Intento de ataque bloqueado en campo ${clave}:`, deteccion.tipos);
                    continue; // No incluir campos con ataques
                }
                
                limpio[clave] = this.sanitizar(valor);
            } else if (Array.isArray(valor)) {
                limpio[clave] = valor.map(item => 
                    typeof item === 'string' ? this.sanitizar(item) : item
                );
            } else {
                limpio[clave] = valor;
            }
        }
        
        return limpio;
    }
}

// Exportar instancia global
if (typeof window !== 'undefined') {
    window.SeguridadValidacionEntrada = SeguridadValidacionEntrada;
    window.seguridadValidacion = new SeguridadValidacionEntrada();
}

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SeguridadValidacionEntrada;
}



