const BaseService = require('./base.service');
const { Role, RolePermission, Permission } = require('../models');

class RoleService extends BaseService {
  constructor() {
    super(Role);
  }

  async findWithPermissions(id) {
    return Role.findByPk(id, {
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] },
        },
      ],
    });
  }

  async getAllWithPermissions() {
    return Role.findAll({
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] },
        },
      ],
    });
  }

  async assignPermission(roleId, permissionId) {
    const [rolePermission, created] = await RolePermission.findOrCreate({
      where: { roleId, permissionId },
    });
    return rolePermission;
  }

  async removePermission(roleId, permissionId) {
    return RolePermission.destroy({
      where: { roleId, permissionId },
    });
  }

  async updatePermissions(roleId, permissionIds = []) {
    // Eliminar permisos existentes
    await RolePermission.destroy({ where: { roleId } });

    // Agregar nuevos permisos
    const permissions = permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    }));

    return RolePermission.bulkCreate(permissions);
  }
}

module.exports = new RoleService();
