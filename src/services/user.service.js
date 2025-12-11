const BaseService = require('./base.service');
const { User, Company, UserSkill, UserPortfolio, File } = require('../models');
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
        { model: UserSkill, as: 'skills' },
        { model: UserPortfolio, as: 'portfolios' },
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
        { model: UserSkill, as: 'skills' },
        { model: UserPortfolio, as: 'portfolios' },
      ],
    });
  }
}

module.exports = new UserService();
