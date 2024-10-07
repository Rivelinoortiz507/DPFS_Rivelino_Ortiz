const express = require('express');
const router = express.Router();
const { uploadProfile } = require('../config/multer'); 
const usersController = require('../controllers/usersController'); 
const { body, validationResult } = require('express-validator');

// Rutas de usuarios
router.get('/register', usersController.getRegisterForm);

// Ruta de registro de usuarios con validaciones
router.post('/register', uploadProfile.single('profileImage'), [
    body('name')
        .notEmpty().withMessage('El nombre es requerido.')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
    body('email')
        .isEmail().withMessage('Debes proporcionar un correo electrónico válido.'),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no coinciden.'); // Este mensaje aparecerá si las contraseñas no coinciden
        }
        return true;
    })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Redirige a la página de registro con errores
        return res.render('users/register', { errors: errors.array() }); // Asegúrate de enviar los errores
    }
    // Si no hay errores, llama al controlador para registrar al usuario
    usersController.register(req, res);
});

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', usersController.getLoginForm);

// Ruta de login de usuarios con validaciones
router.post('/login', [
    body('email')
        .isEmail().withMessage('Debes proporcionar un correo electrónico válido.'),
    body('password')
        .notEmpty().withMessage('La contraseña es requerida.')
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Redirige a la página de login con errores
        return res.render('login', { errors: errors.array() });
    }
    // Si no hay errores, llama al controlador para iniciar sesión
    usersController.loginUser(req, res, next);
});

// Ruta para obtener el perfil de usuario
router.get('/profile', usersController.getProfile);

// Ruta para mostrar el formulario de actualización del perfil
router.get('/update', usersController.getUpdateProfileForm);

// Actualizar el perfil
router.post('/update', usersController.updateProfile); 

// Ruta para cerrar sesión
router.post('/logout', usersController.logout);


module.exports = router;
