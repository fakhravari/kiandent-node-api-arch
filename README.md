# kiandent-nodejs-api

Layered Node.js + Express + SQL Server API with Swagger UI (Customers, Products, Orders, OrderDetails)

## توضیحات
این پروژه یک نمونهٔ ساختار تمیز (Clean Architecture) برای یک اپلیکیشن Node.js/Express است که مسیرها، کنترلرها، سرویس‌ها و پیکربندی‌ها را جدا کرده است.

## پیش‌نیازها
- Node.js (نسخه 14 یا بالاتر)
- یک دیتابیس مطابق با `db.sql` (در صورت نیاز)


## نصب و اجرا
```bash
# نصب وابستگی‌ها
npm install

# اجرا (اگر در package.json یک اسکریپت start تعریف شده باشد)
npm start
```

## اسکریپت‌های مفید

- `start`: `node src/app.js`

- `dev`: `nodemon src/app.js`


## فایل‌ها و ساختار کلی
نمونه‌ای از ساختار داخل آرشیو:

```

src/

src/app.js

uploads/

.env

.gitignore

db.sql

note.txt

package.json

package-lock.json

...
```

## تنظیمات محیطی
فایل `.env` در آرشیو وجود دارد — مقادیر حساس (مانند رشتهٔ اتصال به دیتابیس، کلیدهای API) را در آن قرار دهید.


## دیتابیس
فایل `db.sql` در آرشیو قرار دارد که یک اسکیمای اولیه یا نمونه داده‌ها را فراهم می‌کند.


## مستندات API
در پوشه `src/docs/` فایل `openapi.json` قرار دارد — می‌توانید از آن برای تولید مستندات (مثلاً با Swagger UI) استفاده کنید.


## یادداشت‌های نویسنده
```
npm install npm audit fix --force npm audit fix --dry-run openapi.json > _commented_components برای کامنت کردن این بخش ** Render JWT_SECRET=yourSuperSecretKey12345 JWT_EXPIRES_IN=7d https://nodejs-clean-architecture.onrender.com/api-docs -------------------------------------------------------- ftp user = nodejs pass = 4z*v8O9n4 ip = nodejs.kiandent.ir -------------------------------------------------------- ip=62.204.61.143\sqlserver2022 db=kiandent_NodeJs user=kiandent_NodeJs pas=q8E0*0es7
```

## تماس
در صورت نیاز به کمک بیشتر، به من بگویید تا README را دقیق‌تر یا به زبان انگلیسی/فارسی کامل‌تر کنم.
