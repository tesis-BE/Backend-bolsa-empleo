const { Project } = require('../models');
const BaseService = require('./base.service');

class ProjectService extends BaseService {
  constructor() {
    super(Project);
  }

  async getUserProjects(userId) {
    return await Project.findAll({
      where: { userId },
      order: [['startDate', 'DESC']],
    });
  }

  async createProject(userId, data) {
    // Convertir technologies de string a array si es necesario
    if (data.technologies && typeof data.technologies === 'string') {
      data.technologies = data.technologies
        .split(/\s+/)
        .filter((tech) => tech.length > 0);
    }

    return await Project.create({
      userId,
      ...data,
    });
  }

  async updateProject(projectId, userId, data) {
    const project = await Project.findOne({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new Error('Proyecto no encontrado');
    }

    // Convertir technologies de string a array si es necesario
    if (data.technologies && typeof data.technologies === 'string') {
      data.technologies = data.technologies
        .split(/\s+/)
        .filter((tech) => tech.length > 0);
    }

    await project.update(data);
    return project;
  }

  async deleteProject(projectId, userId) {
    const project = await Project.findOne({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new Error('Proyecto no encontrado');
    }

    await project.destroy();
    return true;
  }
}

module.exports = new ProjectService();
