const { procesarCumpleanosDelDia } = require('../../backend/tasks/cumpleanos');

module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const resultado = await procesarCumpleanosDelDia();
        res.status(200).json({ success: true, ...resultado });
    } catch (error) {
        console.error('❌ Cron cumpleaños (serverless):', error);
        res.status(500).json({ success: false, message: error.message });
    }
};



