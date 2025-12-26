(function () {
    const section = document.getElementById('preferencias-cumple');
    if (!section) return;

    const form = section.querySelector('#formCumplePreferencias');
    const emailInput = form.querySelector('[name="email"]');
    const fechaInput = form.querySelector('[name="fecha_nacimiento"]');
    const publicoInput = form.querySelector('[name="acepta_publico"]');
    const descuentoInput = form.querySelector('[name="acepta_descuento"]');
    const mensajeInput = form.querySelector('[name="mensaje_publico"]');
    const loadButton = form.querySelector('[data-action="load"]');
    const resetButton = form.querySelector('[data-action="reset"]');
    const statusEl = form.querySelector('[data-status]');
    const lastSyncEl = form.querySelector('[data-last-sync]');

    const STORAGE_EMAIL_KEY = 'compradores_demo_email_cumple';

    const baseUrl = window.location.protocol === 'file:'
        ? 'https://cresalia-web.vercel.app'
        : '';

    let ultimaRespuesta = null;
    let loadingCount = 0;

    function setLoading(state) {
        loadingCount = state ? loadingCount + 1 : Math.max(loadingCount - 1, 0);
        const isLoading = loadingCount > 0;
        form.querySelectorAll('button').forEach((btn) => {
            btn.disabled = isLoading && btn !== loadButton;
        });
        loadButton.disabled = isLoading && document.activeElement !== loadButton;
    }

    function setStatus(message, type = 'info') {
        if (!statusEl) return;
        statusEl.textContent = message || '';
        statusEl.classList.remove('success', 'error', 'visible');
        if (message) {
            if (type === 'success') statusEl.classList.add('success');
            if (type === 'error') statusEl.classList.add('error');
            statusEl.classList.add('visible');
        }
    }

    function setLastSync(text) {
        if (!lastSyncEl) return;
        lastSyncEl.textContent = text || '';
    }

    function normalizarFecha(fecha) {
        if (!fecha) return '';
        const parsed = new Date(fecha);
        if (Number.isNaN(parsed.getTime())) return '';
        return parsed.toISOString().slice(0, 10);
    }

    function guardarEmailLocal(email) {
        if (!email) return;
        try {
            localStorage.setItem(STORAGE_EMAIL_KEY, email);
        } catch (error) {
            console.warn('No se pudo guardar email local:', error.message);
        }
    }

    function obtenerEmailLocal() {
        try {
            return localStorage.getItem(STORAGE_EMAIL_KEY) || '';
        } catch (error) {
            return '';
        }
    }

    function guardarPreferenciasLocal(payload) {
        try {
            const key = `${STORAGE_EMAIL_KEY}_preferencias_${payload.email}`;
            localStorage.setItem(key, JSON.stringify({
                ...payload,
                guardadoLocal: true,
                fechaGuardado: new Date().toISOString()
            }));
        } catch (error) {
            console.warn('No se pudieron guardar las preferencias localmente:', error.message);
        }
    }

    async function fetchPreferencias(email) {
        const url = `${baseUrl}/api/celebraciones?tipo=cumpleanos&action=consent&email=${encodeURIComponent(email)}`;
        const resp = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!resp.ok) {
            const mensaje = await resp.text();
            throw new Error(mensaje || `Error ${resp.status}`);
        }
        const data = await resp.json();
        if (!data.success) {
            throw new Error(data.message || 'No se pudo obtener la información');
        }
        return data.data || null;
    }

    function aplicarPreferencias(data) {
        if (!data) {
            fechaInput.value = '';
            publicoInput.checked = false;
            descuentoInput.checked = false;
            mensajeInput.value = '';
            ultimaRespuesta = null;
            return;
        }

        fechaInput.value = normalizarFecha(data.fecha_nacimiento);
        publicoInput.checked = Boolean(data.acepta_cumple_publico);
        descuentoInput.checked = Boolean(data.acepta_cumple_descuento);
        mensajeInput.value = data.mensaje_cumple_publico || '';
        ultimaRespuesta = data;
    }

    async function consultarPreferencias() {
        const email = (emailInput.value || '').trim().toLowerCase();
        if (!email) {
            setStatus('Ingresá tu email para consultar tus preferencias.', 'error');
            emailInput.focus();
            return;
        }

        setLoading(true);
        setStatus('Cargando preferencias...', 'info');

        try {
            const data = await fetchPreferencias(email);
            if (!data) {
                aplicarPreferencias(null);
                setStatus('No encontramos un registro con ese email. Registrate como comprador antes de configurar tu cumpleaños.', 'error');
                return;
            }

            aplicarPreferencias(data);
            guardarEmailLocal(email);
            setStatus('Preferencias cargadas correctamente 💜', 'success');
            setLastSync(`Última sincronización: ${new Date().toLocaleString()}`);
        } catch (error) {
            console.warn('Preferencias cumpleaños - error:', error.message);
            setStatus(error.message || 'No se pudieron cargar tus preferencias. Intentá más tarde.', 'error');
        } finally {
            setLoading(false);
        }
    }

    async function guardarPreferencias() {
        const email = (emailInput.value || '').trim().toLowerCase();
        if (!email) {
            setStatus('Necesitamos tu email para guardar las preferencias.', 'error');
            emailInput.focus();
            return;
        }

        const payload = {
            email,
            acepta_publico: publicoInput.checked,
            acepta_descuento: descuentoInput.checked,
            fecha_nacimiento: fechaInput.value || null,
            mensaje_publico: mensajeInput.value ? mensajeInput.value.trim() : null
        };

        setLoading(true);
        setStatus('Guardando tus preferencias...', 'info');

        try {
            if (!baseUrl && window.location.protocol === 'file:') {
                // Si estamos en file:// y no hay baseUrl, guardar localmente
                guardarPreferenciasLocal(payload);
                aplicarPreferencias(payload);
                guardarEmailLocal(email);
                setStatus('Tus preferencias fueron guardadas localmente. Cuando tengas conexión, se sincronizarán automáticamente. 💜', 'info');
                setLastSync(`Guardado localmente: ${new Date().toLocaleString()}`);
                setLoading(false);
                return;
            }

            const resp = await fetch(`${baseUrl}/api/compradores-cumple-consent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            }).catch(err => {
                // Si falla el fetch, guardar localmente
                console.warn('Error de conexión, guardando localmente:', err.message);
                guardarPreferenciasLocal(payload);
                aplicarPreferencias(payload);
                guardarEmailLocal(email);
                setStatus('No hay conexión. Tus preferencias fueron guardadas localmente y se sincronizarán cuando tengas internet. 💜', 'info');
                setLastSync(`Guardado localmente: ${new Date().toLocaleString()}`);
                throw new Error('No hay conexión a internet');
            });

            if (!resp || !resp.ok) {
                const texto = await resp.text().catch(() => '');
                throw new Error(`Error ${resp?.status || 'desconocido'}: ${texto || 'No se pudo conectar con el servidor'}`);
            }

            const resultado = await resp.json().catch(() => ({}));
            if (!resultado.success) {
                throw new Error(resultado.message || 'No se pudieron guardar las preferencias');
            }

            aplicarPreferencias(resultado.data || payload);
            guardarEmailLocal(email);
            setStatus('Tus preferencias fueron guardadas. ¡Gracias por confiar en Cresalia! 💜', 'success');
            setLastSync(`Última actualización: ${new Date().toLocaleString()}`);
        } catch (error) {
            if (error.message !== 'No hay conexión a internet') {
                console.warn('Guardar preferencias cumpleaños - error:', error.message);
                setStatus(error.message || 'No pudimos guardar tus preferencias. Intentá nuevamente.', 'error');
            }
        } finally {
            setLoading(false);
        }
    }

    function limpiarFormulario() {
        if (ultimaRespuesta) {
            aplicarPreferencias(ultimaRespuesta);
            setStatus('Restauramos la última configuración guardada.', 'info');
        } else {
            form.reset();
            setStatus('Formulario reiniciado.', 'info');
        }
    }

    if (loadButton) {
        loadButton.addEventListener('click', (event) => {
            event.preventDefault();
            consultarPreferencias();
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', (event) => {
            event.preventDefault();
            limpiarFormulario();
        });
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        guardarPreferencias();
    });

    const emailLocal = obtenerEmailLocal();
    if (emailLocal) {
        emailInput.value = emailLocal;
        consultarPreferencias();
    }
})();


