const express = require('express');
const router = express.Router();
const { listCategories } = require('../controllers/categoriesController'); 

// Ruta para obtener categorías en formato JSON
router.get('/', listCategories); // Usa '/' para que la ruta sea /api/categories

module.exports = router;
