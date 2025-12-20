const { body } = require('express-validator');
const { JOB_TYPES, WORK_MODES } = require('../config/constants');

const create = [
  body('title')
    .trim()
    .isLength({ min: 5 })
    .withMessage('El título debe tener al menos 5 caracteres'),
  body('description')
    .trim()
    .isLength({ min: 20 })
    .withMessage('La descripción debe tener al menos 20 caracteres'),
  body('jobType')
    .isIn([
      JOB_TYPES.FULL_TIME,
      JOB_TYPES.PART_TIME,
      JOB_TYPES.CONTRACT,
      JOB_TYPES.INTERNSHIP,
      JOB_TYPES.TEMPORARY,
    ])
    .withMessage('Tipo de trabajo inválido'),
  body('workMode')
    .optional()
    .isIn([WORK_MODES.REMOTE, WORK_MODES.ON_SITE, WORK_MODES.HYBRID])
    .withMessage('Modo de trabajo inválido'),
  body('salaryMin')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Salario mínimo inválido'),
  body('salaryMax')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Salario máximo inválido')
    .custom((value, { req }) => {
      if (req.body.salaryMin && value < req.body.salaryMin) {
        throw new Error('El salario máximo debe ser mayor o igual al mínimo');
      }
      return true;
    }),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Fecha de expiración inválida')
    .custom((value) => {
      const expirationDate = new Date(value);
      const now = new Date();
      if (expirationDate <= now) {
        throw new Error('La fecha de expiración debe ser en el futuro');
      }
      return true;
    }),
  body('skills').optional().isArray().withMessage('Skills debe ser un arreglo'),
];

const update = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('El título debe tener al menos 5 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20 })
    .withMessage('La descripción debe tener al menos 20 caracteres'),
  body('jobType')
    .optional()
    .isIn([
      JOB_TYPES.FULL_TIME,
      JOB_TYPES.PART_TIME,
      JOB_TYPES.CONTRACT,
      JOB_TYPES.INTERNSHIP,
      JOB_TYPES.TEMPORARY,
    ])
    .withMessage('Tipo de trabajo inválido'),
  body('workMode')
    .optional()
    .isIn([WORK_MODES.REMOTE, WORK_MODES.ON_SITE, WORK_MODES.HYBRID])
    .withMessage('Modo de trabajo inválido'),
  body('salaryMin')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Salario mínimo inválido'),
  body('salaryMax')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Salario máximo inválido')
    .custom((value, { req }) => {
      if (req.body.salaryMin && value < req.body.salaryMin) {
        throw new Error('El salario máximo debe ser mayor o igual al mínimo');
      }
      return true;
    }),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Fecha de expiración inválida')
    .custom((value) => {
      const expirationDate = new Date(value);
      const now = new Date();
      if (expirationDate <= now) {
        throw new Error('La fecha de expiración debe ser en el futuro');
      }
      return true;
    }),
  body('skills').optional().isArray().withMessage('Skills debe ser un arreglo'),
];

module.exports = {
  create,
  update,
};
