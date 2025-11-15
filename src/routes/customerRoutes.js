const express = require('express');
const router = express.Router();
const c = require('../controllers/customerController');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: مدیریت مشتریان
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: دریافت همه مشتری‌ها
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: موفق
 */
router.get('/', c.list);

/**
 * @swagger
 * /customers/proc:
 *   get:
 *     summary: دریافت مشتریان از طریق Stored Procedure dbo.GetAllCustomers
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: Id
 *         required: false
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: موفق
 */
router.get('/proc', [query('Id').optional().isInt().withMessage('Id must be an integer')], validate, c.listFromProc);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: دریافت یک مشتری
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: موفق }
 */
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], validate, c.get);

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: افزودن مشتری
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FullName: { type: string }
 *               Phone: { type: string }
 *               Email: { type: string }
 *               City: { type: string }
 *     responses:
 *       200: { description: موفق }
 */
router.post('/', [
    body('FullName').trim().notEmpty().withMessage('FullName is required'),
    body('Email').optional().isEmail().withMessage('Email must be valid'),
    body('Phone').optional().isString(),
    body('City').optional().isString(),
], validate, c.create);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: بروزرسانی مشتری
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FullName: { type: string }
 *               Phone: { type: string }
 *               Email: { type: string }
 *               City: { type: string }
 *     responses:
 *       200: { description: موفق }
 */
router.put('/:id', [
    param('id').isInt().withMessage('id must be an integer'),
    body('FullName').optional().trim().notEmpty(),
    body('Email').optional().isEmail().withMessage('Email must be valid'),
    body('Phone').optional().isString(),
    body('City').optional().isString(),
], validate, c.update);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: حذف مشتری
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: موفق }
 */
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], validate, c.remove);

module.exports = router;
