const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { COMPANY_STATUS } = require('../config/constants');

const Company = sequelize.define(
  'Company',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recruiterId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        COMPANY_STATUS.PENDING,
        COMPANY_STATUS.ACTIVE,
        COMPANY_STATUS.INACTIVE,
        COMPANY_STATUS.REJECTED
      ),
      defaultValue: COMPANY_STATUS.ACTIVE,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    tableName: 'companies',
  }
);

module.exports = Company;
