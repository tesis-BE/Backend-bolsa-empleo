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
          .json(ApiResponse.error('No perteneces a ninguna empresa'));
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

      const company = await CompanyService.getByRecruiter(req.user.id);

      if (!company) {
        return res
          .status(404)
          .json(ApiResponse.error('No perteneces a ninguna empresa'));
      }

      const updatedCompany = await CompanyService.updateCompany(
        company.id,
        req.user.id,
        req.body
      );
      return res
        .status(200)
        .json(ApiResponse.success('Empresa actualizada', updatedCompany));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async addRecruiter(req, res) {
    try {
      const { userId } = req.body;
      const company = await CompanyService.getByRecruiter(req.user.id);

      if (!company) {
        return res
          .status(404)
          .json(ApiResponse.error('No perteneces a ninguna empresa'));
      }

      const recruiter = await CompanyService.addRecruiter(
        company.id,
        userId,
        req.user.id
      );
      return res
        .status(200)
        .json(ApiResponse.success('Reclutador añadido', recruiter));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async addRecruiterToCompany(req, res) {
    try {
      const { companyId } = req.params;
      const { userId } = req.body;
      const recruiter = await CompanyService.addRecruiter(
        companyId,
        userId,
        req.user.id
      );
      return res
        .status(200)
        .json(ApiResponse.success('Reclutador añadido', recruiter));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async removeRecruiter(req, res) {
    try {
      const { userId } = req.params;
      const company = await CompanyService.getByRecruiter(req.user.id);

      if (!company) {
        return res
          .status(404)
          .json(ApiResponse.error('No perteneces a ninguna empresa'));
      }

      await CompanyService.removeRecruiter(company.id, userId, req.user.id);
      return res.status(200).json(ApiResponse.success('Reclutador removido'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async removeRecruiterFromCompany(req, res) {
    try {
      const { companyId, userId } = req.params;
      await CompanyService.removeRecruiter(companyId, userId, req.user.id);
      return res.status(200).json(ApiResponse.success('Reclutador removido'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const company = await CompanyService.updateStatus(
        id,
        status,
        req.user.id
      );
      return res
        .status(200)
        .json(ApiResponse.success('Estado actualizado', company));
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

      const company = await CompanyService.getByRecruiter(req.user.id);

      if (!company) {
        return res
          .status(404)
          .json(ApiResponse.error('No perteneces a ninguna empresa'));
      }

      await FileService.updateCompanyLogo(company.id, req.user.id, req.file);
      return res.status(200).json(
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
