const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('booksdb', 'root', '2751356junior', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false // Opcional, puedes activarlo si deseas ver las consultas SQL
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexión con la base de datos establecida con éxito.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

module.exports = sequelize;
