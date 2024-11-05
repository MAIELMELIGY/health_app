const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Visit = require('./visit');

const Treatment = sequelize.define('Treatment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  visitId: { type: DataTypes.INTEGER, references: { model: Visit, key: 'id' } },
  description: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.FLOAT, allowNull: false },
});

Visit.hasMany(Treatment, { foreignKey: 'visitId' });
Treatment.belongsTo(Visit, { foreignKey: 'visitId' });

module.exports = Treatment;
