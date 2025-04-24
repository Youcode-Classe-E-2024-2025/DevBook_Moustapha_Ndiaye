'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [ 
      { name: 'Informatique', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Littérature', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Science', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Histoire', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Développement personnel', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};