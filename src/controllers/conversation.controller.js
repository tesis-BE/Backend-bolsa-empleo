const ConversationService = require('../services/conversation.service');
const MessageService = require('../services/message.service');
const ApiResponse = require('../utils/response.util');

class ConversationController {
  async getMyConversations(req, res) {
    try {
      const { page = 1, pageSize = 20 } = req.query;
      const result = await ConversationService.getByUser(
        req.user.id,
        parseInt(page),
        parseInt(pageSize)
      );
      return res
        .status(200)
        .json(ApiResponse.paginated('Conversaciones obtenidas', result));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async getById(req, res) {
    try {
      const conversation = await ConversationService.findById(req.params.id);

      if (!conversation) {
        return res
          .status(404)
          .json(ApiResponse.error('Conversación no encontrada'));
      }

      // Verificar acceso
      if (
        conversation.graduateId !== req.user.id &&
        conversation.recruiterId !== req.user.id
      ) {
        return res
          .status(403)
          .json(ApiResponse.error('No tienes acceso a esta conversación'));
      }

      return res
        .status(200)
        .json(ApiResponse.success('Conversación obtenida', conversation));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async getMessages(req, res) {
    try {
      // Verificar acceso
      const canAccess = await ConversationService.canAccessConversation(
        req.params.id,
        req.user.id
      );

      if (!canAccess) {
        return res
          .status(403)
          .json(ApiResponse.error('No tienes acceso a esta conversación'));
      }

      const { page = 1, pageSize = 50 } = req.query;
      const result = await MessageService.getByConversation(
        req.params.id,
        parseInt(page),
        parseInt(pageSize)
      );

      return res
        .status(200)
        .json(ApiResponse.paginated('Mensajes obtenidos', result));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async sendMessage(req, res) {
    try {
      const { content, attachmentUrl } = req.body;

      if (!content || content.trim() === '') {
        return res
          .status(400)
          .json(ApiResponse.error('El mensaje no puede estar vacío'));
      }

      const message = await MessageService.send(
        req.params.id,
        req.user.id,
        content,
        attachmentUrl
      );

      return res
        .status(201)
        .json(ApiResponse.created('Mensaje enviado', message));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async markAsRead(req, res) {
    try {
      await MessageService.markConversationAsRead(req.params.id, req.user.id);
      return res
        .status(200)
        .json(ApiResponse.success('Mensajes marcados como leídos'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async getUnreadCount(req, res) {
    try {
      const count = await ConversationService.getUnreadCount(req.user.id);
      return res
        .status(200)
        .json(ApiResponse.success('Conteo de mensajes no leídos', { count }));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async getByApplication(req, res) {
    try {
      const conversation = await ConversationService.getByApplication(
        req.params.applicationId
      );

      if (!conversation) {
        return res
          .status(404)
          .json(ApiResponse.error('No hay conversación para esta postulación'));
      }

      // Verificar acceso
      if (
        conversation.graduateId !== req.user.id &&
        conversation.recruiterId !== req.user.id
      ) {
        return res
          .status(403)
          .json(ApiResponse.error('No tienes acceso a esta conversación'));
      }

      return res
        .status(200)
        .json(ApiResponse.success('Conversación obtenida', conversation));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new ConversationController();
