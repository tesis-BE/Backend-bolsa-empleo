const BaseService = require('./base.service');
const { Permission } = require('../models');

class PermissionService extends BaseService {
  constructor() {
    super(Permission);
  }

  async getAll() {
    return Permission.findAll({
      order: [
        ['module', 'ASC'],
        ['action', 'ASC'],
      ],
    });
  }

  async getByModule(module) {
    return Permission.findAll({
      where: { module },
      order: [['action', 'ASC']],
    });
  }
}

module.exports = new PermissionService();
