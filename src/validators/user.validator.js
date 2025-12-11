const { body } = require('express-validator');

const updateProfile = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('El apellido debe tener al menos 2 caracteres'),
  body('phone')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Número de teléfono inválido'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La biografía no puede exceder 500 caracteres'),
  body('linkedinUrl')
    .optional()
    .isURL()
    .withMessage('URL de LinkedIn inválida'),
  body('availableForWork')
    .optional()
    .isBoolean()
    .withMessage('availableForWork debe ser booleano'),
];

const addSkill = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la habilidad es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Nivel inválido'),
];

const addPortfolioLink = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ max: 100 })
    .withMessage('El título no puede exceder 100 caracteres'),
  body('url').isURL().withMessage('URL inválida'),
  body('description')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres'),
];

module.exports = {
  updateProfile,
  addSkill,
  addPortfolioLink,
};
