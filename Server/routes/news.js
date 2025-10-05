const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// Ruta para obtener noticias de videojuegos
router.get('/gaming', async (req, res) => {
    try {
        // Obtener la API key desde las variables de entorno
        const apiKey = process.env.NEWS_API_KEY;

        // Definir los parámetros de búsqueda específicamente para noticias de Ubisoft
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'Ubisoft OR "Ubisoft games" OR "Assassin\'s Creed" OR "Far Cry" OR "Watch Dogs" OR "Rainbow Six"',
                language: 'es',
                sortBy: 'publishedAt',
                pageSize: 20,
                apiKey: apiKey
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error al obtener noticias de Ubisoft:', error);
        res.status(500).json({
            message: 'Error al obtener noticias',
            error: error.response ? error.response.data : error.message
        });
    }
});

module.exports = router;
