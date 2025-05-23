const jwt = require('jsonwebtoken');

const deliveryBoyAuth = (req, res, next) => {
    const authorization = req.headers['authorization'] || req.headers['Authorization'];
    if (!authorization) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.deliveryBoyId = decoded.deliveryBoyId;
        next();
    });
};

module.exports = deliveryBoyAuth;