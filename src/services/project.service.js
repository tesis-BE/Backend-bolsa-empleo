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
