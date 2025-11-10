const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

exports.protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer '))
            return res.status(401).json({ message: 'توکن یافت نشد یا نامعتبر است' });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'توکن نامعتبر یا منقضی شده است' });
    }
};
