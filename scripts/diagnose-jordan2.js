require('dotenv').config();
const { Sequelize } = require('sequelize');
const s = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, dialect: 'postgres', logging: false }
);
async function run() {
  await s.authenticate();

  // Listar todas las tablas
  const [tables] = await s.query(`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`);
  console.log('Tablas:', tables.map(t => t.tablename).join(', '));

  // Buscar jordan
  const [users] = await s.query(`SELECT id, email, "userType" FROM users WHERE email = 'jordan@gmail.com'`);
  console.log('\nUsuario jordan:', users);
  if (!users.length) { await s.close(); return; }
  const userId = users[0].id;

  // Postulaciones de jordan
  const [apps] = await s.query(`SELECT id, "jobId", status, "appliedAt" FROM applications WHERE "userId" = ${userId}`);
  console.log('Postulaciones:', apps);

  // Roles de jordan (probar nombre de tabla)
  try {
    const [roles1] = await s.query(`SELECT * FROM "UserRoles" WHERE "userId" = ${userId}`);
    console.log('UserRoles:', roles1);
  } catch(e) { console.log('Tabla UserRoles no existe:', e.message.split('\n')[0]); }

  try {
    const [roles2] = await s.query(`SELECT * FROM user_roles WHERE "userId" = ${userId}`);
    console.log('user_roles:', roles2);
  } catch(e) { console.log('Tabla user_roles no existe:', e.message.split('\n')[0]); }

  // Roles directos en tabla roles
  const [roles3] = await s.query(`SELECT r.id, r.name FROM roles r JOIN "UserRoles" ur ON ur."roleId" = r.id WHERE ur."userId" = ${userId}`).catch(() => [[]]);
  console.log('Roles del usuario:', roles3);

  // Permisos del rol graduate
  const [gradRole] = await s.query(`SELECT id, name FROM roles WHERE name ILIKE 'graduate' OR name ILIKE 'egresado' OR name ILIKE 'graduado' LIMIT 1`);
  console.log('\nRol graduado:', gradRole);
  if (gradRole.length) {
    const roleId = gradRole[0].id;
    const [rolePerms] = await s.query(`SELECT p.name FROM role_permissions rp JOIN permissions p ON p.id = rp."permissionId" WHERE rp."roleId" = ${roleId}`);
    console.log('Permisos del rol graduado:', rolePerms.map(p => p.name));
    console.log('Tiene manage_applications:', rolePerms.some(p => p.name === 'manage_applications'));
  }

  await s.close();
}
run().catch(e => { console.error(e.message); process.exit(1); });
