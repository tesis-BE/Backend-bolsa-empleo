require('dotenv').config({ path: '.env' });
const sequelize = require('../src/config/database');
const { User } = require('../src/models');
const { USER_TYPES } = require('../src/config/constants');

async function createAdmin() {
  try {
    // Sincronizar BD
    await sequelize.sync();

    // Datos del admin
    const adminData = {
      email: 'fabriciozavala13@gmail.com',
      password: '123456', // Será hasheado por el hook de Sequelize
      firstName: 'Fabricio',
      lastName: 'Zavala',
      phone: '1317392239',
      userType: USER_TYPES.ADMIN,
      isActive: true,
      availableForWork: false, // Admin no busca trabajo
    };

    // Verificar si el admin ya existe
    const existingAdmin = await User.findOne({
      where: { email: adminData.email },
    });
    if (existingAdmin) {
      console.log('✓ El usuario admin ya existe:', adminData.email);
      process.exit(0);
    }

    // Crear el admin
    const admin = await User.create(adminData);
    console.log('✓ Usuario Admin creado exitosamente:');
    console.log('  - Email:', admin.email);
    console.log('  - Nombre:', admin.firstName, admin.lastName);
    console.log('  - Tipo:', admin.userType);
    console.log('  - ID:', admin.id);

    process.exit(0);
  } catch (error) {
    console.error('✗ Error al crear el admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
