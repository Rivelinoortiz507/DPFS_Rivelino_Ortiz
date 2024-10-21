const express = require('express');
const router = express.Router();
const { uploadProfile } = require('../../config/multer'); // Asegúrate de que la ruta sea correcta
const usersController = require('../../controllers/usersController'); 

// Mostrar formulario de registro
router.get('/register', usersController.getRegisterForm); 

// Registrar un usuario
router.post('/register', uploadProfile.single('profileImage'), usersController.register); 

// Mostrar formulario de inicio de sesión
router.get('/login', usersController.getLoginForm);

// Iniciar sesión
router.post('/login', usersController.loginUser);

// Obtener perfil del usuario
router.get('/profile', usersController.getProfile);

// Cerrar sesión
router.post('/logout', usersController.logout);

module.exports = router;
