// ===== SISTEMA CRESALIA ANIMALES =====
// Sistema de ayuda para animales - Donaciones directas, sin medios de pago
// Co-fundadores: Carla & Claude

class SistemaCresaliaAnimales {
    constructor() {
        this.supabase = null;
        this.usuarioHash = null;
        this.init();
    }
    
    async init() {
        // Inicializar Supabase
        if (typeof window.supabase !== 'undefined' && window.SUPABASE_CONFIG) {
            try {
                const config = window.SUPABASE_CONFIG;
                if (config.url && config.anonKey && !config.anonKey.includes('REEMPLAZA')) {
                    this.supabase = window.supabase.createClient(config.url, config.anonKey);
                    console.log('✅ Cresalia Animales: Supabase inicializado');
                }
            } catch (error) {
                console.error('❌ Error inicializando Supabase:', error);
            }
        }
        
        // Generar hash de usuario
        this.usuarioHash = this.generarHashUsuario();
        
        // Cargar contenido inicial
        this.cargarAnimalesNecesitanAyuda();
        this.cargarNecesidadesRefugios();
        this.cargarOrganizaciones();
    }
    
    generarHashUsuario() {
        let hash = localStorage.getItem('cresalia_animales_hash');
        if (!hash) {
            const random = Math.random().toString(36).substring(2) + Date.now().toString(36);
            hash = btoa(random).substring(0, 32);
            localStorage.setItem('cresalia_animales_hash', hash);
        }
        return hash;
    }
    
    // ===== PUBLICAR ANIMAL QUE NECESITA AYUDA =====
    async publicarAnimalQueNecesitaAyuda(datos) {
        if (!this.supabase) {
            this.mostrarError('No hay conexión con Supabase');
            return;
        }
        
        try {
            const { data, error } = await this.supabase
                .from('animales_necesitan_ayuda')
                .insert([{
                    tipo_animal: datos.tipo_animal,
                    nombre: datos.nombre || null,
                    edad: datos.edad || null,
                    situacion: datos.situacion,
                    descripcion: datos.descripcion,
                    ubicacion_ciudad: datos.ciudad || null,
                    ubicacion_provincia: datos.provincia || null,
                    ubicacion_zona: datos.zona || null,
                    urgencia: datos.urgencia || 'media',
                    tipo_ayuda_necesaria: datos.tipo_ayuda,
                    fotos: datos.fotos || [],
                    publicado_por: this.usuarioHash,
                    contacto_publicador: datos.contacto || null,
                    estado: 'activa'
                }])
                .select();
            
            if (error) throw error;
            
            this.mostrarExito('✅ Animal publicado correctamente. La ayuda llegará pronto.');
            this.cargarAnimalesNecesitanAyuda();
            return data[0];
        } catch (error) {
            console.error('Error publicando animal:', error);
            this.mostrarError('Error al publicar: ' + error.message);
            throw error;
        }
    }
    
    // ===== PUBLICAR NECESIDAD DE REFUGIO =====
    async publicarNecesidadRefugio(organizacionId, datos) {
        if (!this.supabase) {
            this.mostrarError('No hay conexión con Supabase');
            return;
        }
        
        try {
            const { data, error } = await this.supabase
                .from('necesidades_refugios_animales')
                .insert([{
                    organizacion_id: organizacionId,
                    tipo_necesidad: datos.tipo_necesidad,
                    descripcion_especifica: datos.descripcion,
                    cantidad_necesaria: datos.cantidad || null,
                    urgencia: datos.urgencia || 'media',
                    como_ayudar: datos.como_ayudar,
                    estado: 'activa'
                }])
                .select();
            
            if (error) throw error;
            
            this.mostrarExito('✅ Necesidad publicada correctamente');
            this.cargarNecesidadesRefugios();
            return data[0];
        } catch (error) {
            console.error('Error publicando necesidad:', error);
            this.mostrarError('Error al publicar: ' + error.message);
            throw error;
        }
    }
    
    // ===== OFRECER AYUDA =====
    async ofrecerAyuda(tipoAyuda, datos) {
        if (!this.supabase) {
            this.mostrarError('No hay conexión con Supabase');
            return;
        }
        
        try {
            const ayudaData = {
                donante_hash: this.usuarioHash,
                donante_nombre: datos.nombre || null,
                tipo_ayuda: tipoAyuda,
                descripcion: datos.descripcion,
                cantidad: datos.cantidad || null,
                contacto_donante: datos.contacto || null,
                fecha_ofrecida: new Date().toISOString()
            };
            
            if (datos.necesidad_id) {
                ayudaData.necesidad_id = datos.necesidad_id;
            }
            
            if (datos.animal_id) {
                ayudaData.animal_id = datos.animal_id;
            }
            
            if (datos.organizacion_id) {
                ayudaData.organizacion_id = datos.organizacion_id;
            }
            
            const { data, error } = await this.supabase
                .from('ayudas_animales_recibidas')
                .insert([ayudaData])
                .select();
            
            if (error) throw error;
            
            this.mostrarExito('✅ Ayuda ofrecida. La organización se pondrá en contacto contigo.');
            return data[0];
        } catch (error) {
            console.error('Error ofreciendo ayuda:', error);
            this.mostrarError('Error al ofrecer ayuda: ' + error.message);
            throw error;
        }
    }
    
    // ===== CARGAR ANIMALES QUE NECESITAN AYUDA =====
    async cargarAnimalesNecesitanAyuda() {
        if (!this.supabase) return;
        
        try {
            const { data, error } = await this.supabase
                .from('animales_necesitan_ayuda')
                .select('*')
                .eq('estado', 'activa')
                .order('created_at', { ascending: false })
                .limit(20);
            
            if (error) throw error;
            
            this.renderizarAnimalesNecesitanAyuda(data || []);
        } catch (error) {
            console.error('Error cargando animales:', error);
        }
    }
    
    // ===== CARGAR NECESIDADES DE REFUGIOS =====
    async cargarNecesidadesRefugios() {
        if (!this.supabase) return;
        
        try {
            const { data, error } = await this.supabase
                .from('necesidades_refugios_animales')
                .select(`
                    *,
                    organizaciones_animales (
                        nombre_organizacion,
                        tipo,
                        ubicacion_ciudad,
                        contacto_telefono,
                        contacto_email
                    )
                `)
                .eq('estado', 'activa')
                .order('created_at', { ascending: false })
                .limit(20);
            
            if (error) throw error;
            
            this.renderizarNecesidadesRefugios(data || []);
        } catch (error) {
            console.error('Error cargando necesidades:', error);
        }
    }
    
    // ===== CARGAR ORGANIZACIONES =====
    async cargarOrganizaciones() {
        if (!this.supabase) return;
        
        try {
            const { data, error } = await this.supabase
                .from('organizaciones_animales')
                .select('*')
                .eq('activa', true)
                .order('nombre_organizacion', { ascending: true });
            
            if (error) throw error;
            
            this.renderizarOrganizaciones(data || []);
        } catch (error) {
            console.error('Error cargando organizaciones:', error);
        }
    }
    
    // ===== RENDERIZAR ANIMALES =====
    renderizarAnimalesNecesitanAyuda(animales) {
        const container = document.getElementById('animales-necesitan-ayuda');
        if (!container) return;
        
        if (animales.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6B7280;">
                    <i class="fas fa-paw" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>No hay animales que necesiten ayuda en este momento</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = animales.map(animal => `
            <div class="animal-card" data-id="${animal.id}">
                <div class="animal-header">
                    <h3>${animal.nombre ? `${animal.nombre} - ` : ''}${this.formatearTipoAnimal(animal.tipo_animal)}</h3>
                    <span class="badge-urgencia badge-${animal.urgencia}">${animal.urgencia.toUpperCase()}</span>
                </div>
                <div class="animal-info">
                    <p><strong>Situación:</strong> ${this.formatearSituacion(animal.situacion)}</p>
                    <p><strong>Necesita:</strong> ${this.formatearTipoAyuda(animal.tipo_ayuda_necesaria)}</p>
                    ${animal.ubicacion_ciudad ? `<p><strong>Ubicación:</strong> ${animal.ubicacion_ciudad}${animal.ubicacion_provincia ? ', ' + animal.ubicacion_provincia : ''}</p>` : ''}
                    ${animal.edad ? `<p><strong>Edad:</strong> ${animal.edad}</p>` : ''}
                </div>
                <div class="animal-descripcion">
                    <p>${this.escapeHtml(animal.descripcion)}</p>
                </div>
                ${animal.fotos && animal.fotos.length > 0 ? `
                    <div class="animal-fotos">
                        ${animal.fotos.map(foto => `<img src="${foto}" alt="Animal" style="max-width: 200px; border-radius: 8px; margin: 5px;">`).join('')}
                    </div>
                ` : ''}
                <div class="animal-acciones">
                    <button class="btn-ayudar" onclick="sistemaAnimales.mostrarModalAyudar(${animal.id}, 'animal')">
                        <i class="fas fa-heart"></i> Quiero Ayudar
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // ===== RENDERIZAR NECESIDADES DE REFUGIOS =====
    renderizarNecesidadesRefugios(necesidades) {
        const container = document.getElementById('necesidades-refugios');
        if (!container) return;
        
        if (necesidades.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6B7280;">
                    <i class="fas fa-home" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>No hay necesidades publicadas en este momento</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = necesidades.map(nec => {
            const org = nec.organizaciones_animales;
            return `
                <div class="necesidad-card" data-id="${nec.id}">
                    <div class="necesidad-header">
                        <h3>${org?.nombre_organizacion || 'Refugio'}</h3>
                        <span class="badge-urgencia badge-${nec.urgencia}">${nec.urgencia.toUpperCase()}</span>
                    </div>
                    <div class="necesidad-info">
                        <p><strong>Necesita:</strong> ${this.formatearTipoNecesidad(nec.tipo_necesidad)}</p>
                        ${nec.cantidad_necesaria ? `<p><strong>Cantidad:</strong> ${nec.cantidad_necesaria}</p>` : ''}
                        ${org?.ubicacion_ciudad ? `<p><strong>Ubicación:</strong> ${org.ubicacion_ciudad}${org.ubicacion_provincia ? ', ' + org.ubicacion_provincia : ''}</p>` : ''}
                    </div>
                    <div class="necesidad-descripcion">
                        <p>${this.escapeHtml(nec.descripcion_especifica)}</p>
                    </div>
                    <div class="necesidad-como-ayudar">
                        <p><strong>¿Cómo ayudar?</strong></p>
                        <p>${this.escapeHtml(nec.como_ayudar)}</p>
                    </div>
                    ${org?.contacto_telefono || org?.contacto_email ? `
                        <div class="necesidad-contacto">
                            ${org.contacto_telefono ? `<p><i class="fas fa-phone"></i> ${org.contacto_telefono}</p>` : ''}
                            ${org.contacto_email ? `<p><i class="fas fa-envelope"></i> ${org.contacto_email}</p>` : ''}
                        </div>
                    ` : ''}
                    <div class="necesidad-acciones">
                        <button class="btn-ayudar" onclick="sistemaAnimales.mostrarModalAyudar(${nec.id}, 'necesidad', ${org?.id || 'null'})">
                            <i class="fas fa-heart"></i> Quiero Ayudar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // ===== RENDERIZAR ORGANIZACIONES =====
    renderizarOrganizaciones(organizaciones) {
        const container = document.getElementById('organizaciones-lista');
        if (!container) return;
        
        if (organizaciones.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #6B7280;">
                    <p>No hay organizaciones registradas aún</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = organizaciones.map(org => `
            <div class="organizacion-card" data-id="${org.id}">
                <h3>${this.escapeHtml(org.nombre_organizacion)}</h3>
                <p class="organizacion-tipo">${this.formatearTipoOrganizacion(org.tipo)}</p>
                ${org.descripcion ? `<p class="organizacion-descripcion">${this.escapeHtml(org.descripcion)}</p>` : ''}
                ${org.ubicacion_ciudad ? `<p><i class="fas fa-map-marker-alt"></i> ${org.ubicacion_ciudad}${org.ubicacion_provincia ? ', ' + org.ubicacion_provincia : ''}</p>` : ''}
                ${org.verificado ? `<span class="badge-verificado"><i class="fas fa-check-circle"></i> Verificado</span>` : ''}
                ${org.cobra_comisiones ? `<p class="organizacion-transparencia"><strong>Transparencia:</strong> ${this.escapeHtml(org.transparencia_comisiones || 'Cobra comisiones (verificar con la organización)')}</p>` : ''}
                ${org.contacto_telefono || org.contacto_email ? `
                    <div class="organizacion-contacto">
                        ${org.contacto_telefono ? `<p><i class="fas fa-phone"></i> ${org.contacto_telefono}</p>` : ''}
                        ${org.contacto_email ? `<p><i class="fas fa-envelope"></i> ${org.contacto_email}</p>` : ''}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }
    
    // ===== MODAL PARA AYUDAR =====
    mostrarModalAyudar(id, tipo, organizacionId = null) {
        const modal = document.createElement('div');
        modal.className = 'modal-ayudar-animal';
        modal.id = 'modal-ayudar-animal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-heart"></i> Quiero Ayudar</h3>
                    <button class="cerrar-modal" onclick="this.closest('.modal-ayudar-animal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="form-ayudar-animal">
                        <input type="hidden" id="ayuda-tipo" value="${tipo}">
                        <input type="hidden" id="ayuda-id" value="${id}">
                        ${organizacionId ? `<input type="hidden" id="ayuda-organizacion-id" value="${organizacionId}">` : ''}
                        
                        <div class="form-group">
                            <label>Tu nombre (opcional, puedes ser anónimo)</label>
                            <input type="text" id="ayuda-nombre" placeholder="Nombre o permanecer anónimo">
                        </div>
                        
                        <div class="form-group">
                            <label>Tipo de ayuda que puedes ofrecer *</label>
                            <select id="ayuda-tipo-ayuda" required>
                                <option value="">Selecciona...</option>
                                <option value="alimentos">Alimentos</option>
                                <option value="medicamentos">Medicamentos</option>
                                <option value="productos">Productos (mantas, juguetes, etc.)</option>
                                <option value="dinero">Dinero (contacto directo con la organización)</option>
                                <option value="casa_temporal">Casa Temporal</option>
                                <option value="adopcion">Adopción</option>
                                <option value="servicios">Servicios (veterinario, transporte, etc.)</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Descripción de tu ayuda *</label>
                            <textarea id="ayuda-descripcion" required placeholder="Describe qué puedes ofrecer..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Cantidad (opcional)</label>
                            <input type="text" id="ayuda-cantidad" placeholder="Ej: 10kg de balanceado, $5000, etc.">
                        </div>
                        
                        <div class="form-group">
                            <label>Contacto (opcional - para que la organización pueda contactarte)</label>
                            <input type="text" id="ayuda-contacto" placeholder="Teléfono, email, o WhatsApp">
                        </div>
                        
                        <div class="form-group">
                            <p style="font-size: 0.9rem; color: #6B7280; margin-top: 10px;">
                                <i class="fas fa-info-circle"></i> La ayuda será contactada directamente con la organización o persona que necesita ayuda. Sin intermediarios, sin comisiones.
                            </p>
                        </div>
                        
                        <div class="form-acciones">
                            <button type="submit" class="btn-ayudar">
                                <i class="fas fa-heart"></i> Ofrecer Ayuda
                            </button>
                            <button type="button" class="btn-cancelar" onclick="this.closest('.modal-ayudar-animal').remove()">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listener para el formulario
        document.getElementById('form-ayudar-animal').addEventListener('submit', async (e) => {
            e.preventDefault();
            const tipoAyuda = document.getElementById('ayuda-tipo-ayuda').value;
            const datos = {
                nombre: document.getElementById('ayuda-nombre').value || null,
                descripcion: document.getElementById('ayuda-descripcion').value,
                cantidad: document.getElementById('ayuda-cantidad').value || null,
                contacto: document.getElementById('ayuda-contacto').value || null
            };
            
            if (tipo === 'animal') {
                datos.animal_id = id;
            } else if (tipo === 'necesidad') {
                datos.necesidad_id = id;
                if (organizacionId) {
                    datos.organizacion_id = organizacionId;
                }
            }
            
            try {
                await this.ofrecerAyuda(tipoAyuda, datos);
                modal.remove();
            } catch (error) {
                // Error ya manejado en ofrecerAyuda
            }
        });
    }
    
    // ===== FORMATEAR TEXTOS =====
    formatearTipoAnimal(tipo) {
        const tipos = {
            'perro': '🐕 Perro',
            'gato': '🐱 Gato',
            'otro': '🐾 Otro'
        };
        return tipos[tipo] || tipo;
    }
    
    formatearSituacion(situacion) {
        const situaciones = {
            'herido': '🤕 Herido',
            'enfermo': '🏥 Enfermo',
            'callejero': '🐾 Callejero',
            'en_refugio': '🏠 En Refugio',
            'para_adopcion': '💜 Busca Adopción',
            'casa_temporal': '🏡 Necesita Casa Temporal',
            'perdido': '🔍 Perdido',
            'encontrado': '✅ Encontrado'
        };
        return situaciones[situacion] || situacion;
    }
    
    formatearTipoAyuda(tipo) {
        const tipos = {
            'veterinario': '🏥 Atención Veterinaria',
            'rescate': '🚨 Rescate',
            'transporte': '🚗 Transporte',
            'alimentos': '🍖 Alimentos',
            'medicamentos': '💊 Medicamentos',
            'casa_temporal': '🏡 Casa Temporal',
            'adopcion': '💜 Adopción'
        };
        return tipos[tipo] || tipo;
    }
    
    formatearTipoNecesidad(tipo) {
        const tipos = {
            'alimentos': '🍖 Alimentos',
            'medicamentos': '💊 Medicamentos',
            'materiales': '🧸 Materiales',
            'veterinario': '🏥 Servicios Veterinarios',
            'voluntarios': '🤝 Voluntarios',
            'otro': '📋 Otro'
        };
        return tipos[tipo] || tipo;
    }
    
    formatearTipoOrganizacion(tipo) {
        const tipos = {
            'refugio': '🏠 Refugio',
            'rescatista_independiente': '🤝 Rescatista Independiente',
            'fundacion': '💜 Fundación',
            'otro': '📋 Otro'
        };
        return tipos[tipo] || tipo;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    mostrarExito(mensaje) {
        // Implementar notificación de éxito
        alert(mensaje); // Temporal, mejorar después
    }
    
    mostrarError(mensaje) {
        // Implementar notificación de error
        alert(mensaje); // Temporal, mejorar después
    }
    
    // ===== MODAL PARA PUBLICAR ANIMAL =====
    mostrarModalPublicarAnimal() {
        const modal = document.createElement('div');
        modal.className = 'modal-ayudar-animal';
        modal.id = 'modal-publicar-animal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-paw"></i> Publicar Animal que Necesita Ayuda</h3>
                    <button class="cerrar-modal" onclick="this.closest('.modal-ayudar-animal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="form-publicar-animal">
                        <div class="form-group">
                            <label>Tipo de Animal *</label>
                            <select id="animal-tipo" required>
                                <option value="">Selecciona...</option>
                                <option value="perro">🐕 Perro</option>
                                <option value="gato">🐱 Gato</option>
                                <option value="otro">🐾 Otro</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Nombre (opcional)</label>
                            <input type="text" id="animal-nombre" placeholder="Nombre del animal">
                        </div>
                        
                        <div class="form-group">
                            <label>Edad (opcional)</label>
                            <input type="text" id="animal-edad" placeholder="Ej: Cachorro, Adulto, 2 años">
                        </div>
                        
                        <div class="form-group">
                            <label>Situación *</label>
                            <select id="animal-situacion" required>
                                <option value="">Selecciona...</option>
                                <option value="herido">🤕 Herido</option>
                                <option value="enfermo">🏥 Enfermo</option>
                                <option value="callejero">🐾 Callejero</option>
                                <option value="para_adopcion">💜 Busca Adopción</option>
                                <option value="casa_temporal">🏡 Necesita Casa Temporal</option>
                                <option value="perdido">🔍 Perdido</option>
                                <option value="encontrado">✅ Encontrado</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>¿Qué tipo de ayuda necesita? *</label>
                            <select id="animal-tipo-ayuda" required>
                                <option value="">Selecciona...</option>
                                <option value="veterinario">🏥 Atención Veterinaria</option>
                                <option value="rescate">🚨 Rescate</option>
                                <option value="transporte">🚗 Transporte</option>
                                <option value="alimentos">🍖 Alimentos</option>
                                <option value="medicamentos">💊 Medicamentos</option>
                                <option value="casa_temporal">🏡 Casa Temporal</option>
                                <option value="adopcion">💜 Adopción</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Descripción *</label>
                            <textarea id="animal-descripcion" required placeholder="Describe la situación del animal, qué necesita, etc."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Ciudad</label>
                            <input type="text" id="animal-ciudad" placeholder="Ciudad">
                        </div>
                        
                        <div class="form-group">
                            <label>Provincia</label>
                            <input type="text" id="animal-provincia" placeholder="Provincia">
                        </div>
                        
                        <div class="form-group">
                            <label>Zona aproximada (no dirección exacta, por seguridad)</label>
                            <input type="text" id="animal-zona" placeholder="Zona aproximada">
                        </div>
                        
                        <div class="form-group">
                            <label>Urgencia *</label>
                            <select id="animal-urgencia" required>
                                <option value="baja">🔵 Baja</option>
                                <option value="media" selected>🟡 Media</option>
                                <option value="alta">🟠 Alta</option>
                                <option value="emergencia">🔴 Emergencia</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Tu contacto (opcional - para que quienes quieran ayudar puedan contactarte)</label>
                            <input type="text" id="animal-contacto" placeholder="Teléfono, email, o WhatsApp">
                        </div>
                        
                        <div class="form-acciones">
                            <button type="submit" class="btn-ayudar">
                                <i class="fas fa-paw"></i> Publicar
                            </button>
                            <button type="button" class="btn-cancelar" onclick="this.closest('.modal-ayudar-animal').remove()">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('form-publicar-animal').addEventListener('submit', async (e) => {
            e.preventDefault();
            const datos = {
                tipo_animal: document.getElementById('animal-tipo').value,
                nombre: document.getElementById('animal-nombre').value || null,
                edad: document.getElementById('animal-edad').value || null,
                situacion: document.getElementById('animal-situacion').value,
                tipo_ayuda: document.getElementById('animal-tipo-ayuda').value,
                descripcion: document.getElementById('animal-descripcion').value,
                ciudad: document.getElementById('animal-ciudad').value || null,
                provincia: document.getElementById('animal-provincia').value || null,
                zona: document.getElementById('animal-zona').value || null,
                urgencia: document.getElementById('animal-urgencia').value,
                contacto: document.getElementById('animal-contacto').value || null
            };
            
            try {
                await this.publicarAnimalQueNecesitaAyuda(datos);
                modal.remove();
            } catch (error) {
                // Error ya manejado
            }
        });
    }
    
    // ===== MODAL PARA PUBLICAR NECESIDAD DE REFUGIO =====
    mostrarModalPublicarNecesidad() {
        const modal = document.createElement('div');
        modal.className = 'modal-ayudar-animal';
        modal.id = 'modal-publicar-necesidad';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-home"></i> Publicar Necesidad de Refugio</h3>
                    <button class="cerrar-modal" onclick="this.closest('.modal-ayudar-animal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <p style="background: #FEF3C7; padding: 15px; border-radius: 8px; border-left: 4px solid #F59E0B; margin-bottom: 20px;">
                            <strong>⚠️ Importante:</strong> Necesitas estar registrado como organización primero. Si aún no lo estás, usa el botón "Registrar Organización".
                        </p>
                    </div>
                    <form id="form-publicar-necesidad">
                        <div class="form-group">
                            <label>Tu Organización *</label>
                            <select id="necesidad-organizacion" required>
                                <option value="">Selecciona tu organización...</option>
                            </select>
                            <small style="color: #6B7280; margin-top: 5px; display: block;">Si no aparece, primero regístrala en la pestaña "Registrar Organización"</small>
                        </div>
                        
                        <div class="form-group">
                            <label>Tipo de Necesidad *</label>
                            <select id="necesidad-tipo" required>
                                <option value="">Selecciona...</option>
                                <option value="alimentos">🍖 Alimentos</option>
                                <option value="medicamentos">💊 Medicamentos</option>
                                <option value="materiales">🧸 Materiales</option>
                                <option value="veterinario">🏥 Servicios Veterinarios</option>
                                <option value="voluntarios">🤝 Voluntarios</option>
                                <option value="otro">📋 Otro</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Descripción Específica *</label>
                            <textarea id="necesidad-descripcion" required placeholder="Describe específicamente qué necesitas (NO números irreales, necesidades reales)"></textarea>
                            <small style="color: #6B7280; margin-top: 5px; display: block;">Ej: "Necesitamos balanceado para perros adultos, aproximadamente 20kg para este mes" (específico, real)</small>
                        </div>
                        
                        <div class="form-group">
                            <label>Cantidad (opcional - si es específica)</label>
                            <input type="text" id="necesidad-cantidad" placeholder="Ej: 20kg de balanceado">
                        </div>
                        
                        <div class="form-group">
                            <label>¿Cómo pueden ayudar? *</label>
                            <textarea id="necesidad-como-ayudar" required placeholder="Contacto directo, transferencia, dirección para entregar, etc."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Urgencia *</label>
                            <select id="necesidad-urgencia" required>
                                <option value="baja">🔵 Baja</option>
                                <option value="media" selected>🟡 Media</option>
                                <option value="alta">🟠 Alta</option>
                                <option value="emergencia">🔴 Emergencia</option>
                            </select>
                        </div>
                        
                        <div class="form-acciones">
                            <button type="submit" class="btn-ayudar">
                                <i class="fas fa-home"></i> Publicar Necesidad
                            </button>
                            <button type="button" class="btn-cancelar" onclick="this.closest('.modal-ayudar-animal').remove()">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cargar organizaciones en el select
        this.cargarOrganizacionesEnSelect();
        
        document.getElementById('form-publicar-necesidad').addEventListener('submit', async (e) => {
            e.preventDefault();
            const organizacionId = parseInt(document.getElementById('necesidad-organizacion').value);
            
            if (!organizacionId) {
                alert('Por favor selecciona tu organización');
                return;
            }
            
            const datos = {
                tipo_necesidad: document.getElementById('necesidad-tipo').value,
                descripcion: document.getElementById('necesidad-descripcion').value,
                cantidad: document.getElementById('necesidad-cantidad').value || null,
                como_ayudar: document.getElementById('necesidad-como-ayudar').value,
                urgencia: document.getElementById('necesidad-urgencia').value
            };
            
            try {
                await this.publicarNecesidadRefugio(organizacionId, datos);
                modal.remove();
            } catch (error) {
                // Error ya manejado
            }
        });
    }
    
    // ===== MODAL PARA REGISTRAR ORGANIZACIÓN =====
    mostrarModalRegistrarOrganizacion() {
        const modal = document.createElement('div');
        modal.className = 'modal-ayudar-animal';
        modal.id = 'modal-registrar-organizacion';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-heart"></i> Registrar Organización</h3>
                    <button class="cerrar-modal" onclick="this.closest('.modal-ayudar-animal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="form-registrar-organizacion">
                        <div class="form-group">
                            <label>Nombre de la Organización *</label>
                            <input type="text" id="org-nombre" required placeholder="Nombre del refugio/fundación">
                        </div>
                        
                        <div class="form-group">
                            <label>Tipo de Organización *</label>
                            <select id="org-tipo" required>
                                <option value="">Selecciona...</option>
                                <option value="refugio">🏠 Refugio</option>
                                <option value="rescatista_independiente">🤝 Rescatista Independiente</option>
                                <option value="fundacion">💜 Fundación</option>
                                <option value="otro">📋 Otro</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Descripción</label>
                            <textarea id="org-descripcion" placeholder="Qué hace tu organización..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Ciudad</label>
                            <input type="text" id="org-ciudad" placeholder="Ciudad">
                        </div>
                        
                        <div class="form-group">
                            <label>Provincia</label>
                            <input type="text" id="org-provincia" placeholder="Provincia">
                        </div>
                        
                        <div class="form-group">
                            <label>Teléfono de Contacto</label>
                            <input type="text" id="org-telefono" placeholder="Teléfono">
                        </div>
                        
                        <div class="form-group">
                            <label>Email de Contacto</label>
                            <input type="email" id="org-email" placeholder="Email">
                        </div>
                        
                        <div class="form-group">
                            <label>Sitio Web (opcional)</label>
                            <input type="url" id="org-web" placeholder="https://...">
                        </div>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="org-cobra-comisiones">
                                ¿Cobra comisiones por donaciones?
                            </label>
                            <small style="color: #6B7280; margin-top: 5px; display: block;">Si cobras, será visible públicamente. Todos necesitamos sobrevivir, está bien, pero seamos transparentes.</small>
                        </div>
                        
                        <div class="form-group" id="org-transparencia-comisiones" style="display: none;">
                            <label>Transparencia sobre Comisiones *</label>
                            <textarea id="org-transparencia-texto" placeholder="Explica claramente cómo funcionan las comisiones (ej: 'Cobramos 10% para gastos operativos del refugio')"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="org-transparencia-donaciones">
                                Compartir públicamente cómo se usan las donaciones (opcional pero recomendado)
                            </label>
                        </div>
                        
                        <div class="form-acciones">
                            <button type="submit" class="btn-ayudar">
                                <i class="fas fa-heart"></i> Registrar Organización
                            </button>
                            <button type="button" class="btn-cancelar" onclick="this.closest('.modal-ayudar-animal').remove()">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Mostrar/ocultar campo de transparencia según checkbox
        document.getElementById('org-cobra-comisiones').addEventListener('change', (e) => {
            const campo = document.getElementById('org-transparencia-comisiones');
            const texto = document.getElementById('org-transparencia-texto');
            if (e.target.checked) {
                campo.style.display = 'block';
                texto.required = true;
            } else {
                campo.style.display = 'none';
                texto.required = false;
            }
        });
        
        document.getElementById('form-registrar-organizacion').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.supabase) {
                alert('No hay conexión con Supabase');
                return;
            }
            
            try {
                const { data, error } = await this.supabase
                    .from('organizaciones_animales')
                    .insert([{
                        nombre_organizacion: document.getElementById('org-nombre').value,
                        tipo: document.getElementById('org-tipo').value,
                        descripcion: document.getElementById('org-descripcion').value || null,
                        ubicacion_ciudad: document.getElementById('org-ciudad').value || null,
                        ubicacion_provincia: document.getElementById('org-provincia').value || null,
                        contacto_telefono: document.getElementById('org-telefono').value || null,
                        contacto_email: document.getElementById('org-email').value || null,
                        sitio_web: document.getElementById('org-web').value || null,
                        cobra_comisiones: document.getElementById('org-cobra-comisiones').checked,
                        transparencia_comisiones: document.getElementById('org-cobra-comisiones').checked 
                            ? document.getElementById('org-transparencia-texto').value 
                            : null,
                        transparencia_donaciones: document.getElementById('org-transparencia-donaciones').checked,
                        activa: true
                    }])
                    .select();
                
                if (error) throw error;
                
                this.mostrarExito('✅ Organización registrada. Será verificada por CRISLA antes de publicarse.');
                this.cargarOrganizaciones();
                modal.remove();
            } catch (error) {
                console.error('Error registrando organización:', error);
                this.mostrarError('Error al registrar: ' + error.message);
            }
        });
    }
    
    // ===== CARGAR ORGANIZACIONES EN SELECT =====
    async cargarOrganizacionesEnSelect() {
        if (!this.supabase) return;
        
        try {
            const { data, error } = await this.supabase
                .from('organizaciones_animales')
                .select('id, nombre_organizacion')
                .eq('activa', true)
                .order('nombre_organizacion');
            
            if (error) throw error;
            
            const select = document.getElementById('necesidad-organizacion');
            if (select) {
                select.innerHTML = '<option value="">Selecciona tu organización...</option>' +
                    (data || []).map(org => 
                        `<option value="${org.id}">${this.escapeHtml(org.nombre_organizacion)}</option>`
                    ).join('');
            }
        } catch (error) {
            console.error('Error cargando organizaciones:', error);
        }
    }
}

// Instancia global
window.sistemaAnimales = new SistemaCresaliaAnimales();

console.log('🐾 Sistema Cresalia Animales cargado');

