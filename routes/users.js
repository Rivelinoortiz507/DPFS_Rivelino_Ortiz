const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const upload = require('../config/upload'); // Asegúrate de que la ruta sea correcta

// Registro de Usuario
router.get('/register', usersController.getRegisterForm);
router.post('/register', upload.single('profileImage'), usersController.registerUser);

// Login de Usuario
router.get('/login', usersController.getLoginForm);
router.post('/login', usersController.loginUser);

// Perfil del Usuario
router.get('/profile', usersController.getProfile);

// Cierre de Sesión
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Error al cerrar sesión.');
      }
      res.redirect('/users/login');
    });
});

module.exports = router;
