// validations/userValidations.js
const { body, validationResult } = require('express-validator');

const userValidations = {
    register: [
        body('name')
            .notEmpty().withMessage('El nombre es requerido.')
            .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
        body('email')
            .isEmail().withMessage('Debes proporcionar un correo electrónico válido.'),
        body('password')
            .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden.');
            }
            return true;
        })
    ],

    login: [
        body('email')
            .isEmail().withMessage('Debes proporcionar un correo electrónico válido.'),
        body('password')
            .notEmpty().withMessage('La contraseña es requerida.')
    ]
};

const updateProfileValidation = [
    body('name').notEmpty().withMessage('El nombre es obligatorio.'),
    body('email').isEmail().withMessage('El correo debe ser un email válido.'),
    body('country').notEmpty().withMessage('El país es obligatorio.'),
    body('age').isInt({ min: 0, max: 120 }).withMessage('La edad debe ser un número entre 0 y 120.'),
];

// Luego en las rutas
router.post('/update', isAuthenticated, updateProfileValidation, usersController.updateProfile);

module.exports = userValidations;
