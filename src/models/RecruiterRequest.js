const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const REQUEST_STATUS = {
  PENDING: 'pendiente',
  APPROVED: 'aprobado',
  REJECTED: 'rechazado',
};

const RecruiterRequest = sequelize.define(
  'RecruiterRequest',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Cargo del solicitante en la empresa',
    },

    // Empresa existente
    existingCompanyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'companies', key: 'id' },
    },

    // Datos de empresa nueva
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyIndustry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companySize: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyWebsite: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    companyLogoPath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    // Estado
    status: {
      type: DataTypes.ENUM(...Object.values(REQUEST_STATUS)),
      defaultValue: REQUEST_STATUS.PENDING,
      allowNull: false,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Token de activación
    activationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tokenExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'recruiter_requests',
    timestamps: true,
  }
);

RecruiterRequest.REQUEST_STATUS = REQUEST_STATUS;

module.exports = RecruiterRequest;
