const express = require('express');
const router = express.Router();
const { Category } = require('../database/models');

// Ruta que maneja la API y el renderizado
router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll(); // Obtener todas las categorías desde la base de datos

        // Verifica si es una solicitud AJAX (XHR) o si se espera un JSON
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json(categories); // Devuelve JSON para solicitudes API
        }

        // Si no es una solicitud AJAX, renderiza la vista
        res.render('products/categories', { categories });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).send('Error al cargar las categorías');
    }
});

module.exports = router;
