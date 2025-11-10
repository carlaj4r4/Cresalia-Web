(function () {
    const section = document.getElementById('cumpleaneros-home');
    if (!section) return;

    const mesActualEl = section.querySelector('[data-mes-actual]');
    const listaTiendas = section.querySelector('[data-list-tiendas]');
    const listaServicios = section.querySelector('[data-list-servicios]');
    const vacioTiendas = section.querySelector('[data-empty-tiendas]');
    const vacioServicios = section.querySelector('[data-empty-servicios]');

    const estado = {
        cargado: false
    };

    function definirBaseUrl() {
        if (window.location.protocol === 'file:') {
            return 'https://cresalia-web.vercel.app';
        }
        return '';
    }

    function crearAvatar(item) {
        const wrapper = document.createElement('div');
        wrapper.className = 'cumpleaneros-avatar';

        if (item.logo) {
            const imagen = document.createElement('img');
            imagen.src = item.logo;
            imagen.alt = item.nombre || 'Cumpleañero Cresalia';
            imagen.loading = 'lazy';
            imagen.referrerPolicy = 'no-referrer';
            wrapper.appendChild(imagen);
        } else {
            const inicial = (item.nombre || 'Cresalia').charAt(0).toUpperCase();
            wrapper.textContent = inicial;
        }

        return wrapper;
    }

    function crearInfo(item) {
        const info = document.createElement('div');
        info.className = 'cumpleaneros-info';

        const titulo = document.createElement('h4');
        titulo.textContent = item.nombre || 'Emprendimiento Cresalia';
        info.appendChild(titulo);

        if (item.categoria) {
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = item.categoria;
            info.appendChild(badge);
        }

        const detalles = [];
        if (item.descripcion) {
            detalles.push(item.descripcion);
        }
        const ubicacion = [item.ciudad, item.pais].filter(Boolean).join(', ');
        if (ubicacion) {
            detalles.push(ubicacion);
        }

        if (detalles.length > 0) {
            const descripcion = document.createElement('p');
            descripcion.className = 'cumpleaneros-meta';
            descripcion.textContent = detalles.join(' • ');
            info.appendChild(descripcion);
        }

        return info;
    }

    function crearDia(item, esServicio) {
        const dia = document.createElement('div');
        dia.className = 'cumpleaneros-dia';
        if (esServicio) {
            dia.classList.add('servicios');
        }
        dia.textContent = item.dia ? String(item.dia).padStart(2, '0') : '—';
        return dia;
    }

    function renderizarLista(contenedor, vacio, items, esServicio) {
        if (!contenedor || !vacio) return;

        contenedor.innerHTML = '';

        if (!items || items.length === 0) {
            vacio.style.display = 'block';
            return;
        }

        vacio.style.display = 'none';
        const fragment = document.createDocumentFragment();

        items.slice(0, 8).forEach((item) => {
            const card = document.createElement('div');
            card.className = 'cumpleaneros-card';
            if (esServicio) {
                card.classList.add('servicios');
            }

            card.appendChild(crearAvatar(item));
            card.appendChild(crearInfo(item));
            card.appendChild(crearDia(item, esServicio));

            fragment.appendChild(card);
        });

        contenedor.appendChild(fragment);
    }

    function mostrarMensajeFallback(mensaje) {
        if (vacioTiendas) {
            vacioTiendas.textContent = mensaje;
            vacioTiendas.style.display = 'block';
        }
        if (vacioServicios) {
            vacioServicios.textContent = mensaje;
            vacioServicios.style.display = 'block';
        }
    }

    async function cargarCumpleaneros() {
        if (estado.cargado) return;
        estado.cargado = true;

        const baseUrl = definirBaseUrl();
        const hoy = new Date();
        const mes = hoy.getMonth() + 1;

        try {
            const respuesta = await fetch(`${baseUrl}/api/cumpleaneros-home?mes=${mes}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!respuesta.ok) {
                throw new Error(`Respuesta ${respuesta.status}`);
            }

            const datos = await respuesta.json();
            if (!datos || !datos.success) {
                throw new Error('Respuesta inesperada del servidor');
            }

            if (mesActualEl && datos.mesNombre) {
                mesActualEl.textContent = datos.mesNombre.charAt(0).toUpperCase() + datos.mesNombre.slice(1);
            }

            renderizarLista(listaTiendas, vacioTiendas, datos.tiendas, false);
            renderizarLista(listaServicios, vacioServicios, datos.servicios, true);

            // Si ambas listas quedaron vacías, mostramos un mensaje genérico
            const sinTiendas = !datos.tiendas || datos.tiendas.length === 0;
            const sinServicios = !datos.servicios || datos.servicios.length === 0;
            if (sinTiendas && sinServicios) {
                mostrarMensajeFallback('Pronto vas a ver aquí a quienes decidan compartir su cumpleaños con toda la comunidad 💜');
            }
        } catch (error) {
            console.warn('Cumpleañeros del Mes - no se pudo cargar:', error.message);
            mostrarMensajeFallback('Estamos preparando esta sorpresa. Volvé más tarde para descubrir a quienes celebran este mes.');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cargarCumpleaneros);
    } else {
        cargarCumpleaneros();
    }
})();

