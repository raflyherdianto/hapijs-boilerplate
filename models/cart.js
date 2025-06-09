'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
      Cart.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item',
      });
    }
  }
  Cart.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'id',
      },
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    }
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    timestamps: true,
  });
  return Cart;
};
