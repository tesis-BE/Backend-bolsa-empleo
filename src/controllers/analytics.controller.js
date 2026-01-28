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

  async getUsersStatsByType(req, res, next) {
    try {
      const stats = await analyticsService.getUsersStatsByType();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsGlobalStats(req, res, next) {
    try {
      const stats = await analyticsService.getApplicationsGlobalStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompaniesStats(req, res, next) {
    try {
      const stats = await analyticsService.getCompaniesStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTopCompaniesByHires(req, res, next) {
    try {
      const { limit = 10 } = req.query;
      const companies = await analyticsService.getTopCompaniesByHires(
        parseInt(limit)
      );
      return res.status(200).json({
        success: true,
        data: companies,
      });
    } catch (error) {
      next(error);
    }
  }

  async getGraduatesProfileStats(req, res, next) {
    try {
      const stats = await analyticsService.getGraduatesProfileStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getGraduatesByFaculty(req, res, next) {
    try {
      const stats = await analyticsService.getGraduatesByFaculty();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAverageTimeToHire(req, res, next) {
    try {
      const stats = await analyticsService.getAverageTimeToHire();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTopSkillsDemand(req, res, next) {
    try {
      const { limit = 20 } = req.query;
      const skills = await analyticsService.getTopSkillsDemand(
        parseInt(limit)
      );
      return res.status(200).json({
        success: true,
        data: skills,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();
