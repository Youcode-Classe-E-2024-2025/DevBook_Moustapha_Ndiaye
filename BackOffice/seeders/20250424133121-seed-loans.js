'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('loans', [
      {
        book_id: 1, 
        member_id: 2, 
        date_borrowed: '2025-04-10',
        date_returned: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        book_id: 3, 
        member_id: 3, 
        date_borrowed: '2025-04-01',
        date_returned: '2025-04-15',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('loans', {
      book_id: [1, 3], 
      member_id: [2, 3] 
    }, {});
  }
};