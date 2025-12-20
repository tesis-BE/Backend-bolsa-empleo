const BaseService = require('./base.service');
const {
  Application,
  Job,
  User,
  Company,
  Conversation,
  Notification,
} = require('../models');
const sequelize = require('../config/database');
const {
  APPLICATION_STATUS,
  JOB_STATUS,
  USER_TYPES,
} = require('../config/constants');
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
    const transaction = await sequelize.transaction();

    try {
      // Verificar que el trabajo existe y está publicado
      const job = await Job.findByPk(jobId, {
        include: [{ model: Company, as: 'company' }],
        transaction,
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
        transaction,
      });

      if (existingApplication) {
        throw new Error('Ya has postulado a esta oferta');
      }

      // Crear aplicación
      const application = await Application.create(
        {
          userId,
          jobId,
          coverLetter,
          status: APPLICATION_STATUS.PENDING,
          appliedAt: new Date(),
        },
        { transaction }
      );

      // Notificar al reclutador
      await Notification.create(
        {
          userId: job.company.recruiterId,
          title: 'Nueva postulación',
          message: `Tienes una nueva postulación para "${job.title}"`,
          type: 'info',
          eventType: 'new_application',
          relatedId: application.id,
        },
        { transaction }
      );

      await transaction.commit();
      return application;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async applyForCandidate(recruiterId, candidateId, jobId, coverLetter = null) {
    const transaction = await sequelize.transaction();

    try {
      const job = await Job.findByPk(jobId, {
        include: [{ model: Company, as: 'company' }],
        transaction,
      });

      if (!job) {
        throw new Error('Oferta no encontrada');
      }

      if (job.company.recruiterId !== recruiterId) {
        throw new Error(
          'No puedes postular candidatos a ofertas de otra empresa'
        );
      }

      if (job.status !== JOB_STATUS.PUBLISHED) {
        throw new Error('Esta oferta no está disponible');
      }

      const candidate = await User.findByPk(candidateId, { transaction });
      if (!candidate) {
        throw new Error('Candidato no encontrado');
      }

      if (candidate.userType !== USER_TYPES.GRADUATE) {
        throw new Error('Solo se pueden postular graduados');
      }

      // Verificar que no exista una postulación previa del candidato
      const existingApplication = await Application.findOne({
        where: { userId: candidateId, jobId },
        transaction,
      });

      if (existingApplication) {
        throw new Error('El candidato ya está postulado a esta oferta');
      }

      const application = await Application.create(
        {
          userId: candidateId,
          jobId,
          coverLetter,
          status: APPLICATION_STATUS.PENDING,
          appliedAt: new Date(),
        },
        { transaction }
      );

      // Notificar al candidato
      await Notification.create(
        {
          userId: candidateId,
          title: 'Nueva postulación creada',
          message: `Has sido postulado a "${job.title}" por tu reclutador`,
          type: 'info',
          eventType: 'new_application',
          relatedId: application.id,
        },
        { transaction }
      );

      await transaction.commit();
      return application;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateStatus(
    applicationId,
    recruiterId,
    status,
    rejectionReason = null,
    isAdmin = false
  ) {
    const transaction = await sequelize.transaction();

    try {
      const application = await this.findById(applicationId, { transaction });

      if (!application) {
        throw new Error('Postulación no encontrada');
      }

      // Verificar permisos
      if (!isAdmin && application.job.company.recruiterId !== recruiterId) {
        throw new Error('No tienes permiso para actualizar esta postulación');
      }

      // Actualizar estado
      await application.update(
        {
          status,
          rejectionReason:
            status === APPLICATION_STATUS.REJECTED ? rejectionReason : null,
        },
        { transaction }
      );

      // Si el estado es 'revisado' o 'entrevistado', crear conversación si no existe
      if (
        (status === APPLICATION_STATUS.REVIEWED ||
          status === APPLICATION_STATUS.INTERVIEWED) &&
        !application.conversation
      ) {
        await Conversation.create(
          {
            applicationId: application.id,
            graduateId: application.userId,
            recruiterId: application.job.company.recruiterId,
          },
          { transaction }
        );
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
        await Notification.create(
          {
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
          },
          { transaction }
        );
      }

      await transaction.commit();
      return application;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
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
