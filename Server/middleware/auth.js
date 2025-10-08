const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header or query parameter
    let token = req.header('x-auth-token');
    if (!token && req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        // Asegurarnos de que req.user tenga la estructura correcta
        req.user = {
            id: decoded.id || (decoded.user && decoded.user.id) || decoded._id,
            email: decoded.email || (decoded.user && decoded.user.email)
        };
        next();
    } catch (err) {
        console.error('Error de autenticación:', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
