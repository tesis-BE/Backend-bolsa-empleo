const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares');
const { userValidator } = require('../validators');
const { upload } = require('../config/multer');
const { USER_TYPES } = require('../config/constants');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Directorio de egresados (todos pueden ver)
router.get('/graduates', UserController.getGraduates.bind(UserController));

// Perfil del usuario actual
router.get('/profile', UserController.getProfile.bind(UserController));
router.put(
  '/profile',
  userValidator.updateProfile,
  UserController.updateProfile.bind(UserController)
);

// Subir archivos
router.post(
  '/photo',
  upload.single('photo'),
  UserController.uploadPhoto.bind(UserController)
);
router.post(
  '/cv',
  upload.single('cv'),
  UserController.uploadCV.bind(UserController)
);

// Habilidades (solo egresados)
router.post(
  '/skills',
  roleMiddleware([USER_TYPES.GRADUATE]),
  userValidator.addSkill,
  UserController.addSkill.bind(UserController)
);
router.delete(
  '/skills/:skillId',
  roleMiddleware([USER_TYPES.GRADUATE]),
  UserController.removeSkill.bind(UserController)
);

// Portafolio (solo egresados)
router.post(
  '/portfolio',
  roleMiddleware([USER_TYPES.GRADUATE]),
  userValidator.addPortfolioLink,
  UserController.addPortfolioLink.bind(UserController)
);
router.delete(
  '/portfolio/:portfolioId',
  roleMiddleware([USER_TYPES.GRADUATE]),
  UserController.removePortfolioLink.bind(UserController)
);

// Disponibilidad (solo egresados)
router.patch(
  '/availability',
  roleMiddleware([USER_TYPES.GRADUATE]),
  UserController.toggleAvailability.bind(UserController)
);

// Ver perfil de otro usuario (por ID)
router.get('/:id', UserController.getProfile.bind(UserController));

module.exports = router;
