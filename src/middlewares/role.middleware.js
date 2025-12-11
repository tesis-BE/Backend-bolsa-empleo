const ApiResponse = require('../utils/response.util');
const { USER_TYPES } = require('../config/constants');

const roleMiddleware = (allowedRoles) => {
  // Asegurar que allowedRoles sea un array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(ApiResponse.error('No autenticado'));
    }

    if (!roles.includes(req.user.userType)) {
      return res.status(403).json(ApiResponse.error('Acceso denegado'));
    }

    next();
  };
};

const isAdmin = roleMiddleware([USER_TYPES.ADMIN]);
const isRecruiter = roleMiddleware([USER_TYPES.RECRUITER]);
const isGraduate = roleMiddleware([USER_TYPES.GRADUATE]);

module.exports = {
  roleMiddleware,
  isAdmin,
  isRecruiter,
  isGraduate,
};
