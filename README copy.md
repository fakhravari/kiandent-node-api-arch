# Node.js Clean Architecture (Express + SQL Server + JWT + Swagger + FTP)

پروژهٔ API با Node.js/Express و SQL Server که با اصول معماری تمیز (لایه‌ای + Utility Singleton) پیاده‌سازی شده.  
ویژگی‌های مهم: احراز هویت JWT (انقضای پیش‌فرض ۱ دقیقه)، مستندسازی کامل با Swagger، کانفیگ متمرکز با ConfigUtil، و ابزارهای FTP برای مدیریت فایل‌ها.


در آدرس زیر قابل مشاهده است:  
[https://nodejs-clean-architecture.onrender.com/api-docs](https://nodejs-clean-architecture.onrender.com/api-docs)


## فهرست
- معماری و تکنولوژی‌ها
- ساختار پوشه‌ها
- نصب و اجرا
- پیکربندی .env
- مستندات Swagger
- احراز هویت (JWT)
- Endpointها
- پایگاه داده
- سرویس FTP
- استقرار
- اسکریپت‌ها
- عیب‌یابی
- مجوز

---

## معماری و تکنولوژی‌ها

- **Express.js** به‌عنوان فریم‌ورک HTTP  
- **SQL Server** با پکیج `mssql`  
- **JWT** برای Auth (انقضای پیش‌فرض: ۱ دقیقه)  
- **Swagger UI + swagger-jsdoc** برای مستندسازی  
- **ConfigUtil (Singleton)** برای تمرکز تنظیمات (JWT/DB/FTP/Timezone)  
- **basic-ftp** برای عملیات فایل روی سرور FTP  

---

## ساختار پوشه‌ها

```
src/
  config/
  controllers/
  middleware/
  routes/
  utils/
  docs/
app.js
db.sql
package.json
README.md
```

---

## نصب و اجرا

```bash
npm install
npm run dev
```

سپس Swagger در آدرس زیر قابل مشاهده است:  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## پیکربندی .env

```
PORT=3000
JWT_SECRET=yourSuperSecretKey12345
JWT_EXPIRES_IN=1m

DB_USER=kiandent_NodeJs
DB_PASS=q8E0*0es7
DB_SERVER=62.204.61.143\sqlserver2022
DB_NAME=kiandent_NodeJs
DB_ENCRYPT=false
DB_TRUST_CERT=true
DB_POOL_MAX=10
DB_POOL_MIN=0
DB_IDLE_TIMEOUT=30000

FTP_HOST=nodejs.kiandent.ir
FTP_USER=nodejs
FTP_PASS=4z*v8O9n4
FTP_SECURE=false
```

---

## Swagger

پروژه دارای Swagger کامل با مسیر `/api-docs` است و گزینه‌ی زیر برای بسته بودن تب‌ها تنظیم شده است:
```js
swaggerOptions: {
  docExpansion: 'none'
}
```

---

## احراز هویت (JWT)

- مسیر ثبت‌نام: `POST /auth/register`
- مسیر ورود: `POST /auth/login`
- انقضای توکن: ۱ دقیقه (قابل تنظیم از `.env`)
- ذخیره در دیتابیس: `Jwt`, `JwtIssuedAt`, `JwtExpiresAt`

---

## پایگاه داده

جداول اصلی:
- Users
- Customers
- Products
- Orders
- OrderDetails

کانفیگ اتصال در `src/config/db.js` با کمک `ConfigUtil` انجام می‌شود.

---

## سرویس FTP

در مسیر `src/utils/ftpService.js` تعریف شده و از ConfigUtil تنظیمات را می‌خواند.  
توابع:
- `uploadFile(localPath, remoteFileName)`  
- `downloadFile(remoteFileName, localPath)`  
- `deleteFile(remoteFileName)`  
- `listFiles(remoteDir)`

---

## استقرار

روی Render یا هر هاست Node.js قابل اجرا است.  
در تنظیم Swagger از `RENDER_EXTERNAL_HOSTNAME` برای ساخت URL داینامیک استفاده می‌شود.

---

## عیب‌یابی

- نصب نشدن dotenv → `npm install dotenv`
- خطای اتصال SQL → بررسی TCP/IP و پورت 1433
- JWT منقضی ولی پاسخ می‌دهد → بررسی `authMiddleware.protect`

---

## مجوز

MIT License © Mohammad Hussein Fakhravari
