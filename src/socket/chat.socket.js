const { Message, Conversation, User } = require('../models');
const { createSocketRateLimiter } = require('../utils/socketRateLimiter.util');

// Rate limiter: 20 mensajes por minuto
const messageLimiter = createSocketRateLimiter({
  maxRequests: 20,
  windowMs: 60000,
  blockDurationMs: 300000,
});

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Unirse a una conversación
    socket.on('join_conversation', async ({ conversationId, userId }) => {
      try {
        // Validar que el usuario pertenece a la conversación
        const conversation = await Conversation.findByPk(conversationId);

        if (!conversation) {
          socket.emit('error', { message: 'Conversación no encontrada' });
          return;
        }

        if (
          conversation.graduateId !== userId &&
          conversation.recruiterId !== userId
        ) {
          socket.emit('error', {
            message: 'Acceso denegado a esta conversación',
          });
          return;
        }

        socket.join(`conversation_${conversationId}`);
        socket.conversationId = conversationId;
        socket.userId = userId;

        socket.emit('joined_conversation', { conversationId });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Enviar mensaje
    socket.on('send_message', async ({ conversationId, content }) => {
      // Aplicar rate limiting
      messageLimiter.check(socket, async (result) => {
        if (!result.allowed) {
          return; // El error ya fue emitido por el limiter
        }

        try {
          if (!socket.userId) {
            socket.emit('error', { message: 'No autenticado' });
            return;
          }

          // Validar longitud del mensaje
          if (
            !content ||
            typeof content !== 'string' ||
            content.trim().length === 0
          ) {
            socket.emit('error', {
              message: 'El mensaje no puede estar vacío',
            });
            return;
          }

          if (content.length > 5000) {
            socket.emit('error', {
              message: 'El mensaje es demasiado largo (máximo 5000 caracteres)',
            });
            return;
          }

          // Validar que el usuario pertenece a la conversación
          const conversation = await Conversation.findByPk(conversationId);

          if (!conversation) {
            socket.emit('error', { message: 'Conversación no encontrada' });
            return;
          }

          if (
            conversation.graduateId !== socket.userId &&
            conversation.recruiterId !== socket.userId
          ) {
            socket.emit('error', { message: 'Acceso denegado' });
            return;
          }

          // Crear mensaje
          const message = await Message.create({
            conversationId,
            senderId: socket.userId,
            content,
          });

          // Obtener datos del remitente
          const sender = await User.findByPk(socket.userId, {
            attributes: ['id', 'firstName', 'lastName', 'profilePhotoId'],
          });

          const messageData = {
            id: message.id,
            conversationId,
            senderId: socket.userId,
            senderName: `${sender.firstName} ${sender.lastName}`,
            content,
            createdAt: message.createdAt,
          };

          // Actualizar última actividad de la conversación
          await conversation.update({
            lastMessageAt: new Date(),
            updatedAt: new Date(),
          });

          // Emitir a ambos usuarios en la conversación
          io.to(`conversation_${conversationId}`).emit(
            'receive_message',
            messageData
          );
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });
    });

    // Usuario está escribiendo
    socket.on('user_typing', ({ conversationId, isTyping }) => {
      try {
        if (
          !socket.conversationId ||
          socket.conversationId !== conversationId
        ) {
          return;
        }

        socket.broadcast
          .to(`conversation_${conversationId}`)
          .emit('user_typing', {
            userId: socket.userId,
            isTyping,
          });
      } catch (error) {
        console.error('Error en user_typing:', error);
      }
    });

    // Marcar mensajes como leídos
    socket.on('mark_as_read', async ({ conversationId, messageIds }) => {
      try {
        await Message.update(
          { isRead: true, readAt: new Date() },
          {
            where: {
              id: messageIds,
              conversationId,
            },
          }
        );

        io.to(`conversation_${conversationId}`).emit('messages_read', {
          messageIds,
        });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Desconexión
    socket.on('disconnect', () => {
      // Notificar a la conversación que el usuario se desconectó
      if (socket.conversationId) {
        socket.broadcast
          .to(`conversation_${socket.conversationId}`)
          .emit('user_disconnected', {
            userId: socket.userId,
          });
      }
    });
  });
};
