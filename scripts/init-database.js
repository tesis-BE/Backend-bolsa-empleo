#!/usr/bin/env node
/**
 * Script de inicialización completa de la base de datos
 * Crea todas las tablas, usuario admin y datos de prueba
 * Uso: node scripts/init-database.js
 */

require('dotenv').config();
const sequelize = require('../src/config/database');
const bcrypt = require('bcryptjs');

// Importar todos los modelos
const {
  User,
  Role,
  Permission,
  RolePermission,
  University,
  Faculty,
  Company,
} = require('../src/models');

async function initializeDatabase() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');

    console.log('🔄 Sincronizando modelos...');
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');

    console.log('🔄 Creando roles y permisos...');

    // Crear roles
    const adminRole = await Role.findOrCreate({
      where: { name: 'admin' },
      defaults: {
        description: 'Administrador del sistema',
      },
    });

    const recruiterRole = await Role.findOrCreate({
      where: { name: 'recruiter' },
      defaults: {
        description: 'Reclutador de empresa',
      },
    });

    const graduateRole = await Role.findOrCreate({
      where: { name: 'graduate' },
      defaults: {
        description: 'Graduado/Alumno',
      },
    });

    console.log('✅ Roles creados');

    // Crear permisos
    const permissions = [
      { name: 'manage_users', module: 'usuarios', action: 'gestionar' },
      { name: 'manage_companies', module: 'empresas', action: 'gestionar' },
      { name: 'manage_jobs', module: 'ofertas', action: 'gestionar' },
      {
        name: 'manage_applications',
        module: 'postulaciones',
        action: 'gestionar',
      },
      { name: 'manage_roles', module: 'roles', action: 'gestionar' },
      { name: 'view_analytics', module: 'reportes', action: 'ver' },
      { name: 'manage_settings', module: 'configuración', action: 'gestionar' },
    ];

    for (const perm of permissions) {
      await Permission.findOrCreate({
        where: { name: perm.name },
        defaults: perm,
      });
    }

    console.log('✅ Permisos creados');

    // Crear usuario admin
    console.log('🔄 Creando usuario administrador...');

    const existingAdmin = await User.findOne({
      where: { email: 'fabriciozavala13@gmail.com' },
    });

    if (existingAdmin) {
      console.log('ℹ️  Usuario admin ya existe');
      // Asegurar contraseña conocida para pruebas
      try {
        existingAdmin.password = '123456';
        await existingAdmin.save();
        console.log('✓ Contraseña del admin restablecida para pruebas');
      } catch (e) {
        console.log(
          '⚠️  No se pudo restablecer la contraseña del admin:',
          e.message
        );
      }
    } else {
      const hashedPassword = await bcrypt.hash('123456', 10);

      const adminUser = await User.create({
        username: 'fabricio.zavala',
        email: 'fabriciozavala13@gmail.com',
        personalEmail: 'fabriciozavala13@gmail.com',
        password: hashedPassword,
        firstName: 'Fabricio',
        lastName: 'Zavala',
        cedula: '1317392239',
        userType: 'admin',
        isActive: true,
      });

      // Asignar rol admin
      await adminUser.setRoles([adminRole[0]]);

      console.log('✅ Usuario admin creado:');
      console.log('   Email: fabriciozavala13@gmail.com');
      console.log('   Password: 123456');
      console.log('   ID:', adminUser.id);
    }

    // Crear datos de prueba
    console.log('🔄 Creando datos de prueba...');

    // Crear universidades
    const universities = [
      {
        name: 'Universidad Laica Eloy Alfaro de Manabí',
        code: 'ULEAM',
        description: 'Universidad pública de Manabí',
      },
      {
        name: 'Universidad Central del Ecuador',
        code: 'UCE',
        description: 'Universidad pública de Quito',
      },
      {
        name: 'Universidad Técnica de Manabí',
        code: 'UTM',
        description: 'Universidad técnica de Portoviejo',
      },
      {
        name: 'Universidad San Gregorio de Portoviejo',
        code: 'USGP',
        description: 'Universidad privada de Portoviejo',
      },
    ];

    for (const uni of universities) {
      await University.findOrCreate({
        where: { code: uni.code },
        defaults: uni,
      });
    }
    console.log('✅ Universidades creadas');

    // Crear facultades para ULEAM
    const uleam = await University.findOne({ where: { code: 'ULEAM' } });

    if (uleam) {
      const faculties = [
        { name: 'Facultad de Ciencias Informáticas', universityId: uleam.id },
        {
          name: 'Facultad de Ciencias Administrativas',
          universityId: uleam.id,
        },
        { name: 'Facultad de Ingeniería', universityId: uleam.id },
        { name: 'Facultad de Ciencias de la Salud', universityId: uleam.id },
      ];

      for (const fac of faculties) {
        await Faculty.findOrCreate({
          where: { name: fac.name, universityId: fac.universityId },
          defaults: fac,
        });
      }
      console.log('✅ Facultades creadas');
    }

    // Crear usuarios reclutadores (requeridos para empresas)
    console.log('🔄 Creando usuarios reclutadores...');
    const recruiterUsersData = [
      {
        email: 'recruiter@sorti.tech',
        password: '123456',
        firstName: 'Sofía',
        lastName: 'Sorti',
        userType: 'recruiter',
        isActive: true,
      },
      {
        email: 'recruiter@zgames.studio',
        password: '123456',
        firstName: 'Zoe',
        lastName: 'Games',
        userType: 'recruiter',
        isActive: true,
      },
    ];

    const recruiterUsers = [];
    for (const ru of recruiterUsersData) {
      const [user] = await User.findOrCreate({
        where: { email: ru.email },
        defaults: ru,
      });

      // Asegurar rol de recruiter
      await user.setRoles([recruiterRole[0]]);
      recruiterUsers.push(user);
    }
    console.log('✅ Usuarios reclutadores creados/asignados');

    // Crear empresas de prueba
    const companies = [
      {
        name: 'Sorti Tech Solutions',
        description:
          'Empresa líder en soluciones tecnológicas y desarrollo de software',
        industry: 'Tecnología',
        location: 'Manta, Ecuador',
        website: 'https://sorti.tech',
        isActive: true,
        recruiterId: recruiterUsers[0]?.id,
      },
      {
        name: 'ZGames Studio',
        description: 'Desarrollo de videojuegos y aplicaciones interactivas',
        industry: 'Gaming y Entretenimiento',
        location: 'Portoviejo, Ecuador',
        website: 'https://zgames.studio',
        isActive: true,
        recruiterId: recruiterUsers[1]?.id,
      },
    ];

    for (const company of companies) {
      await Company.findOrCreate({
        where: { name: company.name },
        defaults: company,
      });
    }
    console.log('✅ Empresas de prueba creadas');

    console.log('\n✅ Base de datos inicializada completamente');
    console.log('\n📋 Datos de acceso:');
    console.log('   Usuario: fabriciozavala13@gmail.com');
    console.log('   Contraseña: 123456');
    console.log('   Tipo: admin\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    process.exit(1);
  }
}

initializeDatabase();
