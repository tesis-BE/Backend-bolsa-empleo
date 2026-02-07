const authMiddleware = require('./auth.middleware');
const {
  roleMiddleware,
  isAdmin,
  isRecruiter,
  isGraduate,
} = require('./role.middleware');
const { hasPermission, hasAnyPermission } = require('./permission.middleware');
const errorHandler = require('./error.middleware');
const requestLogger = require('./request-logger.middleware');

module.exports = {
  authMiddleware,
  roleMiddleware,
  isAdmin,
  isRecruiter,
  isGraduate,
  hasPermission,
  hasAnyPermission,
  errorHandler,
  requestLogger,
};
