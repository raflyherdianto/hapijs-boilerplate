'use strict';

const jwt = require('jsonwebtoken');
const { User, UserRole, BlacklistedToken } = require('../models');

const authenticate = async (request, h) => {
  try {
    const authorization = request.headers.authorization;
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return h.response({
        status: 'fail',
        message: 'Token tidak ditemukan'
      }).code(401).takeover();
    }

    const token = authorization.substring(7);
    
    // Check if token is blacklisted
    const blacklistedToken = await BlacklistedToken.findOne({
      where: { token }
    });

    if (blacklistedToken) {
      return h.response({
        status: 'fail',
        message: 'Token sudah tidak valid (logout)'
      }).code(401).takeover();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');
    
    const user = await User.findByPk(decoded.userId, {
      include: [{
        model: UserRole,
        as: 'role'
      }]
    });

    if (!user) {
      return h.response({
        status: 'fail',
        message: 'User tidak ditemukan'
      }).code(401).takeover();
    }

    request.auth = {
      isAuthenticated: true,
      credentials: {
        user,
        userId: user.id,
        roleId: user.role_id,
        roleName: user.role?.nama_role
      }
    };

    return h.continue;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return h.response({
        status: 'fail',
        message: 'Token sudah kadaluwarsa'
      }).code(401).takeover();
    }
    
    return h.response({
      status: 'fail',
      message: 'Token tidak valid'
    }).code(401).takeover();
  }
};

const authorize = (allowedRoles = []) => {
  return async (request, h) => {
    if (!request.auth || !request.auth.isAuthenticated) {
      return h.response({
        status: 'fail',
        message: 'Akses ditolak'
      }).code(403).takeover();
    }

    const userRole = request.auth.credentials.roleName;
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return h.response({
        status: 'fail',
        message: 'Anda tidak memiliki izin untuk mengakses resource ini'
      }).code(403).takeover();
    }

    return h.continue;
  };
};

module.exports = {
  authenticate,
  authorize
};
