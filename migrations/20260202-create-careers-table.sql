CREATE TABLE IF NOT EXISTS careers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  "facultyId" INTEGER REFERENCES faculties(id) ON DELETE SET NULL,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_careers_facultyid ON careers("facultyId");
CREATE INDEX idx_careers_isactive ON careers("isActive");

COMMENT ON TABLE careers IS 'Tabla de carreras profesionales asociadas a facultades';
COMMENT ON COLUMN careers."facultyId" IS 'FK a faculty - facultad a la que pertenece la carrera';
