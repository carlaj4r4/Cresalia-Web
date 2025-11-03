// ===== SISTEMA DE INTERNACIONALIZACIÓN (i18n) - CRESALIA =====

const IDIOMAS_DISPONIBLES = {
    es: { nombre: 'Español', codigo: 'es', emoji: '🇪🇸' },
    en: { nombre: 'English', codigo: 'en', emoji: '🇬🇧' },
    pt: { nombre: 'Português', codigo: 'pt', emoji: '🇧🇷' },
    fr: { nombre: 'Français', codigo: 'fr', emoji: '🇫🇷' },
    de: { nombre: 'Deutsch', codigo: 'de', emoji: '🇩🇪' },
    it: { nombre: 'Italiano', codigo: 'it', emoji: '🇮🇹' }
};

const TRADUCCIONES = {
    // ESPAÑOL
    es: {
        // Navegación
        'nav.inicio': 'Inicio',
        'nav.productos': 'Productos',
        'nav.servicios': 'Servicios',
        'nav.ayuda': 'Ayuda',
        'nav.contacto': 'Contacto',
        'nav.carrito': 'Carrito',
        'nav.mi_cuenta': 'Mi Cuenta',
        
        // Productos
        'productos.titulo': 'Nuestros Productos',
        'productos.destacados': 'Productos Destacados',
        'productos.todos': 'Todos los Productos',
        'productos.buscar': 'Buscar productos...',
        'productos.filtrar': 'Filtrar por',
        'productos.ordenar': 'Ordenar por',
        'productos.precio': 'Precio',
        'productos.stock': 'Stock',
        'productos.disponible': 'Disponible',
        'productos.agotado': 'Agotado',
        'productos.agregar_carrito': 'Agregar al Carrito',
        'productos.ver_detalles': 'Ver Detalles',
        'productos.sin_resultados': 'No se encontraron productos',
        
        // Carrito
        'carrito.titulo': 'Carrito de Compras',
        'carrito.vacio': 'Tu carrito está vacío',
        'carrito.subtotal': 'Subtotal',
        'carrito.envio': 'Envío',
        'carrito.total': 'Total',
        'carrito.continuar_comprando': 'Continuar Comprando',
        'carrito.finalizar_compra': 'Finalizar Compra',
        'carrito.eliminar': 'Eliminar',
        'carrito.cantidad': 'Cantidad',
        
        // Checkout
        'checkout.titulo': 'Finalizar Compra',
        'checkout.datos_personales': 'Datos Personales',
        'checkout.nombre': 'Nombre Completo',
        'checkout.email': 'Correo Electrónico',
        'checkout.telefono': 'Teléfono',
        'checkout.direccion': 'Dirección de Envío',
        'checkout.ciudad': 'Ciudad',
        'checkout.codigo_postal': 'Código Postal',
        'checkout.metodo_pago': 'Método de Pago',
        'checkout.pago_online': 'Pago Online',
        'checkout.pago_efectivo': 'Pago en Efectivo',
        'checkout.realizar_pedido': 'Realizar Pedido',
        'checkout.procesando': 'Procesando...',
        
        // Historia
        'historia.titulo': 'Nuestra Historia',
        'historia.mision': 'Misión',
        'historia.vision': 'Visión',
        'historia.valores': 'Valores',
        'historia.conocenos': 'Conócenos',
        
        // Chatbot
        'chatbot.bienvenida': '¡Hola! ¿En qué puedo ayudarte?',
        'chatbot.escribe_mensaje': 'Escribe tu mensaje...',
        'chatbot.enviar': 'Enviar',
        'chatbot.minimizar': 'Minimizar',
        'chatbot.cerrar': 'Cerrar',
        'chatbot.escribiendo': 'Escribiendo...',
        
        // Mensajes generales
        'general.cargando': 'Cargando...',
        'general.error': 'Ha ocurrido un error',
        'general.exito': '¡Éxito!',
        'general.cancelar': 'Cancelar',
        'general.aceptar': 'Aceptar',
        'general.guardar': 'Guardar',
        'general.editar': 'Editar',
        'general.eliminar': 'Eliminar',
        'general.buscar': 'Buscar',
        'general.limpiar': 'Limpiar',
        'general.ver_mas': 'Ver más',
        'general.ver_menos': 'Ver menos',
        
        // Footer
        'footer.siguenos': 'Síguenos',
        'footer.contacto': 'Contacto',
        'footer.terminos': 'Términos y Condiciones',
        'footer.privacidad': 'Política de Privacidad',
        'footer.derechos': 'Todos los derechos reservados'
    },
    
    // ENGLISH
    en: {
        'nav.inicio': 'Home',
        'nav.productos': 'Products',
        'nav.servicios': 'Services',
        'nav.ayuda': 'Help',
        'nav.contacto': 'Contact',
        'nav.carrito': 'Cart',
        'nav.mi_cuenta': 'My Account',
        
        'productos.titulo': 'Our Products',
        'productos.destacados': 'Featured Products',
        'productos.todos': 'All Products',
        'productos.buscar': 'Search products...',
        'productos.filtrar': 'Filter by',
        'productos.ordenar': 'Sort by',
        'productos.precio': 'Price',
        'productos.stock': 'Stock',
        'productos.disponible': 'Available',
        'productos.agotado': 'Out of Stock',
        'productos.agregar_carrito': 'Add to Cart',
        'productos.ver_detalles': 'View Details',
        'productos.sin_resultados': 'No products found',
        
        'carrito.titulo': 'Shopping Cart',
        'carrito.vacio': 'Your cart is empty',
        'carrito.subtotal': 'Subtotal',
        'carrito.envio': 'Shipping',
        'carrito.total': 'Total',
        'carrito.continuar_comprando': 'Continue Shopping',
        'carrito.finalizar_compra': 'Checkout',
        'carrito.eliminar': 'Remove',
        'carrito.cantidad': 'Quantity',
        
        'checkout.titulo': 'Checkout',
        'checkout.datos_personales': 'Personal Information',
        'checkout.nombre': 'Full Name',
        'checkout.email': 'Email',
        'checkout.telefono': 'Phone',
        'checkout.direccion': 'Shipping Address',
        'checkout.ciudad': 'City',
        'checkout.codigo_postal': 'Zip Code',
        'checkout.metodo_pago': 'Payment Method',
        'checkout.pago_online': 'Online Payment',
        'checkout.pago_efectivo': 'Cash on Delivery',
        'checkout.realizar_pedido': 'Place Order',
        'checkout.procesando': 'Processing...',
        
        'historia.titulo': 'Our Story',
        'historia.mision': 'Mission',
        'historia.vision': 'Vision',
        'historia.valores': 'Values',
        'historia.conocenos': 'About Us',
        
        'chatbot.bienvenida': 'Hello! How can I help you?',
        'chatbot.escribe_mensaje': 'Type your message...',
        'chatbot.enviar': 'Send',
        'chatbot.minimizar': 'Minimize',
        'chatbot.cerrar': 'Close',
        'chatbot.escribiendo': 'Typing...',
        
        'general.cargando': 'Loading...',
        'general.error': 'An error occurred',
        'general.exito': 'Success!',
        'general.cancelar': 'Cancel',
        'general.aceptar': 'Accept',
        'general.guardar': 'Save',
        'general.editar': 'Edit',
        'general.eliminar': 'Delete',
        'general.buscar': 'Search',
        'general.limpiar': 'Clear',
        'general.ver_mas': 'See more',
        'general.ver_menos': 'See less',
        
        'footer.siguenos': 'Follow Us',
        'footer.contacto': 'Contact',
        'footer.terminos': 'Terms and Conditions',
        'footer.privacidad': 'Privacy Policy',
        'footer.derechos': 'All rights reserved'
    },
    
    // PORTUGUÊS
    pt: {
        'nav.inicio': 'Início',
        'nav.productos': 'Produtos',
        'nav.servicios': 'Serviços',
        'nav.ayuda': 'Ajuda',
        'nav.contacto': 'Contato',
        'nav.carrito': 'Carrinho',
        'nav.mi_cuenta': 'Minha Conta',
        
        'productos.titulo': 'Nossos Produtos',
        'productos.destacados': 'Produtos em Destaque',
        'productos.todos': 'Todos os Produtos',
        'productos.buscar': 'Buscar produtos...',
        'productos.filtrar': 'Filtrar por',
        'productos.ordenar': 'Ordenar por',
        'productos.precio': 'Preço',
        'productos.stock': 'Estoque',
        'productos.disponible': 'Disponível',
        'productos.agotado': 'Esgotado',
        'productos.agregar_carrito': 'Adicionar ao Carrinho',
        'productos.ver_detalles': 'Ver Detalhes',
        'productos.sin_resultados': 'Nenhum produto encontrado',
        
        'carrito.titulo': 'Carrinho de Compras',
        'carrito.vacio': 'Seu carrinho está vazio',
        'carrito.subtotal': 'Subtotal',
        'carrito.envio': 'Envio',
        'carrito.total': 'Total',
        'carrito.continuar_comprando': 'Continuar Comprando',
        'carrito.finalizar_compra': 'Finalizar Compra',
        'carrito.eliminar': 'Remover',
        'carrito.cantidad': 'Quantidade',
        
        'checkout.titulo': 'Finalizar Compra',
        'checkout.datos_personales': 'Dados Pessoais',
        'checkout.nombre': 'Nome Completo',
        'checkout.email': 'E-mail',
        'checkout.telefono': 'Telefone',
        'checkout.direccion': 'Endereço de Entrega',
        'checkout.ciudad': 'Cidade',
        'checkout.codigo_postal': 'CEP',
        'checkout.metodo_pago': 'Método de Pagamento',
        'checkout.pago_online': 'Pagamento Online',
        'checkout.pago_efectivo': 'Pagamento em Dinheiro',
        'checkout.realizar_pedido': 'Realizar Pedido',
        'checkout.procesando': 'Processando...',
        
        'historia.titulo': 'Nossa História',
        'historia.mision': 'Missão',
        'historia.vision': 'Visão',
        'historia.valores': 'Valores',
        'historia.conocenos': 'Sobre Nós',
        
        'chatbot.bienvenida': 'Olá! Como posso ajudar?',
        'chatbot.escribe_mensaje': 'Digite sua mensagem...',
        'chatbot.enviar': 'Enviar',
        'chatbot.minimizar': 'Minimizar',
        'chatbot.cerrar': 'Fechar',
        'chatbot.escribiendo': 'Digitando...',
        
        'general.cargando': 'Carregando...',
        'general.error': 'Ocorreu um erro',
        'general.exito': 'Sucesso!',
        'general.cancelar': 'Cancelar',
        'general.aceptar': 'Aceitar',
        'general.guardar': 'Salvar',
        'general.editar': 'Editar',
        'general.eliminar': 'Excluir',
        'general.buscar': 'Buscar',
        'general.limpiar': 'Limpar',
        'general.ver_mas': 'Ver mais',
        'general.ver_menos': 'Ver menos',
        
        'footer.siguenos': 'Siga-nos',
        'footer.contacto': 'Contato',
        'footer.terminos': 'Termos e Condições',
        'footer.privacidad': 'Política de Privacidade',
        'footer.derechos': 'Todos os direitos reservados'
    }
};

// ===== CLASE I18N =====
class I18nCresalia {
    constructor() {
        this.idiomaActual = localStorage.getItem('cresalia_idioma') || 'es';
        this.tenantConfig = null;
    }

    // Inicializar con configuración del tenant
    async init(tenantSlug) {
        try {
            const response = await fetch(`http://localhost:3001/api/${tenantSlug}/config`);
            const data = await response.json();
            this.tenantConfig = data.config;
            
            // Si el tenant tiene idioma preferido, usarlo
            if (this.tenantConfig.idioma) {
                this.idiomaActual = this.tenantConfig.idioma;
            }
            
            this.aplicarTraducciones();
        } catch (error) {
            console.error('Error inicializando i18n:', error);
        }
    }

    // Cambiar idioma
    cambiarIdioma(codigoIdioma) {
        if (TRADUCCIONES[codigoIdioma]) {
            this.idiomaActual = codigoIdioma;
            localStorage.setItem('cresalia_idioma', codigoIdioma);
            this.aplicarTraducciones();
            
            // Disparar evento personalizado
            window.dispatchEvent(new CustomEvent('idiomasCambiado', { 
                detail: { idioma: codigoIdioma } 
            }));
        }
    }

    // Obtener traducción
    t(clave, params = {}) {
        const traduccion = TRADUCCIONES[this.idiomaActual]?.[clave] || 
                          TRADUCCIONES['es']?.[clave] || 
                          clave;
        
        // Reemplazar parámetros
        let resultado = traduccion;
        Object.keys(params).forEach(key => {
            resultado = resultado.replace(`{${key}}`, params[key]);
        });
        
        return resultado;
    }

    // Aplicar traducciones automáticamente a elementos con data-i18n
    aplicarTraducciones() {
        document.querySelectorAll('[data-i18n]').forEach(elemento => {
            const clave = elemento.getAttribute('data-i18n');
            const atributo = elemento.getAttribute('data-i18n-attr');
            
            if (atributo) {
                elemento.setAttribute(atributo, this.t(clave));
            } else {
                elemento.textContent = this.t(clave);
            }
        });
    }

    // Crear selector de idiomas
    crearSelectorIdiomas() {
        const idiomasDisponibles = this.tenantConfig?.idiomas_disponibles || ['es', 'en'];
        
        const selector = document.createElement('div');
        selector.className = 'idioma-selector';
        selector.innerHTML = `
            <button class="idioma-actual" onclick="toggleIdiomaMenu()">
                ${IDIOMAS_DISPONIBLES[this.idiomaActual].emoji}
                ${IDIOMAS_DISPONIBLES[this.idiomaActual].nombre}
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="idioma-menu" id="idiomaMenu" style="display: none;">
                ${idiomasDisponibles.map(codigo => `
                    <button class="idioma-opcion" onclick="i18n.cambiarIdioma('${codigo}')">
                        ${IDIOMAS_DISPONIBLES[codigo].emoji}
                        ${IDIOMAS_DISPONIBLES[codigo].nombre}
                    </button>
                `).join('')}
            </div>
        `;
        
        return selector;
    }

    // Obtener idiomas disponibles para el tenant
    getIdiomasDisponibles() {
        return this.tenantConfig?.idiomas_disponibles || ['es'];
    }
}

// Funciones globales
function toggleIdiomaMenu() {
    const menu = document.getElementById('idiomaMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Instancia global
const i18n = new I18nCresalia();

// Función global para aplicar traducciones (usada por el selector del navbar)
function aplicarTraducciones(codigoIdioma) {
    console.log('🌍 Aplicando traducciones para:', codigoIdioma);
    
    // Cambiar idioma en la instancia i18n
    i18n.cambiarIdioma(codigoIdioma);
    
    // Aplicar traducciones automáticas a elementos con data-i18n
    i18n.aplicarTraducciones();
    
    // TRADUCCIÓN AUTOMÁTICA de botones y textos comunes (sin necesidad de data-i18n)
    aplicarTraduccionesAutomaticas(codigoIdioma);
    
    console.log('✅ Traducciones aplicadas');
}

// Traducción automática de elementos comunes
function aplicarTraduccionesAutomaticas(idioma) {
    const traducciones = TRADUCCIONES[idioma] || TRADUCCIONES.es;
    
    // Traducir botones comunes por texto
    const botonesComunes = {
        'Comprar Ahora': traducciones['productos.comprar'] || 'Comprar Ahora',
        'Ver más': traducciones['general.ver_mas'] || 'Ver más',
        'Agregar al Carrito': traducciones['productos.agregar_carrito'] || 'Agregar al Carrito',
        'Finalizar Compra': traducciones['carrito.finalizar_compra'] || 'Finalizar Compra',
        'Continuar Comprando': traducciones['carrito.continuar_comprando'] || 'Continuar Comprando'
    };
    
    // Buscar y traducir botones
    document.querySelectorAll('button').forEach(btn => {
        const textoOriginal = btn.textContent.trim();
        if (botonesComunes[textoOriginal]) {
            btn.textContent = botonesComunes[textoOriginal];
        }
    });
    
    console.log('✅ Traducciones automáticas aplicadas');
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18nCresalia, TRADUCCIONES, IDIOMAS_DISPONIBLES };
}


