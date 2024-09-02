const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

let productController = require('../controllers/productController');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Ruta para mostrar el formulario de creación de producto
router.get('/create', (req, res) => {
  res.render('products/create-product');
});

// Ruta para el listado de productos
router.get('/', productController.listProducts);

// Ruta para detalles de producto
router.get('/:id', productController.productDetail);

// Ruta POST para manejar la creación de un nuevo producto
router.post('/', upload.single('image'), (req, res) => {
  const { name, description, category, price } = req.body; // Datos del formulario
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Ruta de la imagen subida

  const productsPath = path.join(__dirname, '../data/products.json');
  let products = [];

  if (fs.existsSync(productsPath)) {
    products = JSON.parse(fs.readFileSync(productsPath, 'utf-8')); // Leer productos existentes
  }

  // Crear un nuevo producto con los datos del formulario
  const newProduct = {
    id: products.length + 1, // Asignar un ID único
    name,
    description,
    category,
    price,
    imageUrl
  };

  products.push(newProduct); // Añadir el nuevo producto a la lista

  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8'); // Guardar los cambios

  res.redirect('/products'); // Redirigir a la lista de productos
});

// Ruta para mostrar el formulario de edición de productos
router.get('/edit/:id', (req, res) => {
  const filePath = path.join(__dirname, '../data/products.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');
    const products = JSON.parse(data);
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Product not found');
    res.render('products/edit-product', { product });
  });
});

// Ruta para manejar la edición de productos
router.put('/:id', upload.single('image'), (req, res) => {
  const filePath = path.join(__dirname, '../data/products.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading file');
    }

    let products = JSON.parse(data);
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).send('Product not found');

    // Obtener la URL de la nueva imagen si se ha subido un archivo
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : products[productIndex].imageUrl;

    // Crear el objeto del producto actualizado
    const updatedProduct = {
      id: parseInt(req.params.id),
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      imageUrl: imageUrl
    };

    // Actualizar el producto en el array
    products[productIndex] = updatedProduct;

    // Guardar los cambios en el archivo JSON
    fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error writing file');
      }
      res.redirect('/products/'); // Redirigir al listado de productos
    });
  });
});

// Ruta para manejar la eliminación de productos
router.delete('/:id', (req, res) => {
  const filePath = path.join(__dirname, '../data/products.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading file');
    }

    let products = JSON.parse(data);
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) return res.status(404).send('Product not found');

    // Eliminar el producto del array
    products.splice(productIndex, 1);

    // Guardar los cambios en el archivo JSON
    fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error writing file');
      }
      res.redirect('/products'); // Redirigir al listado de productos después de eliminar
    });
  });
});


module.exports = router;
