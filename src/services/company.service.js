const BaseService = require('./base.service');
const { Company, User, Job } = require('../models');
const { COMPANY_STATUS, USER_TYPES } = require('../config/constants');
const sequelize = require('../config/database');

class CompanyService extends BaseService {
  constructor() {
    super(Company);
  }

  async findById(id, options = {}) {
    return Company.findByPk(id, {
      include: [
        { model: User, as: 'owner', attributes: { exclude: ['password'] } },
        {
          model: User,
          as: 'recruiters',
          attributes: { exclude: ['password'] },
        },
        { model: Job, as: 'jobs' },
      ],
      ...options,
    });
  }

  async findByRecruiterId(recruiterId) {
    const user = await User.findByPk(recruiterId);
    if (!user || !user.companyId) {
      return null;
    }
    return Company.findByPk(user.companyId, {
      include: [{ model: Job, as: 'jobs' }],
    });
  }

  async getByRecruiter(recruiterId) {
    return this.findByRecruiterId(recruiterId);
  }

  async createCompany(data, ownerId = null) {
    const transaction = await sequelize.transaction();

    try {
      const company = await Company.create(
        {
          ...data,
          recruiterId: ownerId,
          status: COMPANY_STATUS.ACTIVE,
        },
        { transaction }
      );

      if (ownerId) {
        await User.update(
          { companyId: company.id },
          { where: { id: ownerId }, transaction }
        );
      }

      await transaction.commit();
      return company;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async createForRecruiter(recruiterId, data) {
    const user = await User.findByPk(recruiterId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return this.createCompany(data, recruiterId);
  }

  async addRecruiter(companyId, userId, requesterId) {
    const company = await Company.findByPk(companyId);
    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    await user.update({ companyId });
    return user;
  }

  async removeRecruiter(companyId, userId, requesterId) {
    const company = await Company.findByPk(companyId);
    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    await user.update({ companyId: null });
    return true;
  }

  async updateCompany(companyId, requesterId, data, isAdmin = false) {
    const company = await Company.findByPk(companyId);
    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    const { recruiterId, status, ...updateData } = data;
    return company.update(updateData);
  }

  async updateStatus(companyId, status, requesterId) {
    const company = await Company.findByPk(companyId);
    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    return company.update({ status });
  }

  async getActiveCompanies(page = 1, pageSize = 20) {
    return this.paginate({
      page,
      pageSize,
      where: { status: COMPANY_STATUS.ACTIVE },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
  }

  async canCreateJobs(companyId) {
    const company = await Company.findByPk(companyId);
    return company && company.status === COMPANY_STATUS.ACTIVE;
  }
}

module.exports = new CompanyService();
