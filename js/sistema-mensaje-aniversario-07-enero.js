// ===== SISTEMA DE MENSAJE DE ANIVERSARIO 07 DE ENERO =====
// Celebra el lanzamiento oficial del SaaS (07 de enero de 2026 en adelante)

class SistemaMensajeAniversario07Enero {
    constructor() {
        this.diaObjetivo = 7; // 07
        this.mesObjetivo = 0; // Enero (0-11)
        this.anioInicio = 2026; // Año del lanzamiento oficial
        this.storageKey = 'mensaje_aniversario_07_enviado';
    }

    // ¿Ya se mostró este año?
    yaMostradoEsteAno() {
        const ultimo = localStorage.getItem(this.storageKey);
        if (!ultimo) return false;
        const fecha = new Date(ultimo);
        return fecha.getFullYear() === new Date().getFullYear();
    }

    marcarMostrado() {
        localStorage.setItem(this.storageKey, new Date().toISOString());
    }

    es07DeEnero() {
        const ahora = new Date();
        return (
            ahora.getFullYear() >= this.anioInicio &&
            ahora.getMonth() === this.mesObjetivo &&
            ahora.getDate() === this.diaObjetivo
        );
    }

    esEnero() {
        return new Date().getMonth() === this.mesObjetivo;
    }

    // Mostrar banner celebratorio en pantalla
    mostrarBanner() {
        if (document.getElementById('banner-aniversario-07-enero')) return;

        const banner = document.createElement('div');
        banner.id = 'banner-aniversario-07-enero';
        banner.style.position = 'fixed';
        banner.style.bottom = '20px';
        banner.style.right = '20px';
        banner.style.zIndex = '9999';
        banner.style.maxWidth = '360px';
        banner.style.background = 'linear-gradient(135deg, #7C3AED, #EC4899)';
        banner.style.color = 'white';
        banner.style.padding = '18px 20px';
        banner.style.borderRadius = '16px';
        banner.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';
        banner.style.display = 'flex';
        banner.style.gap = '12px';
        banner.style.alignItems = 'center';

        banner.innerHTML = `
            <div style="font-size: 26px;">🎉</div>
            <div style="flex: 1; line-height: 1.4;">
                <div style="font-weight: 700; font-size: 16px; margin-bottom: 6px;">
                    ¡Feliz aniversario Cresalia!
                </div>
                <div style="font-size: 14px; opacity: 0.95;">
                    Celebramos nuestro lanzamiento (07/01/2026). Gracias por ser parte 💜
                </div>
            </div>
            <button aria-label="Cerrar" style="
                background: rgba(255,255,255,0.15);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
            ">&times;</button>
        `;

        const closeBtn = banner.querySelector('button');
        closeBtn.addEventListener('click', () => banner.remove());

        document.body.appendChild(banner);
    }

    // Notificación push (si el usuario ya dio permiso)
    enviarNotificacionPush() {
        try {
            if (!('Notification' in window)) return;
            if (Notification.permission !== 'granted') return;

            const notif = new Notification('🎉 Aniversario Cresalia', {
                body: 'Celebramos nuestro lanzamiento (07/01/2026). Gracias por estar.',
                icon: '/assets/logo/logo-cresalia.png',
                tag: 'mensaje-aniversario-07-enero'
            });

            notif.onclick = () => {
                window.focus();
                notif.close();
            };
        } catch (error) {
            console.warn('⚠️ Error enviando notificación de aniversario:', error);
        }
    }

    // Disparar mensaje (solo una vez por año)
    procesarAniversario() {
        if (!this.es07DeEnero()) return;
        if (this.yaMostradoEsteAno()) {
            console.log('ℹ️ Mensaje de aniversario ya mostrado este año');
            return;
        }

        this.mostrarBanner();
        this.enviarNotificacionPush();
        this.marcarMostrado();
    }

    inicializar() {
        // Solo activar en enero y desde 2026
        if (!this.esEnero() || new Date().getFullYear() < this.anioInicio) {
            console.log('ℹ️ Sistema de aniversario: desactivado (fuera de enero o antes de 2026)');
            return;
        }

        console.log('🎉 Sistema de aniversario activado (enero)');

        // Ejecutar al cargar
        this.procesarAniversario();

        // Reintentar cuando la pestaña vuelve a estar visible (por si cambia el día)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.procesarAniversario();
            }
        });

        // Chequeo diario a las 00:05 aprox (cada 60 min mientras está abierta)
        setInterval(() => {
            this.procesarAniversario();
        }, 60 * 60 * 1000);
    }
}

// Instancia global
const sistemaMensajeAniversario07 = new SistemaMensajeAniversario07Enero();

// Inicializar automáticamente
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => sistemaMensajeAniversario07.inicializar());
    } else {
        sistemaMensajeAniversario07.inicializar();
    }
}

console.log('🎉 Sistema de Mensaje de Aniversario (07 de Enero) cargado');

