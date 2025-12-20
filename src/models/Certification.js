const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Certification = sequelize.define(
  'Certification',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    issuingOrganization: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    expirationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    credentialId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    credentialUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: 'certifications',
    timestamps: true,
  }
);

module.exports = Certification;
