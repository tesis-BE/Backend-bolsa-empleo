const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Interview = sequelize.define(
  'Interview',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'applications',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    proposedDates: {
      type: DataTypes.ARRAY(DataTypes.DATE),
      defaultValue: [],
    },
    selectedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'confirmed',
        'completed',
        'cancelled',
        'rescheduled'
      ),
      defaultValue: 'pending',
    },
    interviewType: {
      type: DataTypes.ENUM('presencial', 'virtual'),
      defaultValue: 'virtual',
    },
    location: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    meetingLink: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'interviews',
    timestamps: true,
  }
);

module.exports = Interview;
