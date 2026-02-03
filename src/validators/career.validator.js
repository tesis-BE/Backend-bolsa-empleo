const { body } = require('express-validator');

const createCareer = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('facultyId')
    .optional()
    .isInt()
    .withMessage('El ID de facultad debe ser un número'),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean(),
];

const updateCareer = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío'),
  body('facultyId')
    .optional()
    .isInt()
    .withMessage('El ID de facultad debe ser un número'),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean(),
];

module.exports = {
  createCareer,
  updateCareer,
};
