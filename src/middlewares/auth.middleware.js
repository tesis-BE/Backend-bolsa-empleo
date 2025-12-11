const { verifyToken } = require('../utils/jwt.util');
const ApiResponse = require('../utils/response.util');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.error(res, 'Token no proporcionado', 401);
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    return ApiResponse.error(res, error.message || 'Token inválido', 401);
  }
};

module.exports = authMiddleware;
