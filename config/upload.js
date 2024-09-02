const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images')); // Carpeta para almacenar las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix); // Nombra el archivo con la fecha actual y la extensión original
  }
});

// Filtros para permitir solo ciertos tipos de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

// Inicializa Multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
