# Node.js Clean Architecture (Express + SQL Server + JWT + Swagger + FTP)

این مخزن یک پروژهٔ نمونهٔ API بر پایهٔ Node.js و Express است که با الگوی لایه‌ای (Clean Architecture سبک) پیاده‌سازی شده و هدف آن ارائهٔ یک اسکلت قابل فهم و قابل توسعه برای ساخت سرویس‌های RESTful می‌باشد.

در این README همهٔ مراحل از صفر تا صد (نصب، پیکربندی، اجرا، تست و نکات تولید) آمده است.

---

## فهرست محتوا
- معرفی
- ملزومات
- نصب و راه‌اندازی محلی
- پیکربندی (.env)
- اجرای برنامه
- مستندات API (Swagger)
- ساختار پروژه
- نکات امنیتی و عملیاتی
- تست‌ها
- پیشنهادات جهت بهبود و توسعه
- مشارکت و لایسنس

---

## معرفی

پروژه شامل موارد زیر است:
- احراز هویت JWT (ذخیره توکن در دیتابیس)
- مستندسازی OpenAPI/Swagger
- ارتباط با SQL Server با استفاده از `mssql`
- آپلود/دانلود فایل‌ها با FTP (`basic-ftp`) و مدیریت آپلود با `multer`
- مدیریت خطاها با کلاس `AppError` و middleware مرکزی
- اعتبارسنجی ورودی‌ها با `express-validator`

## ملزومات
- Node.js (نسخهٔ LTS توصیه می‌شود)
- npm
- دسترسی به SQL Server (یا راه‌اندازی محلی برای توسعه)

---

## نصب و راه‌اندازی (Local)

1. کلون کردن مخزن

```powershell
git clone <YOUR_REPO_URL>
cd NodeJs_Clean_Architecture
```

2. نصب وابستگی‌ها

```powershell
npm install
```

3. پیکربندی محیط

یک فایل `.env` در ریشهٔ پروژه ایجاد کنید (یا از `.env.example` استفاده کنید). مثال پایین را با مقادیر خود جایگزین کنید.

```ini
PORT=3000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1m

# DATABASE (placeholders)
DB_USER=your_db_user
DB_PASS=your_db_password
DB_SERVER=your_db_server
DB_NAME=your_db_name

# FTP (placeholders)
FTP_HOST=your_ftp_host
FTP_USER=your_ftp_user
FTP_PASS=your_ftp_password
FTP_SECURE=false
```

توجه: مقادیر حساس را در مخزن عمومی قرار ندهید. از `.env` محلی استفاده کنید و آن را در `.gitignore` نگه دارید.

4. (اختیاری) آماده‌سازی دیتابیس

یک فایل `db.sql` در ریشه وجود دارد که اسکیمای جدول‌ها را شامل می‌شود. آن را در SQL Server خود اجرا کنید یا از ابزار دلخواه برای ایجاد جداول استفاده کنید.

---

## اجرای برنامه

حالت توسعه (با nodemon):

```powershell
npm run dev
```

حالت تولید:

```powershell
npm start
```

پس از اجرا، اپ روی پورتی که در `.env` مشخص شده (پیش‌فرض 3000) اجرا می‌شود.

---

## مستندات API (Swagger)

مستندات خودکار OpenAPI در مسیر زیر در دسترس است:

```
http://localhost:3000/api-docs
```

و همچنین در نسخهٔ آنلاین پروژه (اگر استقرار انجام شده باشد) در آدرس:

https://nodejs-clean-architecture.onrender.com/api-docs

---

## ساختار پروژه

```
src/
  config/        # ConfigUtil و اتصال به DB
  controllers/   # هندلرهای route (استفاده از asyncHandler + AppError)
  services/      # منطق تجاری و کوئری‌ها
  models/        # متادیتا جداول
  routes/        # تعریف routeها و مستندسازی swagger
  middleware/    # auth, validate, error handler
  utils/         # AppError, asyncHandler و ابزارهای کمکی
  docs/          # پیکربندی swagger
uploads/         # فایل‌های موقت آپلود
```

---

## نکات امنیتی و عملیاتی

- هرگز مقادیر حساس (مثل `JWT_SECRET`, رمز دیتابیس, رمز FTP) را در مخزن عمومی ذخیره نکنید.
- از HTTPS در محیط تولید استفاده کنید.
- محدودیت نرخ (rate limiting) و هدرهای امنیتی (مثل Helmet) برای تولید پیشنهاد می‌شود.
- لاگینگ ساختاریافته (با `winston` یا `pino`) توصیه می‌شود.

---

## مدیریت خطا و اعتبارسنجی

- این پروژه از `AppError` برای خطاهای عملیاتی استفاده می‌کند و یک middleware مرکزی خطا را نگاشت و لاگ می‌کند.
- ورودی‌ها با `express-validator` بررسی شده و middleware `validate` خطاها را به صورت زیر به کلاینت بازمی‌گرداند:

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Valid Email is required"],
      "password": ["Password must be at least 6 characters"]
    }
  }
}
```

`details` یک دیکشنری است که کلیدها نام فیلدها (نرمالایز شده به lowercase) و مقادیر آرایه‌ای از پیام‌ها هستند.

---

## تست‌ها

- در حال حاضر تست‌های اتوماتیک اضافه نشده‌اند. پیشنهاد می‌شود برای سرویس‌های مهم از `jest` و برای endpointها از `supertest` استفاده کنید.

---

## پیشنهادات برای بهبود

- اضافه کردن لاگر ساختاریافته (`winston`/`pino`) و ارسال لاگ‌ها به یک سرویس متمرکز
- اضافه کردن تست‌های واحد و integración
- پیاده‌سازی refresh token و سیاست نفی توکن برای افزایش امنیت JWT
- اضافه کردن CI (GitHub Actions) برای اجرای lint و تست‌ها

---

## مشارکت

خوشحال می‌شویم PR یا issue دریافت کنیم. برای تغییرات بزرگ ابتدا یک issue باز کنید و ایده را توضیح دهید.

## لایسنس

MIT © Mohammad Hussein Fakhravari

---

فایل مستندات Swagger برای این پروژه در این آدرس قابل مشاهده است:

https://nodejs-clean-architecture.onrender.com/api-docs
