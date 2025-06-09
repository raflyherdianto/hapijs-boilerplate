'use strict';
const TransactionController = require('../controllers/TransactionController');
const { authenticate, authorize } = require('../middleware/auth');

const transactionRoutes = [
  {
    method: 'GET',
    path: '/transactions',
    handler: TransactionController.index,
    options: {
      description: 'Dapatkan semua transaksi',
      tags: ['api', 'transactions'],
      pre: [
        { method: authenticate }
      ]
    }
  },
  {
    method: 'POST',
    path: '/transactions',
    handler: TransactionController.store,
    options: {
      description: 'Buat transaksi baru (checkout)',
      tags: ['api', 'transactions'],
      pre: [
        { method: authenticate }
      ]
    }
  },
  {
    method: 'GET',
    path: '/transactions/{id}',
    handler: TransactionController.show,
    options: {
      description: 'Dapatkan transaksi berdasarkan ID',
      tags: ['api', 'transactions'],
      pre: [
        { method: authenticate }
      ]
    }
  },
  {
    method: 'PUT',
    path: '/transactions/{id}/status',
    handler: TransactionController.updateStatus,
    options: {
      description: 'Update status transaksi (admin only)',
      tags: ['api', 'transactions'],
      pre: [
        { method: authenticate },
        { method: authorize(['admin']) }
      ]
    }
  }
];

module.exports = transactionRoutes;
