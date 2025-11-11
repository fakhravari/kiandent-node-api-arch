# Node.js Clean Architecture (Express + SQL Server + JWT + Swagger + FTP)

این مخزن یک نمونهٔ پروژهٔ API بر پایهٔ Node.js و Express است که از الگوی معماری تمیز (لایه‌ای) پیروی می‌کند. پروژه شامل اتصال به SQL Server، احراز هویت با JWT، مستندسازی با Swagger و امکانات آپلود/دانلود فایل از طریق FTP می‌باشد.

## هدف
- فراهم کردن یک اسکلت مبتنی بر بهترین شیوه‌ها برای ساخت API در Node.js
- نشان دادن الگوهای لایه‌بندی (controllers → services → models) و مدیریت خطاها

## ویژگی‌ها
- ساختار لایه‌ای و تمیز
- مدیریت کانفیگ متمرکز (`ConfigUtil`)
- احراز هویت JWT
- مستندسازی خودکار OpenAPI + Swagger UI (`/api-docs`)
- اعتبارسنجی ورودی با `express-validator`
- مدیریت خطاها با `AppError` و middleware مرکزی

## شروع سریع

1. کلون کردن مخزن

```powershell
git clone <repo-url>
cd NodeJs_Clean_Architecture
```

2. نصب وابستگی‌ها

```powershell
npm install
```

3. پیکربندی محیط
- یک فایل `.env` در ریشه بسازید یا از `.env.example` استفاده کنید. مقادیر حساس (کلید JWT، رمز DB، رمز FTP) را در این فایل قرار دهید و آن را در Git نگهداری نکنید.

نمونهٔ متغیرهای محیطی (.env):

```
PORT=3000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1m

# DATABASE
DB_USER=your_db_user
DB_PASS=your_db_password
DB_SERVER=your_db_server
DB_NAME=your_db_name

# FTP
FTP_HOST=your_ftp_host
FTP_USER=your_ftp_user
FTP_PASS=your_ftp_password
```

4. اجرای برنامه (حالت توسعه)

```powershell
npm run dev
```

5. مستندات API

در حالت محلی به آدرس زیر مراجعه کنید:

```
http://localhost:3000/api-docs
```

## ساختار پوشه‌ها (خلاصه)

```
src/
  config/        # ConfigUtil و اتصال به DB
  controllers/   # هندلرهای route
  services/      # منطق تجاری و دسترسی به DB
  models/        # metadata جدول‌ها
  routes/        # تعریف routeها و مستندسازی
  middleware/    # auth, validate, error handler
  utils/         # AppError, asyncHandler و ...
  docs/          # تنظیمات swagger
uploads/         # پوشهٔ موقت برای multer
```

## نکات مهم و امنیتی
- مقادیر حساس را هرگز در README یا در کنترل نسخه قرار ندهید.
- از فایل `.env` محلی استفاده کنید و یک `.env.example` با placeholderها داشته باشید.

## مدیریت خطا
- این پروژه یک کلاس `AppError` دارد برای خطاهای عملیاتی و یک error-handling middleware مرکزی که خطاها را به پاسخ‌های مناسب HTTP نگاشت می‌کند.

## اعتبارسنجی ورودی
- از `express-validator` برای بررسی ورودی‌ها استفاده شده و middleware `validate` خطاهای ولیدیشن را به `AppError(400)` تبدیل می‌کند.

## پیشنهادات برای بهبود
- جایگزینی `console` با یک لاگر ساختاریافته (`winston` یا `pino`)
- افزودن تست‌های واحد/ادغام (jest + supertest)
- افزودن CI (GitHub Actions) برای lint و تست خودکار

## مشارکت
- خوشحال می‌شویم pull request یا issue دریافت کنیم. برای تغییرات بزرگ ابتدا یک issue باز کنید و ایده را توضیح دهید.

## لایسنس
- MIT © Mohammad Hussein Fakhravari

---

اگر می‌خواهید، می‌توانم همین حالا فایل `.env.example` بسازم و/یا README را به انگلیسی نیز اضافه کنم — بگویید کدام‌یک را اول انجام دهم.
