const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Visit = sequelize.define('Visit', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  doctorId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  status: { type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'), defaultValue: 'Pending' },
  totalAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
});

User.hasMany(Visit, { foreignKey: 'patientId' });
User.hasMany(Visit, { foreignKey: 'doctorId' });
Visit.belongsTo(User, { as: 'Patient', foreignKey: 'patientId' });
Visit.belongsTo(User, { as: 'Doctor', foreignKey: 'doctorId' });

module.exports = Visit;
