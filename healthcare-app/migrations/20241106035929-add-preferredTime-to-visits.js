// migrations/20241106012345-add-preferredTime-to-visits.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Visits', 'preferredTime', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Visits', 'preferredTime');
  }
};

