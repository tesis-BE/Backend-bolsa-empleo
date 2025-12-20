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
    .isLength({ min: 8, max: 128 })
    .withMessage('La contraseña debe tener entre 8 y 128 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La contraseña debe contener al menos una mayúscula')
    .matches(/[0-9]/)
    .withMessage('La contraseña debe contener al menos un número')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('La contraseña debe contener al menos un carácter especial'),
  body('firstName')
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('lastName')
    .trim()
    .escape()
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
    .isLength({ min: 8, max: 128 })
    .withMessage('La nueva contraseña debe tener entre 8 y 128 caracteres')
    .matches(/[A-Z]/)
    .withMessage('La nueva contraseña debe contener al menos una mayúscula')
    .matches(/[0-9]/)
    .withMessage('La nueva contraseña debe contener al menos un número')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage(
      'La nueva contraseña debe contener al menos un carácter especial'
    ),
];

module.exports = {
  register,
  login,
  changePassword,
};
