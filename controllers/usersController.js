const User = require('../database/models/user');
const bcrypt = require('bcrypt');

// Mostrar el formulario de registro
exports.getRegisterForm = (req, res) => {
    try {
        res.render('users/register'); 
    } catch (error) {
        console.error('Error al obtener el formulario de registro:', error);
        res.status(500).send('Error al obtener el formulario de registro');
    }
};

// Manejar el registro de usuarios
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const profileImage = req.file ? req.file.path : null;
        const user = await User.create({ name, email, password: hashedPassword, profileImage });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send('Error al registrar el usuario');
    }
};

// Mostrar el formulario de inicio de sesión
exports.getLoginForm = (req, res) => {
    try {
        res.render('users/login'); // Asegúrate de que esta vista exista
    } catch (error) {
        console.error('Error al obtener el formulario de inicio de sesión:', error);
        res.status(500).send('Error al obtener el formulario de inicio de sesión');
    }
};

// Manejar el inicio de sesión de usuarios
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Contraseña incorrecta');
        }
        req.session.user = user; // Guarda el usuario en la sesión
        res.redirect('/users/profile');
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
};

// Mostrar el perfil del usuario
exports.getProfile = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    try {
        res.render('profile', { user: req.session.user }); // Asegúrate de que esta vista exista
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).send('Error al obtener el perfil del usuario');
    }
};

// Leer Detalle de Usuario (CRUD)
exports.userDetail = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.json(user);
    } catch (error) {
        console.error('Error al obtener detalles del usuario:', error);
        res.status(500).send('Error al obtener detalles del usuario');
    }
};

// Actualizar Usuario (CRUD)
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        const { name, email, password } = req.body;
        const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
        await user.update({ name, email, password: hashedPassword });
        res.json(user);
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).send('Error al actualizar el usuario');
    }
};
