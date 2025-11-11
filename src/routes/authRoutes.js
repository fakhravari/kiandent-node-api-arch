const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: احراز هویت کاربران
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: ثبت‌نام کاربر جدید
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [FullName, Email, Password]
 *             properties:
 *               FullName: { type: string }
 *               Email: { type: string }
 *               Password: { type: string }
 *     responses:
 *       200:
 *         description: کاربر با موفقیت ثبت شد
 */
router.post('/register', [
    body('FullName').trim().notEmpty().withMessage('FullName is required'),
    body('Email').isEmail().withMessage('Valid Email is required'),
    body('Password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, auth.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: ورود کاربر و دریافت JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Email, Password]
 *             properties:
 *               Email: { type: string }
 *               Password: { type: string }
 *     responses:
 *       200:
 *         description: ورود موفق و دریافت توکن
 */
router.post('/login', [ 
    body('Email').isEmail().withMessage('Valid Email is required'),
    body('Password').notEmpty().withMessage('Password is required'),
], validate, auth.login);

module.exports = router;
