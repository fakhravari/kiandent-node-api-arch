const swaggerJsdoc = require('swagger-jsdoc');

// 🧠 تشخیص خودکار محیط
const isRender = !!process.env.RENDER; // Render معمولاً این متغیر محیطی رو ست می‌کنه
const isProduction = process.env.NODE_ENV === 'production';

// 🧩 آدرس سرور داینامیک
const baseUrl =
  process.env.BASE_URL ||                // در صورت تعریف دستی (مثلاً در Render)
  (isRender ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}` : `http://localhost:3000`);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kiandent Node.js API (Dynamic)',
      version: '1.0.0',
      description: 'CRUD برای Customers, Products, Orders, OrderDetails با تشخیص خودکار محیط',
    },
    servers: [
      { url: baseUrl, description: isProduction ? 'Render Server' : 'Local' }
    ],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
