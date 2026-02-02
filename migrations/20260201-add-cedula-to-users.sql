-- Migración: Agregar campo cedula a users
-- Fecha: 2026-02-01

ALTER TABLE users
ADD COLUMN cedula VARCHAR(20);

CREATE INDEX idx_users_cedula ON users(cedula);
