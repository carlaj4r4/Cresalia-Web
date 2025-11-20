// ===== SISTEMA DE LÍMITES POR PLAN - CRESALIA =====
// Versión: 1.0
// Autor: Claude para Cresalia
// Fecha: Enero 2025

class SistemaLimitesPlan {
    constructor() {
        this.planes = {
            free: {
                nombre: 'Free',
                limite_productos: 50,
                limite_ordenes_mes: 100,
                limite_usuarios: 10,
                limite_almacenamiento_mb: 100,
                limite_visitas_mes: 1000,
                alerta_productos: 45, // 90% del límite
                alerta_ordenes: 90, // 90% del límite
                alerta_almacenamiento: 80 // 80% del límite
            },
            basic: {
                nombre: 'Básico',
                limite_productos: 200,
                limite_ordenes_mes: 500,
                limite_usuarios: 50,
                limite_almacenamiento_mb: 1000,
                limite_visitas_mes: 10000,
                alerta_productos: 180,
                alerta_ordenes: 450,
                alerta_almacenamiento: 800
            },
            pro: {
                nombre: 'Pro',
                limite_productos: 1000,
                limite_ordenes_mes: 2000,
                limite_usuarios: 200,
                limite_almacenamiento_mb: 10000,
                limite_visitas_mes: 100000,
                alerta_productos: 900,
                alerta_ordenes: 1800,
                alerta_almacenamiento: 8000
            },
            enterprise: {
                nombre: 'Enterprise',
                limite_productos: -1, // Ilimitado
                limite_ordenes_mes: -1, // Ilimitado
                limite_usuarios: -1, // Ilimitado
                limite_almacenamiento_mb: -1, // Ilimitado
                limite_visitas_mes: -1, // Ilimitado
                alerta_productos: -1,
                alerta_ordenes: -1,
                alerta_almacenamiento: -1
            }
        };

        this.init();
    }

    async init() {
        console.log('📊 Sistema de Límites por Plan iniciado');
    }

    // ===== 1. VERIFICAR LÍMITES ANTES DE AGREGAR PRODUCTO =====
    async puedeAgregarProducto(tiendaId) {
        try {
            const tienda = await this.obtenerTienda(tiendaId);
            if (!tienda) {
                return { permitido: false, razon: 'Tienda no encontrada' };
            }

            const plan = this.planes[tienda.plan] || this.planes.free;
            const uso = await this.obtenerUsoActual(tiendaId);

            // Si es ilimitado
            if (plan.limite_productos === -1) {
                return { permitido: true, razon: 'Plan ilimitado' };
            }

            // Verificar límite
            if (uso.productos >= plan.limite_productos) {
                return {
                    permitido: false,
                    razon: `Has alcanzado el límite de ${plan.limite_productos} productos`,
                    limite: plan.limite_productos,
                    actual: uso.productos,
                    restante: 0,
                    sugerencia: 'Actualiza tu plan para agregar más productos'
                };
            }

            // Verificar si está cerca del límite (alerta)
            if (uso.productos >= plan.alerta_productos) {
                await this.mostrarAlertaLimite(tiendaId, 'productos', uso.productos, plan.limite_productos);
            }

            return {
                permitido: true,
                limite: plan.limite_productos,
                actual: uso.productos,
                restante: plan.limite_productos - uso.productos
            };

        } catch (error) {
            console.error('❌ Error verificando límite de productos:', error);
            return { permitido: false, razon: 'Error al verificar límites' };
        }
    }

    // ===== 2. VERIFICAR LÍMITES ANTES DE CREAR ORDEN =====
    async puedeCrearOrden(tiendaId) {
        try {
            const tienda = await this.obtenerTienda(tiendaId);
            if (!tienda) {
                return { permitido: false, razon: 'Tienda no encontrada' };
            }

            const plan = this.planes[tienda.plan] || this.planes.free;
            const uso = await this.obtenerUsoActual(tiendaId);

            // Si es ilimitado
            if (plan.limite_ordenes_mes === -1) {
                return { permitido: true, razon: 'Plan ilimitado' };
            }

            // Verificar límite mensual
            if (uso.ordenes_mes >= plan.limite_ordenes_mes) {
                return {
                    permitido: false,
                    razon: `Has alcanzado el límite de ${plan.limite_ordenes_mes} órdenes este mes`,
                    limite: plan.limite_ordenes_mes,
                    actual: uso.ordenes_mes,
                    restante: 0,
                    sugerencia: 'Actualiza tu plan o espera al próximo mes'
                };
            }

            // Verificar si está cerca del límite (alerta)
            if (uso.ordenes_mes >= plan.alerta_ordenes) {
                await this.mostrarAlertaLimite(tiendaId, 'ordenes', uso.ordenes_mes, plan.limite_ordenes_mes);
            }

            return {
                permitido: true,
                limite: plan.limite_ordenes_mes,
                actual: uso.ordenes_mes,
                restante: plan.limite_ordenes_mes - uso.ordenes_mes
            };

        } catch (error) {
            console.error('❌ Error verificando límite de órdenes:', error);
            return { permitido: false, razon: 'Error al verificar límites' };
        }
    }

    // ===== 3. VERIFICAR LÍMITES ANTES DE AGREGAR USUARIO =====
    async puedeAgregarUsuario(tiendaId) {
        try {
            const tienda = await this.obtenerTienda(tiendaId);
            if (!tienda) {
                return { permitido: false, razon: 'Tienda no encontrada' };
            }

            const plan = this.planes[tienda.plan] || this.planes.free;
            const uso = await this.obtenerUsoActual(tiendaId);

            // Si es ilimitado
            if (plan.limite_usuarios === -1) {
                return { permitido: true, razon: 'Plan ilimitado' };
            }

            // Verificar límite
            if (uso.usuarios >= plan.limite_usuarios) {
                return {
                    permitido: false,
                    razon: `Has alcanzado el límite de ${plan.limite_usuarios} usuarios`,
                    limite: plan.limite_usuarios,
                    actual: uso.usuarios,
                    restante: 0,
                    sugerencia: 'Actualiza tu plan para agregar más usuarios'
                };
            }

            return {
                permitido: true,
                limite: plan.limite_usuarios,
                actual: uso.usuarios,
                restante: plan.limite_usuarios - uso.usuarios
            };

        } catch (error) {
            console.error('❌ Error verificando límite de usuarios:', error);
            return { permitido: false, razon: 'Error al verificar límites' };
        }
    }

    // ===== 4. BLOQUEAR FUNCIONALIDAD SI SE EXCEDE EL LÍMITE =====
    async bloquearSiExcedeLimite(tiendaId, tipo, valorActual) {
        try {
            const tienda = await this.obtenerTienda(tiendaId);
            if (!tienda) {
                return { bloqueado: true, razon: 'Tienda no encontrada' };
            }

            const plan = this.planes[tienda.plan] || this.planes.free;
            let limite = -1;
            let mensaje = '';

            switch (tipo) {
                case 'productos':
                    limite = plan.limite_productos;
                    mensaje = `No puedes agregar más productos. Límite: ${limite}`;
                    break;
                case 'ordenes':
                    limite = plan.limite_ordenes_mes;
                    mensaje = `No puedes crear más órdenes este mes. Límite: ${limite}`;
                    break;
                case 'usuarios':
                    limite = plan.limite_usuarios;
                    mensaje = `No puedes agregar más usuarios. Límite: ${limite}`;
                    break;
                default:
                    return { bloqueado: false };
            }

            // Si es ilimitado, no bloquear
            if (limite === -1) {
                return { bloqueado: false };
            }

            // Si excede el límite, bloquear
            if (valorActual >= limite) {
                await this.mostrarModalLimiteAlcanzado(tiendaId, tipo, valorActual, limite);
                return {
                    bloqueado: true,
                    razon: mensaje,
                    limite: limite,
                    actual: valorActual
                };
            }

            return { bloqueado: false };

        } catch (error) {
            console.error('❌ Error bloqueando por límite:', error);
            return { bloqueado: false };
        }
    }

    // ===== 5. OBTENER USO ACTUAL =====
    async obtenerUsoActual(tiendaId) {
        try {
            // Obtener cantidad de productos
            const { count: productos, error: productosError } = await supabase
                .from('productos')
                .select('*', { count: 'exact', head: true })
                .eq('tienda_id', tiendaId);

            // Obtener órdenes del mes actual
            const inicioMes = new Date();
            inicioMes.setDate(1);
            inicioMes.setHours(0, 0, 0, 0);

            const { count: ordenes_mes, error: ordenesError } = await supabase
                .from('ordenes')
                .select('*', { count: 'exact', head: true })
                .eq('tienda_id', tiendaId)
                .gte('created_at', inicioMes.toISOString());

            // Obtener cantidad de usuarios
            const { count: usuarios, error: usuariosError } = await supabase
                .from('usuarios_tienda')
                .select('*', { count: 'exact', head: true })
                .eq('tienda_id', tiendaId);

            // Calcular almacenamiento (aproximado)
            const almacenamiento_mb = await this.calcularAlmacenamiento(tiendaId);

            return {
                productos: productos || 0,
                ordenes_mes: ordenes_mes || 0,
                usuarios: usuarios || 0,
                almacenamiento_mb: almacenamiento_mb || 0
            };

        } catch (error) {
            console.error('❌ Error obteniendo uso actual:', error);
            return {
                productos: 0,
                ordenes_mes: 0,
                usuarios: 0,
                almacenamiento_mb: 0
            };
        }
    }

    // ===== 6. OBTENER TIENDA =====
    async obtenerTienda(tiendaId) {
        try {
            const { data, error } = await supabase
                .from('tiendas')
                .select('*')
                .eq('id', tiendaId)
                .single();

            if (error) {
                console.error('❌ Error obteniendo tienda:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('❌ Error obteniendo tienda:', error);
            return null;
        }
    }

    // ===== 7. CALCULAR ALMACENAMIENTO =====
    async calcularAlmacenamiento(tiendaId) {
        try {
            // Obtener todas las imágenes de productos
            const { data: productos, error } = await supabase
                .from('productos')
                .select('imagenes')
                .eq('tienda_id', tiendaId);

            if (error) {
                return 0;
            }

            // Calcular tamaño aproximado (asumiendo ~100KB por imagen)
            const cantidadImagenes = productos.reduce((total, producto) => {
                const imagenes = producto.imagenes || [];
                return total + imagenes.length;
            }, 0);

            return Math.round((cantidadImagenes * 100) / 1024); // MB

        } catch (error) {
            return 0;
        }
    }

    // ===== 8. MOSTRAR ALERTA DE LÍMITE =====
    async mostrarAlertaLimite(tiendaId, tipo, actual, limite) {
        try {
            // Verificar si ya se mostró la alerta hoy
            const alertaKey = `alerta_${tipo}_${tiendaId}_${new Date().toDateString()}`;
            const yaAlerta = localStorage.getItem(alertaKey);

            if (yaAlerta) {
                return; // Ya se mostró hoy
            }

            // Mostrar notificación
            if (window.elegantNotifications) {
                window.elegantNotifications.warning(
                    `⚠️ Estás cerca del límite de ${tipo}. Has usado ${actual} de ${limite}. Considera actualizar tu plan.`,
                    'Límite Cercano'
                );
            }

            // Marcar como mostrada
            localStorage.setItem(alertaKey, 'true');

        } catch (error) {
            console.error('❌ Error mostrando alerta:', error);
        }
    }

    // ===== 9. MOSTRAR MODAL DE LÍMITE ALCANZADO =====
    async mostrarModalLimiteAlcanzado(tiendaId, tipo, actual, limite) {
        try {
            const tienda = await this.obtenerTienda(tiendaId);
            const plan = this.planes[tienda.plan] || this.planes.free;

            // Determinar plan recomendado
            let planRecomendado = 'basic';
            if (tienda.plan === 'free') planRecomendado = 'basic';
            else if (tienda.plan === 'basic') planRecomendado = 'pro';
            else if (tienda.plan === 'pro') planRecomendado = 'enterprise';

            const planData = this.planes[planRecomendado];

            const modalHTML = `
                <div id="modalLimiteAlcanzado" class="modal-limite-alcanzado">
                    <div class="modal-limite-content">
                        <div class="modal-limite-header">
                            <h3>🚫 Límite Alcanzado</h3>
                            <button onclick="this.closest('.modal-limite-alcanzado').remove()" class="close-btn">&times;</button>
                        </div>
                        <div class="modal-limite-body">
                            <p>Has alcanzado el límite de <strong>${tipo}</strong> de tu plan actual.</p>
                            <div class="info-box">
                                <p><strong>Plan Actual:</strong> ${plan.nombre}</p>
                                <p><strong>Límite:</strong> ${limite} ${tipo}</p>
                                <p><strong>Usado:</strong> ${actual} ${tipo}</p>
                            </div>
                            <div class="recommendation-box">
                                <h4>💡 Recomendación</h4>
                                <p>Actualiza a <strong>${planData.nombre}</strong> para obtener:</p>
                                <ul>
                                    <li>Límite de ${tipo}: ${planData[`limite_${tipo}`] === -1 ? 'Ilimitado' : planData[`limite_${tipo}`]}</li>
                                    <li>Y muchas otras funcionalidades</li>
                                </ul>
                                <button onclick="sistemaLimitesPlan.actualizarPlan('${planRecomendado}')" class="btn-upgrade">
                                    🚀 Actualizar a ${planData.nombre}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Agregar modal al DOM
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Agregar estilos si no existen
            if (!document.querySelector('#estilos-limites-plan')) {
                const estilos = document.createElement('style');
                estilos.id = 'estilos-limites-plan';
                estilos.textContent = `
                    .modal-limite-alcanzado {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.8);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10000;
                    }
                    .modal-limite-content {
                        background: white;
                        border-radius: 20px;
                        max-width: 500px;
                        width: 90%;
                        padding: 30px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    }
                    .modal-limite-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        border-bottom: 2px solid #E5E7EB;
                    }
                    .modal-limite-header h3 {
                        margin: 0;
                        color: #DC2626;
                    }
                    .close-btn {
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #6B7280;
                    }
                    .info-box {
                        background: #FEF2F2;
                        border: 2px solid #FCA5A5;
                        border-radius: 10px;
                        padding: 15px;
                        margin: 20px 0;
                    }
                    .recommendation-box {
                        background: #F0F9FF;
                        border: 2px solid #7C3AED;
                        border-radius: 10px;
                        padding: 20px;
                        margin-top: 20px;
                    }
                    .recommendation-box h4 {
                        margin: 0 0 10px 0;
                        color: #7C3AED;
                    }
                    .btn-upgrade {
                        background: linear-gradient(135deg, #7C3AED, #EC4899);
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 10px;
                        font-weight: 600;
                        cursor: pointer;
                        margin-top: 15px;
                        width: 100%;
                    }
                    .btn-upgrade:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 25px rgba(124, 58, 237, 0.3);
                    }
                `;
                document.head.appendChild(estilos);
            }

        } catch (error) {
            console.error('❌ Error mostrando modal:', error);
        }
    }

    // ===== 10. ACTUALIZAR PLAN =====
    async actualizarPlan(planNuevo) {
        try {
            // Redirigir a página de actualización de plan
            window.location.href = `/admin-cresalia.html?section=planes&upgrade=${planNuevo}`;
        } catch (error) {
            console.error('❌ Error actualizando plan:', error);
        }
    }

    // ===== 11. OBTENER ESTADÍSTICAS DE USO =====
    async obtenerEstadisticasUso(tiendaId) {
        try {
            const tienda = await this.obtenerTienda(tiendaId);
            const plan = this.planes[tienda.plan] || this.planes.free;
            const uso = await this.obtenerUsoActual(tiendaId);

            return {
                plan: plan.nombre,
                uso: {
                    productos: {
                        actual: uso.productos,
                        limite: plan.limite_productos,
                        porcentaje: plan.limite_productos === -1 ? 0 : (uso.productos / plan.limite_productos) * 100,
                        restante: plan.limite_productos === -1 ? -1 : plan.limite_productos - uso.productos
                    },
                    ordenes: {
                        actual: uso.ordenes_mes,
                        limite: plan.limite_ordenes_mes,
                        porcentaje: plan.limite_ordenes_mes === -1 ? 0 : (uso.ordenes_mes / plan.limite_ordenes_mes) * 100,
                        restante: plan.limite_ordenes_mes === -1 ? -1 : plan.limite_ordenes_mes - uso.ordenes_mes
                    },
                    usuarios: {
                        actual: uso.usuarios,
                        limite: plan.limite_usuarios,
                        porcentaje: plan.limite_usuarios === -1 ? 0 : (uso.usuarios / plan.limite_usuarios) * 100,
                        restante: plan.limite_usuarios === -1 ? -1 : plan.limite_usuarios - uso.usuarios
                    },
                    almacenamiento: {
                        actual: uso.almacenamiento_mb,
                        limite: plan.limite_almacenamiento_mb,
                        porcentaje: plan.limite_almacenamiento_mb === -1 ? 0 : (uso.almacenamiento_mb / plan.limite_almacenamiento_mb) * 100,
                        restante: plan.limite_almacenamiento_mb === -1 ? -1 : plan.limite_almacenamiento_mb - uso.almacenamiento_mb
                    }
                }
            };

        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            return null;
        }
    }
}

// Instancia global
window.sistemaLimitesPlan = new SistemaLimitesPlan();

console.log('✅ Sistema de Límites por Plan cargado');





