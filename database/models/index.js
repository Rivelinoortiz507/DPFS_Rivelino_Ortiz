// database/index.js
const Sequelize = require('sequelize');
const config = require('./config/config');
const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Product = require('./models/product')(sequelize, Sequelize.DataTypes);
db.User = require('./models/user')(sequelize, Sequelize.DataTypes);

module.exports = db;
