'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
      book_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(255), 
        allowNull: false
      },
      author: {
        type: Sequelize.STRING(255), 
        allowNull: true 
      },
     
      isbn: { 
        field: 'ISBN', 
        type: Sequelize.STRING(20), 
        unique: true,
        allowNull: true 
      },
      published_year: {
        type: Sequelize.INTEGER, 
        allowNull: true
      },
      available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false 
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories', 
          key: 'category_id'   
        },
        onDelete: 'SET NULL', 
        onUpdate: 'CASCADE'   
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
    await queryInterface.dropTable('books');
  }
};