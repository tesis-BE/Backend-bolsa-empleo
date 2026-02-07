const ApiResponse = require('../utils/response.util');
const UserService = require('../services/user.service');

/**
 * Middleware que verifica si el usuario tiene TODOS los permisos requeridos
 * @param {string|string[]} requiredPermissions - Permiso(s) requerido(s)
 */
const hasPermission = (requiredPermissions) => {
  const permissions = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];

  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json(ApiResponse.error('No autenticado'));
      }

      // Admin siempre tiene acceso total
      if (req.user.userType === 'admin') {
        return next();
      }

      const userPermissions = await UserService.getUserPermissions(req.user.id);
      const permissionNames = userPermissions.map((p) => p.name);

      const hasAll = permissions.every((p) => permissionNames.includes(p));
      if (!hasAll) {
        return res.status(403).json(
          ApiResponse.error('No tienes permisos suficientes para esta acción')
        );
      }

      next();
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Error al verificar permisos'));
    }
  };
};

/**
 * Middleware que verifica si el usuario tiene AL MENOS UNO de los permisos requeridos
 * @param {string[]} requiredPermissions - Lista de permisos (se requiere al menos uno)
 */
const hasAnyPermission = (requiredPermissions) => {
  const permissions = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];

  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json(ApiResponse.error('No autenticado'));
      }

      // Admin siempre tiene acceso total
      if (req.user.userType === 'admin') {
        return next();
      }

      const userPermissions = await UserService.getUserPermissions(req.user.id);
      const permissionNames = userPermissions.map((p) => p.name);

      const hasAny = permissions.some((p) => permissionNames.includes(p));
      if (!hasAny) {
        return res.status(403).json(
          ApiResponse.error('No tienes permisos suficientes para esta acción')
        );
      }

      next();
    } catch (error) {
      return res.status(500).json(ApiResponse.error('Error al verificar permisos'));
    }
  };
};

module.exports = {
  hasPermission,
  hasAnyPermission,
};
