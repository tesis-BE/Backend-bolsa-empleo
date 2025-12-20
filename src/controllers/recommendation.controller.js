const BaseController = require('./base.controller');
const recommendationService = require('../services/recommendation.service');

class RecommendationController extends BaseController {
  constructor() {
    super(recommendationService);
  }

  async getRecommended(req, res, next) {
    try {
      const userId = req.user.id;
      const { page = 1, pageSize = 10 } = req.query;

      const result = await recommendationService.getRecommendedJobs(
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

  async getSimilar(req, res, next) {
    try {
      const { jobId } = req.params;
      const { limit = 5 } = req.query;

      const jobs = await recommendationService.getSimilarJobs(
        parseInt(jobId),
        parseInt(limit)
      );

      return res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecommendationController();
