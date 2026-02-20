const { body } = require('express-validator');

const updateProfile = [
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('institutionalEmail')
    .optional({ values: 'null' })
    .custom((value) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      // Si tiene valor, validar que sea email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        throw new Error('El correo institucional debe ser válido');
      }
      return true;
    }),
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
  body('type')
    .optional({ nullable: true })
    .isIn(['github', 'linkedin', 'website', 'behance', 'dribbble', 'other'])
    .withMessage('Tipo de portfolio inválido'),
  body('description').optional().trim(),
];

module.exports = {
  updateProfile,
  addSkill,
  addPortfolioLink,
};
