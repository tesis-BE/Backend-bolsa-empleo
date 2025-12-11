const BaseController = require('./base.controller');
const JobService = require('../services/job.service');
const ApiResponse = require('../utils/response.util');
const { validationResult } = require('express-validator');

class JobController extends BaseController {
  constructor() {
    super(JobService, 'Oferta de trabajo');
  }

  async search(req, res) {
    try {
      const {
        page = 1,
        pageSize = 20,
        title,
        type,
        mode,
        minSalary,
        maxSalary,
        skills,
        location,
        companyId,
      } = req.query;

      const result = await JobService.search({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        title,
        type,
        mode,
        minSalary: minSalary ? parseFloat(minSalary) : null,
        maxSalary: maxSalary ? parseFloat(maxSalary) : null,
        skills: skills ? skills.split(',') : null,
        location,
        companyId,
      });

      return res
        .status(200)
        .json(ApiResponse.paginated('Ofertas encontradas', result));
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

      const job = await JobService.createForRecruiter(req.user.id, req.body);
      return res
        .status(201)
        .json(ApiResponse.created('Oferta creada exitosamente', job));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async getMyJobs(req, res) {
    try {
      const { page = 1, pageSize = 20, status } = req.query;
      const result = await JobService.getByRecruiter(
        req.user.id,
        status,
        parseInt(page),
        parseInt(pageSize)
      );
      return res
        .status(200)
        .json(ApiResponse.paginated('Ofertas obtenidas', result));
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

      const job = await JobService.updateByRecruiter(
        req.params.id,
        req.user.id,
        req.body
      );
      return res
        .status(200)
        .json(ApiResponse.success('Oferta actualizada', job));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async publish(req, res) {
    try {
      const job = await JobService.publish(req.params.id, req.user.id);
      return res.status(200).json(ApiResponse.success('Oferta publicada', job));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async close(req, res) {
    try {
      const job = await JobService.close(req.params.id, req.user.id);
      return res.status(200).json(ApiResponse.success('Oferta cerrada', job));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async delete(req, res) {
    try {
      await JobService.deleteByRecruiter(req.params.id, req.user.id);
      return res.status(200).json(ApiResponse.success('Oferta eliminada'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new JobController();
