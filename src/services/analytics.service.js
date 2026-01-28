const {
  Application,
  Job,
  User,
  Company,
  Faculty,
  University,
  UserSkill,
  sequelize,
} = require('../models');
const { Op } = require('sequelize');

class AnalyticsService {
  async getRecruiterAnalytics(recruiterId) {
    const user = await User.findByPk(recruiterId);
    if (!user || !user.companyId) {
      throw new Error('No perteneces a ninguna empresa');
    }

    const company = await Company.findByPk(user.companyId);
    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalApplications,
      applicationsThisMonth,
      applicationsLastMonth,
      activeJobs,
      totalJobs,
      interviewsScheduled,
      hiredThisMonth,
      applicationsByStatus,
      topJobs,
      applicationsByFaculty,
      avgResponseTime,
    ] = await Promise.all([
      Application.count({
        include: [
          {
            model: Job,
            as: 'job',
            where: { companyId: company.id },
            attributes: [],
          },
        ],
      }),

      Application.count({
        where: { createdAt: { [Op.gte]: firstDayOfMonth } },
        include: [
          {
            model: Job,
            as: 'job',
            where: { companyId: company.id },
            attributes: [],
          },
        ],
      }),

      Application.count({
        where: {
          createdAt: {
            [Op.between]: [firstDayOfLastMonth, lastDayOfLastMonth],
          },
        },
        include: [
          {
            model: Job,
            as: 'job',
            where: { companyId: company.id },
            attributes: [],
          },
        ],
      }),

      Job.count({
        where: {
          companyId: company.id,
          status: 'publicado',
        },
      }),

      Job.count({
        where: { companyId: company.id },
      }),

      Application.count({
        where: { status: 'entrevistado' },
        include: [
          {
            model: Job,
            as: 'job',
            where: { companyId: company.id },
            attributes: [],
          },
        ],
      }),

      Application.count({
        where: {
          status: 'aceptado',
          updatedAt: { [Op.gte]: firstDayOfMonth },
        },
        include: [
          {
            model: Job,
            as: 'job',
            where: { companyId: company.id },
            attributes: [],
          },
        ],
      }),

      Application.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('Application.id')), 'count'],
        ],
        include: [
          {
            model: Job,
            as: 'job',
            where: { companyId: company.id },
            attributes: [],
          },
        ],
        group: ['status'],
        raw: true,
      }),

      Application.findAll({
        attributes: [
          [
            sequelize.fn('COUNT', sequelize.col('Application.id')),
            'applications',
          ],
        ],
        include: [
          {
            model: Job,
            as: 'job',
            where: { companyId: company.id },
            attributes: ['id', 'title'],
          },
        ],
        group: ['job.id', 'job.title'],
        order: [
          [sequelize.fn('COUNT', sequelize.col('Application.id')), 'DESC'],
        ],
        limit: 5,
        raw: false,
      }),

      Application.findAll({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('Application.id')), 'count'],
        ],
        include: [
          {
            model: Job,
            as: 'job',
            where: { companyId: company.id },
            attributes: [],
          },
          {
            model: User,
            as: 'user',
            attributes: ['facultyId'],
          },
        ],
        group: ['user.facultyId'],
        raw: true,
      }),

      this.calculateAvgResponseTime(company.id),
    ]);

    const statusMap = {};
    applicationsByStatus.forEach((item) => {
      statusMap[item.status] = parseInt(item.count);
    });

    const conversionRate =
      totalApplications > 0
        ? ((hiredThisMonth / totalApplications) * 100).toFixed(2)
        : 0;

    const growthRate =
      applicationsLastMonth > 0
        ? (
            ((applicationsThisMonth - applicationsLastMonth) /
              applicationsLastMonth) *
            100
          ).toFixed(2)
        : 0;

    return {
      totalApplications,
      applicationsThisMonth,
      applicationsLastMonth,
      growthRate: parseFloat(growthRate),
      activeJobs,
      totalJobs,
      interviewsScheduled,
      hiredThisMonth,
      conversionRate: parseFloat(conversionRate),
      applicationsByStatus: {
        pendiente: statusMap.pendiente || 0,
        revisado: statusMap.revisado || 0,
        entrevistado: statusMap.entrevistado || 0,
        aceptado: statusMap.aceptado || 0,
        rechazado: statusMap.rechazado || 0,
      },
      topJobs: topJobs.map((item) => ({
        jobId: item.job.id,
        title: item.job.title,
        applications: parseInt(item.get('applications')),
      })),
      applicationsByFaculty,
      avgResponseTimeHours: avgResponseTime,
    };
  }

  async calculateAvgResponseTime(companyId) {
    const applications = await Application.findAll({
      where: {
        status: { [Op.notIn]: ['pendiente'] },
      },
      include: [
        {
          model: Job,
          as: 'job',
          where: { companyId },
          attributes: [],
        },
      ],
      attributes: ['createdAt', 'updatedAt'],
      raw: true,
    });

    if (applications.length === 0) return 0;

    const totalHours = applications.reduce((sum, app) => {
      const created = new Date(app.createdAt);
      const updated = new Date(app.updatedAt);
      const diffMs = updated - created;
      const diffHours = diffMs / (1000 * 60 * 60);
      return sum + diffHours;
    }, 0);

    return Math.round(totalHours / applications.length);
  }

  async getJobsAboutToExpire(recruiterId, daysThreshold = 7) {
    const user = await User.findByPk(recruiterId);
    if (!user || !user.companyId) {
      throw new Error('No perteneces a ninguna empresa');
    }

    const company = await Company.findByPk(user.companyId);
    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    const threshold = new Date();
    threshold.setDate(threshold.getDate() + daysThreshold);

    return await Job.findAll({
      where: {
        companyId: company.id,
        status: 'publicado',
        expiresAt: {
          [Op.between]: [new Date(), threshold],
        },
      },
      include: [
        {
          model: Application,
          as: 'applications',
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            sequelize.fn('COUNT', sequelize.col('applications.id')),
            'applicationsCount',
          ],
        ],
      },
      group: ['Job.id'],
    });
  }

  async getJobsWithoutApplications(recruiterId) {
    const user = await User.findByPk(recruiterId);
    if (!user || !user.companyId) {
      throw new Error('No perteneces a ninguna empresa');
    }

    const company = await Company.findByPk(user.companyId);
    if (!company) {
      throw new Error('Empresa no encontrada');
    }

    return await Job.findAll({
      where: {
        companyId: company.id,
        status: 'publicado',
      },
      include: [
        {
          model: Application,
          as: 'applications',
          required: false,
        },
      ],
      having: sequelize.literal('COUNT("applications"."id") = 0'),
      group: ['Job.id'],
    });
  }

  async getUsersStatsByType() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalUsers,
      usersByType,
      newUsersThisMonth,
      newUsersLastMonth,
      activeGraduates,
    ] = await Promise.all([
      User.count(),

      User.findAll({
        attributes: [
          'userType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        group: ['userType'],
        raw: true,
      }),

      User.count({
        where: { createdAt: { [Op.gte]: firstDayOfMonth } },
      }),

      User.count({
        where: {
          createdAt: {
            [Op.between]: [firstDayOfLastMonth, lastDayOfLastMonth],
          },
        },
      }),

      User.count({
        where: {
          userType: 'graduate',
          availableForWork: true,
        },
      }),
    ]);

    const typeMap = {};
    usersByType.forEach((item) => {
      typeMap[item.userType] = parseInt(item.count);
    });

    const growthRate =
      newUsersLastMonth > 0
        ? (
            ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) *
            100
          ).toFixed(2)
        : 0;

    return {
      totalUsers,
      graduates: typeMap.graduate || 0,
      recruiters: typeMap.recruiter || 0,
      admins: typeMap.admin || 0,
      newUsersThisMonth,
      growthRate: parseFloat(growthRate),
      activeGraduates,
    };
  }

  async getApplicationsGlobalStats() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalApplications,
      activeApplications,
      applicationsThisMonth,
      applicationsLastMonth,
      applicationsByStatus,
    ] = await Promise.all([
      Application.count(),

      Application.count({
        where: { status: { [Op.in]: ['pendiente', 'revisado', 'entrevistado'] } },
      }),

      Application.count({
        where: { createdAt: { [Op.gte]: firstDayOfMonth } },
      }),

      Application.count({
        where: {
          createdAt: {
            [Op.between]: [firstDayOfLastMonth, lastDayOfLastMonth],
          },
        },
      }),

      Application.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        group: ['status'],
        raw: true,
      }),
    ]);

    const statusMap = {};
    applicationsByStatus.forEach((item) => {
      statusMap[item.status] = parseInt(item.count);
    });

    const growthRate =
      applicationsLastMonth > 0
        ? (
            ((applicationsThisMonth - applicationsLastMonth) /
              applicationsLastMonth) *
            100
          ).toFixed(2)
        : 0;

    return {
      totalApplications,
      activeApplications,
      applicationsThisMonth,
      growthRate: parseFloat(growthRate),
      byStatus: {
        pendiente: statusMap.pendiente || 0,
        revisado: statusMap.revisado || 0,
        entrevistado: statusMap.entrevistado || 0,
        aceptado: statusMap.aceptado || 0,
        rechazado: statusMap.rechazado || 0,
      },
    };
  }

  async getCompaniesStats() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalCompanies,
      companiesByStatus,
      companiesWithActiveJobs,
      newCompaniesThisMonth,
      avgJobsPerCompany,
    ] = await Promise.all([
      Company.count(),

      Company.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        group: ['status'],
        raw: true,
      }),

      Company.count({
        include: [
          {
            model: Job,
            as: 'jobs',
            where: { status: 'publicado' },
            required: true,
          },
        ],
        distinct: true,
      }),

      Company.count({
        where: { createdAt: { [Op.gte]: firstDayOfMonth } },
      }),

      Job.count().then((totalJobs) => {
        return Company.count().then((totalCompanies) => {
          return totalCompanies > 0
            ? (totalJobs / totalCompanies).toFixed(2)
            : 0;
        });
      }),
    ]);

    const statusMap = {};
    companiesByStatus.forEach((item) => {
      statusMap[item.status] = parseInt(item.count);
    });

    return {
      totalCompanies,
      active: statusMap.activo || 0,
      pending: statusMap.pendiente || 0,
      inactive: statusMap.inactivo || 0,
      rejected: statusMap.rechazado || 0,
      companiesWithActiveJobs,
      newCompaniesThisMonth,
      avgJobsPerCompany: parseFloat(avgJobsPerCompany),
    };
  }

  async getTopCompaniesByHires(limit = 10) {
    const companies = await Company.findAll({
      attributes: [
        'id',
        'name',
        'logoUrl',
        'industry',
        [
          sequelize.fn('COUNT', sequelize.col('jobs->applications.id')),
          'hiresCount',
        ],
      ],
      include: [
        {
          model: Job,
          as: 'jobs',
          attributes: [],
          include: [
            {
              model: Application,
              as: 'applications',
              attributes: [],
              where: { status: 'aceptado' },
            },
          ],
        },
      ],
      group: ['Company.id'],
      having: sequelize.literal('COUNT("jobs->applications"."id") > 0'),
      order: [[sequelize.literal('hiresCount'), 'DESC']],
      limit,
      subQuery: false,
    });

    return companies.map((company) => ({
      id: company.id,
      name: company.name,
      logoUrl: company.logoUrl,
      industry: company.industry,
      hiresCount: parseInt(company.get('hiresCount')),
    }));
  }

  async getGraduatesProfileStats() {
    const [
      totalGraduates,
      graduatesWithCV,
      graduatesWithPhoto,
      avgSkillsPerGraduate,
      graduatesWithCompleteProfile,
    ] = await Promise.all([
      User.count({ where: { userType: 'graduate' } }),

      User.count({
        where: {
          userType: 'graduate',
          cvFileId: { [Op.ne]: null },
        },
      }),

      User.count({
        where: {
          userType: 'graduate',
          profilePhotoId: { [Op.ne]: null },
        },
      }),

      UserSkill.count().then((totalSkills) => {
        return User.count({ where: { userType: 'graduate' } }).then(
          (totalGrads) => {
            return totalGrads > 0 ? (totalSkills / totalGrads).toFixed(1) : 0;
          }
        );
      }),

      User.count({
        where: {
          userType: 'graduate',
          cvFileId: { [Op.ne]: null },
          profilePhotoId: { [Op.ne]: null },
          bio: { [Op.ne]: null },
        },
      }),
    ]);

    const cvPercentage =
      totalGraduates > 0
        ? ((graduatesWithCV / totalGraduates) * 100).toFixed(1)
        : 0;
    const photoPercentage =
      totalGraduates > 0
        ? ((graduatesWithPhoto / totalGraduates) * 100).toFixed(1)
        : 0;
    const completeProfilePercentage =
      totalGraduates > 0
        ? ((graduatesWithCompleteProfile / totalGraduates) * 100).toFixed(1)
        : 0;

    return {
      totalGraduates,
      graduatesWithCV,
      graduatesWithPhoto,
      cvPercentage: parseFloat(cvPercentage),
      photoPercentage: parseFloat(photoPercentage),
      avgSkillsPerGraduate: parseFloat(avgSkillsPerGraduate),
      graduatesWithCompleteProfile,
      completeProfilePercentage: parseFloat(completeProfilePercentage),
    };
  }

  async getGraduatesByFaculty() {
    const graduatesByFaculty = await User.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('User.id')), 'count'],
      ],
      where: { userType: 'graduate' },
      include: [
        {
          model: Faculty,
          as: 'faculty',
          attributes: ['id', 'name'],
          include: [
            {
              model: University,
              as: 'university',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      group: ['faculty.id', 'faculty.name', 'faculty->university.id', 'faculty->university.name'],
      order: [[sequelize.literal('count'), 'DESC']],
      raw: false,
    });

    return graduatesByFaculty.map((item) => ({
      facultyId: item.faculty?.id || null,
      facultyName: item.faculty?.name || 'Sin facultad',
      universityId: item.faculty?.university?.id || null,
      universityName: item.faculty?.university?.name || 'Sin universidad',
      count: parseInt(item.get('count')),
    }));
  }

  async getAverageTimeToHire() {
    const hiredApplications = await Application.findAll({
      where: { status: 'aceptado' },
      attributes: ['createdAt', 'updatedAt'],
      raw: true,
    });

    if (hiredApplications.length === 0) {
      return {
        avgDays: 0,
        totalHires: 0,
        fastest: 0,
        slowest: 0,
      };
    }

    const days = hiredApplications.map((app) => {
      const created = new Date(app.createdAt);
      const updated = new Date(app.updatedAt);
      const diffMs = updated - created;
      return diffMs / (1000 * 60 * 60 * 24);
    });

    const avgDays = days.reduce((sum, d) => sum + d, 0) / days.length;
    const fastest = Math.min(...days);
    const slowest = Math.max(...days);

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const hiresThisMonth = await Application.count({
      where: {
        status: 'aceptado',
        updatedAt: { [Op.gte]: firstDayOfMonth },
      },
    });

    return {
      avgDays: Math.round(avgDays),
      totalHires: hiredApplications.length,
      hiresThisMonth,
      fastest: Math.round(fastest),
      slowest: Math.round(slowest),
    };
  }

  async getTopSkillsDemand(limit = 20) {
    const jobs = await Job.findAll({
      where: {
        status: 'publicado',
        skills: { [Op.ne]: null },
      },
      attributes: ['skills'],
      raw: true,
    });

    const skillsCount = {};
    jobs.forEach((job) => {
      if (job.skills && Array.isArray(job.skills)) {
        job.skills.forEach((skill) => {
          const normalizedSkill = skill.trim().toLowerCase();
          skillsCount[normalizedSkill] =
            (skillsCount[normalizedSkill] || 0) + 1;
        });
      }
    });

    const sortedSkills = Object.entries(skillsCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([skill, count]) => ({
        skill: skill.charAt(0).toUpperCase() + skill.slice(1),
        demand: count,
      }));

    return sortedSkills;
  }
}

module.exports = new AnalyticsService();
