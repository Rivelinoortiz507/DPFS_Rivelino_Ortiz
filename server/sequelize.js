const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('booksdb', 'root', '2751356junior', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexión con la base de datos establecida con éxito.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

// Importa los modelos
const Product = require('./database/models/product')(sequelize, Sequelize.DataTypes);
const Category = require('./database/models/category')(sequelize, Sequelize.DataTypes);
const User = require('./database/models/user')(sequelize, Sequelize.DataTypes);

// Asocia los modelos
Product.associate({ Category });
Category.associate({ Product });

module.exports = { sequelize, Product, Category, User };
