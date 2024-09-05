const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();

// Configuración de Sequelize
const sequelize = new Sequelize('mysql://user:password@localhost:3306/database_name', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false 
});

// Definición de modelos
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración de Multer para la subida de archivos
const upload = multer({ dest: 'uploads/' });
app.use(upload.single('profileImage'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Sincronización de la base de datos
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables updated!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

// Configuración del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
