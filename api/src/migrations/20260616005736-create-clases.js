'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clases', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: Sequelize.STRING, allowNull: false },
      instructor: { type: Sequelize.STRING, allowNull: false },
      horario: { type: Sequelize.STRING, allowNull: false },
      capacidad: { type: Sequelize.INTEGER, allowNull: false },
      inscritos: { type: Sequelize.INTEGER, defaultValue: 0 },
      dia: { type: Sequelize.STRING, allowNull: false },
      activo: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('clases');
  }
};