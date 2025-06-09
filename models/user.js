'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Only create associations if the models exist
      if (models.UserRecommendation) {
        User.hasMany(models.UserRecommendation, {
          foreignKey: 'id_user',
          as: 'recommendations',
        });
      }
      if (models.UserRole) {
        User.belongsTo(models.UserRole, {
          foreignKey: 'role_id',
          as: 'role',
        });
      }
      if (models.Cart) {
        User.hasMany(models.Cart, {
          foreignKey: 'user_id',
          as: 'carts',
        });
      }
      if (models.Transaction) {
        User.hasMany(models.Transaction, {
          foreignKey: 'user_id',
          as: 'transactions',
        });
      }
    }
  }
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nama_lengkap: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2, // Default to customer
      references: {
        model: 'user_roles',
        key: 'id',
      },
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  });
  return User;
};