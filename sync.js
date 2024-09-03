const { sequelize } = require('./database/models'); // Ajusta la ruta según tu estructura

(async () => {
  try {
    // Sincroniza el modelo con la base de datos
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to synchronize the database:', error);
  } finally {
    process.exit();
  }
})();
