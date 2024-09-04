const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController'); 

// Ruta para mostrar el formulario de registro
router.get('/register', usersController.getRegisterForm);

// Ruta para manejar el registro de usuario
router.post('/register', usersController.registerUser);

// Ruta para mostrar el formulario de login
router.get('/login', usersController.getLoginForm);

// Ruta para manejar el login de usuario
router.post('/login', usersController.loginUser);

// Ruta para mostrar el perfil del usuario (debería estar protegida)
router.get('/profile', (req, res, next) => {
  if (req.session.user) {
    usersController.getProfile(req, res, next);
  } else {
    res.redirect('/users/login');
  }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión.');
    }
    res.redirect('/users/login');
  });
});

module.exports = router;
