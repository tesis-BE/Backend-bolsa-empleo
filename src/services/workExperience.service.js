const { WorkExperience } = require('../models');
const BaseService = require('./base.service');

class WorkExperienceService extends BaseService {
  constructor() {
    super(WorkExperience);
  }

  async getUserExperiences(userId) {
    return await WorkExperience.findAll({
      where: { userId },
      order: [['startDate', 'DESC']],
    });
  }

  async createExperience(userId, data) {
    return await WorkExperience.create({
      userId,
      ...data,
    });
  }

  async updateExperience(experienceId, userId, data) {
    const experience = await WorkExperience.findOne({
      where: { id: experienceId, userId },
    });

    if (!experience) {
      throw new Error('Experiencia no encontrada');
    }

    await experience.update(data);
    return experience;
  }

  async deleteExperience(experienceId, userId) {
    const experience = await WorkExperience.findOne({
      where: { id: experienceId, userId },
    });

    if (!experience) {
      throw new Error('Experiencia no encontrada');
    }

    await experience.destroy();
    return true;
  }
}

module.exports = new WorkExperienceService();
