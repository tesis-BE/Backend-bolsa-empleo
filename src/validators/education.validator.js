const { body, param } = require('express-validator');

const educationValidator = {
  create: [
    body('institution')
      .notEmpty()
      .withMessage('La institución es requerida')
      .isLength({ max: 255 })
      .withMessage('La institución no puede exceder 255 caracteres'),
    body('degree')
      .notEmpty()
      .withMessage('El título es requerido')
      .isLength({ max: 255 })
      .withMessage('El título no puede exceder 255 caracteres'),
    body('fieldOfStudy')
      .notEmpty()
      .withMessage('El campo de estudio es requerido')
      .isLength({ max: 255 })
      .withMessage('El campo de estudio no puede exceder 255 caracteres'),
    body('startDate')
      .notEmpty()
      .withMessage('La fecha de inicio es requerida')
      .isISO8601()
      .withMessage('Formato de fecha inválido'),
    body('endDate')
      .optional({ nullable: true })
      .isISO8601()
      .withMessage('Formato de fecha inválido')
      .custom((value, { req }) => {
        if (
          value &&
          req.body.startDate &&
          new Date(value) < new Date(req.body.startDate)
        ) {
          throw new Error(
            'La fecha de fin debe ser posterior a la fecha de inicio'
          );
        }
        return true;
      }),
    body('grade')
      .optional()
      .isLength({ max: 50 })
      .withMessage('La calificación no puede exceder 50 caracteres'),
    body('description')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('La descripción no puede exceder 2000 caracteres'),
    body('isCurrent')
      .optional()
      .isBoolean()
      .withMessage('isCurrent debe ser un booleano'),
  ],

  update: [
    param('id').isInt().withMessage('ID inválido'),
    body('institution')
      .optional()
      .isLength({ max: 255 })
      .withMessage('La institución no puede exceder 255 caracteres'),
    body('degree')
      .optional()
      .isLength({ max: 255 })
      .withMessage('El título no puede exceder 255 caracteres'),
    body('fieldOfStudy')
      .optional()
      .isLength({ max: 255 })
      .withMessage('El campo de estudio no puede exceder 255 caracteres'),
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Formato de fecha inválido'),
    body('endDate')
      .optional({ nullable: true })
      .isISO8601()
      .withMessage('Formato de fecha inválido')
      .custom((value, { req }) => {
        if (
          value &&
          req.body.startDate &&
          new Date(value) < new Date(req.body.startDate)
        ) {
          throw new Error(
            'La fecha de fin debe ser posterior a la fecha de inicio'
          );
        }
        return true;
      }),
    body('grade')
      .optional()
      .isLength({ max: 50 })
      .withMessage('La calificación no puede exceder 50 caracteres'),
    body('description')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('La descripción no puede exceder 2000 caracteres'),
    body('isCurrent')
      .optional()
      .isBoolean()
      .withMessage('isCurrent debe ser un booleano'),
  ],

  delete: [param('id').isInt().withMessage('ID inválido')],
};

module.exports = educationValidator;
