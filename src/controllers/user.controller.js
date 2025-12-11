const BaseController = require('./base.controller');
const UserService = require('../services/user.service');
const FileService = require('../services/file.service');
const ApiResponse = require('../utils/response.util');
const { validationResult } = require('express-validator');

class UserController extends BaseController {
  constructor() {
    super(UserService, 'Usuario');
  }

  async getGraduates(req, res) {
    try {
      const { page = 1, pageSize = 20, search, skills } = req.query;
      const result = await UserService.getGraduates(
        parseInt(page),
        parseInt(pageSize),
        search,
        skills ? skills.split(',') : null
      );
      return res
        .status(200)
        .json(ApiResponse.paginated('Egresados obtenidos', result));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.params.id || req.user.id;
      const user = await UserService.getProfile(userId);

      if (!user) {
        return res.status(404).json(ApiResponse.error('Usuario no encontrado'));
      }

      return res.status(200).json(ApiResponse.success('Perfil obtenido', user));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Error de validación', errors.array()));
      }

      const user = await UserService.updateProfile(req.user.id, req.body);
      return res
        .status(200)
        .json(ApiResponse.success('Perfil actualizado', user));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async uploadPhoto(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json(ApiResponse.error('No se proporcionó ningún archivo'));
      }

      const file = await FileService.updateUserPhoto(req.user.id, req.file);
      return res
        .status(200)
        .json(
          ApiResponse.success('Foto actualizada', {
            url: `/uploads/${req.file.filename}`,
          })
        );
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async uploadCV(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json(ApiResponse.error('No se proporcionó ningún archivo'));
      }

      const file = await FileService.updateUserCV(req.user.id, req.file);
      return res
        .status(200)
        .json(
          ApiResponse.success('CV actualizado', {
            url: `/uploads/${req.file.filename}`,
          })
        );
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async addSkill(req, res) {
    try {
      const skill = await UserService.addSkill(req.user.id, req.body);
      return res
        .status(201)
        .json(ApiResponse.created('Habilidad agregada', skill));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async removeSkill(req, res) {
    try {
      await UserService.removeSkill(req.user.id, req.params.skillId);
      return res.status(200).json(ApiResponse.success('Habilidad eliminada'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async addPortfolioLink(req, res) {
    try {
      const portfolio = await UserService.addPortfolioLink(
        req.user.id,
        req.body
      );
      return res
        .status(201)
        .json(ApiResponse.created('Enlace de portafolio agregado', portfolio));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async removePortfolioLink(req, res) {
    try {
      await UserService.removePortfolioLink(
        req.user.id,
        req.params.portfolioId
      );
      return res
        .status(200)
        .json(ApiResponse.success('Enlace de portafolio eliminado'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async toggleAvailability(req, res) {
    try {
      const { available } = req.body;
      const user = await UserService.toggleAvailability(req.user.id, available);
      return res
        .status(200)
        .json(ApiResponse.success('Disponibilidad actualizada', user));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new UserController();
