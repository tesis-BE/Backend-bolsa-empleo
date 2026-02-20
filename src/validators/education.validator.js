const { body, param } = require('express-validator');

const educationValidator = {
  create: [
    body('institution')
      .optional({ nullable: true, checkFalsy: true })
      .isLength({ max: 255 })
      .withMessage('La institución no puede exceder 255 caracteres'),
    body('degree')
      .optional({ nullable: true, checkFalsy: true })
      .isLength({ max: 255 })
      .withMessage('El título no puede exceder 255 caracteres'),
    body('fieldOfStudy')
      .optional({ nullable: true, checkFalsy: true })
      .isLength({ max: 255 })
      .withMessage('El campo de estudio no puede exceder 255 caracteres'),
    body('startDate')
      .optional({ nullable: true, checkFalsy: true })
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
    body('degreeType')
      .optional({ nullable: true })
      .isIn(['Licenciatura', 'Ingeniería', 'Técnico', 'Maestría', 'Doctorado', 'Especialización', 'Diplomado', 'Otro'])
      .withMessage('Tipo de título inválido'),
    body('description')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('La descripción no puede exceder 2000 caracteres'),
    body('facultyId')
      .optional({ nullable: true })
      .isInt()
      .withMessage('El ID de facultad debe ser un número'),
    body('careerId')
      .optional({ nullable: true })
      .isInt()
      .withMessage('El ID de carrera debe ser un número'),
    body('universityId')
      .optional({ nullable: true })
      .isInt()
      .withMessage('El ID de extensión debe ser un número'),
    body('isCurrent')
      .optional()
      .isBoolean()
      .withMessage('isCurrent debe ser un booleano'),
  ],

  update: [
    param('id').isInt().withMessage('ID inválido'),
    body('institution')
      .optional({ nullable: true, checkFalsy: true })
      .isLength({ max: 255 })
      .withMessage('La institución no puede exceder 255 caracteres'),
    body('degree')
      .optional({ nullable: true, checkFalsy: true })
      .isLength({ max: 255 })
      .withMessage('El título no puede exceder 255 caracteres'),
    body('fieldOfStudy')
      .optional({ nullable: true, checkFalsy: true })
      .isLength({ max: 255 })
      .withMessage('El campo de estudio no puede exceder 255 caracteres'),
    body('startDate')
      .optional({ nullable: true, checkFalsy: true })
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
    body('degreeType')
      .optional({ nullable: true })
      .isIn(['Licenciatura', 'Ingeniería', 'Técnico', 'Maestría', 'Doctorado', 'Especialización', 'Diplomado', 'Otro'])
      .withMessage('Tipo de título inválido'),
    body('description')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('La descripción no puede exceder 2000 caracteres'),
    body('facultyId')
      .optional({ nullable: true })
      .isInt()
      .withMessage('El ID de facultad debe ser un número'),
    body('careerId')
      .optional({ nullable: true })
      .isInt()
      .withMessage('El ID de carrera debe ser un número'),
    body('universityId')
      .optional({ nullable: true })
      .isInt()
      .withMessage('El ID de extensión debe ser un número'),
    body('isCurrent')
      .optional()
      .isBoolean()
      .withMessage('isCurrent debe ser un booleano'),
  ],

  delete: [param('id').isInt().withMessage('ID inválido')],
};

module.exports = educationValidator;
