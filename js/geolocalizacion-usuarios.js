(function() {
    'use strict';

    const STORAGE_KEY = 'cresalia_geolocalizacion_usuario';
    const CONSENT_KEY = 'cresalia_geolocalizacion_consentimiento';
    const COOLDOWN_MS = 15 * 60 * 1000; // 15 minutos
    const MAPBOX_TOKEN = (window.MAPBOX_CONFIG && window.MAPBOX_CONFIG.accessToken)
        || window.__MAPBOX_ACCESS_TOKEN__
        || null;

    function obtenerTenantSlug() {
        if (window.TIENDA_ACTUAL && window.TIENDA_ACTUAL.slug) {
            return window.TIENDA_ACTUAL.slug;
        }
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const tiendasIndex = pathParts.indexOf('tiendas');
        if (tiendasIndex !== -1 && pathParts.length > tiendasIndex + 1) {
            return pathParts[tiendasIndex + 1];
        }
        return localStorage.getItem('tenant_slug_activo') || 'demo-store';
    }

    function obtenerUsuarioActualSeguro() {
        try {
            if (typeof obtenerUsuarioActual === 'function') {
                return obtenerUsuarioActual();
            }
        } catch (error) {
            console.warn('⚠️ No se pudo obtener usuario actual vía obtenerUsuarioActual:', error.message);
        }

        try {
            if (window.sistemaCarritosMultiples && typeof window.sistemaCarritosMultiples.obtenerUsuarioActual === 'function') {
                return window.sistemaCarritosMultiples.obtenerUsuarioActual();
            }
        } catch (error) {
            console.warn('⚠️ No se pudo obtener usuario actual vía sistemaCarritosMultiples:', error.message);
        }

        try {
            const raw = localStorage.getItem('usuario_actual');
            if (raw) return JSON.parse(raw);
        } catch (error) {
            console.warn('⚠️ No se pudo parsear usuario_actual en localStorage:', error.message);
        }

        return null;
    }

    function obtenerConsentimiento() {
        return localStorage.getItem(CONSENT_KEY) || 'pendiente';
    }

    function guardarConsentimiento(valor) {
        localStorage.setItem(CONSENT_KEY, valor);
    }

    function obtenerUltimaUbicacion() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (error) {
            console.warn('⚠️ No se pudo obtener última ubicación:', error.message);
            return null;
        }
    }

    function guardarUltimaUbicacion(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                ...data,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('⚠️ No se pudo guardar la ubicación:', error.message);
        }
    }

    function mostrarAviso(mensaje, tipo = 'info') {
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(mensaje, tipo);
        } else {
            const prefix = tipo === 'error' ? '❌' : tipo === 'success' ? '✅' : 'ℹ️';
            console.log(`${prefix} ${mensaje}`);
        }
    }

    async function reverseGeocode(lat, lng) {
        if (!MAPBOX_TOKEN) return null;
        try {
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=es&limit=1`;
            const response = await fetch(url);
            if (!response.ok) return null;
            const data = await response.json();
            if (data && Array.isArray(data.features) && data.features[0]) {
                const feature = data.features[0];
                return {
                    place_name: feature.place_name,
                    text: feature.text,
                    context: feature.context || [],
                    relevance: feature.relevance
                };
            }
            return null;
        } catch (error) {
            console.warn('⚠️ Error en reverse geocode Mapbox:', error.message);
            return null;
        }
    }

    async function enviarUbicacionBackend(payload) {
        if (window.sistemaUbicaciones && typeof window.sistemaUbicaciones.registrarUbicacionUsuario === 'function') {
            window.sistemaUbicaciones.registrarUbicacionUsuario(payload);
            return;
        }

        const usuarioActual = obtenerUsuarioActualSeguro();
        const usuarioEmail = usuarioActual?.email
            || usuarioActual?.correo
            || usuarioActual?.buyer_email
            || usuarioActual?.usuario_email
            || null;

        const usuarioTipo = usuarioActual?.tipo
            || usuarioActual?.role
            || usuarioActual?.rol
            || 'desconocido';

        try {
            await fetch('/api/usuarios/ubicacion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenant_slug: obtenerTenantSlug(),
                    usuario_email: usuarioEmail,
                    usuario_tipo: usuarioTipo,
                    lat: payload.lat,
                    lng: payload.lng,
                    precision: payload.precision || null,
                    fuente: payload.fuente || 'auto',
                    contexto: payload.contexto || null,
                    metadata: payload.metadata || null,
                    timestamp: new Date().toISOString()
                })
            });
        } catch (error) {
            console.warn('⚠️ No se pudo enviar ubicación al backend:', error.message);
        }
    }

    async function procesarUbicacion(position, contexto = 'auto') {
        const { latitude, longitude, accuracy } = position.coords;
        const geocode = await reverseGeocode(latitude, longitude);

        const metadata = {
            mapbox: geocode,
            accuracy,
            origen: contexto,
            platform: navigator.userAgent
        };

        guardarUltimaUbicacion({
            lat: latitude,
            lng: longitude,
            accuracy,
            contexto
        });

        await enviarUbicacionBackend({
            lat: latitude,
            lng: longitude,
            precision: accuracy,
            fuente: 'geolocalizacion-automatica',
            contexto,
            metadata
        });

        mostrarAviso('Ubicación registrada para mejorar envíos y alertas 💜', 'success');
    }

    function solicitarUbicacion(contexto) {
        if (!navigator.geolocation) {
            mostrarAviso('Tu dispositivo no permite geolocalización automática.', 'warning');
            guardarConsentimiento('denegado');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                guardarConsentimiento('concedido');
                procesarUbicacion(position, contexto);
            },
            (error) => {
                console.warn('⚠️ Error al obtener ubicación:', error.message);
                guardarConsentimiento('denegado');
                mostrarAviso('No pudimos obtener tu ubicación. Puedes habilitarla cuando quieras.', 'warning');
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 600000
            }
        );
    }

    function debeActualizarUbicacion() {
        const ultima = obtenerUltimaUbicacion();
        if (!ultima) return true;
        return Date.now() - ultima.timestamp > COOLDOWN_MS;
    }

    function inicializarGeolocalizacion() {
        const consentimiento = obtenerConsentimiento();
        if (consentimiento === 'denegado' || consentimiento === 'denied') {
            return;
        }

        if (!debeActualizarUbicacion()) {
            return;
        }

        if (consentimiento === 'concedido' || consentimiento === 'granted') {
            solicitarUbicacion('actualizacion-programada');
            return;
        }

        setTimeout(() => {
            const mensaje = '¿Nos permitís usar tu ubicación para envíos, emergencias y alertas personalizadas?';
            const acepta = window.confirm(mensaje);
            if (acepta) {
                guardarConsentimiento('concedido');
                solicitarUbicacion('consentimiento-inicial');
            } else {
                guardarConsentimiento('denegado');
            }
        }, 1500);
    }

    window.reintentarGeolocalizacionCresalia = function() {
        guardarConsentimiento('pendiente');
        inicializarGeolocalizacion();
    };

    document.addEventListener('DOMContentLoaded', inicializarGeolocalizacion);
})();



