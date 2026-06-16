const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Clase = sequelize.define('Clase', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  instructor: { type: DataTypes.STRING, allowNull: false },
  horario: { type: DataTypes.STRING, allowNull: false },
  capacidad: { type: DataTypes.INTEGER, allowNull: false },
  inscritos: { type: DataTypes.INTEGER, defaultValue: 0 },
  dia: { type: DataTypes.STRING, allowNull: false },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'clases', timestamps: true });

module.exports = Clase;