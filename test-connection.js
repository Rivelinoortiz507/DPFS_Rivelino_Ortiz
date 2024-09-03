// testConnection.js
const sequelize = require('./sequelize');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('La conexión a la base de datos se ha establecido con éxito.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
