const BaseService = require('./base.service');
const { Notification } = require('../models');
const { Op } = require('sequelize');

class NotificationService extends BaseService {
  constructor() {
    super(Notification);
  }

  async getByUser(userId, page = 1, pageSize = 20, unreadOnly = false) {
    const whereClause = { userId };

    if (unreadOnly) {
      whereClause.readAt = null;
    }

    return this.paginate({
      page,
      pageSize,
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });
  }

  async getUnreadCount(userId) {
    return this.count({
      where: {
        userId,
        readAt: null,
      },
    });
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new Error('Notificación no encontrada');
    }

    await notification.update({ readAt: new Date() });
    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.update(
      { readAt: new Date() },
      { where: { userId, readAt: null } }
    );
    return true;
  }

  async deleteOld(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    await Notification.destroy({
      where: {
        createdAt: { [Op.lt]: cutoffDate },
        readAt: { [Op.ne]: null }, // Solo eliminar las ya leídas
      },
    });
    return true;
  }

  async create(data) {
    return Notification.create(data);
  }
}

module.exports = new NotificationService();
