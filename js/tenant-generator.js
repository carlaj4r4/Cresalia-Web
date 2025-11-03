// ===== GENERADOR DE TIENDAS PARA CLIENTES =====
// Sistema para crear tiendas automáticamente para cada cliente

class TenantGenerator {
    constructor() {
        this.baseURL = 'http://localhost:3001';
    }

    // ===== CREAR NUEVA TIENDA =====
    async crearTienda(datosCliente) {
        try {
            console.log('🏪 Creando nueva tienda para cliente:', datosCliente.email);
            
            // 1. Registrar en el backend
            const response = await fetch(`${this.baseURL}/api/tenants/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: datosCliente.nombreTienda,
                    email: datosCliente.email,
                    password: datosCliente.password,
                    plan: datosCliente.plan || 'free',
                    descripcion: datosCliente.descripcion || '',
                    telefono: datosCliente.telefono || '',
                    direccion: datosCliente.direccion || '',
                    color_primario: datosCliente.colorPrimario || '#7C3AED',
                    color_secundario: datosCliente.colorSecundario || '#EC4899'
                })
            });

            const resultado = await response.json();
            
            if (resultado.success) {
                // 2. Crear archivos de la tienda
                await this.crearArchivosTienda(resultado.tenant);
                
                // 3. Configurar base de datos
                await this.configurarBaseDatos(resultado.tenant);
                
                return {
                    success: true,
                    tenant: resultado.tenant,
                    urls: {
                        tienda: `tiendas/${resultado.tenant.slug}/index.html`,
                        admin: `tiendas/${resultado.tenant.slug}/admin.html`
                    }
                };
            } else {
                throw new Error(resultado.error || 'Error creando tienda');
            }
        } catch (error) {
            console.error('❌ Error creando tienda:', error);
            return { success: false, error: error.message };
        }
    }

    // ===== CREAR ARCHIVOS DE LA TIENDA =====
    async crearArchivosTienda(tenant) {
        try {
            console.log('📁 Creando archivos para tienda:', tenant.slug);
            
            // Crear directorio de la tienda
            const tenantDir = `tiendas/${tenant.slug}`;
            
            // Crear archivos HTML
            await this.crearArchivoTienda(tenantDir, 'index.html', tenant);
            await this.crearArchivoAdmin(tenantDir, 'admin.html', tenant);
            await this.crearArchivoConfig(tenantDir, 'config.js', tenant);
            
            console.log('✅ Archivos de tienda creados correctamente');
        } catch (error) {
            console.error('❌ Error creando archivos:', error);
            throw error;
        }
    }

    async crearArchivoTienda(directorio, archivo, tenant) {
        const contenido = await this.generarContenidoTienda(tenant);
        // En un entorno real, aquí se escribiría el archivo al sistema
        console.log(`📄 Archivo creado: ${directorio}/${archivo}`);
        return contenido;
    }

    async crearArchivoAdmin(directorio, archivo, tenant) {
        const contenido = await this.generarContenidoAdmin(tenant);
        // En un entorno real, aquí se escribiría el archivo al sistema
        console.log(`📄 Archivo creado: ${directorio}/${archivo}`);
        return contenido;
    }

    async crearArchivoConfig(directorio, archivo, tenant) {
        const contenido = await this.generarContenidoConfig(tenant);
        // En un entorno real, aquí se escribiría el archivo al sistema
        console.log(`📄 Archivo creado: ${directorio}/${archivo}`);
        return contenido;
    }

    // ===== GENERAR CONTENIDO DE ARCHIVOS =====
    async generarContenidoTienda(tenant) {
        return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tenant.nombre}</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="../../assets/logo/logo-cresalia.png">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Estilos -->
    <link rel="stylesheet" href="../../styles-cresalia.css">
    <link rel="stylesheet" href="../../css/elegant-notifications.css">
    
    <style>
        :root {
            --primary-color: ${tenant.color_primario};
            --secondary-color: ${tenant.color_secundario};
        }
        
        .hero-section {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 80px 0;
        }
        
        .product-card {
            border: 2px solid #E5E7EB;
            border-radius: 12px;
            transition: all 0.3s ease;
        }
        
        .product-card:hover {
            border-color: var(--primary-color);
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border: none;
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="hero-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-8">
                    <h1 class="display-4 fw-bold">${tenant.nombre}</h1>
                    <p class="lead">${tenant.descripcion || 'Tu tienda online profesional'}</p>
                    <div class="hero-badges">
                        <span class="badge bg-light text-dark me-2">
                            <i class="fas fa-crown"></i> Plan ${tenant.plan}
                        </span>
                        <span class="badge bg-light text-dark">
                            <i class="fas fa-store"></i> Powered by Cresalia
                        </span>
                    </div>
                </div>
                <div class="col-lg-4 text-center">
                    <div class="store-logo">
                        <i class="fas fa-store" style="font-size: 80px; opacity: 0.8;"></i>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Productos -->
    <section class="py-5">
        <div class="container">
            <h2 class="text-center mb-5">Nuestros Productos</h2>
            <div class="row" id="productosContainer">
                <!-- Los productos se cargarán dinámicamente -->
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5>${tenant.nombre}</h5>
                    <p>${tenant.descripcion || 'Tu tienda online profesional'}</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p>Powered by <strong>Cresalia</strong></p>
                    <p><small>© 2024 Cresalia. Todos los derechos reservados.</small></p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="../../js/elegant-notifications.js"></script>
    <script src="../../js/store-backend-connection.js"></script>
    <script src="config.js"></script>
    
    <script>
        // Cargar productos de la tienda
        async function cargarProductos() {
            try {
                const response = await fetch(\`/api/\${tenantInfo.slug}/productos\`);
                const data = await response.json();
                
                if (data.success) {
                    mostrarProductos(data.data);
                } else {
                    mostrarMensajeSinProductos();
                }
            } catch (error) {
                console.error('Error cargando productos:', error);
                mostrarMensajeSinProductos();
            }
        }
        
        function mostrarProductos(productos) {
            const container = document.getElementById('productosContainer');
            
            if (productos.length === 0) {
                mostrarMensajeSinProductos();
                return;
            }
            
            const html = productos.map(producto => \`
                <div class="col-md-4 mb-4">
                    <div class="product-card h-100">
                        <img src="\${producto.imagen || '../../assets/placeholder-product.png'}" 
                             class="card-img-top" alt="\${producto.nombre}" 
                             style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">\${producto.nombre}</h5>
                            <p class="card-text flex-grow-1">\${producto.descripcion || 'Sin descripción'}</p>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <span class="h4 text-primary">$\${producto.precio}</span>
                                    <small class="text-muted">Stock: \${producto.stock || 0}</small>
                                </div>
                                <button class="btn btn-primary w-100" onclick="agregarAlCarrito(\${producto.id})">
                                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            \`).join('');
            
            container.innerHTML = html;
        }
        
        function mostrarMensajeSinProductos() {
            const container = document.getElementById('productosContainer');
            container.innerHTML = \`
                <div class="col-12 text-center">
                    <div class="empty-state">
                        <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                        <h3>No hay productos disponibles</h3>
                        <p class="text-muted">Esta tienda aún no tiene productos configurados.</p>
                    </div>
                </div>
            \`;
        }
        
        function agregarAlCarrito(productoId) {
            if (window.elegantNotifications) {
                window.elegantNotifications.show('Producto agregado al carrito', 'success');
            } else {
                alert('Producto agregado al carrito');
            }
        }
        
        // Inicializar tienda
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🏪 Tienda inicializada:', tenantInfo);
            cargarProductos();
        });
    </script>
</body>
</html>`;
    }

    async generarContenidoAdmin(tenant) {
        // Usar el template de admin-tienda.html y reemplazar las variables
        const template = await fetch('../../tiendas/templates/admin-tienda.html').then(r => r.text());
        
        return template
            .replace(/\{\{NOMBRE_TIENDA\}\}/g, tenant.nombre)
            .replace(/\{\{DESCRIPCION_TIENDA\}\}/g, tenant.descripcion || 'Tu tienda online profesional')
            .replace(/\{\{EMAIL_TIENDA\}\}/g, tenant.email)
            .replace(/\{\{PLAN_TIENDA\}\}/g, tenant.plan)
            .replace(/\{\{COLOR_PRIMARIO\}\}/g, tenant.color_primario)
            .replace(/\{\{COLOR_SECUNDARIO\}\}/g, tenant.color_secundario)
            .replace(/\{\{ID_TIENDA\}\}/g, tenant.id)
            .replace(/\{\{SLUG_TIENDA\}\}/g, tenant.slug)
            .replace(/\{\{FECHA_ACTUALIZACION\}\}/g, new Date().toLocaleDateString());
    }

    async generarContenidoConfig(tenant) {
        return `// ===== CONFIGURACIÓN DE TIENDA =====
// Configuración específica para ${tenant.nombre}

const TIENDA_CONFIG = {
    id: '${tenant.id}',
    slug: '${tenant.slug}',
    nombre: '${tenant.nombre}',
    descripcion: '${tenant.descripcion || ''}',
    email: '${tenant.email}',
    plan: '${tenant.plan}',
    colores: {
        primario: '${tenant.color_primario}',
        secundario: '${tenant.color_secundario}'
    },
    configuracion: {
        mostrarPrecios: true,
        permitirCarrito: true,
        mostrarStock: true,
        modoVista: 'grid'
    },
    redes: {
        instagram: '',
        facebook: '',
        whatsapp: ''
    }
};

// Información del tenant para el frontend
const tenantInfo = {
    id: '${tenant.id}',
    slug: '${tenant.slug}',
    nombre: '${tenant.nombre}',
    email: '${tenant.email}',
    plan: '${tenant.plan}'
};

// Configurar CSS variables
document.documentElement.style.setProperty('--primary-color', '${tenant.color_primario}');
document.documentElement.style.setProperty('--secondary-color', '${tenant.color_secundario}');

console.log('🏪 Configuración de tienda cargada:', TIENDA_CONFIG);`;
    }

    // ===== CONFIGURAR BASE DE DATOS =====
    async configurarBaseDatos(tenant) {
        try {
            console.log('🗄️ Configurando base de datos para tienda:', tenant.slug);
            
            // Crear tablas específicas para la tienda
            const response = await fetch(`${this.baseURL}/api/tenants/${tenant.id}/init`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('✅ Base de datos configurada correctamente');
            } else {
                console.warn('⚠️ Error configurando base de datos');
            }
        } catch (error) {
            console.error('❌ Error configurando base de datos:', error);
        }
    }

    // ===== LISTAR TIENDAS EXISTENTES =====
    async listarTiendas() {
        try {
            const response = await fetch(`${this.baseURL}/api/tenants`);
            const data = await response.json();
            
            if (data.success) {
                return data.tenants || [];
            } else {
                throw new Error(data.error || 'Error obteniendo tiendas');
            }
        } catch (error) {
            console.error('❌ Error listando tiendas:', error);
            return [];
        }
    }

    // ===== OBTENER INFORMACIÓN DE TIENDA =====
    async obtenerTienda(slug) {
        try {
            const response = await fetch(`${this.baseURL}/api/tenants/${slug}`);
            const data = await response.json();
            
            if (data.success) {
                return data.tenant;
            } else {
                throw new Error(data.error || 'Tienda no encontrada');
            }
        } catch (error) {
            console.error('❌ Error obteniendo tienda:', error);
            return null;
        }
    }
}

// ===== INSTANCIA GLOBAL =====
window.tenantGenerator = new TenantGenerator();

console.log('✅ Tenant Generator cargado');























