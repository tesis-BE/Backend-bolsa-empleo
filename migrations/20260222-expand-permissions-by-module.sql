-- =====================================================================
-- Migración: Expandir permisos de configuración a módulos separados
-- Fecha: 2026-02-22
-- =====================================================================

-- 1. Insertar nuevos permisos separados
INSERT INTO "Permissions" (name, module, action, "createdAt", "updatedAt")
VALUES
  ('manage_faculties',   'facultades',   'gestionar', NOW(), NOW()),
  ('manage_careers',     'carreras',     'gestionar', NOW(), NOW()),
  ('manage_universities','extensiones',  'gestionar', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- 2. Asignar los 3 nuevos permisos al rol admin (id=1)
INSERT INTO "RolePermissions" ("RoleId", "PermissionId", "createdAt", "updatedAt")
SELECT 1, p.id, NOW(), NOW()
FROM "Permissions" p
WHERE p.name IN ('manage_faculties', 'manage_careers', 'manage_universities')
  AND NOT EXISTS (
    SELECT 1 FROM "RolePermissions" rp
    WHERE rp."RoleId" = 1 AND rp."PermissionId" = p.id
  );

-- 3. Eliminar el permiso genérico manage_settings de role_permissions
--    (ya no se usa — los 3 nuevos son su reemplazo)
DELETE FROM "RolePermissions"
WHERE "PermissionId" = (
  SELECT id FROM "Permissions" WHERE name = 'manage_settings' LIMIT 1
);

-- 4. Opcionalmente borrar el permiso manage_settings (si no hay otras referencias)
--    Comentado por seguridad; descomentarlo cuando se confirme que no se usa
-- DELETE FROM "Permissions" WHERE name = 'manage_settings';

-- Verificación final
SELECT r.name as role, p.name as permission
FROM "RolePermissions" rp
JOIN "Roles" r ON r.id = rp."RoleId"
JOIN "Permissions" p ON p.id = rp."PermissionId"
ORDER BY r.name, p.name;
