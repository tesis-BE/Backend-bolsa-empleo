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
    const payload = {
      userId,
      ...data,
      // Aceptar companyName desde el frontend y mapear a company
      company: data.company ?? data.companyName,
    };

    return await WorkExperience.create(payload);
  }

  async updateExperience(experienceId, userId, data) {
    const experience = await WorkExperience.findOne({
      where: { id: experienceId, userId },
    });

    if (!experience) {
      throw new Error('Experiencia no encontrada');
    }

    const payload = {
      ...data,
      // Mantener compatibilidad con companyName
      company: data.company ?? data.companyName ?? experience.company,
    };

    await experience.update(payload);
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
