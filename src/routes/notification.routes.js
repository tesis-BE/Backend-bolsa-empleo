const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notification.controller');
const { authMiddleware } = require('../middlewares');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener notificaciones del usuario
router.get(
  '/',
  NotificationController.getMyNotifications.bind(NotificationController)
);

// Obtener conteo de notificaciones no leídas
router.get(
  '/unread-count',
  NotificationController.getUnreadCount.bind(NotificationController)
);

// Marcar todas como leídas
router.patch(
  '/read-all',
  NotificationController.markAllAsRead.bind(NotificationController)
);

// Marcar una notificación como leída
router.patch(
  '/:id/read',
  NotificationController.markAsRead.bind(NotificationController)
);

// Eliminar notificación
router.delete(
  '/:id',
  NotificationController.delete.bind(NotificationController)
);

module.exports = router;
