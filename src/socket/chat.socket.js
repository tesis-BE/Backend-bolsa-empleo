const { Message, Conversation, User } = require('../models');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

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
      try {
        if (!socket.userId) {
          socket.emit('error', { message: 'No autenticado' });
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

        // Emitir a ambos usuarios en la conversación
        io.to(`conversation_${conversationId}`).emit(
          'receive_message',
          messageData
        );
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
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
          { isRead: true },
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
      console.log(`Usuario desconectado: ${socket.id}`);
    });
  });
};
