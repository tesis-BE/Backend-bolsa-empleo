const BaseController = require('./base.controller');
const analyticsService = require('../services/analytics.service');

class AnalyticsController extends BaseController {
  constructor() {
    super(analyticsService);
  }

  async getRecruiterAnalytics(req, res, next) {
    try {
      const recruiterId = req.user.id;
      const analytics = await analyticsService.getRecruiterAnalytics(
        recruiterId
      );

      return res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobsAboutToExpire(req, res, next) {
    try {
      const recruiterId = req.user.id;
      const { days = 7 } = req.query;

      const jobs = await analyticsService.getJobsAboutToExpire(
        recruiterId,
        parseInt(days)
      );

      return res.status(200).json({
        success: true,
        data: jobs,
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobsWithoutApplications(req, res, next) {
    try {
      const recruiterId = req.user.id;
      const jobs = await analyticsService.getJobsWithoutApplications(
        recruiterId
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

module.exports = new AnalyticsController();
