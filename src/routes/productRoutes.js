const express = require('express');
const router = express.Router();
const c = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: مدیریت محصولات
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: دریافت لیست همه محصولات
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: لیست محصولات برگردانده می‌شود
 */
router.get('/', c.list);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: دریافت جزئیات محصول بر اساس ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: اطلاعات محصول برگردانده می‌شود
 */
router.get('/:id', c.get);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: افزودن محصول جدید
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ProductName
 *               - Price
 *             properties:
 *               ProductName:
 *                 type: string
 *               Price:
 *                 type: number
 *               Stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: محصول با موفقیت اضافه شد
 */
router.post('/', protect, c.create);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: ویرایش اطلاعات محصول
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProductName:
 *                 type: string
 *               Price:
 *                 type: number
 *               Stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: محصول بروزرسانی شد
 */
router.put('/:id', c.update);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: حذف محصول بر اساس ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: محصول حذف شد
 */
router.delete('/:id', c.remove);

module.exports = router;
