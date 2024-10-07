const { User } = require('../sequelize');
const bcrypt = require('bcrypt');

// Mostrar el formulario de registro
exports.getRegisterForm = (req, res) => {
    res.render('users/register', {
        error: req.query.error || null,  // Proporciona un valor por defecto
        success: req.query.success || null // Proporciona un valor por defecto
    });
};

// Manejar el registro de usuario
exports.register = async (req, res) => {
    const { name, email, password, country, age } = req.body;
    const profileImage = req.file ? req.file.filename : null; // Manejo de imagen

    try {
        // Validación básica para la edad
        if (!age || isNaN(age) || age < 0 || age > 120) {
            return res.render('users/register', {
                error: 'invalid_age', // Mensaje de error por edad no válida
                success: null // No hay éxito
            });
        }

        // Verifica si el email ya existe
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.render('users/register', {
                error: 'email_taken', // Mensaje de error específico
                success: null // No hay éxito
            });
        }

        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de saltos

        // Crear el nuevo usuario
        await User.create({
            name,
            email,
            password: hashedPassword, // Guarda la contraseña encriptada
            country,
            age: parseInt(age, 10), // Asegúrate de que la edad sea un número
            profileImageUrl: profileImage // Guardar la URL de la imagen
        });

        // Redirigir al formulario de registro con un mensaje de éxito
        res.render('users/register', {
            success: 'registration', // Mensaje de éxito
            error: null // No hay error
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.render('users/register', {
            error: 'registration_failed', // Mensaje de error genérico
            success: null // No hay éxito
        });
    }
};

// Mostrar el formulario de login sin errores
exports.getLoginForm = (req, res) => {
    res.render('users/login', { errorMessage: null, email: '' });
};

// Manejar el login de usuario
exports.loginUser = async (req, res) => {
    const { email, password, rememberMe } = req.body; // Incluye rememberMe

    try {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            // Mensaje genérico para ambos casos
            return res.render('users/login', { 
                errorMessage: 'Credenciales incorrectas', 
                email // Mantiene el email ingresado
            });
        }

        // Autenticación exitosa
        req.session.userId = user.id; // Guardar el ID del usuario en la sesión

        // Establecer cookie si "Recordarme" está seleccionado
        if (rememberMe) {
            res.cookie('userId', user.id, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true }); 
        }

        res.redirect('/users/profile'); // Redirigir al perfil
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.render('users/login', { 
            errorMessage: 'Error en el servidor',
            email // Mantiene el email ingresado
        });
    }
};


// Método para obtener el perfil del usuario
exports.getProfile = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/users/login'); // Redirigir al login si no está autenticado
        }

        const user = await User.findByPk(req.session.userId);

        if (!user) {
            return res.redirect('/users/login'); // Redirigir al login si el usuario no se encuentra
        }

        res.render('users/profile', { user }); // Renderiza la vista de perfil
    } catch (error) {
        console.error('Error al mostrar perfil:', error);
        res.redirect('/users/login'); // Redirigir al login en caso de error
    }
};

// Método para mostrar el formulario de actualización del perfil
exports.getUpdateProfileForm = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/users/login'); // Redirigir al login si no está autenticado
        }

        const user = await User.findByPk(req.session.userId);

        if (!user) {
            return res.redirect('/users/login'); // Redirigir al login si el usuario no se encuentra
        }

        res.render('users/updateProfile', { user }); // Renderiza la vista de actualización de perfil
    } catch (error) {
        console.error('Error al mostrar el formulario de actualización:', error);
        res.redirect('/users/login'); // Redirigir al login en caso de error
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

        await user.save(); // Guarda los cambios en la base de datos

        req.flash('success', 'Perfil actualizado con éxito');
        res.redirect('/users/profile'); // Redirige a la página de perfil después de la actualización
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
        res.send('Sesión cerrada con éxito'); 
    });
};
