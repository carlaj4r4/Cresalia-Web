// ============================================
// WEBHOOK DE MERCADO PAGO PARA CRESALIA
// Procesa las notificaciones de pagos
// ============================================

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }
    
    try {
        const { type, data } = req.body;
        
        // Validar que viene de Mercado Pago
        const xSignature = req.headers['x-signature'];
        const xRequestId = req.headers['x-request-id'];
        
        if (!xSignature || !xRequestId) {
            return res.status(401).json({ error: 'No autorizado' });
        }
        
        // Registrar webhook en Supabase
        if (type === 'payment') {
            const payment = data;
            
            // Guardar en Supabase (aquí necesitarías tu cliente de Supabase)
            // await supabase.from('webhooks_mercadopago').insert({
            //     action: type,
            //     type: 'payment',
            //     data_id: payment.id,
            //     data: payment
            // });
            
            // Procesar según estado del pago
            if (payment.status === 'approved') {
                // Pago aprobado - actualizar suscripción o venta
                console.log('✅ Pago aprobado:', payment.id);
            } else if (payment.status === 'rejected') {
                // Pago rechazado
                console.log('❌ Pago rechazado:', payment.id);
            }
        }
        
        return res.status(200).json({ received: true });
    } catch (error) {
        console.error('Error procesando webhook:', error);
        return res.status(500).json({ error: 'Error interno' });
    }
}


