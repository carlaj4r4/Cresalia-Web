// Script helper para agregar el foro a todas las comunidades
// Este archivo solo es de referencia - los cambios se harán directamente en cada HTML

const comunidadesConfig = {
    'lgbtq-experiencias': {
        slug: 'lgbtq-experiencias',
        emoji: '🏳️‍🌈',
        color1: '#FF6B6B',
        color2: '#FF8E53',
        gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
    },
    'mujeres-sobrevivientes': {
        slug: 'mujeres-sobrevivientes',
        emoji: '💜',
        color1: '#C084FC',
        color2: '#E879F9',
        gradient: 'linear-gradient(135deg, #C084FC 0%, #E879F9 100%)'
    },
    'hombres-sobrevivientes': {
        slug: 'hombres-sobrevivientes',
        emoji: '💙',
        color1: '#3B82F6',
        color2: '#1E40AF',
        gradient: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)'
    },
    'anti-bullying': {
        slug: 'anti-bullying',
        emoji: '🛡️',
        color1: '#60A5FA',
        color2: '#34D399',
        gradient: 'linear-gradient(135deg, #60A5FA 0%, #34D399 100%)'
    },
    'discapacidad': {
        slug: 'discapacidad',
        emoji: '♿',
        color1: '#8B5CF6',
        color2: '#A78BFA',
        gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)'
    },
    'inmigrantes-racializados': {
        slug: 'inmigrantes-racializados',
        emoji: '🌍',
        color1: '#D97706',
        color2: '#F59E0B',
        gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)'
    },
    'adultos-mayores': {
        slug: 'adultos-mayores',
        emoji: '👴👵',
        color1: '#F59E0B',
        color2: '#FBBF24',
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
    },
    'cuidadores': {
        slug: 'cuidadores',
        emoji: '🤲',
        color1: '#10B981',
        color2: '#34D399',
        gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
    },
    'enfermedades-cronicas': {
        slug: 'enfermedades-cronicas',
        emoji: '🏥',
        color1: '#EF4444',
        color2: '#F87171',
        gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)'
    }
};

// Esta función genera los estilos CSS personalizados para cada comunidad
function generarEstilosForo(config) {
    const { color1, color2, gradient } = config;
    
    return `
        .btn-primary {
            background: ${gradient};
            color: white;
            padding: 12px 30px;
            border-radius: 10px;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px ${color1}66;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: ${color1};
        }
        
        .post {
            background: #F9FAFB;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 25px;
            border-left: 4px solid ${color1};
        }
        
        .btn-comentar, .btn-reaccionar {
            background: none;
            border: none;
            color: ${color1};
            cursor: pointer;
            padding: 8px 15px;
            border-radius: 8px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .btn-comentar:hover, .btn-reaccionar:hover {
            background: ${color1}15;
        }
        
        .comentario {
            background: white;
            padding: 15px;
            border-radius: 10px;
            border-left: 3px solid ${color1}40;
        }
    `;
}

// Esta función genera el HTML del foro
function generarHTMLForo(config) {
    const { slug, emoji } = config;
    
    return `
    <!-- SISTEMA DE FORO -->
    <div class="foro-container">
        <div class="foro-header">
            <h2>${emoji} Foro de la Comunidad</h2>
            <button class="btn-primary" id="btn-crear-post">
                <i class="fas fa-plus"></i> Crear Post
            </button>
        </div>
        
        <div id="posts-container">
            <!-- Los posts se cargarán aquí -->
        </div>
    </div>
    
    <!-- Modal crear post -->
    <div class="modal" id="modal-crear-post">
        <div class="modal-content">
            <div class="modal-header">
                <h3>💜 Crear Nuevo Post</h3>
                <button class="cerrar-modal" id="cerrar-form-post">&times;</button>
            </div>
            <form id="form-crear-post">
                <div class="form-group">
                    <label for="autor-alias">Tu alias (opcional):</label>
                    <input type="text" id="autor-alias" placeholder="Ej: Anónimo, Luchador/a, Esperanza..." maxlength="50">
                </div>
                <div class="form-group">
                    <label for="post-titulo">Título (opcional):</label>
                    <input type="text" id="post-titulo" placeholder="Un título para tu post..." maxlength="500">
                </div>
                <div class="form-group">
                    <label for="post-contenido">Tu mensaje: *</label>
                    <textarea id="post-contenido" placeholder="Compartí tu experiencia, busca apoyo, o simplemente desahógate. Este es un espacio seguro... (mínimo 10 caracteres)" required></textarea>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button type="button" class="btn-secondary" id="cancelar-form-post">Cancelar</button>
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-paper-plane"></i> Publicar
                    </button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="../../config-supabase-seguro.js"></script>
    <script src="../../js/sistema-foro-comunidades.js"></script>
    <script>
        // Inicializar sistema de foro
        let foroComunidad;
        document.addEventListener('DOMContentLoaded', () => {
            foroComunidad = new SistemaForoComunidades('${slug}');
            window.foroComunidad = foroComunidad;
            
            // Botón cancelar modal
            document.getElementById('cancelar-form-post')?.addEventListener('click', () => {
                foroComunidad.ocultarFormularioPost();
            });
        });
    </script>
    `;
}

module.exports = { comunidadesConfig, generarEstilosForo, generarHTMLForo };

