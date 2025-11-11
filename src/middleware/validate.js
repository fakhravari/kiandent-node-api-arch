const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const details = errors.array().map(e => ({ param: e.param, msg: e.msg }));
        return next(new AppError(400, 'VALIDATION_ERROR', 'Validation failed', details));
    }
    next();
};
