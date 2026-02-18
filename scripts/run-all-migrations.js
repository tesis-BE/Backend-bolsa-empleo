require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'bolsa_empleo',
});

const migrations = [
  // 20250129: facultyId en users y educations, createdBy en jobs
  { name: 'users.facultyId', sql: `ALTER TABLE users ADD COLUMN IF NOT EXISTS "facultyId" INTEGER REFERENCES faculties(id) ON DELETE SET NULL` },
  { name: 'educations.facultyId', sql: `ALTER TABLE educations ADD COLUMN IF NOT EXISTS "facultyId" INTEGER REFERENCES faculties(id) ON DELETE SET NULL` },
  { name: 'jobs.createdBy', sql: `ALTER TABLE jobs ADD COLUMN IF NOT EXISTS "createdBy" INTEGER REFERENCES users(id) ON DELETE RESTRICT` },
  { name: 'idx users.facultyId', sql: `CREATE INDEX IF NOT EXISTS idx_users_facultyid ON users("facultyId")` },
  { name: 'idx educations.facultyId', sql: `CREATE INDEX IF NOT EXISTS idx_educations_facultyid ON educations("facultyId")` },
  { name: 'idx jobs.createdBy', sql: `CREATE INDEX IF NOT EXISTS idx_jobs_createdby ON jobs("createdBy")` },

  // 20260201: cedula en users
  { name: 'users.cedula', sql: `ALTER TABLE users ADD COLUMN IF NOT EXISTS cedula VARCHAR(20)` },
  { name: 'idx users.cedula', sql: `CREATE INDEX IF NOT EXISTS idx_users_cedula ON users(cedula)` },

  // 20260202: tabla careers
  { name: 'table careers', sql: `CREATE TABLE IF NOT EXISTS careers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    "facultyId" INTEGER REFERENCES faculties(id) ON DELETE SET NULL,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )` },
  { name: 'idx careers.facultyId', sql: `CREATE INDEX IF NOT EXISTS idx_careers_facultyid ON careers("facultyId")` },
  { name: 'idx careers.isActive', sql: `CREATE INDEX IF NOT EXISTS idx_careers_isactive ON careers("isActive")` },

  // 20260203: chat y notificaciones
  { name: 'conversations.applicationId nullable', sql: `ALTER TABLE conversations ALTER COLUMN "applicationId" DROP NOT NULL` },
  { name: 'conversations.lastMessageAt', sql: `ALTER TABLE conversations ADD COLUMN IF NOT EXISTS "lastMessageAt" TIMESTAMP NULL` },
  { name: 'messages.attachmentUrl', sql: `ALTER TABLE messages ADD COLUMN IF NOT EXISTS "attachmentUrl" TEXT NULL` },
  { name: 'messages.readAt', sql: `ALTER TABLE messages ADD COLUMN IF NOT EXISTS "readAt" TIMESTAMP NULL` },
  { name: 'notifications.readAt', sql: `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS "readAt" TIMESTAMP NULL` },
  { name: 'idx conversations.lastMessageAt', sql: `CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations("lastMessageAt")` },
  { name: 'idx messages.readAt', sql: `CREATE INDEX IF NOT EXISTS idx_messages_readat ON messages("readAt")` },
  { name: 'idx notifications.readAt', sql: `CREATE INDEX IF NOT EXISTS idx_notifications_readat ON notifications("readAt")` },

  // 20260207: tabla UserRoles
  { name: 'table UserRoles', sql: `CREATE TABLE IF NOT EXISTS "UserRoles" (
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "roleId" INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY ("userId", "roleId")
  )` },
  { name: 'idx UserRoles.userId', sql: `CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON "UserRoles"("userId")` },
  { name: 'idx UserRoles.roleId', sql: `CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON "UserRoles"("roleId")` },
];

async function runMigrations() {
  await client.connect();
  console.log('✅ Conectado a PostgreSQL');

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const m of migrations) {
    try {
      await client.query(m.sql);
      console.log(`  ✅ ${m.name}`);
      ok++;
    } catch (e) {
      // Códigos que significan "ya existe" => ignorar
      const ignoreCodes = ['42701', '42P07', '42P16', '42710'];
      const ignoreMessages = ['already exists', 'ya existe', 'cannot alter', 'column', 'does not allow'];
      const isIgnorable =
        ignoreCodes.includes(e.code) ||
        ignoreMessages.some((msg) => e.message.toLowerCase().includes(msg.toLowerCase()));

      if (isIgnorable) {
        console.log(`  ⏭️  ${m.name} (ya existe o no aplica)`);
        skipped++;
      } else {
        console.error(`  ❌ ${m.name}: ${e.message}`);
        failed++;
      }
    }
  }

  console.log(`\n📊 Resumen: ${ok} aplicadas | ${skipped} omitidas | ${failed} fallidas`);
  await client.end();

  if (failed > 0) {
    process.exit(1);
  }
}

runMigrations().catch((e) => {
  console.error('Error fatal:', e.message);
  process.exit(1);
});
