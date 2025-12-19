const { body } = require('express-validator');

const createUniversity = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('code').optional().isString(),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean(),
];

const updateUniversity = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío'),
  body('code').optional().isString(),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean(),
];

module.exports = {
  createUniversity,
  updateUniversity,
};
