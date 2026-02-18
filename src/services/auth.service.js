const { User, Role, Permission, UserRole } = require('../models');
const { Op } = require('sequelize');
const {
  generateToken,
  generateRefreshToken,
  verifyToken,
} = require('../utils/jwt.util');
const { USER_TYPES } = require('../config/constants');

const USER_ROLES_INCLUDE = [
  {
    model: Role,
    as: 'roles',
    through: { attributes: [] },
    include: [
      {
        model: Permission,
        as: 'permissions',
        through: { attributes: [] },
      },
    ],
  },
];

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

    const GRADUATE_ROLE_ID = 3;
    if (userType === USER_TYPES.GRADUATE) {
      await UserRole.findOrCreate({
        where: { userId: user.id, roleId: GRADUATE_ROLE_ID },
      });
    }

    const userWithRoles = await User.findByPk(user.id, {
      include: USER_ROLES_INCLUDE,
    });

    const token = generateToken(user.id, user.userType);
    const refreshToken = generateRefreshToken(user.id);

    return {
      token,
      refreshToken,
      user: this.formatUserResponse(userWithRoles),
    };
  }

  async login(email, password) {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { institutionalEmail: email }],
      },
      include: USER_ROLES_INCLUDE,
    });
    if (!user) {
      throw new Error('Email o contraseña incorrectos');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Email o contraseña incorrectos');
    }

    if (!user.isActive) {
      throw new Error('Cuenta desactivada');
    }

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
      include: USER_ROLES_INCLUDE,
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return this.formatUserResponse(user);
  }

  async refreshToken(refreshTokenString) {
    try {
      const decoded = verifyToken(refreshTokenString);

      const user = await User.findByPk(decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('Token inválido');
      }

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

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error('La contraseña actual es incorrecta');
    }

    user.password = newPassword;
    await user.save();

    return true;
  }

  formatUserResponse(user) {
    const permissionNames = new Set();
    const roles = [];

    if (user.roles) {
      for (const role of user.roles) {
        roles.push({
          id: role.id,
          name: role.name,
          description: role.description,
        });
        if (role.permissions) {
          for (const perm of role.permissions) {
            permissionNames.add(perm.name);
          }
        }
      }
    }

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
      roles,
      permissions: Array.from(permissionNames),
    };
  }
}

module.exports = new AuthService();
