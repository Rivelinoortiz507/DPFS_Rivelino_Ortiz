const express = require('express');
const router = express.Router();
const { uploadProfile } = require('../config/multer'); // Importa el multer para perfiles
const usersController = require('../controllers/usersController'); 

// Rutas de usuarios
router.get('/register', usersController.getRegisterForm);
router.post('/register', uploadProfile.single('profileImage'), usersController.register); // Registrar un usuario 
router.get('/login', usersController.getLoginForm);
router.post('/login', usersController.loginUser);
router.get('/profile', usersController.getProfile);
router.post('/logout', usersController.logout);

module.exports = router;
