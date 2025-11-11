# Node.js Clean Architecture — مستند فنی و آکادمیک

نویسنده: Mohammad Hussein Fakhravari

تاریخ: 2025-11-11

خلاصه (Abstract)
------------------
این مدارک شرحِ یک پیاده‌سازی نمونه از یک API لایه‌ای (Clean/Layered) مبتنی بر Node.js و Express را ارائه می‌دهد. هدف از این پروژه فراهم آوردن چارچوبی عملی برای توسعهٔ سرویس‌های RESTful قابل آزمون، قابل نگهداری و قابل استقرار است؛ و نشان دادن ترکیب الگوهایی مانند مدیریت پیکربندی متمرکز، اعتبارسنجی ورودی، مدیریت خطا، مستندسازی OpenAPI و تعامل با پایگاه‌دادهٔ رابطه‌ای (SQL Server).

کلیدواژه‌ها: Node.js, Express, Clean Architecture, SQL Server, JWT, OpenAPI, validation, error handling

مقدمه (Introduction)
-----------------------
پیاده‌سازی‌های سادهٔ API در عمل اغلب به سرعت به مجموعه‌ای از وابستگی‌های نامنظم و منطق توزیع‌شده تبدیل می‌شوند که تست‌پذیری و نگهداری را دشوار می‌سازد. این پروژه نمونه‌ای آموزشی و عملی است که نشان می‌دهد چگونه با جداسازی نگرانی‌ها (Separation of Concerns) و تعریف قراردادهای مشخص بین لایه‌ها می‌توان کیفیت و انسجام کد را بهبود بخشید.

مسئلهٔ تحقیق (Problem Statement)
---------------------------------
چگونگی سازمان‌دهی یک پروژهٔ میان‌ردهٔ Node.js طوری که:
- منطقی قابل تست و قابل تعویض باشد
- خطاها و پیام‌ها به شکل ساختاریافته و قابل ماشینی تولید شوند
- مستندسازی API به صورت خودکار تولید و قابل استفاده برای تست‌ها و مصرف‌کنندگان باشد

اهداف (Objectives)
------------------
1. ارائهٔ یک ساختار لایه‌ای (Controllers → Services → Models)
2. معرفی الگوی مدیریت خطا (AppError + central middleware) و قراردادی برای پاسخ‌های خطا
3. نشان دادن چگونگی اعتبارسنجی و بازگرداندن خطاهای ولیدیشن به صورت ماشین‌پسند
4. تولید مستندات OpenAPI/Swagger برای مصرف‌کنندگان و تست‌های خودکار

معماری پیشنهادی (System Architecture)
-------------------------------------
این پیاده‌سازی از الگوی لایه‌ای ساده استفاده می‌کند. دیاگرام متنی (ASCII) زیر نمای کلی را نشان می‌دهد:

```
Client (HTTP)
   |
   v
Routes (Express) --- Swagger docs (/api-docs)
   |
   v
Controllers ----> Middleware (auth, validate, error)
   |
   v
Services (business logic)
   |
   v
Data Access (mssql)
   |
   v
SQL Server
```

توضیح لایه‌ها
- Routes: تعریف endpointها و مستندات OpenAPI (annotations)
- Controllers: تبدیل درخواست HTTP به پارامترهای سرویس و بازگرداندن پاسخ یکپارچه
- Services: منطق تجاری و فراخوانی‌های DB با پارامترایزیشن
- Middleware: احراز هویت JWT، اعتبارسنجی (express-validator)، مدیریت خطا

دلایل طراحی (Design Rationale)
-------------------------------
- جداسازی کنترلرها و سرویس‌ها برای تسهیل تست واحد و جایگزینی رفتارها (mocking)
- استفاده از پارامترایزیشن در کوئری‌ها برای جلوگیری از SQL Injection
- نمایشی یکنواخت از پاسخ‌ها (success flag, error object) برای ساده‌سازی مصرف در کلاینت و تست
- تولید `errorId` برای لاگ‌گذاری و ردیابی خطاهای غیرمنتظره در محیط تولید

مدل داده‌ای خلاصه (Data Model)
-------------------------------
جداول اصلی (خلاصه):
- Users (FullName, Email, Password, Jwt, JwtIssuedAt, JwtExpiresAt)
- Customers (CustomerID, FullName, Phone, Email, City)
- Products (ProductID, ProductName, Price, Stock)
- Orders (OrderID, CustomerID, TotalAmount, CreatedAt)
- OrderDetails (OrderDetailID, OrderID, ProductID, Quantity, UnitPrice)

برای اسکریپت‌های ایجاد جداول، به فایل `db.sql` در ریشه مراجعه کنید.

قرارداد API و مدل خطاها (API Contract)
------------------------------------
موارد مهم:
- پاسخ موفق:

```json
{ "success": true, "data": ..., "message": "..." }
```

- پاسخ خطا:

```json
{
  "success": false,
  "error": {
    "statusCode": <HTTP>,
    "code": "<ERROR_CODE>",
    "message": "Human-friendly message",
    "details": { "field": ["msg", ...] } // optional
  }
}
```

این قرارداد به مصرف‌کننده اجازه می‌دهد خطاها را برنامه‌محور (programmatically) هندل کند و پیام‌های انسانی را برای نمایش در UI به کار گیرد.

اعتبارسنجی و مدیریت خطا (Validation & Error Handling)
-----------------------------------------------------
- از `express-validator` برای تعریف قواعد ولیدیشن در سطح روتر استفاده شده است.
- middleware `validate` نتایج ولیدیشن را به یک دیکشنری `details` تبدیل می‌کند (کلیدها نام فیلدها و مقادیر آرایهٔ پیام‌ها).
- خطاهای عملیاتی با `AppError` پرتاب می‌شوند و middleware مرکزی آن‌ها را با کد HTTP مناسب بازمی‌گرداند.

نمونهٔ ولیدیشن (مثال پژوهشی)
--------------------------------
درخواست ناقص برای ثبت‌نام (`POST /auth/register`) ممکن است پاسخ زیر را تولید کند:

```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": { "email": ["Valid Email is required"], "password": ["Password must be at least 6 characters"] }
  }
}
```

محیط آزمایشی و اجرای بازتولیدپذیر (Reproducible Experiment Setup)
------------------------------------------------------------------
برای آزمایش پژوهشی:
1. یک ماشین مجازی یا کانتینر دیتابیس با نسخهٔ مشخص SQL Server راه‌اندازی کنید.
2. اسکریپت `db.sql` را اجرا و داده‌های نمونه را بارگذاری کنید.
3. متغیر محیطی `NODE_ENV=test` را تنظیم کنید و با داده‌های fixture تست‌ها را اجرا نمایید.

روندهای ارزیابی (Evaluation)
-----------------------------
ارزیابی این پروژه معمولاً شامل موارد زیر است:
- تحلیل پوشش واحدهای تست (unit test coverage)
- تست‌های کارایی پایه برای کوئری‌های بحرانی
- بررسی مقاومت در برابر خطا (fault injection) در سطوح سرویس و DB

محدودیت‌ها و کارهای آینده (Limitations & Future Work)
----------------------------------------------------
- پیاده‌سازی فعلی از اعتبارسنجی و لاگ پایه استفاده می‌کند؛ پیشنهاد می‌شود لاگر ساختاریافته (pino/winston) افزوده و لاگ‌ها به سرویس متمرکزی ارسال شوند.
- سیاست کامل مدیریت توکن (refresh/revoke) پیاده‌سازی نشده است.
- تست‌های خودکار فعلی کم هستند؛ افزودن suite تست و CI پیشنهاد می‌شود.

چگونه مشارکت کنید (Contribution)
--------------------------------
1. یک issue باز کنید و تغییر پیشنهادی را توصیف نمایید.
2. یک شاخهٔ جدید بسازید و تغییرات را اعمال کنید.
3. Pull request را باز کنید و توضیحات لازم را بنویسید.

مشاهدهٔ مستندات (Online)
-------------------------
مستندات OpenAPI/Swagger این پروژه در آدرس زیر قابل مشاهده و بررسی است:

https://nodejs-clean-architecture.onrender.com/api-docs

مجوز (License)
----------------
MIT © Mohammad Hussein Fakhravari
