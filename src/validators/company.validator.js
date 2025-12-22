const { body } = require('express-validator');
const { COMPANY_STATUS } = require('../config/constants');

const create = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la empresa es requerido'),
  body('description').optional().trim(),
  body('industry').optional().trim(),
  body('website').optional(),
  body('location').optional().trim(),
];

const update = [
  body('name').optional().trim(),
  body('description').optional().trim(),
  body('industry').optional().trim(),
  body('website').optional(),
  body('location').optional().trim(),
];

const updateStatus = [
  body('status')
    .isIn(Object.values(COMPANY_STATUS))
    .withMessage('Estado de empresa inválido'),
];

const addRecruiter = [
  body('userId').isInt({ min: 1 }).withMessage('ID de usuario inválido'),
];

module.exports = {
  create,
  update,
  updateStatus,
  addRecruiter,
};
