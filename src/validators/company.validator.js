const { body } = require('express-validator');

const create = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('El nombre de la empresa debe tener al menos 2 caracteres'),
  body('description')
    .optional()
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),
  body('industry').optional().trim().isLength({ min: 2 }),
  body('website').optional().isURL().withMessage('URL de sitio web inválida'),
  body('location').optional().trim().isLength({ min: 2 }),
];

const update = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('El nombre de la empresa debe tener al menos 2 caracteres'),
  body('description')
    .optional()
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),
  body('industry').optional().trim().isLength({ min: 2 }),
  body('website').optional().isURL().withMessage('URL de sitio web inválida'),
  body('location').optional().trim().isLength({ min: 2 }),
];

module.exports = {
  create,
  update,
};
