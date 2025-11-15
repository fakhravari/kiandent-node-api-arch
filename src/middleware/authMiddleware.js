const jwt = require('jsonwebtoken');
const { getConnection, sql } = require('../config/db');
const configUtil = require('../config/configUtil');

exports.protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer '))
            return res.status(401).json({ message: 'توکن ارسال نشده است' });

        const token = authHeader.split(' ')[1];

        // 🧩 بررسی صحت و انقضای JWT
        let decoded;
        try {
            const { secret } = configUtil.getJwtConfig();
            decoded = jwt.verify(token, secret);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                console.log('⏰ JWT داخلی منقضی شده');
                return res.status(401).json({ message: '⏰ توکن منقضی شده است' });
            }
            console.log('❌ JWT نامعتبر');
            return res.status(401).json({ message: 'توکن نامعتبر است' });
        }

        // 🧠 بررسی توکن در دیتابیس
        const pool = await getConnection();
        const result = await pool.request()
            .input('Email', sql.NVarChar(100), decoded.email)
            .query('SELECT Jwt, JwtExpiresAt FROM Users WHERE Email=@Email');

        const user = result.recordset[0];
        if (!user)
            return res.status(401).json({ message: 'کاربر یافت نشد' });

        // زمان فعلی به ساعت ایران (میلادی)
        const now = configUtil.nowTehran();

        // چک ۱️⃣: ناهماهنگی بین توکن درخواست و دیتابیس
        if (user.Jwt !== token) {
            console.log('❌ توکن با دیتابیس فرق دارد (احتمال login جدید)');
            return res.status(401).json({ message: 'توکن ناهماهنگ است (احتمال logout یا login جدید)' });
        }

        // چک ۲️⃣: زمان انقضای دیتابیس
        if (new Date(user.JwtExpiresAt) < now) {
            console.log('⏰ توکن در دیتابیس منقضی شده');
            return res.status(401).json({ message: '⏰ توکن منقضی شده است' });
        }

        // ✅ موفقیت
        req.user = decoded;
        next();

    } catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).json({ message: 'خطای داخلی در بررسی توکن', error: err.message });
    }
};
