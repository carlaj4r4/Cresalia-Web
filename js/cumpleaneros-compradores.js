(function () {
    const section = document.getElementById('cumpleaneros-compradores');
    if (!section) return;

    const mesActualEl = section.querySelector('[data-mes-actual]');
    const listaEl = section.querySelector('[data-listado]');
    const destacadosWrapper = section.querySelector('[data-destacados-wrapper]');
    const listaDestacados = section.querySelector('[data-destacados]');
    const vacioEl = section.querySelector('[data-empty]');
    const consentEl = section.querySelector('[data-consent-aviso]');

    const estado = {
        cargado: false,
        baseUrl: null
    };

    const STORAGE_KEY_ABRAZOS = 'cumpleCompradoresAbrazos';

    function definirBaseUrl() {
        if (window.location?.protocol === 'file:') {
            return 'https://cresalia-web.vercel.app';
        }
        return '';
    }

    function crearAvatar(destinatario) {
        const wrapper = document.createElement('div');
        wrapper.className = 'cumple-compradores-avatar';

        if (destinatario.avatar) {
            const imagen = document.createElement('img');
            imagen.src = destinatario.avatar;
            imagen.alt = destinatario.nombre || 'Cumpleañero Cresalia';
            imagen.loading = 'lazy';
            imagen.referrerPolicy = 'no-referrer';
            wrapper.appendChild(imagen);
        } else {
            const inicial = (destinatario.nombre || 'Cresalia').charAt(0).toUpperCase();
            wrapper.textContent = inicial;
        }

        return wrapper;
    }

    function crearInfo(destinatario) {
        const info = document.createElement('div');
        info.className = 'cumple-compradores-info';

        const titulo = document.createElement('h4');
        titulo.textContent = destinatario.nombre || 'Persona Cresalia';
        info.appendChild(titulo);

        if (destinatario.ciudad || destinatario.pais) {
            const ubicacion = document.createElement('p');
            ubicacion.className = 'cumple-compradores-meta';
            ubicacion.textContent = [destinatario.ciudad, destinatario.pais].filter(Boolean).join(', ');
            info.appendChild(ubicacion);
        }

        if (destinatario.mensajePersonalizado) {
            const mensaje = document.createElement('blockquote');
            mensaje.className = 'cumple-compradores-mensaje';
            mensaje.textContent = destinatario.mensajePersonalizado;
            info.appendChild(mensaje);
        }

        if (destinatario.consentimientoBeneficio) {
            const badge = document.createElement('span');
            badge.className = 'cumple-compradores-badge';
            badge.textContent = 'Descuento cumpleañero activado';
            info.appendChild(badge);
        }

        return info;
    }

    function crearDia(destinatario) {
        const dia = document.createElement('div');
        dia.className = 'cumple-compradores-dia';
        dia.textContent = destinatario.dia ? String(destinatario.dia).padStart(2, '0') : '—';
        return dia;
    }

    function obtenerClaveDestinatario(item) {
        return (
            item.id ||
            item.email ||
            `${item.nombre || 'anonimo'}-${item.dia || '00'}`
        );
    }

    function obtenerAbrazos() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY_ABRAZOS) || '{}');
        } catch (error) {
            console.warn('No se pudieron leer abrazos locales:', error.message);
            return {};
        }
    }

    function guardarAbrazos(data) {
        try {
            localStorage.setItem(STORAGE_KEY_ABRAZOS, JSON.stringify(data));
        } catch (error) {
            console.warn('No se pudieron guardar abrazos locales:', error.message);
        }
    }

    async function enviarInteraccion(payload) {
        const url = `${estado.baseUrl || ''}/api/cumpleanos-interacciones`;
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!respuesta.ok) {
            const texto = await respuesta.text();
            throw new Error(texto || `Error ${respuesta.status}`);
        }

        return respuesta.json();
    }

    function crearAcciones(item, opciones) {
        const referencia = item.referencia || obtenerClaveDestinatario(item);
        if (!referencia) return null;

        const clave = referencia;
        const abrazosLocales = obtenerAbrazos();
        const localInfo = abrazosLocales[clave] || { yaEnviaste: false };

        let resumenActual = {
            abrazos: item.interacciones?.abrazos || 0,
            mensajes: Array.isArray(item.interacciones?.mensajes) ? item.interacciones.mensajes : []
        };

        const contenedor = document.createElement('div');
        contenedor.className = 'cumple-compradores-interacciones';

        const acciones = document.createElement('div');
        acciones.className = 'cumple-compradores-actions';

        const botonAbrazo = document.createElement('button');
        botonAbrazo.className = 'enviar-abrazo';
        botonAbrazo.type = 'button';
        botonAbrazo.textContent = localInfo.yaEnviaste ? '💜 Abrazo enviado' : 'Enviar abrazo 💜';
        botonAbrazo.disabled = localInfo.yaEnviaste;

        const contador = document.createElement('span');
        contador.className = 'contador-abrazos';
        contador.innerHTML = `<i class="fas fa-heart"></i> ${resumenActual.abrazos || 0} abrazos`;

        botonAbrazo.addEventListener('click', async () => {
            const datos = obtenerAbrazos();
            const previo = datos[clave] || { yaEnviaste: false };
            if (previo.yaEnviaste) return;

            botonAbrazo.disabled = true;
            botonAbrazo.textContent = 'Enviando abrazo...';

            try {
                const respuesta = await enviarInteraccion({
                    referencia,
                    tipo: 'abrazo'
                });

                resumenActual = respuesta?.resumen || resumenActual;
                contador.innerHTML = `<i class="fas fa-heart"></i> ${resumenActual.abrazos || 0} abrazos`;

                datos[clave] = { yaEnviaste: true, ultimaFecha: new Date().toISOString() };
                guardarAbrazos(datos);

                botonAbrazo.textContent = '💜 Abrazo enviado';
            } catch (error) {
                console.warn('No se pudo enviar abrazo:', error.message);
                botonAbrazo.disabled = false;
                botonAbrazo.textContent = 'Enviar abrazo 💜';
                alert('No pudimos enviar el abrazo, intentá de nuevo en unos segundos 💜');
                return;
            }

            botonAbrazo.disabled = true;
        });

        const botonMensaje = document.createElement('button');
        botonMensaje.className = 'dejar-mensaje';
        botonMensaje.type = 'button';
        botonMensaje.textContent = 'Dejar un mensajito 💬';

        const respuestasUI = document.createElement('div');
        respuestasUI.className = 'cumple-compradores-respuestas';

        function renderizarRespuestas() {
            const lista = resumenActual.mensajes || [];

            respuestasUI.innerHTML = '';

            const titulo = document.createElement('h5');
            titulo.innerHTML = '<i class="fas fa-comment-dots"></i> Mensajes de la comunidad';
            respuestasUI.appendChild(titulo);

            if (lista.length === 0) {
                const vacio = document.createElement('div');
                vacio.className = 'sin-mensajes';
                vacio.textContent = 'Todavía no hay mensajes. ¡Podés ser la primera persona en dejar uno!';
                respuestasUI.appendChild(vacio);
                return;
            }

            const ul = document.createElement('ul');
            lista.slice(0, 5).forEach((respuesta) => {
                const li = document.createElement('li');
                const autor = respuesta.autor ? `<strong>${respuesta.autor}</strong>: ` : '';
                li.innerHTML = `${autor}${respuesta.mensaje}`;
                ul.appendChild(li);
            });

            respuestasUI.appendChild(ul);
        }

        botonMensaje.addEventListener('click', async () => {
            const autor = prompt('¿Cómo querés que aparezca tu nombre? (Opcional)');
            const mensaje = prompt('Dejá un mensaje cortito para esta persona:');

            if (!mensaje || mensaje.trim().length < 3) {
                alert('El mensaje debe tener al menos 3 caracteres para que se entienda 💜');
                return;
            }

            botonMensaje.disabled = true;
            botonMensaje.textContent = 'Enviando...';

            try {
                const respuesta = await enviarInteraccion({
                    referencia,
                    tipo: 'mensaje',
                    autor: autor && autor.trim() ? autor.trim() : null,
                    mensaje: mensaje.trim()
                });

                resumenActual = respuesta?.resumen || resumenActual;
                renderizarRespuestas();
                if (!respuestasUI.isConnected) {
                    contenedor.appendChild(respuestasUI);
                }
            } catch (error) {
                console.warn('No se pudo guardar el mensaje:', error.message);
                alert('No pudimos guardar tu mensajito en este momento. Intentalo nuevamente 💜');
            } finally {
                botonMensaje.disabled = false;
                botonMensaje.textContent = 'Dejar un mensajito 💬';
            }
        });

        acciones.appendChild(botonAbrazo);
        acciones.appendChild(botonMensaje);
        acciones.appendChild(contador);

        contenedor.appendChild(acciones);

        if (opciones.destacado || (resumenActual.mensajes && resumenActual.mensajes.length > 0)) {
            renderizarRespuestas();
            contenedor.appendChild(respuestasUI);
        }

        return contenedor;
    }

    function renderizarLista(contenedor, vacio, celebrantes, opciones = {}) {
        if (!contenedor) return;

        contenedor.innerHTML = '';

        if (!celebrantes || celebrantes.length === 0) {
            if (vacio) {
                vacio.style.display = 'block';
            }
            return;
        }

        if (vacio) {
            vacio.style.display = 'none';
        }

        const fragment = document.createDocumentFragment();

        const maxItems = typeof opciones.max === 'number' ? opciones.max : celebrantes.length;

        celebrantes.slice(0, maxItems).forEach((item) => {
            const card = document.createElement('article');
            card.className = 'cumple-compradores-card';
            if (opciones.destacado) {
                card.classList.add('destacado');
            }

            card.appendChild(crearAvatar(item));
            card.appendChild(crearInfo(item));
            card.appendChild(crearDia(item));

            const interacciones = crearAcciones(item, opciones);
            if (interacciones) {
                card.appendChild(interacciones);
            }

            fragment.appendChild(card);
        });

        contenedor.appendChild(fragment);
    }

    function mostrarFallback(mensaje) {
        if (vacioEl) {
            vacioEl.textContent = mensaje;
            vacioEl.style.display = 'block';
        }
    }

    async function cargarCumpleaneros() {
        if (estado.cargado) return;
        estado.cargado = true;

        estado.baseUrl = definirBaseUrl();
        const hoy = new Date();
        const mes = hoy.getMonth() + 1;

        try {
            const respuesta = await fetch(`${estado.baseUrl || ''}/api/cumpleaneros-compradores?mes=${mes}`, {
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

            if (consentEl) {
                consentEl.textContent = `${datos.total || 0} personas eligieron compartir su cumpleaños este mes 💜`;
            }

            const celebrantes = Array.isArray(datos.celebrantes) ? datos.celebrantes : [];
            const destacados = celebrantes.filter(item => (item.mensajePersonalizado || '').trim().length >= 12);
            const idsDestacados = new Set(destacados.map(item => item.referencia || item.id || item.email));
            const resto = celebrantes.filter(item => {
                const key = item.referencia || item.id || item.email;
                return !idsDestacados.has(key);
            });

            if (destacados.length > 0 && listaDestacados && destacadosWrapper) {
                destacadosWrapper.style.display = '';
                renderizarLista(listaDestacados, null, destacados, { destacado: true, max: 6 });
            } else if (destacadosWrapper) {
                destacadosWrapper.style.display = 'none';
            }

            renderizarLista(listaEl, vacioEl, resto, { max: 20 });

            if (celebrantes.length === 0) {
                mostrarFallback('Cuando alguien acepte compartir su cumpleaños, lo vas a ver aquí para que le dejemos mucho cariño 💜');
            }
        } catch (error) {
            console.warn('Cumpleañeros comunidad - no se pudo cargar:', error.message);
            mostrarFallback('Estamos preparando esta sorpresa. Pronto vas a ver los cumpleaños del mes.');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', cargarCumpleaneros);
    } else {
        cargarCumpleaneros();
    }
})();


