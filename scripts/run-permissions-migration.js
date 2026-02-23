// scripts/run-permissions-migration.js
// Migración: Expandir permisos de manage_settings a 3 módulos separados

const { Sequelize, QueryTypes } = require('sequelize');
require('dotenv').config();

const seq = new Sequelize(
  process.env.DB_NAME || 'bolsa_empleo',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

(async () => {
  try {
    await seq.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    // 1. Insertar nuevos permisos
    await seq.query(`
      INSERT INTO permissions (name, module, action, "createdAt", "updatedAt")
      VALUES
        ('manage_faculties',   'facultades',  'gestionar', NOW(), NOW()),
        ('manage_careers',     'carreras',    'gestionar', NOW(), NOW()),
        ('manage_universities','extensiones', 'gestionar', NOW(), NOW())
      ON CONFLICT (name) DO NOTHING
    `);
    console.log('✅ Permisos manage_faculties, manage_careers, manage_universities insertados');

    // 2. Asignar los nuevos permisos al rol admin (id=1)
    await seq.query(`
      INSERT INTO role_permissions ("roleId", "permissionId", "createdAt", "updatedAt")
      SELECT 1, p.id, NOW(), NOW()
      FROM permissions p
      WHERE p.name IN ('manage_faculties', 'manage_careers', 'manage_universities')
        AND NOT EXISTS (
          SELECT 1 FROM role_permissions rp
          WHERE rp."roleId" = 1 AND rp."permissionId" = p.id
        )
    `);
    console.log('✅ Nuevos permisos asignados al rol admin');

    // 3. Quitar manage_settings de todos los roles
    await seq.query(`
      DELETE FROM role_permissions
      WHERE "permissionId" = (
        SELECT id FROM permissions WHERE name = 'manage_settings' LIMIT 1
      )
    `);
    console.log('✅ manage_settings removido de todos los roles');

    // 4. Verificación final
    const result = await seq.query(`
      SELECT r.name as role, p.name as permission
      FROM role_permissions rp
      JOIN roles r ON r.id = rp."roleId"
      JOIN permissions p ON p.id = rp."permissionId"
      ORDER BY r.name, p.name
    `, { type: QueryTypes.SELECT });

    console.log('\n📋 Estado final de role_permissions:');
    result.forEach(r => console.log(`   ${r.role.padEnd(12)} → ${r.permission}`));

    await seq.close();
    console.log('\n✅ Migración completada exitosamente');
  } catch (e) {
    console.error('❌ Error en migración:', e.message);
    process.exit(1);
  }
})();
