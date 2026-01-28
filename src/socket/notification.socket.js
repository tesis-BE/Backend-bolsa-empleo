const { Notification, User } = require('../models');

// Map para rastrear usuarios conectados: userId -> socketId
const connectedUsers = new Map();

module.exports = (io) => {
  const notificationNamespace = io.of('/notifications');

  notificationNamespace.on('connection', (socket) => {
    const userId = socket.userId; // Viene del middleware de autenticación

    if (!userId) {
      socket.emit('error', { message: 'Usuario no autenticado' });
      socket.disconnect();
      return;
    }

    // Registrar usuario conectado
    connectedUsers.set(userId, socket.id);

    // Unir al usuario a su sala personal
    socket.join(`user_${userId}`);

    // Confirmar conexión exitosa
    socket.emit('connected', {
      message: 'Conectado a notificaciones',
      userId,
    });

    // Desconexión
    socket.on('disconnect', () => {
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

        await notification.update({ isRead: true });
        socket.emit('notification_read', { notificationId });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Marcar todas como leídas
    socket.on('mark_all_as_read', async () => {
      try {
        await Notification.update(
          { isRead: true },
          { where: { userId, isRead: false } }
        );
        socket.emit('all_notifications_read');
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
  });

  // Función helper para enviar notificaciones
  const sendNotification = async (userId, notification) => {
    try {
      // Emitir a la sala del usuario
      notificationNamespace.to(`user_${userId}`).emit('new_notification', {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      });
    } catch (error) {
      console.error('Error enviando notificación:', error);
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
