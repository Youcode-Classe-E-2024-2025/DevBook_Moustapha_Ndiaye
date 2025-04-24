'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loans', {
      loan_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'books',     
          key: 'book_id'     
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'
      },
      member_id: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',     
          key: 'user_id'      
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'
      },
      date_borrowed: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      date_returned: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('loans');
  }
};