const rateLimit = require('express-rate-limit');

// Rate limiter para endpoints de autenticación
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por ventana
  message: {
    success: false,
    message:
      'Demasiados intentos de inicio de sesión. Por favor, intente más tarde.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // No omitir peticiones exitosas del contador
});

// Rate limiter general para API
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // 100 requests por ventana
  message: {
    success: false,
    message: 'Demasiadas peticiones. Por favor, intente más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para mensajes del chat (protección contra spam)
const messageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // 30 mensajes por minuto
  message: {
    success: false,
    message: 'Está enviando mensajes muy rápido. Por favor, espere un momento.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para subida de archivos
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 archivos por ventana
  message: {
    success: false,
    message: 'Demasiadas subidas de archivos. Por favor, intente más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  apiLimiter,
  messageLimiter,
  uploadLimiter,
};
