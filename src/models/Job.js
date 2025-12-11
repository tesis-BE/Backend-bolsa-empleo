const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { JOB_STATUS, JOB_TYPES, WORK_MODES } = require('../config/constants');

const Job = sequelize.define(
  'Job',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    jobType: {
      type: DataTypes.ENUM(
        JOB_TYPES.FULL_TIME,
        JOB_TYPES.PART_TIME,
        JOB_TYPES.CONTRACT,
        JOB_TYPES.INTERNSHIP,
        JOB_TYPES.TEMPORARY
      ),
      allowNull: false,
    },
    workMode: {
      type: DataTypes.ENUM(
        WORK_MODES.REMOTE,
        WORK_MODES.ON_SITE,
        WORK_MODES.HYBRID
      ),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salaryMin: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    salaryMax: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    skills: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        JOB_STATUS.DRAFT,
        JOB_STATUS.PUBLISHED,
        JOB_STATUS.CLOSED,
        JOB_STATUS.PAUSED,
        JOB_STATUS.EXPIRED
      ),
      defaultValue: JOB_STATUS.DRAFT,
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
    tableName: 'jobs',
  }
);

module.exports = Job;
