'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const saltRounds = 10;

    const hashedPasswordAdmin = await bcrypt.hash('admin123', saltRounds);
    const hashedPasswordBob = await bcrypt.hash('bob123', saltRounds);
    const hashedPasswordCharlie = await bcrypt.hash('charlie123', saltRounds);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Alice Admin',
        email: 'alice.admin@example.com',
        password: hashedPasswordAdmin,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bob Membre',
        email: 'bob.membre@example.com',
        password: hashedPasswordBob,  
        role: 'member',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Charlie Membre',
        email: 'charlie.membre@example.com',
        password: hashedPasswordCharlie, 
        role: 'member',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: [
        'alice.admin@example.com',
        'bob.membre@example.com',
        'charlie.membre@example.com'
      ]
    }, {});
  }
};