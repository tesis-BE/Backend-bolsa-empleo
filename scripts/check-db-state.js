#!/usr/bin/env node
require('dotenv').config();
const sequelize = require('../src/config/database');

async function check() {
  try {
    await sequelize.authenticate();
    console.log('Connected OK');

    const [roles] = await sequelize.query('SELECT * FROM roles ORDER BY id');
    console.log('=== ROLES ===');
    console.log(JSON.stringify(roles, null, 2));

    const [perms] = await sequelize.query('SELECT * FROM permissions ORDER BY id');
    console.log('=== PERMISSIONS ===');
    console.log(JSON.stringify(perms, null, 2));

    try {
      const [rp] = await sequelize.query(`
        SELECT rp."roleId", r.name as role_name, rp."permissionId", p.name as perm_name 
        FROM role_permissions rp 
        JOIN roles r ON r.id = rp."roleId" 
        JOIN permissions p ON p.id = rp."permissionId" 
        ORDER BY rp."roleId"
      `);
      console.log('=== ROLE_PERMISSIONS ===');
      console.log(JSON.stringify(rp, null, 2));
    } catch (e) {
      console.log('=== ROLE_PERMISSIONS ERROR ===', e.message);
    }

    try {
      const [ur] = await sequelize.query(`
        SELECT ur."userId", u."firstName", u."lastName", u."userType", ur."roleId", r.name as role_name 
        FROM "UserRoles" ur 
        JOIN users u ON u.id = ur."userId" 
        JOIN roles r ON r.id = ur."roleId" 
        ORDER BY ur."userId"
      `);
      console.log('=== USER_ROLES ===');
      console.log(JSON.stringify(ur, null, 2));
    } catch (e) {
      console.log('=== USER_ROLES ERROR ===', e.message);
    }

    process.exit(0);
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  }
}

check();
