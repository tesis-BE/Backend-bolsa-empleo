-- ============================================================
-- MIGRACIÓN: Normalizar userType de formato español a inglés
-- Fecha: 2026-02-18
-- Problema: Algunos registros tienen userType='Graduado'/'Reclutador'/'Admin'
--           en lugar de 'graduate'/'recruiter'/'admin' (formato actual del código).
-- ============================================================

-- PASO 1: Ver cuántos usuarios tienen el formato antiguo (solo diagnóstico)
-- SELECT userType, COUNT(*) as total FROM users GROUP BY userType ORDER BY userType;

-- PASO 2: Normalizar userType 'Graduado' → 'graduate'
UPDATE users
SET "userType" = 'graduate'
WHERE "userType" = 'Graduado';

-- PASO 3: Normalizar userType 'Reclutador' → 'recruiter'
UPDATE users
SET "userType" = 'recruiter'
WHERE "userType" = 'Reclutador';

-- PASO 4: Normalizar userType 'Admin' → 'admin'
UPDATE users
SET "userType" = 'admin'
WHERE "userType" = 'Admin';

-- PASO 5: Verificar resultado final
-- SELECT userType, COUNT(*) as total FROM users GROUP BY userType ORDER BY userType;

-- NOTA: Si la columna userType tiene un tipo ENUM en PostgreSQL y no acepta
--       los valores nuevos, primero necesitas alterar el tipo:
-- ALTER TYPE "enum_users_userType" RENAME TO "enum_users_userType_old";
-- CREATE TYPE "enum_users_userType" AS ENUM ('graduate', 'recruiter', 'admin');
-- ALTER TABLE users ALTER COLUMN "userType" TYPE "enum_users_userType" USING "userType"::text::"enum_users_userType";
-- DROP TYPE "enum_users_userType_old";
