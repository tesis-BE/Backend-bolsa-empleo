const BaseController = require('./base.controller');
const interviewService = require('../services/interview.service');

class InterviewController extends BaseController {
  constructor() {
    super(interviewService);
  }

  async create(req, res, next) {
    try {
      const { applicationId } = req.body;
      const interview = await interviewService.createInterview(
        applicationId,
        req.body
      );

      return res.status(201).json({
        success: true,
        message: 'Entrevista programada exitosamente',
        data: interview,
      });
    } catch (error) {
      next(error);
    }
  }

  async confirm(req, res, next) {
    try {
      const { id } = req.params;
      const { selectedDate } = req.body;
      const userId = req.user.id;

      const interview = await interviewService.confirmInterview(
        parseInt(id),
        userId,
        selectedDate
      );

      return res.status(200).json({
        success: true,
        message: 'Entrevista confirmada',
        data: interview,
      });
    } catch (error) {
      next(error);
    }
  }

  async reschedule(req, res, next) {
    try {
      const { id } = req.params;
      const { proposedDates } = req.body;

      const interview = await interviewService.rescheduleInterview(
        parseInt(id),
        proposedDates
      );

      return res.status(200).json({
        success: true,
        message: 'Entrevista reprogramada',
        data: interview,
      });
    } catch (error) {
      next(error);
    }
  }

  async complete(req, res, next) {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const interview = await interviewService.completeInterview(
        parseInt(id),
        notes
      );

      return res.status(200).json({
        success: true,
        message: 'Entrevista completada',
        data: interview,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const interview = await interviewService.cancelInterview(
        parseInt(id),
        userId
      );

      return res.status(200).json({
        success: true,
        message: 'Entrevista cancelada',
        data: interview,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUpcoming(req, res, next) {
    try {
      const userId = req.user.id;
      const userType = req.user.userType;

      const interviews = await interviewService.getUpcomingInterviews(
        userId,
        userType
      );

      return res.status(200).json({
        success: true,
        data: interviews,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InterviewController();
