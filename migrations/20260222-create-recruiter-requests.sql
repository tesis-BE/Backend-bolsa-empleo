-- Migración: Crear tabla recruiter_requests
-- Fecha: 2026-02-22
-- Descripción: Tabla para solicitudes de registro de reclutadores

CREATE TABLE IF NOT EXISTS recruiter_requests (
  id SERIAL PRIMARY KEY,
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  "position" VARCHAR(255),

  -- Empresa existente (si el reclutador seleccionó una ya registrada)
  "existingCompanyId" INTEGER REFERENCES companies(id) ON DELETE SET NULL,

  -- Datos de empresa nueva (solo si no seleccionó una existente)
  "companyName" VARCHAR(255),
  "companyIndustry" VARCHAR(255),
  "companySize" VARCHAR(50),
  "companyLocation" VARCHAR(255),
  "companyWebsite" VARCHAR(255),
  "companyDescription" TEXT,
  "companyLogoPath" VARCHAR(500),

  -- Estado de la solicitud
  status VARCHAR(20) NOT NULL DEFAULT 'pendiente'
    CHECK (status IN ('pendiente', 'aprobado', 'rechazado')),
  "rejectionReason" TEXT,

  -- Token de activación
  "activationToken" VARCHAR(255),
  "tokenExpiresAt" TIMESTAMP WITH TIME ZONE,

  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_recruiter_requests_status ON recruiter_requests(status);
CREATE INDEX IF NOT EXISTS idx_recruiter_requests_email ON recruiter_requests(email);
CREATE INDEX IF NOT EXISTS idx_recruiter_requests_token ON recruiter_requests("activationToken");
