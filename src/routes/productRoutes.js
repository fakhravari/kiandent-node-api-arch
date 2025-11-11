const express = require('express');
const router = express.Router();
const c = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');

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
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], validate, c.get);

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
router.post('/', protect, [
    body('ProductName').trim().notEmpty().withMessage('ProductName is required'),
    body('Price').isNumeric().withMessage('Price must be a number'),
    body('Stock').optional().isInt().withMessage('Stock must be an integer'),
], validate, c.create);

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
router.put('/:id', [
    param('id').isInt().withMessage('id must be an integer'),
    body('ProductName').optional().trim().notEmpty(),
    body('Price').optional().isNumeric().withMessage('Price must be a number'),
    body('Stock').optional().isInt().withMessage('Stock must be an integer'),
], validate, c.update);

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
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], validate, c.remove);

module.exports = router;
