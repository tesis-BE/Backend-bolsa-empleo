const BaseController = require('./base.controller');
const savedJobService = require('../services/savedJob.service');

class SavedJobController extends BaseController {
  constructor() {
    super(savedJobService);
  }

  async save(req, res, next) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      const result = await savedJobService.saveJob(userId, parseInt(jobId));

      return res.status(201).json({
        success: true,
        message: 'Oferta guardada exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async unsave(req, res, next) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      await savedJobService.unsaveJob(userId, parseInt(jobId));

      return res.status(200).json({
        success: true,
        message: 'Oferta eliminada de guardados',
      });
    } catch (error) {
      next(error);
    }
  }

  async getMySavedJobs(req, res, next) {
    try {
      const userId = req.user.id;
      const { page = 1, pageSize = 10 } = req.query;

      const result = await savedJobService.getUserSavedJobs(
        userId,
        parseInt(page),
        parseInt(pageSize)
      );

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkSaved(req, res, next) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      const isSaved = await savedJobService.isSaved(userId, parseInt(jobId));

      return res.status(200).json({
        success: true,
        data: { isSaved },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SavedJobController();
