'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BlacklistedToken extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  BlacklistedToken.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'BlacklistedToken',
    tableName: 'blacklisted_tokens',
    timestamps: true,
  });
  return BlacklistedToken;
};
