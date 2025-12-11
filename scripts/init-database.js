#!/usr/bin/env node
/**
 * Script de inicialización completa de la base de datos
 * Crea todas las tablas, usuario admin y datos de prueba
 * Uso: node scripts/init-database.js
 */

const { Sequelize } = require('sequelize');
const path = require('path');
const bcrypt = require('bcryptjs');

// Importar modelos
const { initializeModels } = require('../src/models');

async function initializeDatabase() {
  const sequelize = new Sequelize(
    process.env.DB_NAME || 'bolsa_empleo',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '123456',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: console.log,
      define: { timestamps: true },
    }
  );

  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');

    console.log('🔄 Sincronizando modelos...');
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');

    // Crear usuario admin
    const User = sequelize.models.User;
    const Role = sequelize.models.Role;
    const Permission = sequelize.models.Permission;

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
      { name: 'manage_applications', module: 'postulaciones', action: 'gestionar' },
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
    const University = sequelize.models.University;
    const universities = [
      { name: 'Universidad Central de Venezuela', code: 'UCV', city: 'Caracas' },
      { name: 'Universidad de Los Andes', code: 'ULA', city: 'Mérida' },
      { name: 'Universidad Simón Bolívar', code: 'USB', city: 'Caracas' },
      { name: 'Universidad Católica Andrés Bello', code: 'UCAB', city: 'Caracas' },
    ];

    for (const uni of universities) {
      await University.findOrCreate({
        where: { code: uni.code },
        defaults: uni,
      });
    }
    console.log('✅ Universidades creadas');

    // Crear facultades
    const Faculty = sequelize.models.Faculty;
    const ucv = await University.findOne({ where: { code: 'UCV' } });
    
    if (ucv) {
      const faculties = [
        { name: 'Facultad de Ingeniería', universityId: ucv.id },
        { name: 'Facultad de Ciencias', universityId: ucv.id },
        { name: 'Facultad de Humanidades', universityId: ucv.id },
      ];

      for (const fac of faculties) {
        await Faculty.findOrCreate({
          where: { name: fac.name, universityId: fac.universityId },
          defaults: fac,
        });
      }
      console.log('✅ Facultades creadas');
    }

    // Crear empresas de prueba
    const Company = sequelize.models.Company;
    const companies = [
      {
        name: 'Acme Corporation',
        email: 'info@acme.com',
        phone: '+584121234567',
        website: 'https://acme.com',
        sector: 'Tecnología',
        description: 'Empresa líder en soluciones tecnológicas',
      },
      {
        name: 'TechVentures Inc',
        email: 'contact@techventures.com',
        phone: '+584149876543',
        website: 'https://techventures.com',
        sector: 'Software',
        description: 'Desarrollo de software y consultoría',
      },
    ];

    for (const company of companies) {
      await Company.findOrCreate({
        where: { email: company.email },
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
