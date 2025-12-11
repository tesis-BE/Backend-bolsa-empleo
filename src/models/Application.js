const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { APPLICATION_STATUS } = require('../config/constants');

const Application = sequelize.define(
  'Application',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        APPLICATION_STATUS.PENDING,
        APPLICATION_STATUS.REVIEWED,
        APPLICATION_STATUS.INTERVIEWED,
        APPLICATION_STATUS.ACCEPTED,
        APPLICATION_STATUS.REJECTED
      ),
      defaultValue: APPLICATION_STATUS.PENDING,
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    appliedAt: {
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
    tableName: 'applications',
    indexes: [
      {
        unique: true,
        fields: ['jobId', 'userId'],
      },
    ],
  }
);

module.exports = Application;
