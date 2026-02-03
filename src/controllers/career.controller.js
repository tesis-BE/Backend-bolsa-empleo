const BaseController = require('./base.controller');
const careerService = require('../services/career.service');

class CareerController extends BaseController {
  constructor() {
    super(careerService, 'Carrera');
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        isActive: req.query.isActive,
        facultyId: req.query.facultyId,
      };

      const careers = await this.service.findAll(filters);
      return this.sendSuccess(res, careers, 'Carreras obtenidas');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const career = await this.service.findById(id);

      if (!career) {
        return this.sendError(res, 'Carrera no encontrada', 404);
      }

      return this.sendSuccess(res, career, 'Carrera obtenida');
    } catch (error) {
      next(error);
    }
  }

  async getByFaculty(req, res, next) {
    try {
      const { facultyId } = req.params;
      const careers = await this.service.findByFaculty(facultyId);
      return this.sendSuccess(res, careers, 'Carreras obtenidas');
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

module.exports = new CareerController();
