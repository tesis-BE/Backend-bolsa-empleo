const BaseController = require('./base.controller');
const FacultyService = require('../services/faculty.service');

class FacultyController extends BaseController {
  constructor() {
    super(new FacultyService(), 'Facultad');
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        isActive: req.query.isActive,
        universityId: req.query.universityId,
      };

      const faculties = await this.service.findAll(filters);
      return this.sendSuccess(res, faculties, 'Facultades obtenidas');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const faculty = await this.service.findById(id);

      if (!faculty) {
        return this.sendError(res, 'Facultad no encontrada', 404);
      }

      return this.sendSuccess(res, faculty, 'Facultad obtenida');
    } catch (error) {
      next(error);
    }
  }

  async getByUniversity(req, res, next) {
    try {
      const { universityId } = req.params;
      const faculties = await this.service.findByUniversity(universityId);
      return this.sendSuccess(res, faculties, 'Facultades obtenidas');
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

module.exports = new FacultyController();
