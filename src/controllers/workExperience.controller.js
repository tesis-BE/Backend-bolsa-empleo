const workExperienceService = require('../services/workExperience.service');
const ApiResponse = require('../utils/response.util');
const { validationResult } = require('express-validator');

class WorkExperienceController {
  async getMyExperiences(req, res) {
    try {
      const data = await workExperienceService.getUserExperiences(req.user.id);
      return res
        .status(200)
        .json(ApiResponse.success('Experiencias obtenidas', data));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async getById(req, res) {
    try {
      const experience = await workExperienceService.findById(req.params.id);

      if (!experience) {
        return res
          .status(404)
          .json(ApiResponse.error('Experiencia no encontrada'));
      }

      // Verificar que pertenece al usuario
      if (experience.userId !== req.user.id) {
        return res
          .status(403)
          .json(ApiResponse.error('No tienes acceso a esta experiencia'));
      }

      return res
        .status(200)
        .json(ApiResponse.success('Experiencia obtenida', experience));
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

      const data = await workExperienceService.createExperience(
        req.user.id,
        req.body
      );
      return res
        .status(201)
        .json(ApiResponse.created('Experiencia creada', data));
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

      const data = await workExperienceService.updateExperience(
        req.params.id,
        req.user.id,
        req.body
      );
      return res
        .status(200)
        .json(ApiResponse.success('Experiencia actualizada', data));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async delete(req, res) {
    try {
      await workExperienceService.deleteExperience(req.params.id, req.user.id);
      return res.status(200).json(ApiResponse.success('Experiencia eliminada'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new WorkExperienceController();
