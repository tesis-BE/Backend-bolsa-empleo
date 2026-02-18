ALTER TABLE educations ADD COLUMN IF NOT EXISTS "careerId" INTEGER;

CREATE INDEX IF NOT EXISTS idx_educations_careerid ON educations("careerId");
