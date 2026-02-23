const recruiterRequestService = require('../services/recruiter-request.service');
const ApiResponse = require('../utils/response.util');
const { validationResult } = require('express-validator');

class RecruiterRequestController {
  /**
   * POST /api/v1/recruiter-requests — Crear solicitud (público)
   */
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Errores de validación', errors.array()));
      }

      const request = await recruiterRequestService.createRequest(
        req.body,
        req.file // logo subido por multer
      );

      return res
        .status(201)
        .json(ApiResponse.created('Solicitud enviada exitosamente', request));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  /**
   * GET /api/v1/recruiter-requests — Listar solicitudes (admin)
   */
  async findAll(req, res) {
    try {
      const { status } = req.query;
      const result = await recruiterRequestService.getAllRequests({
        status,
        includeCompany: true,
      });
      return res
        .status(200)
        .json(ApiResponse.success('Solicitudes obtenidas', result));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  /**
   * GET /api/v1/recruiter-requests/:id — Detalle de solicitud (admin)
   */
  async findOne(req, res) {
    try {
      const request = await recruiterRequestService.getRequestById(req.params.id);
      return res
        .status(200)
        .json(ApiResponse.success('Solicitud obtenida', request));
    } catch (error) {
      return res.status(404).json(ApiResponse.error(error.message));
    }
  }

  /**
   * POST /api/v1/recruiter-requests/:id/approve — Aprobar solicitud (admin)
   */
  async approve(req, res) {
    try {
      const result = await recruiterRequestService.approveRequest(req.params.id);
      return res
        .status(200)
        .json(ApiResponse.success('Solicitud aprobada exitosamente', result));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  /**
   * POST /api/v1/recruiter-requests/:id/reject — Rechazar solicitud (admin)
   */
  async reject(req, res) {
    try {
      const { rejectionReason } = req.body;
      const result = await recruiterRequestService.rejectRequest(
        req.params.id,
        rejectionReason
      );
      return res
        .status(200)
        .json(ApiResponse.success('Solicitud rechazada', result));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new RecruiterRequestController();
