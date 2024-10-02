const express = require('express');
const router = express.Router();
const { uploadProduct } = require('../config/multer'); // Asegúrate de que esto sea correcto
const productsController = require('../controllers/productsController');

router.get('/', productsController.getAllProducts); // Obtener todos los productos
router.get('/create', productsController.showCreateProductForm); // Mostrar formulario de creación
router.post('/', uploadProduct.single('image'), productsController.createProduct); // Crear producto con imagen
router.get('/:id', productsController.getProductById); // Obtener producto por ID
router.get('/edit/:id', productsController.showEditProductForm); // Mostrar formulario de edición
router.put('/:id', uploadProduct.single('image'), productsController.updateProduct); // Actualizar producto con imagen
router.delete('/:id', productsController.deleteProduct); // Eliminar producto

module.exports = router;
