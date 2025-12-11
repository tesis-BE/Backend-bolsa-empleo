const BaseService = require('./base.service');
const { Job, Company, User, Application } = require('../models');
const { JOB_STATUS } = require('../config/constants');
const { Op } = require('sequelize');

class JobService extends BaseService {
  constructor() {
    super(Job);
  }

  async findById(id, options = {}) {
    return Job.findByPk(id, {
      include: [
        {
          model: Company,
          as: 'company',
          include: [
            {
              model: User,
              as: 'recruiter',
              attributes: ['id', 'firstName', 'lastName', 'email'],
            },
          ],
        },
        { model: Application, as: 'applications' },
      ],
      ...options,
    });
  }

  async createForRecruiter(recruiterId, data) {
    // Obtener la empresa del reclutador
    const company = await Company.findOne({ where: { recruiterId } });
    if (!company) {
      throw new Error('Primero debes registrar tu empresa');
    }

    return Job.create({
      ...data,
      companyId: company.id,
      status: JOB_STATUS.DRAFT,
    });
  }

  async updateByRecruiter(jobId, recruiterId, data) {
    const job = await Job.findByPk(jobId, {
      include: [{ model: Company, as: 'company' }],
    });

    if (!job) {
      throw new Error('Oferta no encontrada');
    }

    // Verificar permisos
    if (job.company.recruiterId !== recruiterId) {
      throw new Error('No tienes permiso para editar esta oferta');
    }

    // No permitir cambiar companyId ni status
    const { companyId, status, ...updateData } = data;

    await job.update(updateData);
    return job;
  }

  async search({
    page = 1,
    pageSize = 20,
    title,
    type,
    mode,
    minSalary,
    maxSalary,
    skills,
    location,
    companyId,
  }) {
    const where = { status: JOB_STATUS.PUBLISHED };

    if (title) {
      where.title = { [Op.iLike]: `%${title}%` };
    }

    if (type) {
      where.jobType = type;
    }

    if (mode) {
      where.workMode = mode;
    }

    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }

    if (minSalary) {
      where.salaryMax = { [Op.gte]: minSalary };
    }

    if (maxSalary) {
      where.salaryMin = { [Op.lte]: maxSalary };
    }

    if (companyId) {
      where.companyId = companyId;
    }

    // Para skills, buscamos usando LIKE en el JSON
    if (skills && skills.length > 0) {
      where[Op.or] = skills.map((skill) => ({
        skills: { [Op.iLike]: `%${skill.trim()}%` },
      }));
    }

    return this.paginate({
      page,
      pageSize,
      where,
      include: [
        {
          model: Company,
          as: 'company',
          attributes: ['id', 'name', 'industry', 'location', 'logoUrl'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async getByRecruiter(recruiterId, status = null, page = 1, pageSize = 20) {
    // Obtener la empresa del reclutador
    const company = await Company.findOne({ where: { recruiterId } });
    if (!company) {
      return {
        data: [],
        pagination: { page, pageSize, total: 0, totalPages: 0 },
      };
    }

    const where = { companyId: company.id };
    if (status) {
      where.status = status;
    }

    return this.paginate({
      page,
      pageSize,
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  async publish(jobId, recruiterId) {
    const job = await Job.findByPk(jobId, {
      include: [{ model: Company, as: 'company' }],
    });

    if (!job) {
      throw new Error('Oferta no encontrada');
    }

    if (job.company.recruiterId !== recruiterId) {
      throw new Error('No tienes permiso para publicar esta oferta');
    }

    if (job.status !== JOB_STATUS.DRAFT && job.status !== JOB_STATUS.PAUSED) {
      throw new Error('Solo se pueden publicar ofertas en borrador o pausadas');
    }

    await job.update({
      status: JOB_STATUS.PUBLISHED,
      publishedAt: new Date(),
    });

    return job;
  }

  async close(jobId, recruiterId) {
    const job = await Job.findByPk(jobId, {
      include: [{ model: Company, as: 'company' }],
    });

    if (!job) {
      throw new Error('Oferta no encontrada');
    }

    if (job.company.recruiterId !== recruiterId) {
      throw new Error('No tienes permiso para cerrar esta oferta');
    }

    await job.update({ status: JOB_STATUS.CLOSED });
    return job;
  }

  async deleteByRecruiter(jobId, recruiterId) {
    const job = await Job.findByPk(jobId, {
      include: [{ model: Company, as: 'company' }],
    });

    if (!job) {
      throw new Error('Oferta no encontrada');
    }

    if (job.company.recruiterId !== recruiterId) {
      throw new Error('No tienes permiso para eliminar esta oferta');
    }

    // Solo se pueden eliminar borradores
    if (job.status !== JOB_STATUS.DRAFT) {
      throw new Error('Solo se pueden eliminar ofertas en borrador');
    }

    await job.destroy();
    return true;
  }

  async checkExpired() {
    const now = new Date();

    await Job.update(
      { status: JOB_STATUS.EXPIRED },
      {
        where: {
          status: JOB_STATUS.PUBLISHED,
          expiresAt: { [Op.lt]: now },
        },
      }
    );
  }
}

module.exports = new JobService();
