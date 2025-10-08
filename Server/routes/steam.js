const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Redirect user to Steam for authentication
router.get('/auth/steam', (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(401).json({ msg: 'Token no proporcionado' });
    }

    const redirectUrl = `http://localhost:5000/api/steam/auth/steam/callback?token=${token}`;
    const steamAuthUrl = `https://steamcommunity.com/openid/login?` +
        `openid.ns=http://specs.openid.net/auth/2.0&` +
        `openid.mode=checkid_setup&` +
        `openid.return_to=${encodeURIComponent(redirectUrl)}&` +
        `openid.realm=http://localhost:5000&` +
        `openid.identity=http://specs.openid.net/auth/2.0/identifier_select&` +
        `openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;

    res.redirect(steamAuthUrl);
});

// Steam callback
router.get('/auth/steam/callback', authMiddleware, async (req, res) => {
    try {
        // Verificar que la respuesta de Steam sea válida
        if (!req.query['openid.claimed_id']) {
            return res.redirect('http://localhost:3000/profile?error=steam_auth_failed');
        }

        // Verificar que tengamos el ID del usuario
        if (!req.user || !req.user.id) {
            console.error('ID de usuario no encontrado en el token:', req.user);
            return res.redirect('http://localhost:3000/profile?error=auth_error');
        }

        const steamId = req.query['openid.claimed_id'].split('/').pop();

        // Verificar que el steamId sea válido usando la API de Steam
        try {
            const steamApiKey = process.env.STEAM_API_KEY;
            const steamResponse = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamId}`);

            if (!steamResponse.data.response.players.length) {
                console.error('Steam ID no válido:', steamId);
                return res.redirect('http://localhost:3000/profile?error=invalid_steam_id');
            }
        } catch (steamError) {
            console.error('Error validando Steam ID:', steamError);
            return res.redirect('http://localhost:3000/profile?error=steam_api_error');
        }

        // Buscar y actualizar el usuario
        const user = await User.findById(req.user.id);
        if (!user) {
            console.error('Usuario no encontrado con ID:', req.user.id);
            return res.redirect('http://localhost:3000/profile?error=user_not_found');
        }

        user.steamId = steamId;
        await user.save();

        // Redirigir de vuelta al perfil con éxito
        res.redirect('http://localhost:3000/profile?success=steam_linked');
    } catch (error) {
        console.error('Error linking Steam account:', error);
        res.redirect('http://localhost:3000/profile?error=unknown_error');
    }
});

module.exports = router;
