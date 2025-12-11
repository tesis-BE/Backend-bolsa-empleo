const { User } = require('../models');
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
      userType = USER_TYPES.GRADUATE,
    } = data;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Crear nuevo usuario
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      userType,
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
    // Buscar usuario
    const user = await User.findOne({ where: { email } });
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
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
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
