// ===== SISTEMA DE INSIGNIAS PARA REPORTES =====
// Insignias privadas para usuarios que contribuyen con reportes
// Solo visible para el usuario, no competitivo
// Co-fundadores: Carla & Claude

class SistemaInsigniasReportes {
    constructor() {
        this.insignias = this.cargarInsignias();
        this.init();
    }
    
    init() {
        console.log('🏅 Sistema de Insignias inicializado');
        this.verificarInsignias();
        this.mostrarPanelInsignias();
    }
    
    cargarInsignias() {
        const insigniasGuardadas = localStorage.getItem('cresalia_insignias_reportes');
        if (insigniasGuardadas) {
            return JSON.parse(insigniasGuardadas);
        }
        
        return {
            transporte: {
                totalReportes: 0,
                reportesVerificados: 0,
                reportesResueltos: 0,
                primeraAlerta: false,
                colaboradorActivo: false,
                verificadorExperto: false,
                reportesPorAnio: {}
            },
            servicios: {
                totalReportes: 0,
                reportesVerificados: 0,
                reportesResueltos: 0,
                primeraAlerta: false,
                colaboradorActivo: false,
                verificadorExperto: false,
                ayudasOfrecidas: 0,
                corazonSolidario: false,
                angelComunidad: false,
                reportesPorAnio: {}
            }
        };
    }
    
    guardarInsignias() {
        localStorage.setItem('cresalia_insignias_reportes', JSON.stringify(this.insignias));
    }
    
    // Registrar un reporte
    registrarReporte(tipo, alertaId) {
        const anioActual = new Date().getFullYear();
        
        if (tipo === 'transporte') {
            this.insignias.transporte.totalReportes++;
            
            // Contar por año
            if (!this.insignias.transporte.reportesPorAnio[anioActual]) {
                this.insignias.transporte.reportesPorAnio[anioActual] = 0;
            }
            this.insignias.transporte.reportesPorAnio[anioActual]++;
            
            // Insignia: Primera Alerta
            if (!this.insignias.transporte.primeraAlerta && this.insignias.transporte.totalReportes === 1) {
                this.insignias.transporte.primeraAlerta = true;
                this.mostrarNotificacionInsignia('🌟 ¡Primera Alerta de Transporte!', 'Has realizado tu primer reporte de transporte público.');
            }
            
            // Insignia: Colaborador Activo (5 reportes)
            if (!this.insignias.transporte.colaboradorActivo && this.insignias.transporte.totalReportes >= 5) {
                this.insignias.transporte.colaboradorActivo = true;
                this.mostrarNotificacionInsignia('💜 Colaborador Activo', 'Has realizado 5 reportes de transporte. ¡Gracias por ayudar a la comunidad!');
            }
        } else if (tipo === 'servicios') {
            this.insignias.servicios.totalReportes++;
            
            // Contar por año
            if (!this.insignias.servicios.reportesPorAnio[anioActual]) {
                this.insignias.servicios.reportesPorAnio[anioActual] = 0;
            }
            this.insignias.servicios.reportesPorAnio[anioActual]++;
            
            if (!this.insignias.servicios.primeraAlerta && this.insignias.servicios.totalReportes === 1) {
                this.insignias.servicios.primeraAlerta = true;
                this.mostrarNotificacionInsignia('🌟 ¡Primera Alerta de Servicios!', 'Has realizado tu primer reporte de servicios públicos.');
            }
            
            if (!this.insignias.servicios.colaboradorActivo && this.insignias.servicios.totalReportes >= 5) {
                this.insignias.servicios.colaboradorActivo = true;
                this.mostrarNotificacionInsignia('💜 Colaborador Activo', 'Has realizado 5 reportes de servicios. ¡Gracias por ayudar a la comunidad!');
            }
        }
        
        this.guardarInsignias();
    }
    
    // Registrar ayuda ofrecida a trabajadores
    registrarAyuda(tipo) {
        if (tipo === 'servicios') {
            this.insignias.servicios.ayudasOfrecidas++;
            
            // Insignia: Corazón Solidario (1 ayuda)
            if (!this.insignias.servicios.corazonSolidario && this.insignias.servicios.ayudasOfrecidas >= 1) {
                this.insignias.servicios.corazonSolidario = true;
                this.mostrarNotificacionInsignia('💜 Corazón Solidario', 'Has ofrecido ayuda a trabajadores. ¡Gracias por tu solidaridad!');
            }
            
            // Insignia: Ángel de la Comunidad (5 ayudas)
            if (!this.insignias.servicios.angelComunidad && this.insignias.servicios.ayudasOfrecidas >= 5) {
                this.insignias.servicios.angelComunidad = true;
                this.mostrarNotificacionInsignia('👼 Ángel de la Comunidad', 'Has ofrecido ayuda 5 veces. ¡Eres un ángel para la comunidad!');
            }
        }
        
        this.guardarInsignias();
    }
    
    // Registrar verificación
    registrarVerificacion(tipo) {
        if (tipo === 'transporte') {
            this.insignias.transporte.reportesVerificados++;
            
            if (!this.insignias.transporte.verificadorExperto && this.insignias.transporte.reportesVerificados >= 10) {
                this.insignias.transporte.verificadorExperto = true;
                this.mostrarNotificacionInsignia('✅ Verificador Experto', 'Has verificado 10 alertas. ¡Eres un experto verificador!');
            }
        } else if (tipo === 'servicios') {
            this.insignias.servicios.reportesVerificados++;
            
            if (!this.insignias.servicios.verificadorExperto && this.insignias.servicios.reportesVerificados >= 10) {
                this.insignias.servicios.verificadorExperto = true;
                this.mostrarNotificacionInsignia('✅ Verificador Experto', 'Has verificado 10 alertas. ¡Eres un experto verificador!');
            }
        }
        
        this.guardarInsignias();
    }
    
    // Registrar resolución
    registrarResolucion(tipo) {
        if (tipo === 'transporte') {
            this.insignias.transporte.reportesResueltos++;
        } else if (tipo === 'servicios') {
            this.insignias.servicios.reportesResueltos++;
        }
        
        this.guardarInsignias();
    }
    
    verificarInsignias() {
        // Verificar si hay reportes nuevos que no se han contado
        // Esto se hace automáticamente cuando se registran reportes
    }
    
    mostrarPanelInsignias() {
        // El panel se mostrará cuando el usuario lo solicite desde el historial
    }
    
    // Mostrar panel de insignias en el historial
    crearPanelInsignias() {
        const resumen = this.obtenerResumen();
        const anioActual = new Date().getFullYear();
        
        let html = `
            <div style="background: white; padding: 25px; border-radius: 15px; border: 2px solid #E5E7EB; margin-bottom: 20px;">
                <h3 style="color: #374151; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-trophy" style="color: #F59E0B;"></i> Tus Insignias y Contribuciones
                </h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <!-- Transporte -->
                    <div style="background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(59, 130, 246, 0.1)); padding: 20px; border-radius: 12px; border-left: 4px solid #2563EB;">
                        <h4 style="color: #1e40af; margin-bottom: 15px;">🚌 Transporte Público</h4>
                        <div style="margin-bottom: 15px;">
                            <p style="margin: 5px 0; color: #374151;"><strong>Total de reportes:</strong> ${resumen.transporte.total}</p>
                            <p style="margin: 5px 0; color: #374151;"><strong>Verificaciones:</strong> ${resumen.transporte.verificados}</p>
                            <p style="margin: 5px 0; color: #374151;"><strong>Resueltos:</strong> ${resumen.transporte.resueltos}</p>
                            <p style="margin: 5px 0; color: #2563EB; font-weight: 600;"><strong>Este año (${anioActual}):</strong> ${this.insignias.transporte.reportesPorAnio[anioActual] || 0}</p>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${resumen.transporte.insignias.primeraAlerta ? '<span style="background: #F59E0B; color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.85rem;">🌟 Primera Alerta</span>' : ''}
                            ${resumen.transporte.insignias.colaboradorActivo ? '<span style="background: #8B5CF6; color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.85rem;">💜 Colaborador Activo</span>' : ''}
                            ${resumen.transporte.insignias.verificadorExperto ? '<span style="background: #10B981; color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.85rem;">✅ Verificador Experto</span>' : ''}
                        </div>
                    </div>
                    
                    <!-- Servicios -->
                    <div style="background: linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(4, 120, 87, 0.1)); padding: 20px; border-radius: 12px; border-left: 4px solid #059669;">
                        <h4 style="color: #047857; margin-bottom: 15px;">⚡ Servicios Públicos</h4>
                        <div style="margin-bottom: 15px;">
                            <p style="margin: 5px 0; color: #374151;"><strong>Total de reportes:</strong> ${resumen.servicios.total}</p>
                            <p style="margin: 5px 0; color: #374151;"><strong>Verificaciones:</strong> ${resumen.servicios.verificados}</p>
                            <p style="margin: 5px 0; color: #374151;"><strong>Resueltos:</strong> ${resumen.servicios.resueltos}</p>
                            <p style="margin: 5px 0; color: #374151;"><strong>Ayudas ofrecidas:</strong> ${this.insignias.servicios.ayudasOfrecidas || 0}</p>
                            <p style="margin: 5px 0; color: #059669; font-weight: 600;"><strong>Este año (${anioActual}):</strong> ${this.insignias.servicios.reportesPorAnio[anioActual] || 0}</p>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${resumen.servicios.insignias.primeraAlerta ? '<span style="background: #F59E0B; color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.85rem;">🌟 Primera Alerta</span>' : ''}
                            ${resumen.servicios.insignias.colaboradorActivo ? '<span style="background: #8B5CF6; color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.85rem;">💜 Colaborador Activo</span>' : ''}
                            ${resumen.servicios.insignias.verificadorExperto ? '<span style="background: #10B981; color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.85rem;">✅ Verificador Experto</span>' : ''}
                            ${resumen.servicios.insignias.corazonSolidario ? '<span style="background: #EF4444; color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.85rem;">💜 Corazón Solidario</span>' : ''}
                            ${resumen.servicios.insignias.angelComunidad ? '<span style="background: #8B5CF6; color: white; padding: 5px 10px; border-radius: 20px; font-size: 0.85rem;">👼 Ángel de la Comunidad</span>' : ''}
                        </div>
                    </div>
                </div>
                
                <!-- Resumen anual -->
                <div style="background: #F9FAFB; padding: 20px; border-radius: 10px; margin-top: 20px;">
                    <h4 style="color: #374151; margin-bottom: 15px;">📊 Resumen Anual ${anioActual}</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                        <div>
                            <p style="margin: 0; color: #6B7280; font-size: 0.9rem;">Transporte</p>
                            <p style="margin: 5px 0 0 0; color: #2563EB; font-size: 1.5rem; font-weight: 700;">${this.insignias.transporte.reportesPorAnio[anioActual] || 0}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #6B7280; font-size: 0.9rem;">Servicios</p>
                            <p style="margin: 5px 0 0 0; color: #059669; font-size: 1.5rem; font-weight: 700;">${this.insignias.servicios.reportesPorAnio[anioActual] || 0}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #6B7280; font-size: 0.9rem;">Ayudas</p>
                            <p style="margin: 5px 0 0 0; color: #EF4444; font-size: 1.5rem; font-weight: 700;">${this.insignias.servicios.ayudasOfrecidas || 0}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #6B7280; font-size: 0.9rem;">Total</p>
                            <p style="margin: 5px 0 0 0; color: #374151; font-size: 1.5rem; font-weight: 700;">${(this.insignias.transporte.reportesPorAnio[anioActual] || 0) + (this.insignias.servicios.reportesPorAnio[anioActual] || 0)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return html;
    }
    
    obtenerResumen() {
        const transporte = this.insignias.transporte;
        const servicios = this.insignias.servicios;
        
        return {
            transporte: {
                total: transporte.totalReportes,
                verificados: transporte.reportesVerificados,
                resueltos: transporte.reportesResueltos,
                insignias: {
                    primeraAlerta: transporte.primeraAlerta,
                    colaboradorActivo: transporte.colaboradorActivo,
                    verificadorExperto: transporte.verificadorExperto
                }
            },
            servicios: {
                total: servicios.totalReportes,
                verificados: servicios.reportesVerificados,
                resueltos: servicios.reportesResueltos,
                ayudas: servicios.ayudasOfrecidas || 0,
                insignias: {
                    primeraAlerta: servicios.primeraAlerta,
                    colaboradorActivo: servicios.colaboradorActivo,
                    verificadorExperto: servicios.verificadorExperto,
                    corazonSolidario: servicios.corazonSolidario || false,
                    angelComunidad: servicios.angelComunidad || false
                }
            }
        };
    }
    
    mostrarNotificacionInsignia(titulo, mensaje) {
        // Mostrar notificación elegante de insignia obtenida
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(`🏅 ${titulo}\n${mensaje}`, 'success');
        } else {
            console.log(`🏅 ${titulo}: ${mensaje}`);
        }
    }
}

// Hacer disponible globalmente
window.SistemaInsigniasReportes = SistemaInsigniasReportes;

// Inicializar automáticamente
if (typeof window.sistemaInsignias === 'undefined') {
    window.sistemaInsignias = new SistemaInsigniasReportes();
}

