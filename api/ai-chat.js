/**
 * 🤖 API Endpoint: IA Cresalia (solo PRO / Enterprise)
 * Proxy a proveedor de IA (OpenAI por defecto). Parametrizable por ENV.
 */

const ALLOWED_PLANS = ['pro', 'enterprise'];
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const AI_API_URL = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';

function applyCors(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async (req, res) => {
    applyCors(res);

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Método no permitido. Usa POST.' });
    }

    let body = {};
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    } catch (err) {
        return res.status(400).json({ success: false, error: 'JSON inválido' });
    }

    const { message, plan = 'free', history = [], userEmail = null } = body;

    if (!message) {
        return res.status(400).json({ success: false, error: 'Falta el campo message' });
    }

    const planLower = (plan || 'free').toLowerCase();
    if (!ALLOWED_PLANS.includes(planLower)) {
        return res.status(403).json({
            success: false,
            error: 'Tu plan no incluye IA real. Actualiza a PRO o Enterprise.'
        });
    }

    if (!OPENAI_API_KEY) {
        return res.status(501).json({
            success: false,
            error: 'OPENAI_API_KEY no configurada. Agrega la clave en Vercel para habilitar IA real.'
        });
    }

    try {
        const payload = {
            model: OPENAI_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'Eres Cresalia AI, un asistente de e-commerce que ayuda a compradores y vendedores con pedidos, pagos y soporte general. Sé breve y claro.'
                },
                ...history.map(msg => ({
                    role: msg.role === 'assistant' ? 'assistant' : 'user',
                    content: msg.content
                })),
                {
                    role: 'user',
                    content: message
                }
            ],
            temperature: 0.5,
            max_tokens: 300
        };

        const response = await fetch(AI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error del proveedor IA:', response.status, errorText);
            return res.status(response.status).json({
                success: false,
                error: 'Error llamando al proveedor de IA',
                details: errorText
            });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'No pude generar respuesta ahora.';

        return res.status(200).json({
            success: true,
            reply,
            provider: 'openai',
            model: OPENAI_MODEL,
            userEmail: userEmail || null
        });
    } catch (err) {
        console.error('❌ Error en /api/ai-chat:', err);
        return res.status(500).json({ success: false, error: 'Error interno', details: err.message });
    }
};
