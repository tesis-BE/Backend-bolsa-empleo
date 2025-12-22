const { Interview, Application, User, Job, Company } = require('../models');
const BaseService = require('./base.service');
const notificationService = require('./notification.service');

class InterviewService extends BaseService {
  constructor() {
    super(Interview);
  }

  async createInterview(applicationId, data) {
    const application = await Application.findByPk(applicationId, {
      include: [
        { model: User, as: 'user' },
        { model: Job, as: 'job', include: [{ model: Company, as: 'company' }] },
      ],
    });

    if (!application) {
      throw new Error('Postulación no encontrada');
    }

    const existing = await Interview.findOne({ where: { applicationId } });
    if (existing) {
      throw new Error(
        'Ya existe una entrevista programada para esta postulación'
      );
    }

    const interview = await Interview.create({
      applicationId,
      ...data,
    });

    await notificationService.create({
      userId: application.userId,
      eventType: 'interview_scheduled',
      title: 'Entrevista programada',
      message: `Se ha programado una entrevista para ${application.job.title}`,
      relatedId: interview.id,
      link: `/applications/${applicationId}`,
    });

    return interview;
  }

  async confirmInterview(interviewId, userId, selectedDate) {
    const interview = await Interview.findByPk(interviewId, {
      include: [
        {
          model: Application,
          as: 'application',
          include: [
            { model: User, as: 'user' },
            {
              model: Job,
              as: 'job',
              include: [{ model: Company, as: 'company' }],
            },
          ],
        },
      ],
    });

    if (!interview) {
      throw new Error('Entrevista no encontrada');
    }

    if (
      !interview.proposedDates.some(
        (date) => new Date(date).getTime() === new Date(selectedDate).getTime()
      )
    ) {
      throw new Error('Debes seleccionar una de las fechas propuestas');
    }

    interview.selectedDate = selectedDate;
    interview.status = 'confirmed';
    await interview.save();

    if (interview.application.job.company?.recruiterId) {
      await notificationService.create({
        userId: interview.application.job.company.recruiterId,
        eventType: 'interview_confirmed',
        title: 'Entrevista confirmada',
        message: `${interview.application.user.firstName} ha confirmado la entrevista`,
        relatedId: interview.id,
        link: `/applications/${interview.applicationId}`,
      });
    }

    return interview;
  }

  async rescheduleInterview(interviewId, newProposedDates) {
    const interview = await Interview.findByPk(interviewId);

    if (!interview) {
      throw new Error('Entrevista no encontrada');
    }

    interview.proposedDates = newProposedDates;
    interview.selectedDate = null;
    interview.status = 'rescheduled';
    await interview.save();

    return interview;
  }

  async completeInterview(interviewId, notes) {
    const interview = await Interview.findByPk(interviewId);

    if (!interview) {
      throw new Error('Entrevista no encontrada');
    }

    interview.status = 'completed';
    if (notes) {
      interview.notes = notes;
    }
    await interview.save();

    return interview;
  }

  async cancelInterview(interviewId, userId) {
    const interview = await Interview.findByPk(interviewId, {
      include: [{ model: Application, as: 'application' }],
    });

    if (!interview) {
      throw new Error('Entrevista no encontrada');
    }

    interview.status = 'cancelled';
    await interview.save();

    return interview;
  }

  async getUpcomingInterviews(userId, userType, companyId = null) {
    const whereClause =
      userType === 'graduate'
        ? { '$application.userId$': userId }
        : { '$application.job.companyId$': companyId };

    return await Interview.findAll({
      where: {
        status: ['pending', 'confirmed'],
        selectedDate: { [require('sequelize').Op.gte]: new Date() },
      },
      include: [
        {
          model: Application,
          as: 'application',
          required: true,
          include: [
            { model: User, as: 'user' },
            {
              model: Job,
              as: 'job',
              include: [{ model: Company, as: 'company' }],
            },
          ],
        },
      ],
      order: [['selectedDate', 'ASC']],
    });
  }
}

module.exports = new InterviewService();
