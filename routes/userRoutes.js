'use strict';
const UserController = require('../controllers/UserController');
const { authenticate, authorize } = require('../middleware/auth');

const userRoutes = [
  {
    method: 'GET',
    path: '/users',
    handler: UserController.index,
    options: {
      description: 'Dapatkan semua users (admin only)',
      tags: ['api', 'users'],
      pre: [
        { method: authenticate },
        { method: authorize(['admin']) }
      ]
    }
  },
  {
    method: 'POST',
    path: '/users',
    handler: UserController.store,
    options: {
      description: 'Buat User baru (admin only)',
      tags: ['api', 'users'],
      pre: [
        { method: authenticate },
        { method: authorize(['admin']) }
      ]
    }
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: UserController.show,
    options: {
      description: 'Dapatkan User berdasarkan ID',
      tags: ['api', 'users'],
      pre: [
        { method: authenticate }
      ]
    }
  },
  {
    method: 'PUT',
    path: '/users/{id}',
    handler: UserController.update,
    options: {
      description: 'Perbarui User berdasarkan ID',
      tags: ['api', 'users'],
      pre: [
        { method: authenticate }
      ]
    }
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: UserController.destroy,
    options: {
      description: 'Hapus User berdasarkan ID (admin only)',
      tags: ['api', 'users'],
      pre: [
        { method: authenticate },
        { method: authorize(['admin']) }
      ]
    }
  }
];

module.exports = userRoutes;
