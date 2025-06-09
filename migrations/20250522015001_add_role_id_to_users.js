'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'role_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 2,
      references: {
        model: 'user_roles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'role_id');
  }
};
