/**
 * 🎨 SISTEMA DE PERSONALIZACIÓN DE TIENDA - CRESALIA
 * Permite personalizar: diseño, colores, logo, imágenes, FAQ, medios de pago, ubicación
 */

console.log('🎨 Inicializando Sistema de Personalización de Tienda...');

class PersonalizacionTienda {
    constructor() {
        this.config = this.cargarConfiguracion();
        this.planActual = localStorage.getItem('plan-actual') || 'free';
        this.limitesFAQ = {
            'free': 5,
            'basic': 10,
            'pro': 999,
            'enterprise': 999
        };
    }
    
    cargarConfiguracion() {
        const config = localStorage.getItem('tienda_personalizacion');
        if (config) {
            try {
                return JSON.parse(config);
            } catch (error) {
                console.warn('Error cargando configuración:', error);
            }
        }
        
        // Configuración por defecto
        return {
            colores: {
                primario: '#667EEA',
                secundario: '#764BA2',
                acento: '#EC4899'
            },
            logo: null,
            imagenBanner: null,
            videoPresentacion: null,
            faqs: [],
            mediosPago: [],
            ubicacion: {
                direccion: '',
                ciudad: '',
                provincia: '',
                codigoPostal: '',
                pais: 'Argentina'
            }
        };
    }
    
    guardarConfiguracion() {
        localStorage.setItem('tienda_personalizacion', JSON.stringify(this.config));
        console.log('✅ Configuración de personalización guardada');
    }
}

// ==================== MODAL DE PERSONALIZACIÓN DE DISEÑO ====================

window.abrirPersonalizacionDiseno = function() {
    console.log('🎨 Abriendo personalización de diseño...');
    
    const pers = window.personalizacionTienda || new PersonalizacionTienda();
    
    const modal = document.createElement('div');
    modal.id = 'modalPersonalizacionDiseno';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 999999;';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 24px; max-width: 800px; width: 95%; max-height: 90vh; overflow-y: auto;">
            <div style="background: linear-gradient(135deg, #F093FB, #F5576C); color: white; padding: 32px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 16px;">🎨</div>
                <h2 style="margin: 0;">Personalización de Diseño</h2>
                <p style="margin: 8px 0 0; opacity: 0.95;">Personaliza los colores y logo de tu tienda</p>
            </div>
            
            <div style="padding: 32px;">
                <form id="formDiseno" onsubmit="guardarPersonalizacionDiseno(event); return false;">
                    
                    <!-- Colores -->
                    <h3 style="margin: 0 0 20px 0; color: #374151;"><i class="fas fa-palette"></i> Colores de la Tienda</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Color Primario</label>
                            <input type="color" id="colorPrimario" value="${pers.config.colores.primario}" style="width: 100%; height: 50px; border: 2px solid #E5E7EB; border-radius: 12px; cursor: pointer;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Color Secundario</label>
                            <input type="color" id="colorSecundario" value="${pers.config.colores.secundario}" style="width: 100%; height: 50px; border: 2px solid #E5E7EB; border-radius: 12px; cursor: pointer;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Color de Acento</label>
                            <input type="color" id="colorAccent" value="${pers.config.colores.acento}" style="width: 100%; height: 50px; border: 2px solid #E5E7EB; border-radius: 12px; cursor: pointer;">
                        </div>
                    </div>
                    
                    <!-- Logo -->
                    <h3 style="margin: 0 0 20px 0; color: #374151;"><i class="fas fa-image"></i> Logo de la Tienda</h3>
                    <div style="margin-bottom: 32px;">
                        <input type="file" id="inputLogo" accept="image/*" onchange="previsualizarLogo(this)" style="width: 100%; padding: 14px; border: 2px solid #E5E7EB; border-radius: 12px;">
                        <div id="previewLogo" style="margin-top: 16px; text-align: center; display: ${pers.config.logo ? 'block' : 'none'};">
                            <img id="imgPreviewLogo" src="${pers.config.logo || ''}" style="max-width: 200px; max-height: 100px; border-radius: 12px; border: 2px solid #E5E7EB;">
                        </div>
                    </div>
                    
                    <!-- Botones -->
                    <div style="display: flex; gap: 12px; padding-top: 20px; border-top: 2px solid #E5E7EB;">
                        <button type="button" onclick="document.getElementById('modalPersonalizacionDiseno').remove()" style="flex: 1; background: #F3F4F6; color: #374151; border: none; padding: 16px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                            Cancelar
                        </button>
                        <button type="submit" style="flex: 2; background: linear-gradient(135deg, #F093FB, #F5576C); color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);">
                            <i class="fas fa-save"></i> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

window.previsualizarLogo = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imgPreviewLogo').src = e.target.result;
            document.getElementById('previewLogo').style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
};

window.guardarPersonalizacionDiseno = function(event) {
    event.preventDefault();
    
    const pers = window.personalizacionTienda || new PersonalizacionTienda();
    
    pers.config.colores = {
        primario: document.getElementById('colorPrimario').value,
        secundario: document.getElementById('colorSecundario').value,
        acento: document.getElementById('colorAccent').value
    };
    
    const logoInput = document.getElementById('inputLogo');
    if (logoInput.files && logoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            pers.config.logo = e.target.result;
            pers.guardarConfiguracion();
            aplicarDiseno(pers.config);
        };
        reader.readAsDataURL(logoInput.files[0]);
    } else {
        pers.guardarConfiguracion();
        aplicarDiseno(pers.config);
    }
    
    document.getElementById('modalPersonalizacionDiseno').remove();
    
    if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('✅ Diseño personalizado guardado', 'success');
    }
};

function aplicarDiseno(config) {
    const root = document.documentElement;
    root.style.setProperty('--color-primario', config.colores.primario);
    root.style.setProperty('--color-secundario', config.colores.secundario);
    root.style.setProperty('--color-acento', config.colores.acento);
    
    console.log('✅ Colores aplicados:', config.colores);
}

// ==================== MODAL DE IMÁGENES Y VIDEOS ====================

window.abrirImagenesVideos = function() {
    console.log('📸 Abriendo configuración de imágenes y videos...');
    
    const pers = window.personalizacionTienda || new PersonalizacionTienda();
    
    const modal = document.createElement('div');
    modal.id = 'modalImagenesVideos';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 999999;';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 24px; max-width: 800px; width: 95%; max-height: 90vh; overflow-y: auto;">
            <div style="background: linear-gradient(135deg, #43E97B, #38F9D7); color: white; padding: 32px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 16px;">📸</div>
                <h2 style="margin: 0;">Imágenes y Videos</h2>
                <p style="margin: 8px 0 0; opacity: 0.95;">Agrega contenido visual a tu tienda</p>
            </div>
            
            <div style="padding: 32px;">
                <form id="formImagenes" onsubmit="guardarImagenesVideos(event); return false;">
                    
                    <!-- Banner Principal -->
                    <div style="margin-bottom: 32px;">
                        <h3 style="margin: 0 0 12px 0; color: #374151;"><i class="fas fa-image"></i> Banner Principal</h3>
                        <input type="file" id="inputBanner" accept="image/*" style="width: 100%; padding: 14px; border: 2px solid #E5E7EB; border-radius: 12px;">
                        <small style="display: block; margin-top: 8px; color: #6B7280;">Recomendado: 1920x600px</small>
                    </div>
                    
                    <!-- Video de Presentación -->
                    <div style="margin-bottom: 32px;">
                        <h3 style="margin: 0 0 12px 0; color: #374151;"><i class="fas fa-video"></i> Video de Presentación</h3>
                        <input type="url" id="inputVideoURL" placeholder="https://www.youtube.com/watch?v=..." style="width: 100%; padding: 14px; border: 2px solid #E5E7EB; border-radius: 12px;">
                        <small style="display: block; margin-top: 8px; color: #6B7280;">Pegá la URL de YouTube o Vimeo</small>
                    </div>
                    
                    <!-- Botones -->
                    <div style="display: flex; gap: 12px; padding-top: 20px; border-top: 2px solid #E5E7EB;">
                        <button type="button" onclick="document.getElementById('modalImagenesVideos').remove()" style="flex: 1; background: #F3F4F6; color: #374151; border: none; padding: 16px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                            Cancelar
                        </button>
                        <button type="submit" style="flex: 2; background: linear-gradient(135deg, #43E97B, #38F9D7); color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(67, 233, 123, 0.3);">
                            <i class="fas fa-save"></i> Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

window.guardarImagenesVideos = function(event) {
    event.preventDefault();
    
    const pers = window.personalizacionTienda || new PersonalizacionTienda();
    
    const bannerInput = document.getElementById('inputBanner');
    const videoURL = document.getElementById('inputVideoURL').value;
    
    if (bannerInput.files && bannerInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            pers.config.imagenBanner = e.target.result;
            pers.config.videoPresentacion = videoURL;
            pers.guardarConfiguracion();
            
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('✅ Imágenes y videos guardados', 'success');
            }
        };
        reader.readAsDataURL(bannerInput.files[0]);
    } else {
        pers.config.videoPresentacion = videoURL;
        pers.guardarConfiguracion();
        
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('✅ Video guardado', 'success');
        }
    }
    
    document.getElementById('modalImagenesVideos').remove();
};

// ==================== MODAL DE FAQ ====================

window.abrirConfiguracionFAQ = function() {
    console.log('❓ Abriendo configuración de FAQ...');
    
    const pers = window.personalizacionTienda || new PersonalizacionTienda();
    const limite = pers.limitesFAQ[pers.planActual.toLowerCase()];
    const faqs = pers.config.faqs || [];
    
    const modal = document.createElement('div');
    modal.id = 'modalFAQ';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 999999;';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 24px; max-width: 900px; width: 95%; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column;">
            <div style="background: linear-gradient(135deg, #4FACFE, #00F2FE); color: white; padding: 32px; text-align: center; flex-shrink: 0;">
                <div style="font-size: 64px; margin-bottom: 16px;">❓</div>
                <h2 style="margin: 0;">Preguntas Frecuentes (FAQ)</h2>
                <p style="margin: 8px 0 0; opacity: 0.95;">Tu plan: ${pers.planActual.toUpperCase()} - Límite: ${limite === 999 ? 'Ilimitado' : limite + ' FAQs'}</p>
            </div>
            
            <div style="padding: 32px; overflow-y: auto; flex: 1;">
                <div id="listaFAQs" style="margin-bottom: 24px;">
                    ${faqs.length === 0 ? '<p style="text-align: center; color: #6B7280;">No hay FAQs agregadas aún</p>' : ''}
                    ${faqs.map((faq, index) => `
                        <div style="background: #F9FAFB; padding: 20px; border-radius: 12px; margin-bottom: 16px; border-left: 4px solid #4FACFE;">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div style="flex: 1;">
                                    <strong style="color: #374151; display: block; margin-bottom: 8px;">❓ ${faq.pregunta}</strong>
                                    <p style="margin: 0; color: #6B7280;">✅ ${faq.respuesta}</p>
                                </div>
                                <button onclick="eliminarFAQ(${index})" style="background: #EF4444; color: white; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer; margin-left: 12px;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                ${faqs.length < limite ? `
                    <div style="background: #F0F9FF; padding: 24px; border-radius: 12px; border: 2px dashed #3B82F6;">
                        <h4 style="margin: 0 0 16px 0; color: #374151;"><i class="fas fa-plus"></i> Agregar Nueva FAQ</h4>
                        <div style="margin-bottom: 16px;">
                            <input type="text" id="nuevaPregunta" placeholder="¿Pregunta?" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;" maxlength="200">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <textarea id="nuevaRespuesta" placeholder="Respuesta..." rows="3" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px; resize: vertical;" maxlength="500"></textarea>
                        </div>
                        <button type="button" onclick="agregarFAQ()" style="background: #3B82F6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            <i class="fas fa-plus"></i> Agregar FAQ
                        </button>
                        <small style="display: block; margin-top: 12px; color: #6B7280;">
                            Has usado ${faqs.length} de ${limite === 999 ? '∞' : limite} FAQs disponibles
                        </small>
                    </div>
                ` : `
                    <div style="background: #FEF2F2; padding: 24px; border-radius: 12px; border-left: 4px solid #EF4444; text-align: center;">
                        <p style="margin: 0; color: #991B1B; font-weight: 600;">
                            <i class="fas fa-exclamation-triangle"></i> Has alcanzado el límite de ${limite} FAQs para tu plan ${pers.planActual.toUpperCase()}
                        </p>
                        <small style="display: block; margin-top: 8px; color: #7F1D1D;">
                            💡 Upgrade a plan PRO para FAQs ilimitadas
                        </small>
                    </div>
                `}
                
                <div style="display: flex; gap: 12px; margin-top: 24px;">
                    <button onclick="document.getElementById('modalFAQ').remove()" style="flex: 1; background: #6B7280; color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                        <i class="fas fa-times"></i> Cerrar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

window.agregarFAQ = function() {
    const pers = window.personalizacionTienda || new PersonalizacionTienda();
    const limite = pers.limitesFAQ[pers.planActual.toLowerCase()];
    
    if (pers.config.faqs.length >= limite) {
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(`❌ Límite de ${limite} FAQs alcanzado para plan ${pers.planActual}`, 'error');
        }
        return;
    }
    
    const pregunta = document.getElementById('nuevaPregunta').value.trim();
    const respuesta = document.getElementById('nuevaRespuesta').value.trim();
    
    if (!pregunta || !respuesta) {
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('❌ Completa pregunta y respuesta', 'error');
        }
        return;
    }
    
    pers.config.faqs.push({ pregunta, respuesta });
    pers.guardarConfiguracion();
    
    if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('✅ FAQ agregada', 'success');
    }
    
    // Reabrir modal para actualizar
    document.getElementById('modalFAQ').remove();
    setTimeout(() => abrirConfiguracionFAQ(), 100);
};

window.eliminarFAQ = function(index) {
    if (confirm('¿Eliminar esta FAQ?')) {
        const pers = window.personalizacionTienda || new PersonalizacionTienda();
        pers.config.faqs.splice(index, 1);
        pers.guardarConfiguracion();
        
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('✅ FAQ eliminada', 'success');
        }
        
        // Reabrir modal
        document.getElementById('modalFAQ').remove();
        setTimeout(() => abrirConfiguracionFAQ(), 100);
    }
};

// ==================== MODAL DE MEDIOS DE PAGO ====================

window.abrirMediosPago = function() {
    console.log('💳 Abriendo configuración de medios de pago...');
    
    const pers = window.personalizacionTienda || new PersonalizacionTienda();
    const mediosPago = pers.config.mediosPago || [];
    
    const modal = document.createElement('div');
    modal.id = 'modalMediosPago';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 999999;';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 24px; max-width: 700px; width: 95%; max-height: 90vh; overflow-y: auto;">
            <div style="background: linear-gradient(135deg, #F59E0B, #FCD34D); color: white; padding: 32px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 16px;">💳</div>
                <h2 style="margin: 0;">Medios de Pago</h2>
                <p style="margin: 8px 0 0; opacity: 0.95;">Configura cómo aceptas pagos</p>
            </div>
            
            <div style="padding: 32px;">
                <form id="formMediosPago" onsubmit="guardarMediosPago(event); return false;">
                    
                    <div style="display: grid; gap: 16px; margin-bottom: 24px;">
                        ${[
                            {id: 'efectivo', nombre: 'Efectivo', icono: '💵'},
                            {id: 'transferencia', nombre: 'Transferencia Bancaria', icono: '🏦'},
                            {id: 'mercadopago', nombre: 'Mercado Pago', icono: '💙'},
                            {id: 'tarjeta', nombre: 'Tarjetas de Crédito/Débito', icono: '💳'},
                            {id: 'paypal', nombre: 'PayPal', icono: '🅿️'},
                            {id: 'cripto', nombre: 'Criptomonedas', icono: '₿'}
                        ].map(medio => `
                            <label style="display: flex; align-items: center; gap: 12px; padding: 16px; background: ${mediosPago.includes(medio.id) ? '#F0FDF4' : '#F9FAFB'}; border: 2px solid ${mediosPago.includes(medio.id) ? '#10B981' : '#E5E7EB'}; border-radius: 12px; cursor: pointer; transition: all 0.3s;">
                                <input type="checkbox" name="mediosPago" value="${medio.id}" ${mediosPago.includes(medio.id) ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;">
                                <span style="font-size: 32px;">${medio.icono}</span>
                                <span style="font-weight: 600; color: #374151; flex: 1;">${medio.nombre}</span>
                            </label>
                        `).join('')}
                    </div>
                    
                    <div style="display: flex; gap: 12px; padding-top: 20px; border-top: 2px solid #E5E7EB;">
                        <button type="button" onclick="document.getElementById('modalMediosPago').remove()" style="flex: 1; background: #F3F4F6; color: #374151; border: none; padding: 16px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                            Cancelar
                        </button>
                        <button type="submit" style="flex: 2; background: linear-gradient(135deg, #F59E0B, #FCD34D); color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

window.guardarMediosPago = function(event) {
    event.preventDefault();
    
    const pers = window.personalizacionTienda || new PersonalizacionTienda();
    const checkboxes = document.querySelectorAll('input[name="mediosPago"]:checked');
    
    pers.config.mediosPago = Array.from(checkboxes).map(cb => cb.value);
    pers.guardarConfiguracion();
    
    if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion(`✅ ${pers.config.mediosPago.length} medios de pago configurados`, 'success');
    }
    
    document.getElementById('modalMediosPago').remove();
};

// ==================== MODAL DE UBICACIÓN ====================

window.abrirConfiguracionUbicacion = function() {
    console.log('📍 Abriendo configuración de ubicación...');
    
    const pers = window.personalizacionTienda || new PersonalizacionTienda();
    const ubi = pers.config.ubicacion || {};
    
    const modal = document.createElement('div');
    modal.id = 'modalUbicacion';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 999999;';
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 24px; max-width: 700px; width: 95%; max-height: 90vh; overflow-y: auto;">
            <div style="background: linear-gradient(135deg, #10B981, #34D399); color: white; padding: 32px; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 16px;">📍</div>
                <h2 style="margin: 0;">Ubicación de tu Tienda</h2>
                <p style="margin: 8px 0 0; opacity: 0.95;">Configura tu dirección y datos de contacto</p>
            </div>
            
            <div style="padding: 32px;">
                <form id="formUbicacion" onsubmit="guardarUbicacion(event); return false;">
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Dirección</label>
                        <input type="text" id="inputDireccion" value="${ubi.direccion || ''}" placeholder="Ej: Av. Corrientes 1234" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Ciudad</label>
                            <input type="text" id="inputCiudad" value="${ubi.ciudad || ''}" placeholder="Ej: Buenos Aires" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Provincia</label>
                            <input type="text" id="inputProvincia" value="${ubi.provincia || ''}" placeholder="Ej: CABA" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">Código Postal</label>
                            <input type="text" id="inputCP" value="${ubi.codigoPostal || ''}" placeholder="Ej: C1001" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #374151;">País</label>
                            <input type="text" id="inputPais" value="${ubi.pais || 'Argentina'}" placeholder="País" style="width: 100%; padding: 12px; border: 2px solid #E5E7EB; border-radius: 8px;">
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 12px; padding-top: 20px; border-top: 2px solid #E5E7EB;">
                        <button type="button" onclick="document.getElementById('modalUbicacion').remove()" style="flex: 1; background: #F3F4F6; color: #374151; border: none; padding: 16px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                            Cancelar
                        </button>
                        <button type="submit" style="flex: 2; background: linear-gradient(135deg, #10B981, #34D399); color: white; border: none; padding: 16px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                            <i class="fas fa-save"></i> Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
};

window.guardarUbicacion = function(event) {
    event.preventDefault();
    
    const pers = window.personalizacionTienda || new PersonalizacionTienda();
    
    pers.config.ubicacion = {
        direccion: document.getElementById('inputDireccion').value,
        ciudad: document.getElementById('inputCiudad').value,
        provincia: document.getElementById('inputProvincia').value,
        codigoPostal: document.getElementById('inputCP').value,
        pais: document.getElementById('inputPais').value
    };
    
    pers.guardarConfiguracion();
    
    if (typeof mostrarNotificacion === 'function') {
        mostrarNotificacion('✅ Ubicación guardada', 'success');
    }
    
    document.getElementById('modalUbicacion').remove();
};

// ==================== INICIALIZACIÓN ====================

window.personalizacionTienda = new PersonalizacionTienda();

// Aplicar diseño guardado al cargar
if (window.personalizacionTienda.config.colores) {
    aplicarDiseno(window.personalizacionTienda.config);
}

console.log('✅ Sistema de Personalización cargado');
console.log('🎨 Funciones disponibles:');
console.log('  - abrirPersonalizacionDiseno()');
console.log('  - abrirImagenesVideos()');
console.log('  - abrirConfiguracionFAQ()');
console.log('  - abrirMediosPago()');
console.log('  - abrirConfiguracionUbicacion()');















