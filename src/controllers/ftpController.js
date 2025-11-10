const ftpService = require('../services/ftpService');
const path = require('path');
const fs = require('fs');

// 📋 لیست فایل‌ها
exports.list = async (req, res, next) => {
    try {
        const files = await ftpService.listFiles();
        res.json(files);
    } catch (err) {
        next(err);
    }
};

// 📥 آپلود فایل
exports.upload = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: 'فایلی ارسال نشده است' });

        await ftpService.uploadFile(file.path, file.originalname);
        fs.unlinkSync(file.path); // پاک فایل موقت محلی
        res.json({ message: '✅ فایل با موفقیت آپلود شد', file: file.originalname });
    } catch (err) {
        next(err);
    }
};

// 📤 دانلود فایل
exports.download = async (req, res, next) => {
    try {
        const { name } = req.params;
        const localPath = path.join(__dirname, `../../temp_${name}`);
        await ftpService.downloadFile(name, localPath);
        res.download(localPath, name, () => fs.unlinkSync(localPath));
    } catch (err) {
        next(err);
    }
};

// 🗑 حذف فایل
exports.remove = async (req, res, next) => {
    try {
        const { name } = req.params;
        await ftpService.deleteFile(name);
        res.json({ message: `🗑 فایل ${name} حذف شد` });
    } catch (err) {
        next(err);
    }
};
