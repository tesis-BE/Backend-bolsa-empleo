const { body, param } = require('express-validator');

const projectValidator = {
  create: [
    body('name')
      .notEmpty()
      .withMessage('El nombre del proyecto es requerido')
      .isLength({ max: 255 })
      .withMessage('El nombre no puede exceder 255 caracteres'),
    body('description')
      .notEmpty()
      .withMessage('La descripción es requerida')
      .isLength({ max: 2000 })
      .withMessage('La descripción no puede exceder 2000 caracteres'),
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
    body('projectUrl')
      .optional()
      .isURL()
      .withMessage('La URL del proyecto debe ser válida'),
    body('repositoryUrl')
      .optional()
      .isURL()
      .withMessage('La URL del repositorio debe ser válida'),
    body('technologies')
      .optional()
      .isArray()
      .withMessage('Las tecnologías deben ser un array'),
    body('isCurrent')
      .optional()
      .isBoolean()
      .withMessage('isCurrent debe ser un booleano'),
  ],

  update: [
    param('id').isInt().withMessage('ID inválido'),
    body('name')
      .optional()
      .isLength({ max: 255 })
      .withMessage('El nombre no puede exceder 255 caracteres'),
    body('description')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('La descripción no puede exceder 2000 caracteres'),
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
    body('projectUrl')
      .optional()
      .isURL()
      .withMessage('La URL del proyecto debe ser válida'),
    body('repositoryUrl')
      .optional()
      .isURL()
      .withMessage('La URL del repositorio debe ser válida'),
    body('technologies')
      .optional()
      .isArray()
      .withMessage('Las tecnologías deben ser un array'),
    body('isCurrent')
      .optional()
      .isBoolean()
      .withMessage('isCurrent debe ser un booleano'),
  ],

  delete: [param('id').isInt().withMessage('ID inválido')],
};

module.exports = projectValidator;
