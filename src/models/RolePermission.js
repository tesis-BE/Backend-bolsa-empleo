const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RolePermission = sequelize.define(
  'RolePermission',
  {
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    permissionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    tableName: 'role_permissions',
  }
);

module.exports = RolePermission;
