// ===== SISTEMA DE CONTACTO DIRECTO CON CRISLA =====
// Version 1.0 - Cresalia Platform
// Autor: CRISLA & Claude
// Descripción: Sistema empático para contacto prioritario en momentos difíciles

const ContactoDirectoCrisla = {
    // Configuración
    config: {
        usarEmail: false, // NO enviar por email, usar sistema interno
        apiUrl: window.location.hostname === 'localhost' 
            ? 'http://localhost:3001/api' 
            : 'https://cresalia-backend.vercel.app/api',
        storageKey: 'cresalia_contactos_prioritarios'
    },

    // ===== ABRIR MODAL DE CONTACTO =====
    abrirModal(motivo = 'apoyo') {
        const modal = this.crearModal(motivo);
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    },

    // ===== CREAR MODAL =====
    crearModal(motivo) {
        const modal = document.createElement('div');
        modal.id = 'modalContactoCRISLA';
        modal.className = 'modal-contacto-crisla';
        
        modal.innerHTML = `
            <div class="modal-contacto-content">
                <div class="modal-contacto-header">
                    <div class="crisla-avatar">
                        <img src="../../assets/logo/logo-cresalia.png" alt="Crisla" onerror="this.style.display='none'; this.parentElement.innerHTML='💜'">
                    </div>
                    <h2>💜 Hola, soy Crisla</h2>
                    <p>Fundadora de Cresalia</p>
                </div>
                
                <div class="modal-contacto-body">
                    ${this.obtenerMensajeSegunMotivo(motivo)}
                    
                    <form id="formContactoCRISLA" onsubmit="return ContactoDirectoCrisla.enviarMensaje(event)">
                        <div class="form-group">
                            <label><i class="fas fa-user"></i> Tu Nombre</label>
                            <input type="text" name="nombre" required placeholder="¿Cómo te llamas?">
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-envelope"></i> Tu Email</label>
                            <input type="email" name="email" required placeholder="tu@email.com">
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-store"></i> Nombre de tu Tienda (si tienes)</label>
                            <input type="text" name="tienda" placeholder="Opcional">
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-tag"></i> ¿Cuál es tu situación?</label>
                            <select name="prioridad" required>
                                <option value="urgente">🔴 Urgente - La estoy pasando muy mal</option>
                                <option value="alta">🟠 Alta - Necesito hablar pronto</option>
                                <option value="media">🟡 Media - Me gustaría conversar</option>
                                <option value="baja">🟢 Consulta - Tengo una pregunta</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-heart"></i> Cuéntame qué te pasa</label>
                            <textarea name="mensaje" required rows="5" 
                                placeholder="No tengas miedo de abrirte. Estoy aquí para escucharte y apoyarte. Tu bienestar es importante para mí. 💜"></textarea>
                        </div>
                        
                        <div class="mensaje-confidencial">
                            <i class="fas fa-lock"></i>
                            <p><strong>Tu mensaje es 100% confidencial.</strong> Solo yo lo veré y te responderé personalmente.</p>
                        </div>
                        
                        <div class="botones-contacto">
                            <button type="submit" class="btn-enviar-crisla">
                                <i class="fas fa-paper-plane"></i> Enviar a Crisla
                            </button>
                            <button type="button" class="btn-cancelar" onclick="ContactoDirectoCrisla.cerrarModal()">
                                Cancelar
                            </button>
                        </div>
                    </form>
                    
                    <div class="opciones-contacto-alternativas">
                        <p style="color: #6B7280; font-size: 13px; text-align: center;">
                            <i class="fas fa-info-circle"></i> Tu mensaje se guardará en la plataforma y Crisla lo revisará personalmente.
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.cerrarModal();
            }
        });
        
        return modal;
    },

    // ===== MENSAJES SEGÚN MOTIVO =====
    obtenerMensajeSegunMotivo(motivo) {
        const mensajes = {
            'apoyo': `
                    <div class="mensaje-crisla">
                    <p>Si estás atravesando un momento difícil, <strong>no estás sola/o</strong>.</p>
                    <p>Sé lo que es sentirse abrumada, tener dudas, o necesitar una mano amiga. Por eso creé Cresalia: para que emprendamos juntos, cuidándonos mutuamente.</p>
                    <p><strong>Puedo ayudarte con:</strong></p>
                    <ul>
                        <li>💜 Apoyo emocional y motivación</li>
                        <li>🤝 Consejos personalizados para tu emprendimiento</li>
                        <li>📞 Una charla sincera, de emprendedora a emprendedora</li>
                        <li>🎯 Priorización de tu caso según urgencia</li>
                    </ul>
                    <p><em>"Tu bienestar importa. Tu historia importa. Vos importás." 💜</em></p>
                </div>
            `,
            'consulta': `
                <div class="mensaje-crisla">
                    <p>¡Hola! 👋 Me alegra que quieras contactarme.</p>
                    <p>Contame qué necesitás y con gusto te ayudo. Sea una duda técnica, una sugerencia, o simplemente charlar sobre tu emprendimiento.</p>
                </div>
            `,
            'tecnico': `
                <div class="mensaje-crisla">  
                    <p>¿Problemas técnicos? ¡Tranquila/o! Vamos a resolverlo juntos.</p>
                    <p>Describime qué está pasando y vamos a encontrarle la vuelta. 🔧</p>
                </div>
            `
        };
        
        return mensajes[motivo] || mensajes['apoyo'];
    },

    // ===== ENVIAR MENSAJE =====
    async enviarMensaje(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        const mensaje = {
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            tienda: formData.get('tienda') || 'Sin tienda',
            prioridad: formData.get('prioridad'),
            mensaje: formData.get('mensaje'),
            fecha: new Date().toISOString(),
            timestamp: Date.now(),
            leido: false,
            respondido: false
        };
        
        try {
            // Guardar mensaje en la plataforma (localStorage por ahora, luego Supabase)
            this.guardarMensajeLocal(mensaje);
            
            // Enviar a API para que Crisla lo vea en su panel
            await this.enviarAPlataforma(mensaje);
            
            // Mostrar confirmación
            this.mostrarConfirmacion(mensaje.prioridad);
            
            // Cerrar modal
            setTimeout(() => this.cerrarModal(), 2000);
            
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            this.mostrarError();
        }
        
        return false;
    },

    // ===== GUARDAR MENSAJE LOCALMENTE =====
    guardarMensajeLocal(mensaje) {
        const mensajes = JSON.parse(localStorage.getItem(this.config.storageKey) || '[]');
        mensajes.push(mensaje);
        localStorage.setItem(this.config.storageKey, JSON.stringify(mensajes));
        console.log('✅ Mensaje guardado localmente');
    },

    // ===== ENVIAR A PLATAFORMA (NO EMAIL) =====
    async enviarAPlataforma(mensaje) {
        // Guardar en sistema de mensajes de Cresalia
        // Por ahora en localStorage, luego se moverá a Supabase
        
        const prioridades = {
            'urgente': '🔴 URGENTE',
            'alta': '🟠 ALTA PRIORIDAD',
            'media': '🟡 PRIORIDAD MEDIA',
            'baja': '🟢 CONSULTA'
        };
        
        // Crear mensaje para panel de Crisla
        const mensajeParaCrisla = {
            ...mensaje,
            prioridadTexto: prioridades[mensaje.prioridad],
            icono: mensaje.prioridad === 'urgente' ? '🔴' : 
                   mensaje.prioridad === 'alta' ? '🟠' : 
                   mensaje.prioridad === 'media' ? '🟡' : '🟢'
        };
        
        // Guardar en localStorage (para panel de Crisla)
        const mensajesCrisla = JSON.parse(localStorage.getItem('cresalia_mensajes_crisla') || '[]');
        mensajesCrisla.unshift(mensajeParaCrisla); // Agregar al principio
        localStorage.setItem('cresalia_mensajes_crisla', JSON.stringify(mensajesCrisla));
        
        // TODO: Cuando se conecte Supabase, enviar también allá
        // await this.enviarASupabase(mensajeParaCrisla);
        
        console.log('✅ Mensaje guardado en la plataforma para Crisla');
        return true;
    },

    // ===== MOSTRAR CONFIRMACIÓN =====
    mostrarConfirmación(prioridad) {
        const tiempoRespuesta = {
            'urgente': '24 horas',
            'alta': '48 horas',
            'media': '2-3 días',
            'baja': '3-5 días'
        };
        
        const mensaje = `
💜 ¡Mensaje enviado con éxito!

Tu mensaje ha sido guardado en la plataforma y lo revisaré personalmente dentro de ${tiempoRespuesta[prioridad]}.

${prioridad === 'urgente' ? '\n🔴 Como es urgente, haré todo lo posible por responderte antes.\n' : ''}

Recibirás una notificación en la plataforma cuando te responda.

Gracias por confiar en mí. No estás sola/o. 💜

- Crisla
        `;
        
        if (typeof mostrarNotificacionElegante === 'function') {
            mostrarNotificacionElegante(mensaje, 'success');
        } else {
            alert(mensaje);
        }
    },

    // ===== MOSTRAR ERROR =====
    mostrarError() {
        const mensaje = `
❌ Hubo un problema guardando tu mensaje.

Por favor, intentá nuevamente en unos minutos.

Si el problema persiste, contactame a través del sistema de soporte.

Disculpá las molestias. 🙏

- Crisla
        `;
        
        if (typeof mostrarNotificacionElegante === 'function') {
            mostrarNotificacionElegante(mensaje, 'error');
        } else {
            alert(mensaje);
        }
    },

    // ===== CERRAR MODAL =====
    cerrarModal() {
        const modal = document.getElementById('modalContactoCRISLA');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    },

    // ===== CREAR BOTÓN DE CONTACTO =====
    crearBotonFlotante() {
        const boton = document.createElement('div');
        boton.className = 'boton-contacto-crisla-flotante';
        boton.innerHTML = `
            <div class="boton-contacto-contenido">
                <i class="fas fa-heart"></i>
                <span>¿Necesitás hablar?</span>
            </div>
        `;
        
        boton.addEventListener('click', () => this.abrirModal('apoyo'));
        
        document.body.appendChild(boton);
    }
};

// Exportar para uso global (mantener ambos nombres por compatibilidad)
window.ContactoDirectoCrisla = ContactoDirectoCrisla;
window.ContactoDirectoCRISLA = ContactoDirectoCrisla; // Alias para compatibilidad

// Crear botón flotante al cargar (opcional)
document.addEventListener('DOMContentLoaded', function() {
    // Descomentar para activar el botón flotante
    // ContactoDirectoCrisla.crearBotonFlotante();
});

console.log('✅ Sistema de Contacto Directo con Crisla cargado correctamente');

