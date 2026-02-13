#!/usr/bin/env node
/**
 * Script completo de sincronización de BD
 * Aplica todas las migraciones, crea roles/permisos y puebla carreras
 * SIN eliminar datos existentes
 * 
 * Uso: node scripts/full-sync-database.js
 */

require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

const scripts = [
  {
    name: 'sync-database.js',
    description: 'Aplicar migraciones y crear roles/permisos',
  },
  {
    name: 'populate-careers.js',
    description: 'Crear carreras de prueba',
  },
  {
    name: 'assign-admin-permissions.js',
    description: 'Asignar permisos al rol admin',
  },
];

async function fullSync() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  SINCRONIZACIÓN COMPLETA DE BASE DE DATOS              ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  let successCount = 0;
  let failCount = 0;

  for (const script of scripts) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  ${script.description}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    try {
      const scriptPath = path.join(__dirname, script.name);
      execSync(`node ${scriptPath}`, { stdio: 'inherit' });
      successCount++;
    } catch (error) {
      console.error(`❌ Error en ${script.name}: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  RESUMEN DE SINCRONIZACIÓN                             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log(`✅ Scripts exitosos: ${successCount}/${scripts.length}`);
  if (failCount > 0) {
    console.log(`❌ Scripts con error: ${failCount}/${scripts.length}`);
  }

  console.log('\n📝 Pasos siguientes:');
  console.log('   1. Reinicia el backend: npm run dev');
  console.log('   2. Verifica la BD: \n');
  console.log('      SELECT COUNT(*) FROM careers;            -- debe dar > 0');
  console.log('      SELECT COUNT(*) FROM "UserRoles";        -- debe dar > 0');
  console.log('      SELECT COUNT(*) FROM permissions;        -- debe dar 7');
  console.log('      SELECT COUNT(*) FROM roles;              -- debe dar 3');
  console.log('\n   3. Prueba el login: fabriciozavala13@gmail.com / 123456\n');

  process.exit(failCount > 0 ? 1 : 0);
}

fullSync().catch((error) => {
  console.error('❌ Error fatal:', error.message);
  process.exit(1);
});
