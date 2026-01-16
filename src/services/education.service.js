const { Education } = require('../models');
const BaseService = require('./base.service');

class EducationService extends BaseService {
  constructor() {
    super(Education);
  }

  async getUserEducations(userId) {
    return await Education.findAll({
      where: { userId },
      order: [['startDate', 'DESC']],
    });
  }

  async createEducation(userId, data) {
    const payload = {
      userId,
      ...data,
      institution: data.institution ?? data.institutionName,
    };
    return await Education.create(payload);
  }

  async updateEducation(educationId, userId, data) {
    const education = await Education.findOne({
      where: { id: educationId, userId },
    });

    if (!education) {
      throw new Error('Educación no encontrada');
    }

    const payload = {
      ...data,
      institution: data.institution ?? data.institutionName ?? education.institution,
    };
    await education.update(payload);
    return education;
  }

  async deleteEducation(educationId, userId) {
    const education = await Education.findOne({
      where: { id: educationId, userId },
    });

    if (!education) {
      throw new Error('Educación no encontrada');
    }

    await education.destroy();
    return true;
  }
}

module.exports = new EducationService();
