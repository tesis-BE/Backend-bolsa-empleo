require('dotenv').config();
const sequelize = require('../src/config/database');

async function run() {
  try {
    await sequelize.query(
      'ALTER TABLE conversations ALTER COLUMN "applicationId" DROP NOT NULL;'
    );
    console.log('Migration applied');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
