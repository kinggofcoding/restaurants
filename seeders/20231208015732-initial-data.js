'use strict'
const restaurants = require('./public/jsons/restaurant.json').results
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Todos',
      restaurants.map((restaurant) =>
        ({
          name: `todo-${i}`,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      )
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Todos', null)
  }
}