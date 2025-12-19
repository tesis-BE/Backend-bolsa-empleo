const { body } = require('express-validator');
const { APPLICATION_STATUS } = require('../config/constants');

const apply = [
  body('jobId').isInt({ min: 1 }).withMessage('ID de trabajo inválido'),
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('La carta de presentación no puede exceder 2000 caracteres'),
];

const applyByRecruiter = [
  body('jobId').isInt({ min: 1 }).withMessage('ID de trabajo inválido'),
  body('userId').isInt({ min: 1 }).withMessage('ID de candidato inválido'),
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('La carta de presentación no puede exceder 2000 caracteres'),
];

const updateStatus = [
  body('status')
    .isIn(Object.values(APPLICATION_STATUS))
    .withMessage('Estado inválido'),
  body('rejectionReason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('El motivo del rechazo no puede exceder 500 caracteres'),
];

module.exports = {
  apply,
  applyByRecruiter,
  updateStatus,
};
