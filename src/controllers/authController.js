const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getConnection, sql } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'yourSuperSecretKey12345';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1m';

function getExpiryDate() {
    const now = new Date();
    return new Date(now.getTime() + 1 * 60 * 1000); // 1 دقیقه بعد
}

function generateToken(email, fullName) {
    return jwt.sign({ email, fullName }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// 🟢 ثبت‌نام
exports.register = async (req, res) => {
    try {
        const { FullName, Email, Password } = req.body;
        if (!FullName || !Email || !Password)
            return res.status(400).json({ message: 'تمام فیلدها الزامی هستند' });

        const pool = await getConnection();
        const check = await pool.request()
            .input('Email', sql.NVarChar(100), Email)
            .query('SELECT Email FROM Users WHERE Email=@Email');
        if (check.recordset.length > 0)
            return res.status(400).json({ message: 'ایمیل قبلاً ثبت شده است' });

        const hashed = await bcrypt.hash(Password, 10);
        const token = generateToken(Email, FullName);
        const issuedAt = new Date();
        const expiresAt = getExpiryDate(7);

        await pool.request()
            .input('FullName', sql.NVarChar(100), FullName)
            .input('Email', sql.NVarChar(100), Email)
            .input('Password', sql.NVarChar(255), hashed)
            .input('Jwt', sql.NVarChar(500), token)
            .input('JwtIssuedAt', sql.DateTime, issuedAt)
            .input('JwtExpiresAt', sql.DateTime, expiresAt)
            .query(`
        INSERT INTO Users (FullName, Email, Password, Jwt, JwtIssuedAt, JwtExpiresAt)
        VALUES (@FullName, @Email, @Password, @Jwt, @JwtIssuedAt, @JwtExpiresAt)
      `);

        res.status(201).json({
            message: '✅ ثبت‌نام با موفقیت انجام شد',
            user: { fullName: FullName, email: Email },
            token,
            issuedAt,
            expiresAt
        });
    } catch (err) {
        console.error('❌ register error:', err);
        res.status(500).json({ message: 'خطا در ثبت کاربر', error: err.message });
    }
};

// 🟢 ورود
exports.login = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        if (!Email || !Password)
            return res.status(400).json({ message: 'ایمیل و رمز عبور الزامی است' });

        const pool = await getConnection();
        const result = await pool.request()
            .input('Email', sql.NVarChar(100), Email)
            .query('SELECT * FROM Users WHERE Email=@Email');

        const user = result.recordset[0];
        if (!user) return res.status(401).json({ message: 'کاربر یافت نشد' });

        const valid = await bcrypt.compare(Password, user.Password);
        if (!valid) return res.status(401).json({ message: 'رمز عبور اشتباه است' });

        res.json({
            message: '✅ ورود موفق',
            user: user
        });
    } catch (err) {
        console.error('❌ login error:', err);
        res.status(500).json({ message: 'خطا در ورود', error: err.message });
    }
};
