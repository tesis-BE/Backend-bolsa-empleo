const ApiResponse = require('../utils/response.util');

/**
 * BaseController - Clase base para todos los controladores con operaciones CRUD
 */
class BaseController {
  constructor(service, entityName = 'Registro') {
    this.service = service;
    this.entityName = entityName;

    // Bind methods to maintain 'this' context
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async findAll(req, res) {
    try {
      const { page = 1, pageSize = 20 } = req.query;
      const result = await this.service.paginate({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
      });
      return res
        .status(200)
        .json(ApiResponse.paginated(`${this.entityName}s obtenidos`, result));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params;
      const data = await this.service.findById(id);

      if (!data) {
        return res
          .status(404)
          .json(ApiResponse.error(`${this.entityName} no encontrado`));
      }

      return res
        .status(200)
        .json(ApiResponse.success(`${this.entityName} obtenido`, data));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async create(req, res) {
    try {
      const data = await this.service.create(req.body);
      return res
        .status(201)
        .json(ApiResponse.created(`${this.entityName} creado`, data));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await this.service.update(id, req.body);
      return res
        .status(200)
        .json(ApiResponse.success(`${this.entityName} actualizado`, data));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return res
        .status(200)
        .json(ApiResponse.success(`${this.entityName} eliminado`));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = BaseController;
