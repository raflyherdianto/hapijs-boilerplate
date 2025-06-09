'use strict';

const { TransactionDetail, Transaction, Item, User } = require('../models');

const index = async (request, h) => {
  try {
    const userRole = request.auth.credentials.roleName;

    if (userRole !== 'admin') {
      return h.response({
        status: 'fail',
        message: 'Akses ditolak'
      }).code(403);
    }

    const transactionDetails = await TransactionDetail.findAll({
      include: [{
        model: Transaction,
        as: 'transaction',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'nama_lengkap', 'email']
        }]
      }, {
        model: Item,
        as: 'item'
      }],
      order: [['created_at', 'DESC']]
    });

    return h.response({
      status: 'success',
      message: 'Data detail transaksi berhasil diambil',
      data: { transactionDetails }
    }).code(200);
  } catch (error) {
    console.error('Error di TransactionDetailsController.index:', error);
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

    const transactionDetail = await TransactionDetail.findByPk(id, {
      include: [{
        model: Transaction,
        as: 'transaction',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'nama_lengkap', 'email']
        }]
      }, {
        model: Item,
        as: 'item'
      }]
    });

    if (!transactionDetail) {
      return h.response({
        status: 'fail',
        message: 'Detail transaksi tidak ditemukan'
      }).code(404);
    }

    // Check if user owns the transaction or is admin
    if (userRole !== 'admin' && transactionDetail.transaction.user_id !== userId) {
      return h.response({
        status: 'fail',
        message: 'Anda tidak memiliki izin untuk mengakses detail transaksi ini'
      }).code(403);
    }

    return h.response({
      status: 'success',
      message: 'Data detail transaksi berhasil diambil',
      data: { transactionDetail }
    }).code(200);
  } catch (error) {
    console.error('Error di TransactionDetailsController.show:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const getByTransaction = async (request, h) => {
  try {
    const { transactionId } = request.params;
    const userId = request.auth.credentials.userId;
    const userRole = request.auth.credentials.roleName;

    // Check if transaction exists and user has access
    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction) {
      return h.response({
        status: 'fail',
        message: 'Transaksi tidak ditemukan'
      }).code(404);
    }

    if (userRole !== 'admin' && transaction.user_id !== userId) {
      return h.response({
        status: 'fail',
        message: 'Anda tidak memiliki izin untuk mengakses detail transaksi ini'
      }).code(403);
    }

    const transactionDetails = await TransactionDetail.findAll({
      where: { transaction_id: transactionId },
      include: [{
        model: Item,
        as: 'item'
      }]
    });

    return h.response({
      status: 'success',
      message: 'Data detail transaksi berhasil diambil',
      data: { transactionDetails }
    }).code(200);
  } catch (error) {
    console.error('Error di TransactionDetailsController.getByTransaction:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

module.exports = {
  index,
  show,
  getByTransaction
};
