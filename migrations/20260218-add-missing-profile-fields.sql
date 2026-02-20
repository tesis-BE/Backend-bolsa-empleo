-- Agregar campo degreeType a educations
ALTER TABLE educations ADD COLUMN IF NOT EXISTS "degreeType" VARCHAR(50);

-- Agregar campos type y description a user_portfolios
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'portfolio_type') THEN
        CREATE TYPE portfolio_type AS ENUM ('github', 'linkedin', 'website', 'behance', 'dribbble', 'other');
    END IF;
END $$;

ALTER TABLE user_portfolios ADD COLUMN IF NOT EXISTS "type" portfolio_type DEFAULT 'website';
ALTER TABLE user_portfolios ADD COLUMN IF NOT EXISTS "description" VARCHAR(200);

-- Agregar campo location a work_experiences
ALTER TABLE work_experiences ADD COLUMN IF NOT EXISTS "location" VARCHAR(100);

-- Agregar campo repositoryUrl a projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS "repositoryUrl" VARCHAR(500);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_educations_degreetype ON educations("degreeType");
CREATE INDEX IF NOT EXISTS idx_user_portfolios_type ON user_portfolios("type");
CREATE INDEX IF NOT EXISTS idx_work_experiences_location ON work_experiences("location");
