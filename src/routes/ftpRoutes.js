const express = require('express');
const router = express.Router();
const ftpCtrl = require('../controllers/ftpController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { param } = require('express-validator');
const validate = require('../middleware/validate');

/**
 * @swagger
 * tags:
 *   name: FTP
 *   description: مدیریت فایل‌ها روی سرور FTP
 */

/**
 * @swagger
 * /ftp:
 *   get:
 *     summary: لیست همه فایل‌ها روی سرور FTP
 *     tags: [FTP]
 *     responses:
 *       200:
 *         description: لیست فایل‌ها با اطلاعات
 */

/**
 * @swagger
 * /ftp/upload:
 *   post:
 *     summary: آپلود فایل روی سرور FTP
 *     tags: [FTP]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: فایل با موفقیت آپلود شد
 */

/**
 * @swagger
 * /ftp/download/{name}:
 *   get:
 *     summary: دانلود فایل از FTP
 *     tags: [FTP]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: نام فایل روی سرور
 *     responses:
 *       200:
 *         description: فایل برای دانلود ارسال می‌شود
 */

/**
 * @swagger
 * /ftp/{name}:
 *   delete:
 *     summary: حذف فایل از سرور FTP
 *     tags: [FTP]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: فایل حذف شد
 */

router.get('/', ftpCtrl.list);
router.post('/upload', upload.single('file'), ftpCtrl.upload);
router.get('/download/:name', [param('name').trim().notEmpty().withMessage('name is required')], validate, ftpCtrl.download);
router.delete('/:name', [param('name').trim().notEmpty().withMessage('name is required')], validate, ftpCtrl.remove);

module.exports = router;
