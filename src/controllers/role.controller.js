const BaseController = require('./base.controller');
const RoleService = require('../services/role.service');
const ApiResponse = require('../utils/response.util');
const { validationResult } = require('express-validator');

class RoleController extends BaseController {
  constructor() {
    super(RoleService, 'Rol');
  }

  async getAll(req, res) {
    try {
      const roles = await RoleService.getAllWithPermissions();
      return res
        .status(200)
        .json(ApiResponse.success('Roles obtenidos', roles));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async getById(req, res) {
    try {
      const role = await RoleService.findWithPermissions(req.params.id);
      if (!role) {
        return res.status(404).json(ApiResponse.error('Rol no encontrado'));
      }
      return res.status(200).json(ApiResponse.success('Rol obtenido', role));
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

      const { permissionIds, ...roleData } = req.body;
      const role = await RoleService.create(roleData);

      if (permissionIds && Array.isArray(permissionIds) && permissionIds.length > 0) {
        await RoleService.updatePermissions(role.id, permissionIds);
      }

      const roleWithPermissions = await RoleService.findWithPermissions(role.id);
      return res.status(201).json(ApiResponse.created('Rol creado', roleWithPermissions));
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

      const { permissionIds, ...roleData } = req.body;
      await RoleService.update(req.params.id, roleData);

      if (permissionIds && Array.isArray(permissionIds)) {
        await RoleService.updatePermissions(req.params.id, permissionIds);
      }

      const updatedRole = await RoleService.findWithPermissions(req.params.id);
      return res.status(200).json(ApiResponse.success('Rol actualizado', updatedRole));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async delete(req, res) {
    try {
      const deleted = await RoleService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json(ApiResponse.error('Rol no encontrado'));
      }
      return res.status(200).json(ApiResponse.success('Rol eliminado'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async assignPermission(req, res) {
    try {
      const { permissionId } = req.body;
      const rolePermission = await RoleService.assignPermission(
        req.params.id,
        permissionId
      );
      return res
        .status(200)
        .json(ApiResponse.success('Permiso asignado', rolePermission));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async removePermission(req, res) {
    try {
      await RoleService.removePermission(
        req.params.id,
        req.params.permissionId
      );
      return res.status(200).json(ApiResponse.success('Permiso eliminado'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new RoleController();
