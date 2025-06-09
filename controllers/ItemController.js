'use strict';

const { Item } = require('../models');

const index = async (request, h) => {
  try {
    const items = await Item.findAll({
      order: [['created_at', 'DESC']]
    });

    return h.response({
      status: 'success',
      message: 'Data items berhasil diambil',
      data: { items }
    }).code(200);
  } catch (error) {
    console.error('Error di ItemController.index:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const store = async (request, h) => {
  try {
    const { nama_item, deskripsi, harga, stok, kategori } = request.payload;

    const newItem = await Item.create({
      nama_item,
      deskripsi,
      harga,
      stok,
      kategori
    });

    return h.response({
      status: 'success',
      message: 'Item berhasil dibuat',
      data: { item: newItem }
    }).code(201);
  } catch (error) {
    console.error('Error di ItemController.store:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const show = async (request, h) => {
  try {
    const { id } = request.params;

    const item = await Item.findByPk(id);

    if (!item) {
      return h.response({
        status: 'fail',
        message: 'Item tidak ditemukan'
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Data item berhasil diambil',
      data: { item }
    }).code(200);
  } catch (error) {
    console.error('Error di ItemController.show:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const update = async (request, h) => {
  try {
    const { id } = request.params;
    const { nama_item, deskripsi, harga, stok, kategori } = request.payload;

    const item = await Item.findByPk(id);
    if (!item) {
      return h.response({
        status: 'fail',
        message: 'Item tidak ditemukan'
      }).code(404);
    }

    await item.update({
      nama_item,
      deskripsi,
      harga,
      stok,
      kategori
    });

    return h.response({
      status: 'success',
      message: 'Item berhasil diperbarui',
      data: { item }
    }).code(200);
  } catch (error) {
    console.error('Error di ItemController.update:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const destroy = async (request, h) => {
  try {
    const { id } = request.params;

    const item = await Item.findByPk(id);
    if (!item) {
      return h.response({
        status: 'fail',
        message: 'Item tidak ditemukan'
      }).code(404);
    }

    await item.destroy();

    return h.response({
      status: 'success',
      message: 'Item berhasil dihapus'
    }).code(200);
  } catch (error) {
    console.error('Error di ItemController.destroy:', error);
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
  update,
  destroy
};
