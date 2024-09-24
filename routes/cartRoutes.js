const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Ruta para mostrar el carrito
router.get('/', cartController.showCart);

// Ruta para añadir producto al carrito
router.post('/add', cartController.addToCart);

// Ruta para eliminar producto del carrito
router.post('/remove', cartController.removeFromCart);

// Ruta para vaciar el carrito
router.post('/clear', cartController.clearCart);

module.exports = router;
