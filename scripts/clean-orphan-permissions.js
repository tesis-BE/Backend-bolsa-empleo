/**
 * Script para limpiar permisos huérfanos de la base de datos.
 * Elimina todos los permisos que NO correspondan a un módulo del sidebar.
 * Los 15 permisos válidos son exactamente los 15 módulos del menú lateral.
 */

const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const seq = new Sequelize(
  process.env.DB_NAME     || 'bolsa_empleo',
  process.env.DB_USER     || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host:    process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
  }
);

const VALID_PERMISSIONS = [
  'view_dashboard',
  'view_job_offers',
  'view_saved_jobs',
  'manage_jobs',
  'manage_applications',
  'manage_companies',
  'manage_company_recruiters',
  'view_graduates',
  'view_messages',
  'manage_faculties',
  'manage_careers',
  'manage_universities',
  'manage_users',
  'manage_roles',
  'manage_recruiter_requests',
];

async function cleanOrphanPermissions() {
  try {
    await seq.authenticate();
    console.log('✅ Conectado a la BD\n');

    // Listar permisos actuales
    const [current] = await seq.query('SELECT id, name FROM permissions ORDER BY name');
    console.log(`Permisos actuales en BD (${current.length}):`);
    current.forEach(p => console.log(`  ${VALID_PERMISSIONS.includes(p.name) ? '✅' : '❌'} ${p.name}`));

    // Encontrar huérfanos
    const orphans = current.filter(p => !VALID_PERMISSIONS.includes(p.name));
    if (orphans.length === 0) {
      console.log('\n✅ No hay permisos huérfanos. Todo limpio.');
      return;
    }

    console.log(`\n⚠️  Permisos huérfanos a eliminar: ${orphans.map(p => p.name).join(', ')}`);

    // Eliminar asignaciones de roles de los permisos huérfanos
    for (const p of orphans) {
      await seq.query('DELETE FROM role_permissions WHERE "permissionId" = :id', {
        replacements: { id: p.id },
      });
    }
    console.log('🔗 Asignaciones de roles limpiadas.');

    // Eliminar los permisos huérfanos
    const names = orphans.map(p => `'${p.name}'`).join(', ');
    await seq.query(`DELETE FROM permissions WHERE name IN (${names})`);
    console.log(`🗑️  ${orphans.length} permisos eliminados.`);

    // Verificación final
    const [final] = await seq.query('SELECT name FROM permissions ORDER BY name');
    console.log(`\n✅ Permisos finales (${final.length}):`);
    final.forEach(p => console.log(`   - ${p.name}`));

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await seq.close();
  }
}

cleanOrphanPermissions();
