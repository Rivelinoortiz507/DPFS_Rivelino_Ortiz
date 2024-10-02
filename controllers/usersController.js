const { User } = require('../sequelize'); 
const bcrypt = require('bcrypt');

// Mostrar el formulario de registro
exports.getRegisterForm = (req, res) => {
    res.render('users/register', {
      error: req.query.error,
      success: req.query.success
    });
  };

 // Manejar el registro de usuario
 exports.register = async (req, res) => {
  const { name, email, password, country } = req.body;
  const profileImage = req.file ? req.file.filename : null; // Manejo de imagen

  try {
    // Verifica si el email ya existe
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.render('users/register', {
        error: 'email_taken',
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
      profileImageUrl: profileImage // Guardar la URL de la imagen
    });

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


exports.loginUser = async (req, res) => {
  const { email, password, rememberMe } = req.body; // Incluye rememberMe

  try {
      const user = await User.findOne({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
          // Mensaje genérico para ambos casos
          return res.render('users/login', { 
              errorMessage: 'Credenciales incorrectas', 
              email: email // Enviar el email ingresado para mantenerlo en el formulario
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
          email: email // Enviar el email ingresado para mantenerlo en el formulario
      });
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

  exports.logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.status(500).send('Error al cerrar sesión');
      }
      res.send('Sesión cerrada con éxito'); 
    });
  };



