const express = require('express');
const router = express.Router();

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('users/login'); // Renderiza login.ejs
});

module.exports = router;
