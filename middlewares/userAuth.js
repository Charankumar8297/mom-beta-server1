const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const authorization = req.headers.authorization || req.headers.Authorization;
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No or malformed token' });
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }

        req.userId = decoded.userId; // ✅ Set req.userId
        next();
    });
};

module.exports = userAuth;
