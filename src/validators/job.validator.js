const { body } = require('express-validator');
const { JOB_TYPES, WORK_MODES } = require('../config/constants');

const create = [
  body('title').trim().notEmpty().withMessage('El título es requerido'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida'),
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
  body('salaryMin').optional(),
  body('salaryMax').optional(),
  body('expiresAt').optional(),
  body('skills').optional(),
];

const update = [
  body('title').optional().trim(),
  body('description').optional().trim(),
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
  body('salaryMin').optional(),
  body('salaryMax').optional(),
  body('expiresAt').optional(),
  body('skills').optional(),
];

module.exports = {
  create,
  update,
};
