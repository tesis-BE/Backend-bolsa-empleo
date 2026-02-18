const BaseService = require('./base.service');
const { Career, Faculty } = require('../models');

class CareerService extends BaseService {
  constructor() {
    super(Career);
  }

  async findAll(filters = {}) {
    const where = {};

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    } else {
      where.isActive = true;
    }

    if (filters.facultyId) {
      where.facultyId = filters.facultyId;
    }

    return this.model.findAll({
      where,
      include: [
        {
          model: Faculty,
          as: 'faculty',
          attributes: ['id', 'name', 'universityId'],
        },
      ],
      order: [['name', 'ASC']],
    });
  }

  async findByFaculty(facultyId) {
    return this.model.findAll({
      where: { facultyId, isActive: true },
      order: [['name', 'ASC']],
    });
  }

  async findById(id) {
    return this.model.findByPk(id, {
      include: [
        {
          model: Faculty,
          as: 'faculty',
          attributes: ['id', 'name', 'universityId'],
        },
      ],
    });
  }
}

module.exports = new CareerService();
