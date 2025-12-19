const { body } = require('express-validator');

const createFaculty = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('universityId')
    .isInt()
    .withMessage('El ID de universidad debe ser un número'),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean(),
];

const updateFaculty = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío'),
  body('universityId')
    .optional()
    .isInt()
    .withMessage('El ID de universidad debe ser un número'),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean(),
];

module.exports = {
  createFaculty,
  updateFaculty,
};
