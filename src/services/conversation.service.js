const BaseService = require('./base.service');
const {
  Conversation,
  Message,
  Application,
  Job,
  User,
  Company,
} = require('../models');

class ConversationService extends BaseService {
  constructor() {
    super(Conversation);
  }

  normalizeParticipants(userIdA, userIdB) {
    const a = parseInt(userIdA);
    const b = parseInt(userIdB);
    return a < b ? [a, b] : [b, a];
  }

  async findById(id, options = {}) {
    return Conversation.findByPk(id, {
      include: [
        {
          model: Application,
          as: 'application',
          include: [
            {
              model: Job,
              as: 'job',
              include: [{ model: Company, as: 'company' }],
            },
          ],
        },
        {
          model: User,
          as: 'graduate',
          attributes: ['id', 'firstName', 'lastName', 'email', 'photoUrl'],
        },
        {
          model: User,
          as: 'recruiter',
          attributes: ['id', 'firstName', 'lastName', 'email', 'photoUrl'],
        },
      ],
      ...options,
    });
  }

  async getByUser(userId, page = 1, pageSize = 20) {
    const { Op } = require('sequelize');
    const sequelize = require('../config/database');

    const result = await this.paginate({
      page,
      pageSize,
      where: {
        [Op.or]: [{ graduateId: userId }, { recruiterId: userId }],
      },
      include: [
        {
          model: Application,
          as: 'application',
          include: [{ model: Job, as: 'job' }],
        },
        {
          model: User,
          as: 'graduate',
          attributes: ['id', 'firstName', 'lastName', 'email', 'photoUrl'],
        },
        {
          model: User,
          as: 'recruiter',
          attributes: ['id', 'firstName', 'lastName', 'email', 'photoUrl'],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    // Agregar lastMessage y unreadCount para cada conversación
    if (result.data && result.data.length > 0) {
      for (const conversation of result.data) {
        // Obtener el último mensaje
        const lastMessage = await Message.findOne({
          where: { conversationId: conversation.id },
          order: [['createdAt', 'DESC']],
          limit: 1,
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'firstName', 'lastName', 'photoUrl'],
            },
          ],
        });

        // Calcular mensajes no leídos
        const unreadCount = await Message.count({
          where: {
            conversationId: conversation.id,
            senderId: { [Op.ne]: userId },
            isRead: false,
          },
        });

        // Agregar campos virtuales
        conversation.dataValues.lastMessage = lastMessage || null;
        conversation.dataValues.unreadCount = unreadCount;
      }
    }

    return result;
  }

  async getByApplication(applicationId) {
    return Conversation.findOne({
      where: { applicationId },
      include: [
        {
          model: User,
          as: 'graduate',
          attributes: ['id', 'firstName', 'lastName', 'email', 'photoUrl'],
        },
        {
          model: User,
          as: 'recruiter',
          attributes: ['id', 'firstName', 'lastName', 'email', 'photoUrl'],
        },
      ],
    });
  }

  async canAccessConversation(conversationId, userId) {
    const conversation = await Conversation.findByPk(conversationId);

    if (!conversation) {
      return false;
    }

    return (
      conversation.graduateId === userId || conversation.recruiterId === userId
    );
  }

  async findOrCreateDirect(userIdA, userIdB) {
    const [participantOneId, participantTwoId] = this.normalizeParticipants(
      userIdA,
      userIdB
    );

    const existing = await Conversation.findOne({
      where: {
        applicationId: null,
        graduateId: participantOneId,
        recruiterId: participantTwoId,
      },
      include: [
        {
          model: User,
          as: 'graduate',
          attributes: ['id', 'firstName', 'lastName', 'email', 'photoUrl'],
        },
        {
          model: User,
          as: 'recruiter',
          attributes: ['id', 'firstName', 'lastName', 'email', 'photoUrl'],
        },
      ],
    });

    if (existing) {
      return existing;
    }

    const created = await Conversation.create({
      applicationId: null,
      graduateId: participantOneId,
      recruiterId: participantTwoId,
    });

    return this.findById(created.id);
  }

  async findOrCreateConversation({ graduateId, recruiterId, applicationId }) {
    if (applicationId) {
      const existingByApp = await Conversation.findOne({
        where: { applicationId },
      });
      if (existingByApp) {
        return this.findById(existingByApp.id);
      }
    }

    const existing = await Conversation.findOne({
      where: {
        applicationId: applicationId || null,
        graduateId,
        recruiterId,
      },
    });

    if (existing) {
      return this.findById(existing.id);
    }

    const created = await Conversation.create({
      applicationId: applicationId || null,
      graduateId,
      recruiterId,
    });

    return this.findById(created.id);
  }

  async getUnreadCount(userId) {
    const { Op } = require('sequelize');

    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [{ graduateId: userId }, { recruiterId: userId }],
      },
      include: [
        {
          model: Message,
          as: 'messages',
          where: {
            senderId: { [Op.ne]: userId },
            readAt: null,
          },
          required: false,
        },
      ],
    });

    let unreadCount = 0;
    conversations.forEach((conv) => {
      unreadCount += conv.messages ? conv.messages.length : 0;
    });

    return unreadCount;
  }

  async deleteConversation(id) {
    // Eliminar todos los mensajes de la conversación primero
    const Message = require('../models').Message;
    await Message.destroy({
      where: { conversationId: id },
    });

    // Luego eliminar la conversación
    return Conversation.destroy({
      where: { id },
    });
  }
}

module.exports = new ConversationService();
