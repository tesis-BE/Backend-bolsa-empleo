-- Migración: Agregar relaciones con facultades y correcciones de estructura
-- Fecha: 2025-01-29

-- 1. Agregar facultyId a tabla users
ALTER TABLE users 
ADD COLUMN facultyId INTEGER REFERENCES faculties(id) ON DELETE SET NULL;

-- 2. Agregar facultyId a tabla educations  
ALTER TABLE educations
ADD COLUMN facultyId INTEGER REFERENCES faculties(id) ON DELETE SET NULL;

-- 3. Agregar createdBy a tabla jobs
ALTER TABLE jobs
ADD COLUMN createdBy INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT;

-- 4. Crear índices para mejorar performance
CREATE INDEX idx_users_facultyid ON users(facultyId);
CREATE INDEX idx_educations_facultyid ON educations(facultyId);  
CREATE INDEX idx_jobs_createdby ON jobs(createdBy);

-- 5. Comentarios para documentación
COMMENT ON COLUMN users.facultyId IS 'FK a faculty - solo para usuarios tipo graduate';
COMMENT ON COLUMN educations.facultyId IS 'FK a faculty - relaciona educación con facultad específica';
COMMENT ON COLUMN jobs.createdBy IS 'FK a user - ID del reclutador que creó la oferta';