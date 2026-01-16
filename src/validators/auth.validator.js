const { body } = require('express-validator');

const register = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('institutionalEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email institucional inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido debe tener entre 2 y 50 caracteres'),
  body('userType')
    .optional()
    .isIn(['graduate', 'recruiter', 'admin'])
    .withMessage('Tipo de usuario inválido'),
];

const login = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
];

const changePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  body('newPassword')
    .notEmpty()
    .withMessage('La nueva contraseña es requerida'),
];

module.exports = {
  register,
  login,
  changePassword,
};
