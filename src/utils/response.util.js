/**
 * ApiResponse - Utilidad para respuestas API estandarizadas
 * Uso: return res.status(200).json(ApiResponse.success('Mensaje', data))
 */
class ApiResponse {
  static success(message = 'Éxito', data = null) {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message = 'Error interno del servidor', errors = null) {
    return {
      success: false,
      message,
      errors,
    };
  }

  static created(message = 'Recurso creado', data = null) {
    return {
      success: true,
      message,
      data,
    };
  }

  static paginated(message = 'Éxito', result = {}) {
    const { data = [], pagination = {} } = result;
    return {
      success: true,
      message,
      data,
      pagination,
    };
  }
}

module.exports = ApiResponse;
