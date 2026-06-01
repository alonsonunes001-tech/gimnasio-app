const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Socio = sequelize.define('Socio', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rut: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING,
  },
  fechaInscripcion: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  planId: {
    type: DataTypes.INTEGER,
  },
});

module.exports = Socio;