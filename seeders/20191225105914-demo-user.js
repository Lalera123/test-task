'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      username: 'serious_business',
      password: '$2b$10$i5EQ9aM7KDwHvecbCTrFUezjtp7LIRUrT3vsYJrtx0JSohQsVA5/i',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};