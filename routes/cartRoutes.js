'use strict';
const CartController = require('../controllers/CartController');
const { authenticate } = require('../middleware/auth');

const cartRoutes = [
  {
    method: 'GET',
    path: '/cart',
    handler: CartController.index,
    options: {
      description: 'Dapatkan items di cart user',
      tags: ['api', 'cart'],
      pre: [
        { method: authenticate }
      ]
    }
  },
  {
    method: 'POST',
    path: '/cart',
    handler: CartController.store,
    options: {
      description: 'Tambahkan item ke cart',
      tags: ['api', 'cart'],
      pre: [
        { method: authenticate }
      ]
    }
  },
  {
    method: 'PUT',
    path: '/cart/{id}',
    handler: CartController.update,
    options: {
      description: 'Update quantity item di cart',
      tags: ['api', 'cart'],
      pre: [
        { method: authenticate }
      ]
    }
  },
  {
    method: 'DELETE',
    path: '/cart/{id}',
    handler: CartController.destroy,
    options: {
      description: 'Hapus item dari cart',
      tags: ['api', 'cart'],
      pre: [
        { method: authenticate }
      ]
    }
  },
  {
    method: 'DELETE',
    path: '/cart',
    handler: CartController.clear,
    options: {
      description: 'Kosongkan cart',
      tags: ['api', 'cart'],
      pre: [
        { method: authenticate }
      ]
    }
  }
];

module.exports = cartRoutes;
