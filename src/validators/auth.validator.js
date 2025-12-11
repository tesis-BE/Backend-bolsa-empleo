const { body } = require('express-validator');

const register = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('personalEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email personal inválido'),
  body('institutionalEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email institucional inválido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una mayúscula')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe contener al menos un número'),
  body('firstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('lastName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('El apellido debe tener al menos 2 caracteres'),
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
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La nueva contraseña debe contener al menos una mayúscula')
    .matches(/[0-9]/)
    .withMessage('La nueva contraseña debe contener al menos un número'),
];

module.exports = {
  register,
  login,
  changePassword,
};
