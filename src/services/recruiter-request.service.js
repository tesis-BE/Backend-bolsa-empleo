const crypto = require('crypto');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const RecruiterRequest = require('../models/RecruiterRequest');
const { User, Company, UserRole } = require('../models');
const { USER_TYPES, COMPANY_STATUS } = require('../config/constants');
const emailService = require('./email.service');

const { REQUEST_STATUS } = RecruiterRequest;

// ID del rol "Recruiter" en la tabla roles
const RECRUITER_ROLE_ID = 2;

class RecruiterRequestService {
  /**
   * Crear nueva solicitud de reclutador
   */
  async createRequest(data, logoFile) {
    const hasExistingCompany = !!data.existingCompanyId;
    const hasNewCompanyData = !!data.companyName;

    if (!hasExistingCompany && !hasNewCompanyData) {
      throw new Error('Debes seleccionar una empresa existente o registrar una empresa nueva');
    }

    if (hasExistingCompany) {
      const existingCompany = await Company.findByPk(data.existingCompanyId);
      if (!existingCompany) {
        throw new Error('La empresa seleccionada no existe');
      }
    }

    // Verificar que no exista ya una solicitud pendiente con este email
    const existing = await RecruiterRequest.findOne({
      where: {
        email: data.email,
        status: REQUEST_STATUS.PENDING,
      },
    });
    if (existing) {
      throw new Error('Ya existe una solicitud pendiente con este correo electrónico');
    }

    // Verificar que el email no esté registrado como usuario
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Este correo electrónico ya está registrado en el sistema');
    }

    const requestData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      position: data.position,
      existingCompanyId: data.existingCompanyId || null,
      companyName: data.companyName || null,
      companyIndustry: data.companyIndustry || null,
      companySize: data.companySize || null,
      companyLocation: data.companyLocation || null,
      companyWebsite: data.companyWebsite || null,
      companyDescription: data.companyDescription || null,
      companyLogoPath: logoFile ? logoFile.path : null,
    };

    const request = await RecruiterRequest.create(requestData);

    // Enviar email de confirmación
    await emailService.sendRequestConfirmation(data.email, data.firstName);

    return request;
  }

  /**
   * Obtener todas las solicitudes (admin)
   */
  async getAllRequests(filters = {}) {
    const where = {};
    if (filters.status) {
      where.status = filters.status;
    }

    const requests = await RecruiterRequest.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      include: filters.includeCompany
        ? [{ model: Company, as: 'existingCompany', required: false }]
        : [],
    });

    return {
      data: requests.rows,
      total: requests.count,
    };
  }

  /**
   * Obtener solicitud por ID
   */
  async getRequestById(id) {
    const request = await RecruiterRequest.findByPk(id, {
      include: [{ model: Company, as: 'existingCompany', required: false }],
    });
    if (!request) {
      throw new Error('Solicitud no encontrada');
    }
    return request;
  }

  /**
   * Aprobar solicitud: crea usuario + empresa (si aplica) + asigna rol
   */
  async approveRequest(requestId) {
    const request = await RecruiterRequest.findByPk(requestId);
    if (!request) {
      throw new Error('Solicitud no encontrada');
    }
    if (request.status !== REQUEST_STATUS.PENDING) {
      throw new Error('Esta solicitud ya fue procesada');
    }

    const transaction = await sequelize.transaction();

    try {
      // Generar token de activación (7 días)
      const activationToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 7);

      // Crear usuario (sin contraseña, se establece al activar)
      const tempPassword = crypto.randomBytes(16).toString('hex');
      const user = await User.create(
        {
          email: request.email,
          password: tempPassword,
          firstName: request.firstName,
          lastName: request.lastName,
          phone: request.phone,
          userType: USER_TYPES.RECRUITER,
          isActive: false, // Se activa al establecer contraseña
        },
        { transaction }
      );

      let companyId;

      if (request.existingCompanyId) {
        // Asignar a empresa existente
        companyId = request.existingCompanyId;
      } else {
        // Crear empresa nueva
        const company = await Company.create(
          {
            name: request.companyName,
            description: request.companyDescription,
            industry: request.companyIndustry,
            size: request.companySize,
            location: request.companyLocation,
            website: request.companyWebsite,
            logoUrl: request.companyLogoPath,
            recruiterId: user.id,
            status: COMPANY_STATUS.ACTIVE,
          },
          { transaction }
        );
        companyId = company.id;
      }

      // Asignar empresa al usuario
      await User.update(
        { companyId },
        { where: { id: user.id }, transaction }
      );

      // Asignar rol de reclutador
      await UserRole.findOrCreate({
        where: { userId: user.id, roleId: RECRUITER_ROLE_ID },
        transaction,
      });

      // Actualizar solicitud
      await request.update(
        {
          status: REQUEST_STATUS.APPROVED,
          activationToken,
          tokenExpiresAt,
        },
        { transaction }
      );

      await transaction.commit();

      // Enviar email de activación
      await emailService.sendActivationLink(
        request.email,
        request.firstName,
        activationToken
      );

      return { request, user };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Rechazar solicitud
   */
  async rejectRequest(requestId, rejectionReason) {
    const request = await RecruiterRequest.findByPk(requestId);
    if (!request) {
      throw new Error('Solicitud no encontrada');
    }
    if (request.status !== REQUEST_STATUS.PENDING) {
      throw new Error('Esta solicitud ya fue procesada');
    }

    await request.update({
      status: REQUEST_STATUS.REJECTED,
      rejectionReason: rejectionReason || null,
    });

    // Enviar email de rechazo
    await emailService.sendRejectionNotification(
      request.email,
      request.firstName,
      rejectionReason
    );

    return request;
  }

  /**
   * Activar cuenta del reclutador con token y nueva contraseña
   */
  async activateAccount(token, password) {
    const request = await RecruiterRequest.findOne({
      where: {
        activationToken: token,
        status: REQUEST_STATUS.APPROVED,
        tokenExpiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!request) {
      throw new Error('El enlace de activación es inválido o ha expirado');
    }

    const user = await User.findOne({ where: { email: request.email } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (user.isActive) {
      throw new Error('Esta cuenta ya fue activada');
    }

    // Establecer contraseña y activar
    user.password = password;
    user.isActive = true;
    await user.save(); // El hook beforeCreate hashea la contraseña

    // Invalidar token
    await request.update({
      activationToken: null,
      tokenExpiresAt: null,
    });

    return user;
  }
}

module.exports = new RecruiterRequestService();
