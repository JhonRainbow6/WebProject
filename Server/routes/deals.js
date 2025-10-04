const express = require('express');
const router = express.Router();
const axios = require('axios');

// Ruta para obtener las ofertas de Ubisoft
router.get('/ubisoft', async (req, res) => {
    try {
        const storeID = 13; // ID de Ubisoft Store
        const url = `https://www.cheapshark.com/api/1.0/deals?storeID=${storeID}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener las ofertas:', error);
        res.status(500).json({ error: 'Error al obtener las ofertas' });
    }
});

module.exports = router;