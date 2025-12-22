const BaseService = require('./base.service');
const { Job, Company, User, Application } = require('../models');
const { JOB_STATUS, COMPANY_STATUS } = require('../config/constants');
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
              as: 'owner',
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
    const user = await User.findByPk(recruiterId);
    if (!user || !user.companyId) {
      throw new Error('Primero debes pertenecer a una empresa');
    }

    const company = await Company.findByPk(user.companyId);
    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    if (company.status !== COMPANY_STATUS.ACTIVE) {
      throw new Error('La empresa no está activa para crear ofertas');
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

    const user = await User.findByPk(recruiterId);
    if (!user || user.companyId !== job.companyId) {
      throw new Error('No tienes permiso para editar esta oferta');
    }

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
    const now = new Date();
    const where = {
      status: JOB_STATUS.PUBLISHED,
      [Op.or]: [{ expiresAt: null }, { expiresAt: { [Op.gt]: now } }],
    };

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

    if (skills && skills.length > 0) {
      where[Op.and] = [
        where[Op.or],
        {
          [Op.or]: skills.map((skill) => ({
            skills: { [Op.iLike]: `%${skill.trim()}%` },
          })),
        },
      ];
      delete where[Op.or];
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
    const user = await User.findByPk(recruiterId);
    if (!user || !user.companyId) {
      return {
        data: [],
        pagination: { page, pageSize, total: 0, totalPages: 0 },
      };
    }

    const where = { companyId: user.companyId };
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

  async hasPermission(jobId, userId) {
    // Validaciones de permisos deshabilitadas temporalmente
    return true;
  }

  async publish(jobId, recruiterId) {
    const job = await Job.findByPk(jobId, {
      include: [{ model: Company, as: 'company' }],
    });

    if (!job) {
      throw new Error('Oferta no encontrada');
    }

    if (job.status !== JOB_STATUS.DRAFT && job.status !== JOB_STATUS.PAUSED) {
      throw new Error('Solo se pueden publicar ofertas en borrador o pausadas');
    }

    if (job.company.status !== COMPANY_STATUS.ACTIVE) {
      throw new Error('La empresa debe estar activa para publicar ofertas');
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
