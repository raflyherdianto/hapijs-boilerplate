'use strict';

const { Transaction, TransactionDetail, Cart, Item, User } = require('../models');
const { Op } = require('sequelize');

const index = async (request, h) => {
  try {
    const userId = request.auth.credentials.userId;
    const userRole = request.auth.credentials.roleName;

    let whereClause = {};
    if (userRole !== 'admin') {
      whereClause.user_id = userId;
    }

    const transactions = await Transaction.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'nama_lengkap', 'email']
      }, {
        model: TransactionDetail,
        as: 'details',
        include: [{
          model: Item,
          as: 'item'
        }]
      }],
      order: [['created_at', 'DESC']]
    });

    return h.response({
      status: 'success',
      message: 'Data transaksi berhasil diambil',
      data: { transactions }
    }).code(200);
  } catch (error) {
    console.error('Error di TransactionController.index:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const store = async (request, h) => {
  try {
    const userId = request.auth.credentials.userId;

    // Get cart items
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [{
        model: Item,
        as: 'item'
      }]
    });

    if (cartItems.length === 0) {
      return h.response({
        status: 'fail',
        message: 'Cart kosong'
      }).code(400);
    }

    // Check stock availability
    for (const cartItem of cartItems) {
      if (cartItem.item.stok < cartItem.quantity) {
        return h.response({
          status: 'fail',
          message: `Stok ${cartItem.item.nama_item} tidak mencukupi`
        }).code(400);
      }
    }

    // Calculate total
    const total = cartItems.reduce((sum, cartItem) => {
      return sum + (cartItem.quantity * cartItem.item.harga);
    }, 0);

    // Create transaction
    const transaction = await Transaction.create({
      user_id: userId,
      total_harga: total,
      status: 'pending'
    });

    // Create transaction details and update stock
    for (const cartItem of cartItems) {
      await TransactionDetail.create({
        transaction_id: transaction.id,
        item_id: cartItem.item_id,
        quantity: cartItem.quantity,
        harga_satuan: cartItem.item.harga
      });

      // Update item stock
      await cartItem.item.update({
        stok: cartItem.item.stok - cartItem.quantity
      });
    }

    // Clear cart
    await Cart.destroy({
      where: { user_id: userId }
    });

    // Get complete transaction data
    const completeTransaction = await Transaction.findByPk(transaction.id, {
      include: [{
        model: TransactionDetail,
        as: 'details',
        include: [{
          model: Item,
          as: 'item'
        }]
      }]
    });

    return h.response({
      status: 'success',
      message: 'Transaksi berhasil dibuat',
      data: { transaction: completeTransaction }
    }).code(201);
  } catch (error) {
    console.error('Error di TransactionController.store:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const show = async (request, h) => {
  try {
    const { id } = request.params;
    const userId = request.auth.credentials.userId;
    const userRole = request.auth.credentials.roleName;

    let whereClause = { id };
    if (userRole !== 'admin') {
      whereClause.user_id = userId;
    }

    const transaction = await Transaction.findOne({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'nama_lengkap', 'email']
      }, {
        model: TransactionDetail,
        as: 'details',
        include: [{
          model: Item,
          as: 'item'
        }]
      }]
    });

    if (!transaction) {
      return h.response({
        status: 'fail',
        message: 'Transaksi tidak ditemukan'
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Data transaksi berhasil diambil',
      data: { transaction }
    }).code(200);
  } catch (error) {
    console.error('Error di TransactionController.show:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const updateStatus = async (request, h) => {
  try {
    const { id } = request.params;
    const { status } = request.payload;

    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return h.response({
        status: 'fail',
        message: 'Transaksi tidak ditemukan'
      }).code(404);
    }

    await transaction.update({ status });

    return h.response({
      status: 'success',
      message: 'Status transaksi berhasil diperbarui',
      data: { transaction }
    }).code(200);
  } catch (error) {
    console.error('Error di TransactionController.updateStatus:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

module.exports = {
  index,
  store,
  show,
  updateStatus
};
