// ===== SISTEMA DE CHECK-IN BIENESTAR PARA COMUNIDADES =====
// Pregunta diariamente "¿Cómo te sientes hoy?" y ofrece diario emocional
// Excluye: experiencias-sobrenaturales, espiritualidad-fe
// Co-fundadores: Carla & Claude

class SistemaCheckinBienestarComunidades {
    constructor(comunidadSlug) {
        this.comunidadSlug = comunidadSlug;
        this.comunidadesExcluidas = ['experiencias-sobrenaturales', 'espiritualidad-fe'];
        this.init();
    }
    
    init() {
        // Verificar si esta comunidad debe tener check-in
        if (this.comunidadesExcluidas.includes(this.comunidadSlug)) {
            return; // No inicializar para comunidades excluidas
        }
        
        // Verificar si ya hizo check-in hoy
        const ultimoCheckin = localStorage.getItem(`checkin_${this.comunidadSlug}_fecha`);
        const hoy = new Date().toDateString();
        
        if (ultimoCheckin === hoy) {
            // Ya hizo check-in hoy, verificar si ocultó el foro
            this.aplicarEstadoForo();
            return;
        }
        
        // Esperar a que el DOM esté listo
        setTimeout(() => {
            this.mostrarCheckinModal();
        }, 1000);
    }
    
    mostrarCheckinModal() {
        // Verificar si ya existe el modal
        if (document.getElementById('checkin-bienestar-modal')) {
            return;
        }
        
        const modal = document.createElement('div');
        modal.id = 'checkin-bienestar-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 40px; max-width: 500px; width: 90%; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <button onclick="window.checkinBienestar.cerrarModal()" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s;" onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='none'">
                    &times;
                </button>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 60px; margin-bottom: 15px;">💜</div>
                    <h2 style="color: #374151; margin: 0 0 10px 0; font-size: 1.8rem;">¿Cómo te sentís hoy?</h2>
                    <p style="color: #6b7280; margin: 0; font-size: 1rem;">Nos importa tu bienestar. Tu respuesta nos ayuda a cuidarte mejor.</p>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 25px;">
                    <button onclick="window.checkinBienestar.seleccionarOpcion('bien')" style="background: linear-gradient(135deg, #10b981, #34d399); color: white; border: none; padding: 18px 24px; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(16,185,129,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <span>😊</span> Me siento bien
                    </button>
                    <button onclick="window.checkinBienestar.seleccionarOpcion('regular')" style="background: linear-gradient(135deg, #f59e0b, #fbbf24); color: white; border: none; padding: 18px 24px; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(245,158,11,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <span>😐</span> Regular
                    </button>
                    <button onclick="window.checkinBienestar.seleccionarOpcion('mal')" style="background: linear-gradient(135deg, #ef4444, #f87171); color: white; border: none; padding: 18px 24px; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(239,68,68,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <span>😔</span> Me siento mal
                    </button>
                </div>
                
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <button onclick="window.checkinBienestar.mostrarDiarioSimple()" style="background: linear-gradient(135deg, #8b5cf6, #a78bfa); color: white; border: none; padding: 14px 28px; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(139,92,246,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <i class="fas fa-book-heart"></i> Abrir Diario Emocional
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    seleccionarOpcion(estado) {
        // Guardar check-in
        localStorage.setItem(`checkin_${this.comunidadSlug}_fecha`, new Date().toDateString());
        localStorage.setItem(`checkin_${this.comunidadSlug}_estado`, estado);
        
        // Cerrar modal
        this.cerrarModal();
        
        // Mostrar opciones según el estado
        if (estado === 'bien' || estado === 'regular') {
            this.mostrarOpcionesBien();
        } else {
            this.mostrarOpcionesMal();
        }
    }
    
    mostrarOpcionesBien() {
        const modal = document.createElement('div');
        modal.id = 'checkin-opciones-bien';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 40px; max-width: 500px; width: 90%; text-align: center;">
                <div style="font-size: 60px; margin-bottom: 15px;">💜</div>
                <h3 style="color: #374151; margin-bottom: 20px;">Nos alegra saber que estás bien</h3>
                <p style="color: #6b7280; margin-bottom: 30px;">¿Qué te gustaría hacer ahora?</p>
                
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <button onclick="window.checkinBienestar.verPublicaciones()" style="background: linear-gradient(135deg, #8b5cf6, #a78bfa); color: white; border: none; padding: 16px 24px; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                        <i class="fas fa-comments"></i> Ver Publicaciones de la Comunidad
                    </button>
                    <button onclick="window.checkinBienestar.cerrarOpciones()" style="background: #6b7280; color: white; border: none; padding: 16px 24px; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                        Volver Otro Día
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    mostrarOpcionesMal() {
        const modal = document.createElement('div');
        modal.id = 'checkin-opciones-mal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 40px; max-width: 500px; width: 90%; text-align: center;">
                <div style="font-size: 60px; margin-bottom: 15px;">💜</div>
                <h3 style="color: #374151; margin-bottom: 20px;">Tu bienestar es importante para nosotros</h3>
                <p style="color: #6b7280; margin-bottom: 30px;">Entendemos que hoy puede ser un día difícil. Estamos aquí para apoyarte.</p>
                
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <button onclick="window.checkinBienestar.mostrarDiarioSimple()" style="background: linear-gradient(135deg, #8b5cf6, #a78bfa); color: white; border: none; padding: 16px 24px; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                        <i class="fas fa-book-heart"></i> Abrir Diario Emocional
                    </button>
                    <button onclick="window.checkinBienestar.volverOtroDia()" style="background: #6b7280; color: white; border: none; padding: 16px 24px; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                        Volver Otro Día
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    verPublicaciones() {
        this.cerrarOpciones();
        this.mostrarForo();
    }
    
    volverOtroDia() {
        this.ocultarForo();
        this.cerrarOpciones();
        this.mostrarMensaje('💜 Tu bienestar es nuestra prioridad. Volvé cuando te sientas listo/a. Estamos aquí para vos.', 'info');
    }
    
    mostrarDiarioSimple() {
        // Cerrar modales anteriores
        this.cerrarModal();
        this.cerrarOpciones();
        
        const modal = document.createElement('div');
        modal.id = 'diario-emocional-simple';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            overflow-y: auto;
        `;
        
        modal.innerHTML = `
            <div style="background: white; border-radius: 20px; padding: 40px; max-width: 700px; width: 90%; margin: 40px auto; position: relative;">
                <button onclick="window.checkinBienestar.cerrarDiarioSimple()" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: #6b7280; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">
                    &times;
                </button>
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 60px; margin-bottom: 15px;">📔</div>
                    <h2 style="color: #374151; margin: 0 0 10px 0;">Tu Diario Emocional</h2>
                    <p style="color: #6b7280; margin: 0;">Este es tu espacio seguro para expresar lo que sentís</p>
                </div>
                
                <form id="form-diario-simple" style="display: flex; flex-direction: column; gap: 20px;">
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">¿Cómo te sentís hoy?</label>
                        <textarea id="diario-sentimiento" rows="4" placeholder="Escribí libremente sobre cómo te sentís..." style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 1rem; resize: vertical; font-family: inherit;"></textarea>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">¿Qué pasó hoy? (opcional)</label>
                        <textarea id="diario-que-paso" rows="3" placeholder="Contanos qué pasó..." style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 1rem; resize: vertical; font-family: inherit;"></textarea>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">¿Qué necesitás? (opcional)</label>
                        <textarea id="diario-que-necesito" rows="2" placeholder="¿Qué necesitás para sentirte mejor?" style="width: 100%; padding: 12px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 1rem; resize: vertical; font-family: inherit;"></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 10px; margin-top: 10px;">
                        <button type="submit" style="flex: 1; background: linear-gradient(135deg, #8b5cf6, #a78bfa); color: white; border: none; padding: 14px 24px; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                        <button type="button" onclick="window.checkinBienestar.cerrarDiarioSimple()" style="background: #6b7280; color: white; border: none; padding: 14px 24px; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Manejar envío del formulario
        document.getElementById('form-diario-simple').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarDiarioSimple();
        });
    }
    
    guardarDiarioSimple() {
        const sentimiento = document.getElementById('diario-sentimiento').value.trim();
        const quePaso = document.getElementById('diario-que-paso').value.trim();
        const queNecesito = document.getElementById('diario-que-necesito').value.trim();
        
        if (!sentimiento) {
            alert('Por favor, escribí cómo te sentís.');
            return;
        }
        
        // Guardar en localStorage
        const entradas = JSON.parse(localStorage.getItem(`diario_${this.comunidadSlug}`) || '[]');
        const nuevaEntrada = {
            id: Date.now(),
            fecha: new Date().toISOString(),
            sentimiento: sentimiento,
            quePaso: quePaso,
            queNecesito: queNecesito,
            comunidad: this.comunidadSlug
        };
        
        entradas.push(nuevaEntrada);
        localStorage.setItem(`diario_${this.comunidadSlug}`, JSON.stringify(entradas));
        
        this.mostrarMensaje('✅ Entrada guardada. Tu bienestar es importante para nosotros.', 'success');
        this.cerrarDiarioSimple();
        
        // Preguntar si quiere ver publicaciones
        setTimeout(() => {
            if (confirm('¿Te gustaría ver las publicaciones de la comunidad ahora?')) {
                this.mostrarForo();
            } else {
                this.volverOtroDia();
            }
        }, 500);
    }
    
    cerrarDiarioSimple() {
        const modal = document.getElementById('diario-emocional-simple');
        if (modal) {
            modal.remove();
        }
    }
    
    cerrarModal() {
        const modal = document.getElementById('checkin-bienestar-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    cerrarOpciones() {
        const modalBien = document.getElementById('checkin-opciones-bien');
        const modalMal = document.getElementById('checkin-opciones-mal');
        if (modalBien) modalBien.remove();
        if (modalMal) modalMal.remove();
    }
    
    ocultarForo() {
        // Buscar contenedor del foro
        const foroContainer = document.querySelector('.foro-container') || 
                             document.getElementById('posts-container')?.closest('section') ||
                             document.getElementById('foro-container');
        
        if (foroContainer) {
            foroContainer.style.display = 'none';
            localStorage.setItem(`foro_oculto_${this.comunidadSlug}`, 'true');
        }
    }
    
    mostrarForo() {
        const foroContainer = document.querySelector('.foro-container') || 
                             document.getElementById('posts-container')?.closest('section') ||
                             document.getElementById('foro-container');
        
        if (foroContainer) {
            foroContainer.style.display = 'block';
            localStorage.removeItem(`foro_oculto_${this.comunidadSlug}`);
        }
    }
    
    aplicarEstadoForo() {
        const foroOculto = localStorage.getItem(`foro_oculto_${this.comunidadSlug}`);
        if (foroOculto === 'true') {
            this.ocultarForo();
        } else {
            this.mostrarForo();
        }
    }
    
    mostrarMensaje(texto, tipo) {
        const mensaje = document.createElement('div');
        mensaje.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${tipo === 'success' ? '#10b981' : tipo === 'error' ? '#ef4444' : '#8b5cf6'};
            color: white;
            padding: 16px 24px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10002;
            font-weight: 600;
            max-width: 400px;
        `;
        mensaje.textContent = texto;
        document.body.appendChild(mensaje);
        
        setTimeout(() => {
            mensaje.remove();
        }, 5000);
    }
}

// Auto-inicialización
(function() {
    // Extraer slug de la URL
    const path = window.location.pathname;
    const match = path.match(/comunidades\/([^\/]+)/);
    const comunidadSlug = match ? match[1] : null;
    
    if (comunidadSlug && !['experiencias-sobrenaturales', 'espiritualidad-fe'].includes(comunidadSlug)) {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.checkinBienestar = new SistemaCheckinBienestarComunidades(comunidadSlug);
            }, 500);
        });
    }
})();

// Hacer disponible globalmente
window.SistemaCheckinBienestarComunidades = SistemaCheckinBienestarComunidades;

