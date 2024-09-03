const bcrypt = require('bcryptjs');
const path = require('path');
const { User } = require('../database/models'); // Asegúrate de que la ruta sea correcta

// Método para renderizar el formulario de registro
exports.getRegisterForm = (req, res) => {
  res.render('users/register');
};

// Método para manejar el registro de un usuario
exports.registerUser = async (req, res) => {
  const { name, email, password, country, conditions } = req.body;
  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

  if (!conditions) {
    return res.status(400).send('Debes aceptar las condiciones del sitio');
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send('El correo electrónico ya está en uso.');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    await User.create({
      name,
      email,
      password: hashedPassword,
      country,
      profileImage
    });

    res.redirect('/users/login');
  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).send('Error registrando usuario');
  }
};

// Método para renderizar el formulario de inicio de sesión
exports.getLoginForm = (req, res) => {
  res.render('users/login');
};

// Método para manejar el inicio de sesión de un usuario
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Por favor, completa todos los campos.');
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).send('Correo electrónico o contraseña incorrectos.');
    }

    // Comparar la contraseña proporcionada con la almacenada
    const result = await bcrypt.compare(password, user.password);

    if (result) {
      // Establecer la sesión del usuario
      req.session.user = user;
      res.redirect('/users/profile');
    } else {
      res.status(401).send('Correo electrónico o contraseña incorrectos.');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send('Error al iniciar sesión');
  }
};

// Método para renderizar el perfil del usuario
exports.getProfile = (req, res) => {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  res.render('users/profile', { user: req.session.user });
};
