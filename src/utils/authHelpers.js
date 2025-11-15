const jwt = require('jsonwebtoken');
const configUtil = require('../config/configUtil');
const { v4: uuidv4 } = require('uuid');

function generateAccessToken(email, fullName) {
    const { secret, expiresIn } = configUtil.getJwtConfig();
    return jwt.sign({ email, fullName }, secret, { expiresIn });
}

function generateRefreshToken() {
    return uuidv4();
}

function getRefreshExpiryDays() {
    return parseInt(process.env.REFRESH_EXPIRES_DAYS || '30', 10);
}

module.exports = { generateAccessToken, generateRefreshToken, getRefreshExpiryDays };
