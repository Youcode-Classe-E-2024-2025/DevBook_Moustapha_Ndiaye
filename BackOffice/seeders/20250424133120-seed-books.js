'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('books', [
      { title: 'Clean Code', author: 'Robert C. Martin', category_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { title: 'The Pragmatic Programmer', author: 'Andrew Hunt, David Thomas', category_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { title: 'You Don\'t Know JS: Scope & Closures', author: 'Kyle Simpson', category_id: 1, createdAt: new Date(), updatedAt: new Date() }, 
      { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', category_id: 1, createdAt: new Date(), updatedAt: new Date() }, 
      { title: 'Design Patterns', author: 'Erich Gamma et al.', category_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', category_id: 1, createdAt: new Date(), updatedAt: new Date() }, 
      { title: 'Refactoring', author: 'Martin Fowler', category_id: 1, createdAt: new Date(), updatedAt: new Date() }, 
      { title: 'Laravel Up & Running', author: 'Matt Stauffer', category_id: 1, createdAt: new Date(), updatedAt: new Date() }, 
      { title: 'Vue.js Up and Running', author: 'Callum Macrae', category_id: 1, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Node.js Design Patterns', author: 'Mario Casciaro', category_id: 1, createdAt: new Date(), updatedAt: new Date() } 
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('books', {
      title: [
        'Clean Code', 'The Pragmatic Programmer', 'You Don\'t Know JS: Scope & Closures',
        'Eloquent JavaScript', 'Design Patterns', 'JavaScript: The Good Parts',
        'Refactoring', 'Laravel Up & Running', 'Vue.js Up and Running',
        'Node.js Design Patterns'
      ]
    }, {});
  }
};