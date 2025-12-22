const { body, param } = require('express-validator');

const workExperienceValidator = {
  create: [
    body('companyName')
      .notEmpty()
      .withMessage('El nombre de la empresa es requerido')
      .isLength({ max: 255 })
      .withMessage('El nombre de la empresa no puede exceder 255 caracteres'),
    body('position')
      .notEmpty()
      .withMessage('El cargo es requerido')
      .isLength({ max: 255 })
      .withMessage('El cargo no puede exceder 255 caracteres'),
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
    body('description')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('La descripción no puede exceder 2000 caracteres'),
    body('isCurrent')
      .optional()
      .isBoolean()
      .withMessage('isCurrent debe ser un booleano'),
    body('location')
      .optional()
      .isLength({ max: 255 })
      .withMessage('La ubicación no puede exceder 255 caracteres'),
  ],

  update: [
    param('id').isInt().withMessage('ID inválido'),
    body('companyName')
      .optional()
      .isLength({ max: 255 })
      .withMessage('El nombre de la empresa no puede exceder 255 caracteres'),
    body('position')
      .optional()
      .isLength({ max: 255 })
      .withMessage('El cargo no puede exceder 255 caracteres'),
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
    body('description')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('La descripción no puede exceder 2000 caracteres'),
    body('isCurrent')
      .optional()
      .isBoolean()
      .withMessage('isCurrent debe ser un booleano'),
    body('location')
      .optional()
      .isLength({ max: 255 })
      .withMessage('La ubicación no puede exceder 255 caracteres'),
  ],

  delete: [param('id').isInt().withMessage('ID inválido')],
};

module.exports = workExperienceValidator;
