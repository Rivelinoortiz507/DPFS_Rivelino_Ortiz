const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');

// Ruta para mostrar el formulario de login
router.get('/', usersController.getLoginForm);

module.exports = router;
