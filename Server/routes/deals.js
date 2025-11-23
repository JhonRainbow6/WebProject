const express = require('express');
const router = express.Router();
const axios = require('axios');

// Ruta para obtener las ofertas de Ubisoft
router.get('/ubisoft', async (req, res) => {
    try {
        const storeID = 13; // ID de Ubisoft Store
        const url = `https://www.cheapshark.com/api/1.0/deals?storeID=${storeID}`;

        console.log('Fetching deals from:', url);

        const response = await axios.get(url, {
            timeout: 10000, // 10 segundos de timeout
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; DealsBot/1.0)'
            }
        });

        console.log('Deals fetched successfully, count:', response.data.length);
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener las ofertas:', error.message);
        console.error('Error details:', error.response?.status, error.response?.statusText);

        res.status(500).json({
            error: 'Error al obtener las ofertas',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;