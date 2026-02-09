require('dotenv').config();
const sequelize = require('../src/config/database');
const { User, Role, Permission } = require('../src/models');

async function run() {
  try {
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      throw new Error('Rol admin no encontrado');
    }

    const allPermissions = await Permission.findAll();
    await adminRole.setPermissions(allPermissions);

    const adminUser = await User.findOne({
      where: { email: 'fabriciozavala13@gmail.com' },
    });

    if (!adminUser) {
      throw new Error('Usuario admin no encontrado');
    }

    await adminUser.setRoles([adminRole]);

    console.log('✅ Rol admin actualizado con todos los permisos');
    console.log('✅ Usuario fabriciozavala13@gmail.com tiene rol admin');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();
