const BaseService = require('./base.service');
const { University } = require('../models');

class UniversityService extends BaseService {
  constructor() {
    super(University);
  }

  async findAll(filters = {}) {
    const where = {};

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.code) {
      where.code = filters.code;
    }

    return this.model.findAll({
      where,
      order: [['name', 'ASC']],
    });
  }

  async findByCode(code) {
    return this.model.findOne({ where: { code } });
  }
}

module.exports = UniversityService;
