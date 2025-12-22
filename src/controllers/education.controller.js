const educationService = require('../services/education.service');
const ApiResponse = require('../utils/response.util');
const { validationResult } = require('express-validator');

class EducationController {
  async getMyEducations(req, res) {
    try {
      const data = await educationService.getUserEducations(req.user.id);
      return res
        .status(200)
        .json(ApiResponse.success('Educación obtenida', data));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async getById(req, res) {
    try {
      const education = await educationService.findById(req.params.id);

      if (!education) {
        return res
          .status(404)
          .json(ApiResponse.error('Educación no encontrada'));
      }

      // Verificar que pertenece al usuario
      if (education.userId !== req.user.id) {
        return res
          .status(403)
          .json(ApiResponse.error('No tienes acceso a esta educación'));
      }

      return res
        .status(200)
        .json(ApiResponse.success('Educación obtenida', education));
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

      const data = await educationService.createEducation(
        req.user.id,
        req.body
      );
      return res
        .status(201)
        .json(ApiResponse.created('Educación creada', data));
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

      const data = await educationService.updateEducation(
        req.params.id,
        req.user.id,
        req.body
      );
      return res
        .status(200)
        .json(ApiResponse.success('Educación actualizada', data));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async delete(req, res) {
    try {
      await educationService.deleteEducation(req.params.id, req.user.id);
      return res.status(200).json(ApiResponse.success('Educación eliminada'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new EducationController();
