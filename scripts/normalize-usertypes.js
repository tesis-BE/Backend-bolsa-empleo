/**
 * Script: normalize-usertypes.js
 * Migra userType de formato español a inglés en la BD.
 * USO: node scripts/normalize-usertypes.js
 */
require('dotenv').config();
const sequelize = require('../src/config/database');

async function normalizarUserTypes() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la BD establecida.');

    // 1. Ver distribución actual
    const [antes] = await sequelize.query(
      'SELECT "userType", COUNT(*) as total FROM users GROUP BY "userType" ORDER BY "userType"'
    );
    console.log('\n📊 Distribución ACTUAL de userType:');
    console.table(antes);

    // 2. Normalizar 'Graduado' → 'graduate'
    const [, metaG] = await sequelize.query(
      "UPDATE users SET \"userType\" = 'graduate' WHERE \"userType\" = 'Graduado'"
    );
    console.log(`\n🔄 Graduado → graduate: ${metaG?.rowCount ?? 0} filas`);

    // 3. Normalizar 'Reclutador' → 'recruiter'
    const [, metaR] = await sequelize.query(
      "UPDATE users SET \"userType\" = 'recruiter' WHERE \"userType\" = 'Reclutador'"
    );
    console.log(`🔄 Reclutador → recruiter: ${metaR?.rowCount ?? 0} filas`);

    // 4. Normalizar 'Admin' → 'admin'  
    const [, metaA] = await sequelize.query(
      "UPDATE users SET \"userType\" = 'admin' WHERE \"userType\" = 'Admin'"
    );
    console.log(`🔄 Admin → admin: ${metaA?.rowCount ?? 0} filas`);

    // 5. Ver distribución final
    const [despues] = await sequelize.query(
      'SELECT "userType", COUNT(*) as total FROM users GROUP BY "userType" ORDER BY "userType"'
    );
    console.log('\n✅ Distribución FINAL de userType:');
    console.table(despues);

    await sequelize.close();
    console.log('\n🎉 Migración completada.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al normalizar:', error.message);
    console.error(error);
    process.exit(1);
  }
}

normalizarUserTypes();
