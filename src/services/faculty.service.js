const BaseService = require('./base.service');
const { Faculty, University } = require('../models');

class FacultyService extends BaseService {
  constructor() {
    super(Faculty);
  }

  async findAll(filters = {}) {
    const where = {};

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.universityId) {
      where.universityId = filters.universityId;
    }

    return this.model.findAll({
      where,
      include: [
        {
          model: University,
          as: 'university',
          attributes: ['id', 'name', 'code'],
        },
      ],
      order: [['name', 'ASC']],
    });
  }

  async findByUniversity(universityId) {
    return this.model.findAll({
      where: { universityId },
      order: [['name', 'ASC']],
    });
  }
}

module.exports = new FacultyService();
