const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/role.controller');
const { authMiddleware, roleMiddleware } = require('../middlewares');
const { USER_TYPES } = require('../config/constants');

// Todas las rutas requieren autenticación y ser admin
router.use(authMiddleware);
router.use(roleMiddleware([USER_TYPES.ADMIN]));

// CRUD de roles
router.get('/', RoleController.getAll.bind(RoleController));
router.get('/:id', RoleController.getById.bind(RoleController));
router.post('/', RoleController.create.bind(RoleController));
router.put('/:id', RoleController.update.bind(RoleController));
router.patch('/:id', RoleController.update.bind(RoleController));
router.delete('/:id', RoleController.delete.bind(RoleController));

// Permisos
router.post(
  '/:id/permissions',
  RoleController.assignPermission.bind(RoleController)
);
router.delete(
  '/:id/permissions/:permissionId',
  RoleController.removePermission.bind(RoleController)
);

module.exports = router;
