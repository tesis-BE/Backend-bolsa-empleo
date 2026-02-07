const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authMiddleware, isAdmin } = require('../middlewares');
const { userValidator, authValidator } = require('../validators');
const { upload, validateFileContent } = require('../config/multer');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas específicas primero (para evitar conflictos con /:id)

// Perfil del usuario actual
router.get('/profile', UserController.getProfile.bind(UserController));
router.put(
  '/profile',
  userValidator.updateProfile,
  UserController.updateProfile.bind(UserController)
);

// Directorio de egresados (todos pueden ver)
router.get('/graduates', UserController.getGraduates.bind(UserController));

// Subir archivos
router.post(
  '/photo',
  upload.single('photo'),
  validateFileContent,
  UserController.uploadPhoto.bind(UserController)
);
router.post(
  '/cv',
  upload.single('cv'),
  validateFileContent,
  UserController.uploadCV.bind(UserController)
);

// Habilidades
router.post(
  '/skills',
  userValidator.addSkill,
  UserController.addSkill.bind(UserController)
);
router.delete(
  '/skills/:skillId',
  UserController.removeSkill.bind(UserController)
);

// Portafolio
router.post(
  '/portfolio',
  userValidator.addPortfolioLink,
  UserController.addPortfolioLink.bind(UserController)
);
router.delete(
  '/portfolio/:portfolioId',
  UserController.removePortfolioLink.bind(UserController)
);

// Disponibilidad
router.patch(
  '/availability',
  UserController.toggleAvailability.bind(UserController)
);

// Rutas de colección (sin :id)

// Listar todos los usuarios
router.get('/', UserController.getAllUsers.bind(UserController));

// Crear usuario
router.post(
  '/',
  authValidator.register,
  UserController.createUser.bind(UserController)
);

// Rutas con parámetro :id (al final para mayor especificidad)

// Cambiar estado
router.patch(
  '/:id/status',
  UserController.toggleUserStatus.bind(UserController)
);

// Cambiar tipo de usuario (admin)
router.patch(
  '/:id/user-type',
  UserController.changeUserType.bind(UserController)
);

// Roles del usuario (admin)
router.get(
  '/:id/roles',
  isAdmin,
  UserController.getUserRoles.bind(UserController)
);
router.post(
  '/:id/roles',
  isAdmin,
  UserController.assignRole.bind(UserController)
);
router.delete(
  '/:id/roles/:roleId',
  isAdmin,
  UserController.removeRole.bind(UserController)
);

// Permisos del usuario
router.get(
  '/:id/permissions',
  UserController.getUserPermissions.bind(UserController)
);

// Actualizar usuario
router.put(
  '/:id',
  userValidator.updateProfile,
  UserController.updateUser.bind(UserController)
);

// Eliminar usuario
router.delete('/:id', UserController.deleteUser.bind(UserController));

// Ver perfil de otro usuario (por ID)
router.get('/:id', UserController.getProfile.bind(UserController));

module.exports = router;
