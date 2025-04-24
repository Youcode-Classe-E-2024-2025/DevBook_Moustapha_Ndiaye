'use strict';

const sequelize = require('../config/database');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
      'users', {
        user_id : {
          allowNull : false, 
          autoIncrement : true, 
          primaryKey : true, 
          type : Sequelize.INTEGER
        },
        name : {
          type : Sequelize.STRING(100),
          allowNull : false
        },
        email : {
          type : Sequelize.STRING(100),
          unique : true, 
          allowNull : false
        },
        password : {
          allowNull : false, 
          type : Sequelize.STRING(255)
        },
        role : {
          type : Sequelize.ENUM('admin', 'member'),
          defaultValue : 'member',
          allowNull : false
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
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
