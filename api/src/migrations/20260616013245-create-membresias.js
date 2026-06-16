'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('membresias', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      socioId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Socios', key: 'id' } },
      tipo: { type: Sequelize.STRING, allowNull: false },
      fechaInicio: { type: Sequelize.DATEONLY, allowNull: false },
      fechaVencimiento: { type: Sequelize.DATEONLY, allowNull: false },
      precio: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      activo: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('membresias');
  }
};