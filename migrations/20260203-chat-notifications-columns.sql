-- Migración: Ajustes para chat directo y notificaciones por usuario
-- Fecha: 2026-02-03

-- 1. Conversaciones: permitir chats directos (sin postulación) y tracking de último mensaje
ALTER TABLE conversations
ALTER COLUMN applicationId DROP NOT NULL;

ALTER TABLE conversations
ADD COLUMN lastMessageAt TIMESTAMP NULL;

-- 2. Mensajes: adjuntos y lectura por timestamp
ALTER TABLE messages
ADD COLUMN attachmentUrl TEXT NULL,
ADD COLUMN readAt TIMESTAMP NULL;

-- 3. Notificaciones: lectura por timestamp
ALTER TABLE notifications
ADD COLUMN readAt TIMESTAMP NULL;

-- 3.1 Sincronizar datos existentes (si isRead ya estaba en uso)
UPDATE messages SET readAt = createdAt WHERE isRead = true AND readAt IS NULL;
UPDATE notifications SET readAt = createdAt WHERE isRead = true AND readAt IS NULL;

-- 4. Índices para performance
CREATE INDEX idx_conversations_last_message ON conversations(lastMessageAt);
CREATE INDEX idx_messages_readat ON messages(readAt);
CREATE INDEX idx_notifications_readat ON notifications(readAt);

-- 5. Comentarios para documentación
COMMENT ON COLUMN conversations.lastMessageAt IS 'Último mensaje enviado en la conversación';
COMMENT ON COLUMN messages.attachmentUrl IS 'URL de adjunto opcional del mensaje';
COMMENT ON COLUMN messages.readAt IS 'Fecha/hora de lectura del mensaje';
COMMENT ON COLUMN notifications.readAt IS 'Fecha/hora de lectura de la notificación';
