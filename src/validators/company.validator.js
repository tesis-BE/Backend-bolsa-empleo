const { body } = require('express-validator');

const create = [
  body('name')
    .trim()
    .escape()
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre de la empresa debe tener entre 2 y 255 caracteres'),
  body('description')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La descripción debe tener entre 10 y 2000 caracteres'),
  body('industry')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2, max: 100 })
    .withMessage('La industria debe tener entre 2 y 100 caracteres'),
  body('website').optional().isURL().withMessage('URL de sitio web inválida'),
  body('location')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2, max: 255 })
    .withMessage('La ubicación debe tener entre 2 y 255 caracteres'),
];

const update = [
  body('name')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre de la empresa debe tener entre 2 y 255 caracteres'),
  body('description')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 10, max: 2000 })
    .withMessage('La descripción debe tener entre 10 y 2000 caracteres'),
  body('industry')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2, max: 100 })
    .withMessage('La industria debe tener entre 2 y 100 caracteres'),
  body('website').optional().isURL().withMessage('URL de sitio web inválida'),
  body('location')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 2, max: 255 })
    .withMessage('La ubicación debe tener entre 2 y 255 caracteres'),
];

module.exports = {
  create,
  update,
};
