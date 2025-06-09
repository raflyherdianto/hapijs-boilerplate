'use strict';

const { Cart, Item } = require('../models');

const index = async (request, h) => {
  try {
    const userId = request.auth.credentials.userId;

    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [{
        model: Item,
        as: 'item'
      }],
      order: [['created_at', 'DESC']]
    });

    const total = cartItems.reduce((sum, cartItem) => {
      return sum + (cartItem.quantity * cartItem.item.harga);
    }, 0);

    return h.response({
      status: 'success',
      message: 'Data cart berhasil diambil',
      data: { 
        cartItems,
        total
      }
    }).code(200);
  } catch (error) {
    console.error('Error di CartController.index:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const store = async (request, h) => {
  try {
    const { item_id, quantity } = request.payload;
    const userId = request.auth.credentials.userId;

    // Check if item exists
    const item = await Item.findByPk(item_id);
    if (!item) {
      return h.response({
        status: 'fail',
        message: 'Item tidak ditemukan'
      }).code(404);
    }

    // Check if item has enough stock
    if (item.stok < quantity) {
      return h.response({
        status: 'fail',
        message: 'Stok tidak mencukupi'
      }).code(400);
    }

    // Check if item already exists in cart
    const existingCartItem = await Cart.findOne({
      where: { user_id: userId, item_id }
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (item.stok < newQuantity) {
        return h.response({
          status: 'fail',
          message: 'Stok tidak mencukupi'
        }).code(400);
      }

      await existingCartItem.update({ quantity: newQuantity });

      return h.response({
        status: 'success',
        message: 'Item berhasil ditambahkan ke cart',
        data: { cartItem: existingCartItem }
      }).code(200);
    } else {
      // Create new cart item
      const newCartItem = await Cart.create({
        user_id: userId,
        item_id,
        quantity
      });

      return h.response({
        status: 'success',
        message: 'Item berhasil ditambahkan ke cart',
        data: { cartItem: newCartItem }
      }).code(201);
    }
  } catch (error) {
    console.error('Error di CartController.store:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const update = async (request, h) => {
  try {
    const { id } = request.params;
    const { quantity } = request.payload;
    const userId = request.auth.credentials.userId;

    const cartItem = await Cart.findOne({
      where: { id, user_id: userId },
      include: [{
        model: Item,
        as: 'item'
      }]
    });

    if (!cartItem) {
      return h.response({
        status: 'fail',
        message: 'Item cart tidak ditemukan'
      }).code(404);
    }

    // Check if item has enough stock
    if (cartItem.item.stok < quantity) {
      return h.response({
        status: 'fail',
        message: 'Stok tidak mencukupi'
      }).code(400);
    }

    await cartItem.update({ quantity });

    return h.response({
      status: 'success',
      message: 'Quantity cart berhasil diperbarui',
      data: { cartItem }
    }).code(200);
  } catch (error) {
    console.error('Error di CartController.update:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const destroy = async (request, h) => {
  try {
    const { id } = request.params;
    const userId = request.auth.credentials.userId;

    const cartItem = await Cart.findOne({
      where: { id, user_id: userId }
    });

    if (!cartItem) {
      return h.response({
        status: 'fail',
        message: 'Item cart tidak ditemukan'
      }).code(404);
    }

    await cartItem.destroy();

    return h.response({
      status: 'success',
      message: 'Item berhasil dihapus dari cart'
    }).code(200);
  } catch (error) {
    console.error('Error di CartController.destroy:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const clear = async (request, h) => {
  try {
    const userId = request.auth.credentials.userId;

    await Cart.destroy({
      where: { user_id: userId }
    });

    return h.response({
      status: 'success',
      message: 'Cart berhasil dikosongkan'
    }).code(200);
  } catch (error) {
    console.error('Error di CartController.clear:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

module.exports = {
  index,
  store,
  update,
  destroy,
  clear
};
