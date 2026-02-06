const express = require('express');
const router = express.Router();
const PermissionController = require('../controllers/permission.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares');
const { USER_TYPES } = require('../config/constants');

// Todas las rutas requieren autenticación y ser admin
router.use(authMiddleware);
router.use(roleMiddleware([USER_TYPES.ADMIN]));

// Listar todos los permisos
router.get('/', PermissionController.getAll.bind(PermissionController));

// Obtener permisos por módulo
router.get(
  '/module/:module',
  PermissionController.getByModule.bind(PermissionController)
);

module.exports = router;
