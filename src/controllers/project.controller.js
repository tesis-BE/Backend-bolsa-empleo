const projectService = require('../services/project.service');
const ApiResponse = require('../utils/response.util');
const { validationResult } = require('express-validator');

class ProjectController {
  async getMyProjects(req, res) {
    try {
      const data = await projectService.getUserProjects(req.user.id);
      return res
        .status(200)
        .json(ApiResponse.success('Proyectos obtenidos', data));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async getById(req, res) {
    try {
      const project = await projectService.findById(req.params.id);

      if (!project) {
        return res
          .status(404)
          .json(ApiResponse.error('Proyecto no encontrado'));
      }

      // Verificar que pertenece al usuario
      if (project.userId !== req.user.id) {
        return res
          .status(403)
          .json(ApiResponse.error('No tienes acceso a este proyecto'));
      }

      return res
        .status(200)
        .json(ApiResponse.success('Proyecto obtenido', project));
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

      const data = await projectService.createProject(req.user.id, req.body);
      return res.status(201).json(ApiResponse.created('Proyecto creado', data));
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

      const data = await projectService.updateProject(
        req.params.id,
        req.user.id,
        req.body
      );
      return res
        .status(200)
        .json(ApiResponse.success('Proyecto actualizado', data));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async delete(req, res) {
    try {
      await projectService.deleteProject(req.params.id, req.user.id);
      return res.status(200).json(ApiResponse.success('Proyecto eliminado'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new ProjectController();
