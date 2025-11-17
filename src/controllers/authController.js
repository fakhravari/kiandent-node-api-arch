const bcrypt = require("bcryptjs");
const { getConnection, sql } = require("../config/db");
const configUtil = require("../config/configUtil");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
require("../utils/viewHelpers");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyAndGetExpireDate,
  verifyToken,
} = require("../utils/authHelpers");

exports.register = asyncHandler(async (req, res) => {
  const { FullName, Email, Password } = req.body;
  if (!FullName || !Email || !Password)
    throw new AppError(400, "VALIDATION_ERROR", "تمام فیلدها الزامی هستند");

  const pool = await getConnection();

  const check = await pool
    .request()
    .input("Email", sql.NVarChar(250), Email)
    .query("SELECT Email FROM Users WHERE Email=@Email");
  if (check.recordset.length > 0)
    throw new AppError(409, "EMAIL_EXISTS", "ایمیل قبلاً ثبت شده است");

  const jwtConfig = configUtil.getJwtConfig();
  const hashedPassword = await bcrypt.hash(Password, 10);
  const accessToken = generateAccessToken(Email, FullName);
  const refreshToken = generateRefreshToken();
  const tokenIssuedAt = jwtConfig.issuedAt.formatDateTimeSQL();
  const tokenExpiresAt = jwtConfig.expireDate.formatDateTimeSQL();

  const insertQuery = `
    INSERT INTO Users (FullName, Email, Password, Password2, Jwt, JwtIssuedAt, JwtExpiresAt, RefreshToken)
    VALUES (@FullName, @Email, @Password, @Password2, @Jwt, CAST(@JwtIssuedAt AS DATETIME), CAST(@JwtExpiresAt AS DATETIME), @RefreshToken);
  `;

  await pool
    .request()
    .input("FullName", sql.NVarChar(350), FullName)
    .input("Email", sql.NVarChar(250), Email)
    .input("Password", sql.NVarChar(255), hashedPassword)
    .input("Password2", sql.NVarChar(255), Password)
    .input("Jwt", sql.NVarChar(sql.MAX), accessToken)
    .input("RefreshToken", sql.NVarChar(sql.MAX), refreshToken)
    .input("JwtIssuedAt", sql.NVarChar(50), tokenIssuedAt)
    .input("JwtExpiresAt", sql.NVarChar(50), tokenExpiresAt)
    .query(insertQuery);



  const resultUser = await pool
    .request()
    .input("Email", sql.NVarChar(250), Email)
    .query(
      "SELECT *, CONVERT(NVARCHAR(50), JwtExpiresAt, 121) AS JwtExpiresAt, CONVERT(NVARCHAR(50), JwtIssuedAt, 121) AS JwtIssuedAt FROM Users WHERE Email=@Email"
    );

  const user = resultUser.recordset[0];

  res.status(201).json({
    success: true,
    message: "ثبت‌نام موفق",
    user: user
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password)
    throw new AppError(400, "VALIDATION_ERROR", "ایمیل و رمز عبور الزامی است");

  const pool = await getConnection();
  const result = await pool
    .request()
    .input("Email", sql.NVarChar(250), Email)
    .query(
      "SELECT *, CONVERT(NVARCHAR(50), JwtExpiresAt, 121) AS JwtExpiresAt, CONVERT(NVARCHAR(50), JwtIssuedAt, 121) AS JwtIssuedAt FROM Users WHERE Email=@Email"
    );

  const user = result.recordset[0];
  if (!user)
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "کاربر یا رمز عبور اشتباه است"
    );

  const isPasswordValid = await bcrypt.compare(Password, user.Password);
  if (!isPasswordValid)
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "کاربر یا رمز عبور اشتباه است"
    );

  const tokenVerification = verifyAndGetExpireDate(
    user.Jwt,
    Email,
    user.JwtExpiresAt
  );
  if (!tokenVerification.valid) {
    throw new AppError(401, "INVALID_CREDENTIALS", "توکن مشکل دارد");
  }

  res.json({
    success: true,
    message: "ورود موفق",
    user: user,
  });
});

exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    throw new AppError(400, "VALIDATION_ERROR", "refreshToken is required");

  const pool = await getConnection();
  const result = await pool
    .request()
    .input("RefreshToken", sql.NVarChar(sql.MAX), refreshToken)
    .query(
      "SELECT *, CONVERT(NVARCHAR(50), JwtExpiresAt, 121) AS JwtExpiresAt, CONVERT(NVARCHAR(50), JwtIssuedAt, 121) AS JwtIssuedAt FROM Users WHERE RefreshToken=@RefreshToken"
    );

  const user = result.recordset[0];
  if (!user)
    throw new AppError(401, "INVALID_REFRESH", "Refresh token not found");

  const tokenVerification = verifyToken(user.Jwt, user.Email);
  if (!tokenVerification.valid) {
    throw new AppError(401, "INVALID_REFRESH", "Token not valid");
  }

  const jwtConfig = configUtil.getJwtConfig();
  const newAccessToken = generateAccessToken(user.Email, user.FullName);
  const newRefreshToken = generateRefreshToken();
  const newTokenIssuedAt = jwtConfig.issuedAt.formatDateTimeSQL();
  const newTokenExpiresAt = jwtConfig.expireDate.formatDateTimeSQL();

  const updateQuery = `
    UPDATE Users 
    SET Jwt=@NewAccessToken, RefreshToken=@NewRefreshToken, 
        JwtExpiresAt=CAST(@JwtExpiresAt AS DATETIME), 
        JwtIssuedAt=CAST(@JwtIssuedAt AS DATETIME) 
    WHERE Email=@Email AND RefreshToken=@OldRefreshToken
  `;

  const updateResult = await pool
    .request()
    .input("Email", sql.NVarChar(250), user.Email)
    .input("OldRefreshToken", sql.NVarChar(sql.MAX), refreshToken)
    .input("NewAccessToken", sql.NVarChar(sql.MAX), newAccessToken)
    .input("NewRefreshToken", sql.NVarChar(sql.MAX), newRefreshToken)
    .input("JwtExpiresAt", sql.NVarChar(50), newTokenExpiresAt)
    .input("JwtIssuedAt", sql.NVarChar(50), newTokenIssuedAt)
    .query(updateQuery);

  if (updateResult.rowsAffected[0] === 0) {
    throw new AppError(404, "UPDATE_FAILED", "Could not update refresh token");
  }

  res.json({
    success: true,
    newAccessToken,
    newRefreshToken,
    expireDate: newTokenExpiresAt,
    issuedAt: newTokenIssuedAt,
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    throw new AppError(400, "VALIDATION_ERROR", "refreshToken is required");

  const pool = await getConnection();
  const findResult = await pool
    .request()
    .input("RefreshToken", sql.NVarChar(sql.MAX), refreshToken)
    .query("SELECT Id FROM Users WHERE RefreshToken = @RefreshToken");

  if (findResult.recordset.length === 0) {
    throw new AppError(404, "TOKEN_NOT_FOUND", "Refresh token not found");
  }

  const updateQuery =
    "UPDATE Users SET RefreshToken = '-', Jwt = '-' WHERE RefreshToken = @RefreshToken";
  const updateResult = await pool
    .request()
    .input("RefreshToken", sql.NVarChar(sql.MAX), refreshToken)
    .query(updateQuery);

  if (updateResult.rowsAffected[0] === 0) {
    throw new AppError(500, "LOGOUT_FAILED", "Could not revoke refresh token");
  }

  res.json({ success: true, message: "Logged out" });
});
