# NodeJs Clean Architecture API

یک API نمونه برای مدیریت مشتریان، محصولات و سفارش‌ها با Node.js، Express و SQL Server که بر پایه معماری لایه‌ای (Clean/Layered Architecture) طراحی شده است. این مخزن یک الگوی آماده برای سازمان‌دهی کنترلرها، سرویس‌ها، مسیرها، اعتبارسنجی، مدیریت خطا و مستندسازی Swagger ارائه می‌دهد تا بتوانید به‌سرعت یک سرویس قابل نگه‌داری و تست‌پذیر بسازید.

---

## فهرست مطالب
1. [معرفی کوتاه](#معرفی-کوتاه)
2. [ویژگی‌های کلیدی](#ویژگیهای-کلیدی)
3. [ساختار پوشه‌ها](#ساختار-پوشهها)
4. [پیش‌نیازها](#پیشنیازها)
5. [نصب و اجرا](#نصب-و-اجرا)
6. [پیکربندی محیطی](#پیکربندی-محیطی)
7. [مستندات و مسیرهای API](#مستندات-و-مسیرهای-api)
8. [اعتبارسنجی و مدیریت خطا](#اعتبارسنجی-و-مدیریت-خطا)
9. [پایگاه‌داده و تراکنش‌ها](#پایگاهداده-و-تراکنشها)
10. [لاگ و اشکال‌زدایی](#لاگ-و-اشکالزدایی)
11. [مشارکت](#مشارکت)
12. [مجوز](#مجوز)

---

## معرفی کوتاه
این پروژه با هدف نمایش یک پیاده‌سازی تمیز از API لایه‌ای ساخته شده است. جریان اصلی درخواست‌ها از **Routes → Controllers → Services → Data Access** دنبال می‌شود و در هر لایه مسئولیت‌ها به‌صورت مجزا تعریف شده است. مستندات OpenAPI به‌صورت خودکار در `/api-docs` در دسترس است و یک نمونه پایگاه‌داده همراه پروژه ارائه می‌شود.

## ویژگی‌های کلیدی
- معماری لایه‌ای با جداسازی مسئولیت‌ها (Controller، Service، Middleware، Data Access)
- اتصال به **SQL Server** با کتابخانه `mssql` و پشتیبانی از Stored Procedure و View
- مستندسازی خودکار Swagger و ارائه UI در مسیر `/api-docs`
- احراز هویت مبتنی بر **JWT** و مدیریت خطا با الگوی `AppError`
- اعتبارسنجی ورودی با `express-validator` و میدل‌وِر `validate`
- آپلود فایل با `multer` و امکان ارسال به سرور FTP با `basic-ftp`
- پاسخ‌های یکنواخت (success/error) برای ساده‌سازی مصرف در کلاینت‌ها

## ساختار پوشه‌ها
```text
src/
├─ app.js             # نقطه ورود برنامه و ثبت میدل‌ورها/مسیرها
├─ config/            # پیکربندی برنامه و اتصال دیتابیس (configUtil.js, db.js)
├─ controllers/       # کنترلرهای Express (واسط ورودی به سرویس‌ها)
├─ services/          # منطق تجاری و فراخوانی‌های DB با mssql
├─ models/            # تعریف نام جداول و مدل‌های ساده
├─ middleware/        # auth, validate, error handler و سایر میدل‌ورها
├─ routes/            # مسیربندی و اتصال اعتبارسنجی/کنترلر به سرویس‌ها
├─ utils/             # ابزارهای مشترک مانند AppError, asyncHandler, viewHelpers
└─ docs/              # پیکربندی Swagger/OpenAPI
```
سایر فایل‌ها:
- `db.sql` اسکریپت نمونه ایجاد جداول و داده‌ها
- `package.json` اسکریپت‌ها و وابستگی‌ها
- `.env` (ایجاد توسط شما) برای تنظیمات محیطی

## پیش‌نیازها
- Node.js 16 یا بالاتر
- دسترسی به یک **SQL Server** (محلی یا Docker)
- npm (یا yarn)

## نصب و اجرا
1. مخزن را کلون کنید و وارد پوشه شوید:
   ```bash
   git clone <repo-url>
   cd NodeJs_Clean_Architecture
   ```
2. وابستگی‌ها را نصب کنید:
   ```bash
   npm install
   ```
3. فایل `.env` را مطابق بخش پیکربندی بسازید.
4. سرور توسعه را اجرا کنید:
   ```bash
   npm run dev
   ```
   برنامه به‌صورت پیش‌فرض روی پورتی که در `.env` مشخص می‌کنید (یا 3000) اجرا می‌شود.

> **نکته**: برای اجرا در محیط تولید می‌توانید از `npm start` استفاده کنید یا سرور را پشت یک فرآیند‌منیجر مانند `pm2` قرار دهید.

## پیکربندی محیطی
نمونه فایل `.env`:
```text
# Server
PORT=3000

# JWT
JWT_SECRET=yourSuperSecretKey12345
JWT_EXPIRES_IN=60

# Database SQL Server
DB_USER=sa
DB_PASS=YourStrong!Passw0rd
DB_SERVER=localhost
DB_NAME=MyDatabase
DB_ENCRYPT=false
DB_TRUST_CERT=true
DB_POOL_MAX=10

# FTP (اختیاری)
FTP_HOST=ftp.example.com
FTP_USER=ftpuser
FTP_PASS=ftppass
FTP_SECURE=false
```
مقادیر را متناسب با محیط خود جایگزین کنید. اگر از Docker استفاده می‌کنید، مقدار `DB_SERVER` را به نام سرویس یا IP کانتینر تغییر دهید.

## مستندات و مسیرهای API
- **Swagger UI**: پس از اجرا در `http://localhost:<PORT>/api-docs`
- مسیرهای نمونه (CRUD و احراز هویت):
  - `POST /auth/register` و `POST /auth/login`
  - `GET /customers` ، `POST /customers` ، `PUT /customers/:id` ، `DELETE /customers/:id`
  - `GET /products` ، `POST /products` ، `PUT /products/:id` ، `DELETE /products/:id`
  - `GET /orders` ، `POST /orders` و جزئیات سفارش‌ها

جریان لایه‌ها:
```
Routes → Controllers → Middleware (auth/validate/error) → Services → Data Access (mssql) → SQL Server
```

## اعتبارسنجی و مدیریت خطا
- قواعد ولیدیشن در لایه **Routes** با `express-validator` تعریف می‌شوند.
- میدل‌وِر `validate` خطاهای ورودی را به ساختاری شفاف در فیلد `details` تبدیل می‌کند.
- خطاهای عملیاتی با کلاس `AppError` پرتاب می‌شوند و میدل‌وِر مرکزی، پاسخ استاندارد خطا (کد HTTP، پیام انسانی، error code) را برمی‌گرداند.
- پاسخ موفق نمونه:
  ```json
  { "success": true, "data": { ... }, "message": "..." }
  ```
- پاسخ خطا نمونه:
  ```json
  {
    "success": false,
    "error": {
      "statusCode": 400,
      "code": "VALIDATION_ERROR",
      "message": "Validation failed",
      "details": { "email": ["Valid Email is required"] }
    }
  }
  ```

## پایگاه‌داده و تراکنش‌ها
- الگوی ارتباط با دیتابیس از `mssql` استفاده می‌کند و اتصال در `src/config/db.js` مدیریت می‌شود.
- متدهای سرویس نمونه شامل CRUD، گزارش‌ها، خلاصه سفارش و فراخوانی Stored Procedure / View هستند.
- برای ایجاد جداول و دادهٔ نمونه به `db.sql` مراجعه کنید؛ این فایل شامل ساخت Users، Customers، Products، Orders و OrderDetails است.

## لاگ و اشکال‌زدایی
- خطاهای غیرمنتظره با یک `errorId` یکتا لاگ می‌شوند تا در محیط تولید قابل ردیابی باشند.
- می‌توانید یک لاگر ساختاریافته مانند **pino** یا **winston** اضافه کنید و لاگ‌ها را به یک سامانه متمرکز ارسال کنید.

## مشارکت
1. یک Issue برای توضیح تغییر پیشنهادی باز کنید.
2. شاخه جدید بسازید و تغییرات خود را اعمال کنید.
3. Pull Request ایجاد کنید و توضیح مختصر درباره هدف، تغییرات اصلی و نحوه تست اضافه کنید.

## مجوز
این پروژه تحت مجوز MIT منتشر شده است. نام صاحب امتیاز: **Mohammad Hussein Fakhravari**.
