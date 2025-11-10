const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

// تنظیمات اتصال به FTP
const ftpConfig = {
    host: 'nodejs.kiandent.ir',
    user: 'nodejs',
    password: '4z*v8O9n4',
    secure: false // اگر SSL داری true کن
};

// اتصال به FTP
async function getClient() {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    await client.access(ftpConfig);
    return client;
}

// 📥 آپلود فایل
async function uploadFile(localPath, remoteFileName) {
    const client = await getClient();
    await client.uploadFrom(localPath, remoteFileName);
    client.close();
}

// 📤 دانلود فایل
async function downloadFile(remoteFileName, localPath) {
    const client = await getClient();
    await client.downloadTo(localPath, remoteFileName);
    client.close();
}

// 🗑 حذف فایل
async function deleteFile(remoteFileName) {
    const client = await getClient();
    await client.remove(remoteFileName);
    client.close();
}

// 📋 لیست فایل‌ها
async function listFiles(remoteDir = '.') {
    const client = await getClient();
    const list = await client.list(remoteDir);
    client.close();
    return list;
}

module.exports = { uploadFile, downloadFile, deleteFile, listFiles };
