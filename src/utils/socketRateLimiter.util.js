/**
 * Rate Limiter para WebSocket
 * Previene spam de mensajes y eventos
 */

class SocketRateLimiter {
  constructor(options = {}) {
    this.maxRequests = options.maxRequests || 10; // Máximo de peticiones
    this.windowMs = options.windowMs || 60000; // Ventana de tiempo (1 minuto)
    this.blockDurationMs = options.blockDurationMs || 300000; // Tiempo de bloqueo (5 minutos)
    this.requests = new Map(); // userId -> { count, resetTime, blockedUntil }
  }

  /**
   * Verifica si un usuario puede hacer una petición
   */
  canMakeRequest(userId) {
    const now = Date.now();
    const userRecord = this.requests.get(userId);

    // Si no hay registro, crear uno nuevo
    if (!userRecord) {
      this.requests.set(userId, {
        count: 1,
        resetTime: now + this.windowMs,
        blockedUntil: null,
      });
      return { allowed: true };
    }

    // Si está bloqueado, verificar si ya pasó el tiempo de bloqueo
    if (userRecord.blockedUntil && now < userRecord.blockedUntil) {
      const remainingTime = Math.ceil((userRecord.blockedUntil - now) / 1000);
      return {
        allowed: false,
        reason: 'rate_limit_exceeded',
        message: `Demasiadas peticiones. Bloqueado por ${remainingTime} segundos más.`,
        retryAfter: remainingTime,
      };
    }

    // Si ya pasó el tiempo de bloqueo, desbloquear
    if (userRecord.blockedUntil && now >= userRecord.blockedUntil) {
      userRecord.count = 1;
      userRecord.resetTime = now + this.windowMs;
      userRecord.blockedUntil = null;
      return { allowed: true };
    }

    // Si ya pasó la ventana de tiempo, resetear contador
    if (now >= userRecord.resetTime) {
      userRecord.count = 1;
      userRecord.resetTime = now + this.windowMs;
      return { allowed: true };
    }

    // Incrementar contador
    userRecord.count++;

    // Si excede el límite, bloquear
    if (userRecord.count > this.maxRequests) {
      userRecord.blockedUntil = now + this.blockDurationMs;
      const blockTime = Math.ceil(this.blockDurationMs / 1000);
      return {
        allowed: false,
        reason: 'rate_limit_exceeded',
        message: `Límite de ${this.maxRequests} peticiones por minuto excedido. Bloqueado por ${blockTime} segundos.`,
        retryAfter: blockTime,
      };
    }

    return { allowed: true };
  }

  /**
   * Resetea el límite de un usuario
   */
  reset(userId) {
    this.requests.delete(userId);
  }

  /**
   * Limpia registros antiguos (para evitar memory leaks)
   */
  cleanup() {
    const now = Date.now();
    for (const [userId, record] of this.requests.entries()) {
      // Eliminar registros de usuarios que no están bloqueados y cuya ventana ya pasó
      if (!record.blockedUntil && now >= record.resetTime) {
        this.requests.delete(userId);
      }
      // Eliminar registros de usuarios cuyo bloqueo ya expiró hace más de 1 hora
      if (record.blockedUntil && now > record.blockedUntil + 3600000) {
        this.requests.delete(userId);
      }
    }
  }

  /**
   * Obtiene estadísticas del rate limiter
   */
  getStats() {
    return {
      totalUsers: this.requests.size,
      blockedUsers: Array.from(this.requests.values()).filter(
        (r) => r.blockedUntil && Date.now() < r.blockedUntil
      ).length,
    };
  }
}

/**
 * Middleware para aplicar rate limiting en eventos de socket
 */
const createSocketRateLimiter = (options) => {
  const limiter = new SocketRateLimiter(options);

  // Limpiar registros antiguos cada 10 minutos
  setInterval(() => limiter.cleanup(), 600000);

  return {
    check: (socket, callback) => {
      const userId = socket.userId;

      if (!userId) {
        return callback({
          allowed: false,
          reason: 'unauthorized',
          message: 'Usuario no autenticado',
        });
      }

      const result = limiter.canMakeRequest(userId);

      if (!result.allowed) {
        socket.emit('rate_limit_exceeded', {
          message: result.message,
          retryAfter: result.retryAfter,
        });
      }

      return callback(result);
    },
    reset: (userId) => limiter.reset(userId),
    getStats: () => limiter.getStats(),
  };
};

module.exports = {
  SocketRateLimiter,
  createSocketRateLimiter,
};
