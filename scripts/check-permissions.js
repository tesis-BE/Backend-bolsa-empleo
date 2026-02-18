require('dotenv').config();
const { Client } = require('pg');

const c = new Client({
  host: 'localhost', port: 5432, user: 'postgres',
  password: '123456', database: 'bolsa_empleo'
});

c.connect().then(async () => {
  // 1. Permisos en BD
  const perms = await c.query('SELECT id, name, module, action FROM permissions ORDER BY id');
  console.log('\n=== PERMISOS EN BD ===');
  console.table(perms.rows);

  // 2. Permisos por rol
  const rp = await c.query(`
    SELECT r.name as rol, string_agg(p.name, ', ' ORDER BY p.name) as permisos
    FROM roles r
    LEFT JOIN role_permissions rp ON r.id = rp."roleId"
    LEFT JOIN permissions p ON rp."permissionId" = p.id
    GROUP BY r.name ORDER BY r.name
  `);
  console.log('\n=== PERMISOS POR ROL ===');
  console.table(rp.rows);

  // 3. Usuarios con roles
  const ur = await c.query(`
    SELECT u.id, u.email, u."userType", r.name as rol
    FROM users u
    JOIN "UserRoles" ur ON u.id = ur."userId"
    JOIN roles r ON r.id = ur."roleId"
    ORDER BY u.id
  `);
  console.log('\n=== USUARIOS CON ROLES ===');
  console.table(ur.rows);

  await c.end();
}).catch(e => { console.error('ERROR:', e.message); process.exit(1); });
