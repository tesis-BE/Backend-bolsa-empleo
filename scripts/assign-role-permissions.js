/**
 * Asigna permisos adecuados a cada rol según los módulos que deben ver en el sidebar.
 *
 * Regla: la visibilidad de módulos se controla POR PERMISO, no por userType.
 *
 * admin     → todos los permisos (ya asignado)
 * recruiter → manage_jobs, manage_applications, view_analytics
 * graduate  → sin permisos de gestión (los módulos abiertos no los necesitan)
 */

require('dotenv').config();
const sequelize = require('../src/config/database');
const { Role, Permission } = require('../src/models');
const { Op } = require('sequelize');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a BD\n');

    // --- ADMIN: ya tiene todos, reforzar ---
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    const allPerms = await Permission.findAll();
    await adminRole.setPermissions(allPerms);
    console.log(`✅ admin  → ${allPerms.length} permisos (todos)`);

    // --- RECRUITER ---
    const recruiterRole = await Role.findOne({ where: { name: 'recruiter' } });
    const recruiterPermNames = ['manage_jobs', 'manage_applications', 'view_analytics'];
    const recruiterPerms = await Permission.findAll({ where: { name: { [Op.in]: recruiterPermNames } } });
    await recruiterRole.setPermissions(recruiterPerms);
    console.log(`✅ recruiter → ${recruiterPerms.map(p => p.name).join(', ')}`);

    // --- GRADUATE: sin permisos de gestión (ve módulos abiertos: job-offers, graduates, messages, saved-jobs) ---
    const graduateRole = await Role.findOne({ where: { name: 'graduate' } });
    await graduateRole.setPermissions([]);
    console.log(`✅ graduate → sin permisos de gestión (accede a módulos abiertos)`);

    console.log('\n✅ Permisos de roles actualizados correctamente');

  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
