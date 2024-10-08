// routes/userApi.js
const express = require('express');
const router = express.Router();
const { getAllUsers, getUserDetails } = require('../controllers/usersController');

// Endpoint para obtener la lista de todos los usuarios
router.get('/', getAllUsers);

// Endpoint para obtener los detalles de un usuario específico
router.get('/:id', getUserDetails);

module.exports = router;
