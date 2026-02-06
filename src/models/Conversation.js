const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define(
  'Conversation',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    graduateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recruiterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastMessageAt: {
      type: DataTypes.DATE,
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
    tableName: 'conversations',
    indexes: [
      {
        fields: ['applicationId'],
      },
      {
        fields: ['graduateId'],
      },
      {
        fields: ['recruiterId'],
      },
      {
        fields: ['lastMessageAt'],
      },
    ],
  }
);

module.exports = Conversation;
