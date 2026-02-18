require('dotenv').config();
const sequelize = require('../src/config/database');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, '..', 'migrations', '20260218-add-university-career-to-users.sql'),
      'utf8'
    );
    await sequelize.query(sql);
    console.log('✅ Migración add-university-career-to-users aplicada exitosamente');
  } catch (error) {
    console.error('❌ Migración falló:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
