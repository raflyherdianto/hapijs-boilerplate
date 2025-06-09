'use strict';
const TransactionDetailsController = require('../controllers/TransactionDetailsController');
const { authenticate, authorize } = require('../middleware/auth');

const transactionDetailRoutes = [
  {
    method: 'GET',
    path: '/transaction-details',
    handler: TransactionDetailsController.index,
    options: {
      description: 'Dapatkan semua detail transaksi (admin only)',
      tags: ['api', 'transaction-details'],
      pre: [
        { method: authenticate },
        { method: authorize(['admin']) }
      ]
    }
  },
  {
    method: 'GET',
    path: '/transaction-details/{id}',
    handler: TransactionDetailsController.show,
    options: {
      description: 'Dapatkan detail transaksi berdasarkan ID',
      tags: ['api', 'transaction-details'],
      pre: [
        { method: authenticate }
      ]
    }
  },
  {
    method: 'GET',
    path: '/transactions/{transactionId}/details',
    handler: TransactionDetailsController.getByTransaction,
    options: {
      description: 'Dapatkan detail transaksi berdasarkan transaction ID',
      tags: ['api', 'transaction-details'],
      pre: [
        { method: authenticate }
      ]
    }
  }
];

module.exports = transactionDetailRoutes;
