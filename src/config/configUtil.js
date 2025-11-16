require("dotenv").config();

class ConfigUtil {
  static _instance = null;

  constructor() {
    if (ConfigUtil._instance) return ConfigUtil._instance;

    // --- API Config ---
    this.PORT = Number(process.env.PORT);

    // --- JWT Config ---
    this.JWT_SECRET = process.env.JWT_SECRET;
    this.JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN); // minutes

    // --- Database Config ---
    this.dbConfig = {
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      options: {
        encrypt: this._toBool(process.env.DB_ENCRYPT),
        trustServerCertificate: this._toBool(process.env.DB_TRUST_CERT),
      },
      pool: {
        max: Number(process.env.DB_POOL_MAX),
        min: Number(process.env.DB_POOL_MIN),
        idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT),
      },
    };

    // --- FTP Config ---
    this.ftpConfig = {
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      secure: this._toBool(process.env.FTP_SECURE),
    };

    ConfigUtil._instance = this;
  }

  // -------------------------
  //          Utils
  // -------------------------

  _toBool(value) {
    return String(value).toLowerCase() === "true";
  }

  // -------------------------
  //      Config Getters
  // -------------------------

  getJwtConfig() {
    const issuedAt = new Date();

    const expireDate = new Date(
      issuedAt.getTime() + this.JWT_EXPIRES_IN * 60 * 1000
    );

    return {
      secret: this.JWT_SECRET,
      expiresIn: this.JWT_EXPIRES_IN,
      issuedAt,
      expireDate,
    };
  }

  getDbConfig() {
    return this.dbConfig;
  }

  getFtpConfig() {
    return this.ftpConfig;
  }

  // -------------------------
  //        Singleton
  // -------------------------

  static getInstance() {
    return this._instance || new ConfigUtil();
  }
}

module.exports = ConfigUtil.getInstance();
