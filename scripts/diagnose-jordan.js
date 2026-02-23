require('dotenv').config();
const { Sequelize } = require('sequelize');
const s = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, dialect: 'postgres', logging: false }
);
async function run() {
  await s.authenticate();
  // Usuario jordan
  const [users] = await s.query(`SELECT id, email, "userType" FROM users WHERE email = 'jordan@gmail.com'`);
  console.log('Usuario:', users);
  if (!users.length) { console.log('No existe ese email'); await s.close(); return; }
  const userId = users[0].id;

  // Permisos
  const [perms] = await s.query(`
    SELECT p.name FROM users u
    JOIN user_roles ur ON ur."userId" = u.id
    JOIN roles r ON r.id = ur."roleId"
    JOIN role_permissions rp ON rp."roleId" = r.id
    JOIN permissions p ON p.id = rp."permissionId"
    WHERE u.id = ${userId}
  `);
  console.log('Permisos:', perms.map(p => p.name));

  // Postulaciones
  const [apps] = await s.query(`SELECT id, "jobId", status, "appliedAt" FROM applications WHERE "userId" = ${userId}`);
  console.log('Postulaciones de jordan:', apps);

  // Permisos con manage_applications
  const hasManageApps = perms.some(p => p.name === 'manage_applications');
  const hasViewJobOffers = perms.some(p => p.name === 'view_job_offers');
  console.log('Tiene manage_applications:', hasManageApps);
  console.log('Tiene view_job_offers:', hasViewJobOffers);
  await s.close();
}
run().catch(e => { console.error(e.message); process.exit(1); });
