const BaseService = require('./base.service');
const { Application, Job, User, Company, Conversation } = require('../models');
const { APPLICATION_STATUS, JOB_STATUS } = require('../config/constants');
const NotificationService = require('./notification.service');

class ApplicationService extends BaseService {
  constructor() {
    super(Application);
  }

  async findById(id, options = {}) {
    return Application.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job',
          include: [{ model: Company, as: 'company' }],
        },
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
        { model: Conversation, as: 'conversation' },
      ],
      ...options,
    });
  }

  async apply(userId, jobId, coverLetter = null) {
    // Verificar que el trabajo existe y está publicado
    const job = await Job.findByPk(jobId, {
      include: [{ model: Company, as: 'company' }],
    });

    if (!job) {
      throw new Error('Oferta no encontrada');
    }

    if (job.status !== JOB_STATUS.PUBLISHED) {
      throw new Error('Esta oferta no está disponible');
    }

    // Verificar que no haya aplicado antes
    const existingApplication = await Application.findOne({
      where: { userId, jobId },
    });

    if (existingApplication) {
      throw new Error('Ya has postulado a esta oferta');
    }

    // Crear aplicación
    const application = await Application.create({
      userId,
      jobId,
      coverLetter,
      status: APPLICATION_STATUS.PENDING,
      appliedAt: new Date(),
    });

    // Notificar al reclutador
    await NotificationService.create({
      userId: job.company.recruiterId,
      title: 'Nueva postulación',
      message: `Tienes una nueva postulación para "${job.title}"`,
      type: 'info',
      eventType: 'new_application',
      relatedId: application.id,
    });

    return application;
  }

  async updateStatus(
    applicationId,
    recruiterId,
    status,
    rejectionReason = null,
    isAdmin = false
  ) {
    const application = await this.findById(applicationId);

    if (!application) {
      throw new Error('Postulación no encontrada');
    }

    // Verificar permisos
    if (!isAdmin && application.job.company.recruiterId !== recruiterId) {
      throw new Error('No tienes permiso para actualizar esta postulación');
    }

    // Actualizar estado
    await application.update({
      status,
      rejectionReason:
        status === APPLICATION_STATUS.REJECTED ? rejectionReason : null,
    });

    // Si el estado es 'revisado' o 'entrevistado', crear conversación si no existe
    if (
      (status === APPLICATION_STATUS.REVIEWED ||
        status === APPLICATION_STATUS.INTERVIEWED) &&
      !application.conversation
    ) {
      await Conversation.create({
        applicationId: application.id,
        graduateId: application.userId,
        recruiterId: application.job.company.recruiterId,
      });
    }

    // Notificar al graduado
    let notificationMessage = '';
    if (status === APPLICATION_STATUS.REVIEWED) {
      notificationMessage = `Tu postulación para "${application.job.title}" ha sido revisada`;
    } else if (status === APPLICATION_STATUS.INTERVIEWED) {
      notificationMessage = `Has sido seleccionado para entrevista en "${application.job.title}"`;
    } else if (status === APPLICATION_STATUS.ACCEPTED) {
      notificationMessage = `¡Felicidades! Has sido aceptado para "${application.job.title}"`;
    } else if (status === APPLICATION_STATUS.REJECTED) {
      notificationMessage = `Tu postulación para "${application.job.title}" ha sido rechazada`;
    }

    if (notificationMessage) {
      await NotificationService.create({
        userId: application.userId,
        title: 'Actualización de postulación',
        message: notificationMessage,
        type:
          status === APPLICATION_STATUS.ACCEPTED
            ? 'success'
            : status === APPLICATION_STATUS.REJECTED
            ? 'warning'
            : 'info',
        eventType: 'application_' + status,
        relatedId: application.id,
      });
    }

    return application;
  }

  async cancel(applicationId, userId) {
    const application = await Application.findByPk(applicationId);

    if (!application) {
      throw new Error('Postulación no encontrada');
    }

    if (application.userId !== userId) {
      throw new Error('No tienes permiso para cancelar esta postulación');
    }

    // Solo se puede cancelar si está pendiente
    if (application.status !== APPLICATION_STATUS.PENDING) {
      throw new Error('Solo puedes cancelar postulaciones pendientes');
    }

    await application.destroy();
    return true;
  }

  async getByUser(userId, page = 1, pageSize = 20) {
    return this.paginate({
      page,
      pageSize,
      where: { userId },
      include: [
        {
          model: Job,
          as: 'job',
          include: [{ model: Company, as: 'company' }],
        },
      ],
      order: [['appliedAt', 'DESC']],
    });
  }

  async getByJob(jobId, page = 1, pageSize = 20) {
    return this.paginate({
      page,
      pageSize,
      where: { jobId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
      ],
      order: [['appliedAt', 'DESC']],
    });
  }

  async getByRecruiter(recruiterId, page = 1, pageSize = 20, status = null) {
    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    // Obtener la empresa del reclutador
    const company = await Company.findOne({ where: { recruiterId } });
    if (!company) {
      return {
        data: [],
        pagination: { page, pageSize, total: 0, totalPages: 0 },
      };
    }

    return this.paginate({
      page,
      pageSize,
      where: whereClause,
      include: [
        {
          model: Job,
          as: 'job',
          where: { companyId: company.id },
        },
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
      ],
      order: [['appliedAt', 'DESC']],
    });
  }
}

module.exports = new ApplicationService();
