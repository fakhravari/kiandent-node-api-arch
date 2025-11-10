const express = require('express');
const router = express.Router();
const ftpCtrl = require('../controllers/ftpController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   name: FTP
 *   description: مدیریت فایل‌ها روی سرور FTP
 */

router.get('/', ftpCtrl.list);
router.post('/upload', upload.single('file'), ftpCtrl.upload);
router.get('/download/:name', ftpCtrl.download);
router.delete('/:name', ftpCtrl.remove);

module.exports = router;
