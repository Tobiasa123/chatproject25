const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY; 

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};