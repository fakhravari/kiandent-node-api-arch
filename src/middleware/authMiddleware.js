const jwt = require('jsonwebtoken');
const { getConnection, sql } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

exports.protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer '))
            return res.status(401).json({ message: 'توکن ارسال نشده است' });

        const token = authHeader.split(' ')[1];

        // 🧠 بررسی رمزنگاری و انقضای JWT
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET); // اگر منقضی شده باشد، خطا می‌دهد
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                console.log('⏰ JWT درونی منقضی شده');
                return res.status(401).json({ message: '⏰ توکن منقضی شده است' });
            }
            return res.status(401).json({ message: 'توکن نامعتبر است' });
        }

        // 🧩 بررسی وضعیت در دیتابیس (زمان انقضا و تطابق)
        const pool = await getConnection();
        const result = await pool.request()
            .input('Email', sql.NVarChar(100), decoded.email)
            .query('SELECT Jwt, JwtExpiresAt FROM Users WHERE Email=@Email');

        const user = result.recordset[0];
        if (!user)
            return res.status(401).json({ message: 'کاربر یافت نشد' });

        const now = new Date();

        // چک ۱️⃣: اگر توکن ذخیره‌شده در DB با ارسال‌شده فرق دارد
        if (user.Jwt !== token) {
            console.log('❌ توکن با دیتابیس فرق دارد');
            return res.status(401).json({ message: 'توکن ناهماهنگ است (احتمال logout یا login جدید)' });
        }

        // چک ۲️⃣: اگر زمان انقضای DB گذشته است
        if (new Date(user.JwtExpiresAt) < now) {
            console.log('⏰ توکن در DB منقضی شده');
            return res.status(401).json({ message: '⏰ توکن در دیتابیس منقضی شده است' });
        }

        // ✅ همه چیز اوکی است
        req.user = decoded;
        next();

    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).json({ message: 'خطای داخلی در بررسی توکن' });
    }
};
