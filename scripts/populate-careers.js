#!/usr/bin/env node
/**
 * Script para poblar carreras de prueba
 * Crea carreras asociadas a facultades existentes
 * Uso: node scripts/populate-careers.js
 */

require('dotenv').config();
const sequelize = require('../src/config/database');
const { Faculty, Career, University } = require('../src/models');

async function populateCareers() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa\n');

    console.log('🔄 Creando universidades...');

    // Verificar universidades
    const universities = [
      { code: 'ULEAM', name: 'Universidad Laica Eloy Alfaro de Manabí' },
    ];

    let uleam = await University.findOne({ where: { code: 'ULEAM' } });

    if (!uleam) {
      uleam = await University.create({
        code: 'ULEAM',
        name: 'Universidad Laica Eloy Alfaro de Manabí',
        description: 'Universidad pública de Manabí',
      });
      console.log('✅ Universidad ULEAM creada');
    } else {
      console.log('ℹ️  Universidad ULEAM ya existe');
    }

    console.log('\n🔄 Creando facultades...');

    // Crear facultades si no existen
    const facultiesData = [
      {
        name: 'Facultad de Ciencias Informáticas',
        universityId: uleam.id,
      },
      {
        name: 'Facultad de Ciencias Administrativas',
        universityId: uleam.id,
      },
      {
        name: 'Facultad de Ingeniería',
        universityId: uleam.id,
      },
    ];

    const faculties = {};
    for (const facData of facultiesData) {
      const [fac] = await Faculty.findOrCreate({
        where: { name: facData.name, universityId: facData.universityId },
        defaults: facData,
      });
      faculties[facData.name] = fac;
      console.log(`✅ ${facData.name}`);
    }

    console.log('\n🔄 Creando carreras...');

    // Carreras para Facultad de Informática
    const informaticaCareers = [
      {
        name: 'Ingeniería en Sistemas',
        description: 'Programa de pregrado en Ingeniería en Sistemas',
        facultyId: faculties['Facultad de Ciencias Informáticas'].id,
      },
      {
        name: 'Ingeniería en Redes y Telecomunicaciones',
        description: 'Programa de pregrado en Ingeniería en Redes',
        facultyId: faculties['Facultad de Ciencias Informáticas'].id,
      },
      {
        name: 'Tecnología en Informática',
        description: 'Programa de tecnología en Informática',
        facultyId: faculties['Facultad de Ciencias Informáticas'].id,
      },
    ];

    // Carreras para Facultad de Administración
    const adminCareers = [
      {
        name: 'Administración de Empresas',
        description: 'Programa de pregrado en Administración',
        facultyId: faculties['Facultad de Ciencias Administrativas'].id,
      },
      {
        name: 'Contabilidad',
        description: 'Programa de pregrado en Contabilidad',
        facultyId: faculties['Facultad de Ciencias Administrativas'].id,
      },
    ];

    // Carreras para Facultad de Ingeniería
    const engineeringCareers = [
      {
        name: 'Ingeniería Civil',
        description: 'Programa de pregrado en Ingeniería Civil',
        facultyId: faculties['Facultad de Ingeniería'].id,
      },
      {
        name: 'Ingeniería Industrial',
        description: 'Programa de pregrado en Ingeniería Industrial',
        facultyId: faculties['Facultad de Ingeniería'].id,
      },
    ];

    const allCareers = [
      ...informaticaCareers,
      ...adminCareers,
      ...engineeringCareers,
    ];

    let createdCount = 0;
    let existingCount = 0;

    for (const careerData of allCareers) {
      const [career, created] = await Career.findOrCreate({
        where: { name: careerData.name },
        defaults: careerData,
      });

      if (created) {
        console.log(`✅ ${careerData.name}`);
        createdCount++;
      } else {
        console.log(`ℹ️  ${careerData.name} (ya existe)`);
        existingCount++;
      }
    }

    console.log(`\n✅ Resumen:`);
    console.log(`   Carreras creadas: ${createdCount}`);
    console.log(`   Carreras existentes: ${existingCount}`);
    console.log(`   Total: ${allCareers.length}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

populateCareers();
