// ===== Cliente de Soporte e IA Cresalia =====
// Único punto para enviar tickets y consultas IA desde front

(function() {
    const SUPPORT_ENDPOINT = '/api/support';
    const AI_ENDPOINT = '/api/ai-chat';
    // IA permitida para todos los planes; se personaliza en backend según plan
    const ALLOWED_AI_PLANS = ['free', 'basic', 'starter', 'pro', 'enterprise'];
    let contextBuilder = null; // función opcional para armar contexto (productos/servicios visibles)

    function getCurrentPlan() {
        try {
            const fromStorage = localStorage.getItem('cresalia_current_plan');
            return (fromStorage || 'free').toLowerCase();
        } catch (_) {
            return 'free';
        }
    }

    async function enviarTicketSoporte({ email, nombre, mensaje, plan, tipo = 'general', metadata = {} }) {
        const payload = {
            email: email || metadata.email || null,
            nombre: nombre || metadata.nombre || 'Sin nombre',
            mensaje,
            plan: (plan || getCurrentPlan()),
            tipo,
            metadata
        };

        const resp = await fetch(SUPPORT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || !data.success) {
            throw new Error(data.error || 'No se pudo enviar el ticket de soporte');
        }
        return data;
    }

    function planPermiteIA(plan) {
        return ALLOWED_AI_PLANS.includes((plan || getCurrentPlan()).toLowerCase());
    }

    async function enviarConsultaAI({ mensaje, plan, history = [], userEmail = null }) {
        const contextText = typeof contextBuilder === 'function' ? (contextBuilder() || '') : '';

        const resp = await fetch(AI_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: mensaje,
                plan: plan || getCurrentPlan(),
                history,
                userEmail,
                context: contextText
            })
        });

        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || !data.success) {
            throw new Error(data.error || 'No se pudo obtener respuesta de IA');
        }
        return data.reply || 'Sin respuesta';
    }

    // Exponer en window
    window.CresaliaSupport = {
        enviarTicketSoporte,
        enviarConsultaAI,
        planPermiteIA,
        getCurrentPlan,
        setAIContextBuilder: fn => { contextBuilder = fn; }
    };
})();
