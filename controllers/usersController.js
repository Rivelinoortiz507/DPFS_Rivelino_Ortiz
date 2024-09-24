const User = require('../database/models/user');
const bcrypt = require('bcrypt');

// Mostrar el formulario de registro
exports.getRegisterForm = (req, res) => {
    res.render('users/register', {
      error: req.query.error,
      success: req.query.success
    });
  };

 // Manejar el registro de usuario
exports.registerUser = async (req, res) => {
  const { name, email, password, country } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  try {
    // Verificar si el email ya está registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.redirect('/users/register?error=email_taken');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    await User.create({
      name,
      email,
      password: hashedPassword,
      country,
      profileImage
    });

    res.redirect('/users/register?success=registration');
  } catch (error) {
    console.error(error);
    res.redirect('/users/register?error=registration_failed');
  }
};
// Mostrar el formulario de inicio de sesión
exports.getLoginForm = (req, res) => {
    try {
        res.render('users/login');
    } catch (error) {
        console.error('Error al obtener el formulario de inicio de sesión:', error);
        res.status(500).send('Error al obtener el formulario de inicio de sesión');
    }
};

// Manejar el inicio de sesión de usuarios
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Buscar usuario por email
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        // Usuario no encontrado
        return res.render('users/login', { error: 'Usuario no encontrado' });
      }
  
      // Comparar contraseñas
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        // Contraseña incorrecta
        return res.render('users/login', { error: 'Contraseña incorrecta' });
      }
  
      // Autenticación exitosa
      req.session.userId = user.id; // Guardar el ID del usuario en la sesión
      res.redirect('/users/profile'); // Redirigir al perfil
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.render('users/login', { error: 'Error en el servidor' });
    }
  };

// Mostrar el perfil del usuario

exports.getProfile = async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.redirect('/users/login'); // Redirigir al login si no está autenticado
      }
  
      const user = await User.findByPk(req.session.userId);
  
      if (!user) {
        return res.redirect('/users/login'); // Redirigir al login si el usuario no se encuentra
      }
  
      res.render('users/profile', { user });
    } catch (error) {
      console.error('Error al mostrar perfil:', error);
      res.redirect('/users/login'); // Redirigir al login en caso de error
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

