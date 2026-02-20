-- Corregir el tipo ENUM de portfolio
-- Eliminamos la columna y los tipos para que Sequelize los recree correctamente

-- Paso 1: Eliminar la columna type para poder eliminar los tipos
ALTER TABLE user_portfolios DROP COLUMN IF EXISTS type;

-- Paso 2: Eliminar ambos tipos ENUM si existen
DROP TYPE IF EXISTS portfolio_type CASCADE;
DROP TYPE IF EXISTS "enum_user_portfolios_type" CASCADE;

-- Nota: Al reiniciar el servidor, Sequelize recreará el tipo enum_user_portfolios_type
-- y la columna type automáticamente porque está definido en el modelo
