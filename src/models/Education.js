const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Education = sequelize.define(
  'Education',
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
    institution: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    degree: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fieldOfStudy: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    graduationYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gpa: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    honors: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isCurrent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    facultyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    careerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    degreeType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: 'educations',
    timestamps: true,
  }
);

module.exports = Education;
