const BaseService = require('./base.service');
const { Company, User, Job, File } = require('../models');

class CompanyService extends BaseService {
  constructor() {
    super(Company);
  }

  async findById(id, options = {}) {
    return Company.findByPk(id, {
      include: [
        { model: User, as: 'recruiter', attributes: { exclude: ['password'] } },
        { model: Job, as: 'jobs' },
      ],
      ...options,
    });
  }

  async findByRecruiterId(recruiterId) {
    return Company.findOne({
      where: { recruiterId },
      include: [{ model: Job, as: 'jobs' }],
    });
  }

  async createCompany(recruiterId, data) {
    // Verificar que el recruiter no tenga ya una empresa
    const existingCompany = await this.findByRecruiterId(recruiterId);
    if (existingCompany) {
      throw new Error('Ya tienes una empresa registrada');
    }

    // Verificar que el usuario sea recruiter
    const user = await User.findByPk(recruiterId);
    if (!user || user.userType !== 'recruiter') {
      throw new Error('Solo los reclutadores pueden crear empresas');
    }

    const company = await Company.create({
      ...data,
      recruiterId,
    });

    // Actualizar el usuario con el companyId
    await user.update({ companyId: company.id });

    return company;
  }

  async updateCompany(companyId, recruiterId, data, isAdmin = false) {
    const company = await Company.findByPk(companyId);
    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    // Solo el dueño o admin pueden editar
    if (!isAdmin && company.recruiterId !== recruiterId) {
      throw new Error('No tienes permiso para editar esta empresa');
    }

    // No permitir cambiar recruiterId
    const { recruiterId: _, ...updateData } = data;

    return company.update(updateData);
  }

  async getActiveCompanies(page = 1, pageSize = 20) {
    return this.paginate({
      page,
      pageSize,
      where: { isActive: true },
      include: [
        {
          model: User,
          as: 'recruiter',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });
  }
}

module.exports = new CompanyService();
