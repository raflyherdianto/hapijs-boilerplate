'use strict';

const { User, UserRole } = require('../models');
const bcrypt = require('bcryptjs');

const index = async (request, h) => {
  try {
    const users = await User.findAll({
      include: [{
        model: UserRole,
        as: 'role'
      }],
      attributes: { exclude: ['password'] }
    });

    return h.response({
      status: 'success',
      message: 'Data users berhasil diambil',
      data: { users }
    }).code(200);
  } catch (error) {
    console.error('Error di UserController.index:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const store = async (request, h) => {
  try {
    const { nama_lengkap, email, password, role_id } = request.payload;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return h.response({
        status: 'fail',
        message: 'Email sudah terdaftar'
      }).code(400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nama_lengkap,
      email,
      password: hashedPassword,
      role_id
    });

    const userResponse = { ...newUser.toJSON() };
    delete userResponse.password;

    return h.response({
      status: 'success',
      message: 'User berhasil dibuat',
      data: { user: userResponse }
    }).code(201);
  } catch (error) {
    console.error('Error di UserController.store:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const show = async (request, h) => {
  try {
    const { id } = request.params;
    const currentUserId = request.auth.credentials.userId;
    const userRole = request.auth.credentials.roleName;

    // Only allow users to view their own profile or admin to view any profile
    if (userRole !== 'admin' && parseInt(id) !== currentUserId) {
      return h.response({
        status: 'fail',
        message: 'Anda tidak memiliki izin untuk mengakses data user ini'
      }).code(403);
    }

    const user = await User.findByPk(id, {
      include: [{
        model: UserRole,
        as: 'role'
      }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return h.response({
        status: 'fail',
        message: 'User tidak ditemukan'
      }).code(404);
    }

    return h.response({
      status: 'success',
      message: 'Data user berhasil diambil',
      data: { user }
    }).code(200);
  } catch (error) {
    console.error('Error di UserController.show:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const update = async (request, h) => {
  try {
    const { id } = request.params;
    const { nama_lengkap, email, password, role_id } = request.payload;
    const currentUserId = request.auth.credentials.userId;
    const userRole = request.auth.credentials.roleName;

    // Only allow users to update their own profile or admin to update any profile
    if (userRole !== 'admin' && parseInt(id) !== currentUserId) {
      return h.response({
        status: 'fail',
        message: 'Anda tidak memiliki izin untuk mengubah data user ini'
      }).code(403);
    }

    const user = await User.findByPk(id);
    if (!user) {
      return h.response({
        status: 'fail',
        message: 'User tidak ditemukan'
      }).code(404);
    }

    const updateData = { nama_lengkap, email };
    
    // Only admin can change role
    if (userRole === 'admin' && role_id) {
      updateData.role_id = role_id;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    const updatedUser = { ...user.toJSON() };
    delete updatedUser.password;

    return h.response({
      status: 'success',
      message: 'User berhasil diperbarui',
      data: { user: updatedUser }
    }).code(200);
  } catch (error) {
    console.error('Error di UserController.update:', error);
    return h.response({
      status: 'error',
      message: 'Terjadi kesalahan internal server'
    }).code(500);
  }
};

const destroy = async (request, h) => {
  try {
    const { id } = request.params;

    const user = await User.findByPk(id);
    if (!user) {
      return h.response({
        status: 'fail',
        message: 'User tidak ditemukan'
      }).code(404);
    }

    await user.destroy();

    return h.response({
      status: 'success',
      message: 'User berhasil dihapus'
    }).code(200);
  } catch (error) {
    console.error('Error di UserController.destroy:', error);
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
