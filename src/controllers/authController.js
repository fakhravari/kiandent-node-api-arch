const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getConnection, sql } = require('../config/db');
const configUtil = require('../config/configUtil');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { generateAccessToken, generateRefreshToken, getRefreshExpiryDays } = require('../utils/authHelpers');

exports.register = asyncHandler(async (req, res) => {
    const { FullName, Email, Password } = req.body;
    if (!FullName || !Email || !Password) throw new AppError(400, 'VALIDATION_ERROR', 'تمام فیلدها الزامی هستند');

    const pool = await getConnection();

    const check = await pool.request()
        .input('Email', sql.NVarChar(100), Email)
        .query('SELECT Email FROM Users WHERE Email=@Email');
    if (check.recordset.length > 0) throw new AppError(409, 'EMAIL_EXISTS', 'ایمیل قبلاً ثبت شده است');

    const jwtConfig = configUtil.getJwtConfig();

    const hashed = await bcrypt.hash(Password, 10);
    const accessToken = generateAccessToken(Email, FullName);
    const refreshToken = generateRefreshToken();
    const expireDate = jwtConfig.expireDate
    const issuedAt = configUtil.now;
    const tsql = `
    INSERT INTO Users (FullName, Email, Password, Jwt, JwtIssuedAt, JwtExpiresAt, RefreshToken)
    VALUES (@FullName, @Email, @Password, @Jwt, @JwtIssuedAt, @JwtExpiresAt, @RefreshToken);
`;

    await pool.request()
        .input('FullName', sql.NVarChar(100), FullName)
        .input('Email', sql.NVarChar(100), Email)
        .input('Password', sql.NVarChar(255), hashed)
        .input('Jwt', sql.NVarChar(500), accessToken)
        .input('JwtIssuedAt', sql.DateTime, issuedAt)
        .input('JwtExpiresAt', sql.DateTime, expireDate)
        .input('RefreshToken', sql.NVarChar(200), refreshToken)
        .query(tsql);

    res.status(201).json({
        success: true,
        message: 'ثبت‌نام موفق',
        user: { fullName: FullName, email: Email },
        accessToken,
        refreshToken,
        issuedAt: issuedAt.toISOString().replace('T', ' ').split('.')[0],
        expiresAt: expireDate.toISOString().replace('T', ' ').split('.')[0]
    });
});

exports.login = asyncHandler(async (req, res) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) throw new AppError(400, 'VALIDATION_ERROR', 'ایمیل و رمز عبور الزامی است');

    const pool = await getConnection();
    const result = await pool.request()
        .input('Email', sql.NVarChar(100), Email)
        .query('SELECT * FROM Users WHERE Email=@Email');

    const user = result.recordset[0];
    if (!user) throw new AppError(401, 'INVALID_CREDENTIALS', 'کاربر یا رمز عبور اشتباه است');

    const valid = await bcrypt.compare(Password, user.Password);
    if (!valid) throw new AppError(401, 'INVALID_CREDENTIALS', 'کاربر یا رمز عبور اشتباه است');

    res.json({
        success: true, message: 'ورود موفق', user: { id: user.UserID, email: user.Email, fullName: user.FullName },
        accessToken, refreshToken, issuedAt, expiresAt: expireDate
    });
});

exports.refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError(400, 'VALIDATION_ERROR', 'refreshToken is required');

    const pool = await getConnection();
    const result = await pool.request()
        .input('RefreshToken', sql.NVarChar(200), refreshToken)
        .query('SELECT * FROM Users WHERE RefreshToken=@RefreshToken');

    const user = result.recordset[0];
    if (!user) throw new AppError(401, 'INVALID_REFRESH', 'Refresh token not found');

    const now = new Date();
    if (!user.JwtExpiresAt || new Date(user.JwtExpiresAt) < now) {
        throw new AppError(401, 'REFRESH_EXPIRED', 'Refresh token expired');
    }

    const accessToken = generateAccessToken(user.Email, user.FullName);
    const newRefreshToken = generateRefreshToken();
    const refreshExpiry = new Date(now.getTime() + getRefreshExpiryDays() * 24 * 60 * 60 * 1000);

    try {
        await pool.request()
            .input('Email', sql.NVarChar(100), user.Email)
            .input('RefreshToken', sql.NVarChar(200), newRefreshToken)
            .input('JwtExpiresAt', sql.DateTime, refreshExpiry)
            .query(`UPDATE Users SET RefreshToken=@RefreshToken, JwtExpiresAt=@JwtExpiresAt WHERE Email=@Email`);
    } catch (e) {
        console.error('Could not rotate refresh token in DB:', e.message || e);
    }

    res.json({ success: true, accessToken, refreshToken: newRefreshToken, expiresAt: refreshExpiry });
});

exports.logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError(400, 'VALIDATION_ERROR', 'refreshToken is required');

    const pool = await getConnection();
    try {
        await pool.request()
            .input('RefreshToken', sql.NVarChar(200), refreshToken)
            .query(`UPDATE Users SET RefreshToken=NULL WHERE RefreshToken=@RefreshToken`);
    } catch (e) {
        console.error('Could not revoke refresh token in DB:', e.message || e);
    }

    res.json({ success: true, message: 'Logged out' });
});
