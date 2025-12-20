const { SavedJob, Job, Company } = require('../models');
const BaseService = require('./base.service');

class SavedJobService extends BaseService {
  constructor() {
    super(SavedJob);
  }

  async saveJob(userId, jobId) {
    const existing = await SavedJob.findOne({ where: { userId, jobId } });

    if (existing) {
      throw new Error('Ya has guardado esta oferta');
    }

    const job = await Job.findByPk(jobId);
    if (!job) {
      throw new Error('Oferta no encontrada');
    }

    return await SavedJob.create({ userId, jobId });
  }

  async unsaveJob(userId, jobId) {
    const saved = await SavedJob.findOne({ where: { userId, jobId } });

    if (!saved) {
      throw new Error('No has guardado esta oferta');
    }

    await saved.destroy();
    return true;
  }

  async getUserSavedJobs(userId, page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;

    const { count, rows } = await SavedJob.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: Company,
              as: 'company',
              attributes: ['id', 'name', 'logoUrl', 'location'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset,
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

  async isSaved(userId, jobId) {
    const saved = await SavedJob.findOne({ where: { userId, jobId } });
    return !!saved;
  }
}

module.exports = new SavedJobService();
