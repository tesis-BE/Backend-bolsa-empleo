const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { PROFICIENCY_LEVELS } = require('../config/constants');

const UserSkill = sequelize.define(
  'UserSkill',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    skillName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    proficiencyLevel: {
      type: DataTypes.ENUM(
        PROFICIENCY_LEVELS.BEGINNER,
        PROFICIENCY_LEVELS.INTERMEDIATE,
        PROFICIENCY_LEVELS.ADVANCED,
        PROFICIENCY_LEVELS.EXPERT
      ),
      defaultValue: PROFICIENCY_LEVELS.INTERMEDIATE,
    },
    yearsExperience: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    tableName: 'user_skills',
    indexes: [
      {
        fields: ['userId'],
      },
    ],
  }
);

module.exports = UserSkill;
