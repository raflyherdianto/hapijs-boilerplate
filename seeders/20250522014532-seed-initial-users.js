'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password456', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    await queryInterface.bulkInsert('users', [{
      nama_lengkap: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role_id: 1, // admin
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nama_lengkap: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword1,
      role_id: 2, // customer
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nama_lengkap: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: hashedPassword2,
      role_id: 2, // customer
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
