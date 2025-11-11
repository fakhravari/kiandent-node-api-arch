const express = require('express');
const router = express.Router();
const c = require('../controllers/orderDetailController');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: OrderDetails
 *   description: جزئیات سفارش‌ها
 */

/**
 * @swagger
 * /orderdetails:
 *   get:
 *     summary: دریافت همه جزئیات سفارش‌ها
 *     tags: [OrderDetails]
 *     responses:
 *       200:
 *         description: لیست جزئیات سفارش‌ها
 */
router.get('/', c.list);

/**
 * @swagger
 * /orderdetails/{id}:
 *   get:
 *     summary: دریافت جزئیات یک سفارش خاص
 *     tags: [OrderDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: جزئیات سفارش مورد نظر
 */
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], validate, c.get);

/**
 * @swagger
 * /orderdetails:
 *   post:
 *     summary: افزودن جزئیات سفارش جدید
 *     tags: [OrderDetails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - OrderID
 *               - ProductID
 *               - Quantity
 *               - UnitPrice
 *             properties:
 *               OrderID: { type: integer }
 *               ProductID: { type: integer }
 *               Quantity: { type: integer }
 *               UnitPrice: { type: number }
 *     responses:
 *       200:
 *         description: جزئیات سفارش اضافه شد
 */
router.post('/', [
    body('OrderID').isInt().withMessage('OrderID is required and must be an integer'),
    body('ProductID').isInt().withMessage('ProductID is required and must be an integer'),
    body('Quantity').isInt().withMessage('Quantity is required and must be an integer'),
    body('UnitPrice').isNumeric().withMessage('UnitPrice is required and must be a number'),
], validate, c.create);

/**
 * @swagger
 * /orderdetails/{id}:
 *   put:
 *     summary: ویرایش جزئیات سفارش
 *     tags: [OrderDetails]
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
 *               Quantity: { type: integer }
 *               UnitPrice: { type: number }
 *     responses:
 *       200:
 *         description: بروزرسانی جزئیات سفارش
 */
router.put('/:id', [param('id').isInt().withMessage('id must be an integer'), body('Quantity').optional().isInt().withMessage('Quantity must be an integer'), body('UnitPrice').optional().isNumeric().withMessage('UnitPrice must be a number')], validate, c.update);

/**
 * @swagger
 * /orderdetails/{id}:
 *   delete:
 *     summary: حذف جزئیات سفارش
 *     tags: [OrderDetails]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: جزئیات سفارش حذف شد
 */
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], validate, c.remove);

/**
 * @swagger
 * /orderdetails/order/{orderId}:
 *   get:
 *     summary: دریافت جزئیات سفارش به همراه محصولاتش
 *     tags: [OrderDetails]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: لیست محصولات مرتبط با سفارش
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId: { type: integer }
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ProductName: { type: string }
 *                       Price: { type: number }
 *                       Quantity: { type: integer }
 *                       UnitPrice: { type: number }
 */
router.get('/order/:orderId', [param('orderId').isInt().withMessage('orderId must be an integer')], validate, c.withProducts);

module.exports = router;
