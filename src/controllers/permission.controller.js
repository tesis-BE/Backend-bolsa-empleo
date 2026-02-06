const BaseController = require('./base.controller');
const PermissionService = require('../services/permission.service');
const ApiResponse = require('../utils/response.util');

class PermissionController extends BaseController {
  constructor() {
    super(PermissionService, 'Permiso');
  }

  async getAll(req, res) {
    try {
      const permissions = await PermissionService.getAll();
      return res
        .status(200)
        .json(ApiResponse.success('Permisos obtenidos', permissions));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async getByModule(req, res) {
    try {
      const { module } = req.params;
      const permissions = await PermissionService.getByModule(module);
      return res
        .status(200)
        .json(ApiResponse.success('Permisos obtenidos', permissions));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new PermissionController();
