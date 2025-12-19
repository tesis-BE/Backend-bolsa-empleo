const ApplicationService = require('../services/application.service');
const ApiResponse = require('../utils/response.util');
const { validationResult } = require('express-validator');

class ApplicationController {
  async apply(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Error de validación', errors.array()));
      }

      const { jobId, coverLetter } = req.body;
      const application = await ApplicationService.apply(
        req.user.id,
        jobId,
        coverLetter
      );

      return res
        .status(201)
        .json(
          ApiResponse.created('Postulación enviada exitosamente', application)
        );
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async applyByRecruiter(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Error de validación', errors.array()));
      }

      const { jobId, userId, coverLetter } = req.body;
      const application = await ApplicationService.applyForCandidate(
        req.user.id,
        userId,
        jobId,
        coverLetter
      );

      return res
        .status(201)
        .json(
          ApiResponse.created(
            'Postulación creada para el candidato',
            application
          )
        );
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async cancel(req, res) {
    try {
      await ApplicationService.cancel(req.params.id, req.user.id);
      return res.status(200).json(ApiResponse.success('Postulación cancelada'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async getById(req, res) {
    try {
      const application = await ApplicationService.findById(req.params.id);

      if (!application) {
        return res
          .status(404)
          .json(ApiResponse.error('Postulación no encontrada'));
      }

      // Verificar permisos: solo el usuario que postuló o el reclutador pueden ver
      const isOwner = application.userId === req.user.id;
      const isRecruiter = application.job.company.recruiterId === req.user.id;
      const isAdmin = req.user.userType === 'admin';

      if (!isOwner && !isRecruiter && !isAdmin) {
        return res
          .status(403)
          .json(
            ApiResponse.error('No tienes permiso para ver esta postulación')
          );
      }

      return res
        .status(200)
        .json(ApiResponse.success('Postulación obtenida', application));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async updateStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Error de validación', errors.array()));
      }

      const { status, rejectionReason } = req.body;
      const isAdmin = req.user.userType === 'admin';

      const application = await ApplicationService.updateStatus(
        req.params.id,
        req.user.id,
        status,
        rejectionReason,
        isAdmin
      );

      return res
        .status(200)
        .json(ApiResponse.success('Estado actualizado', application));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async getMyApplications(req, res) {
    try {
      const { page = 1, pageSize = 20 } = req.query;
      const result = await ApplicationService.getByUser(
        req.user.id,
        parseInt(page),
        parseInt(pageSize)
      );
      return res
        .status(200)
        .json(ApiResponse.paginated('Mis postulaciones', result));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async getByJob(req, res) {
    try {
      const { page = 1, pageSize = 20 } = req.query;
      const result = await ApplicationService.getByJob(
        req.params.jobId,
        parseInt(page),
        parseInt(pageSize)
      );
      return res
        .status(200)
        .json(ApiResponse.paginated('Postulaciones de la oferta', result));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async getRecruiterApplications(req, res) {
    try {
      const { page = 1, pageSize = 20, status } = req.query;
      const result = await ApplicationService.getByRecruiter(
        req.user.id,
        parseInt(page),
        parseInt(pageSize),
        status
      );
      return res
        .status(200)
        .json(ApiResponse.paginated('Postulaciones recibidas', result));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new ApplicationController();
