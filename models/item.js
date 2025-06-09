'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.hasMany(models.Cart, {
        foreignKey: 'item_id',
        as: 'carts',
      });
      Item.hasMany(models.TransactionDetail, {
        foreignKey: 'item_id',
        as: 'transactionDetails',
      });
    }
  }
  Item.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nama_item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    harga: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stok: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    kategori: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gambar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Item',
    tableName: 'items',
    timestamps: true,
  });
  return Item;
};
