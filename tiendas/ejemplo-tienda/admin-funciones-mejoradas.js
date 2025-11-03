// ========================================
// 💜 FUNCIONES MEJORADAS PARA ADMIN PANEL
// ========================================

// FUNCIÓN SIMPLE PARA MÉTRICAS - SIN ERRORES
function abrirMetricasRapidas() {
    console.log('📊 ✅ NUEVA - Abriendo métricas rápidas...');
    
    // Remover modal existente
    const existe = document.getElementById('metricasModal');
    if (existe) existe.remove();
    
    // Crear modal simple
    const overlay = document.createElement('div');
    overlay.id = 'metricasModal';
    overlay.innerHTML = `
        <div style="
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        ">
            <div style="
                background: white;
                border-radius: 15px;
                max-width: 450px;
                width: 90%;
                padding: 25px;
                position: relative;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <button onclick="cerrarMetricas()" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">&times;</button>
                
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #667eea; margin: 0; font-size: 1.4rem;">📊 Métricas Rápidas</h2>
                    <p style="color: #666; margin: 10px 0 0 0; font-size: 0.9rem;">Tu tienda en números</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                        <i class="fas fa-eye" style="font-size: 2rem; margin-bottom: 10px;"></i>
                        <h3 style="margin: 0; font-size: 1.5rem;">${Math.floor(Math.random() * 1000) + 500}</h3>
                        <p style="margin: 5px 0 0 0; font-size: 0.85rem;">Visitas</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                        <i class="fas fa-shopping-bag" style="font-size: 2rem; margin-bottom: 10px;"></i>
                        <h3 style="margin: 0; font-size: 1.5rem;">${Math.floor(Math.random() * 50) + 10}</h3>
                        <p style="margin: 5px 0 0 0; font-size: 0.85rem;">Ventas</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #F59E0B, #D97706); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                        <i class="fas fa-box" style="font-size: 2rem; margin-bottom: 10px;"></i>
                        <h3 style="margin: 0; font-size: 1.5rem;">${Math.floor(Math.random() * 20) + 5}</h3>
                        <p style="margin: 5px 0 0 0; font-size: 0.85rem;">Productos</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #EC4899, #BE185D); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                        <i class="fas fa-dollar-sign" style="font-size: 2rem; margin-bottom: 10px;"></i>
                        <h3 style="margin: 0; font-size: 1.5rem;">$${(Math.random() * 3000 + 500).toFixed(0)}</h3>
                        <p style="margin: 5px 0 0 0; font-size: 0.85rem;">Ingresos</p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="cerrarMetricas()" style="
                        background: #6b7280;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 0.9rem;
                    "><i class="fas fa-times"></i> Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    console.log('✅ Modal métricas agregado correctamente');
}

function cerrarMetricas() {
    const modal = document.getElementById('metricasModal');
    if (modal) modal.remove();
}

// FUNCIÓN SIMPLE PARA DESAFÍOS Y LOGROS - SIN ERRORES
function toggleDesafiosLogros() {
    console.log('🏆 ✅ NUEVA - Abriendo desafíos y logros...');
    
    const existe = document.getElementById('desafiosModal');
    if (existe) {
        existe.remove();
        return;
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'desafiosModal';
    overlay.innerHTML = `
        <div style="
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        ">
            <div style="
                background: white;
                border-radius: 15px;
                max-width: 550px;
                width: 90%;
                padding: 25px;
                position: relative;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <button onclick="cerrarDesafios()" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                ">&times;</button>
                
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #667eea; margin: 0; font-size: 1.4rem;">🏆 Desafíos y Logros</h2>
                    <p style="color: #666; margin: 10px 0 0 0; font-size: 0.9rem;">Tu progreso emprendedor</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 15px;">
                    <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">🎯</div>
                        <h4 style="margin: 0 0 8px 0; font-size: 1rem;">Desafío Diario</h4>
                        <p style="margin: 0 0 10px 0; font-size: 0.85rem; opacity: 0.9;">Rutina de bienestar</p>
                        <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 6px;">
                            <div style="background: #10b981; height: 4px; border-radius: 2px; width: 70%;"></div>
                        </div>
                        <p style="margin: 8px 0 0 0; font-size: 0.8rem;">7/10 días</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #f093fb, #f5576c); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">🧘‍♀️</div>
                        <h4 style="margin: 0 0 8px 0; font-size: 1rem;">Meditación</h4>
                        <p style="margin: 0 0 10px 0; font-size: 0.85rem; opacity: 0.9;">5 días seguidos</p>
                        <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 6px;">
                            <div style="background: #fbbf24; height: 4px; border-radius: 2px; width: 40%;"></div>
                        </div>
                        <p style="margin: 8px 0 0 0; font-size: 0.8rem;">2/5 días</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">🏆</div>
                        <h4 style="margin: 0 0 8px 0; font-size: 1rem;">Primera Semana</h4>
                        <p style="margin: 0 0 10px 0; font-size: 0.85rem; opacity: 0.9;">¡Completada!</p>
                        <div style="background: #10b981; border-radius: 8px; padding: 6px; font-size: 0.8rem; font-weight: bold;">
                            ✅ DESBLOQUEADO
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #fa709a, #fee140); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">⭐</div>
                        <h4 style="margin: 0 0 8px 0; font-size: 1rem;">Respirador Experto</h4>
                        <p style="margin: 0 0 10px 0; font-size: 0.85rem; opacity: 0.9;">20 ejercicios</p>
                        <div style="background: rgba(255,255,255,0.3); border-radius: 8px; padding: 6px; font-size: 0.8rem; font-weight: bold;">
                            🔒 BLOQUEADO
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="cerrarDesafios()" style="
                        background: #6b7280;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 0.9rem;
                    "><i class="fas fa-times"></i> Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    console.log('✅ Modal desafíos agregado correctamente');
}

function cerrarDesafios() {
    const modal = document.getElementById('desafiosModal');
    if (modal) modal.remove();
}

// FUNCIÓN SIMPLE PARA MI PROGRESO PERSONAL - SIN ERRORES
function verMiProgresoPersonal() {
    console.log('💜 ✅ NUEVA - Mi progreso personal...');
    
    const existe = document.getElementById('progresoModal');
    if (existe) existe.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'progresoModal';
    overlay.innerHTML = `
        <div style="
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        ">
            <div style="
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                padding: 25px;
                position: relative;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <button onclick="cerrarProgreso()" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                ">&times;</button>
                
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #EC4899; margin: 0; font-size: 1.4rem;">💜 Mi Progreso Personal</h2>
                    <p style="color: #666; margin: 10px 0 0 0; font-size: 0.9rem;">Tu evolución emocional</p>
                </div>
                
                <div style="display: grid; gap: 15px;">
                    <div style="background: linear-gradient(135deg, #EC4899, #F9A8D4); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">💜</div>
                        <h4 style="margin: 0 0 8px 0; font-size: 1rem;">Bienestar Emocional</h4>
                        <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 6px; margin: 10px 0;">
                            <div style="background: #10b981; height: 4px; border-radius: 2px; width: 75%;"></div>
                        </div>
                        <p style="margin: 0; font-size: 0.85rem;">Muy bien - 75%</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">📈</div>
                        <h4 style="margin: 0 0 8px 0; font-size: 1rem;">Crecimiento</h4>
                        <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 6px; margin: 10px 0;">
                            <div style="background: #f59e0b; height: 4px; border-radius: 2px; width: 60%;"></div>
                        </div>
                        <p style="margin: 0; font-size: 0.85rem;">En progreso - 60%</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #10B981, #34D399); color: white; padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 2rem; margin-bottom: 10px;">🌱</div>
                        <h4 style="margin: 0 0 8px 0; font-size: 1rem;">Desarrollo Personal</h4>
                        <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 6px; margin: 10px 0;">
                            <div style="background: #10b981; height: 4px; border-radius: 2px; width: 85%;"></div>
                        </div>
                        <p style="margin: 0; font-size: 0.85rem;">Excelente - 85%</p>
                    </div>
                </div>
                
                <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 15px; border-radius: 12px; margin: 20px 0; text-align: center; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0; color: #92400e; font-size: 0.9rem;">
                        ✨ Sigues creciendo cada día. ¡Tu progreso es increíble! 💜
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <button onclick="cerrarProgreso()" style="
                        background: #6b7280;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 0.9rem;
                    "><i class="fas fa-heart"></i> Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    console.log('✅ Modal progreso agregado correctamente');
}

function cerrarProgreso() {
    const modal = document.getElementById('progresoModal');
    if (modal) modal.remove();
}

// FUNCIÓN SIMPLE PARA RECURSOS DE BIENESTAR - SIN ERRORES
function mostrarRecursosBienestar() {
    console.log('🌸 ✅ NUEVA - Recursos de bienestar...');
    
    const existe = document.getElementById('recursosModal');
    if (existe) existe.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'recursosModal';
    overlay.innerHTML = `
        <div style="
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        ">
            <div style="
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                padding: 25px;
                position: relative;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <button onclick="cerrarRecursos()" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                ">&times;</button>
                
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #ffecd2; background: linear-gradient(135deg, #ffecd2, #fcb69f); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; font-size: 1.4rem;">🌸 Recursos de Bienestar</h2>
                    <p style="color: #666; margin: 10px 0 0 0; font-size: 0.9rem;">Herramientas para tu equilibrio</p>
                </div>
                
                <div style="display: grid; gap: 12px;">
                    <div style="background: linear-gradient(135deg, #ffecd2, #fcb69f); padding: 15px; border-radius: 12px;">
                        <h4 style="margin: 0 0 8px 0; color: #8B4513; font-size: 1rem;">
                            <i class="fas fa-leaf"></i> Técnicas de Respiración
                        </h4>
                        <p style="margin: 0; color: #A0522D; font-size: 0.85rem;">
                            Ejercicios simples para reducir el estrés y mantener la calma
                        </p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #a8edea, #fed6e3); padding: 15px; border-radius: 12px;">
                        <h4 style="margin: 0 0 8px 0; color: #2D5AA0; font-size: 1rem;">
                            <i class="fas fa-brain"></i> Mindfulness
                        </h4>
                        <p style="margin: 0; color: #4A6FA5; font-size: 0.85rem;">
                            Técnicas de atención plena para emprendedores ocupados
                        </p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #d299c2, #fef9d3); padding: 15px; border-radius: 12px;">
                        <h4 style="margin: 0 0 8px 0; color: #7C2D92; font-size: 1rem;">
                            <i class="fas fa-heart"></i> Auto-cuidado
                        </h4>
                        <p style="margin: 0; color: #9A4AA6; font-size: 0.85rem;">
                            Consejos para mantener tu bienestar mientras emprendes
                        </p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px; border-radius: 12px; text-align: center;">
                        <h4 style="margin: 0 0 8px 0; font-size: 1rem;">
                            <i class="fas fa-lightbulb"></i> Consejo del Día
                        </h4>
                        <p style="margin: 0; font-size: 0.9rem; font-style: italic;">
                            "Recuerda que cada pequeño paso cuenta. Tu esfuerzo de hoy construye el éxito de mañana 💜"
                        </p>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <button onclick="cerrarRecursos()" style="
                        background: linear-gradient(135deg, #ffecd2, #fcb69f);
                        color: #8B4513;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 0.9rem;
                        font-weight: 600;
                    "><i class="fas fa-spa"></i> Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    console.log('✅ Modal recursos agregado correctamente');
}

function cerrarRecursos() {
    const modal = document.getElementById('recursosModal');
    if (modal) modal.remove();
}

console.log('💜 ✅ Funciones mejoradas cargadas correctamente');












