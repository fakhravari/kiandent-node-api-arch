require('dotenv').config();

class ConfigUtil {
    static _instance = null;

    constructor() {
        if (ConfigUtil._instance) return ConfigUtil._instance;

        // --- API Config ---
        this.PORT = this._num(process.env.PORT, 3000);

        // --- JWT Config ---
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.JWT_EXPIRES_IN = this._num(process.env.JWT_EXPIRES_IN, 30); // minutes

        // --- Database Config ---
        this.dbConfig = {
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            server: process.env.DB_SERVER,
            database: process.env.DB_NAME,
            options: {
                encrypt: this._bool(process.env.DB_ENCRYPT),
                trustServerCertificate: this._bool(process.env.DB_TRUST_CERT),
            },
            pool: {
                max: this._num(process.env.DB_POOL_MAX, 10),
                min: this._num(process.env.DB_POOL_MIN, 1),
                idleTimeoutMillis: this._num(process.env.DB_IDLE_TIMEOUT, 30000),
            },
        };

        // --- FTP Config ---
        this.ftpConfig = {
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: this._bool(process.env.FTP_SECURE),
        };

        this.now = new Date();

        ConfigUtil._instance = this;
    }

    // -------------------------
    //      Utilities
    // -------------------------

    _bool(value) {
        return String(value).toLowerCase() === "true";
    }

    _num(value, def = 0) {
        const n = Number(value);
        return isNaN(n) ? def : n;
    }

    // -------------------------
    //      Config Methods
    // -------------------------

    getJwtConfig() {
        const expiresInMinutes = this.JWT_EXPIRES_IN;
        const expireDate = new Date(this.now.getTime() + expiresInMinutes * 60 * 1000);

        return {
            secret: this.JWT_SECRET,
            expiresIn: expiresInMinutes,
            expireDate: expireDate,
        };
    }

    getDbConfig() {
        return this.dbConfig;
    }

    getFtpConfig() {
        return this.ftpConfig;
    }

    static getInstance() {
        if (!ConfigUtil._instance) new ConfigUtil();
        return ConfigUtil._instance;
    }
}

module.exports = ConfigUtil.getInstance();