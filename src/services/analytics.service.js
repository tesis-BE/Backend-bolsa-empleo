const { Application, Job, User, Company, sequelize } = require('../models');
const { Op } = require('sequelize');

class AnalyticsService {
  async getRecruiterAnalytics(recruiterId) {
    const company = await Company.findOne({ where: { recruiterId } });

    if (!company) {
      throw new Error('No tienes una empresa registrada');
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
    const company = await Company.findOne({ where: { recruiterId } });

    if (!company) {
      throw new Error('No tienes una empresa registrada');
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
    const company = await Company.findOne({ where: { recruiterId } });

    if (!company) {
      throw new Error('No tienes una empresa registrada');
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
}

module.exports = new AnalyticsService();
