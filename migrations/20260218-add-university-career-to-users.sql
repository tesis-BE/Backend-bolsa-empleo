ALTER TABLE users ADD COLUMN IF NOT EXISTS "universityId" INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS "careerId" INTEGER;

ALTER TABLE users ADD CONSTRAINT fk_users_university 
  FOREIGN KEY ("universityId") REFERENCES universities(id) ON DELETE SET NULL;

ALTER TABLE users ADD CONSTRAINT fk_users_career 
  FOREIGN KEY ("careerId") REFERENCES careers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_university ON users("universityId");
CREATE INDEX IF NOT EXISTS idx_users_career ON users("careerId");
