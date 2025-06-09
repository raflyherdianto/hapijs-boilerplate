'use strict';
const ItemController = require('../controllers/ItemController');
const { authenticate, authorize } = require('../middleware/auth');

const itemRoutes = [
  {
    method: 'GET',
    path: '/items',
    handler: ItemController.index,
    options: {
      description: 'Dapatkan semua items',
      tags: ['api', 'items']
    }
  },
  {
    method: 'POST',
    path: '/items',
    handler: ItemController.store,
    options: {
      description: 'Buat item baru (admin only)',
      tags: ['api', 'items'],
      pre: [
        { method: authenticate },
        { method: authorize(['admin']) }
      ]
    }
  },
  {
    method: 'GET',
    path: '/items/{id}',
    handler: ItemController.show,
    options: {
      description: 'Dapatkan item berdasarkan ID',
      tags: ['api', 'items']
    }
  },
  {
    method: 'PUT',
    path: '/items/{id}',
    handler: ItemController.update,
    options: {
      description: 'Perbarui item berdasarkan ID (admin only)',
      tags: ['api', 'items'],
      pre: [
        { method: authenticate },
        { method: authorize(['admin']) }
      ]
    }
  },
  {
    method: 'DELETE',
    path: '/items/{id}',
    handler: ItemController.destroy,
    options: {
      description: 'Hapus item berdasarkan ID (admin only)',
      tags: ['api', 'items'],
      pre: [
        { method: authenticate },
        { method: authorize(['admin']) }
      ]
    }
  }
];

module.exports = itemRoutes;
