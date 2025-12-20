const {
  User,
  WorkExperience,
  Education,
  Certification,
  Project,
  UserSkill,
  UserPortfolio,
} = require('../models');

class ProfileService {
  async getCompleteProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: WorkExperience,
          as: 'workExperiences',
          order: [['startDate', 'DESC']],
        },
        {
          model: Education,
          as: 'educations',
          order: [['startDate', 'DESC']],
        },
        {
          model: Certification,
          as: 'certifications',
          order: [['issueDate', 'DESC']],
        },
        {
          model: Project,
          as: 'projects',
          order: [['startDate', 'DESC']],
        },
        {
          model: UserSkill,
          as: 'skills',
        },
        {
          model: UserPortfolio,
          as: 'portfolios',
        },
      ],
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }
}

module.exports = new ProfileService();
