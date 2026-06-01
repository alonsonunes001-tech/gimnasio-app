const sequelize = require('../config/database');
const Socio = require('./Socio');
const Plan = require('./Plan');

Socio.belongsTo(Plan, { foreignKey: 'planId', as: 'plan' });
Plan.hasMany(Socio, { foreignKey: 'planId', as: 'socios' });

module.exports = { sequelize, Socio, Plan };