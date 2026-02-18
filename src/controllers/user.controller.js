const BaseController = require('./base.controller');
const UserService = require('../services/user.service');
const FileService = require('../services/file.service');
const ApiResponse = require('../utils/response.util');
const { validationResult } = require('express-validator');

class UserController extends BaseController {
  constructor() {
    super(UserService, 'Usuario');
  }

  async getGraduates(req, res) {
    try {
      const { page = 1, pageSize = 12, search, isAvailable, facultyId } = req.query;
      const result = await UserService.searchGraduates({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        search: search || undefined,
        availableForWork: isAvailable,
        facultyId: facultyId || undefined,
      });
      return res
        .status(200)
        .json(ApiResponse.paginated('Egresados obtenidos', result));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.params.id || req.user.id;
      const user = await UserService.getProfile(userId);

      if (!user) {
        return res.status(404).json(ApiResponse.error('Usuario no encontrado'));
      }

      return res.status(200).json(ApiResponse.success('Perfil obtenido', user));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async updateProfile(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Error de validación', errors.array()));
      }

      const user = await UserService.updateProfile(req.user.id, req.body);
      return res
        .status(200)
        .json(ApiResponse.success('Perfil actualizado', user));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async uploadPhoto(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json(ApiResponse.error('No se proporcionó ningún archivo'));
      }

      const file = await FileService.updateUserPhoto(req.user.id, req.file);
      return res.status(200).json(
        ApiResponse.success('Foto actualizada', {
          url: `/uploads/photos/${req.file.filename}`,
        })
      );
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async uploadCV(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json(ApiResponse.error('No se proporcionó ningún archivo'));
      }

      const file = await FileService.updateUserCV(req.user.id, req.file);
      return res.status(200).json(
        ApiResponse.success('CV actualizado', {
          url: `/uploads/cvs/${req.file.filename}`,
        })
      );
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async addSkill(req, res) {
    try {
      const skill = await UserService.addSkill(req.user.id, req.body);
      return res
        .status(201)
        .json(ApiResponse.created('Habilidad agregada', skill));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async removeSkill(req, res) {
    try {
      await UserService.removeSkill(req.user.id, req.params.skillId);
      return res.status(200).json(ApiResponse.success('Habilidad eliminada'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async addPortfolioLink(req, res) {
    try {
      const portfolio = await UserService.addPortfolioLink(
        req.user.id,
        req.body
      );
      return res
        .status(201)
        .json(ApiResponse.created('Enlace de portafolio agregado', portfolio));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async removePortfolioLink(req, res) {
    try {
      await UserService.removePortfolioLink(
        req.user.id,
        req.params.portfolioId
      );
      return res
        .status(200)
        .json(ApiResponse.success('Enlace de portafolio eliminado'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async toggleAvailability(req, res) {
    try {
      const { available } = req.body;
      const user = await UserService.toggleAvailability(req.user.id, available);
      return res
        .status(200)
        .json(ApiResponse.success('Disponibilidad actualizada', user));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async getAllUsers(req, res) {
    try {
      const { page = 1, pageSize = 10, search, userType, isActive } = req.query;
      const result = await UserService.getAllUsers({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        search,
        userType,
        isActive: isActive ? isActive === 'true' : undefined,
      });
      return res
        .status(200)
        .json(ApiResponse.paginated('Usuarios obtenidos', result));
    } catch (error) {
      return res.status(500).json(ApiResponse.error(error.message));
    }
  }

  async createUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Error de validación', errors.array()));
      }

      const { firstName, lastName, email, password, userType, phone, institutionalEmail, cedula, facultyId } = req.body;

      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json(ApiResponse.error('El email ya está registrado'));
      }

      const user = await UserService.create({
        firstName,
        lastName,
        email,
        password,
        userType,
        phone,
        institutionalEmail,
        cedula,
        facultyId,
        isActive: true,
      });

      const { password: _, ...userWithoutPassword } = user.toJSON();
      return res
        .status(201)
        .json(
          ApiResponse.success(
            'Usuario creado exitosamente',
            userWithoutPassword
          )
        );
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async updateUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Error de validación', errors.array()));
      }

      const { id } = req.params;
      const { firstName, lastName, userType, phone, institutionalEmail, cedula, facultyId } = req.body;

      const user = await UserService.findById(id);
      if (!user) {
        return res.status(404).json(ApiResponse.error('Usuario no encontrado'));
      }

      const updateData = { firstName, lastName, userType };
      if (phone !== undefined) updateData.phone = phone;
      if (institutionalEmail !== undefined) updateData.institutionalEmail = institutionalEmail || null;
      if (cedula !== undefined) updateData.cedula = cedula;
      if (facultyId !== undefined) updateData.facultyId = facultyId;

      const updated = await UserService.update(id, updateData);

      const { password: _, ...userWithoutPassword } = updated.toJSON();
      return res
        .status(200)
        .json(ApiResponse.success('Usuario actualizado', userWithoutPassword));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async toggleUserStatus(req, res) {
    try {
      const { id } = req.params;

      const user = await UserService.findById(id);
      if (!user) {
        return res.status(404).json(ApiResponse.error('Usuario no encontrado'));
      }

      const updated = await UserService.toggleStatus(id, !user.isActive);

      const { password: _, ...userWithoutPassword } = updated.toJSON();
      return res
        .status(200)
        .json(
          ApiResponse.success(
            'Estado del usuario actualizado',
            userWithoutPassword
          )
        );
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async changeUserType(req, res) {
    try {
      const { id } = req.params;
      const { userType } = req.body;

      if (!userType || !['graduate', 'recruiter', 'admin'].includes(userType)) {
        return res
          .status(400)
          .json(ApiResponse.error('Tipo de usuario inválido'));
      }

      const user = await UserService.findById(id);
      if (!user) {
        return res.status(404).json(ApiResponse.error('Usuario no encontrado'));
      }

      const updated = await UserService.changeUserType(id, userType);
      const { password: _, ...userWithoutPassword } = updated.toJSON();
      return res
        .status(200)
        .json(
          ApiResponse.success(
            'Tipo de usuario actualizado',
            userWithoutPassword
          )
        );
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await UserService.findById(id);
      if (!user) {
        return res.status(404).json(ApiResponse.error('Usuario no encontrado'));
      }

      await UserService.delete(id);
      return res
        .status(200)
        .json(ApiResponse.success('Usuario eliminado exitosamente'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async assignRole(req, res) {
    try {
      const { id } = req.params;
      const { roleId } = req.body;

      if (!roleId) {
        return res.status(400).json(ApiResponse.error('roleId es requerido'));
      }

      const result = await UserService.assignRole(parseInt(id), parseInt(roleId));
      return res.status(200).json(ApiResponse.success('Rol asignado al usuario', result));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async removeRole(req, res) {
    try {
      const { id, roleId } = req.params;

      await UserService.removeRole(parseInt(id), parseInt(roleId));
      return res.status(200).json(ApiResponse.success('Rol removido del usuario'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async getUserRoles(req, res) {
    try {
      const { id } = req.params;
      const roles = await UserService.getUserRoles(parseInt(id));
      return res.status(200).json(ApiResponse.success('Roles del usuario', roles));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async getUserPermissions(req, res) {
    try {
      const { id } = req.params;
      const permissions = await UserService.getUserPermissions(parseInt(id));
      return res.status(200).json(ApiResponse.success('Permisos del usuario', permissions));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new UserController();
