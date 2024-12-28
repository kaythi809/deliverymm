// migrations/YYYYMMDDHHMMSS-update-rider-status.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Riders', 'status', {
      type: Sequelize.ENUM('active', 'inactive'),
      defaultValue: 'active',
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Riders', 'status', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
  }
};
