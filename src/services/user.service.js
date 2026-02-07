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
  Role,
  Permission,
  UserRole,
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
    facultyId,
  }) {
    const where = { userType: 'graduate' };

    if (availableForWork !== undefined) {
      where.availableForWork = availableForWork === 'true';
    }

    if (facultyId) {
      where.facultyId = parseInt(facultyId);
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
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Faculty,
          as: 'faculty',
          attributes: ['id', 'name'],
          include: [{ model: University, as: 'university', attributes: ['id', 'name'] }],
        },
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
          attributes: ['id', 'company', 'position', 'startDate', 'endDate', 'isCurrent', 'description'],
          limit: 3,
          order: [['startDate', 'DESC']],
        },
        {
          model: Education,
          as: 'educations',
          attributes: ['id', 'institution', 'degree', 'fieldOfStudy', 'graduationYear', 'startDate', 'endDate', 'isCurrent'],
          limit: 2,
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
      include: [
        {
          association: 'company',
          attributes: ['id', 'name'],
        },
      ],
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

  // ==================== ROLES & PERMISSIONS ====================

  async assignRole(userId, roleId) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('Usuario no encontrado');

    const role = await Role.findByPk(roleId);
    if (!role) throw new Error('Rol no encontrado');

    const [userRole, created] = await UserRole.findOrCreate({
      where: { userId, roleId },
    });

    if (!created) throw new Error('El usuario ya tiene este rol asignado');
    return userRole;
  }

  async removeRole(userId, roleId) {
    const deleted = await UserRole.destroy({
      where: { userId, roleId },
    });
    if (!deleted) throw new Error('El usuario no tiene este rol asignado');
    return true;
  }

  async getUserRoles(userId) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'email'],
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              as: 'permissions',
              through: { attributes: [] },
            },
          ],
        },
      ],
    });
    if (!user) throw new Error('Usuario no encontrado');
    return user.roles;
  }

  async getUserPermissions(userId) {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              as: 'permissions',
              through: { attributes: [] },
            },
          ],
        },
      ],
    });
    if (!user) throw new Error('Usuario no encontrado');

    // Extraer permisos únicos de todos los roles
    const permissionsMap = new Map();
    for (const role of user.roles || []) {
      for (const perm of role.permissions || []) {
        if (!permissionsMap.has(perm.name)) {
          permissionsMap.set(perm.name, {
            id: perm.id,
            name: perm.name,
            module: perm.module,
            action: perm.action,
            description: perm.description,
          });
        }
      }
    }
    return Array.from(permissionsMap.values());
  }

  async getUserWithRolesAndPermissions(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              as: 'permissions',
              through: { attributes: [] },
            },
          ],
        },
      ],
    });
    if (!user) return null;

    // Extraer nombres de permisos únicos
    const permissionNames = new Set();
    for (const role of user.roles || []) {
      for (const perm of role.permissions || []) {
        permissionNames.add(perm.name);
      }
    }

    return {
      user,
      permissions: Array.from(permissionNames),
    };
  }
}

module.exports = new UserService();
