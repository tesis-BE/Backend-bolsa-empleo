#!/usr/bin/env node
/**
 * Script de sincronización de migraciones
 * Aplica solo las migraciones nuevas sin tocar datos existentes
 * Uso: node scripts/sync-database.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sequelize = require('../src/config/database');
const { Role, Permission } = require('../src/models');

const migrationFiles = [
  '20260201-add-cedula-to-users.sql',
  '20260202-create-careers-table.sql',
  '20260203-chat-notifications-columns.sql',
  '20260207-create-user-roles-table.sql',
  '20260218-add-university-career-to-users.sql',
  '20260218-add-careerID-to-education.sql',
  '20260218-add-missing-profile-fields.sql',
  '20260218-fix-portfolio-enum.sql',
];

async function runMigrations() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa\n');

    console.log('🔄 Aplicando migraciones...\n');

    for (const file of migrationFiles) {
      try {
        const migrationPath = path.join(__dirname, '../migrations', file);
        if (!fs.existsSync(migrationPath)) {
          console.log(`⚠️  Archivo no encontrado: ${file}`);
          continue;
        }

        const sql = fs.readFileSync(migrationPath, 'utf8');
        await sequelize.query(sql);
        console.log(`✅ ${file}`);
      } catch (error) {
        // Ignorar errores si la migración ya fue aplicada
        if (
          error.message.includes('already exists') ||
          error.message.includes('does not exist') ||
          error.message.includes('duplicate key')
        ) {
          console.log(`ℹ️  ${file} (ya aplicada)`);
        } else {
          console.error(`❌ Error en ${file}:`, error.message);
        }
      }
    }

    console.log('\n🔄 Verificando roles y permisos...\n');

    // Asegurar que existen los roles
    const roles = [
      { name: 'admin', description: 'Administrador del sistema' },
      { name: 'recruiter', description: 'Reclutador de empresa' },
      { name: 'graduate', description: 'Graduado/Alumno' },
    ];

    for (const roleData of roles) {
      const [role] = await Role.findOrCreate({
        where: { name: roleData.name },
        defaults: roleData,
      });
      console.log(`✅ Rol ${roleData.name} verificado`);
    }

    // Asegurar que existen los permisos
    const permissions = [
      { name: 'manage_users', module: 'usuarios', action: 'gestionar' },
      { name: 'manage_companies', module: 'empresas', action: 'gestionar' },
      { name: 'manage_jobs', module: 'ofertas', action: 'gestionar' },
      { name: 'manage_applications', module: 'postulaciones', action: 'gestionar' },
      { name: 'manage_roles', module: 'roles', action: 'gestionar' },
      { name: 'view_analytics', module: 'reportes', action: 'ver' },
      { name: 'manage_faculties', module: 'facultades', action: 'gestionar' },
      { name: 'manage_careers', module: 'carreras', action: 'gestionar' },
      { name: 'manage_universities', module: 'extensiones', action: 'gestionar' },
    ];

    for (const permData of permissions) {
      await Permission.findOrCreate({
        where: { name: permData.name },
        defaults: permData,
      });
    }
    console.log(`✅ ${permissions.length} permisos verificados\n`);

    console.log('✅ Base de datos sincronizada exitosamente');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Reinicia el backend: npm run dev');
    console.log('   2. Verifica que el usuario admin existe: fabriciozavala13@gmail.com');
    console.log('   3. Asigna permisos al rol admin si es necesario\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runMigrations();
