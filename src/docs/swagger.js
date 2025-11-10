const swaggerJsdoc = require('swagger-jsdoc');

// 🧠 تشخیص خودکار محیط
const isRender = !!process.env.RENDER;
const isProduction = process.env.NODE_ENV === 'production';

// 🧩 آدرس سرور داینامیک
const baseUrl =
  process.env.BASE_URL ||
  (isRender ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}` : `http://localhost:3000`);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js API (Dynamic + JWT Auth)',
      version: '1.0.0',
      description:
        'API شامل Customers, Products, Orders, OrderDetails با پشتیبانی از JWT و تشخیص خودکار محیط (Render / Local)',
    },
    servers: [
      {
        url: baseUrl,
        description: isProduction ? 'Render Server' : 'Local Server',
      },
    ],

    // ✅ بخش اضافه‌شده برای JWT Auth
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'برای تست متدهای محافظت‌شده، توکن JWT خود را وارد کنید (مثلاً: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)',
        },
      },
    },

    // 🔒 اعمال امنیت برای تمام مسیرها به صورت پیش‌فرض
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // مسیر فایل‌های روت
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
