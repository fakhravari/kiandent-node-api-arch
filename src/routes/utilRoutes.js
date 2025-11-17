const router = require("express").Router();
const utilsController = require("../controllers/utilsController");


/**
 * @swagger
 * tags:
 *   name: utils
 *   description:  مدیریت زمان - رشته
 */


/**
 * @swagger
 * /utils/dateformat:
 *   get:
 *     summary: 📅 تبدیل تاریخ میلادی به شمسی + مثال‌های مختلف
 *     description: |
 *       این متد چند نمونه تبدیل تاریخ (میلادی → شمسی، شمسی → میلادی، اختلاف زمان‌ها و …)  
 *       را برمی‌گرداند و برای تست کلاس DateTimeUtils استفاده می‌شود.
 *     tags: [utils]
 *     responses:
 *       200:
 *         description: موفق
 */ 
router.route("/dateformat").get(utilsController.dateformat);


/**
 * @swagger
 * /utils/stringformat:
 *   get:
 *     summary: 🌀 تبدیل و نرمال‌سازی متن فارسی/عربی
 *     tags: [utils]
 *     responses:
 *       200:
 *         description: 🚀 موفق
 */
router.route("/stringformat").get(utilsController.stringformat);

module.exports = router;
