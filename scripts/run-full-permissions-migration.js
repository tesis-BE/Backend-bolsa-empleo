// Migración completa: 15 permisos (1 por módulo del menú)
require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');

const seq = new Sequelize(
  process.env.DB_NAME || 'bolsa_empleo',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  { host: process.env.DB_HOST || 'localhost', port: process.env.DB_PORT || 5432, dialect: 'postgres', logging: false }
);

(async () => {
  try {
    await seq.authenticate();
    console.log('✅ Conectado\n');

    // 1. Insertar los 7 nuevos permisos
    const newPerms = [
      { name: 'view_dashboard',          module: 'dashboard',   action: 'ver' },
      { name: 'view_job_offers',          module: 'ofertas',     action: 'ver' },
      { name: 'view_saved_jobs',          module: 'favoritos',   action: 'ver' },
      { name: 'view_graduates',           module: 'graduados',   action: 'ver' },
      { name: 'view_messages',            module: 'mensajes',    action: 'ver' },
      { name: 'manage_company_recruiters',module: 'reclutadores',action: 'gestionar' },
      { name: 'manage_recruiter_requests',module: 'solicitudes', action: 'gestionar' },
    ];

    for (const p of newPerms) {
      await seq.query(
        `INSERT INTO permissions (name, module, action, "createdAt", "updatedAt")
         VALUES ('${p.name}', '${p.module}', '${p.action}', NOW(), NOW())
         ON CONFLICT (name) DO NOTHING`
      );
    }
    console.log('✅ 7 nuevos permisos insertados');

    // 2. Quitar view_analytics de todos los roles (no está en el menú)
    await seq.query(`
      DELETE FROM role_permissions
      WHERE "permissionId" = (SELECT id FROM permissions WHERE name = 'view_analytics' LIMIT 1)
    `);
    console.log('✅ view_analytics removido de roles');

    // 3. Quitar manage_company_recruiters de manage_companies (split)
    //    y quitar manage_recruiter_requests de manage_users (split)
    // (asignar solo si aún no existe)

    // Helper: get permission id
    const getId = async (name) => {
      const [[row]] = await seq.query(`SELECT id FROM permissions WHERE name = '${name}'`);
      return row?.id;
    };

    // Helper: get role id
    const getRoleId = async (name) => {
      const [[row]] = await seq.query(`SELECT id FROM roles WHERE name = '${name}'`);
      return row?.id;
    };

    const adminId    = await getRoleId('admin');
    const recruiterId= await getRoleId('recruiter');
    const graduateId = await getRoleId('graduate');

    // Permisos para cada rol
    const rolePerms = {
      admin: [
        'view_dashboard','view_job_offers','view_saved_jobs','view_graduates','view_messages',
        'manage_jobs','manage_applications','manage_companies','manage_company_recruiters',
        'manage_users','manage_recruiter_requests','manage_roles',
        'manage_faculties','manage_careers','manage_universities',
      ],
      recruiter: [
        'view_dashboard','view_job_offers','view_saved_jobs','view_graduates','view_messages',
        'manage_jobs','manage_applications',
      ],
      graduate: [
        'view_dashboard','view_job_offers','view_saved_jobs','view_graduates','view_messages',
      ],
    };

    const roleIds = { admin: adminId, recruiter: recruiterId, graduate: graduateId };

    // Limpiar y reasignar todos los permisos
    for (const [roleName, perms] of Object.entries(rolePerms)) {
      const roleId = roleIds[roleName];
      // Primero limpiar
      await seq.query(`DELETE FROM role_permissions WHERE "roleId" = ${roleId}`);
      // Luego asignar
      for (const permName of perms) {
        const permId = await getId(permName);
        if (permId) {
          await seq.query(
            `INSERT INTO role_permissions ("roleId", "permissionId", "createdAt", "updatedAt")
             VALUES (${roleId}, ${permId}, NOW(), NOW())
             ON CONFLICT DO NOTHING`
          );
        } else {
          console.warn(`  ⚠️  Permiso '${permName}' no encontrado`);
        }
      }
      console.log(`✅ ${roleName}: ${perms.length} permisos asignados`);
    }

    // 4. Verificación final
    const result = await seq.query(`
      SELECT r.name as role, p.name as permission
      FROM role_permissions rp
      JOIN roles r ON r.id = rp."roleId"
      JOIN permissions p ON p.id = rp."permissionId"
      ORDER BY r.name, p.name
    `, { type: QueryTypes.SELECT });

    console.log('\n📋 Estado final:');
    let lastRole = '';
    result.forEach(r => {
      if (r.role !== lastRole) { console.log(`\n  [${r.role}]`); lastRole = r.role; }
      console.log(`    → ${r.permission}`);
    });

    // Total permisos en el menú
    const [allPerms] = await seq.query(`SELECT name FROM permissions WHERE name != 'view_analytics' ORDER BY name`);
    console.log(`\n✅ Total permisos activos (sin view_analytics): ${allPerms.length}`);

    await seq.close();
    console.log('\n✅ Migración completa');
  } catch (e) {
    console.error('❌ Error:', e.message);
    process.exit(1);
  }
})();
