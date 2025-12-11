const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
      allowNull: false,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
