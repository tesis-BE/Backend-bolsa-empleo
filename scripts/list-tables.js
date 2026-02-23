require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');
const s = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST, port: process.env.DB_PORT, dialect: 'postgres', logging: false
});
(async () => {
  // Check role_permissions columns and existing data
  const [cols] = await s.query("SELECT column_name FROM information_schema.columns WHERE table_name='role_permissions' ORDER BY ordinal_position");
  console.log('Columns in role_permissions:', cols.map(c => c.column_name));
  
  const [perms] = await s.query('SELECT id, name FROM permissions ORDER BY id');
  console.log('\nPermisos actuales:');
  perms.forEach(p => console.log(' ', p.id, p.name));

  const [rp] = await s.query('SELECT * FROM role_permissions LIMIT 5');
  console.log('\nSample role_permissions:', JSON.stringify(rp[0]));
  
  await s.close();
})().catch(e => console.error(e.message));
