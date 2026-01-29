const BaseService = require('./base.service');
const { 
  User, 
  Company, 
  UserSkill, 
  UserPortfolio, 
  File, 
  WorkExperience,
  Education,
  Certification,
  Project,
  Faculty,
  University,
} = require('../models');
const { Op } = require('sequelize');

class UserService extends BaseService {
  constructor() {
    super(User);
  }

  async findById(id, options = {}) {
    return User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Company, as: 'company' },
        { 
          model: Faculty, 
          as: 'faculty',
          include: [{ model: University, as: 'university' }]
        },
        { model: UserSkill, as: 'skills' },
        { model: UserPortfolio, as: 'portfolios' },
        { model: WorkExperience, as: 'workExperiences', order: [['startDate', 'DESC']] },
        { 
          model: Education, 
          as: 'educations', 
          include: [{ 
            model: Faculty, 
            as: 'faculty',
            include: [{ model: University, as: 'university' }]
          }],
          order: [['startDate', 'DESC']] 
        },
        { model: Certification, as: 'certifications', order: [['issueDate', 'DESC']] },
        { model: Project, as: 'projects', order: [['startDate', 'DESC']] },
      ],
      ...options,
    });
  }

  async findByEmail(email) {
    return User.findOne({
      where: { email },
      attributes: { exclude: ['password'] },
    });
  }

  async updateProfile(userId, data) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // No permitir cambiar email ni password aquí
    const { email, password, userType, ...updateData } = data;

    // Si institutionalEmail es string vacío, convertir a null
    if (updateData.institutionalEmail === '') {
      updateData.institutionalEmail = null;
    }

    return user.update(updateData);
  }

  async changeUserType(userId, userType) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user.update({ userType });
  }

  async toggleStatus(userId, isActive) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user.update({ isActive });
  }

  async searchGraduates({
    page = 1,
    pageSize = 20,
    skills,
    availableForWork,
    search,
  }) {
    const where = { userType: 'graduate' };

    if (availableForWork !== undefined) {
      where.availableForWork = availableForWork === 'true';
    }

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    return this.paginate({
      page,
      pageSize,
      where,
      include: [
        { 
          model: UserSkill, 
          as: 'skills',
          attributes: ['id', 'skillName', 'proficiencyLevel', 'yearsExperience']
        },
        { 
          model: UserPortfolio, 
          as: 'portfolios',
          attributes: ['id', 'title', 'url']
        },
        {
          model: WorkExperience,
          as: 'workExperiences',
          attributes: ['id', 'company', 'position', 'startDate', 'endDate', 'isCurrent'],
          limit: 3,
          order: [['startDate', 'DESC']],
        },
      ],
    });
  }

  async getProfile(userId) {
    return this.findById(userId);
  }

  async addSkill(userId, { name, level }) {
    const skill = await UserSkill.create({
      userId,
      skillName: name,
      proficiencyLevel: level || 'intermediate',
    });
    return skill;
  }

  async removeSkill(userId, skillId) {
    const skill = await UserSkill.findOne({
      where: { id: skillId, userId },
    });
    if (!skill) {
      throw new Error('Habilidad no encontrada');
    }
    return skill.destroy();
  }

  async addPortfolioLink(userId, { title, url }) {
    const portfolio = await UserPortfolio.create({
      userId,
      title,
      url,
    });
    return portfolio;
  }

  async removePortfolioLink(userId, portfolioId) {
    const portfolio = await UserPortfolio.findOne({
      where: { id: portfolioId, userId },
    });
    if (!portfolio) {
      throw new Error('Enlace de portafolio no encontrado');
    }
    return portfolio.destroy();
  }

  async toggleAvailability(userId, available) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user.update({ availableForWork: available });
  }

  async getAllUsers({ page = 1, pageSize = 10, search, userType, isActive }) {
    const offset = (page - 1) * pageSize;
    const where = {};

    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (userType) {
      where.userType = userType;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      offset,
      limit: pageSize,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
      },
    };
  }
}

module.exports = new UserService();
