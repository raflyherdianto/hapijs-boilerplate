'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TransactionDetail extends Model {
    static associate(models) {
      TransactionDetail.belongsTo(models.Transaction, {
        foreignKey: 'transaction_id',
        as: 'transaction',
      });
      TransactionDetail.belongsTo(models.Item, {
        foreignKey: 'item_id',
        as: 'item',
      });
    }
  }
  TransactionDetail.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'transactions',
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
    },
    harga_satuan: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'TransactionDetail',
    tableName: 'transaction_details',
    timestamps: true,
  });
  return TransactionDetail;
};
