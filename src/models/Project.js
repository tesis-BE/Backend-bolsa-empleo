const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define(
  'Project',
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
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    technologies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    projectUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    liveUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    thumbnailUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'projects',
    timestamps: true,
  }
);

module.exports = Project;
