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
        console.error('Error fetching deals from CheapShark:', error.message);

        if (error.response) {
            console.error('Error Data:', error.response.data);
            console.error('Error Status:', error.response.status);
            console.error('Error Headers:', error.response.headers);
        } else if (error.request) {
            console.error('Error Request: No response received', error.request);
        } else {
            console.error('Error Config:', error.message);
        }

        res.status(502).json({
            error: 'Error al comunicarse con el proveedor de ofertas',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;