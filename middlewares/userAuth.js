const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const authorization = req.headers['authorization'];
    console.log("Incoming token:", authorization);

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No or bad token format' });
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT Error:", err);
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.userId = decoded.userId;
        next();
    });
};


module.exports = userAuth;