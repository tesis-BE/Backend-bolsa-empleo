const { body } = require('express-validator');
const { JOB_TYPES, WORK_MODES } = require('../config/constants');

const create = [
  body('title').trim().notEmpty().withMessage('El título es requerido'),
  body('description').trim().notEmpty().withMessage('La descripción es requerida'),
  body('jobType').optional(),
  body('workMode').optional(),
  body('salaryMin').optional(),
  body('salaryMax').optional(), 
  body('deadline').optional(),
  body('location').optional(),
  body('requirements').optional(),
  body('skills').optional(),
];

const update = [
  body('title').optional().trim(),
  body('description').optional().trim(),
  body('jobType').optional(),
  body('workMode').optional(),
  body('salaryMin').optional(),
  body('salaryMax').optional(),
  body('deadline').optional(),
  body('location').optional(),
  body('requirements').optional(), 
  body('skills').optional(),
];

module.exports = {
  create,
  update,
};
