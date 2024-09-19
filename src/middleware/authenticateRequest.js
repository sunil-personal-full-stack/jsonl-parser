const { verifyToken } = require('../helpers/Token');

const authenticateRequest = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = verifyToken(token);
            req.user = decoded; // Attach user info to request object
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token.' });
        }
    } else {
        res.status(401).json({ message: 'Authorization header missing or malformed.' });
    }
};  ``

module.exports = authenticateRequest;
