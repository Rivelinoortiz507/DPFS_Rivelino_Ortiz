const { User } = require('../sequelize');
const bcrypt = require('bcrypt');

// Mostrar el formulario de registro
exports.getRegisterForm = (req, res) => {
    res.render('users/register', {
        error: req.query.error || null,
        success: req.query.success || null
    });
};

/// Manejar el registro de usuario
exports.register = async (req, res) => {
    const { name, email, password, country, age } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    try {
        // Validación básica para la edad
        if (!age || isNaN(age) || age < 0 || age > 120) {
            return res.render('users/register', {
                error: 'invalid_age',
                success: null
            });
        }

        // Verifica si el email ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('users/register', {
                error: 'email_taken',
                success: null
            });
        }

        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        await User.create({
            name,
            email,
            password: hashedPassword,
            country,
            age: parseInt(age, 10),
            profileImageUrl: profileImage
        });

        // Redirigir al formulario de login con un mensaje de éxito
        res.redirect('/users/login?success=registration'); // Agregar el mensaje de éxito como parámetro de consulta
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.render('users/register', {
            error: 'registration_failed',
            success: null
        });
    }
};

exports.getLoginForm = (req, res) => {
    res.render('users/login', {
        errorMessage: req.query.error || null, // Manejo del error aquí
        email: '',
        successMessage: req.query.success ? '¡Registro exitoso! Por favor, inicia sesión.' : null // Manejo del mensaje de éxito
    });
};
// Manejar el login de usuario
exports.loginUser = async (req, res) => {
    const { email, password, rememberMe } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('users/login', {
                errorMessage: 'Credenciales incorrectas',
                email
            });
        }

        // Autenticación exitosa
        req.session.userId = user.id;

        // Establecer cookie si "Recordarme" está seleccionado
        if (rememberMe) {
            res.cookie('userId', user.id, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        }

      // Redirigir al formulario de inicio de sesión con un mensaje de éxito
      res.redirect('/users/login?success=true');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.render('users/register', {
            error: 'registration_failed',
            success: null
        });
    }
};

// Método para obtener el perfil del usuario
exports.getProfile = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/users/login');
        }

        const user = await User.findByPk(req.session.userId);
        if (!user) {
            return res.redirect('/users/login');
        }

        res.render('users/profile', { user });
    } catch (error) {
        console.error('Error al mostrar perfil:', error);
        res.redirect('/users/login');
    }
};

// Método para mostrar el formulario de actualización del perfil
exports.getUpdateProfileForm = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/users/login');
        }

        const user = await User.findByPk(req.session.userId);
        if (!user) {
            return res.redirect('/users/login');
        }

        res.render('users/updateProfile', { user });
    } catch (error) {
        console.error('Error al mostrar el formulario de actualización:', error);
        res.redirect('/users/login');
    }
};

// Método para actualizar el perfil del usuario
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { name, email, country, age } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }

        // Actualiza los campos del usuario
        user.name = name;
        user.email = email;
        user.country = country;
        user.age = age;

        await user.save();

        req.flash('success', 'Perfil actualizado con éxito');
        res.redirect('/users/profile');
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).send('Error al actualizar el perfil');
    }
};

// Manejar el cierre de sesión
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/users/login'); // Redirigir a la página de login después de cerrar sesión
    });
};

/// Función para obtener todos los usuarios y devolver solo JSON
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'profileImageUrl'] // Campos a incluir en la respuesta
        });

        // Devuelve la lista de usuarios como JSON
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// Función para obtener los detalles de un usuario específico y devolver solo JSON
exports.getUserDetails = async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'age', 'country', 'profileImageUrl'] // Asegúrate de incluir solo los campos necesarios
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Devuelve el detalle del usuario como JSON
        res.json(user);
    } catch (error) {
        console.error('Error al obtener el detalle del usuario:', error);
        res.status(500).json({ message: 'Error al obtener el detalle del usuario' });
    }
};