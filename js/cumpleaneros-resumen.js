(function () {
    const bloqueResumen = document.getElementById('cumpleaneros-resumen');
    if (!bloqueResumen) return;

    const totalEl = bloqueResumen.querySelector('[data-total-celebrantes]');
    const hoyEl = bloqueResumen.querySelector('[data-celebran-hoy]');
    const proximosEl = bloqueResumen.querySelector('[data-proximos]');
    const abrazosEl = bloqueResumen.querySelector('[data-total-abrazos]');
    const mensajesEl = bloqueResumen.querySelector('[data-total-mensajes]');
    const cuponesEl = bloqueResumen.querySelector('[data-cupones-generados]');
    const upgradesEl = bloqueResumen.querySelector('[data-upgrades]');
    const mensajesListaEl = bloqueResumen.querySelector('[data-mensajes-recientes]');

    function definirBaseUrl() {
        if (window.location?.protocol === 'file:') {
            return 'https://cresalia-web.vercel.app';
        }
        return '';
    }

    function crearChip(texto) {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = texto;
        return chip;
    }

    function renderizarLista(container, items, formato) {
        if (!container) return;
        container.innerHTML = '';

        if (!items || items.length === 0) {
            const vacio = document.createElement('p');
            vacio.className = 'resumen-empty';
            vacio.textContent = 'Sin datos por ahora.';
            container.appendChild(vacio);
            return;
        }

        const frag = document.createDocumentFragment();
        items.forEach((item) => {
            const li = document.createElement('li');
            li.innerHTML = formato(item);
            frag.appendChild(li);
        });
        container.appendChild(frag);
    }

    async function cargarResumen() {
        bloqueResumen.classList.add('cargando');
        try {
            const baseUrl = definirBaseUrl();
            const respuesta = await fetch(`${baseUrl}/api/cumpleanos-resumen`);
            if (!respuesta.ok) {
                throw new Error(`Respuesta ${respuesta.status}`);
            }
            const datos = await respuesta.json();
            if (!datos || !datos.success) {
                throw new Error('Respuesta inválida del servidor');
            }

            if (totalEl) {
                totalEl.textContent = `${datos.celebrantes.total} cumpleañerxs este mes`;
            }
            if (hoyEl) {
                const cantidadHoy = datos.celebrantes.hoy.length;
                hoyEl.textContent = cantidadHoy > 0
                    ? `${cantidadHoy} celebran hoy 🎉`
                    : 'Hoy nadie cumple años, ¡mandá un mensaje adelantado!';
            }
            if (proximosEl) {
                renderizarLista(proximosEl, datos.celebrantes.proximos, (item) => {
                    const dia = item.dia ? String(item.dia).padStart(2, '0') : '??';
                    return `<strong>${dia}</strong> ${item.nombre || item.email || 'Persona Cresalia'}`;
                });
            }
            if (abrazosEl) {
                abrazosEl.textContent = `${datos.interacciones.totalAbrazos} abrazos enviados`;
            }
            if (mensajesEl) {
                mensajesEl.textContent = `${datos.interacciones.totalMensajes} mensajes de cariño`;
            }
            if (cuponesEl) {
                cuponesEl.textContent = `${datos.beneficios.cuponesGenerados} cupones de cumpleaños`;
            }
            if (upgradesEl) {
                upgradesEl.textContent = `${datos.beneficios.upgradesOtorgados} upgrades a Enterprise`;
            }
            if (mensajesListaEl) {
                renderizarLista(mensajesListaEl, datos.interacciones.mensajesRecientes, (item) => {
                    const autor = item.autor || 'Comunidad Cresalia';
                    return `<strong>${autor}</strong>: ${item.mensaje}`;
                });
            }
        } catch (error) {
            console.warn('Cumpleaños resumen - error:', error.message);
            bloqueResumen.classList.add('error');
            bloqueResumen.setAttribute('data-error', 'No se pudo cargar el resumen. Intenta más tarde.');
        } finally {
            bloqueResumen.classList.remove('cargando');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cargarResumen);
    } else {
        cargarResumen();
    }
})();



