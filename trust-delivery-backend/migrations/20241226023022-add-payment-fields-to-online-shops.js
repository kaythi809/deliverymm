// migrations/YYYYMMDDHHMMSS-add-payment-fields-to-online-shops.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('OnlineShops', 'contactPersons', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.addColumn('OnlineShops', 'bankAccounts', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: []
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('OnlineShops', 'contactPersons');
    await queryInterface.removeColumn('OnlineShops', 'bankAccounts');
  }
};
