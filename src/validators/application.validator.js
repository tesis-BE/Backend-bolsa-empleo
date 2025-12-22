const { body } = require('express-validator');
const { APPLICATION_STATUS } = require('../config/constants');

const apply = [
  body('jobId').isInt({ min: 1 }).withMessage('ID de trabajo inválido'),
  body('coverLetter').optional().trim(),
];

const applyByRecruiter = [
  body('jobId').isInt({ min: 1 }).withMessage('ID de trabajo inválido'),
  body('userId').isInt({ min: 1 }).withMessage('ID de candidato inválido'),
  body('coverLetter').optional().trim(),
];

const updateStatus = [
  body('status')
    .isIn(Object.values(APPLICATION_STATUS))
    .withMessage('Estado inválido'),
  body('rejectionReason').optional().trim(),
];

module.exports = {
  apply,
  applyByRecruiter,
  updateStatus,
};
