const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento para imágenes de productos
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images/products')); // Carpeta para imágenes de productos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext); // Nombre único basado en la fecha y un número aleatorio
  }
});

// Configuración de almacenamiento para imágenes de perfil
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images/profiles')); // Carpeta para imágenes de perfil
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext); // Nombre único basado en la fecha y un número aleatorio
  }
});

// Inicializa multer para productos y perfiles
const uploadProduct = multer({ storage: productStorage });
const uploadProfile = multer({ storage: profileStorage });

module.exports = { uploadProduct, uploadProfile };
