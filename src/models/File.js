const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { FILE_TYPES } = require('../config/constants');

const File = sequelize.define(
  'File',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(
        FILE_TYPES.CV,
        FILE_TYPES.PHOTO,
        FILE_TYPES.LOGO,
        FILE_TYPES.ATTACHMENT
      ),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    tableName: 'files',
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['type'],
      },
    ],
  }
);

module.exports = File;
