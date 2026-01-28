const ApiResponse = require('../utils/response.util');

const errorHandler = (err, req, res, next) => {
  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return ApiResponse.error(res, 'Archivo demasiado grande', 400);
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return ApiResponse.error(res, 'Demasiados archivos', 400);
    }
  }

  // Custom file validation error
  if (err.message && err.message.includes('Tipo de archivo')) {
    return ApiResponse.error(res, err.message, 400);
  }

  // Validation errors
  if (err.status === 400) {
    return ApiResponse.error(res, err.message, 400);
  }

  // Default error
  return ApiResponse.error(
    res,
    err.message || 'Error interno del servidor',
    500
  );
};

module.exports = errorHandler;
