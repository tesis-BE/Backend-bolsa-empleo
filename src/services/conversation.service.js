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

    return this.paginate({
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
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['createdAt', 'DESC']],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });
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

    return Conversation.create({
      applicationId: null,
      graduateId: participantOneId,
      recruiterId: participantTwoId,
    });
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
}

module.exports = new ConversationService();
