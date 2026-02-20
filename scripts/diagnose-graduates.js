require('dotenv').config();
const s = require('../src/config/database');

async function run() {
  try {
    await s.authenticate();
    const [graduates] = await s.query(
      `SELECT id, "firstName", "lastName", "userType", "availableForWork", "photoUrl", "isActive" FROM users WHERE "userType" = 'graduate'`
    );
    console.log('Graduados en BD:');
    graduates.forEach(g => {
      console.log(`  id=${g.id} | nombre=${g.firstName} ${g.lastName} | availableForWork=${g.availableForWork} | photoUrl=${g.photoUrl} | isActive=${g.isActive}`);
    });
    await s.close();
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  }
}
run();
