const certificationService = require('../services/certification.service');
const ApiResponse = require('../utils/response.util');
const { validationResult } = require('express-validator');

class CertificationController {
  async getMyCertifications(req, res) {
    try {
      const data = await certificationService.getUserCertifications(
        req.user.id
      );
      return res
        .status(200)
        .json(ApiResponse.success('Certificaciones obtenidas', data));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async getById(req, res) {
    try {
      const certification = await certificationService.findById(req.params.id);

      if (!certification) {
        return res
          .status(404)
          .json(ApiResponse.error('Certificación no encontrada'));
      }

      // Verificar que pertenece al usuario
      if (certification.userId !== req.user.id) {
        return res
          .status(403)
          .json(ApiResponse.error('No tienes acceso a esta certificación'));
      }

      return res
        .status(200)
        .json(ApiResponse.success('Certificación obtenida', certification));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Error de validación', errors.array()));
      }

      const data = await certificationService.createCertification(
        req.user.id,
        req.body
      );
      return res
        .status(201)
        .json(ApiResponse.created('Certificación creada', data));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Error de validación', errors.array()));
      }

      const data = await certificationService.updateCertification(
        req.params.id,
        req.user.id,
        req.body
      );
      return res
        .status(200)
        .json(ApiResponse.success('Certificación actualizada', data));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async delete(req, res) {
    try {
      await certificationService.deleteCertification(
        req.params.id,
        req.user.id
      );
      return res
        .status(200)
        .json(ApiResponse.success('Certificación eliminada'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new CertificationController();
