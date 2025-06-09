'use strict';

const { User, UserRole, BlacklistedToken } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId, roleId) => {
  return jwt.sign(
    { userId, roleId },
    process.env.JWT_SECRET || 'defaultSecretKey',
    { expiresIn: '24h' }
  );
};

// Helper function to clean up expired blacklisted tokens
const cleanupExpiredTokens = async () => {
  try {
    const now = new Date();
    await BlacklistedToken.destroy({
      where: {
        expires_at: {
          [require('sequelize').Op.lt]: now
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
};

const register = async (request, h) => {
  try {
    const { nama_lengkap, email, password, role_id = 2 } = request.payload; // Default role_id = 2 (customer)

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
      message: 'User berhasil didaftarkan', 
      data: { user: userResponse }
    }).code(201);
  } catch (error) {
    console.error('Error di AuthController.register:', error);
    return h.response({ 
      status: 'error', 
      message: 'Terjadi kesalahan internal server' 
    }).code(500);
  }
};

const login = async (request, h) => {
  try {
    const { email, password } = request.payload;

    const user = await User.findOne({ 
      where: { email },
      include: [{
        model: UserRole,
        as: 'role'
      }]
    });

    if (!user) {
      return h.response({ 
        status: 'fail',
        message: 'Email atau password salah' 
      }).code(401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return h.response({ 
        status: 'fail',
        message: 'Email atau password salah' 
      }).code(401);
    }

    const token = generateToken(user.id, user.role_id);

    const userResponse = { ...user.toJSON() };
    delete userResponse.password;

    // Clean up expired tokens periodically (you might want to do this in a cron job instead)
    cleanupExpiredTokens();

    return h.response({ 
      status: 'success',
      message: 'Login berhasil', 
      data: { 
        user: userResponse,
        token 
      }
    }).code(200);
  } catch (error) {
    console.error('Error di AuthController.login:', error);
    return h.response({ 
      status: 'error', 
      message: 'Terjadi kesalahan internal server' 
    }).code(500);
  }
};

const logout = async (request, h) => {
  try {
    const authorization = request.headers.authorization;
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return h.response({
        status: 'fail',
        message: 'Token tidak ditemukan'
      }).code(400);
    }

    const token = authorization.substring(7);
    
    try {
      // Decode token to get expiration time
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');
      const expiresAt = new Date(decoded.exp * 1000); // Convert to milliseconds

      // Add token to blacklist
      await BlacklistedToken.create({
        token: token,
        expires_at: expiresAt
      });

      return h.response({ 
        status: 'success',
        message: 'Logout berhasil' 
      }).code(200);
    } catch (jwtError) {
      // Even if token is invalid, we can still say logout was successful
      return h.response({ 
        status: 'success',
        message: 'Logout berhasil' 
      }).code(200);
    }
  } catch (error) {
    console.error('Error di AuthController.logout:', error);
    return h.response({ 
      status: 'error', 
      message: 'Terjadi kesalahan internal server' 
    }).code(500);
  }
};

module.exports = {
  register,
  login,
  logout
};