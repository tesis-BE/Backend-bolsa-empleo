const { body } = require('express-validator');

const updateProfile = [
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('phone').optional(),
  body('bio').optional().trim(),
  body('linkedinUrl').optional(),
  body('availableForWork').optional(),
];

const addSkill = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la habilidad es requerido'),
  body('level').optional(),
];

const addPortfolioLink = [
  body('title').trim().notEmpty().withMessage('El título es requerido'),
  body('url').notEmpty().withMessage('La URL es requerida'),
  body('description').optional().trim(),
];

module.exports = {
  updateProfile,
  addSkill,
  addPortfolioLink,
};
