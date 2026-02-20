-- Script para investigar el problema del tipo ENUM

-- 1. Ver todos los tipos ENUM en la base de datos
SELECT typname, typelem 
FROM pg_type 
WHERE typname LIKE '%portfolio%' OR typname LIKE '%user_portfolios%';

-- 2. Ver la definición de la tabla user_portfolios
\d user_portfolios;

-- 3. Ver los valores del enum
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'portfolio_type');

SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_user_portfolios_type');

-- 4. Ver qué columnas usan estos tipos
SELECT table_name, column_name, udt_name
FROM information_schema.columns
WHERE table_name = 'user_portfolios' AND column_name = 'type';
