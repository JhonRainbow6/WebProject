const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    let token = req.header('x-auth-token');
    if (!token && req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log('Token decodificado:', decoded);

        req.user = {
            id: decoded.id || decoded._id,
            _id: decoded._id || decoded.id,
            email: decoded.email
        };

        next();
    } catch (err) {
        console.error('Error de autenticación:', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};