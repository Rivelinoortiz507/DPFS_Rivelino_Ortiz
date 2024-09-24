const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const upload = require('../../config/upload'); 

// Ruta para mostrar el formulario de registro
router.get('/', usersController.getRegisterForm);

// Ruta para manejar el registro de usuarios
router.post('/register', upload.single('profileImage'), usersController.registerUser);

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', usersController.getLoginForm);

// Ruta para manejar el inicio de sesión de usuarios
router.post('/login', usersController.loginUser);

// Ruta para mostrar el perfil del usuario
router.get('/profile', usersController.getProfile);

// Ruta para manejar el cierre de sesión del usuario
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión.');
        }
        res.redirect('/auth/login'); // Redirige al formulario de inicio de sesión después de cerrar sesión
    });
});

module.exports = router;
