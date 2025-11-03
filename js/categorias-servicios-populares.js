// ===== CATEGORÍAS Y SERVICIOS POPULARES =====
// Version 1.0 - Cresalia Platform
// Autor: Carla & Claude
// Descripción: Catálogo completo de categorías y servicios para e-commerce

const CategoriasServiciosPopulares = {
    // ===== CATEGORÍAS DE PRODUCTOS =====
    categorias: [
        // ===== MODA Y ACCESORIOS =====
        {
            id: 'ropa-mujer',
            nombre: 'Ropa de Mujer',
            icono: 'fas fa-tshirt',
            descripcion: 'Vestidos, blusas, pantalones y más',
            subcategorias: ['Vestidos', 'Blusas', 'Pantalones', 'Faldas', 'Ropa Deportiva', 'Ropa Interior']
        },
        {
            id: 'ropa-hombre',
            nombre: 'Ropa de Hombre',
            icono: 'fas fa-user-tie',
            descripcion: 'Camisas, pantalones, trajes y más',
            subcategorias: ['Camisas', 'Pantalones', 'Remeras', 'Trajes', 'Ropa Deportiva', 'Ropa Interior']
        },
        {
            id: 'calzado',
            nombre: 'Calzado',
            icono: 'fas fa-shoe-prints',
            descripcion: 'Zapatos, zapatillas, botas',
            subcategorias: ['Zapatillas', 'Zapatos Formales', 'Botas', 'Sandalias', 'Pantuflas']
        },
        {
            id: 'accesorios',
            nombre: 'Accesorios',
            icono: 'fas fa-gem',
            descripcion: 'Carteras, joyas, relojes',
            subcategorias: ['Carteras', 'Mochilas', 'Joyas', 'Relojes', 'Cinturones', 'Gorros', 'Bufandas']
        },

        // ===== TECNOLOGÍA =====
        {
            id: 'celulares',
            nombre: 'Celulares y Tablets',
            icono: 'fas fa-mobile-alt',
            descripcion: 'Smartphones y tablets',
            subcategorias: ['Smartphones', 'Tablets', 'Accesorios para Celular', 'Fundas', 'Protectores']
        },
        {
            id: 'computacion',
            nombre: 'Computación',
            icono: 'fas fa-laptop',
            descripcion: 'Notebooks, PCs, accesorios',
            subcategorias: ['Notebooks', 'PCs de Escritorio', 'Monitores', 'Teclados', 'Mouse', 'Impresoras']
        },
        {
            id: 'electronica',
            nombre: 'Electrónica',
            icono: 'fas fa-bolt',
            descripcion: 'Audio, video, gaming',
            subcategorias: ['Auriculares', 'Parlantes', 'Cámaras', 'Consolas', 'Smart TV', 'Drones']
        },

        // ===== HOGAR Y DECORACIÓN =====
        {
            id: 'muebles',
            nombre: 'Muebles',
            icono: 'fas fa-couch',
            descripcion: 'Sillones, mesas, camas',
            subcategorias: ['Sillones', 'Mesas', 'Sillas', 'Camas', 'Placard', 'Estantes']
        },
        {
            id: 'decoracion',
            nombre: 'Decoración',
            icono: 'fas fa-palette',
            descripcion: 'Cuadros, plantas, iluminación',
            subcategorias: ['Cuadros', 'Espejos', 'Plantas', 'Lámparas', 'Cortinas', 'Alfombras']
        },
        {
            id: 'bazar-cocina',
            nombre: 'Bazar y Cocina',
            icono: 'fas fa-utensils',
            descripcion: 'Utensilios y menaje',
            subcategorias: ['Ollas', 'Sartenes', 'Vajilla', 'Cubiertos', 'Electrodomésticos', 'Organizadores']
        },

        // ===== BELLEZA Y CUIDADO PERSONAL =====
        {
            id: 'belleza',
            nombre: 'Belleza',
            icono: 'fas fa-spa',
            descripcion: 'Maquillaje, skincare, perfumes',
            subcategorias: ['Maquillaje', 'Skincare', 'Perfumes', 'Cremas', 'Tratamientos', 'Cuidado Capilar']
        },
        {
            id: 'salud',
            nombre: 'Salud y Bienestar',
            icono: 'fas fa-heartbeat',
            descripcion: 'Vitaminas, suplementos',
            subcategorias: ['Vitaminas', 'Suplementos', 'Primeros Auxilios', 'Cuidado Personal', 'Fitness']
        },

        // ===== DEPORTES Y FITNESS =====
        {
            id: 'deportes',
            nombre: 'Deportes',
            icono: 'fas fa-running',
            descripcion: 'Equipamiento deportivo',
            subcategorias: ['Ropa Deportiva', 'Calzado Deportivo', 'Equipamiento', 'Bicicletas', 'Camping']
        },
        {
            id: 'fitness',
            nombre: 'Fitness y Gimnasio',
            icono: 'fas fa-dumbbell',
            descripcion: 'Pesas, bandas, máquinas',
            subcategorias: ['Pesas', 'Bandas Elásticas', 'Máquinas', 'Colchonetas', 'Suplementos Deportivos']
        },

        // ===== BEBÉS Y NIÑOS =====
        {
            id: 'bebes',
            nombre: 'Bebés',
            icono: 'fas fa-baby',
            descripcion: 'Todo para tu bebé',
            subcategorias: ['Ropa de Bebé', 'Pañales', 'Juguetes', 'Cochecitos', 'Sillas de Auto', 'Cunas']
        },
        {
            id: 'juguetes',
            nombre: 'Juguetes',
            icono: 'fas fa-puzzle-piece',
            descripcion: 'Juguetes y juegos',
            subcategorias: ['Juguetes Didácticos', 'Muñecas', 'Autos', 'Juegos de Mesa', 'Peluches']
        },

        // ===== ALIMENTOS Y BEBIDAS =====
        {
            id: 'alimentos',
            nombre: 'Alimentos',
            icono: 'fas fa-bread-slice',
            descripcion: 'Comida y snacks',
            subcategorias: ['Snacks', 'Dulces', 'Conservas', 'Granos', 'Especias', 'Bebidas']
        },
        {
            id: 'bebidas',
            nombre: 'Bebidas',
            icono: 'fas fa-wine-bottle',
            descripcion: 'Bebidas y licores',
            subcategorias: ['Vinos', 'Cervezas', 'Licores', 'Gaseosas', 'Jugos', 'Agua']
        },

        // ===== LIBROS Y PAPELERÍA =====
        {
            id: 'libros',
            nombre: 'Libros',
            icono: 'fas fa-book',
            descripcion: 'Libros y literatura',
            subcategorias: ['Ficción', 'No Ficción', 'Autoayuda', 'Infantiles', 'Comics', 'Revistas']
        },
        {
            id: 'papeleria',
            nombre: 'Papelería',
            icono: 'fas fa-pen',
            descripcion: 'Útiles y oficina',
            subcategorias: ['Cuadernos', 'Lapiceras', 'Marcadores', 'Carpetas', 'Calculadoras', 'Art & Craft']
        },

        // ===== MASCOTAS =====
        {
            id: 'mascotas',
            nombre: 'Mascotas',
            icono: 'fas fa-paw',
            descripcion: 'Todo para tu mascota',
            subcategorias: ['Alimento', 'Juguetes', 'Accesorios', 'Salud', 'Camas', 'Transportadoras']
        },

        // ===== AUTOMOTOR =====
        {
            id: 'automotor',
            nombre: 'Automotor',
            icono: 'fas fa-car',
            descripcion: 'Accesorios para auto',
            subcategorias: ['Limpieza', 'Accesorios', 'Repuestos', 'Audio para Auto', 'Herramientas']
        },

        // ===== JARDÍN Y EXTERIOR =====
        {
            id: 'jardin',
            nombre: 'Jardín',
            icono: 'fas fa-leaf',
            descripcion: 'Plantas y jardinería',
            subcategorias: ['Plantas', 'Macetas', 'Herramientas', 'Tierra y Fertilizantes', 'Decoración Exterior']
        },

        // ===== ARTE Y MANUALIDADES =====
        {
            id: 'arte',
            nombre: 'Arte y Manualidades',
            icono: 'fas fa-paint-brush',
            descripcion: 'Materiales artísticos',
            subcategorias: ['Pinturas', 'Pinceles', 'Telas', 'Hilos', 'Herramientas', 'Kits DIY']
        },

        // ===== INSTRUMENTOS MUSICALES =====
        {
            id: 'musica',
            nombre: 'Instrumentos y Música',
            icono: 'fas fa-music',
            descripcion: 'Instrumentos musicales y accesorios',
            subcategorias: ['Guitarras', 'Teclados', 'Baterías', 'Accesorios', 'Micrófonos', 'Audio Profesional']
        }
    ],

    // ===== SERVICIOS COMUNES =====
    servicios: [
        {
            id: 'envio-gratis',
            nombre: 'Envío Gratis',
            icono: 'fas fa-shipping-fast',
            descripcion: 'Envío sin costo a todo el país',
            popular: true
        },
        {
            id: 'envio-rapido',
            nombre: 'Envío Rápido',
            icono: 'fas fa-rocket',
            descripcion: 'Recibí tu pedido en 24-48hs',
            popular: true
        },
        {
            id: 'retiro-local',
            nombre: 'Retiro en Local',
            icono: 'fas fa-store',
            descripcion: 'Retirá en nuestro local sin costo',
            popular: true
        },
        {
            id: 'pago-contraentrega',
            nombre: 'Pago Contra Entrega',
            icono: 'fas fa-hand-holding-usd',
            descripcion: 'Pagá cuando recibís el producto',
            popular: false
        },
        {
            id: 'cuotas-sin-interes',
            nombre: 'Cuotas Sin Interés',
            icono: 'fas fa-credit-card',
            descripcion: 'Hasta 12 cuotas sin interés',
            popular: true
        },
        {
            id: 'garantia-30-dias',
            nombre: 'Garantía 30 Días',
            icono: 'fas fa-shield-alt',
            descripcion: 'Devolución y cambio gratuito',
            popular: true
        },
        {
            id: 'atencion-24-7',
            nombre: 'Atención 24/7',
            icono: 'fas fa-headset',
            descripcion: 'Soporte al cliente siempre disponible',
            popular: false
        },
        {
            id: 'descuentos-mayorista',
            nombre: 'Precios por Mayor',
            icono: 'fas fa-percentage',
            descripcion: 'Descuentos especiales por cantidad',
            popular: false
        },
        {
            id: 'personalizacion',
            nombre: 'Personalización',
            icono: 'fas fa-paint-brush',
            descripcion: 'Productos personalizados a medida',
            popular: false
        },
        {
            id: 'instalacion',
            nombre: 'Instalación Incluida',
            icono: 'fas fa-tools',
            descripcion: 'Instalamos tu producto sin costo',
            popular: false
        },
        {
            id: 'asesoria',
            nombre: 'Asesoría Profesional',
            icono: 'fas fa-user-tie',
            descripcion: 'Te ayudamos a elegir el mejor producto',
            popular: false
        },
        {
            id: 'programa-fidelidad',
            nombre: 'Programa de Fidelidad',
            icono: 'fas fa-gift',
            descripcion: 'Acumulá puntos y ganás premios',
            popular: false
        }
    ],

    // ===== OBTENER CATEGORÍAS POR TIPO =====
    obtenerCategoriasPorTipo(tipo) {
        return this.categorias.filter(cat => 
            cat.nombre.toLowerCase().includes(tipo.toLowerCase())
        );
    },

    // ===== OBTENER SERVICIOS POPULARES =====
    obtenerServiciosPopulares() {
        return this.servicios.filter(s => s.popular);
    },

    // ===== BUSCAR CATEGORÍA =====
    buscarCategoria(termino) {
        return this.categorias.filter(cat => 
            cat.nombre.toLowerCase().includes(termino.toLowerCase()) ||
            cat.descripcion.toLowerCase().includes(termino.toLowerCase())
        );
    },

    // ===== EXPORTAR PARA USAR EN TIENDA =====
    exportarParaTienda() {
        return {
            categorias: this.categorias.map(cat => ({
                id: cat.id,
                nombre: cat.nombre,
                icono: cat.icono,
                descripcion: cat.descripcion
            })),
            servicios: this.servicios
        };
    }
};

// Exportar para uso global
window.CategoriasServiciosPopulares = CategoriasServiciosPopulares;

console.log('✅ Sistema de Categorías y Servicios Populares cargado correctamente');
console.log(`📦 ${CategoriasServiciosPopulares.categorias.length} categorías disponibles`);
console.log(`🎁 ${CategoriasServiciosPopulares.servicios.length} servicios disponibles`);

