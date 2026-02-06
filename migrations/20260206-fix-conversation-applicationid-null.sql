-- Permitir conversaciones directas sin postulación asociada
ALTER TABLE conversations
  ALTER COLUMN "applicationId" DROP NOT NULL;
