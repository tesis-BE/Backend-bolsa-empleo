const { body } = require('express-validator');

const register = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('institutionalEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email institucional inválido'),
  body('cedula')
    .optional()
    .isLength({ min: 10, max: 10 })
    .withMessage('La cédula debe tener 10 dígitos')
    .isNumeric()
    .withMessage('La cédula debe ser numérica'),
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
  body('universityId')
    .notEmpty()
    .withMessage('La extensión es requerida')
    .isInt()
    .withMessage('El ID de extensión debe ser un número'),
  body('facultyId')
    .optional()
    .isInt()
    .withMessage('El ID de facultad debe ser un número'),
  body('careerId')
    .optional()
    .isInt()
    .withMessage('El ID de carrera debe ser un número'),
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

const activate = [
  body('token')
    .notEmpty()
    .withMessage('El token de activación es requerido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

module.exports = {
  register,
  login,
  changePassword,
  activate,
};
