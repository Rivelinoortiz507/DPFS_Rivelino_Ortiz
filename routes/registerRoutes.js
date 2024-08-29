const express = require('express');
const router = express.Router();

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
    res.render('users/register'); // Renderiza register.ejs
});

// Ruta para manejar el envío del formulario de registro
router.post('/register', (req, res) => {
    const { username, password, email } = req.body;

    // Lógica para registrar al usuario (aquí solo se muestra un mensaje por simplicidad)
    res.send(`Registro exitoso para ${username}`);
});

module.exports = router;
    