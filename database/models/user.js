const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize'); // Ajusta la ruta a sequelize.js

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
