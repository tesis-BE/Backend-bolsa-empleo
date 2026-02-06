const BaseService = require('./base.service');
const { Message, Conversation, User } = require('../models');
const NotificationService = require('./notification.service');
const { Op } = require('sequelize');

class MessageService extends BaseService {
  constructor() {
    super(Message);
  }

  async getByConversation(conversationId, page = 1, pageSize = 50) {
    return this.paginate({
      page,
      pageSize,
      where: { conversationId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'photoUrl'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });
  }

  async send(conversationId, senderId, content, attachmentUrl = null) {
    // Verificar que el usuario tiene acceso a la conversación
    const conversation = await Conversation.findByPk(conversationId);

    if (!conversation) {
      throw new Error('Conversación no encontrada');
    }

    if (
      conversation.graduateId !== senderId &&
      conversation.recruiterId !== senderId
    ) {
      throw new Error('No tienes acceso a esta conversación');
    }

    // Crear mensaje
    const message = await Message.create({
      conversationId,
      senderId,
      content,
      attachmentUrl,
    });

    // Actualizar la conversación
    await conversation.update({
      updatedAt: new Date(),
      lastMessageAt: new Date(),
    });

    // Determinar el receptor
    let recipientId = null;
    if (conversation.graduateId && conversation.recruiterId) {
      recipientId =
        conversation.graduateId === senderId
          ? conversation.recruiterId
          : conversation.graduateId;
    } else if (conversation.participantOneId && conversation.participantTwoId) {
      recipientId =
        conversation.participantOneId === senderId
          ? conversation.participantTwoId
          : conversation.participantOneId;
    }

    // Obtener datos del sender para la notificación
    const sender = await User.findByPk(senderId, {
      attributes: ['firstName', 'lastName'],
    });

    // Notificar al receptor
    if (recipientId) {
      await NotificationService.create({
        userId: recipientId,
        title: 'Nuevo mensaje',
        message: `${sender.firstName} ${sender.lastName} te ha enviado un mensaje`,
        type: 'info',
        eventType: 'new_message',
        relatedId: conversationId,
      });
    }

    // Emitir mensaje por socket en tiempo real
    if (global.io) {
      const messageData = {
        id: message.id,
        conversationId: Number(conversationId),
        senderId,
        senderName: `${sender.firstName} ${sender.lastName}`,
        content,
        attachmentUrl,
        createdAt: message.createdAt,
        isRead: false
      };
      
      global.io.to(`conversation_${conversationId}`).emit('new_message', messageData);
    }

    // Retornar mensaje con datos del sender
    return Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'photoUrl'],
        },
      ],
    });
  }

  async markAsRead(messageId, userId) {
    const message = await Message.findByPk(messageId, {
      include: [{ model: Conversation, as: 'conversation' }],
    });

    if (!message) {
      throw new Error('Mensaje no encontrado');
    }

    // Verificar que el usuario tiene acceso
    const conversation = message.conversation;
    if (
      conversation.graduateId !== userId &&
      conversation.recruiterId !== userId
    ) {
      throw new Error('No tienes acceso a este mensaje');
    }

    // Solo marcar como leído si no es el sender
    if (message.senderId !== userId && !message.readAt) {
      await message.update({ readAt: new Date(), isRead: true });
    }

    return message;
  }

  async markConversationAsRead(conversationId, userId) {
    // Verificar acceso
    const conversation = await Conversation.findByPk(conversationId);

    if (!conversation) {
      throw new Error('Conversación no encontrada');
    }

    if (
      conversation.graduateId !== userId &&
      conversation.recruiterId !== userId
    ) {
      throw new Error('No tienes acceso a esta conversación');
    }

    // Marcar todos los mensajes no leídos que no fueron enviados por el usuario
    await Message.update(
      { readAt: new Date(), isRead: true },
      {
        where: {
          conversationId,
          senderId: { [Op.ne]: userId },
          readAt: null,
        },
      }
    );

    return true;
  }

  async getUnreadCountForConversation(conversationId, userId) {
    return this.count({
      where: {
        conversationId,
        senderId: { [Op.ne]: userId },
        readAt: null,
      },
    });
  }
}

module.exports = new MessageService();
