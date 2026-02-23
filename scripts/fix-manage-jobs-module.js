require('dotenv').config();
const { Sequelize } = require('sequelize');

const s = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, dialect: 'postgres', logging: false }
);

async function run() {
  await s.authenticate();
  await s.query("UPDATE permissions SET module = 'crear_ofertas' WHERE name = 'manage_jobs'");
  console.log('✅ manage_jobs → module = crear_ofertas');
  const [rows] = await s.query('SELECT module, name FROM permissions ORDER BY module, name');
  rows.forEach(r => console.log(`  ${r.module.padEnd(20)} ${r.name}`));
  await s.close();
}
run().catch(e => { console.error(e); process.exit(1); });
