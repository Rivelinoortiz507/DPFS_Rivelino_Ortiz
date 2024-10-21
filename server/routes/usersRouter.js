const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { uploadProfile } = require('../config/multer'); 
const { isAuthenticated, isGuest } = require('../middlewares/authMiddleware');

// Ruta para mostrar el formulario de login (huéspedes)
router.get('/login', isGuest, usersController.getLoginForm);

// Ruta para manejar el login de usuario
router.post('/login', usersController.loginUser);

// Ruta para mostrar el formulario de registro (huéspedes)
router.get('/register', isGuest, usersController.getRegisterForm);

// Ruta para manejar el registro de usuario
router.post('/register', uploadProfile.single('profileImage'), usersController.register);

// Ruta para mostrar el perfil del usuario (usuarios autenticados)
router.get('/profile', isAuthenticated, usersController.getProfile);

router.get('/update', isAuthenticated, usersController.getUpdateProfileForm);

// Ruta para manejar la actualización del perfil
router.post('/update', isAuthenticated, usersController.updateProfile);

// Ruta para manejar el cierre de sesión
router.post('/logout', usersController.logout);


module.exports = router;
