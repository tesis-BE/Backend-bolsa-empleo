const { body, param } = require('express-validator');

const certificationValidator = {
  create: [
    body('name')
      .notEmpty()
      .withMessage('El nombre de la certificación es requerido')
      .isLength({ max: 255 })
      .withMessage('El nombre no puede exceder 255 caracteres'),
    body('issuingOrganization')
      .notEmpty()
      .withMessage('La organización emisora es requerida')
      .isLength({ max: 255 })
      .withMessage('La organización no puede exceder 255 caracteres'),
    body('issueDate')
      .notEmpty()
      .withMessage('La fecha de emisión es requerida')
      .isISO8601()
      .withMessage('Formato de fecha inválido'),
    body('expirationDate')
      .optional({ nullable: true })
      .isISO8601()
      .withMessage('Formato de fecha inválido')
      .custom((value, { req }) => {
        if (
          value &&
          req.body.issueDate &&
          new Date(value) < new Date(req.body.issueDate)
        ) {
          throw new Error(
            'La fecha de expiración debe ser posterior a la fecha de emisión'
          );
        }
        return true;
      }),
    body('credentialId')
      .optional()
      .isLength({ max: 255 })
      .withMessage('El ID de credencial no puede exceder 255 caracteres'),
    body('credentialUrl')
      .optional({ nullable: true, checkFalsy: true })
      .isURL()
      .withMessage('La URL de credencial debe ser válida'),
    body('description')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('La descripción no puede exceder 2000 caracteres'),
    body('doesNotExpire')
      .optional()
      .isBoolean()
      .withMessage('doesNotExpire debe ser un booleano'),
  ],

  update: [
    param('id').isInt().withMessage('ID inválido'),
    body('name')
      .optional()
      .isLength({ max: 255 })
      .withMessage('El nombre no puede exceder 255 caracteres'),
    body('issuingOrganization')
      .optional()
      .isLength({ max: 255 })
      .withMessage('La organización no puede exceder 255 caracteres'),
    body('issueDate')
      .optional()
      .isISO8601()
      .withMessage('Formato de fecha inválido'),
    body('expirationDate')
      .optional({ nullable: true })
      .isISO8601()
      .withMessage('Formato de fecha inválido')
      .custom((value, { req }) => {
        if (
          value &&
          req.body.issueDate &&
          new Date(value) < new Date(req.body.issueDate)
        ) {
          throw new Error(
            'La fecha de expiración debe ser posterior a la fecha de emisión'
          );
        }
        return true;
      }),
    body('credentialId')
      .optional()
      .isLength({ max: 255 })
      .withMessage('El ID de credencial no puede exceder 255 caracteres'),
    body('credentialUrl')
      .optional({ nullable: true, checkFalsy: true })
      .isURL()
      .withMessage('La URL de credencial debe ser válida'),
    body('description')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('La descripción no puede exceder 2000 caracteres'),
    body('doesNotExpire')
      .optional()
      .isBoolean()
      .withMessage('doesNotExpire debe ser un booleano'),
  ],

  delete: [param('id').isInt().withMessage('ID inválido')],
};

module.exports = certificationValidator;
