const express = require('express');
const router = express.Router();
const ConversationController = require('../controllers/conversation.controller');
const { authMiddleware } = require('../middlewares');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener conversaciones del usuario
router.get(
  '/',
  ConversationController.getMyConversations.bind(ConversationController)
);

// Obtener conteo de mensajes no leídos
router.get(
  '/unread-count',
  ConversationController.getUnreadCount.bind(ConversationController)
);

// Obtener conversación por postulación
router.get(
  '/application/:applicationId',
  ConversationController.getByApplication.bind(ConversationController)
);

// Obtener conversación por ID
router.get('/:id', ConversationController.getById.bind(ConversationController));

// Obtener mensajes de una conversación
router.get(
  '/:id/messages',
  ConversationController.getMessages.bind(ConversationController)
);

// Enviar mensaje
router.post(
  '/:id/messages',
  ConversationController.sendMessage.bind(ConversationController)
);

// Marcar conversación como leída
router.patch(
  '/:id/read',
  ConversationController.markAsRead.bind(ConversationController)
);

module.exports = router;
