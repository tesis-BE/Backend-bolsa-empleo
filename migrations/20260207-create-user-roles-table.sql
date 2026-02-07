-- Migración: Crear tabla user_roles para relación N:M entre usuarios y roles
-- Fecha: 2026-02-07

CREATE TABLE IF NOT EXISTS "UserRoles" (
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "roleId" INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY ("userId", "roleId")
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON "UserRoles" ("userId");
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON "UserRoles" ("roleId");
