const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// Ruta para obtener y renderizar la lista de productos
router.get('/products', productsController.fetchAllProducts); // Actualizamos el nombre de la función

// Ruta para obtener y renderizar los detalles de un producto específico
router.get('/products/:id', productsController.getProductDetails);

module.exports = router;
