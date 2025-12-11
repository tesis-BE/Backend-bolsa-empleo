const BaseController = require('./base.controller');
const CompanyService = require('../services/company.service');
const FileService = require('../services/file.service');
const ApiResponse = require('../utils/response.util');
const { validationResult } = require('express-validator');

class CompanyController extends BaseController {
  constructor() {
    super(CompanyService, 'Empresa');
  }

  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Error de validación', errors.array()));
      }

      const company = await CompanyService.createForRecruiter(
        req.user.id,
        req.body
      );
      return res
        .status(201)
        .json(ApiResponse.created('Empresa creada exitosamente', company));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async getMyCompany(req, res) {
    try {
      const company = await CompanyService.getByRecruiter(req.user.id);

      if (!company) {
        return res
          .status(404)
          .json(ApiResponse.error('No tienes una empresa registrada'));
      }

      return res
        .status(200)
        .json(ApiResponse.success('Empresa obtenida', company));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
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

      // Obtener la empresa del reclutador
      const company = await CompanyService.getByRecruiter(req.user.id);

      if (!company) {
        return res
          .status(404)
          .json(ApiResponse.error('No tienes una empresa registrada'));
      }

      const updatedCompany = await CompanyService.update(company.id, req.body);
      return res
        .status(200)
        .json(ApiResponse.success('Empresa actualizada', updatedCompany));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async uploadLogo(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json(ApiResponse.error('No se proporcionó ningún archivo'));
      }

      // Obtener la empresa del reclutador
      const company = await CompanyService.getByRecruiter(req.user.id);

      if (!company) {
        return res
          .status(404)
          .json(ApiResponse.error('No tienes una empresa registrada'));
      }

      await FileService.updateCompanyLogo(company.id, req.user.id, req.file);
      return res
        .status(200)
        .json(
          ApiResponse.success('Logo actualizado', {
            url: `/uploads/${req.file.filename}`,
          })
        );
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async getWithJobs(req, res) {
    try {
      const company = await CompanyService.getWithJobs(req.params.id);

      if (!company) {
        return res.status(404).json(ApiResponse.error('Empresa no encontrada'));
      }

      return res
        .status(200)
        .json(ApiResponse.success('Empresa con ofertas', company));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new CompanyController();
