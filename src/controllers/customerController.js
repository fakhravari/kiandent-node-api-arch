const service = require('../services/customerService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.list = asyncHandler(async (req, res) => {
  const data = await service.getAll();
  res.json({ success: true, data });
});

// Call stored-proc version (standalone)
exports.listFromProc = asyncHandler(async (req, res) => {
  const id = req.query.Id ? Number(req.query.Id) : 0;
  const data = await service.getAllFromProc(id);
  res.json({ success: true, data });
});

exports.get = asyncHandler(async (req, res) => {
  const item = await service.getById(req.params.id);
  if (!item) throw new AppError(404, 'CUSTOMER_NOT_FOUND', 'مشتری یافت نشد');
  res.json({ success: true, data: item });
});

exports.create = asyncHandler(async (req, res) => {
  await service.create(req.body);
  res.status(201).json({ success: true, message: 'مشتری اضافه شد' });
});

exports.update = asyncHandler(async (req, res) => {
  await service.update(req.params.id, req.body);
  res.json({ success: true, message: 'مشتری بروزرسانی شد' });
});

exports.remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.status(204).json({ success: true, message: 'مشتری حذف شد' });
});
