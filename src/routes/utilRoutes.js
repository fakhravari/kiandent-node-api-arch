const router = require("express").Router();
const utilsController = require("../controllers/utilsController");

/**
 * @swagger
 * tags:
 *   - name: Utils
 *     description: ابزارهای کمکی مدیریت زمان، رشته، تبدیل تاریخ و اعتبارسنجی
 */

/**
 * @swagger
 * /utils/full-format:
 *   get:
 *     summary: 🧰 ابزارهای کمکی – تبدیل تاریخ، رشته، و اعتبارسنجی
 *     description: |
 *       این متد مجموعه‌ای از مثال‌های مربوط به تبدیل تاریخ شمسی/میلادی،  
 *       نرمال‌سازی متن فارسی، تبدیل اعداد، ساخت اسلاگ، و اعتبارسنجی اطلاعات ایرانی را ارائه می‌دهد.
 *     tags: [Utils]
 *     responses:
 *       200:
 *         description: موفق
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               examples:
 *                 convert_persian_digits:
 *                   before: "۱۲۳۴۵۶"
 *                   after: "123456"
 */

router.get("/full-format", utilsController.fullFormat);

module.exports = router;
