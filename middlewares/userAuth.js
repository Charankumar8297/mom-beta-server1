const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    const authorization = req.headers['Authorization'] || req.headers['authorization']; 
    console.log(authorization) // Extract the token from the Authorization header
    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.userId = decoded.userId;
        next();
    });
}

module.exports = userAuth;