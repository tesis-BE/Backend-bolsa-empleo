const { User } = require('../models');
const { Op } = require('sequelize');
const {
  generateToken,
  generateRefreshToken,
  verifyToken,
} = require('../utils/jwt.util');
const { USER_TYPES } = require('../config/constants');

class AuthService {
  async register(data) {
    const {
      email,
      password,
      firstName,
      lastName,
      institutionalEmail,
      phone,
      userType = USER_TYPES.GRADUATE,
      facultyId,
      cedula,
    } = data;

    const uniqueChecks = [{ email }];
    if (institutionalEmail) {
      uniqueChecks.push({ institutionalEmail });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: uniqueChecks,
      },
    });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      institutionalEmail,
      phone,
      userType,
      facultyId,
      cedula,
    });

    // Generar tokens
    const token = generateToken(user.id, user.userType);
    const refreshToken = generateRefreshToken(user.id);

    return {
      token,
      refreshToken,
      user: this.formatUserResponse(user),
    };
  }

  async login(email, password) {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { institutionalEmail: email }],
      },
    });
    if (!user) {
      throw new Error('Email o contraseña incorrectos');
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Email o contraseña incorrectos');
    }

    // Verificar si está activo
    if (!user.isActive) {
      throw new Error('Cuenta desactivada');
    }

    // Generar tokens
    const token = generateToken(user.id, user.userType);
    const refreshToken = generateRefreshToken(user.id);

    return {
      token,
      refreshToken,
      user: this.formatUserResponse(user),
    };
  }

  async getMe(userId) {
    const user = await User.findByPk(userId, {
      attributes: {
        exclude: ['password'],
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return this.formatUserResponse(user);
  }

  async refreshToken(refreshTokenString) {
    try {
      const decoded = verifyToken(refreshTokenString);

      // Buscar usuario
      const user = await User.findByPk(decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('Token inválido');
      }

      // Generar nuevos tokens
      const token = generateToken(user.id, user.userType);
      const newRefreshToken = generateRefreshToken(user.id);

      return {
        token,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error('La contraseña actual es incorrecta');
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    return true;
  }

  formatUserResponse(user) {
    return {
      id: user.id,
      email: user.email,
      institutionalEmail: user.institutionalEmail,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      phone: user.phone,
      facultyId: user.facultyId,
      cedula: user.cedula,
      bio: user.bio,
      photoUrl: user.photoUrl,
      cvUrl: user.cvUrl,
      linkedinUrl: user.linkedinUrl,
      availableForWork: user.availableForWork,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}

module.exports = new AuthService();
