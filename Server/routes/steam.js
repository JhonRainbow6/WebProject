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

    const redirectUrl = `${process.env.BACKEND_URL}/api/steam/auth/steam/callback?token=${token}`;
    const steamAuthUrl = `https://steamcommunity.com/openid/login?` +
        `openid.ns=http://specs.openid.net/auth/2.0&` +
        `openid.mode=checkid_setup&` +
        `openid.return_to=${encodeURIComponent(redirectUrl)}&` +
        `openid.realm=${process.env.BACKEND_URL}&` +
        `openid.identity=http://specs.openid.net/auth/2.0/identifier_select&` +
        `openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;

    res.redirect(steamAuthUrl);
});

// Steam callback
router.get('/auth/steam/callback', authMiddleware, async (req, res) => {
    try {
        // Verificar que la respuesta de Steam sea válida
        if (!req.query['openid.claimed_id']) {
            return res.redirect(`${process.env.FRONTEND_URL}/profile?error=steam_auth_failed`);
        }

        // Verificar que tengamos el ID del usuario
        if (!req.user || !req.user.id) {
            console.error('ID de usuario no encontrado en el token:', req.user);
            return res.redirect(`${process.env.FRONTEND_URL}/profile?error=auth_error`);
        }

        const steamId = req.query['openid.claimed_id'].split('/').pop();

        // Verificar que el steamId sea válido usando la API de Steam
        try {
            const steamApiKey = process.env.STEAM_API_KEY;
            const steamResponse = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamId}`);

            if (!steamResponse.data.response.players.length) {
                console.error('Steam ID no válido:', steamId);
                return res.redirect(`${process.env.FRONTEND_URL}/profile?error=invalid_steam_id`);
            }
        } catch (steamError) {
            console.error('Error validando Steam ID:', steamError);
            return res.redirect(`${process.env.FRONTEND_URL}/profile?error=steam_api_error`);
        }

        // Buscar y actualizar el usuario
        const user = await User.findById(req.user.id);
        if (!user) {
            console.error('Usuario no encontrado con ID:', req.user.id);
            return res.redirect(`${process.env.FRONTEND_URL}/profile?error=user_not_found`);
        }

        user.steamId = steamId;
        await user.save();

        // Redirigir de vuelta al perfil con éxito
        res.redirect(`${process.env.FRONTEND_URL}/profile?success=steam_linked`);
    } catch (error) {
        console.error('Error linking Steam account:', error);
        res.redirect(`${process.env.FRONTEND_URL}/profile?error=unknown_error`);
    }
});

// Ruta para obtener los juegos del usuario
router.get('/games', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.steamId) {
            return res.status(400).json({ error: 'Usuario no tiene una cuenta de Steam vinculada' });
        }

        const steamApiKey = process.env.STEAM_API_KEY;
        const gamesResponse = await axios.get(
            `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApiKey}&steamid=${user.steamId}&format=json&include_appinfo=true&include_played_free_games=true`
        );

        if (!gamesResponse.data.response || !gamesResponse.data.response.games) {
            return res.json({ games: [] });
        }

        // Transformar los juegos y obtener logros para cada uno
        const games = await Promise.all(gamesResponse.data.response.games.map(async game => {
            let achievements = { total: 0, completed: 0 };
            let gameSchema = null;

            try {
                // Obtener el esquema del juego para saber el número total de logros
                const schemaResponse = await axios.get(
                    `http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${steamApiKey}&appid=${game.appid}`
                );
                if (schemaResponse.data.game && schemaResponse.data.game.availableGameStats && schemaResponse.data.game.availableGameStats.achievements) {
                    gameSchema = schemaResponse.data.game.availableGameStats.achievements;
                    achievements.total = gameSchema.length;
                }
            } catch (error) {
                // No todos los juegos tienen un esquema de logros público
                console.log(`No se pudo obtener el esquema de logros para ${game.name}`);
            }

            try {
                // Obtener los logros del jugador
                const achievementStats = await axios.get(
                    `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${game.appid}&key=${steamApiKey}&steamid=${user.steamId}`
                );

                if (achievementStats.data.playerstats && achievementStats.data.playerstats.success && achievementStats.data.playerstats.achievements) {
                    achievements.completed = achievementStats.data.playerstats.achievements.filter(a => a.achieved === 1).length;
                    // Si no obtuvimos el total del esquema, lo tomamos de los logros del jugador
                    if (achievements.total === 0) {
                        achievements.total = achievementStats.data.playerstats.achievements.length;
                    }
                }
                // Si success es false o no hay logros, no hacemos nada y completed se queda en 0.
            } catch (error) {
                // Si la API da un error (ej. perfil privado para este juego), lo registramos pero continuamos.
                // 'completed' se mantendrá en 0.
                console.log(`No se pudieron obtener los logros del jugador para ${game.name} (posiblemente perfil privado o no jugado)`);
            }

            return {
                appid: game.appid,
                name: game.name,
                playtime_forever: game.playtime_forever,
                // Usar una imagen de mejor calidad
                img_icon_url: game.img_icon_url,
                img_header: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
                achievements
            };
        }));

        // Ordenar alfabéticamente
        games.sort((a, b) => a.name.localeCompare(b.name));

        res.json({ games });
    } catch (error) {
        console.error('Error al obtener juegos de Steam:', error);
        res.status(500).json({ error: 'Error al obtener los juegos de Steam' });
    }
});

// Ruta para obtener los amigos del usuario
router.get('/friends', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.steamId) {
            return res.status(400).json({ error: 'Usuario no tiene una cuenta de Steam vinculada' });
        }

        const steamApiKey = process.env.STEAM_API_KEY;

        if (!steamApiKey) {
            console.error('STEAM_API_KEY no está configurada en las variables de entorno');
            return res.status(500).json({ error: 'Error de configuración del servidor' });
        }

        try {
            const friendsResponse = await axios.get(
                `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${steamApiKey}&steamid=${user.steamId}&relationship=friend`
            );

            // Si no hay lista de amigos o la estructura es diferente, devolver array vacío
            if (!friendsResponse.data || !friendsResponse.data.friendslist || !friendsResponse.data.friendslist.friends) {
                console.log('No se encontró lista de amigos o formato inesperado en la respuesta:', friendsResponse.data);
                return res.json({ friends: [] });
            }

            // Obtener detalles de cada amigo para conseguir sus nombres y avatares
            const friendIds = friendsResponse.data.friendslist.friends.map(friend => friend.steamid);

            if (friendIds.length === 0) {
                return res.json({ friends: [] });
            }

            const friendsDetailsResponse = await axios.get(
                `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${friendIds.join(',')}`
            );

            if (!friendsDetailsResponse.data.response || !friendsDetailsResponse.data.response.players) {
                console.log('Formato inesperado en detalles de jugadores:', friendsDetailsResponse.data);
                return res.json({ friends: [] });
            }

            const friends = friendsDetailsResponse.data.response.players.map(player => ({
                steamId: player.steamid,
                name: player.personaname || 'Usuario de Steam',
                avatar: player.avatarmedium || '',
                status: typeof player.personastate !== 'undefined' ? player.personastate : 0,
                lastOnline: player.lastlogoff || null,
                profileUrl: player.profileurl || `https://steamcommunity.com/profiles/${player.steamid}`
            }));

            res.json({ friends });
        } catch (steamApiError) {
            console.error('Error en la API de Steam:', steamApiError.message);
            // Si es un error específico de la API de Steam (cuenta privada, etc)
            if (steamApiError.response && steamApiError.response.status === 401) {
                return res.status(403).json({ error: 'La lista de amigos del perfil de Steam es privada' });
            }
            return res.status(502).json({ error: 'Error al comunicarse con la API de Steam' });
        }
    } catch (error) {
        console.error('Error al obtener amigos de Steam:', error);
        res.status(500).json({ error: 'Error al obtener la lista de amigos' });
    }
});

module.exports = router;