// ===== SISTEMA DE CHECK-IN DIARIO PARA COMUNIDADES - CRESALIA =====
// Para comunidades de Estrés y Desempleos
// Con amor y empatía 💜

class SistemaCheckInComunidades {
    constructor(comunidadSlug) {
        this.comunidadSlug = comunidadSlug;
        this.storageKey = `checkin_${comunidadSlug}`;
        this.diarioKey = `diario_emocional_${comunidadSlug}`;
        this.empleoKey = `seguimiento_empleo_${comunidadSlug}`;
        this.init();
    }
    
    init() {
        // Verificar si ya hizo check-in hoy
        const ultimoCheckIn = this.obtenerUltimoCheckIn();
        const hoy = new Date().toDateString();
        
        if (ultimoCheckIn && ultimoCheckIn.fecha === hoy) {
            // Ya hizo check-in hoy, mostrar resumen
            this.mostrarResumenDiario();
        } else {
            // Mostrar check-in diario
            setTimeout(() => {
                this.mostrarCheckInDiario();
            }, 2000); // Esperar 2 segundos después de cargar la página
        }
    }
    
    obtenerUltimoCheckIn() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }
    
    guardarCheckIn(datos) {
        const checkIn = {
            fecha: new Date().toDateString(),
            timestamp: Date.now(),
            estado: datos.estado,
            emocion: datos.emocion,
            notas: datos.notas || ''
        };
        
        // Guardar historial
        const historial = JSON.parse(localStorage.getItem(`${this.storageKey}_historial`) || '[]');
        historial.unshift(checkIn);
        // Mantener solo últimos 30 días
        if (historial.length > 30) {
            historial.pop();
        }
        localStorage.setItem(`${this.storageKey}_historial`, JSON.stringify(historial));
        
        // Guardar último check-in
        localStorage.setItem(this.storageKey, JSON.stringify(checkIn));
    }
    
    mostrarCheckInDiario() {
        // Crear modal de check-in
        const modal = document.createElement('div');
        modal.id = 'modalCheckInDiario';
        modal.className = 'modal-checkin';
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
            backdrop-filter: blur(5px);
        `;
        
        const titulo = this.comunidadSlug === 'desempleos' 
            ? '💼 ¿Cómo va tu búsqueda hoy?' 
            : '😰 ¿Cómo te sientes hoy?';
        
        const mensaje = this.comunidadSlug === 'desempleos'
            ? 'Sabemos que buscar trabajo puede ser agotador. Estamos aquí para acompañarte.'
            : 'El estrés es válido. Tu bienestar importa. Estamos aquí para ti.';
        
        modal.innerHTML = `
            <div class="checkin-content" style="
                background: white;
                border-radius: 24px;
                padding: 40px;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            ">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #374151; margin-bottom: 10px; font-size: 1.8rem;">${titulo}</h2>
                    <p style="color: #6B7280; font-size: 1rem;">${mensaje}</p>
                </div>
                
                ${this.comunidadSlug === 'desempleos' ? this.renderCheckInEmpleo() : this.renderCheckInEstres()}
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #E5E7EB;">
                    <button onclick="window.checkInSistema.cerrarCheckIn()" style="
                        width: 100%;
                        padding: 14px;
                        background: #6B7280;
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='#4B5563'" onmouseout="this.style.background='#6B7280'">
                        Guardar y Continuar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    renderCheckInEstres() {
        return `
            <div class="checkin-estres">
                <div style="margin-bottom: 25px;">
                    <label style="display: block; margin-bottom: 12px; font-weight: 600; color: #374151;">
                        ¿Cómo te sientes hoy?
                    </label>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px;">
                        <button class="emocion-btn" data-emocion="bien" onclick="window.checkInSistema.seleccionarEmocion('bien', this)" style="
                            padding: 20px;
                            border: 2px solid #E5E7EB;
                            border-radius: 12px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.3s;
                            font-size: 2rem;
                        ">
                            😊<br><small style="font-size: 0.85rem; color: #6B7280;">Bien</small>
                        </button>
                        <button class="emocion-btn" data-emocion="regular" onclick="window.checkInSistema.seleccionarEmocion('regular', this)" style="
                            padding: 20px;
                            border: 2px solid #E5E7EB;
                            border-radius: 12px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.3s;
                            font-size: 2rem;
                        ">
                            😐<br><small style="font-size: 0.85rem; color: #6B7280;">Regular</small>
                        </button>
                        <button class="emocion-btn" data-emocion="estresado" onclick="window.checkInSistema.seleccionarEmocion('estresado', this)" style="
                            padding: 20px;
                            border: 2px solid #E5E7EB;
                            border-radius: 12px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.3s;
                            font-size: 2rem;
                        ">
                            😰<br><small style="font-size: 0.85rem; color: #6B7280;">Estresado</small>
                        </button>
                        <button class="emocion-btn" data-emocion="abrumado" onclick="window.checkInSistema.seleccionarEmocion('abrumado', this)" style="
                            padding: 20px;
                            border: 2px solid #E5E7EB;
                            border-radius: 12px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.3s;
                            font-size: 2rem;
                        ">
                            😔<br><small style="font-size: 0.85rem; color: #6B7280;">Abrumado</small>
                        </button>
                    </div>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <label style="display: block; margin-bottom: 12px; font-weight: 600; color: #374151;">
                        ¿Quieres anotar algo en tu diario emocional? (Opcional)
                    </label>
                    <textarea id="checkinNotas" placeholder="Escribe lo que sientes, lo que te preocupa, o lo que te da esperanza..." style="
                        width: 100%;
                        padding: 14px;
                        border: 2px solid #E5E7EB;
                        border-radius: 12px;
                        font-size: 1rem;
                        font-family: inherit;
                        resize: vertical;
                        min-height: 120px;
                    "></textarea>
                </div>
                
                <div style="background: #F0F9FF; border: 2px solid #0EA5E9; border-radius: 12px; padding: 20px; margin-top: 20px;">
                    <p style="color: #0369A1; margin: 0; font-size: 0.95rem; line-height: 1.6;">
                        💜 <strong>Recuerda:</strong> Tu bienestar es importante. Si necesitas ayuda profesional, no dudes en buscarla. Estamos aquí para acompañarte, pero no reemplazamos el apoyo profesional.
                    </p>
                </div>
            </div>
        `;
    }
    
    renderCheckInEmpleo() {
        return `
            <div class="checkin-empleo">
                <div style="margin-bottom: 25px;">
                    <label style="display: block; margin-bottom: 12px; font-weight: 600; color: #374151;">
                        ¿Conseguiste trabajo hoy?
                    </label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button class="empleo-btn" data-resultado="si" onclick="window.checkInSistema.seleccionarResultadoEmpleo('si', this)" style="
                            padding: 20px;
                            border: 2px solid #10B981;
                            border-radius: 12px;
                            background: #DCFCE7;
                            color: #065F46;
                            cursor: pointer;
                            transition: all 0.3s;
                            font-size: 1.1rem;
                            font-weight: 600;
                        ">
                            ✅ Sí, ¡conseguí!
                        </button>
                        <button class="empleo-btn" data-resultado="no" onclick="window.checkInSistema.seleccionarResultadoEmpleo('no', this)" style="
                            padding: 20px;
                            border: 2px solid #F59E0B;
                            border-radius: 12px;
                            background: #FEF3C7;
                            color: #92400E;
                            cursor: pointer;
                            transition: all 0.3s;
                            font-size: 1.1rem;
                            font-weight: 600;
                        ">
                            ⏳ Aún no
                        </button>
                    </div>
                </div>
                
                <div id="mensajeResultadoEmpleo" style="display: none; margin-bottom: 25px; padding: 20px; border-radius: 12px;"></div>
                
                <div style="margin-bottom: 25px;">
                    <label style="display: block; margin-bottom: 12px; font-weight: 600; color: #374151;">
                        ¿Cómo te sientes hoy con tu búsqueda?
                    </label>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px;">
                        <button class="emocion-btn" data-emocion="motivado" onclick="window.checkInSistema.seleccionarEmocion('motivado', this)" style="
                            padding: 20px;
                            border: 2px solid #E5E7EB;
                            border-radius: 12px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.3s;
                            font-size: 2rem;
                        ">
                            🚀<br><small style="font-size: 0.85rem; color: #6B7280;">Motivado</small>
                        </button>
                        <button class="emocion-btn" data-emocion="regular" onclick="window.checkInSistema.seleccionarEmocion('regular', this)" style="
                            padding: 20px;
                            border: 2px solid #E5E7EB;
                            border-radius: 12px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.3s;
                            font-size: 2rem;
                        ">
                            😐<br><small style="font-size: 0.85rem; color: #6B7280;">Regular</small>
                        </button>
                        <button class="emocion-btn" data-emocion="cansado" onclick="window.checkInSistema.seleccionarEmocion('cansado', this)" style="
                            padding: 20px;
                            border: 2px solid #E5E7EB;
                            border-radius: 12px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.3s;
                            font-size: 2rem;
                        ">
                            😔<br><small style="font-size: 0.85rem; color: #6B7280;">Cansado</small>
                        </button>
                        <button class="emocion-btn" data-emocion="desanimado" onclick="window.checkInSistema.seleccionarEmocion('desanimado', this)" style="
                            padding: 20px;
                            border: 2px solid #E5E7EB;
                            border-radius: 12px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.3s;
                            font-size: 2rem;
                        ">
                            😞<br><small style="font-size: 0.85rem; color: #6B7280;">Desanimado</small>
                        </button>
                    </div>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <label style="display: block; margin-bottom: 12px; font-weight: 600; color: #374151;">
                        ¿Quieres anotar algo en tu diario emocional? (Opcional)
                    </label>
                    <textarea id="checkinNotas" placeholder="Escribe sobre tu búsqueda, cómo te sientes, tus logros del día, o lo que necesitas..." style="
                        width: 100%;
                        padding: 14px;
                        border: 2px solid #E5E7EB;
                        border-radius: 12px;
                        font-size: 1rem;
                        font-family: inherit;
                        resize: vertical;
                        min-height: 120px;
                    "></textarea>
                </div>
                
                <div style="background: #FEF3C7; border: 2px solid #F59E0B; border-radius: 12px; padding: 20px; margin-top: 20px;">
                    <p style="color: #92400E; margin: 0; font-size: 0.95rem; line-height: 1.6;">
                        💼 <strong>Entendemos tu situación:</strong> El desempleo es agotador física, mental y emocionalmente. Tu esfuerzo es válido, incluso cuando no ves resultados inmediatos. Cada día que sigues buscando es un logro. Estamos aquí para acompañarte.
                    </p>
                </div>
            </div>
        `;
    }
    
    seleccionarEmocion(emocion, boton) {
        // Remover selección anterior
        document.querySelectorAll('.emocion-btn').forEach(btn => {
            btn.style.border = '2px solid #E5E7EB';
            btn.style.background = 'white';
        });
        
        // Marcar seleccionado
        boton.style.border = '2px solid #8B5CF6';
        boton.style.background = '#F3F4F6';
        boton.dataset.seleccionado = 'true';
        
        this.emocionSeleccionada = emocion;
    }
    
    seleccionarResultadoEmpleo(resultado, boton) {
        // Remover selección anterior
        document.querySelectorAll('.empleo-btn').forEach(btn => {
            if (btn.dataset.resultado === 'si') {
                btn.style.border = '2px solid #10B981';
                btn.style.background = '#DCFCE7';
            } else {
                btn.style.border = '2px solid #F59E0B';
                btn.style.background = '#FEF3C7';
            }
        });
        
        // Marcar seleccionado
        if (resultado === 'si') {
            boton.style.border = '3px solid #10B981';
            boton.style.background = '#A7F3D0';
        } else {
            boton.style.border = '3px solid #F59E0B';
            boton.style.background = '#FDE68A';
        }
        
        this.resultadoEmpleo = resultado;
        
        // Mostrar mensaje apropiado
        const mensajeDiv = document.getElementById('mensajeResultadoEmpleo');
        if (mensajeDiv) {
            mensajeDiv.style.display = 'block';
            if (resultado === 'si') {
                mensajeDiv.style.background = '#DCFCE7';
                mensajeDiv.style.border = '2px solid #10B981';
                mensajeDiv.innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 10px;">🎉</div>
                        <h3 style="color: #065F46; margin: 0 0 10px 0;">¡FELICITACIONES! 🎊</h3>
                        <p style="color: #047857; margin: 0; line-height: 1.6;">
                            ¡Estamos tan felices por ti! Sabemos lo difícil que ha sido este proceso y lo mucho que te has esforzado. 
                            Mereces esta oportunidad. ¡Que tengas mucho éxito en tu nuevo trabajo! 💜
                        </p>
                    </div>
                `;
            } else {
                mensajeDiv.style.background = '#FEF3C7';
                mensajeDiv.style.border = '2px solid #F59E0B';
                mensajeDiv.innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 10px;">💪</div>
                        <h3 style="color: #92400E; margin: 0 0 10px 0;">Sigue adelante</h3>
                        <p style="color: #B45309; margin: 0; line-height: 1.6;">
                            Entendemos lo agotador que es buscar trabajo día tras día. Tu esfuerzo no es en vano. 
                            Cada aplicación, cada entrevista, cada "no" te acerca más al "sí" que mereces. 
                            No te rindas. Estamos aquí para acompañarte en este proceso. 💜
                        </p>
                    </div>
                `;
            }
        }
    }
    
    cerrarCheckIn() {
        if (!this.emocionSeleccionada) {
            alert('Por favor, selecciona cómo te sientes hoy.');
            return;
        }
        
        const notas = document.getElementById('checkinNotas')?.value || '';
        
        const datos = {
            estado: this.comunidadSlug === 'desempleos' ? (this.resultadoEmpleo || 'no') : 'checkin',
            emocion: this.emocionSeleccionada,
            notas: notas
        };
        
        if (this.comunidadSlug === 'desempleos' && this.resultadoEmpleo) {
            datos.resultadoEmpleo = this.resultadoEmpleo;
        }
        
        // Guardar check-in
        this.guardarCheckIn(datos);
        
        // Guardar en diario emocional si hay notas
        if (notas.trim()) {
            this.guardarDiarioEmocional(notas);
        }
        
        // Guardar seguimiento de empleo si aplica
        if (this.comunidadSlug === 'desempleos' && this.resultadoEmpleo) {
            this.guardarSeguimientoEmpleo(this.resultadoEmpleo);
        }
        
        // Cerrar modal
        const modal = document.getElementById('modalCheckInDiario');
        if (modal) {
            modal.remove();
        }
        
        // Mostrar mensaje de confirmación
        this.mostrarMensajeConfirmacion();
    }
    
    guardarDiarioEmocional(notas) {
        const entrada = {
            fecha: new Date().toISOString(),
            fechaTexto: new Date().toLocaleDateString('es-ES'),
            emocion: this.emocionSeleccionada,
            notas: notas,
            comunidad: this.comunidadSlug
        };
        
        const diario = JSON.parse(localStorage.getItem(this.diarioKey) || '[]');
        diario.unshift(entrada);
        
        // Mantener solo últimos 60 días
        if (diario.length > 60) {
            diario.pop();
        }
        
        localStorage.setItem(this.diarioKey, JSON.stringify(diario));
    }
    
    guardarSeguimientoEmpleo(resultado) {
        const seguimiento = {
            fecha: new Date().toISOString(),
            fechaTexto: new Date().toLocaleDateString('es-ES'),
            resultado: resultado,
            emocion: this.emocionSeleccionada
        };
        
        const historial = JSON.parse(localStorage.getItem(this.empleoKey) || '[]');
        historial.unshift(seguimiento);
        
        // Mantener solo últimos 90 días
        if (historial.length > 90) {
            historial.pop();
        }
        
        localStorage.setItem(this.empleoKey, JSON.stringify(historial));
    }
    
    mostrarMensajeConfirmacion() {
        const mensaje = document.createElement('div');
        mensaje.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10B981;
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            font-size: 1rem;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;
        mensaje.innerHTML = '✅ Check-in guardado. Gracias por compartir 💜';
        
        document.body.appendChild(mensaje);
        
        setTimeout(() => {
            mensaje.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => mensaje.remove(), 300);
        }, 3000);
    }
    
    mostrarResumenDiario() {
        const checkIn = this.obtenerUltimoCheckIn();
        if (!checkIn) return;
        
        // Mostrar banner discreto con resumen
        const banner = document.createElement('div');
        banner.id = 'bannerResumenCheckIn';
        banner.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 2px solid #8B5CF6;
            border-radius: 12px;
            padding: 15px 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            max-width: 300px;
            font-size: 0.9rem;
        `;
        
        const emocionEmoji = {
            'bien': '😊',
            'regular': '😐',
            'estresado': '😰',
            'abrumado': '😔',
            'motivado': '🚀',
            'cansado': '😔',
            'desanimado': '😞'
        };
        
        banner.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.5rem;">${emocionEmoji[checkIn.emocion] || '💜'}</span>
                <div>
                    <strong style="color: #374151;">Ya hiciste check-in hoy</strong>
                    <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 0.85rem;">${this.comunidadSlug === 'desempleos' && checkIn.estado === 'si' ? '🎉 ¡Felicidades!' : 'Gracias por compartir'}</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: #6B7280;
                    cursor: pointer;
                    font-size: 1.2rem;
                    padding: 0;
                    margin-left: auto;
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            if (banner.parentElement) {
                banner.style.opacity = '0';
                banner.style.transition = 'opacity 0.3s';
                setTimeout(() => banner.remove(), 300);
            }
        }, 5000);
    }
}

// Inicializar cuando se carga la página
if (typeof window !== 'undefined') {
    window.SistemaCheckInComunidades = SistemaCheckInComunidades;
}

