const { body } = require('express-validator');

const create = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El correo es requerido')
    .isEmail().withMessage('Ingresa un correo válido'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9]{7,15}$/).withMessage('El teléfono debe tener entre 7 y 15 dígitos'),
  body('position')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('El cargo no puede exceder 255 caracteres'),
  body('existingCompanyId')
    .optional({ nullable: true })
    .isInt().withMessage('ID de empresa inválido'),
  body('companyName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 }).withMessage('El nombre de empresa debe tener entre 2 y 255 caracteres'),
  body('companyIndustry')
    .optional()
    .trim(),
  body('companySize')
    .optional()
    .trim(),
  body('companyLocation')
    .optional()
    .trim(),
  body('companyWebsite')
    .optional()
    .trim(),
  body('companyDescription')
    .optional()
    .trim(),
];

module.exports = { create };
