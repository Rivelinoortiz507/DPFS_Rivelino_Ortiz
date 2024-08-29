const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


// Ruta para el listado de productos
router.get('/', productController.listProducts);
// Ruta para detalles de producto
router.get('/:id', productController.productDetail);

 
module.exports = router;
