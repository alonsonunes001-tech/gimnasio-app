const sequelize = require('../config/database');
const Socio = require('./Socio');
const Plan = require('./Plan');
const Clase = require('./Clase');
const Membresia = require('./Membresia');

Socio.belongsTo(Plan, { foreignKey: 'planId', as: 'plan' });
Plan.hasMany(Socio, { foreignKey: 'planId', as: 'socios' });
Socio.hasMany(Membresia, { foreignKey: 'socioId', as: 'membresias' });
Membresia.belongsTo(Socio, { foreignKey: 'socioId', as: 'socio' });

module.exports = { sequelize, Socio, Plan, Clase, Membresia };