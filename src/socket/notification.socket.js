const { Notification, User } = require('../models');

// Map para rastrear usuarios conectados: userId -> socketId
const connectedUsers = new Map();

module.exports = (io) => {
  const notificationNamespace = io.of('/notifications');
  
  // Aplicar middleware de autenticación al namespace
  notificationNamespace.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Token no proporcionado'));
    }

    try {
      const { verifyToken } = require('../utils/jwt.util');
      const decoded = verifyToken(token);
      socket.userId = decoded.id;
      socket.userType = decoded.userType;
      socket.companyId = decoded.companyId;
      next();
    } catch (error) {
      next(new Error('Token inválido o expirado'));
    }
  });

  notificationNamespace.on('connection', (socket) => {
    const userId = socket.userId;

    if (!userId) {
      socket.emit('error', { message: 'Usuario no autenticado' });
      socket.disconnect();
      return;
    }

    connectedUsers.set(userId, socket.id);
    socket.join(`user_${userId}`);

    socket.emit('connected', {
      message: 'Conectado a notificaciones',
      userId,
    });

    socket.on('disconnect', (reason) => {
      connectedUsers.delete(userId);
    });

    // Marcar notificación como leída
    socket.on('mark_as_read', async ({ notificationId }) => {
      try {
        const notification = await Notification.findOne({
          where: { id: notificationId, userId },
        });

        if (!notification) {
          socket.emit('error', { message: 'Notificación no encontrada' });
          return;
        }

        await notification.update({ isRead: true, readAt: new Date() });
        socket.emit('notification_read', { notificationId });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Marcar todas como leídas
    socket.on('mark_all_as_read', async () => {
      try {
        await Notification.update(
          { isRead: true, readAt: new Date() },
          { where: { userId, readAt: null } }
        );
        socket.emit('all_notifications_read');
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
  });

  const sendNotification = async (userId, notification) => {
    try {
      notificationNamespace.to(`user_${userId}`).emit('new_notification', {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        isRead: notification.isRead ?? Boolean(notification.readAt),
        createdAt: notification.createdAt,
      });
    } catch (error) {
      console.error('Error enviando notificación:', error.message);
    }
  };

  const isUserConnected = (userId) => {
    return connectedUsers.has(userId);
  };

  const getConnectedUsersCount = () => {
    return connectedUsers.size;
  };

  return {
    sendNotification,
    isUserConnected,
    getConnectedUsersCount,
  };
};
