'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaction_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'transactions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'items',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      jumlah: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      harga_satuan: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaction_details');
  }
};
