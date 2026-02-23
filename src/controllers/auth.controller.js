const AuthService = require('../services/auth.service');
const recruiterRequestService = require('../services/recruiter-request.service');
const ApiResponse = require('../utils/response.util');
const { validationResult } = require('express-validator');

class AuthController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Error de validación', errors.array()));
      }

      const result = await AuthService.register(req.body);
      return res
        .status(201)
        .json(ApiResponse.created('Usuario registrado exitosamente', result));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Error de validación', errors.array()));
      }

      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      return res.status(200).json(ApiResponse.success('Login exitoso', result));
    } catch (error) {
      return res.status(401).json(ApiResponse.error(error.message));
    }
  }

  async getMe(req, res) {
    try {
      const user = await AuthService.getMe(req.user.id);
      return res
        .status(200)
        .json(ApiResponse.success('Usuario obtenido', user));
    } catch (error) {
      return res.status(404).json(ApiResponse.error(error.message));
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res
          .status(400)
          .json(ApiResponse.error('Refresh token es requerido'));
      }

      const result = await AuthService.refreshToken(refreshToken);
      return res
        .status(200)
        .json(ApiResponse.success('Token refrescado', result));
    } catch (error) {
      return res.status(401).json(ApiResponse.error(error.message));
    }
  }

  async changePassword(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Error de validación', errors.array()));
      }

      const { currentPassword, newPassword } = req.body;
      await AuthService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      return res
        .status(200)
        .json(ApiResponse.success('Contraseña cambiada exitosamente'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }

  async activate(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiResponse.error('Error de validación', errors.array()));
      }

      const { token, password } = req.body;
      await recruiterRequestService.activateAccount(token, password);

      return res
        .status(200)
        .json(ApiResponse.success('Cuenta activada exitosamente. Ya puedes iniciar sesión.'));
    } catch (error) {
      return res.status(400).json(ApiResponse.error(error.message));
    }
  }
}

module.exports = new AuthController();
