const BaseController = require('./base.controller');
const universityService = require('../services/university.service');

class UniversityController extends BaseController {
  constructor() {
    super(universityService, 'Universidad');
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        isActive: req.query.isActive,
        code: req.query.code,
      };

      const universities = await this.service.findAll(filters);
      return this.sendSuccess(res, universities, 'Universidades obtenidas');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const university = await this.service.findById(id);

      if (!university) {
        return this.sendError(res, 'Universidad no encontrada', 404);
      }

      return this.sendSuccess(res, university, 'Universidad obtenida');
    } catch (error) {
      next(error);
    }
  }

  async getByCode(req, res, next) {
    try {
      const { code } = req.params;
      const university = await this.service.findByCode(code);

      if (!university) {
        return this.sendError(res, 'Universidad no encontrada', 404);
      }

      return this.sendSuccess(res, university, 'Universidad obtenida');
    } catch (error) {
      next(error);
    }
  }

  sendSuccess(res, data, message = 'Operación exitosa') {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  sendError(res, message, statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}

module.exports = new UniversityController();
