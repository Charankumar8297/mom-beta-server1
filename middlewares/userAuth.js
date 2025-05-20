const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const authorization = req.headers['authorization'] || req.headers['Authorization'];

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided or malformed' });
    }

    const token = authorization.split(' ')[1];

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables!');
        return res.status(500).json({ message: 'Server misconfiguration: JWT secret is missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err.message);
            return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
        }

        if (!decoded.userId) {
            console.error(' Token payload missing userId:', decoded);
            return res.status(403).json({ message: 'Forbidden: Token payload invalid' });
        }

        req.userId = decoded.userId;
        next();
    });
};

module.exports = userAuth;