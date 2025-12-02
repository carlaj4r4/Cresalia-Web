/**
 * ═══════════════════════════════════════════════════════════════
 * 🧭 SISTEMA DE AYUDA PARA ELEGIR COMUNIDAD - CRESALIA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Ayuda a los usuarios a encontrar la comunidad adecuada
 * mediante un cuestionario simple y sugerencias personalizadas
 * 
 * Creado con amor por Claude & Carla para Cresalia
 * ═══════════════════════════════════════════════════════════════
 */

class AyudaElegirComunidad {
    constructor() {
        this.comunidades = {
            'desahogo-libre': {
                nombre: 'Desahogo Libre',
                descripcion: 'Un espacio sin etiquetas para expresar lo que sentís',
                url: '/comunidades/desahogo-libre/',
                icono: '💭',
                razones: ['No sé cómo categorizar mi dolor', 'Solo necesito desahogarme', 'No encajo en ninguna categoría']
            },
            'libertad-emocional': {
                nombre: 'Libertad Emocional',
                descripcion: 'Sanando rompimientos y dependencia emocional',
                url: '/comunidades/libertad-emocional/',
                icono: '💜',
                razones: ['Ruptura reciente', 'Dependencia emocional', 'Proceso de sanación']
            },
            'maternidad': {
                nombre: 'Maternidad',
                descripcion: 'Comunidad para embarazadas y futuras madres',
                url: '/comunidades/maternidad/',
                icono: '🤰',
                razones: ['Estoy embarazada', 'Quiero ser madre', 'Proceso de adopción']
            },
            'estres-laboral': {
                nombre: 'Estrés Laboral',
                descripcion: 'Comunidad de apoyo para estrés laboral',
                url: '/comunidades/estres-laboral/',
                icono: '💼',
                razones: ['Agotamiento laboral', 'Burnout', 'Estrés en el trabajo']
            },
            'mujeres-sobrevivientes': {
                nombre: 'Mujeres Sobrevivientes',
                descripcion: 'Refugio para mujeres sobrevivientes',
                url: '/comunidades/mujeres-sobrevivientes/',
                icono: '💪',
                razones: ['Sobreviviente de violencia', 'Necesito apoyo', 'Proceso de sanación']
            },
            'hombres-sobrevivientes': {
                nombre: 'Hombres Sobrevivientes',
                descripcion: 'Espacio seguro para hombres sobrevivientes',
                url: '/comunidades/hombres-sobrevivientes/',
                icono: '💪',
                razones: ['Sobreviviente de violencia', 'Necesito apoyo', 'Proceso de sanación']
            }
        };
    }

    /**
     * Mostrar modal de ayuda
     */
    mostrarAyuda() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3><i class="fas fa-compass"></i> ¿Qué comunidad te conviene?</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p style="margin-bottom: 24px; color: #64748B;">
                        Respondé estas preguntas simples para encontrar la comunidad que mejor se adapte a vos.
                        No es obligatorio, pero puede ayudarte a encontrar el espacio adecuado.
                    </p>
                    <form id="form-ayuda-comunidad">
                        <div class="form-group">
                            <label>¿Cómo te sentís hoy?</label>
                            <select id="pregunta-sentimiento" required>
                                <option value="">Seleccioná una opción</option>
                                <option value="dolor-sin-nombre">Tengo dolor pero no sé cómo nombrarlo</option>
                                <option value="ruptura">Estoy pasando por una ruptura</option>
                                <option value="dependencia">Siento dependencia emocional</option>
                                <option value="embarazo">Estoy embarazada o quiero ser madre</option>
                                <option value="estres-laboral">Tengo mucho estrés en el trabajo</option>
                                <option value="violencia">Soy sobreviviente de violencia</option>
                                <option value="no-se">No estoy segura/o</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>¿Qué necesitás más ahora?</label>
                            <select id="pregunta-necesidad" required>
                                <option value="">Seleccioná una opción</option>
                                <option value="desahogo">Solo desahogarme</option>
                                <option value="apoyo">Encontrar apoyo</option>
                                <option value="recursos">Recursos e información</option>
                                <option value="comunidad">Sentirme parte de una comunidad</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>¿Preferís contenido con advertencias o sin categorías?</label>
                            <select id="pregunta-contenido" required>
                                <option value="">Seleccioná una opción</option>
                                <option value="sin-categorias">Sin categorías, solo desahogo</option>
                                <option value="con-advertencias">Con advertencias de contenido sensible</option>
                                <option value="no-importa">No me importa</option>
                            </select>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">
                                Cancelar
                            </button>
                            <button type="submit" class="btn-primary">
                                <i class="fas fa-search"></i> Encontrar Comunidad
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('form-ayuda-comunidad').onsubmit = (e) => {
            e.preventDefault();
            this.sugerirComunidad();
        };
    }

    /**
     * Sugerir comunidad basada en respuestas
     */
    sugerirComunidad() {
        const sentimiento = document.getElementById('pregunta-sentimiento').value;
        const necesidad = document.getElementById('pregunta-necesidad').value;
        const contenido = document.getElementById('pregunta-contenido').value;

        let comunidadSugerida = null;
        let razon = '';

        // Lógica de sugerencias
        if (sentimiento === 'dolor-sin-nombre' || sentimiento === 'no-se' || contenido === 'sin-categorias') {
            comunidadSugerida = 'desahogo-libre';
            razon = 'Parece que necesitás un espacio sin etiquetas para expresar lo que sentís.';
        } else if (sentimiento === 'ruptura' || sentimiento === 'dependencia') {
            comunidadSugerida = 'libertad-emocional';
            razon = 'Esta comunidad está diseñada específicamente para rompimientos y dependencia emocional.';
        } else if (sentimiento === 'embarazo') {
            comunidadSugerida = 'maternidad';
            razon = 'Esta comunidad es para embarazadas y futuras madres.';
        } else if (sentimiento === 'estres-laboral') {
            comunidadSugerida = 'estres-laboral';
            razon = 'Esta comunidad está enfocada en el estrés y agotamiento laboral.';
        } else if (sentimiento === 'violencia') {
            // Preguntar género (simplificado, en producción sería más cuidadoso)
            const genero = confirm('¿Sos mujer? (OK = Sí, Cancelar = No)');
            comunidadSugerida = genero ? 'mujeres-sobrevivientes' : 'hombres-sobrevivientes';
            razon = 'Esta comunidad está diseñada para sobrevivientes de violencia.';
        } else {
            // Por defecto, sugerir Desahogo Libre
            comunidadSugerida = 'desahogo-libre';
            razon = 'Te sugerimos empezar con un espacio libre donde podés expresarte sin categorías.';
        }

        const comunidad = this.comunidades[comunidadSugerida];
        if (!comunidad) {
            this.mostrarNotificacion('⚠️ No se pudo encontrar una comunidad sugerida', 'warning');
            return;
        }

        // Mostrar resultado
        const modal = document.querySelector('.modal');
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3><i class="fas fa-check-circle"></i> Comunidad Sugerida</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; padding: 32px;">
                        <div style="font-size: 4rem; margin-bottom: 16px;">${comunidad.icono}</div>
                        <h2 style="color: #374151; margin-bottom: 12px;">${comunidad.nombre}</h2>
                        <p style="color: #64748B; margin-bottom: 24px; font-size: 1.1rem;">
                            ${comunidad.descripcion}
                        </p>
                        <p style="color: #6B7280; margin-bottom: 32px; font-style: italic;">
                            ${razon}
                        </p>
                        <div style="display: flex; gap: 12px; justify-content: center;">
                            <button class="btn-secondary" onclick="this.closest('.modal').remove()">
                                Ver Otras Comunidades
                            </button>
                            <button class="btn-primary" onclick="window.location.href='${comunidad.url}'">
                                <i class="fas fa-arrow-right"></i> Ir a ${comunidad.nombre}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Mostrar notificación
     */
    mostrarNotificacion(mensaje, tipo = 'info') {
        const colores = {
            'success': '#10B981',
            'error': '#EF4444',
            'info': '#3B82F6',
            'warning': '#F59E0B'
        };

        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colores[tipo]};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 350px;
        `;
        notif.textContent = mensaje;
        document.body.appendChild(notif);

        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 4000);
    }
}

// Inicializar cuando el DOM esté listo
let ayudaElegirComunidad;
document.addEventListener('DOMContentLoaded', () => {
    ayudaElegirComunidad = new AyudaElegirComunidad();
    
    // Agregar botón de ayuda si existe un elemento con id "ayuda-comunidad"
    const botonAyuda = document.getElementById('ayuda-comunidad');
    if (botonAyuda) {
        botonAyuda.addEventListener('click', () => {
            ayudaElegirComunidad.mostrarAyuda();
        });
    }
});



