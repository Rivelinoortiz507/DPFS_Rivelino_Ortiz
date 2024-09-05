const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController'); 
const upload = require('../config/upload'); 

router.get('/', productsController.getAllProducts);         
router.get('/create', productsController.showCreateProductForm); 
router.post('/', upload.single('image'), productsController.createProduct);     
router.get('/:id', productsController.getProductById);       
router.get('/edit/:id', productsController.showEditProductForm); 
router.put('/:id', upload.single('image'), productsController.updateProduct);
router.post('/:id/edit', productsController.updateProduct); 
router.delete('/:id', productsController.deleteProduct);
router.get('/search', productsController.searchProducts);

module.exports = router;
