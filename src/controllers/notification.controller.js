const NotificationService = require('../services/notification.service');
const ApiResponse = require('../utils/response.util');

class NotificationController {
  async getMyNotifications(req, res) {
    try {
      const { page = 1, pageSize = 20, unreadOnly = false } = req.query;
      const result = await NotificationService.getByUser(
        req.user.id,
        parseInt(page),
        parseInt(pageSize),
        unreadOnly === 'true'
      );
      return res
        .status(200)
        .json(ApiResponse.paginated('Notificaciones obtenidas', result));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async getUnreadCount(req, res) {
    try {
      const count = await NotificationService.getUnreadCount(req.user.id);
      return res
        .status(200)
        .json(ApiResponse.success('Conteo de notificaciones', { count }));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async markAsRead(req, res) {
    try {
      const notification = await NotificationService.markAsRead(
        req.params.id,
        req.user.id
      );
      return res
        .status(200)
        .json(
          ApiResponse.success('Notificación marcada como leída', notification)
        );
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async markAllAsRead(req, res) {
    try {
      await NotificationService.markAllAsRead(req.user.id);
      return res
        .status(200)
        .json(
          ApiResponse.success('Todas las notificaciones marcadas como leídas')
        );
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async delete(req, res) {
    try {
      const notification = await NotificationService.findById(req.params.id);

      if (!notification) {
        return res
          .status(404)
          .json(ApiResponse.error('Notificación no encontrada'));
      }

      await NotificationService.delete(req.params.id);
      return res
        .status(200)
        .json(ApiResponse.success('Notificación eliminada'));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  // Método de testing para enviar notificaciones de prueba (solo desarrollo)
  async sendTestNotification(req, res) {
    try {
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json(ApiResponse.error('No disponible en producción'));
      }

      const { 
        eventType = 'new_message', 
        title = 'Notificación de prueba', 
        message = 'Esta es una notificación de testing',
        relatedId = null 
      } = req.body;

      console.log('🧪 [TEST] Enviando notificación de prueba:', {
        userId: req.user.id,
        eventType,
        title,
        message,
        relatedId
      });

      // Crear la notificación
      const notification = await NotificationService.create({
        userId: req.user.id,
        eventType,
        title,
        message,
        relatedId,
        data: { test: true, timestamp: new Date().toISOString() }
      });

      return res.status(200).json(
        ApiResponse.success('Notificación de prueba enviada', notification)
      );
    } catch (error) {
      console.error('❌ [TEST] Error enviando notificación de prueba:', error);
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new NotificationController();
